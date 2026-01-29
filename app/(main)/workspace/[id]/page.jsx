"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { Loader2 } from 'lucide-react';

const ChatView = dynamic(() => import('@/components/custom/ChatView'), {
    ssr: false,
    loading: () => (
        <div className="h-[85vh] rounded-2xl bg-[#030014] border border-white/5 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
        </div>
    )
});

const CodeView = dynamic(() => import('@/components/custom/CodeView'), {
    ssr: false,
    loading: () => (
        <div className="h-[85vh] rounded-2xl bg-[#030014] border border-white/5 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
        </div>
    )
});

const Workspace = () => {
    return (
        <div className="min-h-screen relative mt-20 overflow-hidden bg-[#030014]">
            {/* Animated gradient background */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <div className="absolute top-0 -left-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
                <div className="absolute top-1/2 -right-40 w-80 h-80 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />
                <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030014_70%)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 md:p-6 lg:p-8 pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                    {/* Chat Panel */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <ChatView />
                    </div>

                    {/* Code Panel */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <CodeView />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;
