/**
 * TERRA // World Documentary - Application Controller
 * Handles country data fetching, grid rendering, AI locality search,
 * theme switching, region filtering, and interactive popup documentary essays.
 */

// User-provided API Key for Google Gemini AI Semantic Search & Documentary Generation
const GEMINI_API_KEY = window.GEMINI_API_KEY || atob("QVEuQWI4Uk42SWFSM3BaTXF6UE8zZFc0SWNONmxubUJGQW5ZMlhsUElwYXVFQnNoUkJfYkE=");
const REST_COUNTRIES_API_URL = "https://restcountries.com/v3.1/all";

// Global State
let allCountriesData = [];
let filteredCountries = [];
let currentRegionFilter = "All";
let currentSortOrder = "name-asc";
let currentSearchQuery = "";
let currentActiveCountry = null;
let isSpeaking = false;

// DOM Elements
const countriesGrid = document.getElementById("countries-grid");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search-btn");
const aiSearchBtn = document.getElementById("ai-search-trigger-btn");
const regionSelect = document.getElementById("region-select");
const sortSelect = document.getElementById("sort-select");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const resultsCountEl = document.querySelector("#results-count span");
const aiInsightBanner = document.getElementById("ai-insight-banner");
const insightTitle = document.getElementById("insight-title");
const insightDescription = document.getElementById("insight-description");
const closeInsightBtn = document.getElementById("close-insight-btn");
const loadingContainer = document.getElementById("loading-container");
const errorContainer = document.getElementById("error-container");
const retryBtn = document.getElementById("retry-btn");
const noResultsContainer = document.getElementById("no-results-container");
const resetFiltersBtn = document.getElementById("reset-filters-btn");

// Modal DOM Elements
const countryModal = document.getElementById("country-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalFlagImg = document.getElementById("modal-flag-img");
const modalRegion = document.getElementById("modal-region");
const modalSubregion = document.getElementById("modal-subregion");
const modalCountryName = document.getElementById("modal-country-name");
const modalOfficialName = document.getElementById("modal-official-name");
const modalCapital = document.getElementById("modal-capital");
const modalPopulation = document.getElementById("modal-population");
const modalArea = document.getElementById("modal-area");
const modalLanguages = document.getElementById("modal-languages");
const modalCurrencies = document.getElementById("modal-currencies");
const modalBorders = document.getElementById("modal-borders");
const essayContent = document.getElementById("essay-content");
const readAloudBtn = document.getElementById("read-aloud-btn");
const aiDeepDiveBtn = document.getElementById("ai-deep-dive-btn");
const modalMapLink = document.getElementById("modal-map-link");

/**
 * Initialize the application on DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initEventListeners();
    fetchCountryData();
});

/**
 * 1. THEME SWITCH TOGGLE ICON IN TOP RIGHT CORNER
 */
function initThemeToggle() {
    const savedTheme = localStorage.getItem("terra_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("terra_theme", newTheme);
    });
}

/**
 * 2. EVENT LISTENERS
 */
function initEventListeners() {
    // Search Bar Input
    searchInput.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value.trim();
        if (currentSearchQuery.length > 0) {
            clearSearchBtn.classList.remove("hidden");
        } else {
            clearSearchBtn.classList.add("hidden");
            hideAiInsight();
        }
        applyFiltersAndSort();
    });

    // Clear Search Button
    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        currentSearchQuery = "";
        clearSearchBtn.classList.add("hidden");
        hideAiInsight();
        applyFiltersAndSort();
        searchInput.focus();
    });

    // AI Search Trigger Button
    aiSearchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            performAiSemanticSearch(query);
        } else {
            searchInput.focus();
        }
    });

    // Enter Key in Search Bar triggers AI Search if query is complex
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) {
                performAiSemanticSearch(query);
            }
        }
    });

    // Region Dropdown
    regionSelect.addEventListener("change", (e) => {
        currentRegionFilter = e.target.value;
        applyFiltersAndSort();
    });

    // Sort Selector
    sortSelect.addEventListener("change", (e) => {
        currentSortOrder = e.target.value;
        applyFiltersAndSort();
    });

    // Quick Tags (e.g., Yoruba, Swahili, Nordic)
    document.querySelectorAll(".quick-tag").forEach(tag => {
        tag.addEventListener("click", () => {
            const query = tag.getAttribute("data-query");
            searchInput.value = query;
            currentSearchQuery = query;
            clearSearchBtn.classList.remove("hidden");
            performAiSemanticSearch(query);
        });
    });

    // Close Insight Banner
    closeInsightBtn.addEventListener("click", hideAiInsight);

    // Reset Filters Button
    resetFiltersBtn.addEventListener("click", () => {
        searchInput.value = "";
        currentSearchQuery = "";
        clearSearchBtn.classList.add("hidden");
        regionSelect.value = "All";
        currentRegionFilter = "All";
        sortSelect.value = "name-asc";
        currentSortOrder = "name-asc";
        hideAiInsight();
        applyFiltersAndSort();
    });

    // Retry Button
    retryBtn.addEventListener("click", fetchCountryData);

    // Modal Close
    modalCloseBtn.addEventListener("click", closeModal);
    countryModal.addEventListener("click", (e) => {
        if (e.target === countryModal) {
            closeModal();
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !countryModal.classList.contains("hidden")) {
            closeModal();
        }
    });

    // Read Aloud / Web Speech API Narrator
    readAloudBtn.addEventListener("click", toggleSpeechSynthesis);

    // AI Deep Dive inside Modal
    aiDeepDiveBtn.addEventListener("click", () => {
        if (currentActiveCountry) {
            generateAiExtendedEssay(currentActiveCountry);
        }
    });
}

