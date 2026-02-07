"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { Loader2 } from 'lucide-react';

const ChatView = dynamic(() => import('@/components/custom/ChatView'), {
    ssr: false,
    loading: () => (
        <div className="h-full rounded-2xl bg-[#0a0a0f] border border-white/[0.08] flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
        </div>
    )
});

const CodeView = dynamic(() => import('@/components/custom/CodeView'), {
    ssr: false,
    loading: () => (
        <div className="h-full rounded-2xl bg-[#0a0a0f] border border-white/[0.08] flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
        </div>
    )
});

const Workspace = () => {
    return (
        <div className="h-screen overflow-hidden bg-[#0a0a0f]">
            {/* Background Effects - Fixed positioning */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Gradient orbs */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />
                <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            {/* Content - Full height with proper structure */}
            <div className="relative z-10 h-full pt-20 pb-4 px-4 flex flex-col">
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Chat Panel - Left Side */}
                    <div className="lg:col-span-4 xl:col-span-3 min-h-0 overflow-hidden">
                        <ChatView />
                    </div>

                    {/* Code Panel - Right Side */}
                    <div className="lg:col-span-8 xl:col-span-9 min-h-0 overflow-hidden">
                        <CodeView />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workspace;
