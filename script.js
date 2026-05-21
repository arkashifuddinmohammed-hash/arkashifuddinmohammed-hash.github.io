"use strict";

/* =========================================================
KASHIF MOHAMMED PORTFOLIO — COMPLETE JS
Category tabs + 6 projects per tab
Video preview on cursor
Random ambient playlist + volume control
Architect icon-only cursor + matching identity card
Slower cinematic loader
========================================================= */

/* =========================================================
GSAP SETUP
========================================================= */

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof ScrollToPlugin !== "undefined") {
        gsap.registerPlugin(ScrollToPlugin);
    }
}

/* =========================================================
GLOBAL SELECTORS
========================================================= */

const body = document.body;

const loader = document.querySelector(".architect-loader");
const factText = document.querySelector(".fact-text");
const observationIndex = document.querySelector(".observation-index");

const navbar = document.querySelector(".navbar");
const scrollProgress = document.querySelector(".scroll-progress");

const cursor = document.querySelector(".cursor");
const cursorIcon = document.querySelector(".cursor-icon");
const cursorLabel = document.querySelector(".cursor-label");

const menuToggle = document.querySelector(".menu-toggle");
const fullscreenMenu = document.querySelector(".fullscreen-menu");
const menuLinks = document.querySelectorAll(".menu-link");
const menuPreviewImage = document.querySelector(".menu-preview-image");

const themeToggle = document.querySelector(".theme-toggle");
const audioToggle = document.querySelector(".project-sound-toggle");
const ambientAudio = document.getElementById("ambient-audio");

const galleryModal = document.querySelector(".gallery-modal");
const closeGallery = document.querySelector(".close-gallery");

const transitionOverlay = document.querySelector(".transition-overlay");

const videoCursorPreview = document.querySelector(".video-cursor-preview");
const cursorPreviewVideo = document.querySelector(".cursor-preview-video");

const mouseLight = document.querySelector(".mouse-light");
const projectGrid = document.getElementById("projectGrid");

/* =========================================================
GLOBAL STATE
========================================================= */

const hasFinePointer =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const isTouchDevice = !hasFinePointer;

let lenis = null;
let menuOpen = false;
let audioEnabled = false;
let selectedArchitectCursor = null;

const MIN_LOADER_DURATION = 4800;
const DEFAULT_AMBIENT_VOLUME = 0.42;

/* =========================================================
RANDOM ARCHITECTURE FACTS
========================================================= */

const architectureFacts = [
    "Roman concrete structures can strengthen over time through seawater reactions.",
    "Antoni Gaudí used hanging chains to calculate natural structural curves.",
    "Ancient Persian wind towers cooled buildings without electricity.",
    "Buckminster Fuller once proposed floating cities above clouds.",
    "Japanese Metabolists imagined cities as living organisms.",
    "Louis Kahn often asked what a building wanted to become.",
    "Stepwells in India worked as water infrastructure and social spaces.",
    "The Pantheon’s concrete dome becomes thinner as it rises.",
    "Laurie Baker used brick bonds to reduce material waste.",
    "Traditional courtyard houses regulate heat through shade and airflow."
];

function initRandomFacts() {
    const randomFact =
        architectureFacts[Math.floor(Math.random() * architectureFacts.length)];

    if (factText) {
        factText.textContent = randomFact;
    }

    if (observationIndex) {
        const number = Math.floor(Math.random() * 24) + 1;

        observationIndex.textContent =
            `Observation ${String(number).padStart(2, "0")}`;
    }
}

initRandomFacts();

/* =========================================================
RANDOM FAMOUS ARCHITECT CURSOR ON EVERY RELOAD
Same architect controls cursor icon + hero identity card
========================================================= */

const architectCursorIdentities = [
    {
        architect: "Laurie Baker",
        icon: "🧱",
        meta: "Exposed brick • Honesty • Craft",
        idea: "Exposed brick and honest materiality"
    },
    {
        architect: "Charles Correa",
        icon: "⌐⌐",
        meta: "Climate • Cosmos • Urban form",
        idea: "Spectacles, climate, and urban form"
    },
    {
        architect: "Tadao Ando",
        icon: "◯",
        meta: "Concrete • Silence • Light",
        idea: "Concrete, silence, light, and void"
    },
    {
        architect: "Zaha Hadid",
        icon: "⌁",
        meta: "Fluidity • Motion • Future",
        idea: "Fluid curves and dynamic movement"
    },
    {
        architect: "Le Corbusier",
        icon: "✋",
        meta: "Open Hand • Modulor • Modernism",
        idea: "Open Hand, Modulor, and modernism"
    },
    {
        architect: "Louis Kahn",
        icon: "▣",
        meta: "Geometry • Silence • Monumentality",
        idea: "Monumental geometry and served spaces"
    },
    {
        architect: "B. V. Doshi",
        icon: "▦",
        meta: "Community • Humanism • Layers",
        idea: "Courtyards, community, and layered space"
    },
    {
        architect: "Frank Lloyd Wright",
        icon: "━",
        meta: "Prairie • Horizon • Organic form",
        idea: "Prairie horizontality and organic architecture"
    },
    {
        architect: "Mies van der Rohe",
        icon: "┼",
        meta: "Steel • Glass • Grid",
        idea: "Steel, glass, grid, and minimal structure"
    },
    {
        architect: "Geoffrey Bawa",
        icon: "☘",
        meta: "Tropical • Landscape • Atmosphere",
        idea: "Tropical modernism and landscape atmosphere"
    }
];

function setRandomArchitectCursor() {
    if (!cursorIcon) return;

    const lastIndex = Number(localStorage.getItem("last-architect-cursor"));

    let newIndex =
        Math.floor(Math.random() * architectCursorIdentities.length);

    if (!Number.isNaN(lastIndex) && architectCursorIdentities.length > 1) {
        while (newIndex === lastIndex) {
            newIndex =
                Math.floor(Math.random() * architectCursorIdentities.length);
        }
    }

    selectedArchitectCursor = architectCursorIdentities[newIndex];

    localStorage.setItem("last-architect-cursor", String(newIndex));

    cursorIcon.textContent = selectedArchitectCursor.icon;

    if (cursor) {
        cursor.classList.add("architect-cursor");
        cursor.setAttribute("data-architect", selectedArchitectCursor.architect);
        cursor.setAttribute(
            "title",
            `${selectedArchitectCursor.architect} — ${selectedArchitectCursor.idea}`
        );
    }

    if (cursorLabel) {
        cursorLabel.textContent = selectedArchitectCursor.architect
            .split(" ")
            .at(-1)
            .toUpperCase();
    }
}

setRandomArchitectCursor();

