import React from 'react';

/**
 * Input — QuickStor design system. Label above, optional leading icon, optional
 * error / hint helper text. Focus = brand border + ring-4 ring-brand-100.
 */
const Input = ({
    type = 'text',
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    className = '',
    icon,
    required = false,
    id,
    min,
    max,
    step,
    error,
    hint,
    isTextArea = false,
    rows = 3,
}) => {
    const base =
        'w-full rounded-md border bg-surface text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors ' +
        (error
            ? 'border-danger-500 focus:border-danger-500 focus:ring-4 focus:ring-danger-100'
            : 'border-border focus:border-brand-500 focus:ring-4 focus:ring-brand-100') +
        (disabled ? ' bg-gray-50 text-gray-400 cursor-not-allowed' : '');
    const pad = icon ? 'py-2.5 pl-9 pr-3' : 'px-3 py-2.5';
    const inputClasses = `${base} ${isTextArea ? 'px-3 py-2.5 resize-none' : pad}`;

    return (
        <div className={`flex flex-col ${className}`}>
            {label && <label className="mb-1.5 text-sm font-medium text-gray-700">{label}</label>}
            <div className="relative">
                {isTextArea ? (
                    <textarea
                        id={id}
                        required={required}
                        disabled={disabled}
                        placeholder={placeholder}
                        className={inputClasses}
                        value={value}
                        onChange={onChange}
                        rows={rows}
                    />
                ) : (
                    <input
                        type={type}
                        id={id}
                        required={required}
                        disabled={disabled}
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        step={step}
                        className={inputClasses}
                        value={value}
                        onChange={onChange}
                    />
                )}
                {icon && (
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
            </div>
            {error ? (
                <p className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>
            ) : hint ? (
                <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
            ) : null}
        </div>
    );
};

export default Input;
