import express from "express";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();

const bucketName = "cloudeploy";

const app = express();

app.get("/*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path.startsWith("/") ? req.path.slice(1) : req.path;

    const file = storage.bucket(bucketName).file(`output/${id}/${filePath}`);
    try {
        const [exists] = await file.exists();
        if (!exists) {
            res.status(404).send("File not found");
        }

        const [contents] = await file.download();

        const type = filePath.endsWith(".html") ? "text/html" :
            filePath.endsWith(".css") ? "text/css" :
                "application/javascript";

        res.set("Content-Type", type);
        res.send(contents);
    } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
