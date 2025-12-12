'use client';
import React, { useRef, useState } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Toast } from 'primereact/toast';
import { Demo } from '@/types';
import { CartService } from '../services/CartService';

interface ProductDataViewProps {
    products: Demo.sanpham[];
    onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredProducts: Demo.sanpham[] | null;
    globalFilterValue: string;
    onAddToCart?: () => void;
}

const ProductDataView: React.FC<ProductDataViewProps> = ({ products, onFilter, filteredProducts, globalFilterValue, onAddToCart }) => {
    const toastRef = useRef<Toast>(null);
    const [sortKey, setSortKey] = useState(null);
    const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    const formatCurrency = (value: number | string | null | undefined) => {
        if (value == null || isNaN(Number(value))) return 'N/A';
        return Number(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    const handleAddToCart = (product: Demo.sanpham) => {
        try {
            CartService.addToCart({
                masanpham: product.masp,
                tensp: product.tensp,
                gia: product.gia,
                hinhanh: product.hinhanh,
                quantity: 1
            });

            toastRef.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: `${product.tensp} đã được thêm vào giỏ hàng!`,
                life: 2000
            });

            onAddToCart?.();
        } catch (error) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng đăng nhập để thêm vào giỏ hàng',
                life: 2000
            });
        }
    };

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataviewListItem = (data: Demo.sanpham) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full hover:shadow-md transition-shadow">
                    <img src={data.hinhanh} alt={data.tensp} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5 border-round" />
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <div className="font-bold text-2xl">{data.tensp}</div>
                        <div className="mb-2 text-600">{data.mota?.substring(0, 80)}</div>
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2 text-blue-600"></i>
                            <span className="font-semibold text-blue-600">{data.maloai}</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0 gap-2">
                        <span className="text-2xl font-bold text-blue-600 mb-2 align-self-center md:align-self-end">{formatCurrency(data.gia)}</span>
                        <Button 
                            icon="pi pi-shopping-cart" 
                            label="Mua ngay" 
                            severity="success"
                            size="small" 
                            className="mb-2"
                            onClick={() => handleAddToCart(data)}
                        />
                    </div>
                </div>
            </div>
        );
    };

const dataviewGridItem = (data: Demo.sanpham) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-border hover:shadow-lg transition-shadow">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2" />
                            <span className="font-semibold text-sm">{data.maloai}</span>
                        </div>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">✓ Sẵn hàng</span>
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <div style={{ height: '180px', overflow: 'hidden', borderRadius: '8px' }}>
                            <Image src={data.hinhanh} width="100%" preview />
                        </div>
                        <div className="text-xl font-bold mt-3">{data.tensp}</div>
                        <div className="mb-3 text-sm text-600 line-height-2">{data.mota?.substring(0, 50)}...</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-bold text-blue-600">{formatCurrency(data.gia)}</span>
                        <Button 
                            icon="pi pi-shopping-cart" 
                            severity="success"
                            onClick={() => handleAddToCart(data)}
                            title="Thêm vào giỏ"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data: Demo.sanpham, layout: 'grid' | 'list' | (string & Record<string, unknown>)) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        } else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Price" onChange={onSortChange} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onFilter} placeholder="Search by Name" />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    return (
        <>
            <Toast ref={toastRef} />
            <div id="highlights" className="py-6 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                <div className="grid">
                    <div className="col-12">
                        <div className="card">
                            <h3 className="mb-4 font-bold text-2xl">
                                <span className="text-blue-600">📦</span> Danh sách sản phẩm
                            </h3>
                            <DataView value={filteredProducts || products} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDataView;
