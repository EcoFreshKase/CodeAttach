import { BaseConverter, Converter } from "./converter";

interface Props {
  embedInHtml: (image: Image) => string;
}

/**
 * Converts images to HTML.
 */
export class ImageToHtmlConverter
  extends BaseConverter
  implements Converter<Image, string>
{
  private embedInHtml: (image: Image) => string; // Function to embed the image in HTML

  public constructor(logging: boolean) {
    super(logging);
    this.embedInHtml = () => "";
  }

  public async prepare({ embedInHtml }: Props): Promise<void> {
    this.embedInHtml = embedInHtml;

    this.prepared = true;
  }

  convert(base: Image): Promise<string> {
    this.checkIfPrepared();

    if (this.logging) {
      console.log(`\u001b[33m Converting ${base.path} to HTML ...\u001b[0m`);
    }

    return Promise.resolve(this.embedInHtml(base));
  }
}
