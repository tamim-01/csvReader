import fs from 'fs';
import CSV from 'csv-parser';

export function csvFileReader(file) {
  return new Promise((resolve, reject) => {
    const results = [];
    const options = {
      mapHeaders: ({ header }) => header.trim().replace(/^"(.*)"$/, '$1'),
    };

    fs.createReadStream(file)
      .pipe(CSV(options))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log('csv parsed');
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}
