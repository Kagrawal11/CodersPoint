import { spawn } from "child_process";
import { writeFile, mkdtemp, rm } from "fs/promises";
import path from "path";
import os from "os";

const RUN_TIMEOUT_MS = 5000;
// Render's free tier is CPU-throttled hard enough that a cold JVM start
// (javac or java) alone can take several seconds - give the JVM more room
// than the lighter JS/Python interpreters get.
const JVM_TIMEOUT_MS = 15000;
const MAX_OUTPUT_CHARS = 100_000;

// ponytail: no external judge available (no VPS, no whitelisted public API),
// so code runs in-process as a locked-down child: env is stripped to just
// PATH (no DB URL / JWT secret reach user code), a hard wall-clock timeout,
// and each run gets its own throwaway temp dir. JavaScript additionally gets
// Node's --permission model (no fs writes / child_process / worker threads).
// Network access is NOT sandboxed by any of this - not safe for a
// high-trust/high-traffic deployment. Upgrade to a real self-hosted
// Judge0/Piston instance if that ever becomes affordable.
const SAFE_ENV = { PATH: process.env.PATH };

const runProcess = (command, args, { cwd, stdin, timeoutMs = RUN_TIMEOUT_MS } = {}) => {
    return new Promise((resolve) => {
        let child;
        try {
            child = spawn(command, args, {
                cwd,
                env: SAFE_ENV,
                timeout: timeoutMs,
                killSignal: "SIGKILL",
            });
        } catch (err) {
            return resolve({ stdout: "", stderr: err.message, timedOut: false, code: 1 });
        }

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (d) => {
            if (stdout.length < MAX_OUTPUT_CHARS) stdout += d;
        });
        child.stderr.on("data", (d) => {
            if (stderr.length < MAX_OUTPUT_CHARS) stderr += d;
        });

        child.on("error", (err) => {
            resolve({ stdout: "", stderr: err.message, timedOut: false, code: 1 });
        });

        child.on("close", (code, signal) => {
            resolve({
                stdout,
                stderr,
                timedOut: signal === "SIGTERM" || signal === "SIGKILL",
                code,
            });
        });

        child.stdin.write(stdin || "");
        child.stdin.end();
    });
};

const tempDir = (prefix) => mkdtemp(path.join(os.tmpdir(), prefix));
const cleanup = (dir) => rm(dir, { recursive: true, force: true }).catch(() => {});

export const runJavaScript = async (source_code, stdin) => {
    const dir = await tempDir("js-");
    try {
        const file = path.join(dir, "main.js");
        await writeFile(file, source_code);
        return await runProcess(
            process.execPath,
            ["--permission", `--allow-fs-read=${file}`, "--max-old-space-size=64", file],
            { stdin }
        );
    } finally {
        cleanup(dir);
    }
};

export const runPython = async (source_code, stdin) => {
    const dir = await tempDir("py-");
    try {
        const file = path.join(dir, "main.py");
        await writeFile(file, source_code);
        const pythonBin = process.platform === "win32" ? "python" : "python3";
        return await runProcess(pythonBin, [file], { stdin });
    } finally {
        cleanup(dir);
    }
};

// Java needs a compile step shared across all test cases - compiling once
// per test case would multiply JVM/javac startup cost by the testcase count.
export const compileJava = async (source_code) => {
    const dir = await tempDir("java-");
    const file = path.join(dir, "Main.java");
    await writeFile(file, source_code);
    const compile = await runProcess("javac", ["Main.java"], { cwd: dir, timeoutMs: JVM_TIMEOUT_MS });

    if (compile.code !== 0) {
        cleanup(dir);
        return { ok: false, result: compile };
    }
    return { ok: true, dir };
};

export const runCompiledJava = (dir, stdin) =>
    runProcess("java", ["-cp", dir, "Main"], { stdin, timeoutMs: JVM_TIMEOUT_MS });

export const cleanupJava = cleanup;
