import { Command } from "commander";

const cli = new Command();

cli
  .name("CodeAttach")
  .description("Converts code files to images")
  .version("0.0.1");

cli
  .command("split")
  .description("Split a string into substrings and display as an array")
  .argument("<string>", "string to split")
  .option("--first", "display just the first substring")
  .option("-s, --separator <char>", "separator character", ",")
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

cli
  .command("export")
  .description("Export code files to images")
  .argument("<rootDir>", "root directory of code files")
  .argument("<saveDir>", "directory to save images")
  .option("--config <config>", "carbon config file", "local-carbon-config.json")
  .option("--include-regex <regex>", "regex to include files", ".")
  .action((rootDir, saveDir, options) => {
    console.log("Exporting code files to images");
    console.log("Root directory:", rootDir);
    console.log("Save directory:", saveDir);
    console.log("Carbon config:", options.config);
    console.log("Include regex:", new RegExp(options.includeRegex));
  });

cli.parse();
