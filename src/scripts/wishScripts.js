// ==========================================
// GỬI LỜI CHÚC — NHANH HƠN + KHÔNG CHỜ 5s
// ==========================================
// 🔧 LINK APPSCRIPT CỦA BẠN (ĐÃ ĐÚNG ✅)
const APPSCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbwQNM3aOMtUFMARXs7JS8Y5xs0aLEbQK5AYLHPq7odGIYRKI89g1mwRJIlBCIHcZPyI/exec';

const wishForm = document.getElementById('wishForm');
const wishScroll = document.getElementById('wishScroll');

let wishList = [];
let latestTime = '';
let isSubmitting = false;

// === 1. Tải lời chúc MỚI ===
async function loadWishes() {
    try {
        const res = await fetch(`${APPSCRIPT_URL}?t=${Date.now()}`);
        const result = await res.json();
        if (!result.success || !result.data) return;

        // Lọc những cái mới hơn thời gian cuối
        const newItems = result.data.filter((item) => !latestTime || item.time > latestTime);
        if (newItems.length === 0) return;

        // Cập nhật
        latestTime = result.data[0].time;
        wishList = [...newItems, ...wishList];

        // Thêm vào giao diện — mới nhất ở cuối
        newItems.forEach((item) => addWishItemToUI(item));

        // Giới hạn chỉ giữ 30 lời gần nhất
        trimWishList();
    } catch (err) {
        console.log('Lỗi tải:', err.message);
    }
}

// === Thêm 1 mục vào giao diện ===
function addWishItemToUI(item) {
    const div = document.createElement('div');
    div.className = 'wish-item new-item';
    div.innerHTML = `
        <span class="wish-sender">❤️ ${escapeHtml(item.name)}:</span>
        <span class="wish-msg">${escapeHtml(item.message)}</span>
    `;
    wishScroll.appendChild(div);
}

// === Giới hạn số lượng hiển thị ===
function trimWishList() {
    const items = wishScroll.querySelectorAll('.wish-item');
    if (items.length > 30) {
        wishList = wishList.slice(0, 30);
        while (wishScroll.children.length > 30) {
            wishScroll.firstChild.remove();
        }
    }
}

// === 2. Lần đầu mở trang → vẽ toàn bộ ===
async function initialLoad() {
    try {
        const res = await fetch(`${APPSCRIPT_URL}?t=${Date.now()}`);
        const result = await res.json();

        if (result.success && result.data && result.data.length > 0) {
            wishList = result.data;
            latestTime = result.data[0].time;

            // Vẽ danh sách
            wishScroll.innerHTML = '';
            wishList.forEach((item) => addWishItemToUI(item));

            // Nhân bản danh sách cho hiệu ứng chạy liên tục
            wishList.forEach((item) => addWishItemToUI(item));
        } else {
            wishScroll.innerHTML =
                '<div class="wish-item"><span class="wish-msg">Chưa có lời chúc nào, bạn hãy là người đầu tiên! ❤️</span></div>';
        }
    } catch (err) {
        wishScroll.innerHTML = `<div class="wish-item"><span class="wish-msg">Lỗi tải: ${err.message}</span></div>`;
    }
}

// === 3. GỬI LỜI CHÚC — XUẤT HIỆN NGAY KHÔNG CHỜ ===
wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) {
        alert('⏳ Đang gửi... vui lòng chờ chút nhé!');
        return;
    }

    const name = document.getElementById('wishName').value.trim();
    const msg = document.getElementById('wishMessage').value.trim();
    if (!name || !msg) {
        alert('⚠️ Vui lòng nhập Tên và Lời chúc!');
        return;
    }

    isSubmitting = true;
    const submitBtn = wishForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Đang gửi...';

    // ✅ Tạo đối tượng hiển thị NGAY LẬP TỨC trên giao diện
    const tempItem = {
        time: new Date().toLocaleString('vi-VN', { hour12: false }).replace(/\//g, '/'),
        name: name,
        message: msg,
    };
    addWishItemToUI(tempItem); // Thêm vào giao diện ngay
    wishForm.reset();

    try {
        // ✅ Gửi lên nền — không chờ mới hiển thị
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('message', msg);

        const res = await fetch(APPSCRIPT_URL, {
            method: 'POST',
            body: formData,
        });
        const result = await res.json();

        if (result.success) {
            alert('💝 Cảm ơn bạn! Lời chúc đã gửi thành công ❤️');
            // ✅ Tải dữ liệu thật từ server để đồng bộ
            loadWishes();
        } else {
            throw new Error(result.error || 'Không gửi được');
        }
    } catch (err) {
        alert('❌ Lỗi: ' + err.message);
    } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// === An toàn chống mã độc ===
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// === Nút gợi ý lời chúc nhanh ===
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('suggest-btn')) {
        const messageInput = document.getElementById('wishMessage');
        const suggestedText = e.target.getAttribute('data-text');
        messageInput.value = suggestedText;
        messageInput.focus();
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => (e.target.style.transform = ''), 150);
    }
});

// === BẮT ĐẦU ===
window.addEventListener('DOMContentLoaded', () => {
    initialLoad();
    // ✅ BỎ setInterval 5s → KHÔNG TẢI LẠI LIÊN TỤC NỮA
    // Chỉ tải mới KHI người dùng gửi lời chúc thành công thôi
});
