import express from 'express';
import cors from 'cors'
import { v4 as uuid } from 'uuid';
import simpleGit from 'simple-git';

const app = express();
app.use(cors());
app.use(express.json());


app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = uuid();
    await simpleGit().clone(repoUrl, `output/${id}`);
    res.json({
        id: id
    })
})

app.listen(3000);
