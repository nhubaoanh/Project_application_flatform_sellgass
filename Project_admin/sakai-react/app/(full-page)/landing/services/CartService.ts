'use client';

interface CartItem {
    masanpham: string | number;
    tensp: string;
    gia: number;
    hinhanh: string;
    quantity: number;
    userid: string | number;
}

const CART_KEY = 'growby_cart';
const CART_USERID_KEY = 'growby_cart_userid';

export const CartService = {
    // Lấy userid hiện tại
    getCurrentUserId: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(CART_USERID_KEY);
    },

    // Set userid
    setCurrentUserId: (userid: string | number) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(CART_USERID_KEY, String(userid));
    },

    // Lấy giỏ hàng của user hiện tại
    getCart: (): CartItem[] => {
        if (typeof window === 'undefined') return [];
        const userid = CartService.getCurrentUserId();
        if (!userid) return [];

        const carts = localStorage.getItem(CART_KEY);
        if (!carts) return [];

        const allCarts = JSON.parse(carts);
        return allCarts[userid] || [];
    },

    // Thêm sản phẩm vào giỏ hàng
    addToCart: (product: Omit<CartItem, 'userid'>, userid?: string | number) => {
        if (typeof window === 'undefined') return;

        const currentUserid = userid || CartService.getCurrentUserId();
        if (!currentUserid) {
            console.warn('User ID is required to add to cart');
            return;
        }

        const carts = localStorage.getItem(CART_KEY);
        const allCarts = carts ? JSON.parse(carts) : {};

        if (!allCarts[currentUserid]) {
            allCarts[currentUserid] = [];
        }

        // Check xem sản phẩm đã tồn tại không
        const existingItem = allCarts[currentUserid].find(
            (item: CartItem) => item.masanpham === product.masanpham
        );

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            allCarts[currentUserid].push({
                ...product,
                quantity: product.quantity || 1,
                userid: currentUserid
            });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(allCarts));
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (masanpham: string | number, userid?: string | number) => {
        if (typeof window === 'undefined') return;

        const currentUserid = userid || CartService.getCurrentUserId();
        if (!currentUserid) return;

        const carts = localStorage.getItem(CART_KEY);
        if (!carts) return;

        const allCarts = JSON.parse(carts);
        if (allCarts[currentUserid]) {
            allCarts[currentUserid] = allCarts[currentUserid].filter(
                (item: CartItem) => item.masanpham !== masanpham
            );
            localStorage.setItem(CART_KEY, JSON.stringify(allCarts));
        }
    },

    // Cập nhật số lượng
    updateQuantity: (masanpham: string | number, quantity: number, userid?: string | number) => {
        if (typeof window === 'undefined') return;

        const currentUserid = userid || CartService.getCurrentUserId();
        if (!currentUserid) return;

        const carts = localStorage.getItem(CART_KEY);
        if (!carts) return;

        const allCarts = JSON.parse(carts);
        if (allCarts[currentUserid]) {
            const item = allCarts[currentUserid].find((item: CartItem) => item.masanpham === masanpham);
            if (item) {
                item.quantity = Math.max(1, quantity);
                localStorage.setItem(CART_KEY, JSON.stringify(allCarts));
            }
        }
    },

    // Lấy tổng số sản phẩm
    getCartCount: (userid?: string | number): number => {
        if (typeof window === 'undefined') return 0;

        const currentUserid = userid || CartService.getCurrentUserId();
        if (!currentUserid) return 0;

        const cart = CartService.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Clear giỏ hàng
    clearCart: (userid?: string | number) => {
        if (typeof window === 'undefined') return;

        const currentUserid = userid || CartService.getCurrentUserId();
        if (!currentUserid) return;

        const carts = localStorage.getItem(CART_KEY);
        if (!carts) return;

        const allCarts = JSON.parse(carts);
        delete allCarts[currentUserid];
        localStorage.setItem(CART_KEY, JSON.stringify(allCarts));
    }
};