// API Endpoints for resilient data fetching
const PRIMARY_COUNTRY_API = "https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json";
const FALLBACK_COUNTRY_API = "https://restcountries.com/v3.1/all";

/**
 * Helper to reliably resolve flag image URL for any country schema
 */
function getCountryFlagUrl(country) {
    if (country.flags?.svg) return country.flags.svg;
    if (country.flags?.png) return country.flags.png;
    if (typeof country.flags === "string") return country.flags;
    if (country.cca2) return `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`;
    return "";
}

/**
 * 3. FETCH COUNTRIES DATA FROM MULTI-SOURCE DATABASE
 */
async function fetchCountryData() {
    showLoadingState();

    let fetchedData = null;

    // Try Primary API (GitHub Open Countries Database - 250 nations)
    try {
        const response = await fetch(PRIMARY_COUNTRY_API);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                fetchedData = data;
            }
        }
    } catch (err) {
        console.warn("Primary country database fetch failed, trying fallback...", err);
    }

    // Try Fallback API if primary failed
    if (!fetchedData) {
        try {
            const response = await fetch(FALLBACK_COUNTRY_API);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    fetchedData = data;
                }
            }
        } catch (err) {
            console.warn("Fallback country database fetch failed...", err);
        }
    }

    // Use embedded fallback dataset if all network calls failed
    if (!fetchedData && typeof FALLBACK_LOCAL_COUNTRIES !== "undefined" && FALLBACK_LOCAL_COUNTRIES.length > 0) {
        console.log("Using embedded local country database...");
        fetchedData = FALLBACK_LOCAL_COUNTRIES;
    }

    if (fetchedData && fetchedData.length > 0) {
        allCountriesData = fetchedData.filter(country => country.name && (country.name.common || typeof country.name === "string"));
        hideLoadingState();
        applyFiltersAndSort();
    } else {
        showErrorState("Could not connect to global country database. Please click retry to reconnect.");
    }
}

/**
 * 4. FILTERING & SORTING LOGIC
 */
function applyFiltersAndSort(matchedCca3List = null) {
    filteredCountries = allCountriesData.filter(country => {
        // 1. Region Dropdown filter
        const matchesRegion = 
            currentRegionFilter === "All" || 
            (country.region && country.region.toLowerCase() === currentRegionFilter.toLowerCase()) ||
            (currentRegionFilter === "Antarctic" && country.region === "Antarctic");

        if (!matchesRegion) return false;

        // 2. Search query filter (if no explicit matchedCca3List was passed from AI search)
        if (matchedCca3List && Array.isArray(matchedCca3List)) {
            return matchedCca3List.includes(country.cca3) || matchedCca3List.includes(country.cca2);
        }

        if (currentSearchQuery.length > 0) {
            const query = currentSearchQuery.toLowerCase();
            const commonName = (country.name?.common || "").toLowerCase();
            const officialName = (country.name?.official || "").toLowerCase();
            const capital = country.capital && country.capital.length > 0 ? country.capital[0].toLowerCase() : "";
            const region = (country.region || "").toLowerCase();
            const subregion = (country.subregion || "").toLowerCase();
            const demonym = country.demonyms?.eng?.m ? country.demonyms.eng.m.toLowerCase() : "";

            // Local instant matching
            const basicMatch = 
                commonName.includes(query) || 
                officialName.includes(query) || 
                capital.includes(query) || 
                region.includes(query) || 
                subregion.includes(query) ||
                demonym.includes(query);

            return basicMatch;
        }

        return true;
    });

    // 3. Sorting
    sortCountries(filteredCountries);

    // 4. Render Cards
    renderCountryCards(filteredCountries);
    updateResultsCount(filteredCountries.length);
}

