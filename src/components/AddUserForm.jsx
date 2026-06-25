import React, { useState } from 'react';
import { User, Key, HardDrive, Hash, UserPlus, PlusCircle, Download } from 'lucide-react';
import Panel from './Common/Panel';
import Button from './Common/Button';
import Input from './Common/Input';
import Dropdown from './Common/Dropdown';

const isValidIP = (ip) =>
    /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(ip);

const AddUserForm = ({ pools, groups, onAdd }) => {
    const [formData, setFormData] = useState({
        Tenant: 'Cluster',
        User: '',
        UserPass: '',
        UserVol: 'NoHome',
        volsize: 1,
        HomeAddress: '',
        HomeSubnet: 8,
        Usergroups: [],
    });

    const handleChange = (id, value) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: formData.User,
            Volpool: formData.UserVol,
            groups: formData.Usergroups.join(','),
            Password: formData.UserPass,
            Volsize: formData.volsize,
            HomeAddress: formData.HomeAddress || 'NoAddress',
            HomeSubnet: formData.HomeSubnet,
            Myname: 'mezo',
        };
        onAdd(data);
    };

    const canSubmit = formData.User.length > 2 && formData.UserPass.length > 2;
    const noHome = formData.UserVol === 'NoHome';
    const ipError = formData.HomeAddress && !isValidIP(formData.HomeAddress) ? 'Invalid IP — backend will reject' : undefined;

    return (
        <Panel
            collapsible
            defaultOpen
            icon={<UserPlus size={18} />}
            title="Create New User"
            subtitle="Account provisioning"
        >
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <Input
                        label="User Name"
                        placeholder="e.g. john_doe"
                        id="User"
                        value={formData.User}
                        onChange={(e) => handleChange('User', e.target.value)}
                        icon={<User size={16} />}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        id="UserPass"
                        value={formData.UserPass}
                        onChange={(e) => handleChange('UserPass', e.target.value)}
                        icon={<Key size={16} />}
                    />

                    <Dropdown
                        label="Home Pool"
                        options={[
                            { value: 'NoHome', label: 'Select storage pool' },
                            ...pools.map((pool) => ({ value: pool.text, label: pool.text })),
                        ]}
                        value={formData.UserVol}
                        onChange={(val) => handleChange('UserVol', val)}
                    />

                    <Input
                        label="Quota (GB)"
                        type="number"
                        placeholder="e.g. 50"
                        id="volsize"
                        value={formData.volsize}
                        onChange={(e) => handleChange('volsize', e.target.value)}
                        icon={<HardDrive size={16} />}
                        disabled={noHome}
                    />

                    <Input
                        label="IP Address Restriction"
                        id="HomeAddress"
                        placeholder="e.g. 192.168.1.100"
                        value={formData.HomeAddress}
                        onChange={(e) => handleChange('HomeAddress', e.target.value)}
                        icon={<Hash size={16} />}
                        disabled={noHome}
                        error={ipError}
                    />

                    <Dropdown
                        label="Allowed Groups"
                        isMulti
                        placeholder="Select groups…"
                        options={groups.map((group) => ({ value: String(group.id), label: group.text }))}
                        value={formData.Usergroups}
                        onChange={(val) => handleChange('Usergroups', val)}
                    />
                </div>

                <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border pt-5 sm:flex-row">
                    <a
                        className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-brand-600"
                        href="dist/Template.xlsx"
                        download
                    >
                        <Download size={15} /> Download Template
                    </a>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full sm:w-auto"
                        disabled={!canSubmit}
                        icon={<PlusCircle size={16} />}
                        onClick={handleSubmit}
                    >
                        Add System User
                    </Button>
                </div>
            </form>
        </Panel>
    );
};

export default AddUserForm;
