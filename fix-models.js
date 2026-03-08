import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
const manifests = [
  'tiny_face_detector_model-weights_manifest.json',
  'face_landmark_68_model-weights_manifest.json',
  'face_recognition_model-weights_manifest.json'
];

const dest = path.join(__dirname, 'public', 'models');
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

async function download() {
  for (const manifestFile of manifests) {
    console.log(`Fetching manifest ${manifestFile}...`);
    const res = await fetch(baseUrl + manifestFile);
    if (!res.ok) {
        console.error(`Error fetching ${manifestFile} - ${res.status}`);
        continue;
    }
    const manifestJson = await res.json();
    fs.writeFileSync(path.join(dest, manifestFile), JSON.stringify(manifestJson, null, 2));
    
    // Download the shards specified in the manifest
    const shards = [];
    manifestJson.forEach(group => {
       if (group.paths) {
         group.paths.forEach(p => shards.push(p));
       }
    });

    for(const shard of shards) {
       console.log(`Fetching shard ${shard}...`);
       const shardRes = await fetch(baseUrl + shard);
       if (!shardRes.ok) {
           console.error(`Error fetching ${shard} - ${shardRes.status}`);
           continue;
       }
       const arrayBuffer = await shardRes.arrayBuffer();
       const buffer = Buffer.from(arrayBuffer);
       fs.writeFileSync(path.join(dest, shard), buffer);
       console.log(`Saved ${shard} (${buffer.length} bytes)`);
    }
  }
}

download().then(() => console.log('Done'));
