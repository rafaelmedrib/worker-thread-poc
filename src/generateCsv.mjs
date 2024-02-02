import { generate } from 'csv-generate';
import { createWriteStream } from 'fs';

const saveCsv = (path) => {
  return createWriteStream(path);
}

const generateCsvs = (numberOfFiles, options) => {
  for (let i = 0; i < numberOfFiles; i++) {
    generate(options)
    .pipe(saveCsv(`csv_files/${i}-table.csv`))
    .on('finish', () => console.log(`Done ${i}`));
  }
}

generateCsvs(3, {
  columns: 2,
  length: 3,
  delimiter: ',',
});
