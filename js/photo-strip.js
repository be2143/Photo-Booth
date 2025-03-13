document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("photoCanvas");
    const ctx = canvas.getContext("2d");
    const downloadBtn = document.getElementById("downloadBtn");
    const styleButtons = document.querySelectorAll(".style-btn");

    const photos = JSON.parse(localStorage.getItem("capturedPhotos")) || [];

    if (photos.length === 0) {
        alert("No photos found! Please take photos first.");
        window.location.href = "index.html";
        return;
    }

    const scaledWidth = 270; // New image width
    const spacing = 20;
    const paddingTop = 30;
    const paddingBottom = 70;
    const paddingSides = 30;

    let selectedStyle = "candy"; // Default style

    const img = new Image();
    img.src = photos[0];
    img.onload = () => {
        const scaleFactor = scaledWidth / img.width;
        const scaledHeight = img.height * scaleFactor;

        canvas.width = scaledWidth + paddingSides * 2;
        canvas.height = scaledHeight * photos.length + spacing * (photos.length - 1) + paddingTop + paddingBottom;

        drawPhotoStrip(scaledWidth, scaledHeight); // Initial draw
    };

    function drawPhotoStrip(newWidth, newHeight) {
        // Apply selected style first
        drawPhotos(newWidth, newHeight); // Now draw the photos (photos will be drawn after frame)
        applyBackgroundStyle(selectedStyle, newWidth, newHeight);
    }

    function applyBackgroundStyle(style, newWidth, newHeight) {
        switch (style) {
            case "candy":
                ctx.fillStyle = "#FFC80B"; // Candy yellow background
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw random small white dots
                for (let i = 0; i < 100; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const size = Math.random() * 3 + 1;

                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = "white";
                    ctx.fill();
                }

                // Now load and draw candy frame overlay (on top of the photos)
                // const candyFrame = new Image();
                // candyFrame.src = "images/candy-frame.png";
                // candyFrame.onload = () => {
                //     ctx.drawImage(candyFrame, 0, 0, canvas.width, canvas.height); // Draw the frame on top of the photos
                // };
                break;

            case "scape":
                ctx.fillStyle = "#1A1A1A";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // const scapeFrame = new Image();
                // scapeFrame.src = "images/dreamscape-frame.png";
                // scapeFrame.onload = () => {
                //     ctx.drawImage(scapeFrame, 0, 0, canvas.width, canvas.height); // Draw the frame on top of the photos
                // };
                break;

            case "beatbox":
                ctx.fillStyle = "#00DAFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw random small white dots
                for (let i = 0; i < 100; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const size = Math.random() * 3 + 1;

                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = "white";
                    ctx.fill();
                }

                // const beatboxFrame = new Image();
                // beatboxFrame.src = "images/beatbox-frame.png";
                // beatboxFrame.onload = () => {
                //     ctx.drawImage(beatboxFrame, 0, 0, canvas.width, canvas.height); // Draw the frame on top of the photos
                // };
                break;

            case "istj":
                // Base background color
                ctx.fillStyle = "#1A1A1A";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Film camera perforation effect (Left & Right)
                const perforationWidth = 3;  // Width of perforation
                const perforationHeight = 15; // Height of perforation
                const gap = 10;  // Space between perforations
                const padding = 10; // Distance from the frame edges

                ctx.fillStyle = "#FEAF28"; // Perforation color
                ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
                ctx.shadowBlur = 3;

                // Left & Right perforations only
                for (let y = padding; y + perforationHeight <= canvas.height - padding; y += perforationHeight + gap) {
                    ctx.fillRect(padding, y, perforationWidth, perforationHeight); // Left side
                    ctx.fillRect(canvas.width - padding - perforationWidth, y, perforationWidth, perforationHeight); // Right side
                }

                // Reset shadow for future drawing
                ctx.shadowBlur = 0;
                ctx.shadowColor = "transparent";
                // const istjFrame = new Image();
                // istjFrame.src = "images/istj-frame.png";
                // istjFrame.onload = () => {
                //     ctx.drawImage(istjFrame, 0, 0, canvas.width, canvas.height); // Draw the frame on top of the photos
                // };
                break;

        }
        // Copyright text
        const text = "© 2025 BE";
        ctx.font = "9px Tahoma"; // Set font
        ctx.fillStyle = "white"; // Set text color
        ctx.textAlign = "right"; // Align text to the right
        ctx.fillText(text, canvas.width - 14, canvas.height - 10); // Position it in the bottom right
    }

    function drawPhotos(newWidth, newHeight) {
        let yOffset = paddingTop;
        photos.forEach((photoSrc) => {
            const img = new Image();
            img.src = photoSrc;
            img.onload = () => {
                ctx.drawImage(img, paddingSides, yOffset, newWidth, newHeight); // Draw the image
                yOffset += newHeight + spacing;
            };
        });
    }

    // Listen for style button clicks
    styleButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            selectedStyle = e.target.dataset.style;
            drawPhotoStrip(scaledWidth, img.height * (scaledWidth / img.width)); // Redraw with selected style
        });
    });

    // Download photo strip
    downloadBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.download = "photo-strip.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});