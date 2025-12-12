'use client';
import React from 'react';

const HeroBanner: React.FC = () => {
    return (
        <div id="hero" className="relative w-full overflow-hidden" style={{ minHeight: '500px' }}>
            {/* Background with snow effect */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #1a2a4e 0%, #2d3e5f 50%, #1a3a5f 100%)',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Snow particles effect */}
                <style>{`
                    @keyframes snowfall {
                        0% { transform: translateY(-10vh) translateX(0); opacity: 1; }
                        90% { opacity: 1; }
                        100% { transform: translateY(100vh) translateX(100px); opacity: 0; }
                    }
                    .snowflake {
                        position: absolute;
                        top: -10vh;
                        color: white;
                        font-size: 1.5em;
                        opacity: 0.8;
                        animation: snowfall linear infinite;
                    }
                `}</style>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="snowflake"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${10 + Math.random() * 10}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            fontSize: `${0.5 + Math.random() * 1.5}em`
                        }}
                    >
                        ❄
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col lg:flex-row align-items-center justify-content-between h-full px-4 md:px-8 lg:px-12 py-12">
                
                {/* Left side - Product Image */}
                <div className="w-full lg:w-2/5 flex justify-content-center lg:justify-content-start mb-8 lg:mb-0">
                    <div className="relative" style={{ maxWidth: '350px', width: '100%' }}>
                        <img 
                            src="/demo/images/landing/banner.png" 
                            alt="Product" 
                            className="w-full h-auto drop-shadow-2xl"
                            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
                        />
                    </div>
                </div>

                {/* Right side - Promotions */}
                <div className="w-full lg:w-3/5 flex flex-column align-items-center lg:align-items-end gap-4">
                    
                    {/* Main Title */}
                    <div className="text-center lg:text-right mb-4">
                        <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
                            Big sale mùa lễ
                        </h2>
                        <h3 className="text-yellow-300 text-2xl md:text-3xl font-bold">
                            SĂN KINH CHUẨN GU
                        </h3>
                    </div>

                    {/* Promo Boxes */}
                    <div className="flex flex-column gap-3 w-full lg:max-w-sm">
                        
                        {/* Box 1 - Yellow */}
                        <div className="bg-yellow-300 rounded-lg p-4 shadow-lg flex align-items-center gap-3 hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
                            <div className="text-4xl">👓</div>
                            <div>
                                <div className="text-900 font-bold text-xl">-20%</div>
                                <div className="text-700 text-sm">Mắt kính khi mua gọng</div>
                            </div>
                        </div>

                        {/* Box 2 - White with tag */}
                        <div className="bg-white rounded-lg p-4 shadow-lg flex align-items-center gap-3 hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
                            <div className="text-4xl">🎄</div>
                            <div className="flex-grow-1">
                                <div className="text-900 font-bold">GONG TRENDY</div>
                                <div className="text-blue-600 font-bold text-lg">CHỈ 1K</div>
                                <div className="text-600 text-xs">(Áp dụng cho LILY HCM)</div>
                            </div>
                        </div>

                        {/* Box 3 - Yellow */}
                        <div className="bg-yellow-300 rounded-lg p-4 shadow-lg flex align-items-center gap-3 hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
                            <div className="text-4xl">🎁</div>
                            <div>
                                <div className="text-900 font-bold text-xl">-15%</div>
                                <div className="text-700 text-sm">Tổng hóa đơn <br/> *(Áp dụng cho khách uống 22 tuổi)</div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button className="mt-4 px-8 py-3 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-2xl">
                            Chọn kính thời trang - Nhớ tại Lily →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
