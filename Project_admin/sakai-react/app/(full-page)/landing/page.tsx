'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { Demo, NodeRef } from '@/types';
import { classNames } from 'primereact/utils';
import { useRouter } from 'next/navigation';

import { Carousel } from 'primereact/carousel';
import { ProductService } from '@/demo/service/ProductService';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Galleria } from 'primereact/galleria';
import { PhotoService } from '@/demo/service/PhotoService';
import { Image } from 'primereact/image';


// Thêm imports
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';
import { OrderService } from '@/demo/service/OrderService';
import { userStorage } from '@/demo/service/userStorage';





const LandingPage = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);

    const [images, setImages] = useState<Demo.Photo[]>([]);

    const galleriaItemTemplate = (item: Demo.Photo) => <img src={`/${item.itemImageSrc}`} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
    const galleriaThumbnailTemplate = (item: Demo.Photo) => <img src={`/${item.thumbnailImageSrc}`} alt={item.alt} style={{ width: '100%', display: 'block' }} />;

    const listValue = [
        { name: 'San Francisco', code: 'SF' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Berlin', code: 'BRL' },
        { name: 'Barcelona', code: 'BRC' },
        { name: 'Rome', code: 'RM' }
    ];
    const [products, setProducts] = useState<Demo.sanpham[]>([]);
    const [dataViewValue, setDataViewValue] = useState<Demo.sanpham[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<Demo.sanpham[] | null>(null);
    const [sortKey, setSortKey] = useState(null);
    const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');
    // const [orderlistValue, setOrderlistValue] = useState(listValue);

    // // Hàm định dạng sang VND để hiển thị
    // const formatVND = (value: number) => {
    //     return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    // };

    // Thêm state mới
    const [visibleChat, setVisibleChat] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; timestamp: Date }[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatStats, setChatStats] = useState({ products: 0, categories: 0 });
    const [isAdmin, setIsAdmin] = useState(false); // Toggle admin mode
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Hàm scroll chat xuống cuối
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Hàm gửi tin nhắn AI
   const sendMessage = useCallback(async () => {
       if (!inputMessage.trim() || loading) return;

       const userMsg = {
           role: 'user' as const,
           content: inputMessage,
           timestamp: new Date()
       };

       const allMessages = [...messages, userMsg]; // ✅ tạo trước
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
       setTimeout(scrollToBottom, 100);
   }, [inputMessage, messages, isAdmin, loading]);

    // Xử lý Enter để gửi
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Reset chat
    const resetChat = () => {
        setMessages([]);
        setInputMessage('');
    };

    useEffect(() => {
        ProductService.getProdctNew().then((products) => setProducts(products));

        PhotoService.getImages().then((images) => setImages(images));
    }, []);

    useEffect(() => {
        ProductService.getProdctNew().then((data) => setDataViewValue(data));
        setGlobalFilterValue('');
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
    const router = useRouter();

    const handleLogin = () => {
        router.push('/auth/login');
    };

    const handleRegister = () => {
        router.push('/auth/register');
    };

    const [userId, setUserId] = useState<number | null>(null);

    // lấy ra user login
    useEffect(() => {
       const user = userStorage.getCurrentUser();
       console.log('User:', user);
       setUserId(user ? user.userId : null);
    });

    // const handleBuyNow = (product : Demo.Order) =>  {
    //     const createOrder = OrderService.createOrder(
    //         makh: 1,
    //         madh: 1,
    //         ngaydat: ngaydat_mysql,
    //         diachi_giao: address,
    //         items: orderItems,
    //         matrangthai: 1,
    //         tongtien: tongtien_val,
    //         paymentMethod: paymentMethod,
    //     );
    // } 


    const formatCurrency = (value: number | string | null | undefined) => {
        if (value == null || isNaN(Number(value))) return 'N/A';
        return Number(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };
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
    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    const carouselItemTemplate = (product: Demo.sanpham) => {
        return (
            <div className="border-1 surface-border border-round m-1 text-center py-5">
                <div className="mb-3">
                    {/* <img src={product.hinhanh} alt={product.tensp} className="w-6 shadow-2" /> */}
                    <Image src={product.hinhanh} width="250px" preview />
                </div>
                <div>
                    <h4 className="p-mb-1">{product.tensp}</h4>
                    <h6 className="mt-0 mb-3">{formatCurrency(product.gia)}</h6>
                    {/* <span className={`product-badge status-${product.inventoryStatus?.toLowerCase()}`}>{product.inventoryStatus}</span> */}
                    <div className="car-buttons mt-5">
                        <Button type="button" className="mr-2" rounded icon="pi pi-search"></Button>
                        <Button type="button" className="mr-2" severity="success" rounded icon="pi pi-star"></Button>
                        <Button type="button" severity="help" rounded icon="pi pi-cog"></Button>
                    </div>
                </div>
            </div>
        );
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

    const dataviewListItem = (data: Demo.sanpham) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <img src={data.hinhanh} alt={data.tensp} className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <div className="font-bold text-2xl">{data.tensp}</div>
                        <div className="mb-2">{data.mota}</div>
                        {/* <Rating value={data.rating} readOnly cancel={false} className="mb-2"></Rating> */}
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"></i>
                            <span className="font-semibold">{data.maloai}</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">{formatCurrency(data.gia)}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart"  size="small" className="mb-2">Mua ngay</Button>
                        {/* <span className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}>{data.inventoryStatus}</span> */}
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (data: Demo.sanpham) => {
        return (
            <div className="col-12 lg:col-4">
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2" />
                            <span className="font-semibold">{data.maloai}</span>
                        </div>
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <Image src={data.hinhanh} width="250px" preview />
                        <div className="text-2xl font-bold">{data.tensp}</div>
                        <div className="mb-3">{data.mota}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">{formatCurrency(data.gia)}</span>
                        <Button icon="pi pi-shopping-cart"/>
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

    const galleriaResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                    <Link href="/" className="flex align-items-center">
                        {/* <img src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" /> */}
                        <i className=""></i>
                        <span className="text-900 font-medium text-2xl line-height-3 mr-8 border-2 border-circle px-2 py-1">Growby</span>
                    </Link>
                    <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick>
                        <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                    </StyleClass>
                    <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                        <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                            <li>
                                <a href="#home" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Home</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#features" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Features</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#highlights" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Highlights</span>
                                    <Ripple />
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                    <span>Pricing</span>
                                    <Ripple />
                                </a>
                            </li>
                        </ul>

                        <div className="flex align-items-center gap-2 border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                            {/* 🔥 CHATBOT BUTTON - XUẤT HIỆN Ở ĐÂY */}
                            <Button
                                icon="pi pi-comments"
                                rounded
                                severity="info"
                                className="relative"
                                badge={messages.length > 0 ? messages.length.toString() : undefined}
                                badgeClassName="p-badge-danger"
                                onClick={() => setVisibleChat(true)}
                                tooltip="🤖 Hỏi AI - Tư vấn kính"
                                tooltipOptions={{ position: 'bottom' }}
                                size="small"
                            />

                            {/* LOGIN & REGISTER
                            <Button label="Login" text rounded className="border-none font-light line-height-2 text-blue-500 mr-2" onClick={handleLogin} size="small" />
                            <Button label="Register" rounded className="border-none font-light line-height-2 bg-blue-500 text-white" onClick={handleRegister} size="small" /> */}
                        </div>
                        <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                            <Button label="Login" text rounded className="border-none font-light line-height-2 text-blue-500" onClick={() => handleLogin()}></Button>
                            <Button label="Register" rounded className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white" onClick={() => handleRegister()}></Button>
                        </div>
                    </div>
                </div>
                <div id="hero" className="relative flex flex-col md:flex-row items-center justify-between px-4 lg:px-16 py-20 overflow-hidden bg-gradient-to-r from-yellow-100 via-blue-100 to-blue-200" style={{ minHeight: '400px' }}>
                    {/* Text bên trái */}
                    <div className="relative z-10 md:max-w-lg text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">Shop Your Glasses</h1>
                        <p className="mt-4 text-lg md:text-2xl text-gray-700">Choose the pair of glasses that suits you best and looks the most beautiful...</p>
                        <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg text-lg md:text-xl hover:bg-blue-600 transition border-1 border-blue-500 ">Get Started</button>
                    </div>

                    {/* Ảnh lồng bên phải */}
                    <div className="relative w-full md:w-1/2 mt-10 md:mt-0">
                        <img src="/demo/images/landing/banner.png" alt="Hero Image" className="w-full h-auto object-contain" />
                    </div>
                </div>
                <div id="features" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                    <div className="grid p-fluid">
                        <div className="col-12">
                            <div className="card">
                                <h5>Carousel</h5>
                                <Carousel value={products} numVisible={3} numScroll={3} responsiveOptions={carouselResponsiveOptions} itemTemplate={carouselItemTemplate}></Carousel>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="highlights" className="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                    <div className="grid">
                        <div className="col-12">
                            <div className="card">
                                <h5>DataView</h5>
                                <DataView value={filteredValue || dataViewValue} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader}></DataView>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="pricing" className="py-4 px-4 lg:px-8 my-2 md:my-4">
                    <div className="grid p-fluid">
                        <div className="col-12">
                            <div className="card">
                                <h5>Carousel</h5>
                                <Carousel value={products} numVisible={3} numScroll={3} responsiveOptions={carouselResponsiveOptions} itemTemplate={carouselItemTemplate}></Carousel>
                            </div>
                        </div>

                        {/* <div className="col-12">
                            <div className="card">
                                <h5>Image</h5>
                                <div className="flex justify-content-center">
                                    <Image src={`/demo/images/galleria/galleria10.jpg`} alt="Image" width="250" preview />
                                </div>
                            </div>
                        </div> */}

                        <div className="col-12">
                            <div className="card">
                                <h5>Galleria</h5>
                                <Galleria value={images} responsiveOptions={galleriaResponsiveOptions} numVisible={7} circular style={{ maxWidth: '800px', margin: 'auto' }} item={galleriaItemTemplate} thumbnail={galleriaThumbnailTemplate}></Galleria>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
                    <div className="grid justify-content-between">
                        <div className="col-12 md:col-2" style={{ marginTop: '-1.5rem' }}>
                            <Link href="/" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                                <img src={`/demo/images/galleria/galleria10.jpg`} alt="footer sections" width="50" height="50" className="mr-2" />
                                <span className="font-medium text-3xl text-900">Nhu Bao Anh</span>
                            </Link>
                        </div>

                        <div className="col-12 md:col-10 lg:col-7">
                            <div className="grid text-center md:text-left">
                                <div className="col-12 md:col-3">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Company</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">About Us</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">News</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Investor Relations</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Careers</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Media Kit</a>
                                </div>

                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Resources</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Get Started</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Learn</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Case Studies</a>
                                </div>

                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Community</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Discord</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                        Events
                                        <img src="/demo/images/landing/new-badge.svg" className="ml-2" alt="badge" />
                                    </a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">FAQ</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Blog</a>
                                </div>

                                <div className="col-12 md:col-3 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Legal</h4>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Brand Policy</a>
                                    <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Privacy Policy</a>
                                    <a className="line-height-3 text-xl block cursor-pointer text-700">Terms of Service</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 🔥 CHATBOT DIALOG - THÊM Ở ĐÂY */}
            <Dialog
                header={
                    <div className="flex justify-content-between align-items-center w-full">
                        <div className="flex align-items-center">
                            <Chip label="🤖" className="mr-2" />
                            <span className="text-xl font-semibold">Trợ lý thông minh - Tư vấn kính</span>
                            <Chip label={`${chatStats.products} SP | ${chatStats.categories} DM`} className="ml-3 p-chip-info" />
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button
                                icon={isAdmin ? 'pi pi-user-edit' : 'pi pi-users'}
                                rounded
                                size="small"
                                text
                                severity={isAdmin ? 'warning' : 'info'}
                                onClick={() => setIsAdmin(!isAdmin)}
                                tooltip={isAdmin ? '👤 Chế độ khách hàng' : '🛠️ Chế độ Admin'}
                                tooltipOptions={{ position: 'top' }}
                            />
                            <Button icon="pi pi-times" text rounded size="small" onClick={() => setVisibleChat(false)} severity="secondary" />
                        </div>
                    </div>
                }
                visible={visibleChat}
                onHide={() => setVisibleChat(false)}
                style={{ width: '90vw', height: '80vh', maxWidth: '1000px' }}
                breakpoints={{ '960px': '95vw', '640px': '100vw' }}
                className="p-dialog-maximized-mobile"
                modal
            >
                <div className="flex flex-column h-full w-full">
                    {/* Chat Messages Area */}
                    <div
                        className="flex-1 overflow-auto p-4 surface-ground border-round-top"
                        style={{
                            background: 'linear-gradient(135deg, #f0f2f5 0%, #e2e8f0 100%)',
                            maxHeight: 'calc(80vh - 140px)',
                            minHeight: '300px'
                        }}
                    >
                        {messages.length === 0 ? (
                            <div className="flex flex-column align-items-center justify-content-center h-full text-center p-5">
                                <i className="pi pi-comments text-6xl text-blue-500 mb-4 opacity-60"></i>
                                <h3 className="text-900 mb-3">Chào bạn! 👋</h3>
                                <p className="text-600 mb-5 text-lg">Tôi có thể giúp bạn tìm kính phù hợp!</p>
                                <div className="flex flex-wrap gap-2 justify-content-center">
                                    <Chip label="Kính dưới 700k" className="cursor-pointer p-chip-plain hover:bg-blue-50 p-3" onClick={() => setInputMessage('Gợi ý kính dưới 500k')} />
                                    <Chip label="Kính thời trang" className="cursor-pointer p-chip-plain hover:bg-green-50 p-3" onClick={() => setInputMessage('Kính thời trang đẹp nhất?')} />
                                    <Chip label="Kính cận" className="cursor-pointer p-chip-plain hover:bg-purple-50 p-3" onClick={() => setInputMessage('Kính cận nào tốt?')} />
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-content-end mb-4' : 'justify-content-start mb-4'}`}>
                                        <div
                                            className={`max-w-30rem p-4 border-round-xl shadow-2 ${msg.role === 'user' ? 'bg-blue-500 text-white ml-4' : 'bg-white mr-4 surface-card'}`}
                                            style={{ width: '70%' }} // → Mở rộng khung tin nhắn
                                        >
                                            <div className="flex align-items-center mb-2">
                                                <div className={`w-rem h-2rem border-round-full flex align-items-center justify-content-center text-xs font-semibold mr-2 ${msg.role === 'user' ? 'bg-blue-400' : 'bg-green-400'}`}>
                                                    {msg.role === 'user' ? '👤' : '🤖'}
                                                </div>
                                                <span className={`font-semibold ${msg.role === 'user' ? 'text-white' : 'text-900'}`}>{msg.role === 'user' ? 'Bạn' : 'Grok AI'}</span>
                                            </div>
                                            <div className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-800'} whitespace-pre-wrap`}>{msg.content}</div>
                                            <div className={`text-xs mt-2 opacity-75 ${msg.role === 'user' ? 'text-blue-100' : 'text-500'}`}>{msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {loading && (
                            <div className="flex justify-content-start mb-4">
                                <div className="p-4 bg-white shadow-2 border-round-xl mr-4 w-50">
                                    <div className="flex align-items-center mb-2">
                                        <div className="w-2rem h-2rem border-round-full bg-green-400 flex align-items-center justify-content-center mr-2">🤖</div>
                                        <span className="font-semibold text-900">Trợ lý của bảo anh</span>
                                    </div>
                                    <Skeleton size="wave" width="50%" height="1rem" className="mb-2" />
                                    <Skeleton size="wave" width="50" height="1rem" />
                                    <div className="flex align-items-center mt-3">
                                        <i className="pi pi-spin pi-spinner mr-2"></i>
                                        <span className="text-500 text-sm">Đang tư vấn...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-top-1 surface-border bg-white border-round-bottom">
                        <div className="flex gap-3">
                            <InputTextarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={isAdmin ? '💡 Hỏi về kính' : '💬 Hỏi về kính, giá, khuyến mãi... (Enter gửi, Shift+Enter xuống dòng)'}
                                rows={1}
                                autoResize
                                className="flex-1 mr-3 p-inputtext-sm"
                                disabled={loading}
                            />
                            <Button icon="pi pi-send" onClick={sendMessage} loading={loading} disabled={!inputMessage.trim() || loading} className="p-button-success p-button-raised" size="small" />
                        </div>
                        <div className="flex justify-content-between align-items-center mt-3 pt-2 border-top-1 surface-border">
                            <Button label="🗑️ Xóa chat" text icon="pi pi-refresh" size="small" severity="secondary" onClick={resetChat} disabled={loading} />
                            <small className="text-500">
                                {isAdmin ? '🛠️ Admin Mode' : '👤 Khách hàng'} |{messages.length > 0 && ` ${messages.length} tin nhắn`}
                            </small>
                        </div>
                    </div>
                </div>
            </Dialog>
            {/* ← ĐÓNG THẺ CHÍNH */}
        </div>
    );
};



export default LandingPage;
