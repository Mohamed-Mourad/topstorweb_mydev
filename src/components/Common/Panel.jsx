import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Panel — QuickStor design-system card.
 * Header (optional collapse chevron + icon box + title/subtitle + actions) → body → optional footer.
 * No gradient accent bars.
 *
 * Props:
 *   icon        lucide element, e.g. <UserPlus size={18} />
 *   title, subtitle
 *   actions     node rendered on the right of the header (clicks don't toggle collapse)
 *   collapsible, defaultOpen
 *   bodyClass   override body padding (default `p-4 sm:p-6`; pass "p-0" for flush tables)
 *   footer      node rendered below the body
 */
const Panel = ({
    icon,
    title,
    subtitle,
    actions,
    collapsible = false,
    defaultOpen = true,
    bodyClass,
    footer,
    children,
}) => {
    const [open, setOpen] = useState(defaultOpen);
    const bodyClasses = bodyClass !== undefined ? bodyClass : 'p-4 sm:p-6';

    return (
        <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            <div
                className={`flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 sm:px-5 sm:py-4 ${collapsible ? 'cursor-pointer select-none' : ''}`}
                onClick={collapsible ? () => setOpen((o) => !o) : undefined}
            >
                <div className="flex min-w-0 items-center gap-3">
                    {collapsible && (
                        <ChevronDown
                            size={18}
                            className={`flex-shrink-0 text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`}
                        />
                    )}
                    {icon && (
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                            {icon}
                        </span>
                    )}
                    {(title || subtitle) && (
                        <div className="min-w-0">
                            {title && <h3 className="truncate text-base font-semibold text-gray-800">{title}</h3>}
                            {subtitle && <p className="truncate text-sm text-gray-500">{subtitle}</p>}
                        </div>
                    )}
                </div>
                {actions && (
                    <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        {actions}
                    </div>
                )}
            </div>

            {open && <div className={bodyClasses}>{children}</div>}
            {open && footer}
        </section>
    );
};

export default Panel;
