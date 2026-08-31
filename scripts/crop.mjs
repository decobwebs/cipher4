import sharp from 'sharp'
const [,, file, top, height, out] = process.argv
await sharp(file).extract({ left: 0, top: Number(top), width: 1440, height: Number(height) }).toFile(out)
console.log('cropped', out)
