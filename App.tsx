
import React, { useState, useCallback } from 'react';
import type { ParsedScript, Character, Language } from './types';
import { ScriptGenerator } from './components/ScriptGenerator';
import { VisualGenerator } from './components/VisualGenerator';
import { VeoPromptGenerator } from './components/VeoPromptGenerator';
import { generateScript, generateVisuals, generateVeoPrompt } from './services/geminiService';

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string>('');
    const [language, setLanguage] = useState<Language>('vietnamese');
    const [wordCount, setWordCount] = useState<number>(400);
    const [scriptIdea, setScriptIdea] = useState<string>('');
    const [pastedScript, setPastedScript] = useState<string>('');
    const [scriptSource, setScriptSource] = useState<'idea' | 'paste'>('idea');
    const [storyStyle, setStoryStyle] = useState<string>('Tự động');
    const [characterStyle, setCharacterStyle] = useState<string>('Điện ảnh (Cinematic)');
    
    const [parsedScript, setParsedScript] = useState<ParsedScript | null>(null);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [veoPrompts, setVeoPrompts] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingVeo, setIsGeneratingVeo] = useState(false);

    const handleStartGeneration = useCallback(async () => {
        if (!apiKey) {
            alert('Vui lòng nhập Google AI API Key của bạn.');
            return;
        }
        setIsGenerating(true);
        setParsedScript(null);
        setCharacters([]);
        setVeoPrompts([]);

        try {
            // Step 1: Generate Script
            let scriptObject: ParsedScript;
            if (scriptSource === 'idea') {
                if (!scriptIdea) {
                    alert('Vui lòng nhập gợi ý kịch bản.');
                    setIsGenerating(false);
                    return;
                }
                scriptObject = await generateScript(apiKey, scriptIdea, language, wordCount, storyStyle, characterStyle);
            } else {
                if (!pastedScript) {
                    alert('Vui lòng dán kịch bản vào ô nhập.');
                    setIsGenerating(false);
                    return;
                }
                try {
                    scriptObject = JSON.parse(pastedScript);
                    if (!scriptObject.title || !scriptObject.characters || !scriptObject.scenes) {
                        throw new Error('Cấu trúc kịch bản không hợp lệ.');
                    }
                } catch (e) {
                    console.error("Pasted script parsing error:", e);
                    alert('Kịch bản đã dán không hợp lệ. Vui lòng kiểm tra lại định dạng JSON.');
                    setIsGenerating(false);
                    return;
                }
            }

            if (!scriptObject || !scriptObject.scenes) {
                throw new Error("Kịch bản không hợp lệ hoặc không thể tạo.");
            }

            setParsedScript(scriptObject);
            const initialCharacters = scriptObject.characters.map(c => ({ ...c, visualPrompt: '' }));
            setCharacters(initialCharacters);

            // Step 2: Generate Visuals (Prompts only)
            await Promise.all(
                initialCharacters.map(async (character) => {
                    try {
                        const { visualPrompt } = await generateVisuals(apiKey, character.description, language, characterStyle);
                        const updatedCharacter = { ...character, visualPrompt };
                        setCharacters(prev => prev.map(c => c.name === updatedCharacter.name ? updatedCharacter : c));
                        return updatedCharacter;
                    } catch (error) {
                        console.error(`Error generating visuals for ${character.name}`, error);
                        return character; 
                    }
                })
            );

        } catch (error: any) {
            console.error('Error during generation process:', error);
            alert(`Đã xảy ra lỗi trong quá trình tạo: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    }, [apiKey, scriptSource, scriptIdea, language, wordCount, pastedScript, storyStyle, characterStyle]);

    const handleGenerateVeoPrompts = useCallback(async () => {
        if (!apiKey || !parsedScript || characters.some(c => !c.visualPrompt)) {
            alert('Vui lòng tạo kịch bản và phân tích nhân vật trước khi tạo prompt Veo.');
            return;
        }
        setIsGeneratingVeo(true);
        setVeoPrompts([]);

        try {
            const prompts = await generateVeoPrompt(apiKey, parsedScript, characters, language, characterStyle);
            setVeoPrompts(prompts);
        } catch (error: any) {
            console.error('Error during Veo prompt generation:', error);
            alert(`Đã xảy ra lỗi khi tạo prompt Veo: ${error.message}`);
        } finally {
            setIsGeneratingVeo(false);
        }
    }, [apiKey, parsedScript, characters, language, characterStyle]);


    const handleUpdateVeoPrompt = (index: number, newText: string) => {
        setVeoPrompts(prev => prev.map((prompt, i) => i === index ? newText : prompt));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
            <header className="text-center mb-6">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    AI Video Script & Prompt Generator
                </h1>
                <p className="text-gray-400 mt-2">Công cụ tạo kịch bản và prompt video tự động</p>
            </header>

            <div className="max-w-xl mx-auto mb-8">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                    Google AI API Key
                </label>
                <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Nhập API key của bạn vào đây"
                />
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <ScriptGenerator
                    language={language}
                    setLanguage={setLanguage}
                    wordCount={wordCount}
                    setWordCount={setWordCount}
                    scriptIdea={scriptIdea}
                    setScriptIdea={setScriptIdea}
                    onGenerate={handleStartGeneration}
                    isLoading={isGenerating}
                    scriptSource={scriptSource}
                    setScriptSource={setScriptSource}
                    pastedScript={pastedScript}
                    setPastedScript={setPastedScript}
                    storyStyle={storyStyle}
                    setStoryStyle={setStoryStyle}
                    characterStyle={characterStyle}
                    setCharacterStyle={setCharacterStyle}
                    script={parsedScript}
                />
                
                <VisualGenerator
                    title="2. Phân Tích Nhân Vật"
                    items={characters.map(c => ({ key: c.name, name: c.name, description: c.description, visualPrompt: c.visualPrompt }))}
                />
                
                <VeoPromptGenerator
                    isLoading={isGeneratingVeo}
                    prompts={veoPrompts}
                    onUpdatePrompt={handleUpdateVeoPrompt}
                    onGenerate={handleGenerateVeoPrompts}
                    disabled={!parsedScript || isGenerating || characters.length === 0}
                />
            </main>
        </div>
    );
};

export default App;
