import { Storage } from "@google-cloud/storage";

const storage = new Storage();

export const uploadFileToStorage = async (localFilePath: string, id: string) => {
    try {
        const bucket = storage.bucket('cloudeploy');
        const fileName = localFilePath.slice(__dirname.length + 8 + id.length + 1);
        const newFileName = fileName.replace(/\\/g, '/');

        await bucket.upload(localFilePath, {
            destination: `output/${id}/${newFileName}`
        })

    } catch (error) {
        console.log(error);
        console.log("storage may be down");
    }

}