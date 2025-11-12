
import React from 'react';
import { Card } from './common/Card';
import { CopyButton } from './common/CopyButton';
import { Button } from './common/Button';

interface VeoPromptGeneratorProps {
    isLoading: boolean;
    prompts: string[];
    onUpdatePrompt: (index: number, newText: string) => void;
    onGenerate: () => void;
    disabled: boolean;
}

export const VeoPromptGenerator: React.FC<VeoPromptGeneratorProps> = ({ 
    isLoading, prompts, onUpdatePrompt, onGenerate, disabled
}) => {
    return (
        <Card title="3. Prompt Veo">
             <div className="mb-4">
                <Button onClick={onGenerate} isLoading={isLoading} disabled={disabled}>
                    Tạo Prompt Veo
                </Button>
            </div>
             <div className="space-y-4">
                {isLoading && (
                    <div className="flex items-center justify-center h-48">
                         <div className="flex flex-col items-center text-gray-500">
                             <svg className="animate-spin h-8 w-8 text-purple-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Đang tạo prompt cho Veo...</span>
                        </div>
                    </div>
                )}

                {!isLoading && prompts.length === 0 && (
                    <div className="flex items-center justify-center h-48">
                        <p className="text-gray-500 text-center">Bấm nút trên để tạo prompt cho Veo sau khi có kịch bản và phân tích nhân vật.</p>
                    </div>
                )}
                
                {!isLoading && prompts.map((prompt, index) => (
                    <div key={index} className="bg-gray-900 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-gray-300">Prompt {index + 1}</label>
                            <CopyButton textToCopy={prompt} />
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => onUpdatePrompt(index, e.target.value)}
                            rows={4}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 text-sm text-gray-200 font-mono"
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
};
