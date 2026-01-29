"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { Loader2Icon, Send, User, Bot, Sparkles } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState, useCallback, memo } from 'react';
import { useMutation } from 'convex/react';
import Prompt from '@/data/Prompt';
import ReactMarkdown from 'react-markdown';

const MessageItem = memo(({ msg, index }) => (
    <div className={`group flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {msg.role !== 'user' && (
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Bot className="h-5 w-5 text-white" />
            </div>
        )}

        <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
            <div
                className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-md'
                        : 'glass-card rounded-bl-md'
                }`}
            >
                <ReactMarkdown
                    className={`prose prose-sm max-w-none ${
                        msg.role === 'user'
                            ? 'prose-invert'
                            : 'prose-invert prose-p:text-gray-300 prose-headings:text-white prose-code:text-violet-300 prose-code:bg-white/10 prose-code:px-1 prose-code:rounded'
                    }`}
                >
                    {msg.content}
                </ReactMarkdown>
            </div>
        </div>

        {msg.role === 'user' && (
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <User className="h-5 w-5 text-white" />
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
    const UpdateMessages = useMutation(api.workspace.UpdateWorkspace);

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
        } catch (error) {
            console.error('Error getting AI response:', error);
        } finally {
            setLoading(false);
        }
    }, [messages, id, UpdateMessages, setMessages]);

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
        <div className="relative h-[85vh] flex flex-col bg-[#030014] rounded-2xl overflow-hidden border border-white/5">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                    <Sparkles className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">AI Assistant</h3>
                    <p className="text-xs text-gray-500">Powered by GPT-4</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {Array.isArray(messages) && messages?.map((msg, index) => (
                    <MessageItem key={index} msg={msg} index={index} />
                ))}

                {loading && (
                    <div className="flex gap-4 justify-start">
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="glass-card rounded-2xl rounded-bl-md p-4">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Loader2Icon className="animate-spin h-5 w-5 text-violet-400" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl opacity-20 blur-sm" />
                    <div className="relative flex items-end gap-3 bg-[#0a0a1a] rounded-xl p-3 border border-white/10">
                        <textarea
                            placeholder="Type your message..."
                            value={userInput}
                            onChange={(event) => setUserInput(event.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm resize-none max-h-32 min-h-[40px]"
                            style={{ height: 'auto' }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                            }}
                        />
                        <button
                            onClick={() => userInput.trim() && onGenerate(userInput)}
                            disabled={!userInput.trim()}
                            className="flex-shrink-0 p-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs text-gray-600 mt-3">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}

export default ChatView;
