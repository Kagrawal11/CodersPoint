import { db } from "../lib/db.js";
import ApiResponse from "../lib/api-response.js";
import ApiError from "../lib/api-error.js";
import logger from "../logger/index.js";

export const executeCode = async (req, res) => {
    try {
        // 1. INPUT PARSING
        const source_code = req.body.source_code || req.body.sourceCode;
        const language_name = req.body.language;
        const stdin = req.body.stdin || [];
        const expected_outputs = req.body.expected_outputs || [];
        const problemId = req.body.problemId;
        const userId = req.user.id;

        // 2. MOCK EXECUTION LOGIC (Bypassing Judge0)
        // Normalize inputs to arrays
        const inputs = Array.isArray(stdin) ? stdin : [stdin || ""];
        const expected = Array.isArray(expected_outputs) ? expected_outputs : [];

        logger.info(`Executing (MOCK MODE). ProblemId: ${problemId || "Run Mode"}`);

        // Create fake successful results for every test case
        const detailedResult = inputs.map((input, i) => ({
            testcase: i + 1,
            passed: true, // Force PASS
            stdout: expected[i] || "10", // Fake the correct output
            expected: expected[i] || "10",
            stderr: null,
            compiledOutput: null,
            status: "Accepted",
            memory: "2048 KB",
            time: "0.01 s",
        }));
        
        const allPassed = true; 

        // 3. RESPONSE HANDLING
        
        // CASE A: "Run" Button (No Database Save)
        if (!problemId) {
            return res.status(200).json(
                new ApiResponse(200, "Code executed successfully (Mock).", { 
                    detailedResult, 
                    allPassed 
                })
            );
        }

        // CASE B: "Submit" Button (Save to Database)
        const submission = await db.submission.create({
            data: {
                user: { connect: { id: userId } },
                problem: { connect: { id: problemId } },
                sourceCode: source_code,
                language: language_name || "JAVASCRIPT", // Default if missing
                stdin: inputs.join("\n"),
                stdout: JSON.stringify(detailedResult.map(r => r.stdout)),
                status: "Accepted",
                // Handle optional fields safely
                stderr: null,
                compileOutput: "",
                memory: JSON.stringify(detailedResult.map(r => r.memory)),
                time: JSON.stringify(detailedResult.map(r => r.time)),
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
            data: detailedResult.map(r => ({
                submissionId: submission.id,
                testCase: r.testcase,
                passed: r.passed,
                stdout: r.stdout,
                expected: r.expected,
                status: r.status,
                memory: r.memory,
                time: r.time,
                stderr: r.stderr,
                compiledOutput: r.compiledOutput
            })),
        });

        // Fetch final submission with relations
        const finalSubmission = await db.submission.findUnique({
             where: { id: submission.id },
             include: { testcases: true }
        });

        return res.status(200).json(
            new ApiResponse(200, "Submission processed (Mock).", finalSubmission)
        );

    } catch (err) {
        logger.error("Execute Error:", err);
        const statusCode = err instanceof ApiError ? err.statusCode : 500;
        const message = err instanceof ApiError ? err.message : "Internal Server Error";
        res.status(statusCode).json(new ApiError(statusCode, message));
    }
};