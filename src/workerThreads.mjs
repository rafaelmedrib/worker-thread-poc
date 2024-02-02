import { Worker } from "worker_threads";
import { readdirSync } from "fs";

export const CSVS_FOLDER = 'csv_files';

const getCsvFilesInDir = async (folderPath) => {
  const files = readdirSync(folderPath);
  return files.filter((file) => file.endsWith('.csv'))
}

const csvFiles = await getCsvFilesInDir(CSVS_FOLDER);

csvFiles.forEach((file) => {
  new Worker('./src/worker.mjs', {
    workerData: {
      file,
    }
  })
  .on('message', (message) => {
    console.log(message);
  })
  .on('error', (error) => {
    console.error(error);
  })
  .on('exit', (code) => {
    if (code !== 0) {
      console.error(new Error(`Worker stopped with exit code ${code}`));
    }
  });
});
