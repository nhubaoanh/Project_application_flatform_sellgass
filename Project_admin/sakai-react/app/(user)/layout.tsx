import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Growby - Trang người dùng',
    description: 'Trang quản lý tài khoản và đơn hàng',
};

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    );
}