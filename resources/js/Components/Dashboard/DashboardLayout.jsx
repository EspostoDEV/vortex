import React from 'react';
import SidebarNav from './SidebarNav';
import ResourceSidebar from './ResourceSidebar';

export default function DashboardLayout({ children, resources, onResourceSelect, selectedResourceId }) {
    return (
        <div className="min-h-screen bg-v-black text-white font-sans selection:bg-v-success selection:text-v-black [--sidebar-width:80px]">
            <SidebarNav />
            
            <div className="flex pl-[var(--sidebar-width)] min-h-screen">
                <ResourceSidebar 
                    resources={resources} 
                    onSelect={onResourceSelect} 
                    selectedId={selectedResourceId}
                />
                
                <main className="flex-1 p-10 max-w-[1600px]">
                    {children}
                </main>
            </div>
        </div>
    );
}
