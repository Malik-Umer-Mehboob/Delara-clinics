document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
            header.style.borderBottom = '1px solid rgba(197, 163, 88, 0.2)';
        } else {
            header.style.backgroundColor = '#000';
            header.style.borderBottom = '1px solid var(--border)';
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.header-nav');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isActive = nav.classList.toggle('active');
            if (menuOverlay) {
                menuOverlay.classList.toggle('active', isActive);
            }
            menuToggle.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                nav.classList.remove('active');
                menuOverlay.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        }

        // Close menu on link click
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                if (menuOverlay) menuOverlay.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth Scroll
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Doctor Slider Logic - AUTO SWITCH ON MOBILE
    const wrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.dr-slide');
    const dots = document.querySelectorAll('.slider-dots span');
    const prevBtn = document.querySelector('.arrow.prev');
    const nextBtn = document.querySelector('.arrow.next');

    let currentIndex = 0;
    const slideCount = slides.length;
    let autoSlideInterval;

    function updateSlider() {
        if (!wrapper) return;
        wrapper.style.transform = `translateX(${currentIndex * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[currentIndex]) slides[currentIndex].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlider();
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.getAttribute('data-index'));
            updateSlider();
            startAutoSlide();
        });
    });

    const sliderSec = document.querySelector('.dr-slider-sec');
    if (sliderSec) {
        sliderSec.addEventListener('mouseenter', stopAutoSlide);
        sliderSec.addEventListener('mouseleave', startAutoSlide);
        sliderSec.addEventListener('touchstart', stopAutoSlide, { passive: true });
        sliderSec.addEventListener('touchend', startAutoSlide, { passive: true });
    }

    if (wrapper && slideCount > 0) {
        updateSlider();
        startAutoSlide();
    }

    // Touch swipe for doctor slider
    let touchStartX = 0;
    let touchEndX = 0;

    if (sliderSec) {
        sliderSec.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderSec.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            startAutoSlide();
        }
    }

    // Testimonials Slider Logic - SINGLE CARD ON MOBILE, AUTO SWITCH
    const tTrack = document.querySelector('.testimonials-track');
    const tSlides = document.querySelectorAll('.testimonial-card');
    const tPrev = document.querySelector('.prev-testimonial');
    const tNext = document.querySelector('.next-testimonial');

    let tIndex = 0;
    const tCount = tSlides.length;
    let tVisible = window.innerWidth < 768 ? 1 : (window.innerWidth < 991 ? 2 : 3);
    let tAutoInterval;

    function updateTestimonials() {
        if (!tTrack) return;
        const moveAmount = tIndex * (100 / tVisible);
        tTrack.style.transform = `translateX(-${moveAmount}%)`;
    }

    function nextTestimonial() {
        const maxIndex = tCount - tVisible;
        if (tIndex >= maxIndex) {
            tIndex = 0;
        } else {
            tIndex++;
        }
        updateTestimonials();
    }

    function prevTestimonial() {
        const maxIndex = tCount - tVisible;
        if (tIndex <= 0) {
            tIndex = maxIndex;
        } else {
            tIndex--;
        }
        updateTestimonials();
    }

    function startTAuto() {
        stopTAuto();
        tAutoInterval = setInterval(nextTestimonial, 5000);
    }

    function stopTAuto() {
        clearInterval(tAutoInterval);
    }

    if (tNext) tNext.addEventListener('click', () => { nextTestimonial(); startTAuto(); });
    if (tPrev) tPrev.addEventListener('click', () => { prevTestimonial(); startTAuto(); });

    const tSec = document.querySelector('.testimonials-sec');
    if (tSec) {
        tSec.addEventListener('mouseenter', stopTAuto);
        tSec.addEventListener('mouseleave', startTAuto);
        tSec.addEventListener('touchstart', stopTAuto, { passive: true });
        tSec.addEventListener('touchend', startTAuto, { passive: true });
    }

    // Update visible slides on resize
    window.addEventListener('resize', () => {
        const newVisible = window.innerWidth < 768 ? 1 : (window.innerWidth < 991 ? 2 : 3);
        if (newVisible !== tVisible) {
            tVisible = newVisible;
            tIndex = 0;
            updateTestimonials();
        }
    });

    if (tTrack && tCount > 0) {
        updateTestimonials();
        startTAuto();
    }

    // Touch swipe for testimonials
    let tTouchStartX = 0;
    let tTouchEndX = 0;

    if (tSec) {
        tSec.addEventListener('touchstart', e => {
            tTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        tSec.addEventListener('touchend', e => {
            tTouchEndX = e.changedTouches[0].screenX;
            handleTestimonialSwipe();
        }, { passive: true });
    }

    function handleTestimonialSwipe() {
        const swipeThreshold = 50;
        const diff = tTouchStartX - tTouchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
            startTAuto();
        }
    }

    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('شكراً لتواصلك معنا! سنتواصل معك قريباً.');
            form.reset();
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in
    const animateElements = document.querySelectorAll('.treatment-card, .testimonial-card, .clinic-about .text-col, .clinic-about .image-col');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Interactive Hero on Mobile - Parallax Effect
    if (window.innerWidth <= 768) {
        const heroImage = document.querySelector('.hero-image img');
        const heroContent = document.querySelector('.hero-content');

        if (heroImage && heroContent) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.5;
                heroImage.style.transform = `translateY(${rate}px)`;
            });
        }
    }
});