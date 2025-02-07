import { Storage } from "@google-cloud/storage";

const storage = new Storage();

export async function uploadFile(fileName: string, localFilePath: string, id: string) {
    try {
        const bucket = storage.bucket("cloudeploy");
        const destination = `output/${id}/${fileName}`
        await bucket.upload(localFilePath, { destination: destination });
    } catch (error) {
        console.error(error);
    }
}
