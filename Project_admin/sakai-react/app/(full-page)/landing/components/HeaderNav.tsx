'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { NodeRef } from '@/types';

interface HeaderNavProps {
    onChatOpen: () => void;
    onLogin: () => void;
    onRegister: () => void;
    messageCount: number;
    cartCount?: number;
    onCart: () => void;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ onChatOpen, onLogin, onRegister, messageCount, cartCount = 0, onCart }) => {
    const [isHidden, setIsHidden] = useState(false);
    const menuRef = useRef<HTMLElement | null>(null);

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };
    

    return (
        <>
            {/* Top Banner */}
            <div className="w-full bg-blue-600 text-white py-2 px-4 text-center text-sm">
                <p>Lần đầu tiên ghé Lily? Tìm kinh phù hợp ngay →</p>
            </div>

            {/* Main Header */}
            <div className="w-full bg-white border-bottom-1 border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="py-3 px-4 md:px-6 lg:px-8 flex align-items-center justify-content-between">
                    {/* Logo */}
                    <Link href="/" className="flex align-items-center">
                        <span className="text-900 font-bold text-xl lg:text-2xl tracking-widest">GROWBY</span>
                    </Link>

                    {/* Mobile Menu Icon */}
                    <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick>
                        <i ref={menuRef} className="pi pi-bars text-2xl cursor-pointer block lg:hidden text-700"></i>
                    </StyleClass>

                    {/* Navigation */}
                    <div className={classNames('hidden lg:flex align-items-center flex-grow-1 justify-content-center gap-1', { hidden: isHidden })} style={{ marginLeft: '3rem' }}>
                        <nav className="flex gap-0">
                            <a href="#" className="px-4 py-3 text-700 hover:text-blue-600 font-medium transition text-sm border-bottom-2 border-transparent hover:border-blue-600">Sản phẩm</a>
                            <a href="#features" className="px-4 py-3 text-700 hover:text-blue-600 font-medium transition text-sm border-bottom-2 border-transparent hover:border-blue-600">Best seller</a>
                            <a href="#" className="px-4 py-3 text-700 hover:text-blue-600 font-medium transition text-sm border-bottom-2 border-transparent hover:border-blue-600">Chính sách bảo hành</a>
                            <a href="#" className="px-4 py-3 text-700 hover:text-blue-600 font-medium transition text-sm border-bottom-2 border-transparent hover:border-blue-600">Góc Lily</a>
                            <a href="#" className="px-4 py-3 text-700 hover:text-blue-600 font-medium transition text-sm border-bottom-2 border-transparent hover:border-blue-600">Khách hàng</a>
                        </nav>
                    </div>

                    {/* Right Actions */}
                    <div className="flex align-items-center gap-3">
                        {/* Search */}
                        <Button 
                            icon="pi pi-search" 
                            rounded 
                            text 
                            className="text-gray-700 hover:text-blue-600"
                            severity="secondary"
                        />

                        {/* Shopping Cart */}
                        <Button
                            icon="pi pi-shopping-cart"
                            rounded
                            severity="secondary"
                            text
                            className="relative text-gray-700 hover:text-blue-600"
                            badge={cartCount > 0 ? cartCount.toString() : undefined}
                            badgeClassName="p-badge-danger"
                            title="Giỏ hàng"
                            onClick={onCart}
                        />

                        {/* Chat */}
                        <Button
                            icon="pi pi-comments"
                            rounded
                            text
                            severity="secondary"
                            className="text-gray-700 hover:text-blue-600"
                            badge={messageCount > 0 ? messageCount.toString() : undefined}
                            badgeClassName="p-badge-danger"
                            onClick={onChatOpen}
                            title="Chat AI"
                        />

                        {/* Login/Register */}
                        <div className="flex gap-2 border-left-1 border-gray-200 pl-3 ml-2">
                            <Button 
                                label="Đăng nhập" 
                                text 
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm" 
                                onClick={onLogin}
                            />
                            <Button 
                                label="Đăng ký" 
                                severity="info"
                                className="bg-blue-600 text-white font-medium text-sm py-2 px-4" 
                                onClick={onRegister}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeaderNav;
