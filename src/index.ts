import { generatePdf } from "html-pdf-node";
import { createFooterTemplate } from "./footer";

const filePath = "src/index.ts";

generatePdf(
  { url: "file:///D:/Coding%20Projekte/CodeAttach/export/index.html" },
  {
    format: "A4",
    path: "export/output.pdf",
    footerTemplate: createFooterTemplate(filePath),
    displayHeaderFooter: true,
    margin: {
      bottom: "60px",
    },
  }
);
