import { FileToImageConverter } from "./FileToImageConverter";
import { HtmlToPdfConverter } from "./HtmlToPdfConverter";
import { ImageToHtmlConverter } from "./ImageToHtmlConverter";
import { BaseConverter, Converter } from "./converter";
import { Dirent } from "fs";

interface Props {
  exportDir: string;
  carbonConfig: string;
  tmpDir: string;
}

export class FileToPdfConverter
  extends BaseConverter
  implements Converter<Dirent, Pdf>
{
  File2Image: FileToImageConverter;
  Image2Html: ImageToHtmlConverter;
  Html2Pdf: HtmlToPdfConverter;

  constructor(logging: boolean, debug: boolean = false) {
    super(logging);
    this.File2Image = new FileToImageConverter(debug);
    this.Image2Html = new ImageToHtmlConverter(debug);
    this.Html2Pdf = new HtmlToPdfConverter(debug);
  }

  public async prepare({
    exportDir,
    carbonConfig,
    tmpDir,
  }: Props): Promise<void> {
    this.File2Image.prepare({
      exportDir: tmpDir,
      carbonConfig: carbonConfig,
      saveName: (file) => `${file.path}\\${file.name}`.replaceAll("\\", "-"),
    });
    this.Image2Html.prepare({
      embedInHtml: (image) => `<body style="margin: 0px">
      <img src="${image.path}" />
      </body>`,
    });
    this.Html2Pdf.prepare({
      saveName: (html) => html.replaceAll("\\", "-"),
      saveDir: exportDir,
      tmpDir: tmpDir,
    });

    this.prepared = true;
  }

  async convert(file: Dirent): Promise<Pdf> {
    this.checkIfPrepared();
    if (!file.isFile()) {
      throw new Error("Only files can be converted to PDFs.");
    }

    if (this.logging) {
      console.log(`\u001b[33m Converting ${file.name} to PDF ...\u001b[0m`);
    }

    let path = `${file.path}\\${file.name}`;

    let image = await this.File2Image.convert(file);
    let html = await this.Image2Html.convert(image);
    return this.Html2Pdf.convert(html, path);
  }
}
