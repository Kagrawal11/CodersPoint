import { db } from "../lib/db.js";
import ApiResponse from "../lib/api-response.js";
import ApiError from "../lib/api-error.js";
import logger from "../logger/index.js";
import {
    runJavaScript,
    runPython,
    compileJava,
    runCompiledJava,
    cleanupJava,
} from "../lib/sandbox.js";

const SUPPORTED_LANGUAGES = ["JAVASCRIPT", "PYTHON", "JAVA"];

const gradeResult = (r, expectedOutput) => {
    if (r.compileError) {
        return { passed: false, stdout: "", stderr: r.stderr, status: "Compilation Error" };
    }

    const timedOut = r.timedOut;
    const runtimeError = !timedOut && r.code !== 0;
    const stdout = r.stdout ? r.stdout.trim() : "";
    const expected = (expectedOutput ?? "").trim();
    const passed = !timedOut && !runtimeError && stdout === expected;

    let status;
    if (timedOut) status = "Time Limit Exceeded";
    else if (runtimeError) status = "Runtime Error";
    else status = passed ? "Accepted" : "Wrong Answer";

    return { passed, stdout, stderr: r.stderr || null, status };
};

// Runs source_code against every input and returns one raw result per input.
// Java compiles once up front and reuses the compiled class for every run;
// JS/Python just spawn an interpreter per test case.
const runAllTestCases = async (language, source_code, inputs) => {
    if (language === "JAVASCRIPT") {
        return Promise.all(inputs.map((input) => runJavaScript(source_code, input)));
    }

    if (language === "PYTHON") {
        return Promise.all(inputs.map((input) => runPython(source_code, input)));
    }

    // JAVA
    const compiled = await compileJava(source_code);
    if (!compiled.ok) {
        const compileFailure = { ...compiled.result, compileError: true };
        return inputs.map(() => compileFailure);
    }
    try {
        return await Promise.all(inputs.map((input) => runCompiledJava(compiled.dir, input)));
    } finally {
        cleanupJava(compiled.dir);
    }
};

export const executeCode = async (req, res) => {
    try {
        // 1. INPUT PARSING
        const source_code = req.body.source_code || req.body.sourceCode;
        const language_name = (req.body.language || "").toUpperCase();
        const stdin = req.body.stdin || [];
        const expected_outputs = req.body.expected_outputs || [];
        const problemId = req.body.problemId;
        const userId = req.user.id;

        if (!source_code || !language_name) {
            const error = new ApiError(400, "source_code and language are required.");
            return res.status(error.statusCode).json(error);
        }

        if (!SUPPORTED_LANGUAGES.includes(language_name)) {
            const error = new ApiError(400, `Unsupported language: ${language_name}`);
            return res.status(error.statusCode).json(error);
        }

        // 2. BUILD TEST CASES
        // "Submit" runs against the problem's stored (hidden) testcases;
        // "Run" uses whatever stdin/expected the client sent for a quick check.
        let inputs, expected;
        if (problemId) {
            const problem = await db.problem.findUnique({ where: { id: problemId } });
            if (!problem) {
                const error = new ApiError(404, "Problem not found.");
                return res.status(error.statusCode).json(error);
            }
            inputs = problem.testcases.map((tc) => tc.input);
            expected = problem.testcases.map((tc) => tc.output);
        } else {
            inputs = Array.isArray(stdin) ? stdin : [stdin || ""];
            expected = Array.isArray(expected_outputs) ? expected_outputs : [];
        }

        // 3. RUN IN THE SANDBOX
        const rawResults = await runAllTestCases(language_name, source_code, inputs);

        const detailedResult = rawResults.map((r, i) => ({
            testcase: i + 1,
            expected: expected[i] ?? "",
            memory: "N/A",
            time: "N/A",
            compiledOutput: null,
            ...gradeResult(r, expected[i]),
        }));

        const allPassed = detailedResult.every((r) => r.passed);

        // 4. RESPONSE HANDLING

        // CASE A: "Run" Button (No Database Save)
        if (!problemId) {
            return res.status(200).json(
                new ApiResponse(200, "Code executed successfully.", {
                    detailedResult,
                    allPassed,
                })
            );
        }

        // CASE B: "Submit" Button (Save to Database)
        const submission = await db.submission.create({
            data: {
                user: { connect: { id: userId } },
                problem: { connect: { id: problemId } },
                sourceCode: source_code,
                language: language_name,
                stdin: inputs.join("\n"),
                stdout: JSON.stringify(detailedResult.map((r) => r.stdout)),
                status: allPassed ? "Accepted" : "Wrong Answer",
                stderr: detailedResult.some((r) => r.stderr)
                    ? JSON.stringify(detailedResult.map((r) => r.stderr))
                    : null,
                compileOutput: "",
                memory: JSON.stringify(detailedResult.map((r) => r.memory)),
                time: JSON.stringify(detailedResult.map((r) => r.time)),
            },
        });

        // Mark problem as solved for the user
        if (allPassed) {
            await db.problemSolved.upsert({
                where: { userId_problemId: { userId, problemId } },
                update: {},
                create: { userId, problemId },
            });
        }

        // Save individual test case results
        await db.testCaseResult.createMany({
            data: detailedResult.map((r) => ({
                submissionId: submission.id,
                testCase: r.testcase,
                passed: r.passed,
                stdout: r.stdout,
                expected: r.expected,
                status: r.status,
                memory: r.memory,
                time: r.time,
                stderr: r.stderr,
                compiledOutput: r.compiledOutput,
            })),
        });

        // Fetch final submission with relations
        const finalSubmission = await db.submission.findUnique({
            where: { id: submission.id },
            include: { testcases: true },
        });

        return res.status(200).json(
            new ApiResponse(200, "Submission processed.", finalSubmission)
        );

    } catch (err) {
        logger.error("Execute Error:", err);
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal Server Error";
        res.status(statusCode).json(new ApiError(statusCode, message));
    }
};
