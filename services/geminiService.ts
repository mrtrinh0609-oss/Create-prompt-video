
import { GoogleGenAI, Type } from '@google/genai';
import type { ParsedScript, Character, Language } from '../types';

const parseJsonFromMarkdown = (md: string): any => {
    const jsonMatch = md.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
        try {
            return JSON.parse(jsonMatch[1]);
        } catch (e) {
            console.error("Failed to parse JSON from markdown", e);
            throw new Error("Invalid JSON format in model response.");
        }
    }
    // Fallback for cases where the model returns raw JSON without markdown
    try {
        return JSON.parse(md);
    } catch(e) {
        throw new Error("No JSON block found in markdown response, and raw text is not valid JSON.");
    }
};


export const generateScript = async (apiKey: string, idea: string, language: Language, wordCount: number, storyStyle: string, characterStyle: string): Promise<ParsedScript> => {
    const ai = new GoogleGenAI({ apiKey });
    
    const langInstruction = language === 'vietnamese' ? 'Vietnamese' : 'English';

    const storyStyleInstruction = storyStyle === 'Tự động'
        ? 'You must automatically select the most appropriate and creative story style based on the user\'s idea.'
        : `The script must be in a "${storyStyle}" style.`;

    const prompt = `
You are a professional screenwriter. Create a script based on the following idea: "${idea}".
${storyStyleInstruction}
The characters must be designed in a "${characterStyle}" style.
The script should be approximately ${wordCount} words long and in ${langInstruction}.
Your output MUST be a single JSON object wrapped in a markdown code block (\`\`\`json ... \`\`\`. Do not include any text outside of this block.
The JSON object must have the following structure:
{
  "title": "A creative title for the script",
  "logline": "A one-sentence summary of the script",
  "characters": [
    { "name": "Character Name", "description": "A brief description of the character's appearance and personality.", "gender": "The character's gender (e.g., male, female, non-binary)." }
  ],
  "scenes": [
    {
      "scene_number": 1,
      "setting": "Description of the location and time. e.g., INT. COFFEE SHOP - DAY",
      "camera_angle": "A suggested camera angle or shot, e.g., CLOSE UP on a coffee cup.",
      "action": "Description of what is happening in the scene.",
      "dialogue": [
        { "character": "Character Name", "line": "The character's dialogue." }
      ]
    }
  ]
}
Ensure the JSON is well-formed.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    
    return parseJsonFromMarkdown(response.text);
};

export const generateVisuals = async (apiKey: string, description: string, language: Language, characterStyle: string): Promise<{ visualPrompt: string }> => {
    const ai = new GoogleGenAI({ apiKey });

    const langInstruction = language === 'vietnamese' ? 'Vietnamese' : 'English';
    const promptForPrompt = `
You are an AI assistant specializing in creating prompts for image generation models.
Based on the following description in ${langInstruction}: "${description}".
Create a detailed, vivid, and artistic prompt in English for an image generation model in a "${characterStyle}" style. The prompt should be a single paragraph. Focus on visual details like lighting, color, style, composition, and mood.
For characters, describe their clothing, facial expression, and posture. For scenes, describe the environment, architecture, and atmosphere.
Add style keywords appropriate for a "${characterStyle}" look, such as: "cinematic still, hyperrealistic, epic detail, 8k, dramatic lighting, masterpiece".
Your response should be only the prompt text, with no preamble.
`;
    const promptResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptForPrompt,
    });
    
    const visualPrompt = promptResponse.text;
    
    return { visualPrompt };
};

export const generateVeoPrompt = async (apiKey: string, script: ParsedScript, characters: Character[], language: Language, characterStyle: string): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey });

    const langInstruction = language === 'vietnamese' ? 'Vietnamese' : 'English';

    const prompt = `
You are an expert AI assistant creating a series of structured prompts for the Veo video generation model. Your task is to translate a script into a sequence of detailed shots.

For each scene in the provided script, you will generate one or more prompts. Each prompt MUST be a self-contained block of text starting with "--- PROMPT START ---" on a new line.

Each prompt block MUST follow this exact English structure:

--- PROMPT START ---
Character Style: [Overall character style]
Setting: [Scene setting]
Camera Angle: [Camera angle]
Action:
"[Character 1 visual prompt]": [Character 1 action]
"[Character 2 visual prompt]": [Character 2 action]
Dialogue:
"[Character 1 visual prompt]" says (voice: [gender], language: ${langInstruction}): [Character 1 dialogue]
"[Character 2 visual prompt]" says (voice: [gender], language: ${langInstruction}): [Character 2 dialogue]

CRITICAL RULES:
1.  **Start Delimiter**: Every new prompt MUST begin with "--- PROMPT START ---" on its own line.
2.  **Labels**: You MUST use these exact English labels followed by a colon: "Character Style:", "Setting:", "Camera Angle:", "Action:", "Dialogue:". The "Action" and "Dialogue" labels should be on their own lines.
3.  **Character Consistency**: For each action or dialogue line, you MUST use the character's complete, unmodified visual prompt (provided below) enclosed in double quotes. This is essential for visual consistency.
4.  **Action Section**:
    - Under the "Action:" label, list all characters involved in the action.
    - Each character's action must be on a new line, formatted as: ""[Character's visual prompt]": [character's action from the script]".
    - If the script's action description involves multiple characters, break it down and assign the relevant action to each character.
5.  **Dialogue Section**:
    - If there is dialogue in the shot, under the "Dialogue:" label, list each line of dialogue.
    - Each line must be on a new line, formatted as: ""[Character's visual prompt]" says (voice: [gender], language: ${langInstruction}): [character's dialogue]". The dialogue content itself should remain in the original script language.
    - The voice gender must be derived from the character's "gender" property.
    - **If there is NO dialogue in the shot, you MUST write "No dialogue" on the line directly following "Dialogue:".**
6.  **One Prompt per Shot**: Generate one prompt for each distinct shot or action sequence within a scene. A single scene from the script might become multiple prompts.
7.  **Dialogue Length**: The total dialogue in a single prompt MUST be short enough to be spoken in under 8 seconds. If a scene's dialogue is longer than this, you MUST split it into multiple, sequential prompts. A long monologue should be broken into smaller chunks across several prompts, and a back-and-forth conversation should be split into separate prompts for each character's line or turn.

Here is the data you will use:
Overall Character Style: "${characterStyle}"
Language for Dialogue: "${langInstruction}"

Character Visuals (Use these exact descriptions):
${characters.map(c => `- ${c.name} (${c.gender}): ${c.visualPrompt}`).join('\n')}

Script Scenes:
${JSON.stringify(script.scenes, null, 2)}

Your entire output must be only the sequence of prompt blocks. Do not add any other explanations or text.
`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });

    const rawPrompts = response.text.split('--- PROMPT START ---').filter(p => p.trim() !== '');
    return rawPrompts.map(p => p.trim());
};
