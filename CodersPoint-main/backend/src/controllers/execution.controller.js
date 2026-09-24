import { db } from "../lib/db.js";
import ApiResponse from "../lib/api-response.js";
import ApiError from "../lib/api-error.js";
import logger from "../logger/index.js";
import {
    getJudge0LanguageId,
    submitBatch,
    poolBatchResults,
} from "../lib/judge0.js";

export const executeCode = async (req, res) => {
    try {
        // 1. INPUT PARSING
        const source_code = req.body.source_code || req.body.sourceCode;
        const language_name = req.body.language;
        const stdin = req.body.stdin || [];
        const expected_outputs = req.body.expected_outputs || [];
        const problemId = req.body.problemId;
        const userId = req.user.id;

        if (!source_code || !language_name) {
            const error = new ApiError(400, "source_code and language are required.");
            return res.status(error.statusCode).json(error);
        }

        const language_id = getJudge0LanguageId(language_name);
        if (!language_id) {
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

        // 3. RUN AGAINST JUDGE0
        const submissions = inputs.map((input, i) => ({
            source_code,
            language_id,
            stdin: input,
            expected_output: expected[i],
        }));

        const batchSubmission = await submitBatch(submissions);
        const tokens = batchSubmission.map((s) => s.token);
        const results = await poolBatchResults(tokens);

        // Judge0 status.id 3 = Accepted; anything else is a real failure
        // (Wrong Answer, Compile Error, Runtime Error, Time Limit, etc).
        const detailedResult = results.map((r, i) => ({
            testcase: i + 1,
            passed: r.status.id === 3,
            stdout: r.stdout ? r.stdout.trim() : "",
            expected: expected[i] ?? "",
            stderr: r.stderr || null,
            compiledOutput: r.compile_output || null,
            status: r.status.description,
            memory: r.memory ? `${r.memory} KB` : "N/A",
            time: r.time ? `${r.time} s` : "N/A",
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
                compileOutput:
                    detailedResult.find((r) => r.compiledOutput)?.compiledOutput || "",
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
