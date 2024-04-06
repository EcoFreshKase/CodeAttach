import { generatePdf } from "html-pdf-node";
import { BaseConverter, Converter } from "./converter";
import { writeFileSync } from "fs";
import { nanoid } from "nanoid";
import { resolve } from "path";

interface Props {
  saveName: (html: string) => string;
  saveDir: string;
  tmpDir: string;
}

/**
 * Converts HTML to PDF.
 */
export class HtmlToPdfConverter
  extends BaseConverter
  implements Converter<string, Pdf>
{
  saveName: (html: string) => string; // Function to generate the name of the saved PDF
  saveDir: string; // Directory to save the converted PDFs in
  tmpDir: string; // Directory to save temporary files in

  public constructor(logging: boolean) {
    super(logging);
    this.saveName = () => "";
    this.saveDir = "";
    this.tmpDir = "";
  }

  public async prepare({ saveName, saveDir, tmpDir }: Props): Promise<void> {
    this.saveName = saveName;
    this.saveDir = saveDir;
    this.tmpDir = tmpDir;

    this.prepared = true;
  }

  /**
   *
   * @param html Path to the HTML file to convert
   * @param filePath Path to the file to display in the footer
   */
  async convert(html: string, filePath: string): Promise<Pdf> {
    this.checkIfPrepared();

    if (this.logging) {
      console.log(`\u001b[33m Converting ${filePath} to PDF ...\u001b[0m`);
    }

    let savesIn = this.saveName(filePath);
    let pdf = { path: `${this.saveDir}/${savesIn}.pdf` };

    // Temporarily save html
    let htmlSavePath = resolve(`${this.tmpDir}/${nanoid()}.html`);
    writeFileSync(htmlSavePath, html);
    await generatePdf(
      { url: htmlSavePath },
      {
        format: "A4",
        path: pdf.path,
        footerTemplate: HtmlToPdfConverter.createFooter(filePath),
        displayHeaderFooter: true,
        margin: {
          bottom: "60px",
        },
      }
    );
    return pdf;
  }

  private static createFooter(filePath: string): string {
    return `
      <div
          style="
          display: flex;
          width: 100%;
          justify-content: space-between;
          padding: 0px 20px;
          "
      >
        <p
          style="
            font-size: 8px;
            width: 100%;
            word-break: break-all;
            white-space: normal;
          "
        >
          ${filePath}
        </p>
        <div
          style="
            display: flex;
            align-items: end;
            margin-top: auto;
            margin-bottom: auto;
          "
        >
          <p style="font-size: 8px" class="pageNumber"></p>
          <p style="font-size: 8px">/</p>
          <p style="font-size: 8px" class="totalPages"></p>
        </div>
      </div>
      `;
  }
}
