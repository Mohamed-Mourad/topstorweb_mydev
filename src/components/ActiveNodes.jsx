import React from 'react';
import { evacuateHost } from '../api/nodes';
import { Boxes } from 'lucide-react';
import ServerNode from './Common/ServerNode';
import Button from './Common/Button';
import Panel from './Common/Panel';

const ActiveNodes = ({ hosts, allHosts, lostHosts, selectedHostName, onSelect, readyHostsCount, possibleHostsCount, onRefresh }) => {
    // Fix #14: Call onRefresh after evacuate
    const handleEvacuate = async () => {
        if (!selectedHostName) return;
        try {
            await evacuateHost(selectedHostName);
            if (onRefresh) onRefresh();
        } catch (e) {
            console.error('Evacuation failed', e);
        }
    };

    // Enabled only if selected host is "lost/Off" AND (readyCount - possibleCount) >= 2
    const isSelectedHostLost = selectedHostName && lostHosts && (
        Array.isArray(lostHosts)
            ? lostHosts.includes(selectedHostName) || lostHosts.some((h) => (typeof h === 'object' ? h.name : h) === selectedHostName)
            : JSON.stringify(lostHosts).includes(selectedHostName)
    );

    // Step 1: disable if ready - possible < 2; Step 2: Off/lost overrides the count check.
    let canEvac = (readyHostsCount - possibleHostsCount) >= 2;
    if (isSelectedHostLost) canEvac = true;
    const canEvacuate = selectedHostName && canEvac;

    return (
        <Panel
            collapsible
            defaultOpen
            icon={<Boxes size={18} />}
            title="Nodes Status"
            subtitle="Active cluster members"
        >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" id="hostsactive">
                {hosts.map((host) => {
                    const hostName = typeof host === 'object' ? host.name : host;
                    const isLost = lostHosts && (
                        Array.isArray(lostHosts)
                            ? lostHosts.includes(hostName) || lostHosts.some((h) => (typeof h === 'object' ? h.name : h) === hostName)
                            : JSON.stringify(lostHosts).includes(hostName)
                    );
                    const fullHost = (allHosts && allHosts[hostName]) ? allHosts[hostName] : host;
                    const displayIp = fullHost.ip || fullHost.ipaddr || (typeof host === 'object' ? (host.ip || host.ipaddr) : '');
                    return (
                        <ServerNode
                            key={hostName}
                            name={hostName}
                            ip={displayIp}
                            state={isLost ? 'down' : 'up'}
                            onClick={() => onSelect(hostName)}
                            selected={selectedHostName === hostName}
                        />
                    );
                })}
            </div>

            <div className="mt-6 border-t border-border pt-5">
                <Button
                    type="button"
                    id="activesubmit"
                    onClick={handleEvacuate}
                    disabled={!canEvacuate}
                    variant="danger"
                >
                    Evacuate Node
                </Button>
            </div>
        </Panel>
    );
};

export default ActiveNodes;
