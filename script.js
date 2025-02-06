document.addEventListener("DOMContentLoaded", function () {
    const imageFiles = [
        "cat.jpg", "image2.jpg", "image3.jpg", "image4.jpg",
        "image5.jpg", "image6.jpg", "image7.jpg", "image8.jpg",
        "image9.jpg", "image10.jpg", "image11.jpg", "image12.jpg"
    ];

    const comments = [
        "Beautiful sunrise", "Peaceful lake", "Mountain view", "City skyline",
        "Autumn leaves", "Snowy forest", "Desert dunes", "Ocean waves",
        "Countryside road", "Cherry blossoms", "Rainy night", "Northern lights"
    ];

    const container = document.querySelector(".image-container");

    imageFiles.forEach((src, index) => {
        const card = document.createElement("div");
        card.classList.add("image-card");

        const img = document.createElement("img");
        img.src = src;
        img.alt = `Image ${index + 1}`;

        const comment = document.createElement("p");
        comment.classList.add("comment");
        comment.textContent = comments[index];

        const button = document.createElement("button");
        button.textContent = "View Metadata";

        const metadataDiv = document.createElement("div");
        metadataDiv.classList.add("metadata");
        metadataDiv.style.display = "none";

        // Convert Degrees, Minutes, Seconds (DMS) to Decimal Coordinates
        function convertDMSToDecimal(dms, direction) {
            if (!dms) return null;
            let decimal = dms[0] + dms[1] / 60 + dms[2] / 3600;
            return direction === "S" || direction === "W" ? -decimal : decimal;
        }

        button.addEventListener("click", function () {
            if (metadataDiv.textContent === "") {
                EXIF.getData(img, function () {
                    let exifData = EXIF.getAllTags(this);

                    // Extract GPS Data
                    let latitude = convertDMSToDecimal(exifData.GPSLatitude, exifData.GPSLatitudeRef);
                    let longitude = convertDMSToDecimal(exifData.GPSLongitude, exifData.GPSLongitudeRef);
                    let gpsLink = latitude && longitude
                        ? `<br><strong>📍 Location:</strong> <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View on Google Maps</a>`
                        : "<br><strong>📍 Location:</strong> Not Available";

                    // Metadata Display
                    let metadataText = `
                        <strong>👤 Creator:</strong> ${exifData.Artist || "Unknown"}<br>
                        <strong>© Copyright:</strong> ${exifData.Copyright || "Unknown"}<br>
                        <strong>📷 Camera:</strong> ${exifData.Make || "Unknown"} ${exifData.Model || ""}<br>
                        <strong>📆 Date Taken:</strong> ${exifData.DateTimeOriginal || "Unknown"}<br>
                        <strong>🔆 ISO:</strong> ${exifData.ISOSpeedRatings || "Unknown"}<br>
                        <strong>⏳ Shutter Speed:</strong> ${exifData.ExposureTime ? exifData.ExposureTime + " sec" : "Unknown"}<br>
                        <strong>🌅 Aperture:</strong> f/${exifData.FNumber || "Unknown"}<br>
                        <strong>🔭 Focal Length:</strong> ${exifData.FocalLength ? exifData.FocalLength + "mm" : "Unknown"}<br>
                        <strong>⚡ Flash:</strong> ${exifData.Flash ? "Yes" : "No"}<br>
                        <strong>🎨 Software Used:</strong> ${exifData.Software || "Unknown"}<br>
                        <strong>📏 Image Dimensions:</strong> ${exifData.ExifImageWidth || "?"} x ${exifData.ExifImageHeight || "?"} px<br>
                        ${gpsLink}
                    `;

                    metadataDiv.innerHTML = metadataText;
                    metadataDiv.style.display = "block";
                });
            } else {
                metadataDiv.style.display = metadataDiv.style.display === "none" ? "block" : "none";
            }
        });

        card.appendChild(img);
        card.appendChild(comment);
        card.appendChild(button);
        card.appendChild(metadataDiv);

        container.appendChild(card);
    });
});
