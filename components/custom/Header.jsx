"use client";

import React from 'react';
import { Sparkles, Zap, Github } from 'lucide-react';

function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-4 mt-4">
                <div className="glass-card rounded-2xl px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-lg opacity-60"></div>
                                <div className="relative bg-gradient-to-r from-violet-600 to-fuchsia-600 p-2.5 rounded-xl">
                                    <Zap className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 text-gradient">
                                    Sam-AI
                                </h1>
                                <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                                    Website Builder
                                </span>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <Sparkles className="h-4 w-4" />
                                <span>AI Online</span>
                            </div>

                            {/* GitHub Link */}
                            <a
                                href="https://github.com/Sam-AI/Sam-AI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                <Github className="h-5 w-5 text-gray-300" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
