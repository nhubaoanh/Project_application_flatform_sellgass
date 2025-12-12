'use client';
import React, { useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatBotProps {
    visible: boolean;
    onHide: () => void;
    messages: ChatMessage[];
    inputMessage: string;
    onInputChange: (value: string) => void;
    onSendMessage: () => void;
    onResetChat: () => void;
    loading: boolean;
    isAdmin: boolean;
    onToggleAdmin: () => void;
    chatStats: { products: number; categories: number };
}

const ChatBot: React.FC<ChatBotProps> = ({
    visible,
    onHide,
    messages,
    inputMessage,
    onInputChange,
    onSendMessage,
    onResetChat,
    loading,
    isAdmin,
    onToggleAdmin,
    chatStats
}) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const quickSuggestions = [
        { label: '👓 Kính cận', query: 'Tôi cần kính cận, bạn có gợi ý nào không?' },
        { label: '✨ Kính thời trang', query: 'Tôi muốn kính thời trang đẹp' },
        { label: '💰 Kính giá rẻ', query: 'Giới thiệu kính dưới 500k' },
        { label: '👨‍👩‍👧‍👦 Kính cho gia đình', query: 'Kính phù hợp cho gia đình' }
    ];

    return (
        <Dialog
            header={
                <div className="flex justify-content-between align-items-center w-full px-2">
                    <div className="flex align-items-center gap-3">
                        <div className="text-3xl">👓</div>
                        <div>
                            <h3 className="m-0 text-900 font-bold">Growby Advisor</h3>
                            <p className="m-0 text-sm text-600">Tư vấn kính mắt chuyên nghiệp</p>
                        </div>
                    </div>
                </div>
            }
            visible={visible}
            onHide={onHide}
            style={{ width: '90vw', height: '80vh', maxWidth: '900px' }}
            breakpoints={{ '960px': '95vw', '640px': '100vw' }}
            className="p-dialog-maximized-mobile"
            modal
        >
            <style>{`
                .chatbot-message-user {
                    animation: slideInRight 0.3s ease-out;
                }
                .chatbot-message-assistant {
                    animation: slideInLeft 0.3s ease-out;
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .chat-suggestion-chip {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .chat-suggestion-chip:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
            `}</style>

            <div className="flex flex-column h-full w-full" style={{ height: '80vh' }}>
                {/* Chat Messages Area */}
                <div
                    className="flex-1 overflow-auto p-4"
                    style={{
                        background: '#f8f9fa',
                        maxHeight: 'calc(80vh - 240px)',
                        minHeight: '300px'
                    }}
                >
                    {messages.length === 0 ? (
                        <div className="flex flex-column align-items-center justify-content-center h-full text-center p-4">
                            <div className="text-6xl mb-4">👓</div>
                            <h3 className="text-900 mb-2 font-bold text-xl">Xin chào! Tôi là Growby Advisor</h3>
                            <p className="text-600 mb-6 text-sm max-w-300">
                                Tôi sẵn sàng giúp bạn tìm chiếc kính mắt hoàn hảo. Hỏi tôi bất cứ điều gì!
                            </p>
                            <div className="flex flex-column gap-2 w-full max-w-400">
                                <p className="text-700 font-semibold mb-3 text-sm">💡 Bạn có thể hỏi về:</p>
                                {quickSuggestions.map((suggestion, idx) => (
                                    <div
                                        key={idx}
                                        className="chat-suggestion-chip bg-white border-1 border-blue-200 border-round p-3 hover:border-blue-400"
                                        onClick={() => onInputChange(suggestion.query)}
                                        style={{ textAlign: 'left', cursor: 'pointer' }}
                                    >
                                        <p className="m-0 font-semibold text-sm">{suggestion.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex mb-4 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                                >
                                    <div
                                        className={`chatbot-message-${msg.role} flex gap-2 max-w-400`}
                                        style={{ width: 'auto', maxWidth: '70%' }}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="text-2xl flex-shrink-0 mt-1">👓</div>
                                        )}
                                        <div
                                            className={`p-3 border-round-lg ${
                                                msg.role === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-900 border-1 border-gray-200'
                                            }`}
                                            style={{ borderRadius: '12px' }}
                                        >
                                            <p className="m-0 text-sm line-height-1-5">{msg.content}</p>
                                            <p 
                                                className={`m-0 mt-2 text-xs ${
                                                    msg.role === 'user' ? 'text-blue-100' : 'text-600'
                                                }`}
                                            >
                                                {msg.timestamp.toLocaleTimeString('vi-VN', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </p>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="text-2xl flex-shrink-0 mt-1">👤</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {loading && (
                        <div className="flex justify-content-start mb-4">
                            <div className="flex gap-2">
                                <div className="text-2xl">👓</div>
                                <div className="bg-white p-3 border-round-lg border-1 border-gray-200" style={{ borderRadius: '12px' }}>
                                    <div className="flex gap-2 align-items-center">
                                        <i className="pi pi-spin pi-spinner text-blue-600"></i>
                                        <span className="text-sm text-600">Đang soạn thảo...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-top-1 border-gray-200 bg-white">
                    <div className="flex gap-2 mb-3">
                        <InputTextarea
                            value={inputMessage}
                            onChange={(e) => onInputChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isAdmin ? '💬 Soạn thông báo...' : '💬 Hỏi tôi điều gì đó...'}
                            rows={2}
                            autoResize
                            className="w-full p-3 border-1 border-gray-300 border-round-lg"
                            style={{ borderRadius: '12px' }}
                            disabled={loading}
                        />
                        <Button 
                            icon="pi pi-send" 
                            onClick={onSendMessage} 
                            loading={loading} 
                            disabled={!inputMessage.trim() || loading}
                            // severity="primary"
                            rounded
                            style={{ height: '100%', minWidth: '44px' }}
                        />
                    </div>
                    <div className="flex justify-content-between align-items-center">
                        <Button 
                            label="Xóa lịch sử" 
                            icon="pi pi-refresh" 
                            text 
                            size="small" 
                            severity="secondary" 
                            onClick={onResetChat} 
                            disabled={loading || messages.length === 0}
                            className="text-gray-600 hover:text-gray-700"
                        />
                        <small className="text-600 font-medium">
                            {messages.length > 0 && `${messages.length} tin nhắn`}
                        </small>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ChatBot;
