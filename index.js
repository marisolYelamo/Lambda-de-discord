import { exec as execCb } from "node:child_process";
import { readFile, watch } from "node:fs/promises";
import { promisify } from "node:util";

const exec = promisify(execCb);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildingMessage = () => {
  console.clear();
  process.stdout.write("()=========================================()\n");
  process.stdout.write("// --------------------------------------- //\n");
  process.stdout.write("      Building and executing lambda...\n");
  process.stdout.write("// --------------------------------------- //\n\n");
};

const buildAndExecute = async () => {
  try {
    buildingMessage();
    await exec("npm run build");
    await exec("npm run execute-lambda");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const formatAndLog = (logs) =>
  logs
    .replaceAll("\n", "\n\n")
    .split("\r")
    .forEach((log) => process.stdout.write(`${log}\n`));

const watchForChanges = async function (relativePath, options) {
  try {
    let watching = false;

    const path = new URL(relativePath, import.meta.url);
    const watcher = watch(path, options);

    for await (const event of watcher) {
      if (!watching) {
        watching = true;

        // Logic when file has changed
        const { filename } = event;

        if (filename.includes("lambda.log")) {
          // Wait for logs to be written, avoid duplicate logs
          await wait(1000);
          const filepath = new URL(`./${filename}`, import.meta.url);
          const logs = await readFile(filepath, "utf-8");
          logs.length && formatAndLog(logs);
        } else {
          await buildAndExecute();
        }
      }
      watching = false;
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

buildAndExecute();
watchForChanges("./src", { recursive: true });
watchForChanges("./events");
watchForChanges("./lambda.log");
watchForChanges("./env.json");