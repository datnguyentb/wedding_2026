// ==========================================
// LỜI CHÚC — ĐÃ SỬA CHO IPHONE / SAFARI
// ✅ DÙNG JS CUỘN THAY ANIMATION CSS → KHÔNG BỊ ĐỨNG IM
// ✅ Chạy ngay từ đầu, không cần đợi ai chạm màn hình
// ✅ Tương thích mọi máy: iPhone, Android, Máy tính
// ==========================================
const APPSCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbwQNM3aOMtUFMARXs7JS8Y5xs0aLEbQK5AYLHPq7odGIYRKI89g1mwRJIlBCIHcZPyI/exec';

const wishForm = document.getElementById('wishForm');
const wishScroll = document.getElementById('wishScroll');

let wishList = [];
let latestTime = '';
let isSubmitting = false;

// === ✅ CUỘN BẰNG JAVASCRIPT — Safari không dám tắt cái này ===
let scrollPosition = 0;
let totalHeight = 0;
const SCROLL_SPEED = 0.3; // Tốc độ cuộn (thấp = chậm)

function startJsScroll() {
    let lastTime = performance.now();
    function step(now) {
        const delta = now - lastTime;
        lastTime = now;

        // ✅ Đợi nội dung đã vẽ xong mới tính chiều cao
        if (wishScroll.children.length > 0) {
            totalHeight = wishScroll.scrollHeight / 2; // Vì nhân bản 2 lần
        }

        if (totalHeight > 50) {
            scrollPosition += SCROLL_SPEED * (delta / 16);

            // ✅ Reset mượt mà, không bị giật
            if (scrollPosition >= totalHeight) {
                scrollPosition = 0;
            }

            wishScroll.style.transform = `translateY(-${scrollPosition}px)`;
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// === Tải lời chúc mới ===
async function loadWishes() {
    try {
        const res = await fetch(`${APPSCRIPT_URL}?t=${Date.now()}`);
        const result = await res.json();
        if (!result.success || !result.data) return;

        const newItems = result.data.filter((item) => !latestTime || item.time > latestTime);
        if (newItems.length === 0) return;

        latestTime = result.data[0].time;
        wishList = [...newItems, ...wishList];
        wishList = wishList.slice(0, 30); // Giới hạn số lượng

        // Vẽ lại toàn bộ + nhân bản để cuộn liên tục
        renderAllWishes();
    } catch (err) {
        console.log('Lỗi tải:', err.message);
    }
}

// === Vẽ toàn bộ lời chúc ===
function renderAllWishes() {
    wishScroll.innerHTML = '';
    wishList.forEach((item) => addWishItemToUI(item));
    wishList.forEach((item) => addWishItemToUI(item));
}

// === Thêm 1 mục vào giao diện ===
function addWishItemToUI(item) {
    const div = document.createElement('div');
    div.className = 'wish-item';
    div.innerHTML = `
        <span class="wish-sender">❤️ ${escapeHtml(item.name)}:</span>
        <span class="wish-msg">${escapeHtml(item.message)}</span>
    `;
    wishScroll.appendChild(div);
}

// === Lần đầu tải ===
async function initialLoad() {
    try {
        const res = await fetch(`${APPSCRIPT_URL}?t=${Date.now()}`);
        const result = await res.json();

        if (result.success && result.data && result.data.length > 0) {
            wishList = result.data;
            latestTime = result.data[0].time;
            renderAllWishes();
        } else {
            wishScroll.innerHTML =
                '<div class="wish-item"><span class="wish-msg">Chưa có lời chúc nào, bạn hãy là người đầu tiên! ❤️</span></div>';
        }
    } catch (err) {
        wishScroll.innerHTML = `<div class="wish-item"><span class="wish-msg">Lỗi tải: ${err.message}</span></div>`;
    }

    // ✅ Bắt đầu cuộn NGAY — không cần đợi ai
    startJsScroll();

    // Tải mới mỗi 30 giây
    setInterval(loadWishes, 30000);
}

// === GỬI LỜI CHÚC — HIỂN THỊ NGAY ===
wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) {
        alert('⏳ Đang gửi... vui lòng chút nhé!');
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

    // ✅ HIỂN THỊ NGAY — không chờ server
    const tempTime = new Date().toLocaleString('vi-VN', { hour12: false });
    wishList.unshift({ time: tempTime, name, message: msg });
    wishList = wishList.slice(0, 30);
    renderAllWishes();
    wishForm.reset();

    // ✅ GỬI LÊN SERVER Ở NỀN
    try {
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('message', msg);

        await fetch(APPSCRIPT_URL, {
            method: 'POST',
            body: formData,
        });

        setTimeout(loadWishes, 500);
        alert('💝 Cảm ơn bạn! Lời chúc đã gửi thành công ❤️');
    } catch (err) {
        alert('❌ Lỗi: ' + err.message);
    } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// === An toàn ===
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// === Nút gợi ý ===
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('suggest-btn')) {
        const messageInput = document.getElementById('wishMessage');
        messageInput.value = e.target.getAttribute('data-text');
        messageInput.focus();
    }
});

// === Bắt đầu NGAY khi trang sẵn sàng ===
window.addEventListener('DOMContentLoaded', () => {
    initialLoad();
});
