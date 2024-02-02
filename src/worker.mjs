import { parentPort, workerData, threadId } from 'worker_threads';
import { createReadStream, createWriteStream } from 'fs';
import { CSVS_FOLDER } from './workerThreads.mjs';
import { parse } from 'csv-parse'

const { file } = workerData;

parentPort.postMessage(`Processing ${file}`);
parentPort.postMessage(`Thread ID: ${threadId}`);

const readStream = createReadStream(`${CSVS_FOLDER}/${file}`);
const writeStream = createWriteStream(`${file}-copy.json`);

readStream
  .pipe(parse({
    delimiter: ',',
    columns: ['column1', 'column2'],
    skip_empty_lines: true
  })) 
  .on('data', (row) => {
    writeStream.write(`${JSON.stringify(row)}\n`);
  })
  .on('end', () => {
    writeStream.end();
  });

writeStream
  .on('finish', () => {
    parentPort.postMessage(`Finished processing ${file}`)
    parentPort.close();
    process.exit(0);
  })