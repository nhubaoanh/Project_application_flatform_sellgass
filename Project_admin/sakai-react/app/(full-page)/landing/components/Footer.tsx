'use client';
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="py-6 px-4 mx-0 mt-8 lg:mx-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-top-1 surface-border">
            <div className="grid justify-content-between">
                {/* Logo & Company */}
                <div className="col-12 md:col-3">
                    <Link href="/" className="flex align-items-center mb-3 cursor-pointer">
                        <span className="font-bold text-2xl text-blue-600">👓 Growby</span>
                    </Link>
                    <p className="text-sm text-600 mb-3">Kính mắt chất lượng cao với giá tốt nhất.</p>
                    <div className="flex gap-2">
                        <a href="#" className="text-blue-500 hover:text-blue-600 text-lg">📱</a>
                        <a href="#" className="text-blue-500 hover:text-blue-600 text-lg">👍</a>
                        <a href="#" className="text-blue-500 hover:text-blue-600 text-lg">🐦</a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="col-12 md:col-3 mt-4 md:mt-0">
                    <h5 className="font-semibold text-900 mb-3 text-base">Liên kết nhanh</h5>
                    <ul className="list-none p-0 m-0">
                        <li className="mb-2"><a href="#" className="text-sm text-600 hover:text-blue-600">Về chúng tôi</a></li>
                        <li className="mb-2"><a href="#" className="text-sm text-600 hover:text-blue-600">Sản phẩm</a></li>
                        <li className="mb-2"><a href="#" className="text-sm text-600 hover:text-blue-600">Khuyến mãi</a></li>
                        <li><a href="#" className="text-sm text-600 hover:text-blue-600">Liên hệ</a></li>
                    </ul>
                </div>

                {/* Support */}
                <div className="col-12 md:col-3 mt-4 md:mt-0">
                    <h5 className="font-semibold text-900 mb-3 text-base">Hỗ trợ</h5>
                    <ul className="list-none p-0 m-0">
                        <li className="mb-2"><a href="#" className="text-sm text-600 hover:text-blue-600">Hỏi đáp</a></li>
                        <li className="mb-2"><a href="#" className="text-sm text-600 hover:text-blue-600">Chính sách</a></li>
                        <li className="mb-2"><a href="#" className="text-sm text-600 hover:text-blue-600">Điều khoản</a></li>
                        <li><a href="#" className="text-sm text-600 hover:text-blue-600">Liên hệ</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="col-12 md:col-3 mt-4 md:mt-0">
                    <h5 className="font-semibold text-900 mb-3 text-base">Tin tức</h5>
                    <p className="text-sm text-600 mb-3">Nhận thông tin khuyến mãi mới nhất.</p>
                    <input type="email" placeholder="Email của bạn" className="w-full px-3 py-2 rounded border-1 surface-border text-sm" />
                </div>
            </div>

            {/* Copyright */}
            <div className="border-top-1 surface-border mt-6 pt-4 text-center">
                <p className="text-sm text-600">© 2024 Growby - Kính mắt chuyên nghiệp. Tất cả quyền được bảo lưu.</p>
            </div>
        </footer>
    );
};

export default Footer;
