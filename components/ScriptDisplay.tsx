
import React from 'react';
import type { ParsedScript } from '../types';
import { Card } from './common/Card';

interface ScriptDisplayProps {
    script: ParsedScript | null;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script }) => {
    return (
        <Card title="Kết Quả Kịch Bản">
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
        </Card>
    );
};
