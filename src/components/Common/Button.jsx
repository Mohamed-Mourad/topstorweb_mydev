import React from 'react';

/**
 * Shared Button — QuickStor design system.
 *
 * Preferred API:
 *   <Button variant="primary|secondary|ghost|danger" size="md|sm" icon={…}>…</Button>
 *
 * Legacy API (kept for back-compat with not-yet-migrated call sites):
 *   <Button bgColor="bg-emerald-600" textColor="text-white">…</Button>
 *   bgColor is mapped onto a variant (rose/red → danger, white → secondary,
 *   everything else → primary) so the old indigo/emerald/blue split collapses
 *   onto the single brand accent.
 *
 * States are subtle: color-only hover + a focus ring. No bounce/scale/translate.
 */

const VARIANT_STYLES = {
    primary:
        'bg-brand-600 text-white shadow-xs hover:bg-brand-700 focus-visible:ring-brand-100',
    secondary:
        'border border-border bg-surface text-gray-700 shadow-xs hover:bg-gray-50 hover:text-brand-600 focus-visible:ring-brand-100',
    ghost:
        'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-200',
    danger:
        'bg-danger-600 text-white shadow-xs hover:bg-danger-700 focus-visible:ring-danger-100',
};

const SIZE_STYLES = {
    md: 'px-4 py-2.5 text-sm',
    sm: 'px-3 py-1.5 text-xs',
};

// Map a legacy bgColor class onto a design-system variant.
const variantFromBgColor = (bgColor) => {
    if (!bgColor) return 'primary';
    if (/rose|red/.test(bgColor)) return 'danger';
    if (/white/.test(bgColor)) return 'secondary';
    return 'primary';
};

const Button = ({
    variant,
    size = 'md',
    bgColor, // legacy
    textColor, // legacy — ignored; variant owns color
    borderRadius, // legacy — ignored; design system uses rounded-md
    icon,
    onClick,
    disabled = false,
    className = '',
    type = 'button',
    children,
    ...props
}) => {
    const resolvedVariant = variant || variantFromBgColor(bgColor);
    const variantClasses = VARIANT_STYLES[resolvedVariant] || VARIANT_STYLES.primary;
    const sizeClasses = SIZE_STYLES[size] || SIZE_STYLES.md;

    const baseStyles =
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold ' +
        'transition-colors outline-none focus-visible:ring-4 ' +
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${sizeClasses} ${variantClasses} ${className}`}
            {...props}
        >
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
