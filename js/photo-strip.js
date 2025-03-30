document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("photoCanvas");
    const ctx = canvas.getContext("2d");
    const downloadBtn = document.getElementById("downloadBtn");
    const styleButtons = document.querySelectorAll(".style-btn");
    const restartBtn = document.getElementById("restartBtn");

    const photos = JSON.parse(localStorage.getItem("capturedPhotos")) || [];
    if (!photos.length) {
        alert("No photos found! Please take photos first.");
        window.location.href = "index.html";
        return;
    }

    const CONFIG = {
        scaledWidth: 250,
        spacing: 15,
        padding: { top: 20, bottom: 50, sides: 20 },
        defaultStyle: "candy"
    };

    let selectedStyle = CONFIG.defaultStyle;
    let loadedImages = [];
    let overlayImage = new Image();

    const frameImages = {
        candy: "images/candy-frame.png",
        scape: "images/dreamscape-frame.png",
        beatbox: "images/beatbox-frame.png",
        istj: "images/istj-frame.png"
    };

    function preloadImages(photoSrcArray, callback) {
        let loadedCount = 0;
        loadedImages = [];

        photoSrcArray.forEach((photoSrc, index) => {
            const img = new Image();
            img.src = photoSrc;

            img.onload = () => {
                loadedImages[index] = img;
                loadedCount++;
                console.log(`Loaded image ${index + 1}/${photoSrcArray.length}`);

                if (loadedCount === photoSrcArray.length) {
                    callback();
                }
            };

            img.onerror = () => console.error(`Failed to load image: ${photoSrc}`);
        });
    }

    function loadFrameImage(style, callback) {
        overlayImage.src = frameImages[style] || "";
        
        overlayImage.onload = () => {
            console.log(`Overlay loaded: ${overlayImage.src}`);
            callback();
        };

        overlayImage.onerror = () => console.error(`Failed to load overlay: ${overlayImage.src}`);
    }

    function drawPhotoStrip(callback) {
        console.log("Drawing photo strip...");
        ctx.save(); 
        ctx.scale(2, 2);  // Adjust for high-resolution canvas

        applyBackgroundStyle(selectedStyle);
        drawPhotos();

        if (overlayImage.complete && overlayImage.naturalHeight !== 0) {
            ctx.drawImage(overlayImage, 0, 0, canvas.width / 2, canvas.height / 2); // Adjust overlay scale
        } else {
            console.warn("Overlay image not fully loaded, retrying...");
            setTimeout(() => drawPhotoStrip(callback), 100);
        }

        ctx.restore(); // Reset transformation
        if (callback) callback();
    }

    function applyBackgroundStyle(style) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const styles = {
            candy: "#FFC80B",
            scape: "#000000",
            beatbox: "#00DAFF",
            istj: "#1A1A1A"
        };

        ctx.fillStyle = styles[style] || "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (style === "candy" || style === "beatbox") drawDots();
        drawCopyright();
    }

    function drawDots() {
        for (let i = 0; i < 100; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }
    }

    function drawCopyright() {
        ctx.font = "9px Tahoma";
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        ctx.fillText("© 2025 BE", canvas.width - 14, canvas.height - 10);
    }

    function drawPhotos() {
        let yOffset = CONFIG.padding.top;
        loadedImages.forEach(img => {
            const scaleFactor = CONFIG.scaledWidth / img.width;
            const scaledHeight = img.height * scaleFactor;
            ctx.drawImage(img, CONFIG.padding.sides, yOffset, CONFIG.scaledWidth - CONFIG.padding.sides, scaledHeight);
            yOffset += scaledHeight + CONFIG.spacing;
        });
    }

    styleButtons.forEach(button => {
        button.removeEventListener("click", changeStyleHandler); // Remove previous listener
        button.addEventListener("click", changeStyleHandler);
    });

    function changeStyleHandler(e) {
        selectedStyle = e.target.dataset.style;
        loadFrameImage(selectedStyle, () => drawPhotoStrip());
    }

    downloadBtn.addEventListener("click", () => {
        console.log("Download button clicked.");

        drawPhotoStrip(() => {
            console.log("Triggering download...");
            setTimeout(() => {
                const link = document.createElement("a");
                link.download = "photobooth-be.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
            }, 200);
        });
    });

    restartBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    preloadImages(photos, () => {
        if (loadedImages.length > 0) {
            const scaleFactor = CONFIG.scaledWidth / loadedImages[0].width;
            const scaledHeight = loadedImages[0].height * scaleFactor;
            const totalHeight = (scaledHeight + CONFIG.spacing) * photos.length - CONFIG.spacing;
            const canvasHeight = totalHeight + CONFIG.padding.top + CONFIG.padding.bottom;

            canvas.width = CONFIG.scaledWidth * 2 + CONFIG.padding.sides * 2;  // 2x resolution for better quality
            canvas.height = canvasHeight * 2; // 2x resolution for better quality

            console.log(`Canvas size set: ${canvas.width} x ${canvas.height}`);

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            loadFrameImage(CONFIG.defaultStyle, () => drawPhotoStrip());
        } else {
            console.error("No images loaded.");
        }
    });
});