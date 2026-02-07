"use client"
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import {
    ArrowRight, Sparkles, Send, Wand2, Loader2,
    Rocket, Code2, Palette, Globe, Zap, Layout,
    Smartphone, Shield, Stars
} from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

function Hero() {
    const [userInput, setUserInput] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const { messages, setMessages } = useContext(MessagesContext);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();

    const onGenerate = async (input) => {
        const msg = {
            role: 'user',
            content: input
        }
        setMessages(msg);
        const workspaceID = await CreateWorkspace({
            messages: [msg]
        });
        router.push('/workspace/' + workspaceID);
    }

    const enhancePrompt = async () => {
        if (!userInput) return;

        setIsEnhancing(true);
        try {
            const response = await fetch('/api/enhance-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userInput }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let enhancedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.chunk) {
                                enhancedText += data.chunk;
                                setUserInput(enhancedText);
                            }
                            if (data.done && data.enhancedPrompt) {
                                setUserInput(data.enhancedPrompt);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error enhancing prompt:', error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const onSuggestionClick = (suggestion) => {
        setUserInput(suggestion);
    };

    const features = [
        { icon: Code2, label: "React + Tailwind", desc: "Modern stack" },
        { icon: Palette, label: "Beautiful Design", desc: "Stunning UI" },
        { icon: Smartphone, label: "Responsive", desc: "All devices" },
        { icon: Zap, label: "Fast Generation", desc: "Seconds" },
    ];

    const stats = [
        { value: "10K+", label: "Websites Built" },
        { value: "50+", label: "Components" },
        { value: "99%", label: "Satisfaction" },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
            {/* Background Effects */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-pulse-slow" />
                <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-15" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0f_75%)]" />
            </div>

            <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
                <div className="flex flex-col items-center justify-center">
                    {/* Hero Header */}
                    <div className="text-center space-y-6 max-w-4xl mb-12">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 card-glass rounded-full px-5 py-2 glow-sm">
                            <Stars className="h-4 w-4 text-amber-400" />
                            <span className="text-sm font-medium text-gray-300">
                                AI-Powered Website Generation
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-bold text-white">
                                NEW
                            </span>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] tracking-tight">
                            <span className="text-white">Create stunning</span>
                            <br />
                            <span className="text-gradient-primary animate-gradient bg-[length:200%_auto]">
                                websites instantly
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Describe your vision in plain English and watch as AI transforms it into
                            a beautiful, production-ready website with modern design and clean code.
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-8 pt-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl font-bold text-gradient-primary">{stat.value}</div>
                                    <div className="text-xs text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Input Section */}
                    <div className="w-full max-w-3xl mb-12">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20" />

                            <div className="relative card-elevated rounded-2xl p-1">
                                <div className="bg-[#0c0c14] rounded-xl p-5">
                                    <textarea
                                        placeholder="Describe your dream website... (e.g., 'A modern SaaS landing page with gradient hero, feature cards, and testimonials')"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-base leading-relaxed h-28 resize-none"
                                        disabled={isEnhancing}
                                    />

                                    {/* Action bar */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                <span>AI will generate React + Tailwind code</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {userInput && (
                                                <button
                                                    onClick={enhancePrompt}
                                                    disabled={isEnhancing}
                                                    className="btn-secondary flex items-center gap-2 !px-4 !py-2.5 text-sm disabled:opacity-50"
                                                >
                                                    {isEnhancing ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Wand2 className="h-4 w-4" />
                                                    )}
                                                    <span className="hidden sm:inline">Enhance</span>
                                                </button>
                                            )}

                                            <button
                                                onClick={() => onGenerate(userInput)}
                                                disabled={!userInput || isEnhancing}
                                                className="btn-primary flex items-center gap-2 !px-5 !py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Rocket className="h-4 w-4" />
                                                <span>Generate</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-12">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card-glass rounded-xl p-4 text-center hover:border-purple-500/30 transition-all duration-300"
                            >
                                <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-3">
                                    <feature.icon className="h-5 w-5 text-purple-400" />
                                </div>
                                <div className="text-sm font-medium text-white">{feature.label}</div>
                                <div className="text-xs text-gray-500">{feature.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* Suggestions */}
                    <div className="w-full max-w-4xl">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <span className="section-title flex items-center gap-2">
                                <Layout className="h-3.5 w-3.5" />
                                Quick Templates
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Lookup?.SUGGSTIONS.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSuggestionClick(suggestion)}
                                    className="group relative p-4 rounded-xl card-glass text-left transition-all duration-300 hover:border-purple-500/30"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                                    <div className="relative flex items-start gap-3">
                                        <div className="mt-0.5 p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-gray-400 group-hover:text-gray-200 text-sm leading-relaxed transition-colors">
                                            {suggestion}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
