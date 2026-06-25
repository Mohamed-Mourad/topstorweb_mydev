import React from 'react';
import { Server } from 'lucide-react';

/**
 * ServerNode — selectable cluster-node tile (QuickStor design system).
 * @param {'up'|'down'|'discovered'} state  up→success · down→danger · discovered→brand
 */
const STATUS = {
    up: { dot: 'bg-success-500', label: 'Online', text: 'text-success-700' },
    down: { dot: 'bg-danger-500', label: 'Offline', text: 'text-danger-700' },
    discovered: { dot: 'bg-brand-500', label: 'Discovered', text: 'text-brand-700' },
};

const ServerNode = ({ name, ip, state = 'up', selected = false, className = '', onClick }) => {
    const s = STATUS[state] || STATUS.up;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group flex min-h-[60px] w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors ${
                selected
                    ? 'border-brand-500 bg-brand-50/40 ring-4 ring-brand-100'
                    : 'border-border bg-surface hover:border-border-strong hover:bg-gray-50'
            } ${className}`}
        >
            <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${
                    selected ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'
                }`}
            >
                <Server size={18} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-800">{name}</span>
                <span className="block truncate font-mono text-xs text-gray-500">{ip}</span>
            </span>
            <span className="flex flex-shrink-0 items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${s.dot}`}></span>
                <span className={`hidden text-[11px] font-medium sm:inline ${s.text}`}>{s.label}</span>
            </span>
        </button>
    );
};

export default ServerNode;
