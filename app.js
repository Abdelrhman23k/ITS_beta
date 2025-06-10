// app.js

// --- CONFIGURATION ---
// For local testing, use http://localhost:1337
// When you deploy Strapi, change this to your live Strapi URL
const STRAPI_BASE_URL = 'http://localhost:1337';

// --- HELPER FUNCTIONS ---

/**
 * A helper to simplify setting text content of an element
 * @param {string} id - The ID of the HTML element
 * @param {string} text - The text to set
 */
function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    } else {
        console.warn(`Element with id "${id}" not found.`);
    }
}

// --- DATA FETCHING AND RENDERING ---

/**
 * Fetches the homepage content and populates the static sections
 */
async function loadHomepageContent() {
    try {
        // Using ?populate=deep to get all components and their media fields
        const response = await fetch(`${STRAPI_BASE_URL}/api/homepage?populate=deep`);
        if (!response.ok) throw new Error('Failed to fetch homepage data');

        const result = await response.json();
        const data = result.data.attributes;

        // --- Populate Hero Section ---
        setText('hero-title', data.hero_title);
        setText('hero-subtitle', data.hero_subtitle);
        setText('hero-button-text', data.hero_button_text);
        
        // --- Populate Section Titles ---
        setText('services-section-title', data.services_section_title);
        setText('why-choose-us-title', data.why_choose_us_title);
        setText('why-choose-us-subtitle', data.why_choose_us_subtitle);
        setText('testimonials-title', data.testimonials_title);

        // --- Render Dynamic Lists (Components) ---
        renderServices(data.services);
        renderFeatures(data.features);
        renderTestimonials(data.testimonials);

    } catch (error) {
        console.error("Error loading homepage content:", error);
        // You could display an error message on the page here
    }
}

/**
 * Renders the list of services
 * @param {Array} services - The array of service objects from Strapi
 */
function renderServices(services) {
    const container = document.getElementById('services-list');
    if (!container || !services) return;

    container.innerHTML = ''; // Clear existing static content

    services.forEach(service => {
        // Note: The classes used here are copied directly from your original HTML
        const serviceHTML = `
            <div class="flex flex-col items-center text-center gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="text-[#0c7ff2] p-4 bg-blue-100 rounded-full">
                    ${service.icon_svg}
                </div>
                <h3 class="text-xl font-bold text-[#111418]">${service.title}</h3>
                <p class="text-gray-600 text-sm leading-relaxed">${service.description}</p>
            </div>
        `;
        container.innerHTML += serviceHTML;
    });
}

/**
 * Renders the list of features
 * @param {Array} features - The array of feature objects from Strapi
 */
function renderFeatures(features) {
    const container = document.getElementById('features-list');
    if (!container || !features) return;
    
    container.innerHTML = '';

    features.forEach(feature => {
        const featureHTML = `
            <div class="flex flex-col items-start gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div class="text-[#0c7ff2]">
                    ${feature.icon_svg}
                </div>
                <h3 class="text-lg font-bold text-[#111418]">${feature.title}</h3>
                <p class="text-gray-600 text-sm leading-relaxed">${feature.description}</p>
            </div>
        `;
        container.innerHTML += featureHTML;
    });
}

/**
 * Renders the list of testimonials
 * @param {Array} testimonials - The array of testimonial objects from Strapi
 */
function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonials-list');
    if (!container || !testimonials) return;

    container.innerHTML = '';

    testimonials.forEach(testimonial => {
        // Construct the full image URL from Strapi's relative path
        const imageUrl = testimonial.author_photo?.data?.attributes?.url 
            ? `${STRAPI_BASE_URL}${testimonial.author_photo.data.attributes.url}`
            : ''; // Fallback for no image

        const testimonialHTML = `
            <div class="flex flex-col gap-6 rounded-xl bg-white p-8 shadow-lg">
                <div class="flex items-center gap-4">
                    <div class="size-16 rounded-full bg-center bg-no-repeat aspect-square bg-cover shadow-md" style="background-image: url('${imageUrl}');"></div>
                    <div>
                        <h4 class="text-lg font-semibold text-[#111418]">${testimonial.author_name}</h4>
                        <p class="text-sm text-gray-500">${testimonial.author_location}</p>
                    </div>
                </div>
                <p class="text-gray-600 text-sm leading-relaxed italic">
                    "${testimonial.quote}"
                </p>
            </div>
        `;
        container.innerHTML += testimonialHTML;
    });
}


// --- INITIATE PAGE LOAD ---
// This event listener waits for the HTML to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    loadHomepageContent();
});
