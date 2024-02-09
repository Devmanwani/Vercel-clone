

import express from 'express';
import cors from 'cors';
import path from 'path';
import simpleGit from 'simple-git';
import { generate } from './utils';
import { getAllFiles } from './file';
import { uploadFile } from './aws';
import { createClient } from 'redis';
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());



app.post("/deploy", async (req, res) => {
    try {
        const repoUrl = req.body.repoUrl;
        const id = generate();
        await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`).replace(/\\/g, '/'));

        const files = getAllFiles(path.join(__dirname, `output/${id}`).replace(/\\/g, '/'));

        // Upload files sequentially
        for (const file of files) {
            await uploadFile(file.slice(__dirname.length + 1).replace(/\\/g, '/'), file);
        }

        publisher.lPush("build-queue", id);
        publisher.hSet("status", id, "uploaded");

        res.json({
            id: id
        });
    } catch (error) {
        console.error("Error uploading:", error);
        res.status(500).json({ error: "An error occurred during upload" });
    }
});



app.get("/status", async (req,res)=>{
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status:response
    })
})

app.listen(3000);