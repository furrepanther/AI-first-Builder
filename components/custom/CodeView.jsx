"use client"
import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Loader2Icon, Download, Code2, Eye, FolderTree, Sparkles } from 'lucide-react';
import JSZip from 'jszip';

const SandpackProvider = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackProvider), { ssr: false });
const SandpackLayout = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackLayout), { ssr: false });
const SandpackCodeEditor = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackCodeEditor), { ssr: false });
const SandpackPreview = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackPreview), { ssr: false });
const SandpackFileExplorer = dynamic(() => import("@codesandbox/sandpack-react").then(mod => mod.SandpackFileExplorer), { ssr: false });

function CodeView() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
    const { messages } = useContext(MessagesContext);
    const UpdateFiles = useMutation(api.workspace.UpdateFiles);
    const convex = useConvex();
    const [loading, setLoading] = useState(false);
    const [sandpackKey, setSandpackKey] = useState(0);
    const [isReady, setIsReady] = useState(false);

    const preprocessFiles = useCallback((files) => {
        const processed = {};
        Object.entries(files).forEach(([path, content]) => {
            if (typeof content === 'string') {
                processed[path] = { code: content };
            } else if (content && typeof content === 'object') {
                if (!content.code && typeof content === 'object') {
                    processed[path] = { code: JSON.stringify(content, null, 2) };
                } else {
                    processed[path] = content;
                }
            }
        });
        return processed;
    }, []);

    const GetFiles = useCallback(async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        const processedFiles = preprocessFiles(result?.fileData || {});
        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...processedFiles };
        setFiles(mergedFiles);
        setSandpackKey(prev => prev + 1);
        setIsReady(true);
    }, [id, convex, preprocessFiles]);

    useEffect(() => {
        if (id) {
            setIsReady(false);
            GetFiles();
        }
    }, [id, GetFiles]);

    const GenerateAiCode = useCallback(async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;

        try {
            const response = await fetch('/api/gen-ai-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: PROMPT }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let finalData = null;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.done && data.final) {
                                finalData = data.final;
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            if (finalData && finalData.files) {
                const processedAiFiles = preprocessFiles(finalData.files || {});
                const mergedFiles = { ...Lookup.DEFAULT_FILE, ...processedAiFiles };
                setFiles(mergedFiles);
                setSandpackKey(prev => prev + 1);

                await UpdateFiles({
                    workspaceId: id,
                    files: finalData.files
                });
            }
        } catch (error) {
            console.error('Error generating AI code:', error);
        } finally {
            setLoading(false);
        }
    }, [messages, id, UpdateFiles, preprocessFiles]);

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GenerateAiCode();
            }
        }
    }, [messages, GenerateAiCode]);

    const downloadFiles = useCallback(async () => {
        try {
            const zip = new JSZip();

            Object.entries(files).forEach(([filename, content]) => {
                let fileContent;
                if (typeof content === 'string') {
                    fileContent = content;
                } else if (content && typeof content === 'object') {
                    if (content.code) {
                        fileContent = content.code;
                    } else {
                        fileContent = JSON.stringify(content, null, 2);
                    }
                }

                if (fileContent) {
                    const cleanFileName = filename.startsWith('/') ? filename.slice(1) : filename;
                    zip.file(cleanFileName, fileContent);
                }
            });

            const packageJson = {
                name: "generated-project",
                version: "1.0.0",
                private: true,
                dependencies: Lookup.DEPENDANCY,
                scripts: {
                    "dev": "vite",
                    "build": "vite build",
                    "preview": "vite preview"
                }
            };
            zip.file("package.json", JSON.stringify(packageJson, null, 2));

            const blob = await zip.generateAsync({ type: "blob" });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'project-files.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading files:', error);
        }
    }, [files]);

    const tabs = [
        { id: 'code', label: 'Code', icon: Code2 },
        { id: 'preview', label: 'Preview', icon: Eye },
    ];

    return (
        <div className="relative h-[85vh] rounded-2xl overflow-hidden border border-white/5 bg-[#030014]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Download Button */}
                <button
                    onClick={downloadFiles}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all duration-300"
                >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">Download</span>
                </button>
            </div>

            {/* Sandpack Editor */}
            {isReady && (
                <SandpackProvider
                    key={sandpackKey}
                    files={files}
                    template="react"
                    theme="dark"
                    customSetup={{
                        dependencies: {
                            ...Lookup.DEPENDANCY
                        },
                        entry: '/index.js'
                    }}
                    options={{
                        externalResources: ['https://cdn.tailwindcss.com'],
                        bundlerTimeoutSecs: 120,
                        recompileMode: "immediate",
                        recompileDelay: 300
                    }}
                >
                    <div className="relative h-[calc(85vh-60px)]">
                        <SandpackLayout className="!bg-transparent !border-none">
                            {activeTab === 'code' ? (
                                <>
                                    <SandpackFileExplorer
                                        style={{
                                            height: 'calc(85vh - 60px)',
                                            backgroundColor: 'rgba(10, 10, 26, 0.8)',
                                            borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                                        }}
                                    />
                                    <SandpackCodeEditor
                                        style={{
                                            height: 'calc(85vh - 60px)',
                                            backgroundColor: 'rgba(10, 10, 26, 0.5)'
                                        }}
                                        showTabs
                                        showLineNumbers
                                        showInlineErrors
                                        wrapContent
                                    />
                                </>
                            ) : (
                                <SandpackPreview
                                    style={{
                                        height: 'calc(85vh - 60px)',
                                        backgroundColor: '#ffffff'
                                    }}
                                    showNavigator={true}
                                    showOpenInCodeSandbox={false}
                                    showRefreshButton={true}
                                />
                            )}
                        </SandpackLayout>
                    </div>
                </SandpackProvider>
            )}

            {/* Loading State */}
            {!isReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030014]">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur-xl opacity-30 animate-pulse" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-white/10">
                            <Loader2Icon className="animate-spin h-8 w-8 text-violet-400" />
                        </div>
                    </div>
                    <p className="mt-4 text-gray-400 font-medium">Loading workspace...</p>
                </div>
            )}

            {/* Generating State */}
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030014]/90 backdrop-blur-sm z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur-xl opacity-40 animate-pulse" />
                        <div className="relative p-5 rounded-2xl glass-card">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                                    <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Generating code...</p>
                                    <p className="text-sm text-gray-400">AI is building your project</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CodeView;
