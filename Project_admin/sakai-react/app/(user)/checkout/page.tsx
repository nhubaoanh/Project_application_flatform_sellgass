'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { userStorage } from '@/demo/service/userStorage';
import { useRef } from 'react';

interface CheckoutItem {
    masanpham: string | number;
    tensp: string;
    gia: number;
    hinhanh: string;
    quantity: number;
    userid: string | number;
}

const CheckoutPage = () => {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('cod');
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: ''
    });

    useEffect(() => {
        const user = userStorage.getCurrentUser();
        if (!user) {
            router.push('/auth/login');
            return;
        }

        const items = sessionStorage.getItem('checkoutItems');
        if (!items) {
            router.push('/cart');
            return;
        }

        setCheckoutItems(JSON.parse(items));
        setLoading(false);

        // Set customer info from user
        if (user.username) {
            setFormData((prev) => ({ ...prev, fullName: user.username }));
        }
    }, [router]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Hết thời gian',
                detail: 'Phiên thanh toán của bạn đã hết hạn. Quay lại giỏ hàng.',
                life: 3000
            });
            router.push('/cart');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, router]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const totalPrice = checkoutItems.reduce((sum, item) => sum + (item.gia * item.quantity), 0);
    const totalQuantity = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!formData.fullName || !formData.phone || !formData.address) {
            toastRef.current?.show({
                severity: 'warn',
                summary: 'Thông báo',
                detail: 'Vui lòng điền đầy đủ thông tin giao hàng',
                life: 2000
            });
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const orderData = {
                items: checkoutItems,
                paymentMethod,
                totalPrice,
                customerInfo: formData,
                timestamp: new Date().toISOString()
            };

            console.log('Order placed:', orderData);

            // Save to localStorage or send to backend
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));

            toastRef.current?.show({
                severity: 'success',
                summary: 'Thành công!',
                detail: 'Đơn hàng của bạn đã được tạo. Chúng tôi sẽ liên hệ sớm.',
                life: 3000
            });

            // Clear checkout items
            sessionStorage.removeItem('checkoutItems');

            setTimeout(() => {
                router.push('/my-orders');
            }, 2000);
        } catch (error) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tạo đơn hàng. Vui lòng thử lại.',
                life: 2000
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return <div className="text-center py-6">Đang tải...</div>;
    }

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Card className="text-center p-8">
                        <h2 className="text-2xl font-bold mb-4 text-900">Không có sản phẩm để thanh toán</h2>
                        <Button
                            label="Quay lại giỏ hàng"
                            icon="pi pi-arrow-left"
                            onClick={() => router.push('/user/cart')}
                        />
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toast ref={toastRef} />
            {/* Header with Timer */}
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-900 mb-2">💳 Thanh toán</h1>
                <div className={`inline-block px-4 py-2 rounded-lg font-bold text-lg ${
                    timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    ⏰ Thời gian còn lại: {formatTime(timeLeft)}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                    {/* Left Side - Order Info & Payment */}
                    <div className="col-span-full lg:col-span-8">
                        {/* Order Items */}
                        <Card className="mb-6 border-1 border-gray-200">
                            <h3 className="text-lg font-bold text-900 mb-4 border-bottom-1 border-gray-200 pb-3">
                                📦 Sản phẩm thanh toán ({totalQuantity})
                            </h3>

                            {checkoutItems.map((item) => (
                                <div key={item.masanpham} className="flex gap-4 pb-4 border-bottom-1 border-gray-200 last:border-0 last:pb-0 mb-4 last:mb-0">
                                    <img
                                        src={item.hinhanh}
                                        alt={item.tensp}
                                        width="70"
                                        height="70"
                                        className="border-round object-cover"
                                    />
                                    <div className="flex-grow">
                                        <p className="m-0 font-semibold text-900 mb-1">{item.tensp}</p>
                                        <p className="m-0 text-sm text-600">x{item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="m-0 font-bold text-red-600">
                                            {formatCurrency(item.gia * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </Card>

                        {/* Customer Info */}
                        <Card className="mb-6 border-1 border-gray-200">
                            <h3 className="text-lg font-bold text-900 mb-4 border-bottom-1 border-gray-200 pb-3">
                                👤 Thông tin giao hàng
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-900 mb-2">Họ và tên *</label>
                                    <InputText
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Nhập họ và tên"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-900 mb-2">Số điện thoại *</label>
                                    <InputText
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-900 mb-2">Địa chỉ giao hàng *</label>
                                    <InputTextarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Nhập địa chỉ giao hàng"
                                        rows={3}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-900 mb-2">Ghi chú (tùy chọn)</label>
                                    <InputTextarea
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                        placeholder="Ghi chú thêm cho đơn hàng"
                                        rows={2}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Payment Method */}
                        <Card className="border-1 border-gray-200">
                            <h3 className="text-lg font-bold text-900 mb-4 border-bottom-1 border-gray-200 pb-3">
                                💰 Phương thức thanh toán
                            </h3>

                            <div className="space-y-4">
                                {/* QR Payment */}
                                <div className={`p-4 border-1 border-round cursor-pointer transition-all ${
                                    paymentMethod === 'qr'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                     onClick={() => setPaymentMethod('qr')}>
                                    <div className="flex gap-3 align-items-center">
                                        <RadioButton
                                            name="payment"
                                            value="qr"
                                            checked={paymentMethod === 'qr'}
                                            onChange={(e) => setPaymentMethod(e.value)}
                                        />
                                        <div>
                                            <p className="m-0 font-semibold text-900">🔗 Thanh toán qua QR Code</p>
                                            <p className="m-0 text-sm text-600">Quét mã QR để thanh toán</p>
                                        </div>
                                    </div>

                                    {paymentMethod === 'qr' && (
                                        <div className="mt-4 bg-white p-4 border-1 border-gray-200 border-round text-center">
                                            <div className="w-40 h-40 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 border-round flex align-items-center justify-content-center">
                                                <div className="text-center">
                                                    <p className="text-2xl mb-2">📱</p>
                                                    <p className="text-sm text-gray-600">Mã QR sẽ hiển thị ở đây</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-3">
                                                Số tiền thanh toán: <span className="font-bold text-red-600">{formatCurrency(totalPrice)}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* COD Payment */}
                                <div className={`p-4 border-1 border-round cursor-pointer transition-all ${
                                    paymentMethod === 'cod'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                     onClick={() => setPaymentMethod('cod')}>
                                    <div className="flex gap-3 align-items-center">
                                        <RadioButton
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.value)}
                                        />
                                        <div>
                                            <p className="m-0 font-semibold text-900">🚚 Thanh toán khi nhận hàng (COD)</p>
                                            <p className="m-0 text-sm text-600">Thanh toán trực tiếp với bưu phí viên</p>
                                        </div>
                                    </div>

                                    {paymentMethod === 'cod' && (
                                        <div className="mt-4 p-3 bg-green-50 border-1 border-green-200 border-round text-center">
                                            <p className="m-0 text-sm text-green-700">
                                                ✓ Bạn sẽ thanh toán <span className="font-bold">{formatCurrency(totalPrice)}</span> khi nhận hàng
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="col-span-full lg:col-span-4">
                        <Card className="sticky border-1 border-gray-200" style={{ top: '100px' }}>
                            <h3 className="text-lg font-bold text-900 mb-4 text-center border-bottom-1 border-gray-200 pb-3">
                                📋 Tóm tắt đơn hàng
                            </h3>

                            <div className="space-y-3 mb-4 pb-4 border-bottom-1 border-gray-200">
                                <div className="flex justify-content-between text-sm">
                                    <span className="text-600">Tổng sản phẩm:</span>
                                    <span className="font-semibold text-900">{totalQuantity}</span>
                                </div>
                                <div className="flex justify-content-between text-sm">
                                    <span className="text-600">Số đơn vị:</span>
                                    <span className="font-semibold text-900">{checkoutItems.length}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4 pb-4 border-bottom-1 border-gray-200">
                                <div className="flex justify-content-between text-sm">
                                    <span className="text-600">Tạm tính:</span>
                                    <span className="font-semibold text-900">{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-content-between text-sm">
                                    <span className="text-600">Phí vận chuyển:</span>
                                    <span className="font-semibold text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-content-between text-sm">
                                    <span className="text-600">Thuế (0%):</span>
                                    <span className="font-semibold text-900">0 ₫</span>
                                </div>
                            </div>

                            <div className="flex justify-content-between align-items-center mb-6 p-3 bg-orange-50 border-round">
                                <span className="font-bold text-900">Tổng cộng:</span>
                                <span className="font-bold text-2xl text-red-600">{formatCurrency(totalPrice)}</span>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    label={`Đặt hàng (${paymentMethod === 'qr' ? 'QR' : 'COD'})`}
                                    icon={isProcessing ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                                    className="w-full p-3 font-semibold"
                                    onClick={handlePlaceOrder}
                                    loading={isProcessing}
                                    disabled={isProcessing}
                                    style={{
                                        borderRadius: '4px',
                                        backgroundColor: '#ee4d2b',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                />
                                <Button
                                    label="Quay lại giỏ hàng"
                                    icon="pi pi-arrow-left"
                                    severity="secondary"
                                    className="w-full p-3"
                                    onClick={() => router.push('/cart')}
                                    disabled={isProcessing}
                                />
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 border-1 border-blue-200 border-round text-center">
                                <p className="m-0 text-xs text-blue-700">
                                    ✓ Đơn hàng sẽ được xác nhận trong 1 giờ
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
        </>
    );
};

export default CheckoutPage;
