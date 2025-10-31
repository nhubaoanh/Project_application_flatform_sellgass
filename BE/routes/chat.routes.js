import express from "express";
import axios from "axios";

const router = express.Router();

// ===== CACHE DỮ LIỆU =====
let cachedProducts = [];
let cachedCategories = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút
//klkk;lll
async function loadProductData() {
  const now = Date.now();
  if (now - cacheTimestamp <= CACHE_DURATION && cachedProducts.length > 0) {
    console.log("DÙNG CACHE (còn hiệu lực)");
    return;
  }

  console.log("BẮT ĐẦU LOAD DỮ LIỆU TỪ localhost:7890...");
  try {
    const [prodRes, catRes] = await Promise.all([
      axios.get("http://localhost:7890/api/sanpham"),
      axios.get("http://localhost:7890/api/danhmuc"),
    ]);

    cachedProducts = Array.isArray(prodRes.data) ? prodRes.data : [];
    cachedCategories = Array.isArray(catRes.data) ? catRes.data : [];

    cacheTimestamp = now;
    console.log(
      "ĐÃ CẬP NHẬT CACHE:",
      cachedProducts.length,
      "sản phẩm,",
      cachedCategories.length,
      "danh mục"
    );
  } catch (error) {
    console.error("LỖI KẾT NỐI API 7890:", error.message);
    cachedProducts = [];
    cachedCategories = [];
  }
}

// ===== HỖ TRỢ LẤY DỮ LIỆU =====
const formatPrice = (price) => {
  if (!price) return "0đ";
  return price >= 1000000
    ? `${(price / 1000000).toFixed(1).replace(/\.0$/, "")}M`
    : `${Math.round(price / 1000)}K`;
};

const getProductName = (p) =>
  p.tensp || p.ten || p.name || "Sản phẩm không tên";
const getCategoryId = (p) => p.maloai || p.danhMucId || p.categoryId;
const getPrice = (p) => p.gia || p.price || 0;

const getCategoryName = (id) => {
  if (!id) return "Không rõ";
  const cat = cachedCategories.find(
    (c) =>
      c.maloai === id || c.id === id || c._id?.toString() === id?.toString()
  );
  return cat?.tenloai || cat?.tenDanhMuc || cat?.name || "Không rõ";
};

// ===== GỌI GEMINI AI =====
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await axios.post(
        url,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        },
        { timeout: 15000 }
      );

      return (
        response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Xin lỗi, mình chưa hiểu."
      );
    } catch (err) {
      console.error(
        `Lỗi Gemini (lần ${attempt}):`,
        err.response?.data?.error?.message || err.message
      );
      if (attempt === 3) return "AI đang bận, thử lại sau nhé!";
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

// ===== ROUTER CHAT =====
router.post("/", async (req, res) => {
  try {
    await loadProductData();

    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Tin nhắn không hợp lệ" });
    }

    const lastMessage = messages[messages.length - 1]?.content?.trim() || "";
    const lowerMsg = lastMessage.toLowerCase();

    // ===== LỌC SẢN PHẨM THEO GIÁ =====
    let filteredProducts = cachedProducts;
    const priceMatch = lastMessage.match(/(\d+)\s*(triệu|tr|k|ngàn|nghìn)/i);
    if (lowerMsg.includes("dưới") && priceMatch) {
      const num = parseInt(priceMatch[1]);
      const maxPrice = priceMatch[2].toLowerCase().includes("triệu")
        ? num * 1000000
        : num * 1000;
      filteredProducts = cachedProducts.filter((p) => getPrice(p) <= maxPrice);
    }

    // ===== DANH SÁCH SẢN PHẨM =====
    const strictProductList =
      filteredProducts
        .slice(0, 8)
        .map(
          (p) =>
            `• ${getProductName(p)} - ${getCategoryName(
              getCategoryId(p)
            )} - ${formatPrice(getPrice(p))}`
        )
        .join("\n") || "Không có sản phẩm phù hợp";

    const friendlyProductSuggestions =
      filteredProducts
        .slice(0, 3)
        .map((p) => `${getProductName(p)} (${formatPrice(getPrice(p))})`)
        .join(" | ") || "chưa có mẫu nào phù hợp";

    // ===== PROMPT KẾT HỢP =====
    const systemPrompt = `
Bạn là Genie – nhân viên bán hàng Growby Store siêu thân thiện 😄.

Khách hỏi: "${lastMessage}"

QUY TẮC:
- Nếu khách hỏi về giá/danh mục: liệt kê sản phẩm phù hợp từ danh sách dưới
${strictProductList}

- Nếu câu hỏi chung, ngoài lề: trả lời thân thiện, gần gũi, dùng emoji, gợi ý sản phẩm: ${friendlyProductSuggestions}
- Luôn kết thúc bằng câu hỏi để kéo dài cuộc trò chuyện
- Không dùng từ "rất tiếc", "hiện tại", "mới nhất"
`.trim();

    const aiReply = await callGemini(systemPrompt);

    return res.json({
      reply: aiReply,
      products: cachedProducts.length,
      categories: cachedCategories.length,
      filtered: filteredProducts.length,
    });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    return res
      .status(500)
      .json({ error: "Mình đang bận chút xíu, bạn đợi mình nhé!" });
  }
});

export default router;

