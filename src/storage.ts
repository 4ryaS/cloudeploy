import { Storage } from "@google-cloud/storage";
import fs from 'fs';

const storage = new Storage();

export const uploadFileToStorage = async (localFilePath: string, id: string) => {
    try {
        const bucket = storage.bucket('cloudeploy');
        const fileName = localFilePath.slice(__dirname.length + 6 + id.length + 1);
        await bucket.upload(localFilePath, {
            destination: `output/${id}/${fileName}`
        })
    } catch (error) {
        console.log(error);
        console.log("storage may be down");
        
    }

}