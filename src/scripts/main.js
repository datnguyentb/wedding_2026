// ==========================================
// 1. ĐẾM NGƯỢC NGÀY CƯỚI
// ==========================================
const weddingDate = new Date('2026-09-27T12:00:00');

function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;
    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================
// 2. NÚT NHẠC
// ==========================================
const musicBtn = document.getElementById('musicBtn');
musicBtn.addEventListener('click', () => {
    musicBtn.classList.toggle('playing');
    alert('🎵 Nhạc nền sẽ phát tại đây!');
});

// ==========================================
// 3. HIỆU ỨNG LƯỚT ĐẾN ĐÂU HIỆN RA ĐÓ
// ==========================================
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Chỉ chạy 1 lần
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
});

// ==========================================
// 4. GỬI LỜI CHÚC & HIỂN THỊ CHẠY DỌC
// ==========================================
const wishForm = document.getElementById('wishForm');
const wishScroll = document.getElementById('wishScroll');

// Mảng lưu lời chúc mẫu giống trong ảnh
let wishList = [
  { name: 'Hồng Nhung', msg: 'Đồng tâm đồng lòng, xây dựng tổ ấm thật vượng!' },
  { name: 'Duy Đức', msg: 'Chúc cho tình yêu của hai bạn mãi ngày một lớn mạnh!' },
  { name: 'Phương', msg: 'Chúc hai bạn trăm năm hòa hợp, hạnh phúc!' },
  { name: 'Thu Hà', msg: 'Tân hạnh hạnh phúc, trăm năm bên nhau!' }
];

// Hiển thị lời chúc ra khung chạy dọc
function renderWishes() {
  wishScroll.innerHTML = '';
  
  // Tạo danh sách 2 lần để chạy liền mạch không khoảng trống
  const fullList = [...wishList, ...wishList];
  
  fullList.forEach(item => {
    const div = document.createElement('div');
    div.className = 'wish-item';
    div.innerHTML = `
      <span class="wish-sender">${item.name}:</span>
      <span class="wish-msg">${item.msg}</span>
    `;
    wishScroll.appendChild(div);
  });
}

// Gửi lời chúc mới
wishForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('wishName').value.trim();
  const msg = document.getElementById('wishMessage').value.trim();

  if (name && msg) {
    wishList.push({ name, msg });
    renderWishes(); // Cập nhật khung chạy dọc
    wishForm.reset(); // Xóa nội dung form
    alert('💝 Cảm ơn bạn đã gửi lời chúc!');
  }
});

// Khởi tạo hiển thị khi tải trang
renderWishes();