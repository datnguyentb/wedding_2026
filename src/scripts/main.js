// ==========================================
// 1. MỞ THIỆP - ẨN MÀN HÌNH BÌA
// ==========================================
const coverPage = document.getElementById('coverPage');
const openInvitationBtn = document.getElementById('openInvitationBtn');

openInvitationBtn.addEventListener('click', () => {
  coverPage.classList.add('hidden-cover');
  document.body.classList.add('invitation-opened');
  createFallingHearts(); // Bắt đầu rơi trái tim khi mở thiệp
});

// ==========================================
// 2. HIỆU ỨNG ICON RƠI NỀN
// ==========================================
function createFallingHearts() {
  const heartsRain = document.getElementById('heartsRain');
  const hearts = ['❤️', '💕', '💗', '💖', '💘', '🤍', '💝'];
  const total = 25;

  for (let i = 0; i < total; i++) {
    createHeart(heartsRain, hearts, i);
  }
}

function createHeart(container, hearts, index) {
  const heart = document.createElement('span');
  heart.className = 'heart-fall';
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  const size = Math.random() * 20 + 12;
  heart.style.fontSize = size + 'px';
  heart.style.left = Math.random() * 100 + '%';
  const duration = Math.random() * 6 + 8;
  heart.style.animationDuration = duration + 's';
  heart.style.animationDelay = (index * 0.6) + 's';
  container.appendChild(heart);
}

// ==========================================
// 3. ĐẾM NGƯỢC NGÀY CƯỚI
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
// 4. NÚT NHẠC
// ==========================================
const musicBtn = document.getElementById('musicBtn');
musicBtn.addEventListener('click', () => {
  musicBtn.classList.toggle('playing');
  alert('🎵 Nhạc nền sẽ phát tại đây!');
});

// ==========================================
// 5. HIỆU ỨNG LƯỚT ĐẾN ĐÂU HIỆN RA ĐÓ
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
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
});

// ==========================================
// 6. GỬI LỜI CHÚC & HIỂN THỊ CHẠY DỌC
// ==========================================
const wishForm = document.getElementById('wishForm');
const wishScroll = document.getElementById('wishScroll');

let wishList = [
  { name: 'Hồng Nhung', msg: 'Đồng tâm đồng lòng, xây dựng tổ ấm thật vượng!' },
  { name: 'Duy Đức', msg: 'Chúc cho tình yêu của hai bạn mãi ngày một lớn mạnh!' },
  { name: 'Phương', msg: 'Chúc hai bạn trăm năm hòa hợp, hạnh phúc!' },
  { name: 'Thu Hà', msg: 'Tân hạnh hạnh phúc, trăm năm bên nhau!' }
];

function renderWishes() {
  wishScroll.innerHTML = '';
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

wishForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('wishName').value.trim();
  const msg = document.getElementById('wishMessage').value.trim();
  if (name && msg) {
    wishList.push({ name, msg });
    renderWishes();
    wishForm.reset();
    alert('💝 Cảm ơn bạn đã gửi lời chúc!');
  }
});

renderWishes();

// ==========================================
// 7. XÁC NHẬN THAM DỰ
// ==========================================
const rsvpForm = document.getElementById('rsvpForm');
rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fullName = document.getElementById('fullName').value.trim();
  const attendance = document.querySelector('input[name="attendance"]:checked').value;
  if (attendance === 'yes') {
    alert(`✅ Cảm ơn ${fullName}! Rất vui được đón bạn tham dự! 💍`);
  } else {
    alert(`💌 Cảm ơn ${fullName}! Chúng tôi sẽ gặp dịp khác nhé!`);
  }
  rsvpForm.reset();
});

// ==========================================
// HỘP QUÀ MỪNG — MỞ / ĐÓNG POPUP + TẢI QR
// ==========================================
const openGiftBtn = document.getElementById('openGiftBtn');
const giftPopupOverlay = document.getElementById('giftPopupOverlay');
const closeGiftBtn = document.getElementById('closeGiftBtn');

// Mở Popup
openGiftBtn.addEventListener('click', () => {
    giftPopupOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Khóa cuộn nền
});

// Đóng Popup
function closeGiftPopup() {
    giftPopupOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Mở lại cuộn nền
}

closeGiftBtn.addEventListener('click', closeGiftPopup);

// Đóng khi click ra ngoài khung Popup
giftPopupOverlay.addEventListener('click', (e) => {
    if (e.target === giftPopupOverlay) {
        closeGiftPopup();
    }
});

// ✅ Nút TẢI / LƯU ẢNH QR
function downloadQR(imgId, fileName) {
    const img = document.getElementById(imgId);
    fetch(img.src)
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName + '.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('✅ Đã lưu mã QR thành công!');
        })
        .catch(() => {
            // Cách dự phòng nếu fetch không được
            window.open(img.src, '_blank');
            alert('📷 Mở ảnh trong tab mới → Nhấn Lưu ảnh...');
        });
}