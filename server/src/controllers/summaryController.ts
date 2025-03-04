import { type Request, type Response } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { AIMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
let model: ChatOpenAI;

if (apiKey) {
    model = new ChatOpenAI({
        temperature: 0.5,
        openAIApiKey: apiKey,
        modelName: "gpt-3.5-turbo",
    });
} else {
    console.error('OpenAI API key not found');
}

const parser = StructuredOutputParser.fromNamesAndDescriptions({
    summary: "A summary of the topic or question",
})

const formatInstructions = parser.getFormatInstructions();

const promptTemplate = new PromptTemplate({
    template: `You are a teacher's assistant for a computer science class. You are tasked with summarizing the following topic or question: {prompt}.
    The response should be a raw JSON object without markdown blocks structured as follows: {format_instructions}.`,
    inputVariables: ["prompt"],
    partialVariables: { format_instructions: formatInstructions },
});

const formatPrompt = async (input: string): Promise<string> => {
    console.log("Prompt Input: ", input);
    const formattedPrompt = await promptTemplate.format({ prompt: input });
    console.log("Formatted prompt: ", formattedPrompt);
    return formattedPrompt;
};

const promptFunc = async (input: string): Promise<AIMessage | string> => {
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

const parseResponse = async (response: string | AIMessage): Promise<{ [key: string]: string }> => {
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

export const getSummary = async (req: Request, res: Response): Promise<void> => {
    const prompt: string = req.body.prompt;

    try {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

        const formattedPrompt = await formatPrompt(prompt);
        const rawResponse = await promptFunc(formattedPrompt);
        console.log("Raw response: ", rawResponse);
        if (rawResponse) {
            const parsedResponse = await parseResponse(rawResponse);
            const result: { [key: string]: string } = parsedResponse;
            res.json(result);
        }
    } catch (err: any) {
        console.error("Error getting summary: ", err);
        res.status(400).json({ error: err.message });
    }
};