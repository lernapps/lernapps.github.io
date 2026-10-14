// The staged files parse (the pre-commit hook, .githooks/pre-commit): JavaScript with `node --check`, JSON with
// JSON.parse. This repo has no formatter and no linter, and CI runs none; so the hook checks what would break the
// build or the check, nothing more (no YAML parser here: the workflows are checked by GitHub and actionlint). It reads the files in
// the working tree, the staged ones of a usual commit; it prints the problems and exits 1 on any.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";

const staged = spawnSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"], { encoding: "utf8" })
  .stdout.split("\0")
  .filter((path) => path !== "" && existsSync(path));

let problems = 0;
const fail = (path, message) => {
  problems++;
  console.error(`${path}: ${message}`);
};
for (const path of staged) {
  const extension = extname(path);
  try {
    if ([".js", ".mjs", ".cjs"].includes(extension)) {
      const result = spawnSync(process.execPath, ["--check", path], { encoding: "utf8" });
      if (result.status !== 0) fail(path, result.stderr.trim());
    } else if (extension === ".json") {
      JSON.parse(readFileSync(path, "utf8"));
    }
  } catch (error) {
    fail(path, error.message);
  }
}
console.log(`${staged.length} staged files, ${problems} problems`);
process.exitCode = problems === 0 ? 0 : 1;
