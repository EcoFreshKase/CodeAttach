import { generatePdf } from "html-pdf-node";
import { createFooterTemplate } from "./footer";
import { mkdtemp, readdir, rm } from "fs/promises";
import { convertToImage } from "./utils/fileConverter";

const ROOT_DICT = "test";
const TMP_DICT = "tmp";

async function main() {
  let tmpName = await mkdtemp(TMP_DICT);
  let dirents = await readdir(ROOT_DICT, {
    withFileTypes: true,
    recursive: true,
  });

  for (let dirent of dirents) {
    if (!dirent.isFile()) {
      continue;
    }
    let filePath = `${dirent.path}\\${dirent.name}`;

    let savePath = convertToImage(filePath, tmpName);
  }

  console.log(await readdir(tmpName), { withFileTypes: true });

  rm(tmpName, { recursive: true });
}

main();

// const filePath = "src/index.ts";

// generatePdf(
//   { url: "file:///D:/Coding%20Projekte/CodeAttach/export/index.html" },
//   {
//     format: "A4",
//     path: "export/output.pdf",
//     footerTemplate: createFooterTemplate(filePath),
//     displayHeaderFooter: true,
//     margin: {
//       bottom: "60px",
//     },
//   }
// );
