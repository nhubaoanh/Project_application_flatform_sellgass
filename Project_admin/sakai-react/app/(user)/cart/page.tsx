'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { CartService } from '@/app/(full-page)/landing/services/CartService';
import { userStorage } from '@/demo/service/userStorage';
import Link from 'next/link';
import { useRef } from 'react';

interface CartItem {
    masanpham: string | number;
    tensp: string;
    gia: number;
    hinhanh: string;
    quantity: number;
    userid: string | number;
}

const CartPage = () => {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = userStorage.getCurrentUser();
        if (!user) {
            router.push('/auth/login');
            return;
        }

        const items = CartService.getCart();
        setCartItems(items);
        setLoading(false);
    }, [router]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const handleSelectItem = (masanpham: string | number, checked: boolean) => {
        const newSelected = new Set(selectedItems);
        if (checked) {
            newSelected.add(masanpham);
        } else {
            newSelected.delete(masanpham);
        }
        setSelectedItems(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(cartItems.map(item => item.masanpham));
            setSelectedItems(allIds);
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleQuantityChange = (masanpham: string | number, delta: number) => {
        const item = cartItems.find(i => i.masanpham === masanpham);
        if (!item) return;
        
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;
        
        CartService.updateQuantity(masanpham, newQuantity);
        setCartItems(CartService.getCart());
    };

    const handleRemoveItem = (masanpham: string | number) => {
        CartService.removeFromCart(masanpham);
        setCartItems(CartService.getCart());
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(masanpham);
            return newSet;
        });
        toastRef.current?.show({
            severity: 'info',
            summary: 'Đã xóa',
            detail: 'Sản phẩm đã được xóa khỏi giỏ hàng',
            life: 2000
        });
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedItems.has(item.masanpham))
            .reduce((total, item) => total + (item.gia * item.quantity), 0);
    };

    const selectedCount = selectedItems.size;
    const totalPrice = calculateTotal();
    const selectedItemsList = cartItems.filter(item => selectedItems.has(item.masanpham));
    const totalQuantity = selectedItemsList.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        if (selectedItemsList.length === 0) {
            toastRef.current?.show({
                severity: 'warn',
                summary: 'Thông báo',
                detail: 'Vui lòng chọn sản phẩm để thanh toán',
                life: 2000
            });
            return;
        }

        // Store checkout items in session
        sessionStorage.setItem('checkoutItems', JSON.stringify(selectedItemsList));
        router.push('/checkout');
    };

    const actionBodyTemplate = (rowData: CartItem) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    rounded
                    onClick={() => handleRemoveItem(rowData.masanpham)}
                    tooltip="Xóa sản phẩm"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    const imageBodyTemplate = (rowData: CartItem) => {
        return (
            <img
                src={rowData.hinhanh}
                alt={rowData.tensp}
                width="60"
                className="border-round"
            />
        );
    };

    const priceBodyTemplate = (rowData: CartItem) => {
        return <span className="font-bold text-blue-600">{formatCurrency(rowData.gia)}</span>;
    };

    const quantityBodyTemplate = (rowData: CartItem) => {
        return (
            <div className="flex gap-1 align-items-center justify-content-center">
                <Button
                    icon="pi pi-minus"
                    className="p-button-text p-button-sm"
                    onClick={() => handleQuantityChange(rowData.masanpham, -1)}
                    style={{ padding: '0.25rem', width: '28px', height: '28px' }}
                />
                <span className="px-2 py-1 font-semibold min-w-max" style={{ width: '40px', textAlign: 'center' }}>
                    {rowData.quantity}
                </span>
                <Button
                    icon="pi pi-plus"
                    className="p-button-text p-button-sm"
                    onClick={() => handleQuantityChange(rowData.masanpham, 1)}
                    style={{ padding: '0.25rem', width: '28px', height: '28px' }}
                />
            </div>
        );
    };

    const subtotalBodyTemplate = (rowData: CartItem) => {
        return (
            <span className="font-semibold text-green-600">
                {formatCurrency(rowData.gia * rowData.quantity)}
            </span>
        );
    };

    const selectBodyTemplate = (rowData: CartItem) => {
        return (
            <Checkbox
                checked={selectedItems.has(rowData.masanpham)}
                onChange={(e) => handleSelectItem(rowData.masanpham, e.checked || false)}
            />
        );
    };

    if (loading) {
        return <div className="text-center py-6">Đang tải...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="py-12">
                <Card className="text-center p-8">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold mb-4 text-900">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-600 mb-6">Hãy quay lại cửa hàng để chọn sản phẩm yêu thích</p>
                    <Link href="/home">
                        <Button label="Tiếp tục mua sắm" icon="pi pi-arrow-left" className="bg-blue-600" />
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <>
            <Toast ref={toastRef} />
            {/* Header */}
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-900 mb-2">🛒 Giỏ hàng của bạn</h1>
            </div>

            <div className="grid grid-cols-12 gap-6">
                    {/* Products List - Center (Takes 8 cols) */}
                    <div className="col-span-full lg:col-span-8">
                        {/* Header with Select All */}
                        <Card className="mb-4 border-1 border-gray-200 p-4">
                            <div className="flex gap-3 align-items-center">
                                <Checkbox checked={selectedItems.size === cartItems.length && cartItems.length > 0} onChange={(e) => handleSelectAll(e.checked || false)} />
                                <span className="font-semibold text-900">Chọn tất cả ({cartItems.length})</span>
                                {selectedCount > 0 && (
                                    <span className="ml-auto text-sm text-gray-600">
                                        Đã chọn {selectedCount}/{cartItems.length}
                                    </span>
                                )}
                            </div>
                        </Card>

                        {/* Product Cards */}
                        {cartItems.map((item) => {
                            const subtotal = item.gia * item.quantity;
                            const isSelected = selectedItems.has(item.masanpham);

                            return (
                                <Card key={item.masanpham} className={`mb-4 border-1 transition-all ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <div className="flex gap-4 align-items-start">
                                        {/* Checkbox */}
                                        <div className="flex-shrink-0 pt-1">
                                            <Checkbox checked={isSelected} onChange={(e) => handleSelectItem(item.masanpham, e.checked || false)} />
                                        </div>

                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <img src={item.hinhanh} alt={item.tensp} width="80" height="80" className="border-round object-cover" style={{ aspectRatio: '1/1' }} />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow">
                                            <h4 className="m-0 mb-2 text-900 font-semibold text-base line-clamp-2">{item.tensp}</h4>
                                            <p className="m-0 text-600 text-xs mb-2">Mã: {item.masanpham}</p>
                                            <p className="m-0 text-gray-500 text-xs">Kính mắt</p>
                                        </div>

                                        {/* Price & Quantity */}
                                        <div className="flex-shrink-0 text-right">
                                            <div className="text-red-600 font-bold text-lg mb-4">{formatCurrency(item.gia)}</div>

                                            {/* Quantity Control */}
                                            <div className="flex gap-1 align-items-center justify-content-end mb-3 border-1 border-gray-300 border-round" style={{ width: 'fit-content' }}>
                                                <Button icon="pi pi-minus" className="p-button-text p-button-sm" onClick={() => handleQuantityChange(item.masanpham, -1)} style={{ padding: '0.25rem', width: '28px', height: '28px' }} />
                                                <span className="px-3 py-1 font-semibold min-w-max" style={{ width: '40px' }}>
                                                    {item.quantity}
                                                </span>
                                                <Button icon="pi pi-plus" className="p-button-text p-button-sm" onClick={() => handleQuantityChange(item.masanpham, 1)} style={{ padding: '0.25rem', width: '28px', height: '28px' }} />
                                            </div>

                                            {/* Delete Button */}
                                            <Button icon="pi pi-trash" severity="danger" text size="small" onClick={() => handleRemoveItem(item.masanpham)} className="text-xs" style={{ padding: '0.25rem' }} />
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="border-top-1 border-gray-200 mt-3 pt-3 flex justify-content-end gap-2">
                                        <span className="text-600 text-sm">Thành tiền:</span>
                                        <span className="font-bold text-red-600 text-lg">{formatCurrency(subtotal)}</span>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Summary Sidebar - Right (Takes 4 cols) */}
                    <div className="col-span-full lg:col-span-4">
                        <Card className="sticky border-1 border-gray-200" style={{ top: '100px' }}>
                            <h3 className="text-xl font-bold text-900 mb-4 text-center border-bottom-1 border-gray-200 pb-3">📋 Tóm tắt đơn hàng</h3>

                            {/* Summary Details */}
                            <div className="space-y-3 mb-4 pb-4 border-bottom-1 border-gray-200">
                                <div className="flex justify-content-between text-sm">
                                    <span className="text-600">Sản phẩm được chọn:</span>
                                    <span className="font-semibold text-900">{selectedCount}</span>
                                </div>
                                <div className="flex justify-content-between text-sm">
                                    <span className="text-600">Tổng số lượng:</span>
                                    <span className="font-semibold text-900">{totalQuantity}</span>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-4 pb-4 border-bottom-1 border-gray-200">
                                <div className="flex justify-content-between text-sm">
                                    <span className="text-600">Tạm tính:</span>
                                    <span className="font-semibold text-900">{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-content-between text-sm">
                                    <span className="text-600">Phí vận chuyển:</span>
                                    <span className="font-semibold text-green-600">Miễn phí</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-content-between align-items-center mb-6 p-3 bg-orange-50 border-round">
                                <span className="font-bold text-900">Tổng cộng:</span>
                                <span className="font-bold text-2xl text-red-600">{formatCurrency(totalPrice)}</span>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <Button
                                    label={`Mua ngay (${selectedCount})`}
                                    icon="pi pi-check"
                                    className="w-full p-3 font-semibold"
                                    onClick={handleCheckout}
                                    disabled={selectedCount === 0}
                                    style={{
                                        borderRadius: '4px',
                                        backgroundColor: selectedCount === 0 ? '#d3d3d3' : '#ee4d2b',
                                        color: 'white',
                                        border: 'none',
                                        cursor: selectedCount === 0 ? 'not-allowed' : 'pointer'
                                    }}
                                />
                        <Button label="Tiếp tục mua" icon="pi pi-arrow-left" severity="secondary" className="w-full p-3" onClick={() => router.push('/home')} />
                            </div>

                            {/* Note */}
                            <div className="mt-4 p-2 bg-yellow-50 border-1 border-yellow-200 border-round text-center">
                                <p className="m-0 text-xs text-gray-700">⏰ Giỏ hàng sẽ được giữ trong 24 giờ</p>
                            </div>
                        </Card>
                    </div>
                </div>
        </>
    );
};

export default CartPage;
