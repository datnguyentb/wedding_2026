const APPSCRIPT_URL = 'https://script.google.com/macros/s/THAY-URL-CUA-BAN-O-DÂY/exec';

const form = document.getElementById('wishForm');
const btnSubmit = document.getElementById('btnSubmit');
const statusMsg = document.getElementById('statusMsg');
const wishesContainer = document.getElementById('wishesContainer');

// === Tải danh sách lời chúc khi mở trang ===
async function loadWishes() {
    try {
        const res = await fetch(APPSCRIPT_URL);
        const result = await res.json();
        if (result.success && result.data.length > 0) {
            wishesContainer.innerHTML = result.data
                .map(
                    (item) => `
        <div class="wish-item">
          <div class="wish-name">${escapeHtml(item.name)}</div>
          <div class="wish-time">${item.time}</div>
          <div class="wish-text">${escapeHtml(item.message)}</div>
        </div>
      `,
                )
                .join('');
        } else {
            wishesContainer.innerHTML = `<div class="empty-wish">Chưa có lời chúc nào, bạn hãy là người đầu tiên! ❤️</div>`;
        }
    } catch (err) {
        wishesContainer.innerHTML = `<div class="empty-wish">Lỗi tải dữ liệu: ${err.message}</div>`;
    }
}

// === Gửi lời chúc mới ===
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusMsg.className = 'status-msg';
    statusMsg.textContent = '';
    btnSubmit.disabled = true;
    btnSubmit.textContent = '⏳ Đang gửi...';

    const name = document.getElementById('inputName').value.trim();
    const message = document.getElementById('inputMessage').value.trim();

    try {
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('message', message);

        const res = await fetch(APPSCRIPT_URL, {
            method: 'POST',
            body: formData,
        });
        const result = await res.json();

        if (result.success) {
            statusMsg.textContent = '✅ Gửi lời chúc thành công! Cảm ơn bạn ❤️';
            statusMsg.classList.add('success');
            form.reset();
            loadWishes(); // Tải lại danh sách ngay
        } else {
            throw new Error(result.error || 'Không gửi được');
        }
    } catch (err) {
        statusMsg.textContent = '❌ Lỗi: ' + err.message;
        statusMsg.classList.add('error');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = '❤️ Gửi Lời Chúc';
    }
});

// An toàn chống mã độc
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Tải lời chúc khi mở trang
window.addEventListener('DOMContentLoaded', loadWishes);
