// Telegram Bot Config (Լրացրու քո տվյալները)
    const TELEGRAM_BOT_TOKEN = '8903372942:AAGbqcNfflC7jcODGy8ESkzqjCtIRAj3TiY';
    const TELEGRAM_CHAT_ID = '-4883756007';

    // Slideshow Array & Preloader
    const slideImages = [
        './Images/Slide_one.JPG',
        './Images/Slide_two.JPG',
        './Images/Slide_three.JPG'
    ];

    // Preload Images
    slideImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    const layer1 = document.getElementById('bg-layer-1');
    const layer2 = document.getElementById('bg-layer-2');

    let currentIndex = 0;
    let activeLayer = 1;

    // Function to style layer background
    function getGradBg(url) {
        return `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('${url}')`;
    }

    // Initialize First Slide
    if (layer1) layer1.style.backgroundImage = getGradBg(slideImages[0]);

    function startSlideshow() {
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % slideImages.length;
            
            if (activeLayer === 1) {
                layer2.style.backgroundImage = getGradBg(slideImages[nextIndex]);
                layer2.style.opacity = '1';
                layer1.style.opacity = '0';
                activeLayer = 2;
            } else {
                layer1.style.backgroundImage = getGradBg(slideImages[nextIndex]);
                layer1.style.opacity = '1';
                layer2.style.opacity = '0';
                activeLayer = 1;
            }

            currentIndex = nextIndex;
        }, 4500);
    }

    // Envelope curtain open effect & Music Auto-play
    const sealBtn = document.getElementById('seal-btn');
    const envelopeContainer = document.getElementById('envelope-container');
    const bgMusic = document.getElementById('bg-music');

    if (sealBtn && envelopeContainer) {
        sealBtn.addEventListener('click', () => {
            if (bgMusic) {
                bgMusic.play().catch(err => console.log("Audio play error:", err));
            }

            envelopeContainer.classList.add('envelope-open');
            
            // Start the slideshow when envelope opens
            startSlideshow();

            setTimeout(() => {
                envelopeContainer.style.display = 'none';
            }, 900);
        });
    }

    // Scroll Arrow Action
    const scrollArrow = document.getElementById('scroll-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Countdown Script
    const weddingDate = new Date('November 11, 2026 14:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Modern Scroll Animation with Intersection Observer
    document.addEventListener('DOMContentLoaded', () => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, observerOptions);

        const animElements = document.querySelectorAll('.scroll-anim');
        animElements.forEach(el => observer.observe(el));
    });

    // Telegram Direct Handler
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSection = document.getElementById('rsvpSection');
    const formStatus = document.getElementById('formStatus');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(event.target);
            const name = formData.get('Անուն_Ազգանուն') || 'Նշված չէ';
            const attendance = formData.get('Մասնակցություն') || 'Նշված չէ';
            const guests = formData.get('Քանակ') || '1';
            
            const inviters = [];
            document.querySelectorAll('input[name="Հրավիրատու"]:checked').forEach(cb => {
                inviters.push(cb.value);
            });
            const invitedBy = inviters.length > 0 ? inviters.join(', ') : 'Նշված չէ';

            const messageText = `💌 <b>Նոր պատասխան հարցաթերթիկից</b>\n\n` +
                                `👤 <b>Անուն/Ազգանուն:</b> ${name}\n` +
                                `✅ <b>Մասնակցություն:</b> ${attendance}\n` +
                                `👥 <b>Հյուրերի քանակ:</b> ${guests}\n` +
                                `💍 <b>Ում կողմից:</b> ${invitedBy}`;

            try {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: messageText,
                        parse_mode: 'HTML'
                    })
                });

                if (response.ok) {
                    if (rsvpSection) rsvpSection.style.display = 'none';
                    if (formStatus) formStatus.style.display = 'block';
                } else {
                    alert('Սխալ տեղի ունեցավ նամակն ուղարկելիս։ Ստուգեք Bot Token-ը և Chat ID-ն։');
                }
            } catch (error) {
                console.error('Telegram API error:', error);
                alert('Ցանցային սխալ: Ստուգեք ինտերնետ կապը։');
            }
        });
    }