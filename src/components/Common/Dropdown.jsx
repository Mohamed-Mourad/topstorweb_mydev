import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

/**
 * Dropdown — QuickStor design-system select (single / multi).
 * onChange returns a string (single) or string[] (multi). isMulti renders
 * removable brand chips. Click-outside + Escape close.
 */
const Dropdown = ({ options, value, onChange, placeholder = 'Select…', disabled, className = '', isMulti = false, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        };
        const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKey);
        };
    }, []);

    const isSelected = (optValue) =>
        isMulti ? Array.isArray(value) && value.includes(optValue) : String(optValue) === String(value);

    const handleSelect = (optValue) => {
        if (isMulti) {
            const next = value.includes(optValue) ? value.filter((v) => v !== optValue) : [...value, optValue];
            onChange(next);
        } else {
            onChange(optValue);
            setIsOpen(false);
        }
    };

    const selectedSingle = options.find((o) => String(o.value) === String(value));
    const selectedChips = isMulti ? options.filter((o) => isSelected(o.value)) : [];
    const hasValue = isMulti ? selectedChips.length > 0 : !!selectedSingle;

    return (
        <div className={`flex flex-col ${className}`} ref={containerRef}>
            {label && <span className="mb-1.5 text-sm font-medium text-gray-700">{label}</span>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen((o) => !o)}
                    disabled={disabled}
                    className={`flex w-full items-center justify-between gap-2 rounded-md border bg-surface px-3 py-2.5 text-left text-sm transition-colors ${
                        isOpen ? 'border-brand-500 ring-4 ring-brand-100' : 'border-border'
                    } ${disabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'hover:border-border-strong'}`}
                >
                    {isMulti ? (
                        hasValue ? (
                            <span className="flex flex-wrap gap-1.5">
                                {selectedChips.map((opt) => (
                                    <span
                                        key={opt.value}
                                        className="inline-flex items-center gap-1 rounded-sm bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700"
                                    >
                                        {opt.label}
                                        {!disabled && (
                                            <X
                                                size={12}
                                                className="cursor-pointer text-brand-400 hover:text-brand-700"
                                                onClick={(e) => { e.stopPropagation(); handleSelect(opt.value); }}
                                            />
                                        )}
                                    </span>
                                ))}
                            </span>
                        ) : (
                            <span className="text-gray-400">{placeholder}</span>
                        )
                    ) : (
                        <span className={selectedSingle ? 'text-gray-800' : 'text-gray-400'}>
                            {selectedSingle ? selectedSingle.label : placeholder}
                        </span>
                    )}
                    <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute left-0 top-full z-[100] mt-1 w-full overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg">
                        <div className="max-h-60 overflow-y-auto">
                            {options.length === 0 ? (
                                <div className="px-3 py-2.5 text-center text-sm text-gray-400">No options available</div>
                            ) : (
                                options.map((opt) => {
                                    const sel = isSelected(opt.value);
                                    return (
                                        <button
                                            type="button"
                                            key={opt.value}
                                            onClick={() => handleSelect(opt.value)}
                                            className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                                                sel ? 'bg-brand-50 font-medium text-brand-700' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2.5">
                                                {isMulti && (
                                                    <span className={`flex h-4 w-4 items-center justify-center rounded border ${sel ? 'border-brand-600 bg-brand-600' : 'border-border bg-surface'}`}>
                                                        {sel && <Check size={11} className="text-white" />}
                                                    </span>
                                                )}
                                                {opt.label}
                                            </span>
                                            {!isMulti && sel && <Check size={14} className="text-brand-600" />}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
