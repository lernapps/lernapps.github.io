// The pre-push hook (scripts/pre-push.mjs): it runs the classifier CI runs, and a push of only the plan checks nothing.
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";
import { prePush, TOOLING_REF } from "../scripts/pre-push.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("the hook's classifier is the commit of the workflows' changes.yml and tooling-ref", () => {
  const workflows = join(repo, ".github", "workflows");
  const refs = readdirSync(workflows).flatMap((name) =>
    [...readFileSync(join(workflows, name), "utf8").matchAll(/(?:changes\.yml@|tooling-ref:\s*)([0-9a-f]{40})/g)].map(
      (match) => `${name}: ${match[1]}`,
    ),
  );
  assert.ok(refs.length > 0, "a workflow calls changes.yml");
  for (const ref of refs) assert.equal(ref.split(": ")[1], TOOLING_REF, ref);
});

test("a push of only the plan checks nothing", { timeout: 120_000 }, () => {
  const dir = mkdtempSync(join(tmpdir(), "lernapps-pre-push-"));
  try {
    const git = (...args) => spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.org", ...args], { cwd: dir, encoding: "utf8" });
    git("init", "--quiet");
    copyFileSync(join(repo, "package.json"), join(dir, "package.json"));
    git("add", ".");
    git("commit", "--quiet", "-m", "base");
    const base = git("rev-parse", "HEAD").stdout.trim();
    mkdirSync(join(dir, ".vibe"));
    writeFileSync(join(dir, ".vibe", "plan.md"), "# Plan\n");
    git("add", ".");
    git("commit", "--quiet", "-m", "plan");
    const head = git("rev-parse", "HEAD").stdout.trim();
    let output = "";
    const code = prePush(`refs/heads/x ${head} refs/heads/x ${base}\n`, {
      cwd: dir,
      write: (text) => (output += text),
      run: () => assert.fail("a push of only the plan runs no step"),
    });
    assert.equal(code, 0, output);
    assert.match(output, /^lernapps pre-push: nothing to check, the push changes only the plan \(.*\)\n$/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
