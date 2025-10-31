// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ProductService } from '@/demo/service/ProductService';

const openai = new OpenAI({
    apiKey: process.env.XAI_API_KEY!, // ✅ LẤY TỪ .env.local
    baseURL: 'https://api.x.ai/v1'
});

// Cache dữ liệu sản phẩm để tránh gọi API liên tục
let cachedProducts: any[] = [];
let cachedCategories: any[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

async function loadProductData() {
    const now = Date.now();
    if (now - cacheTimestamp > CACHE_DURATION) {
        try {
            // Load từ API backend của bạn
            cachedProducts = await ProductService.getProdctNew();
            cachedCategories = await ProductService.getCategory();
            console.log('✅ Đã load sản phẩm:', cachedProducts.length, 'Danh mục:', cachedCategories.length);
            cacheTimestamp = now;
            console.log('✅ Đã load sản phẩm:', cachedProducts.length, 'Danh mục:', cachedCategories.length);
        } catch (error) {
            console.error('❌ Lỗi load sản phẩm:', error);
            // Fallback data nếu API backend lỗi
            cachedProducts = [];
            cachedCategories = [];
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        await loadProductData(); // Load sản phẩm trước khi chat

        const { messages, isAdmin = false } = await request.json();
        const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

        // System prompt thông minh với dữ liệu thực tế
        const formatProduct = (p: any) => `• ${p.ten || p.name}: ${p.gia || p.price?.toLocaleString('vi-VN')}đ ${p.moTa ? `- ${p.moTa.substring(0, 50)}...` : ''}`;

        const productSummary = cachedProducts.slice(0, 10).map(formatProduct).join('\n');
        const categoryList = cachedCategories.map((cat: any) => `• ${cat.tenDanhMuc || cat.name}`).join('\n');

        const systemPrompt = `
Bạn là **Grok Assistant** - Trợ lý bán hàng thông minh cho **Growby Store** 🌟

🛍️ **SẢN PHẨM NỔI BẬT** (${cachedProducts.length} sản phẩm):
${productSummary}

📂 **DANH MỤC**:
${categoryList}

💡 **QUY TẮC TRẢ LỜI**:
1. **Luôn dùng tiếng Việt**, thân thiện, hài hước như người bạn
2. **Gợi ý sản phẩm cụ thể** dựa trên câu hỏi (giá, danh mục, tính năng)
3. **Định dạng giá VND**: 100.000đ → 100K, 1.000.000đ → 1M
4. **Hỏi thêm thông tin** nếu cần: ngân sách, sở thích, mục đích sử dụng
5. **${isAdmin ? 'ADMIN MODE: Hỗ trợ CRUD sản phẩm (tạo/sửa/xóa)' : 'Khách hàng: Hướng dẫn mua hàng, giỏ hàng'}**

🎯 **CÂU HỎI THƯỜNG GẶP**:
- "Sản phẩm dưới 500k" → Lọc theo giá
- "Điện thoại đẹp" → Gợi ý theo danh mục + mô tả  
- "Khuyến mãi gì?" → Gợi ý sản phẩm hot

Bắt đầu trả lời câu hỏi: "${lastMessage}"
`;

        const response = await openai.chat.completions.create({
            model: 'grok-beta', // grok-3-mini (rẻ) hoặc grok-beta (mạnh)
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            temperature: 0.8,
            max_tokens: 800,
            stream: false
        });

        const aiReply = response.choices[0]?.message?.content || '🤖 Xin lỗi, tôi chưa hiểu! Bạn có thể hỏi cụ thể hơn không?';

        return NextResponse.json({
            reply: aiReply,
            products: cachedProducts.length,
            categories: cachedCategories.length
        });
    } catch (error: any) {
        console.error('❌ Chat API Error:', error);
        return NextResponse.json({ error: '🤖 Lỗi kết nối AI! Thử lại sau nhé!' }, { status: 500 });
    }
}
