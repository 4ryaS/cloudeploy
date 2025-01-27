import fs from 'fs';
import path from 'path';

export const getAllFiles = (folderPath: string): string[] => {
    let filesArray: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(item => {
        const filePath = path.join(folderPath, item);
        if (fs.statSync(filePath).isDirectory()) {
            filesArray = filesArray.concat(getAllFiles(filePath));
        } else {
            filesArray.push(filePath);
        }
    })
    return filesArray;
}