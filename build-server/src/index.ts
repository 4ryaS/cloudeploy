import express from "express";
import Docker from "dockerode";

const app = express();
app.use(express.json());

const docker = new Docker();

app.post("/deploy", async(req, res) => {
    const { repoUrl } = req.body.repoUrl;
    if(!repoUrl) {
        res.json({
            message: "require repoUrl"
        })
    };

    try {

    } catch (error) {
        console.log(error);
    }
})



