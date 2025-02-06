import express from "express";
import { run } from "./DockerOperations";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());


app.post("/deploy", async (req, res) => {
    const id = nanoid();
    console.log(id);    
    const { repoUrl } = req.body;
    if (!repoUrl) {
        res.json({
            message: "require repoUrl"
        })
        return;
    };

    try {
        await run(repoUrl, id);
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000);



