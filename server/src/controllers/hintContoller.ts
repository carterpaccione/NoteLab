import { type Request, type Response } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { AIMessageChunk } from '@langchain/core/messages';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
let model: ChatOpenAI;

if (apiKey) {
    model = new ChatOpenAI({
        temperature: 0.5,
        openAIApiKey: apiKey,
        modelName: "gpt-3.5-turbo-1106",
    });
} else {
    console.error('OpenAI API key not found');
}

const parser = StructuredOutputParser.fromNamesAndDescriptions({
    hint_one: "The first hint to the problem",
    hint_two: "The second hint to the problem",
    solution: "A written solution to the problem",
    code_solution: "A code solution to the problem (if applicable)",
});

const formatInstructions = parser.getFormatInstructions();

const promptTemplate = new PromptTemplate({
    template: `You are a computer science proffessor, and an expert on data structure and algorithms.
    I am having trouble with this coding problem, {problem}. Please provide two hints, a written solution, and a code solution in TypeScript to the problem.
    The response should be a raw JSON object without markdown blocks structured as follows: {format_instructions}.
    
    Do NOT include \`\`\`json or \`\`\` in the response.`,
    inputVariables: ["problem"],
    partialVariables: { format_instructions: formatInstructions },
});

const formatPrompt = async (input: string): Promise<string> => {
    console.log("Input: ", input);
    const formattedPrompt = await promptTemplate.format({ problem: input });
    console.log("Formatted prompt: ", formattedPrompt);
    return formattedPrompt;
}

const promptFunc = async (input: string): Promise<AIMessageChunk | string> => {
    try {
        if (!model) {
            throw new Error("OpenAI model is not initialized");
        }

        const response = await model.invoke(input);
        return response;
    } catch (err: any) {
        console.error("Error invoking model: ", err);
        return JSON.stringify({
            error: "Error invoking model",
            details: err.messsage,
        })
    }
};

const parseResponse = async (response: string | AIMessageChunk): Promise<{ [key: string]: string }> => {
    try {
        console.log("Raw response before parsing:", response); // <-- Log before parsing

        if (typeof response === "string") {
            // Remove potential markdown code blocks before parsing
            const cleanedResponse = response.replace(/^```json|```$/g, "").trim();
            return JSON.parse(cleanedResponse);
        }

        if (typeof response.content === "string") {
            const cleanedContent = response.content.replace(/^```json|```$/g, "").trim();
            return JSON.parse(cleanedContent);
        }

        return { error: "Unexpected response format" };
    } catch (error: any) {
        console.error("Error parsing response:", error);
        return { error: "Error parsing response", details: error.message };
    }
};

export const getHint = async (req: Request, res: Response): Promise<void> => {
    const problem: string = req.body.problem;

    try {
        if (!problem) {
            res.status(400).json({ error: "Problem not provided" });
        }

        const formattedPrompt: string = await formatPrompt(problem);
        const rawResponse = await promptFunc(formattedPrompt);
        console.log("Raw response: ", rawResponse);

        if (rawResponse) {
            const parsedResponse = await parseResponse(rawResponse);
            const result: { [key: string]: string } = parsedResponse;
            console.log("Result: ", result);
            res.json(result);
        }
    } catch (error) {
        console.error("Error getting hint: ", error);
        res.status(500).json({ error: "Error getting hint" });
    }
};