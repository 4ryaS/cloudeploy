const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

async function uploadFile(fileName, localFilePath, id) {
    try {
        const bucket = storage.bucket("cloudeploy");
        const destination = `output/${id}/${fileName}`
        await bucket.upload(localFilePath, { destination: destination });
    } catch (error) {
        console.error(error);
    }
}

module.exports = { uploadFile }