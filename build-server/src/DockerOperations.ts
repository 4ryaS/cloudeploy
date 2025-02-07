import Docker from 'dockerode';
import path from 'path';
import tar from 'tar-fs';

const docker = new Docker();

async function buildImage() {
    console.log("building docker image");
    const dockerFilePath = path.resolve(__dirname, 'filesForContainer');
    return new Promise((resolve, reject) => {
        docker.buildImage(tar.pack(dockerFilePath, { entries: ["Dockerfile", "script.js", "pushToStorage.js"] }),
            { t: `cloudeploy`, dockerfile: "Dockerfile" },
            (err, stream) => {
                if (err) {
                    return reject(err);
                }
                // stream?.pipe(process.stdout, { end: true });
                stream?.on("end", () => resolve(""));
            })
    })
}

async function createAndStartContainer(repoUrl: string, id: string) {
    console.log("Creating Docker container...");

     docker.createContainer({
        Image: `cloudeploy`,
        name: "",
        Tty: true,
        AttachStderr: true,
        AttachStdout: true,
        Cmd: ["sh", "-c", `export DEPLOY_ID=${id} && git clone ${repoUrl} /home/app/output && node script.js && tail -f /dev/null`]
    }).then(container => {
        container.start().then(() => {
            console.log("starting container");
        }).catch((err) => {
            console.error(err);
        })
    }).catch((err) => {
        console.error(err);
    })
}

export async function run(repoUrl: string, deployId: string) {
    try {
        await buildImage();
        await createAndStartContainer(repoUrl, deployId);
    } catch (error) {
        console.error(error);
    }
}
