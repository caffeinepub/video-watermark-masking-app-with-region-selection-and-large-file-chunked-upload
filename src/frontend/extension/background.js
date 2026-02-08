// Configuration: Replace this URL with your deployed app URL
// IMPORTANT: Include the access secret in the hash fragment
// Example: https://your-app-url.ic0.app/#watermark-access-2026
const APP_URL = 'https://YOUR_DEPLOYED_URL_HERE.ic0.app/#watermark-access-2026';

// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Open the watermark eraser app in a new tab
  chrome.tabs.create({
    url: APP_URL
  });
});
