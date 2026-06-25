import React, { useState } from 'react';
import { Users, UsersRound, PlusCircle } from 'lucide-react';
import Panel from './Common/Panel';
import Button from './Common/Button';
import Input from './Common/Input';
import Dropdown from './Common/Dropdown';

const AddGroupForm = ({ users, onAdd }) => {
    const [formData, setFormData] = useState({ Group: '', GroupUsers: [] });

    const handleChange = (id, value) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: formData.Group,
            users: formData.GroupUsers.join(','),
            Myname: 'mezo',
        };
        onAdd(data);
        setFormData({ Group: '', GroupUsers: [] });
    };

    const canSubmit = formData.Group.length > 2;

    return (
        <Panel
            collapsible
            defaultOpen
            icon={<UsersRound size={18} />}
            title="Create New Group"
            subtitle="Permission management"
        >
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Input
                        label="Group Name"
                        placeholder="e.g. developers"
                        id="Group"
                        value={formData.Group}
                        onChange={(e) => handleChange('Group', e.target.value)}
                        icon={<Users size={16} />}
                    />

                    <Dropdown
                        label="Initial Members"
                        isMulti
                        placeholder="Select members…"
                        options={users.map((user) => ({ value: String(user.id), label: user.text }))}
                        value={formData.GroupUsers}
                        onChange={(val) => handleChange('GroupUsers', val)}
                    />
                </div>

                <div className="mt-6 flex justify-end border-t border-border pt-5">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full sm:w-auto"
                        disabled={!canSubmit}
                        icon={<PlusCircle size={16} />}
                        onClick={handleSubmit}
                    >
                        Create Group
                    </Button>
                </div>
            </form>
        </Panel>
    );
};

export default AddGroupForm;
