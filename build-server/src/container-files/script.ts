import { spawn } from 'child_process';
import path, { dirname } from 'path';
import { promises as fsp } from 'fs';
import fs from 'fs';
import { uploadFile } from './pushToStorage';

async function init() {
    console.log("Executing script.js");

    const outDirPath = path.join(__dirname, 'output');
    const id = process.env.DEPLOY_ID || "";

    // Create a writable stream for the log file
    const logFilePath = path.join(__dirname, 'build_process.log');
    const logStream = fs.createWriteStream(logFilePath, { flags: 'a' }); // 'a' flag to append to the file
    logStream.write(`Build Process Started at ${new Date().toISOString()}\n`);

    // Function to log output to both console and log file
    const logOutput = (data: any) => {
        const output = data.toString();
        // console.log(output);
        logStream.write(output);
    };

    // Run `npm install`
    const installProcess = spawn('npm', ['install'], { cwd: outDirPath, shell: true });

    installProcess.stdout.on('data', logOutput);
    installProcess.stderr.on('data', logOutput);

    installProcess.on('close', () => {
        logStream.write("\nnpm install complete. Running build...\n");

        const buildProcess = spawn('npm', ['run', 'build'], { cwd: outDirPath, shell: true });

        buildProcess.stdout.on('data', logOutput);
        buildProcess.stderr.on('data', logOutput);

        buildProcess.on('close', async () => {
            logStream.write("\nBuild Complete! Uploading to storage...\n");

            let distFolderPath = "";
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

            logStream.write("\nUpload complete!\n");
            logStream.write(`Build Process Completed at ${new Date().toISOString()}\n`);
            logStream.end(); // Close the log file stream
        });
    });

    installProcess.on('error', (err) => {
        console.error("Process Error: ", err.message);
        logStream.write(`Process Error: ${err.message}\n`);
        logStream.end(); // Close the log file stream
    });
    try {
        uploadFile("build_process.log", path.join(__dirname, "output", "build_process.log"), id);
    } catch (error) {
        console.error("error: ",error);
    }    
}

init();