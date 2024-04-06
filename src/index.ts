import { mkdtemp, readdir, rm } from "fs/promises";
import { FileToPdfConverter } from "./Converter/FileToPdfConverter";

const ROOT_DIR = "test";
const SAVE_DIR = "export/test";
const CARBON_CONFIG = "local-carbon-config.json";
const TMP_DIR = "tmp";

async function main() {
  let tmpName = await mkdtemp(TMP_DIR);
  let dirents = await readdir(ROOT_DIR, {
    withFileTypes: true,
    recursive: true,
  });

  let file2Pdf = new FileToPdfConverter(true);
  await file2Pdf.prepare({
    exportDir: SAVE_DIR,
    carbonConfig: CARBON_CONFIG,
    tmpDir: tmpName,
  });

  // parse all files to pdf
  for (let dirent of dirents) {
    if (!dirent.isFile()) {
      continue;
    }
    await file2Pdf.convert(dirent);
  }

  console.log(`\n\n\u001b[32m Finished Converting all files\u001b[0m`);

  rm(tmpName, { recursive: true });
}

main();
