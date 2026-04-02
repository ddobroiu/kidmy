const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

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

async function uploadFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const fileName = path.basename(filePath);
    const key = `models/${fileName}`;

    const fileStream = fs.createReadStream(filePath);

    console.log(`Uploading ${fileName} to R2 bucket ${BUCKET}...`);

    try {
        await s3.putObject({
            Bucket: BUCKET,
            Key: key,
            Body: fileStream,
            ContentType: "model/gltf-binary"
        }).promise();

        console.log(`Success! Public URL should be: ${process.env.R2_PUBLIC_DOMAIN}/${key}`);
    } catch (err) {
        console.error(`Upload failed:`, err);
    }
}

const arg = process.argv[2];
if (arg) {
    uploadFile(path.resolve(process.cwd(), arg));
} else {
    console.log("Please provide a path to the glb file. Example: node scripts/upload_r2.js my_model.glb");
}
