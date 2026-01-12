import React from 'react';

interface LinkifyProps {
    text: string;
    className?: string;
}

export function Linkify({ text, className }: LinkifyProps) {
    if (!text) return null;

    // Split text by URLs
    const parts = text.split(/(https?:\/\/[^\s]+)/g);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                // Check if this part is a URL
                if (part.match(/^https?:\/\/[^\s]+$/)) {
                    return (
                        <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline hover:underline-offset-2 transition-colors break-words"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {part}
                        </a>
                    );
                }
                return part;
            })}
        </span>
    );
}
