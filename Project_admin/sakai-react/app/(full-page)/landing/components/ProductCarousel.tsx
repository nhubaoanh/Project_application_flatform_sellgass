'use client';
import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Demo } from '@/types';
import { CartService } from '../services/CartService';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface ProductCarouselProps {
    products: Demo.sanpham[];
    onAddToCart?: () => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, onAddToCart }) => {
    const toastRef = useRef<Toast>(null);

    const carouselResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
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

    const carouselItemTemplate = (product: Demo.sanpham) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 hover:shadow-lg transition-shadow">
                <div className="mb-3 position-relative overflow-hidden border-round" style={{ height: '200px' }}>
                    <Image src={product.hinhanh} width="100%" preview />
                </div>
                <div>
                    <h4 className="p-mb-1 line-height-3">{product.tensp}</h4>
                    <h6 className="mt-0 mb-3 text-blue-600 font-bold">{formatCurrency(product.gia)}</h6>
                    <div className="car-buttons mt-5 flex gap-2 justify-content-center">
                        <Button type="button" rounded icon="pi pi-shopping-cart" severity="success" onClick={() => handleAddToCart(product)} title="Thêm vào giỏ" />
                        <Button type="button" severity="info" rounded icon="pi pi-heart" title="Yêu thích" />
                        <Button type="button" severity="secondary" rounded icon="pi pi-share-alt" title="Chia sẻ" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Toast ref={toastRef} />
            <div id="features" className="py-6 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                <div className="grid p-fluid">
                    <div className="col-12">
                        <div className="card">
                            <h3 className="mb-4 font-bold text-2xl">
                                <span className="text-blue-600">⭐</span> Sản phẩm nổi bật
                            </h3>
                            <Carousel value={products} numVisible={3} numScroll={3} responsiveOptions={carouselResponsiveOptions} itemTemplate={carouselItemTemplate}></Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductCarousel;
