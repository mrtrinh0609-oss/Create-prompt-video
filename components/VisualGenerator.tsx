
import React from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { CopyButton } from './common/CopyButton';

interface Item {
    key: string;
    name: string;
    description: string;
    visualPrompt: string;
}

interface VisualGeneratorProps {
    title: string;
    items: Item[];
}

const ItemCard: React.FC<{ item: Item }> = ({ item }) => (
    <div className="bg-gray-700 p-3 rounded-lg">
        <h4 className="font-semibold text-purple-200">{item.name}</h4>
        <p className="text-xs text-gray-400 mt-1 mb-2 italic">{item.description}</p>
        
        {item.visualPrompt ? (
            <div>
                <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-gray-300">Prompt Phân Tích:</p>
                    <CopyButton textToCopy={item.visualPrompt} />
                </div>
                <p className="text-xs bg-gray-800 p-2 rounded-md text-gray-400 font-mono">
                    {item.visualPrompt}
                </p>
            </div>
        ) : (
             <div className="bg-gray-800 p-2 rounded-md flex items-center justify-center animate-pulse">
                 <p className="text-xs text-gray-500">Đang tạo prompt phân tích...</p>
             </div>
        )}
    </div>
);


export const VisualGenerator: React.FC<VisualGeneratorProps> = ({ title, items }) => {
    return (
        <Card title={title}>
            {items.length > 0 ? (
                <div className="space-y-4">
                    {items.map((item) => <ItemCard key={item.key} item={item} />)}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Phân tích nhân vật sẽ xuất hiện ở đây...</p>
                </div>
            )}
        </Card>
    );
};
