# 1ny Bakery Website

A modern bakery website showcasing menu items with categories and search functionality.

## Project Structure

```
1ny/
├── data/
│   └── menu-data.json     # Static menu data
├── src/
│   └── image/            # Static images for menu items
├── styles.css            # Main styles
├── menu-styles.css       # Menu-specific styles
├── manage-styles.css     # Management page styles
├── menu.js              # Menu functionality
├── manage.js            # Management functionality
├── index.html           # Home page
├── menu.html            # Menu page
└── manage.html          # Management page
```

## Setup for Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/1ny.git
   cd 1ny
   ```

2. Install a local server (optional, for development):
   ```bash
   npm install -g http-server
   ```

3. Run the local server:
   ```bash
   http-server
   ```

4. Open `http://localhost:8080` in your browser

## Deployment to GitHub Pages

1. Push your changes to the main branch:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```

2. GitHub Actions will automatically deploy your site to GitHub Pages.

3. Access your site at: `https://yourusername.github.io/1ny`

## Managing Menu Items

To update menu items:

1. Edit the `data/menu-data.json` file
2. Add new images to `src/image/` directory
3. Commit and push changes to trigger deployment

## Image Guidelines

- Use images with dimensions: 800x600 pixels
- Optimize images for web (compress them)
- Use JPG format for photos
- Place all images in the `src/image/` directory
- Use relative paths in menu-data.json: `./src/image/filename.jpg` 