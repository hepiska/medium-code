const axios = require('axios');
const fs = require('fs');
const path = require('path');
const verses = require('./verses.json');


const downloadFile = async (url, fileName) => {

  const dir = fileName.split('/').slice(0, -1).join('/');
  const compleatePath = path.join(__dirname, dir);
  const fileDir = path.join(__dirname, fileName);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(compleatePath, { recursive: true });
  }

  const writer = fs.createWriteStream(fileDir);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    let error = null;
    writer.on('error', err => {
      error = err;
      writer.close();
      reject(err);
    })
    writer.on('close', () => {
      if (!error) {
        resolve(true);
      }
    })
  })
}

const writeFailures = async (failures) => {
  const fileDir = path.join(__dirname, 'failures.json');
  let newFailures = [];
  if (fs.existsSync(fileDir)) {
    const currentFailures = fs.readFileSync(fileDir);
    newFailures = [...currentFailures, ...failures];
  }
  newFailures = [...failures]
  fs.writeFileSync(fileDir, JSON.stringify(newFailures));

}

const waiting = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const runBacth = async (from = 0, to) => {
  let batchSizee = 50;
  let batch = 1 * from;


  while ((batch * batchSizee < verses.length) && (to && batch < to)) {
    const start = batch * batchSizee;
    const end = start + batchSizee;
    const batchVerses = verses.slice(start, end);
    console.log(`Downloading batch ${batch + 1} of ${Math.ceil(verses.length / batchSizee)}`);
    const downloadFilePromises = batchVerses.map(async verse => {
      const { primary } = verse.audio;
      return downloadFile(primary, `${primary.split('/').slice(3,).join('/')}.mp3`).catch(error => {
        writeFailures([verse]);
        console.log('Error downloading file', primary);
      })
    });
    await Promise.all(downloadFilePromises);
    batch++;
    await waiting(1000);
  }
}


run = async () => {
  try {
    await runBacth(0, 3)
    // await downloadFile('https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/3233', 'media/audio/ayah/ar.alafasy/3233.mp3')



  } catch (error) {
    console.log('Error downloading file', error);
  } finally {
    console.log('Process finished');
    process.exit(0);
  }
}

run()