/* =========================================================
SLOW CINEMATIC LOADER
========================================================= */

function initLoader() {
    const loaderStartTime = performance.now();

    if (!loader || typeof gsap === "undefined") {
        setTimeout(() => {
            body.classList.add("page-ready");
            initHeroIntro();
        }, MIN_LOADER_DURATION);

        return;
    }

    const paths = document.querySelectorAll(".draw-path");

    paths.forEach((path) => {
        const length = path.getTotalLength ? path.getTotalLength() : 1000;

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });
    });

    const tl = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    tl.from(".loader-observation", {
        opacity: 0,
        y: 24,
        duration: 0.9
    });

    tl.to(paths, {
        strokeDashoffset: 0,
        duration: 2.2,
        stagger: 0.22,
        ease: "power2.inOut"
    }, "-=0.2");

    tl.from(".loader-logo", {
        opacity: 0,
        y: 30,
        duration: 1
    }, "-=0.7");

    tl.from(".loader-small", {
        opacity: 0,
        y: 14,
        duration: 0.8
    }, "-=0.6");

    tl.to({}, {
        duration: 0.8
    });

    tl.call(() => {
        const elapsed = performance.now() - loaderStartTime;
        const remaining = Math.max(0, MIN_LOADER_DURATION - elapsed);

        setTimeout(() => {
            gsap.to(loader, {
                opacity: 0,
                visibility: "hidden",
                duration: 1.15,
                ease: "power3.inOut",
                onComplete: () => {
                    loader.style.display = "none";
                    body.classList.add("page-ready");
                    initHeroIntro();
                }
            });
        }, remaining);
    });
}

window.addEventListener("load", initLoader);

/* =========================================================
HERO INTRO
========================================================= */

function initHeroIntro() {
    if (typeof gsap === "undefined") return;

    gsap.from(".navbar", {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    });

    gsap.from(".hero-content .hero-label", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.from(".hero-content h1", {
        y: 90,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.15
    });

    gsap.from(".hero-subtitle, .hero-description, .hero-btn", {
        y: 36,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.35
    });

    gsap.from(".scroll-text, .scroll-line", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.9
    });
}

/* =========================================================
DARK / LIGHT THEME
========================================================= */

function applyTheme(theme) {
    if (theme === "dark") {
        body.classList.add("dark-mode");

        if (themeToggle) {
            themeToggle.textContent = "☾";
        }
    } else {
        body.classList.remove("dark-mode");

        if (themeToggle) {
            themeToggle.textContent = "☼";
        }
    }
}

const savedTheme = localStorage.getItem("portfolio-theme") || "light";
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme =
            body.classList.contains("dark-mode") ? "light" : "dark";

        localStorage.setItem("portfolio-theme", nextTheme);
        applyTheme(nextTheme);
    });
}

/* =========================================================
AMBIENT AUDIO PANEL + RANDOM PLAYLIST
========================================================= */

const ambientPlaylist = [
    "assets/audio/ambient-01.mp3",
    "assets/audio/ambient-02.mp3",
    "assets/audio/ambient-03.mp3",
    "assets/audio/ambient-04.mp3"
];

function getRandomAmbientTrack() {
    return ambientPlaylist[Math.floor(Math.random() * ambientPlaylist.length)];
}

function createAudioPanel() {
    if (document.querySelector(".audio-control-panel")) return;

    const panel = document.createElement("div");

    panel.className = "audio-control-panel";

    panel.innerHTML = `
        <div class="audio-control-label">
            <span>Ambient</span>
            <span class="audio-status-text">OFF</span>
        </div>

        <input
        class="ambient-volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value="${DEFAULT_AMBIENT_VOLUME}"
        aria-label="Ambient audio volume">

        <button
        class="change-audio-track"
        type="button">
            Change Track
        </button>
    `;

    body.appendChild(panel);
}

createAudioPanel();

const audioPanel = document.querySelector(".audio-control-panel");
const audioVolumeSlider = document.querySelector(".ambient-volume");
const audioStatusText = document.querySelector(".audio-status-text");
const changeAudioTrackBtn = document.querySelector(".change-audio-track");

if (ambientAudio) {
    ambientAudio.volume = 0;
    ambientAudio.loop = true;
    ambientAudio.muted = false;
}

function getSavedAmbientVolume() {
    const savedVolume = localStorage.getItem("ambient-volume");

    if (savedVolume === null) {
        return DEFAULT_AMBIENT_VOLUME;
    }

    const parsedVolume = Number(savedVolume);

    if (Number.isNaN(parsedVolume)) {
        return DEFAULT_AMBIENT_VOLUME;
    }

    return Math.min(1, Math.max(0, parsedVolume));
}

function loadRandomAmbientTrack() {
    if (!ambientAudio) return;

    ambientAudio.src = getRandomAmbientTrack();
    ambientAudio.load();
}

function setAudioPanelState() {
    if (!audioToggle) return;

    if (audioEnabled) {
        audioToggle.classList.remove("muted");
        audioToggle.classList.add("active");
        body.classList.add("audio-enabled");

        if (audioStatusText) {
            audioStatusText.textContent = "ON";
        }
    } else {
        audioToggle.classList.add("muted");
        audioToggle.classList.remove("active");
        body.classList.remove("audio-enabled");

        if (audioStatusText) {
            audioStatusText.textContent = "OFF";
        }
    }
}

function showAudioPanel() {
    if (!audioPanel) return;

    audioPanel.classList.add("active");

    clearTimeout(showAudioPanel.hideTimer);

    showAudioPanel.hideTimer = setTimeout(() => {
        hideAudioPanel();
    }, 4500);
}

function hideAudioPanel() {
    if (!audioPanel) return;

    audioPanel.classList.remove("active");
}

function fadeAudioTo(volume, duration = 1) {
    if (!ambientAudio) return;

    if (typeof gsap !== "undefined") {
        gsap.to(ambientAudio, {
            volume,
            duration,
            ease: "power2.out"
        });
    } else {
        ambientAudio.volume = volume;
    }
}

async function enableAmbientAudio() {
    if (!ambientAudio || !audioToggle) return;

    try {
        const targetVolume = getSavedAmbientVolume();

        if (!ambientAudio.src) {
            loadRandomAmbientTrack();
        }

        ambientAudio.muted = false;

        await ambientAudio.play();

        audioEnabled = true;

        setAudioPanelState();
        showAudioPanel();

        fadeAudioTo(targetVolume, 1.2);
    } catch (error) {
        console.warn("Ambient audio could not play. Check audio file paths.", error);

        audioEnabled = false;
        setAudioPanelState();
        showAudioPanel();

        if (audioStatusText) {
            audioStatusText.textContent = "FILE?";
        }
    }
}

