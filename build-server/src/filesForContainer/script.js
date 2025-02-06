const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { uploadFile } = require('./pushToStorage');

async function init() {
    console.log("Executing script.js");
    const outDirPath = path.join(__dirname, 'output');
    const process = exec(`cd ${outDirPath} && npm install && npm run build`);
    const echoId = exec(`echo $DEPLOY_ID`);
    var id;
    echoId.stdout.on('data', (data) => {
        id = data.toString();
        console.log(data.toString());
        
    })
    process.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    process.stdout.on('error', function (data) {
        console.log("Error: ", data.toString());
    });

    process.stdout.on('close', async function () {
        console.log("Build Complete!");
        console.log("uploading to storage");
        const distFolderPath = path.join(__dirname, 'dist');
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        const uploadPromises = distFolderContents.map(async (filePath) => {
            const fullPath = path.join(distFolderPath, filePath);

            try {
                const stats = await fs.lstat(fullPath);
                if (!stats.isDirectory()) {
                    return uploadFile(filePath, fullPath, id);
                }
            } catch (error) {
                console.error(`Error processing ${filePath}:`, error);
            }
        });
        await Promise.all(uploadPromises);
    });
}

init();