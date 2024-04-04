import { execSync } from "child_process";

/**
 * Converts a file to an image using carbon-now-cli. Uses the default preset defined in the local-carbon-config.json file.
 * @param filePath Path to the file to convert
 * @param saveDir Directory to save the image in
 * @returns The name of the saved image
 */
export function convertToImage(filePath: string, saveDir: string) {
  let savesIn = filePath.replaceAll("\\", "-");
  console.log(`Converting ${filePath} ...`);
  let process = execSync(
    `npx carbon-now "${filePath}" --config .\\local-carbon-config.json -p default --save-to "${saveDir}" --save-as "${savesIn}"`
  );
  console.log(`Converted ${filePath} to ${savesIn}`);

  return savesIn;
}