// --- 1. CONFIGURATION ---
// Your actual Supabase URL and Key have been added here.
const SUPABASE_URL = 'https://dknjxxowthbttkmbjosw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbmp4eG93dGhidHRrbWJqb3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDM3MDUsImV4cCI6MjA2NTIxOTcwNX0.vGGE7hGXwpvOkmLK9GsopHOQXWMtzbdIDsNOtOrF_aU';


// --- 2. INITIALIZE CLIENT ---
// This line uses the 'supabase' object from the library you added in index.html
// We create our own client and name it 'supabaseClient' to avoid a name conflict.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// --- 3. HELPER FUNCTIONS ---
/**
 * A helper to simplify setting text content of an element
 * @param {string} id - The ID of the HTML element
 * @param {string} text - The text to set
 */
function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text || ''; // Use empty string as fallback
    }
}

// --- 4. DATA FETCHING AND RENDERING ---

/**
 * Fetches and displays the main homepage content (titles, subtitles, etc.)
 */
async function loadHomepageContent() {
    // .single() fetches the first row as an object, not an array
    const { data, error } = await supabaseClient.from('homepage').select('*').single();

    if (error) {
        console.error('Error fetching homepage content:', error);
        return;
    }

    if (data) {
        // Hero Section
        setText('hero-title', data.hero_title);
        setText('hero-subtitle', data.hero_subtitle);
        setText('hero-button-text', data.hero_button_text);
        
        // Section Titles
        setText('services-section-title', data.services_section_title);
        setText('why-choose-us-title', data.why_choose_us_title);
        setText('why-choose-us-subtitle', data.why_choose_us_subtitle);
        setText('testimonials-title', data.testimonials_title);
        setText('how-it-works-title', data.how_it_works_title);
        setText('cta-title', data.cta_title);
        setText('cta-subtitle', data.cta_subtitle);
        setText('cta-button-text', data.cta_button_text);
    }
}

/**
 * Fetches and renders the list of services as cards
 */
async function loadServices() {
    const { data, error } = await supabaseClient
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching services:', error);
        return;
    }
    
    const container = document.getElementById('services-list');
    if (container && data) {
        container.innerHTML = ''; // Clear existing content
        data.forEach(service => {
            const serviceHTML = `
                <div class="flex flex-col items-center text-center gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div class="text-[#0c7ff2] p-4 bg-blue-100 rounded-full">
                        ${service.icon_svg || ''}
                    </div>
                    <h3 class="text-xl font-bold text-[#111418]">${service.title}</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">${service.description}</p>
                </div>
            `;
            container.innerHTML += serviceHTML;
        });
    }
}

/**
 * Fetches and renders the list of features
 */
async function loadFeatures() {
    const { data, error } = await supabaseClient
        .from('features')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching features:', error);
        return;
    }

    const container = document.getElementById('features-list');
    if (container && data) {
        container.innerHTML = '';
        data.forEach(feature => {
            const featureHTML = `
                <div class="flex flex-col items-start gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div class="text-[#0c7ff2]">
                        ${feature.icon_svg || ''}
                    </div>
                    <h3 class="text-lg font-bold text-[#111418]">${feature.title}</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">${feature.description}</p>
                </div>
            `;
            container.innerHTML += featureHTML;
        });
    }
}

/**
 * Fetches and renders the list of testimonials
 */
async function loadTestimonials() {
    const { data, error } = await supabaseClient
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching testimonials:', error);
        return;
    }

    const container = document.getElementById('testimonials-list');
    if (container && data) {
        container.innerHTML = '';
        data.forEach(testimonial => {
            // The author_photo_url from Supabase is a full URL, so we use it directly.
            const imageUrl = testimonial.author_photo_url || '';

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
}


// --- 5. RUN EVERYTHING ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if the Supabase client is available
    if (typeof supabase === 'undefined') {
        console.error('Supabase client is not loaded. Make sure the library script is in your index.html');
        return;
    }
    // Load all the different sections of the page
    loadHomepageContent();
    loadServices();
    loadFeatures();
    loadTestimonials();
});