function disableAmbientAudio() {
    if (!ambientAudio || !audioToggle) return;

    audioEnabled = false;

    setAudioPanelState();
    showAudioPanel();

    fadeAudioTo(0, 0.6);

    setTimeout(() => {
        if (!audioEnabled && ambientAudio) {
            ambientAudio.pause();
        }
    }, 700);
}

async function changeAmbientTrack() {
    if (!ambientAudio) return;

    const wasPlaying = audioEnabled;

    fadeAudioTo(0, 0.3);

    setTimeout(async () => {
        loadRandomAmbientTrack();

        if (wasPlaying) {
            try {
                await ambientAudio.play();
                fadeAudioTo(getSavedAmbientVolume(), 0.8);
            } catch (error) {
                console.warn("Could not change ambient track.", error);
            }
        }
    }, 350);

    showAudioPanel();
}

if (audioVolumeSlider) {
    const savedVolume = getSavedAmbientVolume();

    audioVolumeSlider.value = savedVolume;

    audioVolumeSlider.addEventListener("input", () => {
        const newVolume = Number(audioVolumeSlider.value);

        localStorage.setItem("ambient-volume", String(newVolume));

        if (ambientAudio && audioEnabled) {
            fadeAudioTo(newVolume, 0.15);
        }

        showAudioPanel();
    });

    audioVolumeSlider.addEventListener("mouseenter", showAudioPanel);
}

if (audioToggle && ambientAudio) {
    audioToggle.addEventListener("click", () => {
        if (!audioEnabled) {
            enableAmbientAudio();
        } else {
            disableAmbientAudio();
        }
    });

    audioToggle.addEventListener("mouseenter", showAudioPanel);
}

if (changeAudioTrackBtn) {
    changeAudioTrackBtn.addEventListener("click", changeAmbientTrack);
}

if (audioPanel) {
    audioPanel.addEventListener("mouseenter", () => {
        clearTimeout(showAudioPanel.hideTimer);
        audioPanel.classList.add("active");
    });

    audioPanel.addEventListener("mouseleave", () => {
        showAudioPanel.hideTimer = setTimeout(() => {
            hideAudioPanel();
        }, 1200);
    });
}

setAudioPanelState();

/* =========================================================
FULLSCREEN MENU
========================================================= */

const menuTimeline =
    typeof gsap !== "undefined" && fullscreenMenu
        ? gsap.timeline({ paused: true })
        : null;

if (menuTimeline) {
    gsap.set(fullscreenMenu, {
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none"
    });

    menuTimeline
        .to(fullscreenMenu, {
            opacity: 1,
            visibility: "visible",
            pointerEvents: "auto",
            duration: 0.5,
            ease: "power3.out"
        })
        .from(".menu-link", {
            y: 80,
            opacity: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "power4.out"
        }, "-=0.15")
        .from(".menu-footer span", {
            y: 20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out"
        }, "-=0.45");
}

function openMenu() {
    if (!menuTimeline || !menuToggle) return;

    menuOpen = true;
    menuToggle.classList.add("active");
    body.classList.add("menu-open");

    if (lenis) {
        lenis.stop();
    }

    menuTimeline.play();
}

function closeMenu() {
    if (!menuTimeline || !menuToggle) return;

    menuOpen = false;
    menuToggle.classList.remove("active");
    body.classList.remove("menu-open");

    if (lenis) {
        lenis.start();
    }

    menuTimeline.reverse();
}

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        menuOpen ? closeMenu() : openMenu();
    });
}

menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

/* =========================================================
MENU PREVIEW IMAGE
========================================================= */

const menuPreviewData = {
    home: "assets/images/menu-home.jpg",
    work: "assets/images/menu-work.jpg",
    about: "assets/images/menu-about.jpg",
    studio: "assets/images/menu-studio.jpg",
    contact: "assets/images/menu-contact.jpg"
};

menuLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
        if (!menuPreviewImage) return;

        const previewKey = link.dataset.preview;
        const imageSrc = menuPreviewData[previewKey];

        if (!imageSrc) return;

        menuPreviewImage.src = imageSrc;

        if (typeof gsap !== "undefined") {
            gsap.fromTo(
                menuPreviewImage,
                {
                    scale: 1.08,
                    opacity: 0.4
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out"
                }
            );
        }
    });
});

/* =========================================================
CUSTOM CURSOR
========================================================= */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let cursorX = mouseX;
let cursorY = mouseY;

