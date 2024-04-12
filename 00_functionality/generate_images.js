const fs = require('fs');
const path = require('path');

// Set the directory paths
const assetsDirPath = path.join(__dirname, '../02_assets_photos'); // Correct directory name
const htmlFilePath = path.join(__dirname, '../Pages', 'photo_page.html');

fs.readdir(assetsDirPath, (err, files) => {
    if (err) {
        return console.error('Unable to read the assets directory:', err);
    }
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

    const imageTags = imageFiles.map(file => {
        const altText = `Description for ${file.replace(/[-_]/g, ' ').replace(/\.\w+$/, '')}`;
        // Make sure the path is relative to the HTML file's location
        return `<img src="../02_assets_photos/${file}" alt="${altText}" class="gallery-item" onclick="openModal(this);">\n`;
    }).join('');

    fs.readFile(htmlFilePath, 'utf8', (err, htmlContent) => {
        if (err) {
            return console.error('Unable to read the HTML file:', err);
        }
        const placeholder = '<!-- Image placeholder - images will be inserted here by the script -->';

        if (!htmlContent.includes(placeholder)) {
            console.error('Placeholder not found in HTML content.');
            return;
        }
        const updatedHtmlContent = htmlContent.replace(placeholder, imageTags + placeholder);

        fs.writeFile(htmlFilePath, updatedHtmlContent, 'utf8', (err) => {
            if (err) {
                return console.error('Unable to write the updated HTML file:', err);
            }
            console.log('Photo page updated with image tags.');
        });
    });
});
