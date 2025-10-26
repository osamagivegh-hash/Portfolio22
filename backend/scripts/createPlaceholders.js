const fs = require('fs');
const path = require('path');

// List of missing image files
const missingImages = [
    'time_series_sales.png',
    'grouped_bar_chart.png', 
    'distribution_charts.png',
    'scatter_plot.png',
    'correlation_heatmap.png',
    'stacked_bar_chart.png',
    'pie_chart.png',
    'multi_axis_chart.png'
];

// Create a simple SVG placeholder
const createPlaceholderSVG = (title, description) => {
    return `data:image/svg+xml;base64,${Buffer.from(`
<svg width="800" height="400" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="800" height="400" fill="#f8f9fa"/>
<rect x="50" y="50" width="700" height="300" fill="#e9ecef" rx="10"/>
<rect x="100" y="100" width="600" height="200" fill="#dee2e6" rx="5"/>
<text x="400" y="180" text-anchor="middle" fill="#495057" font-family="Arial" font-size="18" font-weight="bold">${title}</text>
<text x="400" y="210" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="14">${description}</text>
<circle cx="200" cy="150" r="20" fill="#007bff" opacity="0.7"/>
<circle cx="300" cy="140" r="25" fill="#28a745" opacity="0.7"/>
<circle cx="400" cy="160" r="18" fill="#ffc107" opacity="0.7"/>
<circle cx="500" cy="145" r="22" fill="#dc3545" opacity="0.7"/>
<circle cx="600" cy="155" r="20" fill="#6f42c1" opacity="0.7"/>
</svg>
    `).toString('base64')}`;
};

// Create placeholder files
const createPlaceholders = () => {
    const reportsDir = path.join(__dirname, '../../frontend/public/reports');
    
    missingImages.forEach((filename, index) => {
        const title = filename.replace('.png', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const description = 'Data Visualization Placeholder';
        
        // Create a simple HTML file that displays the placeholder
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .placeholder { 
            width: 800px; 
            height: 400px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .placeholder h3 { margin: 0 0 10px 0; font-size: 24px; }
        .placeholder p { margin: 0; font-size: 16px; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="placeholder">
        <h3>📊 ${title}</h3>
        <p>${description}</p>
    </div>
</body>
</html>`;
        
        const filePath = path.join(reportsDir, filename.replace('.png', '.html'));
        fs.writeFileSync(filePath, htmlContent);
        console.log(`Created placeholder: ${filename.replace('.png', '.html')}`);
    });
    
    console.log('✅ All placeholder files created successfully!');
};

createPlaceholders();
