import Docker from 'dockerode';
import path from 'path';
import tar from 'tar-fs';

const docker = new Docker();

async function buildImage(repoUrl: string) {
    console.log("building docker image");
    const dockerFilePath = path.resolve(__dirname, 'filesForContainer');
    return new Promise((resolve, reject) => {
        docker.buildImage(tar.pack(dockerFilePath, { entries: ["Dockerfile", "script.js", "pushToStorage.js"] }),
            { t: `cloudeploy`, dockerfile: "Dockerfile" },
            (err, stream) => {
                if (err) {
                    return reject(err);
                }
                stream?.pipe(process.stdout, { end: true });
                stream?.on("end", () => resolve(""));
            })
    })
}

async function createAndStartContainer(repoUrl: string, id: string) {
    console.log("Creating Docker container...");

    return docker.createContainer({
        Image: `cloudeploy`,
        name: `${repoUrl.split("github.com/")[1].split("/")[1]}-container`,
        Cmd: [ "sh", "-c", `export DEPLOY_ID=${id} && git clone ${repoUrl} /home/app/output && node script.js && tail -f /dev/null` ],
        Tty: true,
        AttachStdout: true,
        AttachStderr: true,
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
        await buildImage(repoUrl);
        await createAndStartContainer(repoUrl, deployId);
    } catch (error) {
        console.error(error);
    }
}
