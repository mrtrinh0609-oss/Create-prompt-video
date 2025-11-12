
import React from 'react';
import type { Language, ParsedScript } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface ScriptGeneratorProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    wordCount: number;
    setWordCount: (count: number) => void;
    scriptIdea: string;
    setScriptIdea: (idea: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    scriptSource: 'idea' | 'paste';
    setScriptSource: (source: 'idea' | 'paste') => void;
    pastedScript: string;
    setPastedScript: (script: string) => void;
    storyStyle: string;
    setStoryStyle: (style: string) => void;
    characterStyle: string;
    setCharacterStyle: (style: string) => void;
    script: ParsedScript | null;
}

const STORY_STYLE_OPTIONS = [
    "Tự động",
    "Hành động", 
    "Phiêu lưu", 
    "Hài hước", 
    "Lãng mạn", 
    "Chính kịch", 
    "Kinh dị", 
    "Giật gân", 
    "Tâm lý tội phạm", 
    "Khoa học viễn tưởng", 
    "Giả tưởng (Fantasy)", 
    "Huyền bí", 
    "Cổ trang", 
    "Sinh tồn", 
    "Hậu tận thế", 
    "Cyberpunk"
];
const CHARACTER_STYLE_OPTIONS = [
    "Điện ảnh (Cinematic)",
    "Hoạt hình Anime",
    "Hoạt hình 3D (Pixar style)",
    "Siêu thực (Surrealism)",
    "Nghệ thuật giả tưởng (Fantasy Art)",
    "Tranh vẽ 2D (2D Illustration)",
    "Tài liệu",
    "Vlog",
    "Game Cinematic",
    "Gothic",
    "Steampunk",
    "Retro thập niên 80",
    "Phim đen trắng (Noir)",
    "Tranh sơn dầu (Oil Painting)"
];

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({
    language, setLanguage, wordCount, setWordCount, scriptIdea, setScriptIdea, onGenerate, isLoading,
    scriptSource, setScriptSource, pastedScript, setPastedScript, storyStyle, setStoryStyle, characterStyle, setCharacterStyle,
    script
}) => {
    return (
        <Card title="1. Kịch Bản">
            <div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tùy chọn kịch bản</label>
                        <div className="flex space-x-2">
                            <button onClick={() => setScriptSource('idea')} className={`flex-1 py-2 rounded-md text-sm transition-colors ${scriptSource === 'idea' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Tạo theo gợi ý</button>
                            <button onClick={() => setScriptSource('paste')} className={`flex-1 py-2 rounded-md text-sm transition-colors ${scriptSource === 'paste' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Dán kịch bản gốc</button>
                        </div>
                    </div>

                    {scriptSource === 'idea' ? (
                        <>
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">Ngôn ngữ</label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as Language)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="vietnamese">Tiếng Việt</option>
                                    <option value="english">Tiếng Anh</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="storyStyle" className="block text-sm font-medium text-gray-300 mb-1">Phong cách truyện</label>
                                <select
                                    id="storyStyle"
                                    value={storyStyle}
                                    onChange={(e) => setStoryStyle(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    {STORY_STYLE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="characterStyle" className="block text-sm font-medium text-gray-300 mb-1">Phong cách nhân vật</label>
                                <select
                                    id="characterStyle"
                                    value={characterStyle}
                                    onChange={(e) => setCharacterStyle(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    {CHARACTER_STYLE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="wordCount" className="block text-sm font-medium text-gray-300 mb-1">Số lượng từ (mặc định {wordCount})</label>
                                <input
                                    id="wordCount"
                                    type="number"
                                    value={wordCount}
                                    onChange={(e) => setWordCount(parseInt(e.target.value, 10))}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="400"
                                />
                            </div>
                            <div>
                                <label htmlFor="scriptIdea" className="block text-sm font-medium text-gray-300 mb-1">Ô nhập gợi ý</label>
                                <textarea
                                    id="scriptIdea"
                                    rows={4}
                                    value={scriptIdea}
                                    onChange={(e) => setScriptIdea(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="VD: Một phi hành gia khám phá ra một hành tinh mới có sự sống..."
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label htmlFor="pastedScript" className="block text-sm font-medium text-gray-300 mb-1">Dán kịch bản JSON tại đây</label>
                            <textarea
                                id="pastedScript"
                                rows={10}
                                value={pastedScript}
                                onChange={(e) => setPastedScript(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                                placeholder='{
    "title": "...",
    "logline": "...",
    "characters": [...],
    "scenes": [...]
    }'
                            />
                        </div>
                    )}
                    <Button onClick={onGenerate} isLoading={isLoading}>
                        {scriptSource === 'idea' ? 'Tạo Toàn Bộ' : 'Xử lý & Tạo'}
                    </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                    {!script ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Kết quả kịch bản sẽ được hiển thị ở đây...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-purple-300">{script.title}</h2>
                                <p className="text-sm text-gray-400 italic mt-1">{script.logline}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-3 text-purple-200">Nhân vật</h3>
                                <ul className="space-y-2">
                                    {script.characters.map(char => (
                                        <li key={char.name}>
                                            <strong className="text-gray-200">{char.name} ({char.gender})</strong>: <span className="text-gray-300">{char.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4 text-purple-200">Phân cảnh</h3>
                                <div className="space-y-5">
                                    {script.scenes.map(scene => (
                                        <div key={scene.scene_number} className="bg-gray-900/50 p-4 rounded-md">
                                            <h4 className="font-bold text-gray-200">SCENE {scene.scene_number}: {scene.setting}</h4>
                                            <p className="text-sm text-purple-300/80 mb-2">{scene.camera_angle}</p>
                                            <p className="text-gray-300 mb-3">{scene.action}</p>
                                            {scene.dialogue && scene.dialogue.length > 0 && (
                                                <div className="pl-4 border-l-2 border-gray-600 space-y-2">
                                                    {scene.dialogue.map((d, index) => (
                                                        <div key={index}>
                                                            <p className="font-semibold text-gray-300">{d.character.toUpperCase()}</p>
                                                            <p className="pl-4 text-gray-200">"{d.line}"</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};