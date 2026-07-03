const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const inputDir = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\d406b089-db1f-467f-8638-96ed1d436a66';
const outputDir = 'c:\\Users\\admin\\Desktop\\Augmented reality solutions\\assets';

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));

for (const file of files) {
    const inputPath = path.join(inputDir, file);
    // Remove the timestamp part e.g. _1783057907042
    const baseName = file.split('_17')[0] + '.webp';
    const outputPath = path.join(outputDir, baseName);
    
    console.log(`Converting ${inputPath} to ${outputPath}`);
    try {
        execSync(`npx.cmd -y sharp-cli -i "${inputPath}" -o "${outputPath}"`, {stdio: 'inherit'});
    } catch (e) {
        console.error(`Failed to convert ${file}:`, e.message);
    }
}
