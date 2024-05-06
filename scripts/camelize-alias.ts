import { createReadStream, createWriteStream } from "fs";
import { createInterface } from "readline";

import { camelize } from "./libs/camelize";
import { z } from "zod";

const camelizeAlias = async (filePath: string) => {
  const rs = createReadStream(filePath, {
    encoding: "utf-8",
  });
  const rl = createInterface({ input: rs });

  const outputLines: string[] = [];

  await new Promise<void>((resolve) => {
    rl.on("line", (line) => {
      const outputLine = line.match(/^\s*alias:/) ? camelize(line) : line;

      outputLines.push(outputLine);
    });

    rl.on("close", () => {
      createWriteStream(filePath, { encoding: "utf-8" }).write(
        outputLines.join("\n") + "\n",
      );

      resolve();
    });
  });
};

await camelizeAlias(z.string().parse(process.argv[2]));
