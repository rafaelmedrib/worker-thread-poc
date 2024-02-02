import { parentPort, workerData,  } from 'worker_threads';
import { createReadStream } from 'fs';
import { CSVS_FOLDER } from './workerThreads.mjs';
import { parse } from 'csv-parse'

const { file } = workerData;

const readStream = createReadStream(`${CSVS_FOLDER}/${file}`);

parentPort.postMessage(`Processing ${file}`);

//the worker must read the file, parse it and print the parsed data to the console and then exit with a message:
readStream.pipe(parse())
.on('data', (row) => {
  console.log(row);
})
.on('end', () => {
  parentPort.postMessage(`Done ${file}`);
  process.exit(0);
});



