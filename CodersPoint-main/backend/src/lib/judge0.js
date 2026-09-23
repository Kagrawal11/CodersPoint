import axios from "axios";
import logger from "../logger/index.js";

const options = {
    headers: {
        "Content-Type": "application/json",
        // self-hosted Judge0 (AUTHN_TOKEN in judge0.conf)
        ...(process.env.JUDGE0_AUTH_TOKEN && {
            "X-Auth-Token": process.env.JUDGE0_AUTH_TOKEN,
        }),
        // RapidAPI-hosted Judge0, if used instead
        ...(process.env.RAPID_API_KEY && {
            "x-rapidapi-key": process.env.RAPID_API_KEY,
            "x-rapidapi-host": process.env.RAPID_API_HOST,
        }),
    },
};

export const getJudge0LanguageId = (language) => {
    const languagesMap = {
        JAVA: 62,
        JAVASCRIPT: 63,
        PYTHON: 71,
    };

    return languagesMap[language.toUpperCase()];
};

export const getJudge0LanguageName = (languageId) => {
    const languagesMap = {
        62: "JAVA",
        63: "JAVASCRIPT",
        71: "PYTHON",
    };

    return languagesMap[languageId];
};

export const submitBatch = async (submissions) => {
    const { data } = await axios.post(
        `${process.env.JUDGE0_API_URL}/submissions/batch`,
        { submissions },
        {
            ...options,
            params: {
                base64_encoded: false,
            },
        }
    );

    logger.info(`Data: ${data}`);

    return data;
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const poolBatchResults = async (tokens) => {
    try {
        while (true) {
            const { data } = await axios.get(
                `${process.env.JUDGE0_API_URL}/submissions/batch`,
                {
                    params: {
                        tokens: tokens.join(","),
                        base64_encoded: false,
                    },
                    ...options,
                }
            );

            const results = data.submissions || [];
            // console.log(results);
            const isAllDone =
                results.length > 0 &&
                results.every(
                    (result) => result.status.id !== 1 && result.status.id !== 2
                );

            if (isAllDone) {
                return results;
            }

            await sleep(1000);
        }
    } catch (error) {
        console.log(error);
    }
};
