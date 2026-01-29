import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Chat configuration
export const chatConfig = {
    model: "gpt-4o-mini",
    temperature: 1,
    max_tokens: 8192,
};

// Code generation configuration
export const codeGenConfig = {
    model: "gpt-4o-mini",
    temperature: 1,
    max_tokens: 8192,
    response_format: { type: "json_object" },
};

// Enhance prompt configuration
export const enhancePromptConfig = {
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 1000,
};

// System message for code generation
export const codeGenSystemMessage = `You are a React code generator. Generate a Project in React. Create multiple components, organizing them in a folder structure.

Return the response in JSON format with the following schema:
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": []
}

Generate a programming code structure for a React project using Vite.
Do not create a App.jsx file. There is a App.js file in the project structure, rewrite it.
Use Tailwind css for styling.

Ensure the files field contains all the created files, and the generatedFiles field contains the list of generated files.

Additionally, include an explanation of the project's structure, purpose, and additional instructions:
- For placeholder images, please use https://archive.org/download/
- Add Emoji icons whenever needed to give a good user experience
- The lucide-react library is also available to be imported IF NECESSARY.`;

export default openai;
