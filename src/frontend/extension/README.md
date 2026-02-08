# Watermark Eraser Chrome Extension

This Chrome extension provides quick access to the Watermark Eraser web application.

## Setup Instructions

### 1. Configure the Target URL

Before loading the extension, you must configure the target URL:

1. Open `background.js` in a text editor
2. Replace `YOUR_DEPLOYED_URL_HERE` with your actual deployed application URL
3. Make sure to include the access secret in the hash fragment:
   ```
   https://your-app-url.ic0.app/#watermark-access-2026
   ```
4. Save the file

### 2. Test Locally (Load Unpacked)

To test the extension in Chrome:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked"
4. Select the `frontend/extension` folder
5. The extension icon should appear in your toolbar
6. Click the icon to test - it should open your app with the access secret

### 3. Prepare for Publishing

Before publishing to the Chrome Web Store:

1. **Update the manifest.json** if needed:
   - Change the `name`, `description`, or `version` as desired
   - The current version is set to `1.0.0`

2. **Verify all icons are present**:
   - `icons/icon-16.png` (16x16 pixels)
   - `icons/icon-48.png` (48x48 pixels)
   - `icons/icon-128.png` (128x128 pixels)

3. **Create a ZIP file**:
   - Select all files in the `frontend/extension` folder
   - Create a ZIP archive (e.g., `watermark-eraser-extension.zip`)
   - Do NOT include the parent folder in the ZIP, only the contents

### 4. Publish to Chrome Web Store

1. **Create a Developer Account**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Pay the one-time $5 registration fee

2. **Upload Your Extension**:
   - Click "New Item" in the dashboard
   - Upload your ZIP file
   - Fill in the required information:
     - Detailed description
     - Category (Productivity recommended)
     - Screenshots (at least 1, recommended 1280x800 or 640x400)
     - Small promotional tile (440x280, optional but recommended)
     - Privacy policy URL (if collecting data)

3. **Submit for Review**:
   - Review all information
   - Click "Submit for review"
   - Google typically reviews extensions within a few days

### 5. After Publishing

Once approved:
- Your extension will be available in the Chrome Web Store
- Users can install it with one click
- You can update it anytime by uploading a new version with an incremented version number

## Important Notes

- **Access Secret**: The extension includes the access secret in the URL. Anyone who installs your extension will be able to access your app.
- **URL Updates**: If your app URL changes, you'll need to update `background.js` and publish a new version.
- **Privacy**: Since this extension only opens a URL and doesn't collect data, you likely don't need a privacy policy, but check Chrome Web Store requirements.

## Troubleshooting

- **Extension doesn't open the app**: Check that the URL in `background.js` is correct and includes the hash secret
- **Access denied**: Verify the access secret in the URL matches the one configured in your app
- **Icons not showing**: Ensure all three icon files exist and are valid PNG images at the correct sizes
