import express from "express";
import { run } from "./DockerOperations";
import { generate } from "random-words";

const app = express();
app.use(express.json());

const gitUrlRegex = /^(?:git@[\w.-]+:[\w./-]+\.git|https?:\/\/[\w.-]+\/[\w./-]+\.git)$/;

function isValidGitCloneUrl(url: string) {
    return gitUrlRegex.test(url);
}

app.post("/deploy", async (req, res) => {
    const id = generate({ exactly: 3, join: '-' });
    console.log(id);    
    const { repoUrl } = req.body;
    if (!repoUrl) {
        res.json({
            message: "repoUrl is required!"
        })
        return;
    };

    if(!isValidGitCloneUrl(repoUrl)){
        res.json({
            message: "the provided url is invalid!"
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



