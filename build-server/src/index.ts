import express from "express";
import { run } from "./DockerOperations";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());

const gitUrlRegex = /^(?:git@[\w.-]+:[\w./-]+\.git|https?:\/\/[\w.-]+\/[\w./-]+\.git)$/;

function isValidGitCloneUrl(url: string) {
    return gitUrlRegex.test(url);
}

app.post("/deploy", async (req, res) => {
    const id = nanoid().toLowerCase();
    console.log(id);    
    const { repoUrl } = req.body;
    if (!repoUrl) {
        res.json({
            message: "require repoUrl"
        })
        return;
    };

    if(!isValidGitCloneUrl(repoUrl)){
        res.json({
            message: "the provided url is invalid"
        })
        return;
    }
    

    try {
        await run(repoUrl, id);
        res.json(id);
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000);



