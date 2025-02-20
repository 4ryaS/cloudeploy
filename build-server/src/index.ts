import express from "express";
import { run } from "./DockerOperations";
import { generate } from "random-words";
import { isValidGitCloneUrl } from "./utils/githubCheck";

const app = express();
app.use(express.json());

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
    } 
    catch (error) {
        console.log(error);
    }
})

app.listen(3000, () => {
    console.log("The server is live at port 3000");
});