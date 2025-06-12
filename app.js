// --- 1. CONFIGURATION ---
// Your actual Supabase URL and Key have been added here.
const SUPABASE_URL = 'https://dknjxocwthbtkmbjpsw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbmp4eG93dGhidHRrbWJqb3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDM3MDUsImV4cCI6MjA2NTIxOTcwNX0.vGGE7hGXwpvOkmLK9GsopHOQXWMtzbdIDsNOtOrF_aU';


// --- 2. INITIALIZE CLIENT ---
// This line uses the 'supabase' object from the library you added in index.html
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


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
    const { data, error } = await supabase.from('homepage').select('*').single();

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
    const { data, error } = await supabase
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
                    <h3 class="text
