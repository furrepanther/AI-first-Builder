"use client"
import { MessagesContext } from '@/context/MessagesContext';
import {
    Loader2Icon, Send, User, Bot, Sparkles,
    FileCode, Palette, Layout, CheckCircle2,
    Clock, Zap, Code2, Eye, Layers
} from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState, useCallback, memo, useRef } from 'react';
import { useMutation } from 'convex/react';
import Prompt from '@/data/Prompt';
import ReactMarkdown from 'react-markdown';

// Activity types and their icons/colors
const ACTIVITY_TYPES = {
    analyzing: { icon: Eye, label: 'Analyzing request', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    planning: { icon: Layout, label: 'Planning structure', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    generating: { icon: Code2, label: 'Generating code', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    styling: { icon: Palette, label: 'Applying styles', color: 'text-pink-400', bg: 'bg-pink-500/10' },
    components: { icon: Layers, label: 'Building components', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    finalizing: { icon: FileCode, label: 'Finalizing files', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    complete: { icon: CheckCircle2, label: 'Complete', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

const ActivityItem = memo(({ type, isActive, timestamp }) => {
    const activity = ACTIVITY_TYPES[type];
    if (!activity) return null;

    return (
        <div className={`activity-item ${isActive ? 'border-white/10' : 'opacity-60'}`}>
            <div className={`p-2 rounded-lg ${activity.bg}`}>
                <activity.icon className={`h-4 w-4 ${activity.color} ${isActive ? 'animate-pulse' : ''}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {activity.label}
                </p>
                {timestamp && (
                    <p className="text-xs text-gray-600 mt-0.5">{timestamp}</p>
                )}
            </div>
            {isActive && (
                <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
            )}
            {type === 'complete' && !isActive && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
        </div>
    );
});

ActivityItem.displayName = 'ActivityItem';

const MessageItem = memo(({ msg }) => (
    <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {msg.role !== 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Bot className="h-4 w-4 text-white" />
            </div>
        )}

        <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
            <div
                className={`px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-br-md'
                        : 'card-glass rounded-bl-md'
                }`}
            >
                <ReactMarkdown
                    className={`prose prose-sm max-w-none ${
                        msg.role === 'user'
                            ? 'prose-invert'
                            : 'prose-invert prose-p:text-gray-300 prose-headings:text-white prose-code:text-purple-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs'
                    }`}
                >
                    {msg.content}
                </ReactMarkdown>
            </div>
        </div>

        {msg.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <User className="h-4 w-4 text-white" />
            </div>
        )}
    </div>
));

MessageItem.displayName = 'MessageItem';

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [activityHistory, setActivityHistory] = useState([]);
    const UpdateMessages = useMutation(api.workspace.UpdateWorkspace);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const simulateActivityProgress = useCallback(() => {
        const activities = ['analyzing', 'planning', 'components', 'styling', 'generating', 'finalizing'];
        let index = 0;

        setActivityHistory([]);
        setCurrentActivity(activities[0]);

        const interval = setInterval(() => {
            if (index < activities.length - 1) {
                setActivityHistory(prev => [...prev, { type: activities[index], timestamp: new Date().toLocaleTimeString() }]);
                index++;
                setCurrentActivity(activities[index]);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const GetWorkSpaceData = useCallback(async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        setMessages(result?.messages);
    }, [id, convex, setMessages]);

    useEffect(() => {
        id && GetWorkSpaceData();
    }, [id, GetWorkSpaceData]);

    const GetAiResponse = useCallback(async () => {
        setLoading(true);
        const clearProgress = simulateActivityProgress();
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;

        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: PROMPT }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            const aiMessageIndex = messages.length;
            setMessages(prev => [...prev, { role: 'ai', content: '' }]);

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
                                fullText += data.chunk;
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[aiMessageIndex] = { role: 'ai', content: fullText };
                                    return updated;
                                });
                            }
                            if (data.done && data.result) {
                                fullText = data.result;
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[aiMessageIndex] = { role: 'ai', content: fullText };
                                    return updated;
                                });
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            const finalMessages = [...messages, { role: 'ai', content: fullText }];
            await UpdateMessages({
                messages: finalMessages,
                workspaceId: id
            });

            // Mark as complete
            setActivityHistory(prev => [...prev, { type: 'complete', timestamp: new Date().toLocaleTimeString() }]);
            setCurrentActivity('complete');
        } catch (error) {
            console.error('Error getting AI response:', error);
        } finally {
            clearProgress();
            setLoading(false);
            setTimeout(() => {
                setCurrentActivity(null);
                setActivityHistory([]);
            }, 2000);
        }
    }, [messages, id, UpdateMessages, setMessages, simulateActivityProgress]);

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GetAiResponse();
            }
        }
    }, [messages, GetAiResponse]);

    const onGenerate = useCallback((input) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }]);
        setUserInput('');
    }, [setMessages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && userInput.trim()) {
            e.preventDefault();
            onGenerate(userInput);
        }
    };

    return (
        <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0f]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                        <p className="text-[10px] text-gray-500">GPT-4 Powered</p>
                    </div>
                </div>
                <div className={`status-indicator ${loading ? 'status-generating' : 'status-complete'}`}>
                    {loading ? (
                        <>
                            <Loader2Icon className="h-3 w-3 animate-spin" />
                            <span>Working</span>
                        </>
                    ) : (
                        <>
                            <Zap className="h-3 w-3" />
                            <span>Ready</span>
                        </>
                    )}
                </div>
            </div>

            {/* Activity Panel - Shows when loading */}
            {(loading || currentActivity) && (
                <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.01]">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                        <span className="section-title">Activity</span>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {activityHistory.map((activity, idx) => (
                            <ActivityItem
                                key={idx}
                                type={activity.type}
                                isActive={false}
                                timestamp={activity.timestamp}
                            />
                        ))}
                        {currentActivity && currentActivity !== 'complete' && (
                            <ActivityItem
                                type={currentActivity}
                                isActive={true}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
                {Array.isArray(messages) && messages?.map((msg, index) => (
                    <MessageItem key={index} msg={msg} />
                ))}

                {loading && !messages?.some(m => m.role === 'ai' && m.content === '') && (
                    <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="card-glass rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="p-3 border-t border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                        <textarea
                            placeholder="Describe your website..."
                            value={userInput}
                            onChange={(event) => setUserInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            className="w-full input-field text-sm resize-none min-h-[44px] max-h-32 pr-4"
                            style={{ height: 'auto' }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                            }}
                        />
                    </div>
                    <button
                        onClick={() => userInput.trim() && onGenerate(userInput)}
                        disabled={!userInput.trim() || loading}
                        className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-600 mt-2">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] text-gray-500 font-mono">Enter</kbd> to send
                </p>
            </div>
        </div>
    );
}

export default ChatView;
