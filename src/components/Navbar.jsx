import React, { useState, useRef, useEffect } from 'react';
import {
    Menu, ChevronRight, Bell, Maximize2, User, LogOut, Key, X,
    AlertTriangle, Cpu, Users, ShieldCheck,
} from 'lucide-react';
import { changePassword } from '../api/users';

const PAGE_LABELS = {
    '#/users': 'Users', '#/groups': 'Groups', '#/nodes': 'Nodes',
    '#/logs': 'Logs', '#/performance': 'Service Performance',
    '#/volumes/cifs': 'CIFS', '#/volumes/nfs': 'NFS', '#/volumes/home': 'Home Folders',
    '#/volumes/iscsi': 'ISCSI LUNs', '#/volumes/snapshots': 'Snapshots',
    '#/settings/privileges': 'User Privileges', '#/settings/updates': 'Updates',
    '#/pools/diskgroups': 'Disk Groups',
    '#/replication/partners': 'Partner', '#/replication/sender': 'Sender Schedule',
    '#/replication/received': 'Received Snapshots',
};

const Navbar = ({ sectionTitle }) => {
    const [page, setPage] = useState(PAGE_LABELS[window.location.hash] || 'Nodes');
    const [openMenu, setOpenMenu] = useState(null); // 'notif' | 'user' | null
    const menuRef = useRef(null);

    // Password modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [pass, setPass] = useState('');
    const [newpass, setNewpass] = useState('');
    const [passErr, setPassErr] = useState('retype the same password in both fields');
    const [passErrColor, setPassErrColor] = useState('text-gray-400');
    const [saveDisabled, setSaveDisabled] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const onHash = () => setPage(PAGE_LABELS[window.location.hash] || 'Nodes');
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
        };
        const onKey = (e) => { if (e.key === 'Escape') setOpenMenu(null); };
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
    };

    const validatePasswords = (p, np) => {
        if (p === np && np.length >= 3) {
            setPassErr('');
            setPassErrColor('text-gray-400');
            setSaveDisabled(false);
        } else {
            setPassErr(p === np ? 'password length is too small' : 'retype the same password in both fields');
            setPassErrColor('text-danger-600');
            setSaveDisabled(true);
        }
    };

    const handleOpenModal = () => {
        setPass('');
        setNewpass('');
        setPassErr('retype the same password in both fields');
        setPassErrColor('text-gray-400');
        setSaveDisabled(true);
        setOpenMenu(null);
        setModalOpen(true);
    };

    const handleSave = async () => {
        const username = localStorage.getItem('user');
        setSaving(true);
        try {
            await changePassword(username, pass);
            setModalOpen(false);
        } catch (e) {
            setPassErr('Failed to change password');
            setPassErrColor('text-danger-600');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('token', '0'); // Signal logout to App.jsx
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <>
            <header
                ref={menuRef}
                className="main-header sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 sm:px-6"
            >
                {/* Left: mobile menu + breadcrumb */}
                <div className="flex min-w-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={() => document.body.classList.toggle('sidebar-mobile-open')}
                        className="-ml-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-brand-600 lg:hidden"
                        aria-label="Toggle menu"
                    >
                        <Menu size={20} />
                    </button>
                    <nav className="flex min-w-0 items-center gap-1.5 text-sm">
                        <span className="truncate text-gray-500">{sectionTitle}</span>
                        <ChevronRight size={15} className="flex-shrink-0 text-gray-300" />
                        <span className="truncate font-semibold text-gray-900">{page}</span>
                    </nav>
                </div>

                {/* Right */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* System status */}
                    <div className="hidden flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface-muted px-3.5 py-1.5 sm:flex">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-success-500"></span>
                        <div id="syncStatus" className="whitespace-nowrap text-xs font-medium text-gray-600">
                            Getting <span>Status…</span>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setOpenMenu((m) => (m === 'notif' ? null : 'notif'))}
                            className="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-brand-600"
                            aria-label="Notifications"
                        >
                            <Bell size={18} />
                            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger-500">
                                <span id="tot" className="hidden"></span>
                            </span>
                        </button>
                        {openMenu === 'notif' && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                                <div className="border-b border-border bg-surface-muted px-4 py-3 text-sm font-semibold text-gray-700">
                                    Notifications (7 days)
                                </div>
                                <a href="#/logs" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning-50 text-warning-600"><AlertTriangle size={15} /></span>
                                    <span className="text-sm text-gray-700"><span id="warns" className="font-semibold text-gray-900">0</span> Warnings</span>
                                </a>
                                <a href="#/logs" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 border-t border-border px-4 py-3 hover:bg-gray-50">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-danger-50 text-danger-600"><Cpu size={15} /></span>
                                    <span className="text-sm text-gray-700"><span id="errs" className="font-semibold text-gray-900">0</span> System Errors</span>
                                </a>
                                <a href="#/logs" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 border-t border-border px-4 py-3 hover:bg-gray-50">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Users size={15} /></span>
                                    <span className="text-sm text-gray-700"><span id="logonfails" className="font-semibold text-gray-900">0</span> Auth Failures</span>
                                </a>
                                <a href="#/logs" onClick={() => setOpenMenu(null)} className="block border-t border-border bg-surface-muted px-4 py-3 text-center text-sm font-medium text-brand-600 hover:bg-gray-100">
                                    See All Notifications
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Fullscreen */}
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="hidden h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-brand-600 sm:flex"
                        aria-label="Fullscreen"
                    >
                        <Maximize2 size={18} />
                    </button>

                    <span className="hidden h-6 w-px bg-border sm:block"></span>

                    {/* User menu */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setOpenMenu((m) => (m === 'user' ? null : 'user'))}
                            className="flex items-center gap-2.5 rounded-md py-1.5 pl-1.5 pr-2 hover:bg-gray-100"
                        >
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600"><User size={16} /></span>
                            <span id="username" className="hidden text-sm font-semibold text-gray-800 sm:block">Admin</span>
                        </button>
                        {openMenu === 'user' && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-lg">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-danger-50 hover:text-danger-700"
                                >
                                    <LogOut size={16} className="text-gray-400" /> Logout
                                </button>
                                <button
                                    id="chgpasswd"
                                    onClick={handleOpenModal}
                                    className="chgpasswd mt-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                                >
                                    <Key size={16} className="text-gray-400" /> Change Password
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {modalOpen && (
                <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-600"><ShieldCheck size={18} /></span>
                                <h4 className="text-base font-semibold text-gray-800">Change Password</h4>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Close">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-4 p-5">
                            <input
                                type="password"
                                id="pass"
                                placeholder="Password"
                                value={pass}
                                onChange={(e) => { setPass(e.target.value); validatePasswords(e.target.value, newpass); }}
                                className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                            />
                            <input
                                type="password"
                                id="newpass"
                                placeholder="Re-type password"
                                value={newpass}
                                onChange={(e) => { setNewpass(e.target.value); validatePasswords(pass, e.target.value); }}
                                className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                            />
                            {passErr && <p id="passerr" className={`text-xs font-medium ${passErrColor}`}>{passErr}</p>}
                        </div>
                        <div className="flex justify-end gap-3 border-t border-border bg-surface-muted px-5 py-4">
                            <button onClick={() => setModalOpen(false)} className="rounded-md px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                                Cancel
                            </button>
                            <button
                                id="passwrd"
                                onClick={handleSave}
                                disabled={saveDisabled || saving}
                                className="rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
