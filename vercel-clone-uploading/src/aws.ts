import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "26a7a0c4783ef48d71fafddd04bfb8a7",
    secretAccessKey: "8985bb213d259852061b7fe7854d2d46b273793415eba4d40d1bca41b2fb0c47",
    endpoint: "https://149deda2175f385d240345938dc16adb.r2.cloudflarestorage.com"
})


export const uploadFile = async (fileName: string, localFilePath: string)=>{
    
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket:"vercel",
        Key:fileName,
    }).promise();
    
}