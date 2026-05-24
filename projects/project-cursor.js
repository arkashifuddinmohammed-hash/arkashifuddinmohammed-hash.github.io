(function () {
    const cursor = document.querySelector(".project-cursor");
    const icon = document.querySelector(".project-cursor-icon");
    const label = document.querySelector(".project-cursor-label");
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (!cursor || isTouchDevice) {
        document.body.classList.add("native-cursor");
        return;
    }

    const architectIcons = ["▦", "▥", "▧", "▤", "◫", "▣", "◩", "◧"];
    const lastIndex = Number(localStorage.getItem("last-project-cursor-icon"));
    let iconIndex = Math.floor(Math.random() * architectIcons.length);

    if (!Number.isNaN(lastIndex) && architectIcons.length > 1) {
        while (iconIndex === lastIndex) {
            iconIndex = Math.floor(Math.random() * architectIcons.length);
        }
    }

    localStorage.setItem("last-project-cursor-icon", String(iconIndex));
    icon.textContent = architectIcons[iconIndex];

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    function render() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        requestAnimationFrame(render);
    }

    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursor.style.opacity = "1";
    });

    window.addEventListener("mousedown", () => cursor.classList.add("cursor-down"));
    window.addEventListener("mouseup", () => cursor.classList.remove("cursor-down"));
    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
    });

    document.querySelectorAll("a, button, [data-cursor]").forEach((target) => {
        target.addEventListener("mouseenter", () => {
            cursor.classList.add("active-link");
            label.textContent = target.dataset.cursor || target.getAttribute("aria-label") || "Open";
        });

        target.addEventListener("mouseleave", () => {
            cursor.classList.remove("active-link");
            label.textContent = "";
        });
    });

    render();
})();
