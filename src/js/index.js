import { $, $$$, addClass, addEvent, setHTMLContent, addStyle, createNode, debug, setAttribute, uuidv4, hide, appendNode, toggleClass } from './domease.min.js';

const slider = $('.swiper');
if (!slider) {
    debug('[SliderJS]', 'Slider element not found', null, true);
    throw new Error('Slider element not found');
}
slider.id = uuidv4();
debug('[SliderJS]', 'Initializing Swiper slider', { id: slider.id });

const swiperInner = $('.swiper-inner', slider);
const slides = $$$('.swiper-item', swiperInner);
if (!swiperInner || slides.length === 0) {
    debug('[SliderJS]', 'Swiper content or slides not found', null, true);
    throw new Error('Swiper content or slides not found');
}
debug('[SliderJS]', 'Swiper content and slides found', { totalSlides: slides.length });

const config = {
    autoplayDisabled: slider.dataset.autoplay === "false",
    autoplaySpeed: parseInt(slider.dataset.speed, 10) || 8000,
    loopDisabled: slider.dataset.loop === "false",
    overlayEnabled: slider.dataset.overlay === "true",
    navDisabled: slider.dataset.nav === "false",
    dotsDisabled: slider.dataset.dots === "false",
    controlDisabled: slider.dataset.control === "false",
    counterDisabled: slider.dataset.counter === "false"
};
debug('[SliderJS]', 'Slider configuration', config);

const state = {
    currentIndex: 0,
    totalSlides: slides.length,
    autoplayInterval: null,
    isPlaying: config.autoplayDisabled,
};
debug('[SliderJS]', 'Slider initial state', state);

function createDots() {
    const dotsContainer = createNode('div');
    addClass(dotsContainer, 'swiper-dots');
    appendNode(slider, dotsContainer);

    for (let i = 0; i < state.totalSlides; i++) {
        const dot = createNode('span');
        addClass(dot, 'swiper-dot');
        addEvent(dot, 'click', () => {
            debug('[SliderJS]', 'Dot clicked', { index: i });
            showSlide(i);
        });
        appendNode(dotsContainer, dot);
    }

    if (config.dotsDisabled) {
        hide(dotsContainer);
    }
}

function createControl() {
    const controlButton = createNode('div');
    addClass(controlButton, 'swiper-control');
    setHTMLContent(controlButton, '&#9208;');
    appendNode(slider, controlButton);

    function toggleAutoplay() {
        if (state.isPlaying) {
            clearInterval(state.autoplayInterval);
            state.autoplayInterval = null;
            setHTMLContent(controlButton, '&#9208;');
            debug('[SliderJS]', 'Autoplay paused');
        } else {
            autoplay();
            setHTMLContent(controlButton, '&#9654;');
            debug('[SliderJS]', 'Autoplay resumed');
        }
        state.isPlaying = !state.isPlaying; 
    }

    addEvent(controlButton, 'click', toggleAutoplay);

    if (config.controlDisabled) {
        hide(controlButton);
    }
}

function createCounter() {
    const counter = createNode('div');
    addClass(counter, 'swiper-counter');

    if (config.counterDisabled) {
        hide(counter);
    }

    appendNode(slider, counter);

    function updateCounter() {
        counter.textContent = `${state.currentIndex + 1}/${state.totalSlides}`;
        debug('[SliderJS]', 'Counter updated', { currentIndex: state.currentIndex + 1, totalSlides: state.totalSlides });
    }

    updateCounter();

    return updateCounter;
}

const updateCounter = createCounter();

function createNav() {
    const navPrev = createNode('div');
    addClass(navPrev, 'swiper-nav', 'swiper-prev');
    setHTMLContent(navPrev, '&#10094;');
    appendNode(slider, navPrev);

    const navNext = createNode('div');
    addClass(navNext, 'swiper-nav', 'swiper-next');
    setHTMLContent(navNext, '&#10095;');
    appendNode(slider, navNext);

    addEvent(navPrev, 'click', () => {
        debug('[SliderJS]', 'Previous navigation clicked');
        showSlide(state.currentIndex - 1);
    });

    addEvent(navNext, 'click', () => {
        debug('[SliderJS]', 'Next navigation clicked');
        showSlide(state.currentIndex + 1);
    });

    if (config.navDisabled) {
        hide(navPrev);
        hide(navNext);
    }
}

