import React, { useState, useEffect, useCallback } from 'react';
import { fetchUserList, fetchGroupList, addUser, deleteUser, updateUserGroups, changePassword } from './api/users';
import { fetchPoolsInfo } from './api/pools';
import { RefreshCw, X, ShieldCheck } from 'lucide-react';
import Button from './components/Common/Button';
import AddUserForm from './components/AddUserForm';
import UserList from './components/UserList';

const QUsers = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Password Modal State
  const [passwordModal, setPasswordModal] = useState({ isOpen: false, username: '', password: '', confirmPassword: '' });

  const loadData = useCallback(async () => {
    try {
      const [userRes, groupRes, poolRes] = await Promise.all([
        fetchUserList(),
        fetchGroupList(),
        fetchPoolsInfo(),
      ]);

      if (userRes.data?.allusers) setUsers(userRes.data.allusers);
      if (groupRes.data?.results) setGroups(groupRes.data.results);
      if (poolRes.data?.results) setPools(poolRes.data.results);
    } catch (err) {
      console.error('Failed to load users data', err);
      setError('Failed to sync with server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, [loadData]);

  const handleAddUser = async (userData) => {
    try {
      await addUser(userData);
      await loadData();
    } catch (e) {
      console.error('Add user failed', e);
    }
  };

  const handleDeleteUser = async (name) => {
    if (!window.confirm(`Are you sure you want to delete user ${name}?`)) return;
    try {
      await deleteUser(name);
      await loadData();
    } catch (e) {
      console.error('Delete user failed', e);
    }
  };

  const handleUpdateGroups = async (name, groupString) => {
    try {
      await updateUserGroups(name, groupString);
      await loadData();
    } catch (e) {
      console.error('Update groups failed', e);
    }
  };

  const handleOpenPasswordModal = (username) => {
    setPasswordModal({ isOpen: true, username, password: '', confirmPassword: '' });
  };

  const handleSavePassword = async () => {
    if (passwordModal.password !== passwordModal.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await changePassword(passwordModal.username, passwordModal.password);
      setPasswordModal({ ...passwordModal, isOpen: false });
    } catch (e) {
      console.error('Change password failed', e);
    }
  };

  const passwordsMatch = passwordModal.password && passwordModal.password === passwordModal.confirmPassword;

  return (
    <div className="content-wrapper">
      <div className="floating-canvas">
        {/* Page header */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">User Management</h1>
                <p className="mt-1 text-sm text-gray-500">Manage system accounts, permissions, and storage quotas</p>
              </div>
              <Button
                onClick={loadData}
                variant="secondary"
                icon={<RefreshCw size={15} className={loading ? 'animate-spin' : ''} />}
              >
                Sync Now
              </Button>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid space-y-6">
            <AddUserForm pools={pools} groups={groups} onAdd={handleAddUser} />
            <UserList
              users={users}
              groups={groups}
              onUpdateGroups={handleUpdateGroups}
              onChangePassword={handleOpenPasswordModal}
              onDelete={handleDeleteUser}
            />
          </div>
        </div>

        {/* Password Change Modal */}
        {passwordModal.isOpen && (
          <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                    <ShieldCheck size={18} />
                  </span>
                  <h4 className="text-base font-semibold text-gray-800">Change Password</h4>
                </div>
                <button
                  onClick={() => setPasswordModal({ ...passwordModal, isOpen: false })}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="rounded-md border border-brand-100 bg-brand-50 px-3.5 py-2.5 text-sm text-brand-800">
                  Updating password for <span className="font-semibold">{passwordModal.username}</span>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1.5 text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    placeholder="Enter new password"
                    value={passwordModal.password}
                    onChange={(e) => setPasswordModal({ ...passwordModal, password: e.target.value })}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1.5 text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    placeholder="Confirm new password"
                    value={passwordModal.confirmPassword}
                    onChange={(e) => setPasswordModal({ ...passwordModal, confirmPassword: e.target.value })}
                  />
                  {passwordModal.password && passwordModal.confirmPassword && !passwordsMatch && (
                    <p className="mt-1.5 text-xs font-medium text-danger-600">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border bg-surface-muted px-5 py-4">
                <Button variant="ghost" onClick={() => setPasswordModal({ ...passwordModal, isOpen: false })}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={!passwordsMatch}
                  onClick={handleSavePassword}
                >
                  Save Password
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QUsers;
