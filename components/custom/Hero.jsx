"use client"
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import { ArrowRight, Sparkles, Send, Wand2, Loader2, Rocket, Code2, Palette, Globe } from 'lucide-react';
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
        { icon: Code2, label: "Smart Code", color: "from-violet-500 to-purple-500" },
        { icon: Palette, label: "Beautiful UI", color: "from-pink-500 to-rose-500" },
        { icon: Globe, label: "Deploy Ready", color: "from-cyan-500 to-blue-500" },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#030014]">
            {/* Animated gradient background */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse-slow" />
                <div className="absolute top-0 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse-slow animation-delay-2000" />
                <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse-slow animation-delay-4000" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

                {/* Radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030014_70%)]" />
            </div>

            <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
                <div className="flex flex-col items-center justify-center space-y-16">
                    {/* Hero Header */}
                    <div className="text-center space-y-8 max-w-4xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2.5 glow-sm">
                            <Rocket className="h-4 w-4 text-violet-400" />
                            <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 text-gradient">
                                Powered by Advanced AI
                            </span>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                            <span className="text-white">Build websites</span>
                            <br />
                            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-gradient animate-gradient">
                                with AI magic
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Transform your ideas into stunning, production-ready websites in seconds.
                            Just describe what you want, and watch the magic happen.
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                                >
                                    <feature.icon className={`h-4 w-4 bg-gradient-to-r ${feature.color} text-gradient`} style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text' }} />
                                    <span className="text-sm text-gray-300">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Input Section */}
                    <div className="w-full max-w-3xl">
                        <div className="relative">
                            {/* Glow effect behind input */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-2xl blur-xl opacity-20" />

                            <div className="relative glass-card rounded-2xl p-2">
                                <div className="bg-[#0a0a1a]/80 rounded-xl p-5">
                                    <textarea
                                        placeholder="Describe your dream website... (e.g., 'A modern portfolio with dark theme and animations')"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg leading-relaxed h-32 resize-none"
                                        disabled={isEnhancing}
                                    />

                                    {/* Action buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Sparkles className="h-4 w-4" />
                                            <span>AI-powered generation</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {userInput && (
                                                <button
                                                    onClick={enhancePrompt}
                                                    disabled={isEnhancing}
                                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isEnhancing ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <Wand2 className="h-5 w-5" />
                                                    )}
                                                    <span className="hidden sm:inline">Enhance</span>
                                                </button>
                                            )}

                                            <button
                                                onClick={() => onGenerate(userInput)}
                                                disabled={!userInput || isEnhancing}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-sm"
                                            >
                                                <Send className="h-5 w-5" />
                                                <span>Generate</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggestions Grid */}
                    <div className="w-full max-w-5xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <span className="text-sm text-gray-500 px-4">Quick suggestions</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Lookup?.SUGGSTIONS.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSuggestionClick(suggestion)}
                                    className="group relative p-5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-violet-500/30 text-left transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                                    <div className="relative flex items-start gap-3">
                                        <div className="mt-0.5 p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors duration-300">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                        <span className="text-gray-400 group-hover:text-gray-200 text-sm leading-relaxed transition-colors duration-300">
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
