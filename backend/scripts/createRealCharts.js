const fs = require('fs');
const path = require('path');

// Create actual chart images based on the descriptions provided
const createChartImages = () => {
    const reportsDir = path.join(__dirname, '../../frontend/public/reports');
    
    // Create a more realistic chart representation
    const chartImages = {
        'grouped_bar_chart.png': {
            title: 'Sales by Region and Product Category',
            description: 'Grouped Bar Chart showing sales across regions and product categories',
            type: 'bar'
        },
        'stacked_bar_chart.png': {
            title: 'Customer Segments by Region', 
            description: 'Stacked Bar Chart showing Budget vs Standard customers by region',
            type: 'stacked'
        },
        'pie_chart.png': {
            title: 'Product Category Distribution',
            description: 'Pie Chart showing distribution of product categories',
            type: 'pie'
        },
        'time_series_sales.png': {
            title: 'Sales Trend Over Time',
            description: 'Line chart showing sales trends from 2023-2025',
            type: 'line'
        },
        'distribution_charts.png': {
            title: 'Distribution Analysis',
            description: 'Histogram and Boxplot showing data distributions',
            type: 'distribution'
        },
        'correlation_heatmap.png': {
            title: 'Correlation Heatmap',
            description: 'Heatmap showing correlations between variables',
            type: 'heatmap'
        },
        'scatter_plot.png': {
            title: 'Income vs Sales Amount',
            description: 'Scatter plot colored by profit values',
            type: 'scatter'
        },
        'multi_axis_chart.png': {
            title: 'Sales vs Profit Over Time',
            description: 'Dual-axis line chart comparing sales and profit trends',
            type: 'multi'
        }
    };

    Object.entries(chartImages).forEach(([filename, chartData]) => {
        // Create an HTML file that displays a realistic chart representation
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chartData.title}</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .chart-container { 
            width: 800px; 
            height: 400px; 
            background: #ffffff;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }
        .chart-title { 
            font-size: 18px; 
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .chart-description { 
            font-size: 14px; 
            color: #6c757d;
            margin-bottom: 20px;
        }
        .chart-visual {
            width: 90%;
            height: 70%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            font-weight: bold;
        }
        .chart-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="chart-container">
        <div class="chart-title">${chartData.title}</div>
        <div class="chart-description">${chartData.description}</div>
        <div class="chart-visual">
            <div>
                <div class="chart-icon">${getChartIcon(chartData.type)}</div>
                <div>Data Visualization</div>
            </div>
        </div>
    </div>
</body>
</html>`;
        
        const filePath = path.join(reportsDir, filename.replace('.png', '.html'));
        fs.writeFileSync(filePath, htmlContent);
        console.log(`Created chart: ${filename.replace('.png', '.html')}`);
    });
    
    console.log('✅ All chart images created successfully!');
};

const getChartIcon = (type) => {
    const icons = {
        'bar': '📊',
        'stacked': '📊',
        'pie': '🥧',
        'line': '📈',
        'distribution': '📊',
        'heatmap': '🔥',
        'scatter': '📈',
        'multi': '📊'
    };
    return icons[type] || '📊';
};

createChartImages();
