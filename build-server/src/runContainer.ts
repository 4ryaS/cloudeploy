import Docker from 'dockerode';

const docker = new Docker();
const imageName = "cloudeploy";

export async function runContainer(repoUrl: string) {
    const dockerfileContent = `
        FROM ubuntu:focal

        RUN apt-get update && \
            apt-get install -y curl git && \
            curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
            apt-get upgrade -y && \
            apt-get install -y nodejs

        WORKDIR /app/home

        RUN git clone ${repoUrl} repo

        COPY script.js script.js
        COPY package*.json ./

        RUN npm install

        RUN chmod +x script.js

        CMD ["node", "script.js"]
        `;
    try {
        // const container = await docker.buildImage()
    } catch (error) {
        console.log(error);
    }
}