const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

function loadEnv() {
    const envPath = path.resolve(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        content.split(/\r?\n/).forEach(line => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                let val = match[2] || '';
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.slice(1, -1);
                }
                process.env[match[1]] = val;
            }
        });
    }
}
loadEnv();

const s3 = new AWS.S3({
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    signatureVersion: "v4",
    region: "auto",
});

const BUCKET = process.env.R2_BUCKET_NAME || "kidmy";

async function main() {
    const argUid = process.argv[2];
    const uid = argUid || 'd01b254483794de3819786d93e0e1ebf'; // Porsche 911
    const apiKey = process.env.SKETCHFAB_API_KEY || '7a3c8fa3fc4849c8ace3eee13ea91962';

    console.log(`Fetching Sketchfab info for UID: ${uid}...`);
    const res = await fetch(`https://api.sketchfab.com/v3/models/${uid}/download`, {
        headers: { 'Authorization': `Token ${apiKey}` }
    });

    const data = await res.json();
    if (data.detail) {
        console.error("Error from Sketchfab:", data.detail);
        return;
    }

    if (!data.glb || !data.glb.url) {
        console.error("No GLB download link available in response", data);
        return;
    }

    const downloadUrl = data.glb.url;
    console.log(`Downloading GLB from Sketchfab...`);

    const glbRes = await fetch(downloadUrl);
    const arrayBuffer = await glbRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = `models/${uid}.glb`;

    console.log(`Uploading to R2 (${BUCKET}/${key})...`);
    try {
        await s3.putObject({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: "model/gltf-binary"
        }).promise();

        const finalUrl = `${process.env.R2_PUBLIC_DOMAIN}/${key}`;
        console.log(`\n✅ Success!`);
        console.log(`Public URL: ${finalUrl}`);
    } catch (err) {
        console.error(`Upload failed:`, err);
    }
}

main();
