// storyblok-script.js

// Import necessary functions from the Storyblok JS SDK, loaded from a CDN
import { storyblokInit, apiPlugin } from 'https://unpkg.com/@storyblok/js';

const { storyblokApi } = storyblokInit({
  accessToken: 'szNh32riKEW6FPXGyrr0Igtt', // <-- IMPORTANT: Replace with your actual Preview Token
  use: [apiPlugin],                         // Required to use the Storyblok API
  apiOptions: {
    region: 'eu' // Since your Storyblok space is in the EU region
    // If your space were in the US, it would be 'us'. Other regions: 'ca', 'ap', 'cn'.
  }
});

// Check if the SDK initialized correctly (optional, but good for debugging)
if (!storyblokApi) {
  console.error('Storyblok SDK failed to initialize. Check your access token and configuration.');
  // You might want to display an error message on the page for the user
  const contentDiv = document.getElementById('storyblok-content');
  if (contentDiv) {
      contentDiv.innerHTML = '<p>Error: Could not connect to content service.</p>';
  }
} else {
  console.log('Storyblok SDK Initialized successfully!');
}

// --- More code will go here in the next steps ---
