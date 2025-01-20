// Remaining script.js

// Utility Functions
function adjustBrightness(color, factor) {
    const rgb = hexToRgb(color);
    const adjustedRgb = rgb.map((channel) => Math.min(255, Math.floor(channel * factor)));
    return rgbToHex(adjustedRgb[0], adjustedRgb[1], adjustedRgb[2]);
}

// Convert hex color to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Convert RGB to hex color
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Generate Colors for Charts
function generateColors(count) {
    const baseColors = ["#1CA498", "#B51F67", "#FAD968"]; // Base colors
    const shades = [];

    // Generate shades for each base color
    for (let i = 0; i < count; i++) {
        const baseColor = baseColors[i % baseColors.length]; // Cycle through base colors
        const shadeFactor = 1 - (i % baseColors.length) * 0.1; // Reduce brightness for each shade
        const shade = adjustBrightness(baseColor, shadeFactor);
        shades.push(shade);
    }

    return shades;
}
