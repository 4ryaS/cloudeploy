import express from 'express';
import cors from 'cors'
import { v4 as uuid } from 'uuid';
import simpleGit from 'simple-git';
import path from 'path';
import { getAllFiles } from './getfiles';
import { uploadFileToStorage } from './storage';
import 'dotenv/config'
import { pushToRedis } from './pushIdToRedis';

const app = express();

app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {

    const repoUrl = req.body.repoUrl;
    const id = uuid();

    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    files.forEach(file => {
        uploadFileToStorage(file, id);
    })

    pushToRedis(id);

    res.json({
        id: id
    });
})

app.listen(4000);
