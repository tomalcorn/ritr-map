document.getElementById('download-map-btn').addEventListener('click', returnMapCanvas);

function returnMapCanvas() {
    const mapDiv = document.getElementById('map-container');
    html2canvas(mapDiv).then(function(canvas) {
        const link = document.createElement('a');
        link.download = 'current_map.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Load initial stickers when page loads
fetch('/static/planets.json')
    .then(response => response.json())
    .then(data => {
        planets = data;
        Object.entries(planets).forEach(([name, planet]) => {
            if (planet.status !== 'neutral') {
                displaySticker(name, planet);
            }
            updateStats();
        });
    });

// Load initial diplomat tokens when page loads
fetch('static/sector_data.json')
    .then(response => response.json())
    .then(sectorData => {
        Object.entries(sectorData).forEach(([faction, sectors]) => {
            Object.entries(sectors).forEach(([sector, data]) => {
                if (data.status === "True") {
                    displayDiplomat(faction, sector);
                }
            });
        });
    });

mapContainer.onclick = function(e) {
    // Remove any existing selection boxes or circles
    const existingBox = document.querySelector('.sticker-selection-box');
    if (existingBox) existingBox.remove();
    const existingCircles = document.querySelectorAll('.glow-circle');
    existingCircles.forEach(circle => circle.remove());

    const rect = mapContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const closestPlanet = findClosestPlanet(x, y);

    if (closestPlanet) {
        createStickerSelectionBox(closestPlanet);
    }

};