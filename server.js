const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3000;

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/image')
    },
    filename: function (req, file, cb) {
        // Get file extension
        const ext = path.extname(file.originalname);
        // Generate unique filename using timestamp
        const uniqueName = `${Date.now()}${ext}`;
        cb(null, uniqueName)
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('.'));  // Serve files from root directory
app.use('/src/image', express.static('src/image')); // Also keep specific route for images

// Increase JSON payload limit
app.use(express.json({ limit: '50mb' }));
app.use(cors());

const MENU_FILE = 'menu-data.json';

// Ensure image directory exists
async function ensureImageDirectory() {
    const dir = 'src/image';
    try {
        await fs.access(dir);
    } catch {
        // Directory doesn't exist, create it
        await fs.mkdir(dir, { recursive: true });
    }
}

// Get all menu items
app.get('/api/menu', async (req, res) => {
    try {
        const data = await fs.readFile(MENU_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading menu data:', error);
        res.status(500).json({ error: 'Failed to read menu data' });
    }
});

// Add new item with image upload
app.post('/api/menu', upload.single('image'), async (req, res) => {
    try {
        console.log('Received new item request');
        console.log('Request body:', req.body);
        
        if (!req.body || !req.body.category || !req.body.name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure image directory exists
        await ensureImageDirectory();

        // Read current menu data
        console.log('Reading current menu data from:', MENU_FILE);
        const data = await fs.readFile(MENU_FILE, 'utf8');
        const menuData = JSON.parse(data);
        
        // Prepare new item data
        const newItem = {
            category: req.body.category,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description || '',
            ingredients: req.body.ingredients ? req.body.ingredients.split(',').map(i => i.trim()) : [],
            allergens: req.body.allergens || ''
        };

        // Handle image path
        if (req.file) {
            // Use relative path for image (remove leading slash)
            newItem.image = `./src/image/${req.file.filename}`;
        } else {
            // Use default image if no file was uploaded
            newItem.image = 'https://via.placeholder.com/800x600?text=No+Image';
        }
        
        // Generate unique ID
        const category = newItem.category;
        const itemCount = Object.keys(menuData.items)
            .filter(key => key.startsWith(category))
            .length;
        const id = `${category}${itemCount + 1}`;
        
        console.log('Adding new item with ID:', id);
        console.log('New item data:', JSON.stringify(newItem, null, 2));
        menuData.items[id] = newItem;
        
        console.log('Writing updated menu data to file...');
        await fs.writeFile(MENU_FILE, JSON.stringify(menuData, null, 4));
        console.log('Item added successfully');
        
        res.json({ id, ...newItem });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Failed to add item: ' + error.message });
    }
});

// Delete item
app.delete('/api/menu/:id', async (req, res) => {
    try {
        console.log('Received delete request for item:', req.params.id);
        
        const data = await fs.readFile(MENU_FILE, 'utf8');
        const menuData = JSON.parse(data);
        
        const id = req.params.id;
        const item = menuData.items[id];
        if (!item) {
            console.log('Item not found:', id);
            return res.status(404).json({ error: 'Item not found' });
        }

        // Delete the associated image file if it exists and is a local file
        if (item.image && item.image.startsWith('./src/image/')) {
            try {
                const imagePath = item.image.replace('./', ''); // Remove leading './'
                await fs.unlink(imagePath);
                console.log('Associated image deleted:', imagePath);
            } catch (error) {
                console.error('Error deleting image file:', error);
                // Continue with item deletion even if image deletion fails
            }
        }
        
        delete menuData.items[id];
        await fs.writeFile(MENU_FILE, JSON.stringify(menuData, null, 4));
        console.log('Item deleted successfully');
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item: ' + error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Working directory:', process.cwd());
    console.log('Menu file path:', MENU_FILE);
}); 