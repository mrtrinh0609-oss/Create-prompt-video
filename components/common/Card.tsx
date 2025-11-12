
import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, actions }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-300">{title}</h2>
                {actions && <div className="flex-shrink-0">{actions}</div>}
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                {children}
            </div>
        </div>
    );
};
   