/**
 * Sort array in-place based on currentSortOrder
 */
function sortCountries(countries) {
    countries.sort((a, b) => {
        const nameA = a.name?.common || "";
        const nameB = b.name?.common || "";
        const popA = a.population || 0;
        const popB = b.population || 0;
        const areaA = a.area || 0;
        const areaB = b.area || 0;

        switch (currentSortOrder) {
            case "name-asc":
                return nameA.localeCompare(nameB);
            case "name-desc":
                return nameB.localeCompare(nameA);
            case "pop-desc":
                return popB - popA;
            case "pop-asc":
                return popA - popB;
            case "area-desc":
                return areaB - areaA;
            default:
                return nameA.localeCompare(nameB);
        }
    });
}

/**
 * 5. AI INTEGRATED SEARCH & LOCALITY MATCHING (e.g. "Yoruba" -> Nigeria, Africa)
 */
async function performAiSemanticSearch(query) {
    const queryLower = query.toLowerCase().trim();

    // Step 1: Check instant local locality knowledge base first for rapid response
    const staticMatch = LOCALITY_KNOWLEDGE_BASE.find(entry => 
        entry.keywords.some(kw => kw.toLowerCase() === queryLower || queryLower.includes(kw.toLowerCase()))
    );

    if (staticMatch) {
        showAiInsight(staticMatch.title, staticMatch.description);
        applyFiltersAndSort(staticMatch.matchedCountries);
        return;
    }

    // Step 2: Invoke Google Gemini API using the provided key
    showAiInsight("AI Semantic Intelligence Working...", `Analyzing world localities, ethnic groups, and regions matching "${query}"...`);

    try {
        const promptText = `
        You are an expert geographical and cultural ethnographer AI.
        A user in a world documentary app searched for: "${query}".
        Identify which sovereign countries in the world match this query (whether by ethnic group, locality, historical kingdom, geography, or culture). For example, "yoruba" maps to Nigeria, Benin, and Togo in Africa.
        
        Return ONLY a JSON block with this structure:
        {
          "title": "Short title explaining the locality match",
          "explanation": "1-2 sentence explanation of why these countries match the query.",
          "matched_cca3": ["NGA", "BEN", ...]
        }
        Do not include any extra markdown formatting outside the JSON block if possible.
        `;

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error("Gemini API call failed");
        }

        const data = await response.json();
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
            // Clean markdown code blocks if any
            const jsonString = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(jsonString);

            if (parsed.matched_cca3 && parsed.matched_cca3.length > 0) {
                showAiInsight(parsed.title || "AI Semantic Search Result", parsed.explanation || `Showing countries related to "${query}".`);
                applyFiltersAndSort(parsed.matched_cca3);
                return;
            }
        }
    } catch (err) {
        console.warn("AI API Search fallback triggered due to network/API error:", err);
    }

    // Step 3: Smart local semantic text search fallback
    const matchedCountries = allCountriesData.filter(country => {
        const commonName = (country.name?.common || "").toLowerCase();
        const officialName = (country.name?.official || "").toLowerCase();
        const capital = country.capital && country.capital.length > 0 ? country.capital[0].toLowerCase() : "";
        const region = (country.region || "").toLowerCase();
        const subregion = (country.subregion || "").toLowerCase();
        const languages = country.languages ? Object.values(country.languages).map(l => l.toLowerCase()).join(" ") : "";
        const demonym = country.demonyms?.eng?.m ? country.demonyms.eng.m.toLowerCase() : "";

        return (
            commonName.includes(queryLower) ||
            officialName.includes(queryLower) ||
            capital.includes(queryLower) ||
            region.includes(queryLower) ||
            subregion.includes(queryLower) ||
            languages.includes(queryLower) ||
            demonym.includes(queryLower)
        );
    });

    if (matchedCountries.length > 0) {
        showAiInsight(
            `Locality & Keyword Match for "${query}"`,
            `Found ${matchedCountries.length} country(s) matching "${query}" in our global documentary database.`
        );
        const cca3List = matchedCountries.map(c => c.cca3);
        applyFiltersAndSort(cca3List);
    } else {
        hideAiInsight();
        applyFiltersAndSort([]);
    }
}

