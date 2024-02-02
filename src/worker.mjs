import { parentPort, workerData, threadId } from 'worker_threads';
import { createReadStream } from 'fs';
import { CSVS_FOLDER } from './workerThreads.mjs';
import { parse } from 'csv-parse'

const { file } = workerData;

parentPort.postMessage(`Processing ${file}`);
parentPort.postMessage(`Thread ID: ${threadId}`);

const readStream = createReadStream(`${CSVS_FOLDER}/${file}`);

readStream
  .pipe(parse()) 
  .on('data', (row) => {
    // parentPort.postMessage(`Finished processing ${file}`)
    parentPort.postMessage(JSON.stringify(row));
  })
  .on('end', () => {
    parentPort.postMessage(`Finished processing ${file}`)
    parentPort.close();
    process.exit(0);
  })

  