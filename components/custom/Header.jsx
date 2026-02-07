"use client";

import React from 'react';
import { Sparkles, Zap, Github, Command } from 'lucide-react';
import Link from 'next/link';

function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-4 mt-4">
                <div className="card-glass rounded-2xl px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo and Title */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl">
                                    <Zap className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-lg font-bold font-display text-gradient-primary">
                                    Sam-AI
                                </h1>
                                <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                                    Website Builder
                                </span>
                            </div>
                        </Link>

                        {/* Center - Keyboard shortcut hint */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <Command className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-xs text-gray-500">Press</span>
                            <kbd className="px-2 py-0.5 rounded bg-white/[0.05] text-xs text-gray-400 font-mono">Enter</kbd>
                            <span className="text-xs text-gray-500">to generate</span>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            <div className="hidden sm:flex items-center gap-2 status-indicator status-complete">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Ready</span>
                            </div>

                            {/* GitHub Link */}
                            <a
                                href="https://github.com/SamTerces"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
                            >
                                <Github className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