function createOverlay() {
    if (config.overlayEnabled) {
        slides.forEach(slide => {
            addClass(slide, 'swiper-overlay');
        });
        debug('[SliderJS]', 'Overlay added to slides');
    }
}

function showSlide(index) {
    debug('[SliderJS]', 'Showing slide', { index });

    if (!config.loopDisabled) {
        if (index < 0) index = state.totalSlides - config.items;
        if (index >= state.totalSlides) index = 0;
    } else {
        if (index < 0) index = 0;
        if (index > state.totalSlides - config.items) index = state.totalSlides - config.items;
    }

    state.currentIndex = index;
    const slideWidthPercentage = 100;
    swiperInner.style.transform = `translateX(-${index * slideWidthPercentage}%)`;

    updateDots();
    updateCounter();
}

function updateDots() {
    const dots = $$$('.swiper-dot');
    dots.forEach((dot, index) => {
        toggleClass(dot, 'active', index === state.currentIndex);
    });
    debug('[SliderJS]', 'Dots updated', { activeDot: state.currentIndex });
}

function autoplay() {
    if (!config.autoplayDisabled && !state.autoplayInterval) {
        state.autoplayInterval = setInterval(() => {
            debug('[SliderJS]', 'Autoplay advancing slide', { currentIndex: state.currentIndex });
            showSlide(state.currentIndex + 1);
        }, config.autoplaySpeed);
    }
}

function a11yKeyboard() {
    slides.forEach((slide) => {
        setAttribute(slide, 'tabindex', '-1');
    });

    const navButtons = $$$('.swiper-nav');

    navButtons.forEach((button) => {
        setAttribute(button, 'tabindex', '0');
        addEvent(button, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    const dots = $$$('.swiper-dot');
    dots.forEach((dot, index) => {
        setAttribute(dot, 'tabindex', '0');
        addEvent(dot, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                debug('[SliderJS]', 'Dot activated via keyboard', { index });
                showSlide(index);
            }
        });
    });

    function updateSlideTabindex() {
        slides.forEach((slide, index) => {
            if (index === state.currentIndex) {
                setAttribute(slide, 'tabindex', '0');
                addEvent(slide, 'keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        debug('[SliderJS]', 'Active slide activated via keyboard', { index });
                        showSlide(index);
                    }
                });
            } else {
                setAttribute(slide, 'tabindex', '-1');
            }
        });
    }

    addEvent(document, 'keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowRight':
                debug('[SliderJS]', 'Key pressed', { key: e.key });
                showSlide(state.currentIndex + 1);
                break;
            case 'ArrowDown':
            case 'ArrowLeft':
                debug('[SliderJS]', 'Key pressed', { key: e.key });
                showSlide(state.currentIndex - 1);
                break;
            case 'Home':
                debug('[SliderJS]', 'Key pressed', { key: e.key });
                showSlide(0);
                break;
            case 'End':
                debug('[SliderJS]', 'Key pressed', { key: e.key });
                showSlide(state.totalSlides - 1);
                break;
            case 'PageUp':
                debug('[SliderJS]', 'Key pressed', { key: e.key });
                showSlide(state.currentIndex + 2);
                break;
            case 'PageDown':
                debug('[SliderJS]', 'Key pressed', { key: e.key });
                showSlide(state.currentIndex - 2);
                break;
        }
    });

    const originalShowSlide = showSlide;
    showSlide = (index) => {
        originalShowSlide(index);
        updateSlideTabindex();
    };

    const playPauseButton = $('.swiper-control');
    setAttribute(playPauseButton, 'tabindex', '0');

    addEvent(playPauseButton, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playPauseButton.click();
        }
    });

    updateSlideTabindex();
    debug('[SliderJS]', 'Tab accessibility and keyboard navigation enabled');
}

