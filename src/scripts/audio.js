// ==========================================
// 🔧 CẤU HÌNH DANH SÁCH BÀI HÁT
// ==========================================
const PLAYLIST = [
    './src/assets/audio/nhac_nen.mp3', // Bài 1
    './src/assets/audio/bai_hat_2.mp3', // Bài 2
    './src/assets/audio/bai_hat_3.mp3', // Bài 3
    './src/assets/audio/bai_hat_4.mp3', // Bài 4
    './src/assets/audio/bai_hat_5.mp3', // Bài 5
];

// ==========================================
// 🎵 NHẠC NỀN — NGẪU NHIÊN + TỰ CHUYỂN BÀI
// ==========================================
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');

let currentIndex = 0;
let isMusicPlaying = false;

// ✅ Chọn ngẫu nhiên 1 bài và phát
function playRandomSong() {
    if (!bgMusic || PLAYLIST.length === 0) return;
    currentIndex = Math.floor(Math.random() * PLAYLIST.length);
    loadSong(currentIndex);
    setTimeout(() => {
        bgMusic
            .play()
            .then(() => {
                isMusicPlaying = true;
                if (musicBtn) musicBtn.textContent = '🎵git s';
            })
            .catch((e) => console.log('Trình duyệt chặn tự động phát:', e));
    }, 500);
}

// ✅ Tải bài hát theo số thứ tự
function loadSong(index) {
    if (bgMusic && PLAYLIST[index]) {
        bgMusic.src = PLAYLIST[index];
        bgMusic.load();
    }
}

// ✅ Tự chuyển bài khi hết bài hiện tại
function playNextSong() {
    currentIndex = (currentIndex + 1) % PLAYLIST.length;
    loadSong(currentIndex);
    if (isMusicPlaying) {
        bgMusic.play().catch((e) => {});
    }
}

// ✅ Nút BẬT / TẮT nhạc
if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.textContent = '🎵';
            isMusicPlaying = false;
        } else {
            bgMusic
                .play()
                .then(() => {
                    musicBtn.textContent = '🔊';
                    isMusicPlaying = true;
                })
                .catch((err) => alert('❌ Không phát được nhạc: ' + err.message));
        }
    });
}

// ✅ Khi bài hát kết thúc → tự chuyển bài
if (bgMusic) {
    bgMusic.addEventListener('ended', playNextSong);
}

// ✅ Liên kết với nút "Mở thiệp" trong main.js
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openInvitationBtn');
    if (openBtn) {
        openBtn.addEventListener('click', playRandomSong);
    }
});
