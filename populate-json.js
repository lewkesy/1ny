const fs = require('fs');

// Read the existing menu.js file
fs.readFile('menu.js', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading menu.js:', err);
        return;
    }

    // Extract the menuData object
    const menuDataMatch = data.match(/let menuData = ({[\s\S]*?});/);
    if (menuDataMatch) {
        const menuDataString = menuDataMatch[1];
        
        // Convert the string to a valid JSON format
        const jsonString = menuDataString
            .replace(/(\w+):/g, '"$1":')  // Add quotes to property names
            .replace(/'/g, '"');          // Replace single quotes with double quotes

        try {
            // Parse and format the JSON
            const menuData = JSON.parse(jsonString);
            const formattedJson = JSON.stringify(menuData, null, 4);

            // Write to menu-data.json
            fs.writeFile('menu-data.json', formattedJson, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing menu-data.json:', err);
                    return;
                }
                console.log('Successfully created menu-data.json');
            });
        } catch (error) {
            console.error('Error parsing menu data:', error);
        }
    }
}); 