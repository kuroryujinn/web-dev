const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const questions = require('../src/data/questions.json');

const imagesDir = path.join(__dirname, '../public/images');
const questionsDir = path.join(imagesDir, 'questions');
const optionsDir = path.join(imagesDir, 'options');

[imagesDir, questionsDir, optionsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const createImage = (text, filePath) => {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(0, 0, 200, 200);

    ctx.fillStyle = '#333';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 100, 100);

    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(filePath, buffer);
    console.log(`Created image: ${filePath}`);
}

questions.forEach(q => {
    // Create question image
    const qFileName = path.basename(q.questionImage);
    const qFilePath = path.join(questionsDir, qFileName);
    createImage(q.questionAlt, qFilePath);

    // Create option images
    q.options.forEach(opt => {
        const oFileName = path.basename(opt.image);
        const oFilePath = path.join(optionsDir, oFileName);
        createImage(opt.label, oFilePath);
    });
});
