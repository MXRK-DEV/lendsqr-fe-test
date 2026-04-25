import fs from "fs";
import path from "path";

const batches = [1, 2, 3, 4, 5].map((n) =>
  JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `batches/batch${n}.json`), "utf-8"),
  ),
);

const merged = batches.flat();

fs.writeFileSync(
  path.resolve(__dirname, "../data/users.json"),
  JSON.stringify(merged, null, 2),
);

console.log(`✅ Done — ${merged.length} users written to data/users.json`);
