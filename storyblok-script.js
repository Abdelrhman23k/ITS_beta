// storyblok-script.js

document.addEventListener('DOMContentLoaded', async () => {
    // Check if Storyblok SDK is loaded
    if (typeof window.storyblokJs === 'undefined') {
        console.error('Storyblok JavaScript SDK (window.storyblokJs) is not loaded. Ensure <script src="https://unpkg.com/@storyblok/js"></script> is in your HTML BEFORE this script.');
        const contentDiv = document.getElementById('storyblok-content');
        if (contentDiv) {
            contentDiv.innerHTML = '<p>Error: Storyblok SDK not found. Content cannot be loaded.</p>';
        }
        return; // Stop execution if SDK isn't loaded
    }

    // ** UMD Version Setup **
    // We access storyblokInit and apiPlugin from the global window.storyblokJs object.
    // This object is created by including <script src="https://unpkg.com/@storyblok/js"></script>
    // in your index.html BEFORE this script.
    // There are NO 'import' statements for Storyblok SDK at the top of this file.

    const { storyblokInit, apiPlugin, StoryblokBridge } = window.storyblokJs;

    const { storyblokApi } = storyblokInit({
        accessToken: 'szNh32riKEW6FPXGyrr0Igtt', // Your actual Preview Token
        use: [apiPlugin],                      // apiPlugin is still used here
        apiOptions: {
            region: 'eu'                       // Your Storyblok space region
        }
    });

    // Check if the SDK initialized correctly
    if (!storyblokApi) {
        console.error('Storyblok SDK failed to initialize. Check your access token and configuration, or if the Storyblok SDK script loaded correctly from the CDN.');
        const contentDiv = document.getElementById('storyblok-content');
        if (contentDiv) {
            contentDiv.innerHTML = '<p>Error: Could not connect to content service. Check console for details.</p>';
        }
        return; // Stop execution if SDK initialization failed
    } else {
        console.log('Storyblok SDK Initialized successfully (UMD version)! storyblokApi is available.');
    }

    async function fetchStory(slug) {
        // Make sure storyblokApi is initialized before trying to use it
        if (!storyblokApi) {
            console.error('Storyblok API not available during fetch attempt.');
            return null;
        }

        try {
            const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
                version: 'draft', // Use 'draft' for preview, 'published' for live
            });
            return data.story;
        } catch (error) {
            console.error(`Error fetching story "${slug}":`, error);
            const contentDiv = document.getElementById('storyblok-content');
            if (contentDiv) {
                contentDiv.innerHTML = `<p>Error loading content for "${slug}". Please check the console for details.</p>`;
            }
            return null;
        }
    }

    // Main execution logic once DOM is loaded
    const storySlug = 'home'; // Replace 'home' with your actual homepage slug if different

    const story = await fetchStory(storySlug);

    if (story) {
        console.log('Successfully fetched Story:', story);
        renderStory(story);

        // Initialize Storyblok Bridge for visual editor live updates
        if (typeof StoryblokBridge !== 'undefined') {
            const storyblokBridge = new StoryblokBridge();
            storyblokBridge.on(['input', 'published', 'change'], (event) => {
                console.log('Storyblok Bridge event triggered:', event);
                // For a simple static page, reloading the page is often the easiest
                // way to see live changes from the visual editor.
                window.location.reload();
            });
            console.log('Storyblok Bridge initialized for live preview.');
        }
    } else {
        console.log(`No story found for slug "${storySlug}" or an error occurred during fetch.`);
    }

    // Basic function to render some story content
    function renderStory(story) {
        const contentDiv = document.getElementById('storyblok-content');
        if (!contentDiv) {
            console.error('HTML element with ID "storyblok-content" not found.');
            return;
        }

        contentDiv.innerHTML = ''; // Clear the "Loading content..." message

        // Display the story's name
        const storyNameElement = document.createElement('h1');
        storyNameElement.textContent = `Story: ${story.name}`;
        contentDiv.appendChild(storyNameElement);

        // Display the main content object as formatted JSON (for debugging/learning)
        const storyContentTitle = document.createElement('h2');
        storyContentTitle.textContent = 'Data for story.content:';
        contentDiv.appendChild(storyContentTitle);

        const rawContentElement = document.createElement('pre');
        rawContentElement.style.whiteSpace = 'pre-wrap';
        rawContentElement.style.wordBreak = 'break-all';
        rawContentElement.style.border = '1px solid #ccc';
        rawContentElement.style.padding = '10px';
        rawContentElement.style.backgroundColor = '#f9f9f9';
        rawContentElement.textContent = JSON.stringify(story.content, null, 2);
        contentDiv.appendChild(rawContentElement);

        // Placeholder for rendering Bloks from story.content.body
        if (story.content && story.content.body && Array.isArray(story.content.body)) {
            const bloksTitle = document.createElement('h2');
            bloksTitle.textContent = 'Bloks found in story.content.body:';
            contentDiv.appendChild(bloksTitle);
            story.content.body.forEach(blok => {
                const blokInfo = document.createElement('p');
                blokInfo.textContent = `Found Blok: ${blok.component} (ID: ${blok._uid})`;
                contentDiv.appendChild(blokInfo);
                console.log('Blok to render:', blok);
                // Later, you'll replace this with actual rendering logic for each blok
                // For example: renderBlok(blok);
            });
        }
    }
});
