import React, { useState, useEffect } from 'react';
import {
    Database, PanelLeftClose, PanelLeftOpen, Search, ChevronDown,
    Settings, SlidersHorizontal, Users, UserPlus, Server, Activity,
    ClipboardList, BarChart3, HardDrive, AppWindow, Network, House,
    Camera, Copy, Handshake, Send, Inbox, Layers, KeyRound, ArrowUpCircle,
} from 'lucide-react';

const menuItems = [
    { label: 'Main menu', isHeader: true },
    {
        label: 'System configuration', icon: Settings,
        subItems: [
            { label: 'Users', icon: UserPlus, href: '#/users' },
            { label: 'Groups', icon: Users, href: '#/groups' },
            { label: 'Nodes', icon: Server, href: '#/nodes' },
        ],
    },
    {
        label: 'System Status', icon: Activity,
        subItems: [
            { label: 'Logs', icon: ClipboardList, href: '#/logs' },
            { label: 'Service Performance', icon: BarChart3, href: '#/performance' },
        ],
    },
    {
        label: 'Volumes', icon: HardDrive,
        subItems: [
            { label: 'CIFS', icon: AppWindow, href: '#/volumes/cifs' },
            { label: 'NFS', icon: Network, href: '#/volumes/nfs' },
            { label: 'Home Folders', icon: House, href: '#/volumes/home' },
            { label: 'ISCSI LUNs', icon: Database, href: '#/volumes/iscsi' },
            { label: 'Snapshots', icon: Camera, href: '#/volumes/snapshots' },
        ],
    },
    {
        label: 'Replication', icon: Copy,
        subItems: [
            { label: 'Partner', icon: Handshake, href: '#/replication/partners' },
            { label: 'Sender Schedule', icon: Send, href: '#/replication/sender' },
            { label: 'Received Snapshots', icon: Inbox, href: '#/replication/received' },
        ],
    },
    {
        label: 'Pools', icon: Layers,
        subItems: [
            { label: 'Disk Groups', icon: Database, href: '#/pools/diskgroups' },
        ],
    },
    {
        label: 'Settings', icon: SlidersHorizontal,
        subItems: [
            { label: 'User Privileges', icon: KeyRound, href: '#/settings/privileges' },
            { label: 'Updates', icon: ArrowUpCircle, href: '#/settings/updates' },
        ],
    },
];

const Sidebar = () => {
    const [pathname, setPathname] = useState(window.location.hash || window.location.pathname);
    const [userExpanded, setUserExpanded] = useState(null);
    const [collapsed, setCollapsed] = useState(document.body.classList.contains('sidebar-collapse'));
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handleLocationChange = () => setPathname(window.location.hash || window.location.pathname);
        window.addEventListener('popstate', handleLocationChange);
        window.addEventListener('hashchange', handleLocationChange);
        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            window.removeEventListener('hashchange', handleLocationChange);
        };
    }, []);

    const isItemActive = (href) => {
        if (href.startsWith('#')) return pathname === href;
        const cleanPath = pathname.split('/').pop() || 'index.html';
        return cleanPath === href.replace('./', '');
    };

    const sections = menuItems.filter((m) => !m.isHeader);
    const activeParent = sections.find((m) => m.subItems.some((s) => isItemActive(s.href)))?.label;

    // Desktop collapse contract — body.sidebar-collapse slides the rail off-canvas (index.css).
    const toggleCollapse = () => {
        const next = !collapsed;
        document.body.classList.toggle('sidebar-collapse', next);
        setCollapsed(next);
    };

    // Mobile drawer — close on backdrop tap or nav navigation.
    const closeMobileDrawer = () => document.body.classList.remove('sidebar-mobile-open');

    const handleSectionToggle = (label) => {
        if (label === activeParent) {
            setUserExpanded((prev) => (prev === label ? '__closed__' : null));
            return;
        }
        setUserExpanded((prev) => (prev === label ? null : label));
    };

    const q = query.trim().toLowerCase();
    const matches = (text) => text.toLowerCase().includes(q);

    const visibleSections = sections
        .map((menu) => {
            if (!q) return menu;
            if (matches(menu.label)) return menu;
            const subItems = menu.subItems.filter((s) => matches(s.label));
            return subItems.length ? { ...menu, subItems } : null;
        })
        .filter(Boolean);

    const isExpanded = (menu) => {
        if (q) return true; // expand all while searching
        if (menu.label === userExpanded) return true;
        if (userExpanded === '__closed__' && menu.label === activeParent) return false;
        if (userExpanded && userExpanded !== '__closed__') return menu.label === userExpanded;
        return menu.label === activeParent;
    };

    return (
        <>
            {/* Mobile drawer backdrop */}
            <div className="sidebar-backdrop lg:hidden" onClick={closeMobileDrawer} />

            {/* Floating reopen button — only visible when collapsed on desktop */}
            {collapsed && (
                <button
                    onClick={toggleCollapse}
                    className="fixed left-3 top-3 z-50 hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-gray-500 shadow-sm hover:bg-gray-50 hover:text-brand-600 lg:flex"
                    title="Open sidebar"
                >
                    <PanelLeftOpen size={18} />
                </button>
            )}

            <aside className="app-sidebar fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-border bg-surface">
                {/* Brand */}
                <div className="flex h-16 flex-shrink-0 items-center justify-between gap-2 border-b border-border px-4">
                    <a href="#/" className="flex items-center gap-2" onClick={closeMobileDrawer}>
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white">
                            <Database size={16} />
                        </span>
                        <span className="text-[17px] font-semibold tracking-tight text-gray-900">QuickStor</span>
                    </a>
                    <button
                        onClick={toggleCollapse}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-brand-600"
                        title="Collapse sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="flex-shrink-0 px-3 pt-3">
                    <div className="relative">
                        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search menu…"
                            aria-label="Search menu"
                            className="w-full rounded-md border border-border bg-surface-muted py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-brand-500 focus:bg-surface focus:ring-4 focus:ring-brand-100"
                        />
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 overflow-y-auto px-3 py-3">
                    <div className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Main menu
                    </div>

                    {visibleSections.map((menu) => {
                        const Icon = menu.icon;
                        const expanded = isExpanded(menu);
                        const sectionActive = menu.label === activeParent;

                        return (
                            <div key={menu.label}>
                                <button
                                    onClick={() => handleSectionToggle(menu.label)}
                                    className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium ${
                                        sectionActive ? 'text-brand-700' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon size={18} className={sectionActive ? 'text-brand-600' : 'text-gray-400'} />
                                    <span className="flex-1 text-left">{menu.label}</span>
                                    <ChevronDown
                                        size={15}
                                        className={`text-gray-400 transition-transform ${expanded ? '' : '-rotate-90'}`}
                                    />
                                </button>

                                {expanded && (
                                    <ul className="mb-1 mt-0.5 ml-3.5 flex flex-col gap-0.5 border-l border-border pl-3">
                                        {menu.subItems.map((sub) => {
                                            const SubIcon = sub.icon;
                                            const active = isItemActive(sub.href);
                                            return (
                                                <li key={sub.label}>
                                                    <a
                                                        href={sub.href}
                                                        onClick={closeMobileDrawer}
                                                        className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm ${
                                                            active
                                                                ? 'bg-brand-600 font-medium text-white'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'
                                                        }`}
                                                    >
                                                        <SubIcon size={15} className={active ? 'text-white' : 'text-gray-400'} />
                                                        {sub.label}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}

                    {q && visibleSections.length === 0 && (
                        <div className="px-2.5 py-4 text-sm text-gray-400">No menu items match “{query}”.</div>
                    )}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
