document.addEventListener('DOMContentLoaded', () => {
    // --- BGM Logic ---
    const audio = document.getElementById('bgm-player');
    
    const attemptPlay = () => {
        if (!audio) return;
        audio.play().catch(() => {
            // Auto-play might be blocked, wait for user interaction
        });
    };

    // --- Index Page Logic ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const cover2Screen = document.getElementById('cover2-screen');
    const mapScreen = document.getElementById('map-screen');
    
    if (welcomeScreen && mapScreen) {
        const clickHere = document.querySelector('.click-here');
        const params = new URLSearchParams(window.location.search);
        const welcomeSeen = sessionStorage.getItem('welcomeSeen') === 'true';

        const showMainScreen = () => {
            if (cover2Screen) {
                cover2Screen.classList.remove('active');
                cover2Screen.classList.add('hidden');
            }
            mapScreen.classList.remove('hidden');
            mapScreen.classList.add('active');
            sessionStorage.setItem('welcomeSeen', 'true');
        };

        const showCover2 = () => {
            welcomeScreen.classList.remove('active');
            welcomeScreen.classList.add('hidden');
            setTimeout(() => {
                if (cover2Screen) {
                    cover2Screen.classList.remove('hidden');
                    cover2Screen.classList.add('active');
                    setTimeout(showMainScreen, 1200);
                    cover2Screen.addEventListener('click', showMainScreen, { once: true });
                } else {
                    showMainScreen();
                }
            }, 450);
        };

        if (welcomeSeen || params.get('view') === 'main') {
            // Skip welcome animation
            welcomeScreen.classList.remove('active');
            welcomeScreen.classList.add('hidden');
            if (cover2Screen) {
                cover2Screen.classList.remove('active');
                cover2Screen.classList.add('hidden');
            }
            mapScreen.classList.remove('hidden');
            mapScreen.classList.add('active');
        } else {
            // Show welcome normally
            if (clickHere) {
                clickHere.addEventListener('click', (e) => {
                    e.preventDefault();
                    showCover2();
                });
            }
        }

        const mapBtn = document.querySelector('.map-btn');
        if (mapBtn) {
            mapBtn.addEventListener('click', () => {
                mapScreen.classList.remove('active');
                mapScreen.classList.add('hidden');
                setTimeout(() => { window.location.href = 'detail_map.html'; }, 1000);
            });
        }

        const suggestedBtn = document.querySelector('.suggested-mountain-btn');
        if (suggestedBtn) {
            suggestedBtn.addEventListener('click', () => {
                mapScreen.classList.remove('active');
                mapScreen.classList.add('hidden');
                setTimeout(() => { window.location.href = 'suggested_route.html'; }, 1000);
            });
        }
    }

    // --- Suggested Route Page Logic ---
    const day1Btn = document.getElementById('day1-btn');
    const day2Btn = document.getElementById('day2-btn');
    const routeImg = document.getElementById('route-img');

    if (day1Btn && day2Btn && routeImg) {
        day1Btn.addEventListener('click', (e) => {
            e.preventDefault();
            routeImg.src = 'src/image/Route/Day1.jpg';
            day1Btn.classList.add('active');
            day2Btn.classList.remove('active');
        });

        day2Btn.addEventListener('click', (e) => {
            e.preventDefault();
            routeImg.src = 'src/image/Route/Day2.png';
            day2Btn.classList.add('active');
            day1Btn.classList.remove('active');
        });

        // Default active state
        day1Btn.classList.add('active');

        // Image Zoom Modal logic
        const imageModal = document.getElementById('image-modal');
        const modalLargeImg = document.getElementById('modal-large-img');
        const imageCloseBtn = document.querySelector('.image-close-btn');

        if (imageModal && modalLargeImg) {
            routeImg.style.cursor = 'zoom-in';
            routeImg.addEventListener('click', () => {
                modalLargeImg.src = routeImg.src;
                imageModal.classList.remove('hidden');
            });

            if (imageCloseBtn) {
                imageCloseBtn.addEventListener('click', () => {
                    imageModal.classList.add('hidden');
                });
            }

            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) {
                    imageModal.classList.add('hidden');
                }
            });
        }
    }

    // --- Detail Map Page Logic ---
    const mapPins = document.querySelectorAll('.map-pin');
    const modal = document.getElementById('info-modal');
    
    if (mapPins.length > 0 && modal) {
        const modalTitle = document.getElementById('modal-title');
        const modalChinese = document.getElementById('modal-chinese-context');
        const modalEng = document.getElementById('modal-eng-context');
        const modalImg = document.getElementById('modal-location-img');
        const modalQrContainer = document.getElementById('modal-qr-container');
        const modalQrImg = document.getElementById('modal-qr-img');
        const closeBtn = document.querySelector('.close-btn');

        mapPins.forEach(pin => {
            pin.addEventListener('click', () => {
                modalTitle.textContent = pin.getAttribute('data-title');
                modalChinese.textContent = pin.getAttribute('data-chinese_context');
                modalEng.textContent = pin.getAttribute('data-eng_context');
                
                const imgSrc = pin.getAttribute('data-img');
                if (imgSrc) {
                    modalImg.src = imgSrc;
                    modalImg.style.display = 'block';
                } else {
                    modalImg.style.display = 'none';
                }

                const qrSrc = pin.getAttribute('data-qr-code');
                if (qrSrc && qrSrc.trim() !== '') {
                    modalQrImg.src = qrSrc;
                    modalQrContainer.style.display = 'flex';
                } else {
                    modalQrContainer.style.display = 'none';
                }
                
                modal.classList.remove('hidden');
            });
        });

        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
    }

    // --- Navigation Logic ---
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    const goToOtherMapPage = () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('detail_map.html')) {
            window.location.href = 'trail_map.html';
        } else if (currentPath.includes('trail_map.html')) {
            window.location.href = 'detail_map.html';
        }
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', goToOtherMapPage);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', goToOtherMapPage);
    };

    if (sessionStorage.getItem('bgmEnabled') === '1') {
        attemptPlay();
    } else {
        attemptPlay();
    }

    const unlock = () => {
        attemptPlay();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    const saveTime = () => {
        try { sessionStorage.setItem('bgmTime', String(audio.currentTime || 0)); } catch (e) {}
    };

    audio.addEventListener('timeupdate', saveTime);
    window.addEventListener('pagehide', saveTime);
    window.addEventListener('beforeunload', saveTime);
})();