function a11y() {
    setAttribute(slider, 'role', 'region');
    setAttribute(slider, 'aria-roledescription', 'carousel');
    setAttribute(slider, 'aria-label', 'Carousel');

    slides.forEach((slide, index) => {
        setAttribute(slide, 'role', 'group');
        setAttribute(slide, 'aria-label', `Slide ${index + 1} of ${state.totalSlides}`);
        setAttribute(slide, 'tabindex', index === state.currentIndex ? '0' : '-1');
    });

    const navPrev = $('.swiper-prev');
    setAttribute(navPrev, 'tabindex', '0');
    setAttribute(navPrev, 'role', 'button');
    setAttribute(navPrev, 'aria-label', 'Previous slide');

    const navNext = $('.swiper-next');
    setAttribute(navNext, 'tabindex', '0');
    setAttribute(navNext, 'role', 'button');
    setAttribute(navNext, 'aria-label', 'Next slide');

    $$$('.swiper-dot').forEach((dot, index) => {
        setAttribute(dot, 'role', 'tab');
        setAttribute(dot, 'aria-label', `${index + 1}. slide`);
        setAttribute(dot, 'aria-selected', index === state.currentIndex ? 'true' : 'false');
        setAttribute(dot, 'tabindex', '0');

        addEvent(dot, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                showSlide(index);
            }
        });
    });

    const playPauseButton = $('.swiper-control');
    setAttribute(playPauseButton, 'role', 'button');
    setAttribute(playPauseButton, 'aria-label', 'Play/Pause slider');

    const originalShowSlide = showSlide;
    showSlide = (index) => {
        originalShowSlide(index);
        slides.forEach((slide, idx) => {
            setAttribute(slide, 'tabindex', idx === state.currentIndex ? '0' : '-1');
        });
        $$$('.swiper-dot').forEach((dot, idx) => {
            setAttribute(dot, 'aria-selected', idx === state.currentIndex ? 'true' : 'false');
        });
    };

    debug('[SliderJS]', 'Accessibility enhancements applied');
}

function enableDragAndDrop() {
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function handleMouseDown(event) {
        event.preventDefault(); 
        isDragging = true;
        startX = event.clientX;
        swiperInner.style.transition = 'none'; 
        debug('[SliderJS]', 'Mouse down', { startX });
    }

    function handleMouseMove(event) {
        if (!isDragging) return;

        event.preventDefault(); 
        const currentX = event.clientX;
        const deltaX = currentX - startX; 
        currentTranslate = prevTranslate + deltaX;

        const maxTranslate = 0; 
        const minTranslate = -(state.totalSlides - 1) * swiperInner.offsetWidth; 

        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate;
        } else if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        }

        swiperInner.style.transform = `translateX(${currentTranslate}px)`;
        debug('[SliderJS]', 'Mouse move', { currentX, deltaX, currentTranslate });
    }

    function handleMouseUp() {
        if (!isDragging) return;

        isDragging = false;
        swiperInner.style.transition = 'transform 0.3s ease-out';

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -50 && state.currentIndex < state.totalSlides - 1) {
            showSlide(state.currentIndex + 1); 
        } else if (movedBy > 50 && state.currentIndex > 0) {
            showSlide(state.currentIndex - 1); 
        } else {
            showSlide(state.currentIndex); 
        }

        prevTranslate = -state.currentIndex * swiperInner.offsetWidth; 
        debug('[SliderJS]', 'Mouse up', { movedBy, prevTranslate });
    }

    addEvent(swiperInner, 'mousedown', handleMouseDown);
    addEvent(window, 'mousemove', handleMouseMove);
    addEvent(window, 'mouseup', handleMouseUp);

    swiperInner.querySelectorAll("img").forEach((img) => {
        img.setAttribute('draggable', 'false');
    });

    debug('[SliderJS]', 'Drag&Drop enabled');
}

function run() {
    debug('[SliderJS]', 'Initializing...');
    addStyle('dist/css/swiper.min.css');
    createNav();
    createDots();
    createControl();
    createOverlay();
    showSlide(state.currentIndex);
    autoplay();
    a11y();
    a11yKeyboard();
    enableDragAndDrop();
}

run();