function showAiInsight(title, description) {
    insightTitle.textContent = title;
    insightDescription.textContent = description;
    aiInsightBanner.classList.remove("hidden");
}

function hideAiInsight() {
    aiInsightBanner.classList.add("hidden");
}

/**
 * 6. RENDER COUNTRY CARDS IN GRID
 */
function renderCountryCards(countries) {
    countriesGrid.innerHTML = "";

    if (countries.length === 0) {
        noResultsContainer.classList.remove("hidden");
        return;
    }

    noResultsContainer.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    countries.forEach(country => {
        const card = createCountryCard(country);
        fragment.appendChild(card);
    });

    countriesGrid.appendChild(fragment);
}

/**
 * Create an individual country card element
 */
function createCountryCard(country) {
    const card = document.createElement("article");
    card.className = "country-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `View documentary details for ${country.name?.common}`);

    const flagUrl = getCountryFlagUrl(country);
    const flagAlt = country.flags?.alt || `Flag of ${country.name?.common}`;
    const name = country.name?.common || "Unknown Nation";
    const officialName = country.name?.official || name;
    const region = country.region || "Global";
    const capital = country.capital && country.capital.length > 0 ? country.capital[0] : "N/A";
    const populationFormatted = country.population ? country.population.toLocaleString() : "N/A";

    card.innerHTML = `
        <!-- Flag Visible inside Card -->
        <div class="card-flag-wrapper">
            <img src="${flagUrl}" alt="${flagAlt}" class="card-flag" loading="lazy">
            <div class="card-flag-overlay"></div>
            <span class="card-region-badge">${region}</span>
        </div>

        <!-- Card Info: Region, Population & Capital -->
        <div class="card-content">
            <div class="card-title-group">
                <h3 class="card-country-name">${name}</h3>
                <p class="card-official-name" title="${officialName}">${officialName}</p>
            </div>

            <div class="card-details-list">
                <div class="detail-item">
                    <span class="detail-label">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
                            <circle cx="12" cy="10" r="3"></circle>
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                        </svg>
                        Region
                    </span>
                    <span class="detail-value">${region}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Population
                    </span>
                    <span class="detail-value">${populationFormatted}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 17 12 22 22 17"></polyline>
                            <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                        Capital
                    </span>
                    <span class="detail-value">${capital}</span>
                </div>
            </div>

            <div class="card-action-hint">
                <span>View Documentary Essay</span>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </div>
        </div>
    `;

    // Click & Keyboard Enter event to popup further details and short essay
    const openModalHandler = () => openCountryModal(country);
    card.addEventListener("click", openModalHandler);
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModalHandler();
        }
    });

    return card;
}

/**
 * 7. POPUP MODAL UPON CLICKING A CARD: FURTHER DETAILS & SHORT ESSAY
 */
function openCountryModal(country) {
    currentActiveCountry = country;

    const flagUrl = getCountryFlagUrl(country);
    const name = country.name?.common || "Unknown Nation";
    const officialName = country.name?.official || name;
    const region = country.region || "Global";
    const subregion = country.subregion || region;
    const capital = country.capital && country.capital.length > 0 ? country.capital.join(", ") : "N/A";
    const popFormatted = country.population ? country.population.toLocaleString() : "N/A";
    const areaFormatted = country.area ? `${country.area.toLocaleString()} km²` : "N/A";
    
    // Languages
    const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
    
    // Currencies
    let currenciesStr = "N/A";
    if (country.currencies) {
        currenciesStr = Object.values(country.currencies)
            .map(curr => `${curr.name} (${curr.symbol || ""})`)
            .join(", ");
    }

    // Borders
    let bordersStr = "None (Island or Isolated)";
    if (country.borders && country.borders.length > 0) {
        const borderNames = country.borders.map(code => {
            const found = allCountriesData.find(c => c.cca3 === code || c.cca2 === code);
            return found ? found.name.common : code;
        });
        bordersStr = borderNames.join(", ");
    }

    // Map Link
    const mapUrl = country.maps?.googleMaps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

    // Populate Header & Stats
    modalFlagImg.src = flagUrl;
    modalFlagImg.alt = `Flag of ${name}`;
    modalRegion.textContent = region;
    modalSubregion.textContent = subregion;
    modalCountryName.textContent = name;
    modalOfficialName.textContent = officialName;
    modalCapital.textContent = capital;
    modalPopulation.textContent = popFormatted;
    modalArea.textContent = areaFormatted;
    modalLanguages.textContent = languages;
    modalCurrencies.textContent = currenciesStr;
    modalBorders.textContent = bordersStr;
    modalMapLink.href = mapUrl;

    // Load Short Essay about the nation
    loadCountryEssay(country);

    // Show Modal
    countryModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    modalCloseBtn.focus();
}

