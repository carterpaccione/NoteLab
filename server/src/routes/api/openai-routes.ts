// import { type Request, type Response } from 'express';
// import { ChatOpenAI } from '@langchain/openai';
// import { MessageContent } from '@langchain/core/messages';
// import { PromptTemplate } from "@langchain/core/prompts";
// import { StructuredOutputParser } from "@langchain/core/output_parsers";
// import dotenv from 'dotenv';

// dotenv.config();

// const apiKey = process.env.OPENAI_API_KEY;
// let model: ChatOpenAI;

// if (apiKey) {
//     model = new ChatOpenAI({
//         temperature: 0.5,
//         openAIApiKey: apiKey,
//         modelName: "gpt-3.5-turbo-1106",
//     });
// } else {
//     console.error('OpenAI API key not found');
// }

// const parser = StructuredOutputParser.fromNamesAndDescriptions({
//     chat: 'A chat message',
//     prompt: 'A prompt message',
//     response: 'A response message',
//     error: 'An error message',
// });

// const formatInstructions = parser.getFormatInstructions();

// const promptTemplate = new PromptTemplate({
//     template: "Chat with the AI",
//     inputVariables: ["chat"],
//     partialVariables: { format_Instructions: formatInstructions },
// });

// const parseResponse = async (response: MessageContent) => {
//     console.log("Response: ", response);
// };