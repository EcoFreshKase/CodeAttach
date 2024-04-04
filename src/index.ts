import { generatePdf, generatePdfs } from "html-pdf-node";
import { createFooterTemplate } from "./utils/exportFooter";
import { mkdtemp, readdir, rm } from "fs/promises";
import { convertToImage } from "./utils/fileConverter";
import { embedInHtml } from "./utils/htmlParser";
import { sanitizePath } from "./utils/files";

const ROOT_DICT = "test";
const TMP_DICT = "tmp";

async function main() {
  let tmpName = await mkdtemp(TMP_DICT);
  let dirents = await readdir(ROOT_DICT, {
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
    let html = embedInHtml(`${tmpName}/${savePath}`);
    console.log(html);

    // html to pdf
    console.log(`\u001b[33m Converting ${filePath} to pdf ...\u001b[0m`);
    let pdfSavePath = sanitizePath(filePath);
    await generatePdf(
      { content: html },
      {
        format: "A4",
        path: `export/test/${pdfSavePath}.pdf`,
        footerTemplate: createFooterTemplate(filePath),
        displayHeaderFooter: true,
        margin: {
          bottom: "60px",
        },
      }
    );

    console.log(`\u001b[32m Finished converting ${filePath}\u001b[0m\n`);
  }

  console.log(await readdir(tmpName), { withFileTypes: true });

  rm(tmpName, { recursive: true });
}

main();

// const filePath = "src-index.ts";
// const html = `
// <body style="margin: 0px">
//   <h1>Welcome to html-pdf-node</h1>
//   <p>Hello World</p>
//   <img
//     src="D:\\Coding Projekte\\CodeAttach\\tmphdsbBY\\test-react-app-env.d.ts.png"
//     alt="some Code"
//   />
//   <img src="export/1.png.png" alt="1.png.png" />
// </body>

// `;

// generatePdf(
//   // { url: "D:\\Coding Projekte\\CodeAttach\\export\\more.html" },
//   { content: html },
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
