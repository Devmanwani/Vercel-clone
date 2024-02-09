import express from 'express';
import { S3 } from 'aws-sdk';



const s3 = new S3({
    accessKeyId: "26a7a0c4783ef48d71fafddd04bfb8a7",
    secretAccessKey: "8985bb213d259852061b7fe7854d2d46b273793415eba4d40d1bca41b2fb0c47",
    endpoint: "https://149deda2175f385d240345938dc16adb.r2.cloudflarestorage.com"
})

const app = express();

app.get("/*", async (req, res) => {
    
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);
