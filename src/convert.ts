import { mkdtemp, readdir, rm } from "fs/promises";
import { FileToPdfConverter } from "./Converter/FileToPdfConverter";

interface Props {
  rootDir: string;
  saveDir: string;
  carbonConfig: string;
  tmpDir: string;
  includeRegex: RegExp;
}

export async function convert({
  rootDir,
  carbonConfig,
  includeRegex,
  saveDir,
  tmpDir,
}: Props) {
  let tmpName = await mkdtemp(tmpDir);
  let dirents = await readdir(rootDir, {
    withFileTypes: true,
    recursive: true,
  });

  let file2Pdf = new FileToPdfConverter(true);
  await file2Pdf.prepare({
    exportDir: saveDir,
    carbonConfig,
    tmpDir: tmpName,
  });

  // parse all files to pdf
  for (let dirent of dirents) {
    if (!dirent.isFile()) {
      continue;
    }
    let fullPath = `${dirent.path}\\${dirent.name}`;
    if (!fullPath.match(includeRegex)) {
      continue;
    }
    await file2Pdf.convert(dirent);
  }

  console.log(`\n\n\u001b[32m Finished Converting all files\u001b[0m`);

  rm(tmpName, { recursive: true });
}