if (isTouchDevice) {
    if (cursor) {
        cursor.style.display = "none";
    }

    body.classList.add("touch-device");
} else if (cursor) {
    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function renderCursor() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;

        cursor.style.transform =
            `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

        requestAnimationFrame(renderCursor);
    }

    renderCursor();

    document.addEventListener("mousedown", () => {
        cursor.classList.add("cursor-down");
    });

    document.addEventListener("mouseup", () => {
        cursor.classList.remove("cursor-down");
    });

    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
    });
}

/* =========================================================
VIDEO CURSOR PREVIEW POSITION
========================================================= */

if (videoCursorPreview && !isTouchDevice) {
    window.addEventListener("mousemove", (event) => {
        if (typeof gsap !== "undefined") {
            gsap.to(videoCursorPreview, {
                x: event.clientX + 180,
                y: event.clientY + 90,
                duration: 0.35,
                ease: "power3.out"
            });
        } else {
            videoCursorPreview.style.left = `${event.clientX + 180}px`;
            videoCursorPreview.style.top = `${event.clientY + 90}px`;
        }
    });
}

/* =========================================================
GENERAL CURSOR TARGETS
========================================================= */

function bindGeneralCursorTargets() {
    const cursorTargets = document.querySelectorAll(
        "a, button, .filter-btn, .menu-toggle"
    );

    cursorTargets.forEach((target) => {
        if (target.dataset.cursorBound === "true") return;

        target.dataset.cursorBound = "true";

        target.addEventListener("mouseenter", () => {
            if (!cursor || isTouchDevice) return;

            cursor.classList.add("active-link");

            if (cursorLabel) {
                cursorLabel.textContent =
                    target.dataset.cursor || "OPEN";
            }
        });

        target.addEventListener("mouseleave", () => {
            if (!cursor || isTouchDevice) return;

            cursor.classList.remove(
                "active-link",
                "active-project",
                "magnetic"
            );

            if (cursorLabel) {
                cursorLabel.textContent = selectedArchitectCursor
                    ? selectedArchitectCursor.architect.split(" ").at(-1).toUpperCase()
                    : "";
            }
        });
    });
}

bindGeneralCursorTargets();

/* =========================================================
MAGNETIC ELEMENTS
========================================================= */

function bindMagneticElements(scope = document) {
    const magneticElements = scope.querySelectorAll(
        ".hero-btn, .menu-link, .contact-card, .project-link, .theme-toggle, .project-sound-toggle, .menu-toggle"
    );

    magneticElements.forEach((element) => {
        if (element.dataset.magneticBound === "true") return;

        element.dataset.magneticBound = "true";

        element.addEventListener("mousemove", (event) => {
            if (isTouchDevice || typeof gsap === "undefined") return;

            const rect = element.getBoundingClientRect();

            const x =
                event.clientX - rect.left - rect.width / 2;

            const y =
                event.clientY - rect.top - rect.height / 2;

            gsap.to(element, {
                x: x * 0.18,
                y: y * 0.18,
                duration: 0.45,
                ease: "power3.out"
            });

            if (cursor) {
                cursor.classList.add("magnetic");
            }
        });

        element.addEventListener("mouseleave", () => {
            if (typeof gsap === "undefined") return;

            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.35)"
            });

            if (cursor) {
                cursor.classList.remove("magnetic");
            }
        });
    });
}

bindMagneticElements();

/* =========================================================
MOUSE LIGHT
========================================================= */

if (mouseLight && !isTouchDevice && typeof gsap !== "undefined") {
    window.addEventListener("mousemove", (event) => {
        gsap.to(mouseLight, {
            x: event.clientX,
            y: event.clientY,
            duration: 0.5,
            ease: "power3.out"
        });
    });
}

/* =========================================================
LENIS SMOOTH SCROLL
========================================================= */

if (typeof Lenis !== "undefined" && !isTouchDevice) {
    lenis = new Lenis({
        duration: 1.15,
        easing: (t) =>
            Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);
    }
}

/* =========================================================
SMOOTH ANCHOR LINKS
========================================================= */

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetID = link.getAttribute("href");

        if (!targetID || targetID === "#") {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(targetID);

        if (!target) return;

        event.preventDefault();

        if (menuOpen) {
            closeMenu();
        }

        if (lenis) {
            lenis.scrollTo(target, {
                duration: 1.2,
                offset: 0
            });
        } else if (
            typeof gsap !== "undefined" &&
            typeof ScrollToPlugin !== "undefined"
        ) {
            gsap.to(window, {
                scrollTo: target,
                duration: 1,
                ease: "power3.inOut"
            });
        } else {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

/* =========================================================
SCROLL PROGRESS + NAVBAR STATE
========================================================= */

function updateScrollProgress() {
    const scrollTop = window.scrollY;

    const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    if (scrollProgress) {
        scrollProgress.style.transform = `scaleX(${progress})`;
    }

    if (navbar) {
        if (scrollTop > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }
}

window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();

/* =========================================================
CATEGORY PROJECT DATA
========================================================= */

const categoryProjects = {
    built: [
        {
            title: "Courtyard House",
            desc: "A residential space shaped around light, shade, and internal openness.",
            meta1: "Built Space",
            meta2: "Residence",
            image: "assets/images/built1.jpg",
            video: "assets/videos/built1-preview.mp4",
            link: "projects/courtyard-house.html"
        },
        {
            title: "Stone Pavilion",
            desc: "A quiet pavilion exploring mass, shadow, and landscape presence.",
            meta1: "Built Space",
            meta2: "Pavilion",
            image: "assets/images/built2.jpg",
            video: "assets/videos/built2-preview.mp4",
            link: "projects/stone-pavilion.html"
        },
        {
            title: "Brick Residence",
            desc: "A material study using brick, texture, and climate-conscious planning.",
            meta1: "Built Space",
            meta2: "Material Study",
            image: "assets/images/built3.jpg",
            video: "assets/videos/built3-preview.mp4",
            link: "projects/brick-residence.html"
        },
        {
            title: "Earth Court",
            desc: "A grounded spatial composition using earth tones and open courtyards.",
            meta1: "Built Space",
            meta2: "Climate Responsive",
            image: "assets/images/built4.jpg",
            video: "assets/videos/built4-preview.mp4",
            link: "projects/earth-court.html"
        },
        {
            title: "Hill Retreat",
            desc: "A retreat imagined as an extension of terrain, slope, and silence.",
            meta1: "Built Space",
            meta2: "Retreat",
            image: "assets/images/built5.jpg",
            video: "assets/videos/built5-preview.mp4",
            link: "projects/hill-retreat.html"
        },
        {
            title: "Light House",
            desc: "A residence designed around soft daylight, thresholds, and pause.",
            meta1: "Built Space",
            meta2: "Light Study",
            image: "assets/images/built6.jpg",
            video: "assets/videos/built6-preview.mp4",
            link: "projects/light-house.html"
        }
    ],

    interiors: [
        {
            title: "Zen Lounge",
            desc: "A calm interior study exploring silence, material softness, and warm light.",
            meta1: "Interiors",
            meta2: "Lounge",
            image: "assets/images/interior1.jpg",
            video: "assets/videos/interior1-preview.mp4",
            link: "projects/zen-lounge.html"
        },
        {
            title: "Material House",
            desc: "An interior atmosphere composed through texture, shadow, and restraint.",
            meta1: "Interiors",
            meta2: "Texture Study",
            image: "assets/images/interior2.jpg",
            video: "assets/videos/interior2-preview.mp4",
            link: "projects/material-house.html"
        },
        {
            title: "Concrete Room",
            desc: "A minimal space shaped through concrete, silence, and controlled light.",
            meta1: "Interiors",
            meta2: "Concrete",
            image: "assets/images/interior3.jpg",
            video: "assets/videos/interior3-preview.mp4",
            link: "projects/concrete-room.html"
        },
        {
            title: "Cafe Space",
            desc: "A hospitality interior designed around social warmth and spatial rhythm.",
            meta1: "Interiors",
            meta2: "Cafe",
            image: "assets/images/interior4.jpg",
            video: "assets/videos/interior4-preview.mp4",
            link: "projects/cafe-space.html"
        },
        {
            title: "Wood Retreat",
            desc: "A warm interior concept using wood, amber light, and quiet surfaces.",
            meta1: "Interiors",
            meta2: "Warm Space",
            image: "assets/images/interior5.jpg",
            video: "assets/videos/interior5-preview.mp4",
            link: "projects/wood-retreat.html"
        },
        {
            title: "Studio Space",
            desc: "A workspace designed for focused making, display, and creative thinking.",
            meta1: "Interiors",
            meta2: "Workspace",
            image: "assets/images/interior6.jpg",
            video: "assets/videos/interior6-preview.mp4",
            link: "projects/studio-space.html"
        }
    ],

    urban: [
        {
            title: "Freight Network",
            desc: "A study of goods movement, logistics patterns, and urban friction.",
            meta1: "Urban Systems",
            meta2: "Freight",
            image: "assets/images/urban1.jpg",
            video: "assets/videos/urban1-preview.mp4",
            link: "projects/freight-network.html"
        },
        {
            title: "Public Flow",
            desc: "Mapping pedestrian movement and public activity across urban thresholds.",
            meta1: "Urban Systems",
            meta2: "Movement",
            image: "assets/images/urban2.jpg",
            video: "assets/videos/urban2-preview.mp4",
            link: "projects/public-flow.html"
        },
        {
            title: "River Edge",
            desc: "A waterfront study exploring edges, rituals, ecology, and pause.",
            meta1: "Urban Systems",
            meta2: "Waterfront",
            image: "assets/images/urban3.jpg",
            video: "assets/videos/urban3-preview.mp4",
            link: "projects/river-edge.html"
        },
        {
            title: "Pilgrimage Routes",
            desc: "A layered study of cultural movement, routes, and sacred urban memory.",
            meta1: "Urban Systems",
            meta2: "Culture",
            image: "assets/images/urban4.jpg",
            video: "assets/videos/urban4-preview.mp4",
            link: "projects/pilgrimage-routes.html"
        },
        {
            title: "Market System",
            desc: "A public realm study around trade, gathering, and everyday exchange.",
            meta1: "Urban Systems",
            meta2: "Market",
            image: "assets/images/urban5.jpg",
            video: "assets/videos/urban5-preview.mp4",
            link: "projects/market-system.html"
        },
        {
            title: "Mobility Layers",
            desc: "A transit observation study mapping overlaps between movement systems.",
            meta1: "Urban Systems",
            meta2: "Transit",
            image: "assets/images/urban6.jpg",
            video: "assets/videos/urban6-preview.mp4",
            link: "projects/mobility-layers.html"
        }
    ],

    research: [
        {
            title: "Feeding Cities",
            desc: "A research project on agritecture and the role of food systems in cities.",
            meta1: "Research",
            meta2: "Agritecture",
            image: "assets/images/research1.jpg",
            video: "assets/videos/research1-preview.mp4",
            link: "projects/feeding-cities.html"
        },
        {
            title: "Heritage Evolution",
            desc: "A study of adaptive reuse, memory, and the future of inherited spaces.",
            meta1: "Research",
            meta2: "Heritage",
            image: "assets/images/research2.jpg",
            video: "assets/videos/research2-preview.mp4",
            link: "projects/heritage-evolution.html"
        },
        {
            title: "Climate Mapping",
            desc: "Environmental mapping for heat, wind, water, and urban comfort.",
            meta1: "Research",
            meta2: "Climate",
            image: "assets/images/research3.jpg",
            video: "assets/videos/research3-preview.mp4",
            link: "projects/climate-mapping.html"
        },
        {
            title: "Material Intelligence",
            desc: "A construction logic study of material behavior and architectural expression.",
            meta1: "Research",
            meta2: "Material",
            image: "assets/images/research4.jpg",
            video: "assets/videos/research4-preview.mp4",
            link: "projects/material-intelligence.html"
        },
        {
            title: "Rural Housing Systems",
            desc: "Exploring affordable housing models and social infrastructure.",
            meta1: "Research",
            meta2: "Housing",
            image: "assets/images/research5.jpg",
            video: "assets/videos/research5-preview.mp4",
            link: "projects/rural-housing.html"
        },
        {
            title: "Water Urbanism",
            desc: "A study of water, ecology, settlement, and urban resilience.",
            meta1: "Research",
            meta2: "Ecology",
            image: "assets/images/research6.jpg",
            video: "assets/videos/research6-preview.mp4",
            link: "projects/water-urbanism.html"
        }
    ],

    visual: [
        {
            title: "Anantam",
            desc: "A slow-burn psychological visual narrative around time, routine, and repetition.",
            meta1: "Visual Narrative",
            meta2: "Film",
            image: "assets/images/visual1.jpg",
            video: "assets/videos/visual1-preview.mp4",
            link: "projects/anantam.html"
        },
        {
            title: "Spatial Film Frames",
            desc: "A cinematic study of architecture through framing, shadow, and movement.",
            meta1: "Visual Narrative",
            meta2: "Frames",
            image: "assets/images/visual2.jpg",
            video: "assets/videos/visual2-preview.mp4",
            link: "projects/spatial-film.html"
        },
        {
            title: "Light Study",
            desc: "Atmospheric visual experiments exploring light as spatial material.",
            meta1: "Visual Narrative",
            meta2: "Lighting",
            image: "assets/images/visual3.jpg",
            video: "assets/videos/visual3-preview.mp4",
            link: "projects/light-study.html"
        },
        {
            title: "Surreal Space",
            desc: "Experimental spatial imagery between architecture, dream, and fiction.",
            meta1: "Visual Narrative",
            meta2: "Surreal",
            image: "assets/images/visual4.jpg",
            video: "assets/videos/visual4-preview.mp4",
            link: "projects/surreal-space.html"
        },
        {
            title: "Floating City",
            desc: "A speculative future urban fiction built through atmosphere and scale.",
            meta1: "Visual Narrative",
            meta2: "Future City",
            image: "assets/images/visual5.jpg",
            video: "assets/videos/visual5-preview.mp4",
            link: "projects/floating-city.html"
        },
        {
            title: "Digital Frames",
            desc: "Visual experiments in digital atmosphere, composition, and motion.",
            meta1: "Visual Narrative",
            meta2: "Digital",
            image: "assets/images/visual6.jpg",
            video: "assets/videos/visual6-preview.mp4",
            link: "projects/digital-frames.html"
        }
    ],

    concept: [
        {
            title: "Shell Hospital",
            desc: "A healing space inspired by shell growth, circular forms, and organic calmness.",
            meta1: "Conceptual",
            meta2: "Hospital",
            image: "assets/images/concept1.jpg",
            video: "assets/videos/concept1-preview.mp4",
            link: "projects/shell-hospital.html"
        },
        {
            title: "Floating Pavilion",
            desc: "A speculative pavilion designed as a hovering spatial pause.",
            meta1: "Conceptual",
            meta2: "Pavilion",
            image: "assets/images/concept2.jpg",
            video: "assets/videos/concept2-preview.mp4",
            link: "projects/floating-pavilion.html"
        },
        {
            title: "Meditation Core",
            desc: "A spiritual geometry study centered on silence, void, and inner movement.",
            meta1: "Conceptual",
            meta2: "Meditation",
            image: "assets/images/concept3.jpg",
            video: "assets/videos/concept3-preview.mp4",
            link: "projects/meditation-core.html"
        },
        {
            title: "Flower Admin",
            desc: "An entry experience inspired by flower petals and wing-like forms.",
            meta1: "Conceptual",
            meta2: "Admin",
            image: "assets/images/concept4.jpg",
            video: "assets/videos/concept4-preview.mp4",
            link: "projects/flower-admin.html"
        },
        {
            title: "Bird Wing Space",
            desc: "A linear overlapping form study inspired by wings and movement.",
            meta1: "Conceptual",
            meta2: "Form Study",
            image: "assets/images/concept5.jpg",
            video: "assets/videos/concept5-preview.mp4",
            link: "projects/bird-wing-space.html"
        },
        {
            title: "Hobbit Residence",
            desc: "A hill studio apartment concept inspired by earth, shelter, and Vastu grids.",
            meta1: "Conceptual",
            meta2: "Residence",
            image: "assets/images/concept6.jpg",
            video: "assets/videos/concept6-preview.mp4",
            link: "projects/hobbit-residence.html"
        }
    ],

    live: [
        {
            title: "Live Residence 01",
            desc: "An ongoing residential project exploring family life and spatial comfort.",
            meta1: "Live Project",
            meta2: "Residence",
            image: "assets/images/live1.jpg",
            video: "assets/videos/live1-preview.mp4",
            link: "projects/live-residence-01.html"
        },
        {
            title: "Live Interior 01",
            desc: "An interior development project focused on practical calmness and detail.",
            meta1: "Live Project",
            meta2: "Interior",
            image: "assets/images/live2.jpg",
            video: "assets/videos/live2-preview.mp4",
            link: "projects/live-interior-01.html"
        },
        {
            title: "Site Study 01",
            desc: "A documentation-based study of site conditions, movement, and constraints.",
            meta1: "Live Project",
            meta2: "Site",
            image: "assets/images/live3.jpg",
            video: "assets/videos/live3-preview.mp4",
            link: "projects/site-study-01.html"
        },
        {
            title: "Client Concept 01",
            desc: "A proposal-stage design exploring client needs and atmospheric identity.",
            meta1: "Live Project",
            meta2: "Concept",
            image: "assets/images/live4.jpg",
            video: "assets/videos/live4-preview.mp4",
            link: "projects/client-concept-01.html"
        },
        {
            title: "Material Board",
            desc: "A material selection study for texture, tone, and interior character.",
            meta1: "Live Project",
            meta2: "Material",
            image: "assets/images/live5.jpg",
            video: "assets/videos/live5-preview.mp4",
            link: "projects/material-board.html"
        },
        {
            title: "Studio Process",
            desc: "Behind-the-work documentation of sketches, revisions, and decisions.",
            meta1: "Live Project",
            meta2: "Process",
            image: "assets/images/live6.jpg",
            video: "assets/videos/live6-preview.mp4",
            link: "projects/studio-process.html"
        }
    ],

    studio: [
        {
            title: "Studio Identity",
            desc: "Answer & Co as a spatial, visual, and narrative design identity.",
            meta1: "Answer & Co",
            meta2: "Identity",
            image: "assets/images/studio1.jpg",
            video: "assets/videos/studio1-preview.mp4",
            link: "projects/answer-studio.html"
        },
        {
            title: "Answer Residence",
            desc: "A studio-led interior atmosphere exploring softness, light, and warmth.",
            meta1: "Answer & Co",
            meta2: "Residence",
            image: "assets/images/studio2.jpg",
            video: "assets/videos/studio2-preview.mp4",
            link: "projects/answer-residence.html"
        },
        {
            title: "Material Archive",
            desc: "A curated library of textures, surfaces, finishes, and mood systems.",
            meta1: "Answer & Co",
            meta2: "Materials",
            image: "assets/images/studio3.jpg",
            video: "assets/videos/studio3-preview.mp4",
            link: "projects/answer-materials.html"
        },
        {
            title: "Visual Systems",
            desc: "Cinematic design language for representation, branding, and storytelling.",
            meta1: "Answer & Co",
            meta2: "Visual",
            image: "assets/images/studio4.jpg",
            video: "assets/videos/studio4-preview.mp4",
            link: "projects/answer-visuals.html"
        },
        {
            title: "Studio Process",
            desc: "Sketches, references, iterations, and behind-the-scenes thinking.",
            meta1: "Answer & Co",
            meta2: "Process",
            image: "assets/images/studio5.jpg",
            video: "assets/videos/studio5-preview.mp4",
            link: "projects/answer-process.html"
        },
        {
            title: "Spatial Experiments",
            desc: "Experimental compositions testing atmosphere, form, and perception.",
            meta1: "Answer & Co",
            meta2: "Experiment",
            image: "assets/images/studio6.jpg",
            video: "assets/videos/studio6-preview.mp4",
            link: "projects/answer-experiments.html"
        }
    ]
};

const deployAssetPools = {
    built: {
        images: [
            "assets/images/built1.jpg",
            "assets/images/built2.jpg",
            "assets/images/built3.jpg",
            "assets/images/built4.jpg",
            "assets/images/built5.jpg",
            "assets/images/built6.jpg"
        ],
        videos: [
            "assets/videos/built1-preview.mp4",
            "assets/videos/built2-preview.mp4"
        ]
    },
    interiors: {
        images: [
            "assets/images/project1.JPG",
            "assets/images/project2.JPG",
            "assets/images/project3.jpg"
        ],
        videos: [
            "assets/videos/interior1-preview.mp4",
            "assets/videos/hero.mp4"
        ]
    },
    urban: {
        images: [
            "assets/images/built1.jpg",
            "assets/images/built2.jpg",
            "assets/images/built3.jpg"
        ],
        videos: [
            "assets/videos/hero.mp4",
            "assets/videos/built1-preview.mp4"
        ]
    },
    research: {
        images: [
            "assets/images/built4.jpg",
            "assets/images/built5.jpg",
            "assets/images/built6.jpg"
        ],
        videos: [
            "assets/videos/built1-preview.mp4",
            "assets/videos/built2-preview.mp4"
        ]
    },
    visual: {
        images: [
            "assets/images/project3.jpg",
            "assets/images/menu-work.jpg",
            "assets/images/menu-studio.jpg"
        ],
        videos: [
            "assets/videos/built2-preview.mp4",
            "assets/videos/interior1-preview.mp4"
        ]
    },
    concept: {
        images: [
            "assets/images/project1.JPG",
            "assets/images/project2.JPG",
            "assets/images/built1.jpg"
        ],
        videos: [
            "assets/videos/interior1-preview.mp4",
            "assets/videos/hero.mp4"
        ]
    },
    live: {
        images: [
            "assets/images/menu-home.jpg",
            "assets/images/menu-about.jpg",
            "assets/images/menu-contact.jpg"
        ],
        videos: [
            "assets/videos/hero.mp4",
            "assets/videos/built1-preview.mp4"
        ]
    },
    studio: {
        images: [
            "assets/images/portrait.jpg",
            "assets/images/menu-studio.jpg",
            "assets/images/project2.JPG"
        ],
        videos: [
            "assets/videos/built1-preview.mp4",
            "assets/videos/interior1-preview.mp4"
        ]
    }
};

Object.entries(categoryProjects).forEach(([category, projects]) => {
    const pool = deployAssetPools[category];

    if (!pool) return;

    projects.forEach((project, index) => {
        project.image = pool.images[index % pool.images.length];
        project.video = pool.videos[index % pool.videos.length];
    });
});

/* =========================================================
PROJECT CARD CREATION
========================================================= */

function createProjectCard(project, index) {
    return `
        <article class="project-item">
            <a href="${project.link}" class="project-link" data-transition data-cursor="ENTER">

                <div class="project-image-wrap project-cover">

                    <img src="${project.image}" alt="${project.title}" class="project-poster">

                    <video class="project-hover-video" muted loop playsinline preload="metadata">
                        <source src="${project.video}" type="video/mp4">
                    </video>

                    <span class="project-floating-index">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <div class="project-hover-overlay"></div>
                    <div class="project-film-frame"></div>

                    <div class="drag-indicator">
                        Enter
                    </div>

                </div>

                <div class="project-info">

                    <span class="project-index">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>${project.title}</h3>

                    <p>${project.desc}</p>

                    <div class="project-meta">
                        <span>${project.meta1}</span>
                        <span>${project.meta2}</span>
                    </div>

                </div>

            </a>
        </article>
    `;
}

/* =========================================================
RENDER CATEGORY PROJECTS
========================================================= */

function renderCategoryProjects(category) {
    if (!projectGrid || !categoryProjects[category]) return;

    projectGrid.innerHTML = categoryProjects[category]
        .map((project, index) => createProjectCard(project, index))
        .join("");

    bindRenderedProjectInteractions();
    bindGeneralCursorTargets();
    bindMagneticElements(projectGrid);
    bindRenderedTransitionLinks();
    initImageLoadedState();

    if (typeof gsap !== "undefined") {
        gsap.fromTo(
            projectGrid.querySelectorAll(".project-item"),
            {
                opacity: 0,
                y: 50,
                scale: 0.97
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: "power3.out"
            }
        );
    }

    if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);
    }
}

/* =========================================================
PROJECT INTERACTIONS
========================================================= */

function bindRenderedProjectInteractions() {
    if (!projectGrid) return;

    const renderedProjects = projectGrid.querySelectorAll(".project-item");

    renderedProjects.forEach((card) => {
        const video = card.querySelector(".project-hover-video");
        const poster = card.querySelector(".project-poster");

        if (video) {
            video.pause();
            video.currentTime = 0;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
        }

        card.addEventListener("mouseenter", () => {
            if (cursor && !isTouchDevice) {
                cursor.classList.add("active-project");

                if (cursorLabel) {
                    cursorLabel.textContent = "ENTER";
                }
            }

            if (video) {
                video.currentTime = 0;
                video.play().catch(() => {});
            }

            if (videoCursorPreview && cursorPreviewVideo && video && !isTouchDevice) {
                const source = video.querySelector("source");

                if (source) {
                    cursorPreviewVideo.src = source.src;
                    cursorPreviewVideo.currentTime = 0;
                    cursorPreviewVideo.play().catch(() => {});
                }

                videoCursorPreview.classList.add("active");

                if (typeof gsap !== "undefined") {
                    gsap.to(videoCursorPreview, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.35,
                        ease: "power3.out"
                    });
                }
            }
        });

        card.addEventListener("mouseleave", () => {
            if (cursor && !isTouchDevice) {
                cursor.classList.remove("active-project", "magnetic");

                if (cursorLabel) {
                    cursorLabel.textContent = selectedArchitectCursor
                        ? selectedArchitectCursor.architect.split(" ").at(-1).toUpperCase()
                        : "";
                }
            }

            if (video) {
                video.pause();
                video.currentTime = 0;
            }

            if (videoCursorPreview && cursorPreviewVideo && typeof gsap !== "undefined") {
                gsap.to(videoCursorPreview, {
                    opacity: 0,
                    scale: 0.92,
                    duration: 0.35,
                    ease: "power3.out",
                    onComplete: () => {
                        videoCursorPreview.classList.remove("active");
                        cursorPreviewVideo.pause();
                        cursorPreviewVideo.removeAttribute("src");
                        cursorPreviewVideo.load();
                    }
                });
            }

            if (typeof gsap !== "undefined") {
                if (poster) {
                    gsap.to(poster, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "power4.out"
                    });
                }

                if (video) {
                    gsap.to(video, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "power4.out"
                    });
                }
            }
        });

        card.addEventListener("mousemove", (event) => {
            if (typeof gsap === "undefined" || isTouchDevice) return;

            const rect = card.getBoundingClientRect();

            const x =
                ((event.clientX - rect.left) / rect.width - 0.5) * 18;

            const y =
                ((event.clientY - rect.top) / rect.height - 0.5) * 18;

            if (poster) {
                gsap.to(poster, {
                    x,
                    y,
                    scale: 1.08,
                    duration: 0.7,
                    ease: "power3.out"
                });
            }

            if (video) {
                gsap.to(video, {
                    x,
                    y,
                    scale: 1.06,
                    duration: 0.7,
                    ease: "power3.out"
                });
            }
        });
    });
}

/* =========================================================
CATEGORY TAB CLICK
========================================================= */

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.dataset.filter;

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        document.querySelectorAll(".project-hover-video").forEach((video) => {
            video.pause();
            video.currentTime = 0;
        });

        renderCategoryProjects(category);
    });
});

/* =========================================================
PAGE TRANSITIONS
========================================================= */

function isInternalPageLink(link) {
    const href = link.getAttribute("href");

    if (!href) return false;
    if (href.startsWith("#")) return false;
    if (href.startsWith("mailto:")) return false;
    if (href.startsWith("tel:")) return false;
    if (href.startsWith("https://wa.me")) return false;
    if (link.target === "_blank") return false;

    return true;
}

function bindRenderedTransitionLinks() {
    const renderedLinks = projectGrid
        ? projectGrid.querySelectorAll("[data-transition]")
        : [];

    renderedLinks.forEach((link) => {
        if (link.dataset.transitionBound === "true") return;

        link.dataset.transitionBound = "true";

        link.addEventListener("click", (event) => {
            if (!isInternalPageLink(link)) return;

            event.preventDefault();

            const href = link.getAttribute("href");

            document.querySelectorAll(".project-hover-video").forEach((video) => {
                video.pause();
                video.currentTime = 0;
            });

            if (!transitionOverlay || typeof gsap === "undefined") {
                window.location.href = href;
                return;
            }

            gsap.set(transitionOverlay, {
                y: "100%",
                visibility: "visible"
            });

            gsap.to(transitionOverlay, {
                y: "0%",
                duration: 0.9,
                ease: "power4.inOut",
                onComplete: () => {
                    window.location.href = href;
                }
            });
        });
    });
}

window.addEventListener("pageshow", () => {
    if (!transitionOverlay || typeof gsap === "undefined") return;

    gsap.set(transitionOverlay, {
        y: "0%",
        visibility: "visible"
    });

    gsap.to(transitionOverlay, {
        y: "-100%",
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
            gsap.set(transitionOverlay, {
                visibility: "hidden",
                y: "100%"
            });
        }
    });
});

/* =========================================================
ARCHITECT IDENTITY CARD
Matches the random cursor architect
========================================================= */

const identityBubble = document.querySelector(".identity-bubble");
const identityName = document.querySelector(".identity-name");
const identityMeta = document.querySelector(".identity-meta");

if (selectedArchitectCursor) {
    if (identityName) {
        identityName.textContent = selectedArchitectCursor.architect;
    }

    if (identityMeta) {
        identityMeta.textContent = selectedArchitectCursor.meta;
    }
}

if (identityBubble && !isTouchDevice) {
    let identityX = window.innerWidth / 2 + 82;
    let identityY = window.innerHeight / 2 - 22;

    function positionIdentityBubble(event) {
        identityX = Math.min(event.clientX + 82, window.innerWidth - 292);
        identityY = Math.min(event.clientY - 22, window.innerHeight - 116);

        identityX = Math.max(identityX, 18);
        identityY = Math.max(identityY, 18);

        if (typeof gsap !== "undefined") {
            gsap.to(identityBubble, {
                x: identityX,
                y: identityY,
                opacity: 1,
                duration: 0.28,
                ease: "power3.out"
            });
        } else {
            identityBubble.style.transform =
                `translate3d(${identityX}px, ${identityY}px, 0)`;
            identityBubble.style.opacity = "1";
        }

        identityBubble.classList.add("active");
    }

    window.addEventListener("mousemove", positionIdentityBubble);

    document.addEventListener("mouseleave", () => {
        identityBubble.classList.remove("active");
    });

    document.addEventListener("mouseenter", () => {
        identityBubble.classList.add("active");
    });
}

/* =========================================================
SCROLL ANIMATIONS
========================================================= */

function initScrollAnimations() {
    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) return;

    gsap.to("#bg-video", {
        scale: 1.14,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".hero-content", {
        y: -120,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.from(".about-left", {
        y: 90,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 78%"
        }
    });

    gsap.from(".about-right", {
        y: 90,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 78%"
        }
    });

    gsap.from(".about-tags span", {
        y: 24,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".about-tags",
            start: "top 90%"
        }
    });

    gsap.from(".studio-left, .studio-right", {
        y: 90,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".studio-section",
            start: "top 75%"
        }
    });

    gsap.from(".studio-stat", {
        y: 50,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".studio-stats",
            start: "top 88%"
        }
    });

    gsap.from(".quote-line, .quote-author", {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".quote-section",
            start: "top 82%"
        }
    });

    gsap.from(".contact-left", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 78%"
        }
    });

    gsap.from(".contact-card", {
        y: 70,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".contact-right",
            start: "top 85%"
        }
    });

    gsap.from(".final-type-section h1", {
        y: 120,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".final-type-section",
            start: "top 80%"
        }
    });

    gsap.to(".experience-track", {
        xPercent: -25,
        ease: "none",
        scrollTrigger: {
            trigger: ".experience-strip",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".studio-video", {
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
            trigger: ".studio-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
}

/* =========================================================
GALLERY MODAL
========================================================= */

function closeGalleryModal() {
    if (!galleryModal) return;

    galleryModal.classList.remove("active");
    body.classList.remove("modal-open");

    if (lenis) {
        lenis.start();
    }
}

if (closeGallery) {
    closeGallery.addEventListener("click", closeGalleryModal);
}

if (galleryModal) {
    galleryModal.addEventListener("click", (event) => {
        if (event.target === galleryModal) {
            closeGalleryModal();
        }
    });
}

/* =========================================================
IMAGE LOADED STATE
========================================================= */

function initImageLoadedState() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
        if (!img.hasAttribute("loading")) {
            img.setAttribute("loading", "lazy");
        }

        if (img.complete) {
            img.classList.add("loaded");
        } else {
            img.addEventListener("load", () => {
                img.classList.add("loaded");
            });
        }
    });
}

/* =========================================================
KEYBOARD / ESCAPE SUPPORT
========================================================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
        body.classList.add("keyboard-user");
    }

    if (event.key === "Escape") {
        if (menuOpen) {
            closeMenu();
        }

        closeGalleryModal();
        hideAudioPanel();
    }
});

document.addEventListener("mousedown", () => {
    body.classList.remove("keyboard-user");
});

/* =========================================================
EXTERNAL LINK SECURITY
========================================================= */

document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
});

/* =========================================================
RESIZE REFRESH
========================================================= */

let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
        }

        if (lenis && typeof lenis.resize === "function") {
            lenis.resize();
        }
    }, 300);
});

/* =========================================================
PAGE VISIBILITY
========================================================= */

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        document.querySelectorAll(".project-hover-video").forEach((video) => {
            video.pause();
        });

        if (cursorPreviewVideo) {
            cursorPreviewVideo.pause();
        }

        if (ambientAudio && audioEnabled) {
            fadeAudioTo(0.02, 0.4);
        }
    } else {
        if (ambientAudio && audioEnabled) {
            fadeAudioTo(getSavedAmbientVolume(), 0.4);
        }
    }
});

/* =========================================================
REDUCED MOTION
========================================================= */

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
    body.classList.add("reduced-motion");

    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    }

    if (typeof gsap !== "undefined") {
        gsap.globalTimeline.clear();
    }
}

/* =========================================================
FINAL INIT
========================================================= */

window.addEventListener("load", () => {
    renderCategoryProjects("built");
    initImageLoadedState();
    initScrollAnimations();

    setTimeout(() => {
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
        }
    }, 800);

    body.classList.add("loaded");

    console.log(`
KASHIF MOHAMMED PORTFOLIO
Icon-only architect cursor + matching identity card loaded.
`);
});
