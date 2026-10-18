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
let selectedCompareCountries = []; // Holds up to 3 selected country objects
let isCompareSpeaking = false;

// DOM Elements
const countriesGrid = document.getElementById("countries-grid");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search-btn");
const filterToggleBtn = document.getElementById("filter-toggle-btn");
const filterPanel = document.getElementById("filter-panel");
const activeFilterBadge = document.getElementById("active-filter-badge");
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

// Country Detail Modal DOM Elements
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

// Comparison Feature DOM Elements
const compareTray = document.getElementById("compare-tray");
const compareTrayCount = document.getElementById("compare-tray-count");
const compareTrayItems = document.getElementById("compare-tray-items");
const compareClearBtn = document.getElementById("compare-clear-btn");
const compareLaunchBtn = document.getElementById("compare-launch-btn");
const compareLaunchCount = document.getElementById("compare-launch-count");
const comparisonModal = document.getElementById("comparison-modal");
const comparisonModalCloseBtn = document.getElementById("comparison-modal-close-btn");
const comparisonGrid = document.getElementById("comparison-grid");
const generateCompareEssayBtn = document.getElementById("generate-compare-essay-btn");
const compareEssayContent = document.getElementById("compare-essay-content");
const compareReadAloudBtn = document.getElementById("compare-read-aloud-btn");

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

    // Filter Toggle Button
    if (filterToggleBtn && filterPanel) {
        filterToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const willOpen = filterPanel.classList.contains("hidden");
            filterPanel.classList.toggle("hidden", !willOpen);
            filterToggleBtn.setAttribute("aria-expanded", willOpen);
            filterToggleBtn.classList.toggle("active", willOpen);
        });

        // Close Filter Panel when clicking outside
        document.addEventListener("click", (e) => {
            if (filterPanel && !filterPanel.contains(e.target) && filterToggleBtn && !filterToggleBtn.contains(e.target)) {
                filterPanel.classList.add("hidden");
                filterToggleBtn.setAttribute("aria-expanded", "false");
                filterToggleBtn.classList.remove("active");
            }
        });
    }

    // Enter Key in Search Bar triggers search
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
        updateFilterBadge();
        applyFiltersAndSort();
    });

    // Sort Selector
    sortSelect.addEventListener("change", (e) => {
        currentSortOrder = e.target.value;
        updateFilterBadge();
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

    // Comparison Event Listeners
    if (compareClearBtn) {
        compareClearBtn.addEventListener("click", clearCompareSelection);
    }

    if (compareLaunchBtn) {
        compareLaunchBtn.addEventListener("click", openComparisonModal);
    }

    if (comparisonModalCloseBtn) {
        comparisonModalCloseBtn.addEventListener("click", closeComparisonModal);
    }

    if (comparisonModal) {
        comparisonModal.addEventListener("click", (e) => {
            if (e.target === comparisonModal) {
                closeComparisonModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && comparisonModal && !comparisonModal.classList.contains("hidden")) {
            closeComparisonModal();
        }
    });

    if (generateCompareEssayBtn) {
        generateCompareEssayBtn.addEventListener("click", generateComparativeEssay);
    }

    if (compareReadAloudBtn) {
        compareReadAloudBtn.addEventListener("click", toggleCompareSpeechSynthesis);
    }
}

/**
 * Update the active filter count badge on the Filter button
 */
function updateFilterBadge() {
    let count = 0;
    if (currentRegionFilter !== "All") count++;
    if (currentSortOrder !== "name-asc") count++;
    if (activeFilterBadge) {
        if (count > 0) {
            activeFilterBadge.textContent = count;
            activeFilterBadge.classList.remove("hidden");
            if (filterToggleBtn) filterToggleBtn.classList.add("has-active-filters");
        } else {
            activeFilterBadge.classList.add("hidden");
            if (filterToggleBtn) filterToggleBtn.classList.remove("has-active-filters");
        }
    }
}

/**
 * Resolve country population from the global verified database or country object
 */
function resolveCountryPopulation(country) {
    if (typeof WORLD_POPULATION_DATA !== "undefined") {
        if (country.cca3 && WORLD_POPULATION_DATA[country.cca3] !== undefined) {
            return WORLD_POPULATION_DATA[country.cca3];
        }
        if (country.cca2 && WORLD_POPULATION_DATA[country.cca2] !== undefined) {
            return WORLD_POPULATION_DATA[country.cca2];
        }
        const commonName = (country.name?.common || "").toLowerCase();
        if (WORLD_POPULATION_DATA[commonName] !== undefined) {
            return WORLD_POPULATION_DATA[commonName];
        }
        const officialName = (country.name?.official || "").toLowerCase();
        if (WORLD_POPULATION_DATA[officialName] !== undefined) {
            return WORLD_POPULATION_DATA[officialName];
        }
    }
    if (typeof country.population === "number") {
        return country.population;
    }
    return 0;
}

/**
 * Cleanly format population with thousands commas or uninhabited tag
 */
function formatPopulationDisplay(pop) {
    if (pop === 0 || pop === "0") {
        return "0 (Uninhabited)";
    }
    if (typeof pop === "number") {
        return pop.toLocaleString();
    }
    return pop ? String(pop) : "0";
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
        allCountriesData = fetchedData
            .filter(country => country.name && (country.name.common || typeof country.name === "string"))
            .map(country => {
                // Fill population voids using verified global population database
                country.population = resolveCountryPopulation(country);
                return country;
            });
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
    const cca3 = country.cca3 || country.cca2 || "";
    const isSelected = selectedCompareCountries.some(c => (c.cca3 && c.cca3 === cca3) || (c.cca2 && c.cca2 === country.cca2));
    
    card.className = `country-card ${isSelected ? 'selected-for-compare' : ''}`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("data-cca3", cca3);
    card.setAttribute("aria-label", `View documentary details for ${country.name?.common}`);

    const flagUrl = getCountryFlagUrl(country);
    const flagAlt = country.flags?.alt || `Flag of ${country.name?.common}`;
    const name = country.name?.common || "Unknown Nation";
    const officialName = country.name?.official || name;
    const region = country.region || "Global";
    const capital = country.capital && country.capital.length > 0 ? country.capital[0] : "N/A";
    const populationFormatted = formatPopulationDisplay(country.population);

    card.innerHTML = `
        <!-- Flag Visible inside Card -->
        <div class="card-flag-wrapper">
            <button class="card-compare-btn ${isSelected ? 'active' : ''}" type="button" title="${isSelected ? 'Remove from comparison' : 'Add to comparison (up to 3)'}">
                <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>${isSelected ? 'Compared' : 'Compare'}</span>
            </button>
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

    // Compare button handler (stops card click from opening single modal)
    const compareBtn = card.querySelector(".card-compare-btn");
    if (compareBtn) {
        compareBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleCompareCountry(country);
        });
    }

    // Click & Keyboard Enter event to popup further details and short essay
    const openModalHandler = () => openCountryModal(country);
    card.addEventListener("click", (e) => {
        if (e.target.closest(".card-compare-btn")) return;
        openModalHandler();
    });
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            if (e.target.closest(".card-compare-btn")) return;
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
    const popFormatted = formatPopulationDisplay(country.population);
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

/* ==========================================================================
   9. COUNTRY COMPARISON CONTROLLER
   Manages multi-country selection (max 3), bottom tray, side-by-side metrics,
   and Gemini AI comparative documentary essays with Web Speech narration.
   ========================================================================== */

/**
 * Toggle selection of a country for comparison (up to 3)
 */
function toggleCompareCountry(country) {
    const cca3 = country.cca3 || country.cca2 || "";
    const index = selectedCompareCountries.findIndex(c => (c.cca3 && c.cca3 === cca3) || (c.cca2 && c.cca2 === country.cca2));

    if (index > -1) {
        // Deselect
        selectedCompareCountries.splice(index, 1);
    } else {
        // Select if under max limit of 3
        if (selectedCompareCountries.length >= 3) {
            alert("You can compare up to 3 countries at a time. Please remove one from your comparison tray first.");
            return;
        }
        selectedCompareCountries.push(country);
    }

    updateCompareUI();
}

/**
 * Remove a single country from comparison by cca3 or cca2
 */
function removeCompareCountry(code) {
    selectedCompareCountries = selectedCompareCountries.filter(c => c.cca3 !== code && c.cca2 !== code);
    updateCompareUI();
}

/**
 * Clear all selected comparison countries
 */
function clearCompareSelection() {
    selectedCompareCountries = [];
    updateCompareUI();
}

/**
 * Update the bottom tray, counters, and card states across the grid
 */
function updateCompareUI() {
    const count = selectedCompareCountries.length;

    // Update Bottom Tray Visibility & Count
    if (compareTray) {
        if (count > 0) {
            compareTray.classList.remove("hidden");
        } else {
            compareTray.classList.add("hidden");
        }
    }

    if (compareTrayCount) {
        compareTrayCount.textContent = `${count} / 3`;
    }

    if (compareLaunchBtn) {
        compareLaunchBtn.disabled = count < 2;
    }

    if (compareLaunchCount) {
        compareLaunchCount.textContent = count;
    }

    // Render Country Chips inside Tray
    if (compareTrayItems) {
        compareTrayItems.innerHTML = "";
        selectedCompareCountries.forEach(country => {
            const flagUrl = getCountryFlagUrl(country);
            const name = country.name?.common || "Nation";
            const code = country.cca3 || country.cca2 || "";

            const chip = document.createElement("div");
            chip.className = "compare-chip";
            chip.innerHTML = `
                <img src="${flagUrl}" alt="${name}" class="compare-chip-flag">
                <span>${name}</span>
                <button class="compare-chip-remove" type="button" aria-label="Remove ${name}" title="Remove">✕</button>
            `;

            const removeBtn = chip.querySelector(".compare-chip-remove");
            removeBtn.addEventListener("click", () => {
                removeCompareCountry(code);
            });

            compareTrayItems.appendChild(chip);
        });
    }

    // Synchronize Card Buttons in Grid
    const cards = document.querySelectorAll(".country-card");
    cards.forEach(card => {
        const cardCca3 = card.getAttribute("data-cca3");
        const isSelected = selectedCompareCountries.some(c => (c.cca3 && c.cca3 === cardCca3) || (c.cca2 && c.cca2 === cardCca3));

        card.classList.toggle("selected-for-compare", isSelected);
        const btn = card.querySelector(".card-compare-btn");
        if (btn) {
            btn.classList.toggle("active", isSelected);
            btn.title = isSelected ? "Remove from comparison" : "Add to comparison (up to 3)";
            const span = btn.querySelector("span");
            if (span) {
                span.textContent = isSelected ? "Compared" : "Compare";
            }
        }
    });
}

/**
 * Open the Country Comparison Modal with side-by-side indicators
 */
function openComparisonModal() {
    if (selectedCompareCountries.length < 2) {
        alert("Please select at least 2 countries to compare.");
        return;
    }

    // Determine max population and max area for comparative badges
    const validPopulations = selectedCompareCountries.map(c => c.population || 0);
    const maxPop = Math.max(...validPopulations);
    const validAreas = selectedCompareCountries.map(c => c.area || 0);
    const maxArea = Math.max(...validAreas);

    // Populate Side-by-Side Grid
    if (comparisonGrid) {
        comparisonGrid.innerHTML = "";
        selectedCompareCountries.forEach(country => {
            const flagUrl = getCountryFlagUrl(country);
            const name = country.name?.common || "Unknown Nation";
            const officialName = country.name?.official || name;
            const region = country.region || "Global";
            const subregion = country.subregion || region;
            const capital = country.capital && country.capital.length > 0 ? country.capital.join(", ") : "N/A";
            const pop = country.population || 0;
            const popFormatted = formatPopulationDisplay(pop);
            const area = country.area || 0;
            const areaFormatted = area ? `${area.toLocaleString()} km²` : "N/A";

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
                bordersStr = `${country.borders.length} (${borderNames.join(", ")})`;
            }

            const isLargestPop = maxPop > 0 && pop === maxPop && selectedCompareCountries.length > 1;
            const isLargestArea = maxArea > 0 && area === maxArea && selectedCompareCountries.length > 1;

            const col = document.createElement("div");
            col.className = "compare-col";
            col.innerHTML = `
                <div class="compare-col-header">
                    <img src="${flagUrl}" alt="Flag of ${name}" class="compare-col-flag">
                    <div class="compare-col-overlay"></div>
                    <span class="compare-col-badge">${region}</span>
                </div>
                <div class="compare-col-title-area">
                    <h3 class="compare-col-name">${name}</h3>
                    <p class="compare-col-official" title="${officialName}">${officialName}</p>
                </div>
                <div class="compare-metrics-list">
                    <div class="compare-metric-row">
                        <span class="compare-metric-label">Capital City</span>
                        <span class="compare-metric-value">${capital}</span>
                    </div>
                    <div class="compare-metric-row">
                        <span class="compare-metric-label">Subregion</span>
                        <span class="compare-metric-value">${subregion}</span>
                    </div>
                    <div class="compare-metric-row">
                        <span class="compare-metric-label">Population</span>
                        <span class="compare-metric-value">
                            ${popFormatted}
                            ${isLargestPop ? '<span class="metric-highlight-badge">Largest</span>' : ''}
                        </span>
                    </div>
                    <div class="compare-metric-row">
                        <span class="compare-metric-label">Land Area</span>
                        <span class="compare-metric-value">
                            ${areaFormatted}
                            ${isLargestArea ? '<span class="metric-highlight-badge">Largest</span>' : ''}
                        </span>
                    </div>
                    <div class="compare-metric-row">
                        <span class="compare-metric-label">Official Languages</span>
                        <span class="compare-metric-value">${languages}</span>
                    </div>
                    <div class="compare-metric-row">
                        <span class="compare-metric-label">Currency</span>
                        <span class="compare-metric-value">${currenciesStr}</span>
                    </div>
                    <div class="compare-metric-row">
                        <span class="compare-metric-label">Bordering Nations</span>
                        <span class="compare-metric-value">${bordersStr}</span>
                    </div>
                </div>
            `;

            comparisonGrid.appendChild(col);
        });
    }

    // Reset Comparative Essay Box
    if (compareEssayContent) {
        const countryNames = selectedCompareCountries.map(c => c.name?.common).join(", ");
        compareEssayContent.innerHTML = `
            <div class="compare-essay-placeholder">
                <p>Click <strong>"Generate Comparative Essay"</strong> above to generate an AI documentary essay analyzing <strong>${countryNames}</strong> side-by-side.</p>
            </div>
        `;
    }

    if (compareReadAloudBtn) {
        compareReadAloudBtn.classList.add("hidden");
    }

    // Show modal & prevent background scrolling
    if (comparisonModal) {
        comparisonModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        if (comparisonModalCloseBtn) {
            comparisonModalCloseBtn.focus();
        }
    }
}

/**
 * Close the Country Comparison Modal
 */
function closeComparisonModal() {
    if (isCompareSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        isCompareSpeaking = false;
        if (compareReadAloudBtn) {
            compareReadAloudBtn.classList.remove("speaking");
            const label = compareReadAloudBtn.querySelector("span");
            if (label) label.textContent = "Narrate Essay";
        }
    }

    if (comparisonModal) {
        comparisonModal.classList.add("hidden");
    }
    document.body.style.overflow = "";
}

/**
 * Generate Comparative Documentary Essay via Google Gemini AI
 */
async function generateComparativeEssay() {
    if (selectedCompareCountries.length < 2) return;

    const countryNames = selectedCompareCountries.map(c => c.name?.common || "Nation");
    const namesList = countryNames.join(", ");

    if (compareEssayContent) {
        compareEssayContent.innerHTML = `
            <div class="essay-loading" style="padding: 2rem 0; justify-content: center;">
                <div class="loading-spinner" style="width: 28px; height: 28px; margin: 0;"></div>
                <span>Synthesizing Comparative Documentary Essay for ${namesList} via Gemini AI...</span>
            </div>
        `;
    }

    // Build context summary for the prompt
    const countryContexts = selectedCompareCountries.map(c => {
        const name = c.name?.common;
        const region = c.region;
        const capital = c.capital ? c.capital.join(", ") : "N/A";
        const pop = formatPopulationDisplay(c.population);
        const area = c.area ? `${c.area.toLocaleString()} km²` : "N/A";
        const lang = c.languages ? Object.values(c.languages).join(", ") : "N/A";
        return `${name} (Region: ${region}, Capital: ${capital}, Population: ${pop}, Area: ${area}, Languages: ${lang})`;
    }).join("\n");

    const promptText = `
    You are a world-renowned documentary historian, geographer, and cultural ethnographer.
    Write an authoritative, engaging, and literary comparative essay comparing these ${selectedCompareCountries.length} nations:
    ${countryContexts}

    Structure the comparative essay in 4 distinct sections with clear thematic subheadings:
    1. Geographic & Environmental Juxtaposition: Contrast their terrain, scale, climate, and ecological significance.
    2. Historical Crossroads & Divergence: Analyze their civilizational roots, historical trajectories, and how their paths to nationhood compare.
    3. Societal & Cultural Fabric: Compare their demographic textures, languages, core cultural values, and arts.
    4. Contemporary Global Significance: Evaluate their modern economic engines, geopolitical roles, and shared or contrasting futures.

    Formatting requirements:
    - Use HTML tags: <h4 style="font-size: 1.15rem; color: var(--accent-primary); margin: 1.25rem 0 0.5rem;">Section Title</h4>
    - Wrap paragraphs in <p style="margin-bottom: 1rem; line-height: 1.8;">...</p>
    - Highlight notable historical figures, treaties, geographic landmarks, or cultural terms with <span class="essay-highlight">term</span>.
    - Write with documentary gravitas, rich prose, and insightful comparative synthesis.
    `;

    try {
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
            throw new Error(`Gemini API error status: ${response.status}`);
        }

        const data = await response.json();
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
            const cleanedHtml = responseText.replace(/```html/gi, "").replace(/```/g, "").trim();
            if (compareEssayContent) {
                compareEssayContent.innerHTML = `
                    <div style="margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color);">
                        <span class="compare-tray-badge">AI Comparative Synthesis</span>
                        <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-top: 0.35rem;">
                            ${namesList}: A Comparative Documentary Study
                        </h3>
                    </div>
                    ${cleanedHtml}
                `;
            }
            if (compareReadAloudBtn) {
                compareReadAloudBtn.classList.remove("hidden");
            }
            return;
        }
    } catch (err) {
        console.warn("Gemini Comparative Essay API call failed, generating documentary essay fallback:", err);
    }

    // Fallback Documentary Synthesis if API offline
    const fallbackHtml = generateFallbackComparativeEssay(selectedCompareCountries);
    if (compareEssayContent) {
        compareEssayContent.innerHTML = `
            <div style="margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color);">
                <span class="compare-tray-badge">Documentary Synthesis</span>
                <h3 style="font-size: 1.35rem; color: var(--text-primary); margin-top: 0.35rem;">
                    ${namesList}: A Comparative Study
                </h3>
            </div>
            ${fallbackHtml}
        `;
    }
    if (compareReadAloudBtn) {
        compareReadAloudBtn.classList.remove("hidden");
    }
}

/**
 * High-quality fallback generator when network/API is unavailable
 */
function generateFallbackComparativeEssay(countries) {
    const names = countries.map(c => c.name?.common || "Nation");
    const nameString = names.join(" and ");
    const regions = [...new Set(countries.map(c => c.region || "Global"))].join(" and ");
    
    // Sort by population to highlight demographic contrast
    const sortedByPop = [...countries].sort((a, b) => (b.population || 0) - (a.population || 0));
    const mostPopulous = sortedByPop[0];
    const leastPopulous = sortedByPop[sortedByPop.length - 1];

    // Sort by area
    const sortedByArea = [...countries].sort((a, b) => (b.area || 0) - (a.area || 0));
    const largestArea = sortedByArea[0];

    return `
        <h4 style="font-size: 1.15rem; color: var(--accent-primary); margin: 1.25rem 0 0.5rem;">
            1. Geographic & Environmental Juxtaposition
        </h4>
        <p style="margin-bottom: 1rem; line-height: 1.8;">
            Encompassing the distinct landscapes of <span class="essay-highlight">${regions}</span>, the comparison between <strong>${nameString}</strong> illustrates the profound relationship between sovereign geography and human habitation. <strong>${largestArea.name?.common}</strong> spans an expansive territory of <span class="essay-highlight">${largestArea.area ? largestArea.area.toLocaleString() + ' km²' : 'vast territories'}</span>, presenting diverse ecological biomes, river basins, and topographical variety. In contrast, its comparative counterparts occupy distinctive spatial footprints that have channeled population settlements toward urban centers and coastal gateways.
        </p>

        <h4 style="font-size: 1.15rem; color: var(--accent-primary); margin: 1.25rem 0 0.5rem;">
            2. Historical Crossroads & Divergence
        </h4>
        <p style="margin-bottom: 1rem; line-height: 1.8;">
            Across centuries of human history, <strong>${nameString}</strong> have navigated distinct pathways to sovereignty. While one has been shaped by ancient maritime commerce and territorial alliances, others developed around agrarian dynasties, regional confederations, and constitutional evolutions. The emergence of modern statehood for each nation reflects enduring struggles for self-determination, codified governance, and the preservation of indigenous cultural memory amidst an interconnected world order.
        </p>

        <h4 style="font-size: 1.15rem; color: var(--accent-primary); margin: 1.25rem 0 0.5rem;">
            3. Societal & Demographic Fabric
        </h4>
        <p style="margin-bottom: 1rem; line-height: 1.8;">
            Demographically, these nations exhibit compelling contrasts. <strong>${mostPopulous.name?.common}</strong> commands a vibrant populace of <span class="essay-highlight">${formatPopulationDisplay(mostPopulous.population)}</span> citizens, anchoring significant regional human capital and linguistic pluralism. Meanwhile, <strong>${leastPopulous.name?.common}</strong>, with a population of <span class="essay-highlight">${formatPopulationDisplay(leastPopulous.population)}</span>, models a distinct communal density and social structure. Linguistic diversity across these sovereign borders encompasses languages such as <span class="essay-highlight">${countries.map(c => c.languages ? Object.values(c.languages).join(", ") : "indigenous tongues").join("; ")}</span>, each expressing centuries of cultural wisdom and folklore.
        </p>

        <h4 style="font-size: 1.15rem; color: var(--accent-primary); margin: 1.25rem 0 0.5rem;">
            4. Contemporary Global Horizons
        </h4>
        <p style="margin-bottom: 1rem; line-height: 1.8;">
            In the contemporary geopolitical landscape, <strong>${nameString}</strong> each fulfill vital multilateral roles. From international commerce and natural resource stewardship to technological innovation and cultural diplomacy, their respective capitals—<span class="essay-highlight">${countries.map(c => c.capital ? c.capital.join(", ") : "national capitals").join(", ")}</span>—serve as command hubs for international diplomacy. Examining these nations side-by-side demonstrates both the extraordinary diversity of human organization and the shared planetary challenges uniting them.
        </p>
    `;
}

/**
 * Web Speech API - Narrate Comparative Essay aloud
 */
function toggleCompareSpeechSynthesis() {
    if (!('speechSynthesis' in window)) {
        alert("Text-To-Speech is not supported by your browser.");
        return;
    }

    if (isCompareSpeaking) {
        window.speechSynthesis.cancel();
        isCompareSpeaking = false;
        if (compareReadAloudBtn) {
            compareReadAloudBtn.classList.remove("speaking");
            const span = compareReadAloudBtn.querySelector("span");
            if (span) span.textContent = "Narrate Essay";
        }
        return;
    }

    const textToSpeak = compareEssayContent ? compareEssayContent.innerText : "";
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
        isCompareSpeaking = false;
        if (compareReadAloudBtn) {
            compareReadAloudBtn.classList.remove("speaking");
            const span = compareReadAloudBtn.querySelector("span");
            if (span) span.textContent = "Narrate Essay";
        }
    };

    utterance.onerror = () => {
        isCompareSpeaking = false;
        if (compareReadAloudBtn) {
            compareReadAloudBtn.classList.remove("speaking");
            const span = compareReadAloudBtn.querySelector("span");
            if (span) span.textContent = "Narrate Essay";
        }
    };

    window.speechSynthesis.speak(utterance);
    isCompareSpeaking = true;
    if (compareReadAloudBtn) {
        compareReadAloudBtn.classList.add("speaking");
        const span = compareReadAloudBtn.querySelector("span");
        if (span) span.textContent = "Stop Narrator";
    }
}
