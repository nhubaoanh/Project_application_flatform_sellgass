'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { userStorage } from '@/demo/service/userStorage';
import { useRef } from 'react';

interface OrderItem {
    masanpham: string | number;
    tensp: string;
    gia: number;
    hinhanh: string;
    quantity: number;
}

interface Order {
    items: OrderItem[];
    paymentMethod: 'qr' | 'cod';
    totalPrice: number;
    customerInfo: {
        fullName: string;
        phone: string;
        address: string;
        note?: string;
    };
    timestamp: string;
}

const MyOrdersPage = () => {
    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = userStorage.getCurrentUser();
        if (!user) {
            router.push('/auth/login');
            return;
        }

        // Load orders from localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
        setLoading(false);
    }, [router]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('vi-VN');
    };

    const getPaymentMethodText = (method: 'qr' | 'cod') => {
        return method === 'qr' ? 'QR Code' : 'Thanh toán khi nhận hàng';
    };

    const orderItemsTemplate = (rowData: Order) => {
        return (
            <div className="space-y-2">
                {rowData.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                        <img
                            src={item.hinhanh}
                            alt={item.tensp}
                            width="40"
                            height="40"
                            className="border-round object-cover"
                        />
                        <div className="flex-grow">
                            <p className="m-0 font-semibold text-sm">{item.tensp}</p>
                            <p className="m-0 text-xs text-gray-600">x{item.quantity}</p>
                        </div>
                        <p className="m-0 font-bold text-red-600 text-sm">
                            {formatCurrency(item.gia * item.quantity)}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    const statusTemplate = (rowData: Order) => {
        return (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                Đã đặt hàng
            </span>
        );
    };

    if (loading) {
        return <div className="text-center py-6">Đang tải...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Card className="text-center p-8">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold mb-4 text-900">Bạn chưa có đơn hàng nào</h2>
                        <p className="text-600 mb-6">Hãy đặt hàng để xem lịch sử đơn hàng của bạn</p>
                        <Button
                            label="Tiếp tục mua sắm"
                            icon="pi pi-arrow-left"
                            onClick={() => router.push('/home')}
                        />
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Toast ref={toastRef} />
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-900 mb-2">📦 Đơn hàng của tôi</h1>
                    <p className="text-600">Tổng {orders.length} đơn hàng</p>
                </div>

                {/* Orders Table */}
                <Card className="p-0">
                    <DataTable
                        value={orders}
                        responsiveLayout="scroll"
                        showGridlines
                        className="p-datatable-striped"
                        emptyMessage="Không có đơn hàng nào"
                    >
                        <Column
                            field="timestamp"
                            header="Thời gian đặt"
                            body={(rowData) => formatDate(rowData.timestamp)}
                            sortable
                            style={{ width: '150px' }}
                        />
                        <Column
                            field="items"
                            header="Sản phẩm"
                            body={orderItemsTemplate}
                        />
                        <Column
                            field="totalPrice"
                            header="Tổng tiền"
                            body={(rowData) => (
                                <span className="font-bold text-red-600">
                                    {formatCurrency(rowData.totalPrice)}
                                </span>
                            )}
                            style={{ width: '120px' }}
                        />
                        <Column
                            field="paymentMethod"
                            header="Thanh toán"
                            body={(rowData) => getPaymentMethodText(rowData.paymentMethod)}
                            style={{ width: '140px' }}
                        />
                        <Column
                            field="status"
                            header="Trạng thái"
                            body={statusTemplate}
                            style={{ width: '120px' }}
                        />
                        <Column
                            header="Chi tiết"
                            body={(rowData) => (
                                <Button
                                    icon="pi pi-eye"
                                    severity="info"
                                    size="small"
                                    rounded
                                    tooltip="Xem chi tiết"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            )}
                            style={{ width: '80px' }}
                        />
                    </DataTable>
                </Card>

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <Button
                        label="Tiếp tục mua sắm"
                        icon="pi pi-arrow-left"
                        severity="secondary"
                        onClick={() => router.push('/home')}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;