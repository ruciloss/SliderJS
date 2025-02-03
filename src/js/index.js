import { $, $$, addClass, addEvent, setHTMLContent, addStyle, createNode, debug, setAttribute, uuidv4, hide, appendNode, toggleClass } from './domease.min.js';

const prefix = 'sliderjs';
const slider = $(`.${prefix}`);
const debugPrefix = '[SliderJS]';

if (!slider) {
    debug(debugPrefix, 'SliderJS element not found', null, true);
    throw new Error('SliderJS element not found');
}
slider.id = uuidv4();
debug(debugPrefix, 'Initializing SliderJS', { id: slider.id });

const inner = $(`.${prefix}-inner`, slider);
const slides = $$(`.${prefix}-item`, inner);
if (!inner || slides.length === 0) {
    debug(debugPrefix, 'Content or slides not found', null, true);
    throw new Error('SliderJS content or slides not found');
}
debug(debugPrefix, 'Content and slides found', { totalSlides: slides.length });

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
debug(debugPrefix, 'Slider configuration', config);

const state = {
    currentIndex: 0,
    totalSlides: slides.length,
    autoplayInterval: null,
    isPlaying: config.autoplayDisabled,
};
debug(debugPrefix, 'Slider initial state', state);

function createDots() {
    const dotsContainer = createNode('div');
    addClass(dotsContainer, 'sliderjs-dots');
    appendNode(slider, dotsContainer);

    for (let i = 0; i < state.totalSlides; i++) {
        const dot = createNode('span');
        addClass(dot, 'sliderjs-dot');
        addEvent(dot, 'click', () => {
            debug(debugPrefix, 'Dot clicked', { index: i });
            showSlide(i);
        });
        appendNode(dotsContainer, dot);
    }

    if (config.dotsDisabled) {
        hide(dotsContainer);
    }
}