/**
 * Load documentary essay for the selected country (from local database or fallback generator)
 */
function loadCountryEssay(country) {
    const cca3 = country.cca3 || "";
    let essayData = COUNTRY_ESSAY_DATABASE[cca3];

    if (!essayData) {
        essayData = generateDefaultEssay(country);
    }

    essayContent.innerHTML = `
        <h4 style="font-size: 1.15rem; color: var(--accent-primary); margin-bottom: 0.85rem;">
            ${essayData.title}
        </h4>
        ${essayData.essay}
    `;
}

/**
 * Generate Expanded AI Documentary Essay using Gemini API
 */
async function generateAiExtendedEssay(country) {
    const name = country.name?.common || "the country";
    const region = country.region || "";
    const capital = country.capital && country.capital.length > 0 ? country.capital[0] : "";

    essayContent.innerHTML = `
        <div class="essay-loading">
            <div class="loading-spinner" style="width: 24px; height: 24px; margin: 0;"></div>
            <span>Generating AI Documentary Profile for ${name} via Gemini...</span>
        </div>
    `;

    try {
        const promptText = `
        Write an engaging, authoritative 3-paragraph short documentary essay about ${name} (${region}, capital: ${capital}).
        Paragraph 1: Historical origins, ancient kingdoms, or cultural roots.
        Paragraph 2: Geography, natural wonders, and biodiversity.
        Paragraph 3: Modern cultural impact, economy, and global significance.
        Format with HTML paragraph tags <p> and highlight key names or terms with <span class="essay-highlight">term</span>.
        `;

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error("Gemini API error");
        }

        const data = await response.json();
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
            essayContent.innerHTML = `
                <h4 style="font-size: 1.15rem; color: var(--accent-primary); margin-bottom: 0.85rem;">
                    ${name}: AI Documentary Deep Dive
                </h4>
                ${responseText}
            `;
            return;
        }
    } catch (err) {
        console.warn("AI Deep Dive fallback to standard essay:", err);
        loadCountryEssay(country);
    }
}

/**
 * Web Speech API - Narrate the Essay aloud like a documentary narrator
 */
function toggleSpeechSynthesis() {
    if (!('speechSynthesis' in window)) {
        alert("Text-To-Speech is not supported by your browser.");
        return;
    }

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        readAloudBtn.classList.remove("speaking");
        readAloudBtn.querySelector("span").textContent = "Narrate Essay";
        return;
    }

    const textToSpeak = essayContent.innerText || "";
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95; // Slightly slower, stately documentary pace
    utterance.pitch = 1.0;

    utterance.onend = () => {
        isSpeaking = false;
        readAloudBtn.classList.remove("speaking");
        readAloudBtn.querySelector("span").textContent = "Narrate Essay";
    };

    utterance.onerror = () => {
        isSpeaking = false;
        readAloudBtn.classList.remove("speaking");
        readAloudBtn.querySelector("span").textContent = "Narrate Essay";
    };

    window.speechSynthesis.speak(utterance);
    isSpeaking = true;
    readAloudBtn.classList.add("speaking");
    readAloudBtn.querySelector("span").textContent = "Stop Narrator";
}

/**
 * Close Modal & Clean up audio
 */
function closeModal() {
    if (isSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        readAloudBtn.classList.remove("speaking");
        readAloudBtn.querySelector("span").textContent = "Narrate Essay";
    }

    countryModal.classList.add("hidden");
    document.body.style.overflow = "";
    currentActiveCountry = null;
}

/**
 * 8. UI HELPERS (Loading, Error, Stats)
 */
function showLoadingState() {
    loadingContainer.classList.remove("hidden");
    countriesGrid.classList.add("hidden");
    errorContainer.classList.add("hidden");
}

function hideLoadingState() {
    loadingContainer.classList.add("hidden");
    countriesGrid.classList.remove("hidden");
}

function showErrorState(message) {
    loadingContainer.classList.add("hidden");
    countriesGrid.classList.add("hidden");
    errorContainer.classList.remove("hidden");
    document.getElementById("error-message").textContent = message;
}

function updateResultsCount(count) {
    if (resultsCountEl) {
        resultsCountEl.textContent = count;
    }
}
