"use client";

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === '/login';

    if (isLogin) {
        return <>{children}</>;
    }

    return (
        <>
            <Sidebar />
            <div className="main">
                <Topbar />
                <div className="content">
                    {children}
                </div>
            </div>
        </>
    );
}