function createControl() {

    if (config.autoplayDisabled) {
        return;
    }

    const controlButton = createNode('div');
    addClass(controlButton, 'sliderjs-control');
    setHTMLContent(controlButton, '&#9208;');
    appendNode(slider, controlButton);

    function toggleAutoplay() {
        if (state.isPlaying) {
            clearInterval(state.autoplayInterval);
            state.autoplayInterval = null;
            setHTMLContent(controlButton, '&#9208;');
            debug(debugPrefix, 'Autoplay paused');
        } else {
            autoplay();
            setHTMLContent(controlButton, '&#9654;');
            debug(debugPrefix, 'Autoplay resumed');
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
    addClass(counter, 'sliderjs-counter');

    if (config.counterDisabled) {
        hide(counter);
    }

    appendNode(slider, counter);

    function updateCounter() {
        counter.textContent = `${state.currentIndex + 1}/${state.totalSlides}`;
        debug(debugPrefix, 'Counter updated', { currentIndex: state.currentIndex + 1, totalSlides: state.totalSlides });
    }

    updateCounter();

    return updateCounter;
}

const updateCounter = createCounter();

function createNav() {
    const navPrev = createNode('div');
    addClass(navPrev, 'sliderjs-nav', 'sliderjs-prev');
    setHTMLContent(navPrev, '&#10094;');
    appendNode(slider, navPrev);

    const navNext = createNode('div');
    addClass(navNext, 'sliderjs-nav', 'sliderjs-next');
    setHTMLContent(navNext, '&#10095;');
    appendNode(slider, navNext);

    addEvent(navPrev, 'click', () => {
        debug(debugPrefix, 'Previous navigation clicked');
        showSlide(state.currentIndex - 1);
    });

    addEvent(navNext, 'click', () => {
        debug(debugPrefix, 'Next navigation clicked');
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
            addClass(slide, 'sliderjs-overlay');
        });
        debug(debugPrefix, 'Overlay added to slides');
    }
}

function showSlide(index) {
    debug(debugPrefix, 'Showing slide', { index });

    if (!config.loopDisabled) {
        if (index < 0) index = state.totalSlides - config.items;
        if (index >= state.totalSlides) index = 0;
    } else {
        if (index < 0) index = 0;
        if (index > state.totalSlides - config.items) index = state.totalSlides - config.items;
    }

    state.currentIndex = index;
    const slideWidthPercentage = 100;
    inner.style.transform = `translateX(-${index * slideWidthPercentage}%)`;

    updateDots();
    updateCounter();
}

function updateDots() {
    const dots = $$(`.${prefix}-dot`);
    dots.forEach((dot, index) => {
        toggleClass(dot, 'active', index === state.currentIndex);
    });
    debug(debugPrefix, 'Dots updated', { activeDot: state.currentIndex });
}

function autoplay() {
    if (!config.autoplayDisabled && !state.autoplayInterval) {
        state.autoplayInterval = setInterval(() => {
            debug(debugPrefix, 'Autoplay advancing slide', { currentIndex: state.currentIndex });
            showSlide(state.currentIndex + 1);
        }, config.autoplaySpeed);
    }
}

function a11yKeyboard() {
    slides.forEach((slide) => {
        setAttribute(slide, 'tabindex', '-1');
    });

    const navButtons = $$(`.${prefix}-nav`);

    navButtons.forEach((button) => {
        setAttribute(button, 'tabindex', '0');
        addEvent(button, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    const dots = $$(`.${prefix}-dot`);
    dots.forEach((dot, index) => {
        setAttribute(dot, 'tabindex', '0');
        addEvent(dot, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                debug(debugPrefix, 'Dot activated via keyboard', { index });
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
                        debug(debugPrefix, 'Active slide activated via keyboard', { index });
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
                debug(debugPrefix, 'Key pressed', { key: e.key });
                showSlide(state.currentIndex + 1);
                break;
            case 'ArrowDown':
            case 'ArrowLeft':
                debug(debugPrefix, 'Key pressed', { key: e.key });
                showSlide(state.currentIndex - 1);
                break;
            case 'Home':
                debug(debugPrefix, 'Key pressed', { key: e.key });
                showSlide(0);
                break;
            case 'End':
                debug(debugPrefix, 'Key pressed', { key: e.key });
                showSlide(state.totalSlides - 1);
                break;
            case 'PageUp':
                debug(debugPrefix, 'Key pressed', { key: e.key });
                showSlide(state.currentIndex + 2);
                break;
            case 'PageDown':
                debug(debugPrefix, 'Key pressed', { key: e.key });
                showSlide(state.currentIndex - 2);
                break;
        }
    });

    const originalShowSlide = showSlide;
    showSlide = (index) => {
        originalShowSlide(index);
        updateSlideTabindex();
    };

    const playPauseButton = $(`.${prefix}-control`);
    setAttribute(playPauseButton, 'tabindex', '0');

    addEvent(playPauseButton, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playPauseButton.click();
        }
    });

    updateSlideTabindex();
    debug(debugPrefix, 'Tab accessibility and keyboard navigation enabled');
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

    const navPrev = $(`.${prefix}-prev`);
    setAttribute(navPrev, 'tabindex', '0');
    setAttribute(navPrev, 'role', 'button');
    setAttribute(navPrev, 'aria-label', 'Previous slide');

    const navNext = $(`.${prefix}-next`);
    setAttribute(navNext, 'tabindex', '0');
    setAttribute(navNext, 'role', 'button');
    setAttribute(navNext, 'aria-label', 'Next slide');

    $$(`.${prefix}-dot`).forEach((dot, index) => {
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

    const playPauseButton = $(`.${prefix}-control`);
    setAttribute(playPauseButton, 'role', 'button');
    setAttribute(playPauseButton, 'aria-label', 'Play/Pause slider');

    const originalShowSlide = showSlide;
    showSlide = (index) => {
        originalShowSlide(index);
        slides.forEach((slide, idx) => {
            setAttribute(slide, 'tabindex', idx === state.currentIndex ? '0' : '-1');
        });
        $$(`.${prefix}-dot`).forEach((dot, idx) => {
            setAttribute(dot, 'aria-selected', idx === state.currentIndex ? 'true' : 'false');
        });
    };

    debug(debugPrefix, 'Accessibility enhancements applied');
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
        inner.style.transition = 'none'; 
        debug(debugPrefix, 'Mouse down', { startX });
    }

    function handleMouseMove(event) {
        if (!isDragging) return;

        event.preventDefault(); 
        const currentX = event.clientX;
        const deltaX = currentX - startX; 
        currentTranslate = prevTranslate + deltaX;

        const maxTranslate = 0; 
        const minTranslate = -(state.totalSlides - 1) * inner.offsetWidth; 

        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate;
        } else if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        }

        inner.style.transform = `translateX(${currentTranslate}px)`;
        debug(debugPrefix, 'Mouse move', { currentX, deltaX, currentTranslate });
    }

    function handleMouseUp() {
        if (!isDragging) return;

        isDragging = false;
        inner.style.transition = 'transform 0.3s ease-out';

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -50 && state.currentIndex < state.totalSlides - 1) {
            showSlide(state.currentIndex + 1); 
        } else if (movedBy > 50 && state.currentIndex > 0) {
            showSlide(state.currentIndex - 1); 
        } else {
            showSlide(state.currentIndex); 
        }

        prevTranslate = -state.currentIndex * inner.offsetWidth; 
        debug(debugPrefix, 'Mouse up', { movedBy, prevTranslate });
    }

    addEvent(inner, 'mousedown', handleMouseDown);
    addEvent(window, 'mousemove', handleMouseMove);
    addEvent(window, 'mouseup', handleMouseUp);

    inner.querySelectorAll("img").forEach((img) => {
        img.setAttribute('draggable', 'false');
    });

    debug(debugPrefix, 'Drag & Drop enabled');
}

function run() {
    debug(debugPrefix, 'Initializing...');
    addStyle(`dist/css/${prefix}.min.css`);
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
