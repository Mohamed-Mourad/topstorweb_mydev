import React, { useState, useEffect } from 'react';
import { joinCluster, updateDiscoveredNode } from '../api/nodes';
import { RadioTower } from 'lucide-react';
import ServerNode from './Common/ServerNode';
import Button from './Common/Button';
import Panel from './Common/Panel';

const FIELD =
    'w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:bg-gray-50 disabled:text-gray-400';

const DiscoveredNodes = ({ hosts, allHosts, selectedHostName, onSelect, onDiscover, onRefresh }) => {
    const [formData, setFormData] = useState({ alias: '', ipaddr: '', ipaddrsubnet: 24, port: 'Port' });
    const [originalData, setOriginalData] = useState({ alias: '', ipaddr: '', ipaddrsubnet: 24 });
    const [isJoining, setIsJoining] = useState(false);

    const selectedHostIndex = selectedHostName ? hosts.findIndex((h) => (h.name === selectedHostName || h.alias === selectedHostName)) : -1;
    const selectedHostListItem = selectedHostIndex !== -1 ? hosts[selectedHostIndex] : null;

    useEffect(() => {
        if (selectedHostListItem) {
            const initialFormState = {
                alias: selectedHostListItem.alias || selectedHostListItem.name || '',
                ipaddr: selectedHostListItem.ipaddr || selectedHostListItem.ip || '',
                ipaddrsubnet: selectedHostListItem.ipaddrsubnet || 24,
                port: selectedHostListItem.port || 'Port',
            };
            setFormData(initialFormState);
            setOriginalData({
                alias: initialFormState.alias,
                ipaddr: initialFormState.ipaddr,
                ipaddrsubnet: initialFormState.ipaddrsubnet,
            });
        } else {
            setFormData({ alias: '', ipaddr: '', ipaddrsubnet: 24, port: 'Port' });
            setOriginalData({ alias: '', ipaddr: '', ipaddrsubnet: 24 });
        }
    }, [selectedHostListItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Match legacy updateButtonState: show "Update and Add to Cluster" whenever fields have content
    const hasDataForButton =
        (formData.alias && formData.alias.trim().length > 0) ||
        (formData.ipaddr && formData.ipaddr.trim().length > 0 && !formData.ipaddr.includes('__'));

    // Two-step "Update and Add to Cluster" flow
    const handleJoin = async () => {
        if (!selectedHostName || !selectedHostListItem) return;
        setIsJoining(true);
        try {
            let tochange = 0;
            const hostsubmit = {};

            if (formData.alias.length > 3 && formData.alias !== originalData.alias) {
                hostsubmit.alias = formData.alias;
                tochange = 1;
            }

            if (formData.ipaddr.length > 3 && !formData.ipaddr.includes('__')) {
                if (formData.ipaddr !== originalData.ipaddr || String(formData.ipaddrsubnet) !== String(originalData.ipaddrsubnet)) {
                    hostsubmit.ipaddr = formData.ipaddr;
                    hostsubmit.ipaddrsubnet = formData.ipaddrsubnet;
                    tochange = 1;
                }
            }

            if (tochange > 0) {
                const updatePayload = {
                    ...hostsubmit,
                    id: selectedHostListItem.id,
                    user: 'mezo',
                    name: selectedHostListItem.name,
                    discovered: true,
                };
                await updateDiscoveredNode(updatePayload);
                // Wait before joining cluster (matching old code's 10-second delay)
                await new Promise((resolve) => setTimeout(resolve, 10000));
            }

            await joinCluster(selectedHostListItem.name);
            if (onRefresh) onRefresh();
        } catch (e) {
            console.error('Join cluster failed', e);
        } finally {
            setIsJoining(false);
        }
    };

    const btnText = isJoining ? 'Joining…' : hasDataForButton ? 'Update and Add to Cluster' : 'Add to Cluster';
    const disabled = !selectedHostListItem || isJoining;

    const discoveryAction = (
        <Button
            type="button"
            id="refresh2"
            size="sm"
            variant="secondary"
            onClick={() => onDiscover && onDiscover()}
        >
            Discovery
        </Button>
    );

    return (
        <Panel
            collapsible
            defaultOpen
            icon={<RadioTower size={18} />}
            title="Discovered Nodes"
            subtitle="Unprovisioned nodes available to join"
            actions={discoveryAction}
        >
            {/* Nodes Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" id="hostspossible">
                {hosts.length === 0 ? (
                    <div className="col-span-full py-6 text-center text-sm text-gray-400">
                        No discovered nodes. Click <strong>Discovery</strong> to scan.
                    </div>
                ) : (
                    hosts.map((host) => {
                        const hostName = host.name || host.alias;
                        return (
                            <ServerNode
                                key={hostName}
                                name={hostName}
                                ip={host.ip || host.ipaddr}
                                state="discovered"
                                onClick={() => onSelect(hostName)}
                                selected={selectedHostName === hostName}
                            />
                        );
                    })
                )}
            </div>

            {/* Config Form */}
            <form className="hostform mt-6 border-t border-border pt-5">
                {/* Node Name */}
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12">
                    <label className="text-sm font-medium text-gray-700 lg:col-span-3">Node Name</label>
                    <div className="lg:col-span-5">
                        <input
                            type="text"
                            className={`${FIELD} discoverednodes`}
                            id="DiscoveredBoxName"
                            name="alias"
                            value={formData.alias}
                            onChange={handleChange}
                            disabled={disabled}
                            placeholder="Node Name"
                        />
                    </div>
                </div>

                {/* Node Address */}
                <div className="mt-5 grid grid-cols-1 items-center gap-4 lg:grid-cols-12">
                    <label className="text-sm font-medium text-gray-700 lg:col-span-3">Node Address</label>
                    <div className="lg:col-span-9">
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="xxx.xxx.xxx.xxx"
                                    className={`${FIELD} ipaddress discoverednodes font-mono`}
                                    id="DiscoveredIPAddress"
                                    name="ipaddr"
                                    value={formData.ipaddr}
                                    onChange={handleChange}
                                    disabled={disabled}
                                />
                            </div>
                            <div className="sm:w-32">
                                <select
                                    name="port"
                                    className={`${FIELD} discoverednodes appearance-none`}
                                    id="DiscoveredNodePorts"
                                    value={formData.port}
                                    onChange={handleChange}
                                    disabled={disabled}
                                >
                                    <option>Port</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 sm:w-40">
                                <label className="whitespace-nowrap text-sm font-medium text-gray-600">Subnet</label>
                                <input
                                    type="number"
                                    min="8"
                                    max="32"
                                    step="8"
                                    className={`${FIELD} discoverednodes`}
                                    id="Discoveredipaddrsubnet"
                                    name="ipaddrsubnet"
                                    value={formData.ipaddrsubnet}
                                    onChange={handleChange}
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border pt-5 sm:flex-row">
                    <Button type="button" id="updateAndJoinBtn" onClick={handleJoin} disabled={disabled} variant="primary">
                        {btnText}
                    </Button>
                    <Button
                        type="button"
                        id="refresh"
                        variant="secondary"
                        className="hidden sm:inline-flex"
                        onClick={() => onDiscover && onDiscover()}
                    >
                        Discovery
                    </Button>
                </div>
            </form>
        </Panel>
    );
};

export default DiscoveredNodes;
