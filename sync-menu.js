const fs = require('fs');
const http = require('http');

// Create a simple server to receive updates
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/sync-menu') {
        let data = '';
        
        req.on('data', chunk => {
            data += chunk;
        });
        
        req.on('end', () => {
            try {
                // Parse the received data
                const menuData = JSON.parse(data);
                
                // Write to menu-data.json
                fs.writeFile('menu-data.json', JSON.stringify(menuData, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing to menu-data.json:', err);
                        res.writeHead(500);
                        res.end('Error saving data');
                        return;
                    }
                    
                    console.log('Menu data updated successfully');
                    res.writeHead(200);
                    res.end('Menu data updated');
                });
            } catch (error) {
                console.error('Error processing data:', error);
                res.writeHead(400);
                res.end('Invalid data format');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Listen on port 3000
server.listen(3000, () => {
    console.log('Sync server running on port 3000');
}); 