// storyblok-script.js

// Import necessary functions from the Storyblok JS SDK, loaded from a CDN
import { storyblokInit } from 'https://unpkg.com/@storyblok/js';

const { storyblokApi } = storyblokInit({
  accessToken: 'szNh32riKEW6FPXGyrr0Igtt', // <-- IMPORTANT: Replace with your actual Preview Token
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

// storyblok-script.js (continue in the same file)

async function fetchStory(slug) {
  // Make sure storyblokApi is initialized before trying to use it
  if (!storyblokApi) {
    console.error('Storyblok API not available.');
    return null;
  }

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: 'draft', // Use 'draft' to get the latest saved version (good for previews)
                         // Use 'published' for live public website
      // resolve_relations: "your_relation_field.relation_name", // Add this later if you use relation fields
    });
    return data.story; // The actual story object
  } catch (error) {
    console.error(`Error fetching story "${slug}":`, error);
    // Display an error on the page
    const contentDiv = document.getElementById('storyblok-content');
    if (contentDiv) {
        contentDiv.innerHTML = `<p>Error loading content for "${slug}". Please check the console for details.</p>`;
    }
    return null;
  }
}

// storyblok-script.js (continue in the same file)

// This function will be called when the page's HTML is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Replace 'home' with the actual slug of your homepage story if it's different
  // (e.g., if your homepage is the root, the slug might be an empty string "" or "/")
  // For GitHub Pages, if your index.html is at the root of your repo,
  // you are essentially fetching the content for that root page.
  // Let's assume your main content story in Storyblok has the slug 'home'.
  const storySlug = 'home';

  const story = await fetchStory(storySlug);

  if (story) {
    console.log('Successfully fetched Story:', story); // View the full data in your browser's console!
    renderStory(story); // Call a function to display the story
  } else {
    console.log(`No story found for slug "${storySlug}" or an error occurred.`);
  }
});

// Basic function to render some story content (you will expand this a lot later)
function renderStory(story) {
  const contentDiv = document.getElementById('storyblok-content');
  if (!contentDiv) {
    console.error('HTML element with ID "storyblok-content" not found.');
    return;
  }

  // Clear the "Loading content..." message
  contentDiv.innerHTML = '';

  // Display the story's name
  const storyNameElement = document.createElement('h1');
  storyNameElement.textContent = `Story: ${story.name}`;
  contentDiv.appendChild(storyNameElement);

  // Display the main content object as formatted JSON (for debugging/learning)
  // This shows you all the data you received for this story's content.
  const storyContentTitle = document.createElement('h2');
  storyContentTitle.textContent = 'Data for story.content:';
  contentDiv.appendChild(storyContentTitle);

  const rawContentElement = document.createElement('pre'); // <pre> preserves formatting
  rawContentElement.style.whiteSpace = 'pre-wrap';        // Helps with long lines
  rawContentElement.style.wordBreak = 'break-all';        // Breaks very long words
  rawContentElement.style.border = '1px solid #ccc';
  rawContentElement.style.padding = '10px';
  rawContentElement.style.backgroundColor = '#f9f9f9';
  rawContentElement.textContent = JSON.stringify(story.content, null, 2); // 'null, 2' pretty-prints the JSON
  contentDiv.appendChild(rawContentElement);

  // **Important Next Step for Real Rendering:**
  // To actually build your page, you would now look at `story.content`.
  // If `story.content.body` is an array of Bloks (which is common for a 'page' component),
  // you would loop through `story.content.body` and render each Blok based on its `component` type.
  // We'll cover this detailed rendering in the next stage (Level 3).
  // Example placeholder for that logic:
  if (story.content && story.content.body && Array.isArray(story.content.body)) {
    const bloksTitle = document.createElement('h2');
    bloksTitle.textContent = 'Bloks found in story.content.body:';
    contentDiv.appendChild(bloksTitle);
    story.content.body.forEach(blok => {
      const blokInfo = document.createElement('p');
      blokInfo.textContent = `Found Blok: ${blok.component} (ID: ${blok._uid})`;
      contentDiv.appendChild(blokInfo);
      console.log('Blok to render:', blok);
      // In a real app, you'd have: renderBlok(blok);
    });
  }
}
