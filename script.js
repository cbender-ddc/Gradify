function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function generateGradient() {
    const startColor = document.getElementById('startColor').value;
    const endColor = document.getElementById('endColor').value;
    const steps = parseInt(document.getElementById('steps').value);

    const startRgb = hexToRgb(startColor);
    const endRgb = hexToRgb(endColor);

    const colors = [];

    for (let i = 0; i < steps; i++) {
        const ratio = i / (steps - 1);
        const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * ratio);
        const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * ratio);
        const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * ratio);

        colors.push({
            hex: rgbToHex(r, g, b),
            rgb: `rgb(${r}, ${g}, ${b})`,
            values: { r, g, b }
        });
    }

    updateDisplay(colors);
}

function updateDisplay(colors) {
    // Update gradient bar
    const gradientBar = document.getElementById('gradientBar');
    const gradientStops = colors.map((color, index) => 
        `${color.hex} ${(index / (colors.length - 1) * 100)}%`
    ).join(', ');
    gradientBar.style.background = `linear-gradient(to right, ${gradientStops})`;

    // Update colors grid
    const colorsGrid = document.getElementById('colorsGrid');
    colorsGrid.innerHTML = colors.map((color, index) => `
        <div class="color-item">
            <div class="color-preview" style="background-color: ${color.hex};">
                Column ${index + 1}
            </div>
            <div class="color-info">
                <div class="column-number">Column ${index + 1}</div>
                <div class="color-code" onclick="copyToClipboard('${color.hex}')" title="Click to copy">
                    ${color.hex}
                </div>
                <div class="color-code" onclick="copyToClipboard('${color.rgb}')" title="Click to copy">
                    ${color.rgb}
                </div>
                <div class="color-code" onclick="copyToClipboard('${color.values.r}, ${color.values.g}, ${color.values.b}')" title="Click to copy">
                    R:${color.values.r} G:${color.values.g} B:${color.values.b}
                </div>
            </div>
        </div>
    `).join('');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied: ' + text);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function copyAllColors() {
    const startColor = document.getElementById('startColor').value;
    const endColor = document.getElementById('endColor').value;
    const steps = parseInt(document.getElementById('steps').value);

    const startRgb = hexToRgb(startColor);
    const endRgb = hexToRgb(endColor);

    let output = `Gradient from ${startColor} to ${endColor} (${steps} steps):\n\n`;

    for (let i = 0; i < steps; i++) {
        const ratio = i / (steps - 1);
        const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * ratio);
        const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * ratio);
        const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * ratio);
        const hex = rgbToHex(r, g, b);

        output += `Column ${i + 1}: ${hex} | rgb(${r}, ${g}, ${b}) | R:${r} G:${g} B:${b}\n`;
    }

    copyToClipboard(output);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize
document.getElementById('startColor').addEventListener('change', generateGradient);
document.getElementById('endColor').addEventListener('change', generateGradient);
document.getElementById('steps').addEventListener('input', generateGradient);

generateGradient();
