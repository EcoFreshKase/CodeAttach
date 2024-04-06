import { Dirent } from "fs";
import { BaseConverter, Converter } from "./converter";
import { execSync } from "child_process";

interface Props {
  exportDir: string;
  carbonConfig: string;
  saveName: (file: Dirent) => string;
}

/**
 * Converts files to images.
 */
export class FileToImageConverter
  extends BaseConverter
  implements Converter<Dirent, Image>
{
  saveDir: string; // Directory to save the converted files in
  carbonConfig: string; // Path to the carbon config file
  saveName: (file: Dirent) => string; // Function to generate the name of the saved image

  /**
   * Empty Constructor. Only initializes all members. Call prepare before using the class instance.
   */
  public constructor(logging: boolean) {
    super(logging);
    this.saveDir = "";
    this.carbonConfig = "";
    this.saveName = () => "";
  }

  public async prepare({ exportDir: saveDir, carbonConfig, saveName }: Props) {
    this.saveDir = saveDir;
    this.carbonConfig = carbonConfig;
    this.saveName = saveName;

    this.prepared = true;
  }

  convert(file: Dirent): Promise<Image> {
    this.checkIfPrepared();
    if (!file.isFile()) {
      throw new Error("Only files can be converted to images.");
    }

    if (this.logging) {
      console.log(`\u001b[33m Converting ${file.name} to image ...\u001b[0m`);
    }

    let savesIn = this.saveName(file);
    let fileName = `${file.path}\\${file.name}`;

    let process = execSync(
      `npx carbon-now "${fileName}" --config ${this.carbonConfig} -p default --save-to "${this.saveDir}" --save-as "${savesIn}"`
    );

    return Promise.resolve({ path: `${savesIn}.png` });
  }
}
