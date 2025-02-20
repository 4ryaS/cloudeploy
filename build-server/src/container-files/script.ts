import { spawn } from 'child_process';
import path from 'path';
import { promises as fsp } from 'fs';
import fs from 'fs';
import { uploadFile } from './pushToStorage';

async function init() {
    console.log("Executing script.js");

    const outDirPath = path.join(__dirname, 'output');
    const id = process.env.DEPLOY_ID || "";
    console.log("Deploy ID:", id);

    // Run `npm install`
    const installProcess = spawn('npm', ['install'], { cwd: outDirPath, shell: true });

    installProcess.stdout.on('data', (data) => console.log(data.toString()));
    installProcess.stderr.on('data', (data) => console.error(data.toString()));

    installProcess.on('close', () => {
        console.log("npm install complete. Running build...");

        const buildProcess = spawn('npm', ['run', 'build'], { cwd: outDirPath, shell: true });

        buildProcess.stdout.on('data', (data) => console.log(data.toString()));
        buildProcess.stderr.on('data', (data) => console.error(data.toString()));

        buildProcess.on('close', async () => {
            console.log("Build Complete! Uploading to storage...");

            var distFolderPath = "";
            const mainFolderPath = path.join(__dirname, 'output');
            const mainFolderContents = fs.readdirSync(mainFolderPath);
            for (const distFolder of mainFolderContents) {
                if (distFolder === "build") {
                    distFolderPath = path.join(__dirname, 'output', 'build');
                    break;
                } else if (distFolder === "dist") {
                    distFolderPath = path.join(__dirname, 'output', 'dist');
                    break;
                }
            }

            const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

            const uploadPromises = distFolderContents.map(async (filePath) => {
                const fullPath = path.join(distFolderPath, filePath as string);
                try {
                    const stats = await fsp.lstat(fullPath);
                    if (!stats.isDirectory()) {
                        return uploadFile(filePath as string, fullPath, id);
                    }
                } catch (error) {
                    console.error(`Error processing ${filePath}:`, error);
                }
            });

            // Ensure only valid promises are awaited
            await Promise.all(uploadPromises.filter(p => p !== undefined));

            console.log("Upload complete!");
        }); 
    });

    installProcess.on('error', (err) => {
        console.error("Process Error: ", err.message);
    });
}

init();
