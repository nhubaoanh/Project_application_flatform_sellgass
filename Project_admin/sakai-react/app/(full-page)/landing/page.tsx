'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { Demo } from '@/types';

import { ProductService } from '@/demo/service/ProductService';
import { PhotoService } from '@/demo/service/PhotoService';
import { userStorage } from '@/demo/service/userStorage';
import { CartService } from './services/CartService';

// Import Components
import HeaderNav from './components/HeaderNav';
import HeroBanner from './components/HeroBanner';
import ProductCarousel from './components/ProductCarousel';
import ProductDataView from './components/ProductDataView';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
const LandingPage = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const [products, setProducts] = useState<Demo.sanpham[]>([]);
    const [dataViewValue, setDataViewValue] = useState<Demo.sanpham[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<Demo.sanpham[] | null>(null);
    const [cartCount, setCartCount] = useState(0);

    // Chat state
    const [visibleChat, setVisibleChat] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; timestamp: Date }[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatStats, setChatStats] = useState({ products: 0, categories: 0 });
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState<string | number | null>(null);

    // Hàm gửi tin nhắn AI
    const sendMessage = useCallback(async () => {
        if (!inputMessage.trim() || loading) return;

        const userMsg = {
            role: 'user' as const,
            content: inputMessage,
            timestamp: new Date()
        };

        const allMessages = [...messages, userMsg];
        setMessages(allMessages);
        setLoading(true);
        setInputMessage('');

        try {
            const res = await fetch('http://localhost:7890/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: allMessages.map((m) => ({
                        role: m.role,
                        content: m.content
                    })),
                    isAdmin
                })
            });

            const data = await res.json();

            if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant' as const,
                        content: data.error,
                        timestamp: new Date()
                    }
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant' as const,
                        content: data.reply,
                        timestamp: new Date()
                    }
                ]);
                setChatStats({
                    products: data.products || 0,
                    categories: data.categories || 0
                });
            }
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant' as const,
                    content: '❌ Lỗi kết nối! Kiểm tra API backend localhost:7890',
                    timestamp: new Date()
                }
            ]);
        }

        setLoading(false);
    }, [inputMessage, messages, isAdmin, loading]);

    // Reset chat
    const resetChat = () => {
        setMessages([]);
        setInputMessage('');
    };

    // Load products
    useEffect(() => {
        ProductService.getProdctNew().then((products) => setProducts(products));
        ProductService.getProdctNew().then((data) => setDataViewValue(data));
        PhotoService.getImages();
    }, []);

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue?.filter((product) => {
                const productNameLowercase = product.tensp.toLowerCase();
                const searchValueLowercase = value.toLowerCase();
                return productNameLowercase.includes(searchValueLowercase);
            });

            setFilteredValue(filtered);
        }
    };

    const handleLogin = () => {
        router.push('/auth/login');
    };

    const handleRegister = () => {
        router.push('/auth/register');
    };

    // Get user login
    useEffect(() => {
        const user = userStorage.getCurrentUser();
        if (user?.userId) {
            setUserId(user.userId);
            CartService.setCurrentUserId(user.userId);
            updateCartCount(user.userId);
        }
    }, []);

    const updateCartCount = (userid?: string | number) => {
        const count = CartService.getCartCount(userid);
        setCartCount(count);
    };

    const handleAddToCartSuccess = () => {
        updateCartCount(userId || undefined);
    };

    return (
        <div className="surface-0 flex justify-content-center min-h-screen" style={{
            background: '#f5f5f5'
        }}>
            <div id="home" className="landing-wrapper overflow-hidden w-full">
                <HeaderNav
                    onChatOpen={() => setVisibleChat(true)}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    messageCount={messages.length}
                    cartCount={cartCount}
                    onCart={() => router.push('/cart')}
                />

                <HeroBanner />

                <ProductCarousel products={products} onAddToCart={handleAddToCartSuccess} />

                <ProductDataView
                    products={dataViewValue}
                    onFilter={onFilter}
                    filteredProducts={filteredValue}
                    globalFilterValue={globalFilterValue}
                    onAddToCart={handleAddToCartSuccess}
                />

                <div id="pricing" className="py-6 px-4 lg:px-8 my-2 md:my-4 bg-white">
                    <div className="grid p-fluid">
                        <div className="col-12">
                            <div className="card">
                                <h3 className="mb-4 font-bold text-2xl">
                                    <span className="text-blue-600">💎</span> Sản phẩm khuyến mãi
                                </h3>
                                <ProductCarousel products={products.slice(0, 5)} onAddToCart={handleAddToCartSuccess} />
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

                <ChatBot
                    visible={visibleChat}
                    onHide={() => setVisibleChat(false)}
                    messages={messages}
                    inputMessage={inputMessage}
                    onInputChange={setInputMessage}
                    onSendMessage={sendMessage}
                    onResetChat={resetChat}
                    loading={loading}
                    isAdmin={isAdmin}
                    onToggleAdmin={() => setIsAdmin(!isAdmin)}
                    chatStats={chatStats}
                />
            </div>
        </div>
    );
};

export default LandingPage;
