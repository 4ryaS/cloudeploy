import Docker from "dockerode";
import path from "path";
import tar from "tar-fs";

const docker = new Docker();

async function buildImage() {
    console.log("building docker image");
    const dirname = __dirname;
    const containerFilesPath = dirname.split("\\utils")[0];
    const dockerFilePath = path.resolve(containerFilesPath, 'container-files');
    return new Promise((resolve, reject) => {
        docker.buildImage(tar.pack(dockerFilePath, { entries: ["Dockerfile", "script.js", "pushToStorage.js"] })),
            { t: `cloudeploy`, dockerfile: "Dockerfile" },
            (err: any, stream: any) => {
                if (err) {
                    return reject(err);
                }
                stream?.pipe(process.stdout, { end: true });
                stream?.on("end", () => resolve(""));
            };
    });
}

async function createAndStartContainer(repoUrl: string, id: string) {
    console.log("Creating Docker container...");

    docker.createContainer({
        Image: `cloudeploy`,
        Tty: true,
        AttachStderr: true,
        AttachStdout: true,
        Env: [
            `DEPLOY_ID=${id}`,
            `GOOGLE_APPLICATION_CREDENTIALS=/key.json`
        ],
        Cmd: ["sh", "-c", `export DEPLOY_ID=${id} && git clone --depth 1 ${repoUrl} /home/app/output && node script.js`],
        HostConfig: {
            Binds: [
                `C:\\cs\\cloudeploy-904e29a16e63.json:/key.json:ro`
            ],
            AutoRemove: true
        }
    }).then(container => {
        container.start().then(() => {
            console.log("starting container");
        }).catch((err) => {
            console.error(err);
        });
    }).catch((err) => {
        console.error(err);
    });
}

export async function run(repoUrl: string, deployId: string) {
    try {
        // await buildImage();
        await createAndStartContainer(repoUrl, deployId);
    } catch (error) {
        console.error(error);
    }
}