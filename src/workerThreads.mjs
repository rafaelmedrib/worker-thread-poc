import { Worker } from "worker_threads";
import { readdirSync } from "fs";

export const CSVS_FOLDER = 'csv_files';

const getCsvFilesInDir = async (folderPath) => {
  const files = readdirSync(folderPath);
  return files.filter((file) => file.endsWith('.csv'))
}

const csvFiles = await getCsvFilesInDir(CSVS_FOLDER);
const workerPool = [];

csvFiles.forEach((file) => {
  const worker = new Worker('./src/worker.mjs', {
    workerData: {
      file,
    },
  });

  workerPool.push(worker);
});

workerPool.forEach((worker) => {
  worker.on('message', (message) => {
    console.log(message);
  });
  worker.on('error', (error) => {
    console.error(error);
  });
  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(new Error(`Worker stopped with exit code ${code}`));
    } else {
      console.log('Worker stopped');
    }
  });
});
