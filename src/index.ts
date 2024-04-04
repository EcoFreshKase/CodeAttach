import { generatePdf, generatePdfs } from "html-pdf-node";
import { createFooterTemplate } from "./utils/exportFooter";
import { mkdtemp, readdir, rm } from "fs/promises";
import { writeFileSync } from "fs";
import { convertToImage } from "./utils/fileConverter";
import { embedInHtml } from "./utils/htmlParser";
import { sanitizePath } from "./utils/files";
import { resolve } from "path";

const ROOT_DIR = "test";
const TMP_DIR = "tmp";
const SAVE_DIR = "export/test";

async function main() {
  let tmpName = await mkdtemp(TMP_DIR);
  let dirents = await readdir(ROOT_DIR, {
    withFileTypes: true,
    recursive: true,
  });

  // parse all files to pdf
  for (let dirent of dirents) {
    if (!dirent.isFile()) {
      continue;
    }
    let filePath = `${dirent.path}\\${dirent.name}`;

    // file to image
    console.log(`\u001b[33m Converting ${filePath} to image ...\u001b[0m`);
    let savePath = convertToImage(filePath, tmpName);

    // embed image in html
    console.log(`\u001b[33m Converting ${filePath} to html ...\u001b[0m`);
    let html = embedInHtml(`${savePath}`);

    // temporarily save html
    let htmlSavePath = `${tmpName}/${sanitizePath(filePath)}.html`;
    writeFileSync(htmlSavePath, html);

    // html to pdf
    console.log(`\u001b[33m Converting ${filePath} to pdf ...\u001b[0m`);
    let pdfSavePath = sanitizePath(filePath);
    await generatePdf(
      { url: resolve(htmlSavePath) },
      {
        format: "A4",
        path: `${SAVE_DIR}/${pdfSavePath}.pdf`,
        footerTemplate: createFooterTemplate(filePath),
        displayHeaderFooter: true,
        margin: {
          bottom: "60px",
        },
      }
    );

    console.log(`\u001b[32m Finished converting ${filePath}\u001b[0m\n`);
  }

  console.log(`\n\n\u001b[32m Finished Converting all files[0m`);

  rm(tmpName, { recursive: true });
}

main();

// const filePath = "src-index.ts";
// const html = `
// <body style="margin: 0px">
//   <img src="test-react-app-env.d.ts.png" />
// </body>
// `;

// generatePdf(
//   { url: "D:\\Coding Projekte\\CodeAttach\\tmpclwV1d\\test-App.css.html" },
//   // { content: html },
//   {
//     format: "A4",
//     path: `export/${filePath}.pdf`,
//     footerTemplate: createFooterTemplate(filePath),
//     displayHeaderFooter: true,
//     margin: {
//       bottom: "60px",
//     },
//   }
// );
