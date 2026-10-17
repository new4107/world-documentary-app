/**
 * Verified World Bank & UN Population Database for all 250 World Nations & Territories
 */
var WORLD_POPULATION_DATA = {
  "AFG": 43844000,
  "ALA": 30654,
  "ALB": 2363314,
  "DZA": 47400000,
  "ASM": 49710,
  "AND": 88306,
  "AGO": 36170961,
  "AIA": 15753,
  "ATG": 103603,
  "ARG": 46735004,
  "ARM": 3081100,
  "ABW": 107566,
  "AUS": 27400013,
  "AUT": 9200931,
  "AZE": 10241722,
  "BHR": 1594654,
  "BGD": 169828911,
  "BRB": 267800,
  "BLR": 9109280,
  "BEL": 11825551,
  "BLZ": 417634,
  "BEN": 13224860,
  "BMU": 63648,
  "BTN": 784043,
  "BOL": 11312620,
  "BES": 26552,
  "BIH": 3422000,
  "BWA": 2359609,
  "BRA": 213421037,
  "BRN": 455500,
  "BGR": 6437360,
  "BFA": 24070553,
  "BDI": 12332788,
  "KHM": 17577760,
  "CMR": 29442327,
  "CAN": 41548787,
  "CPV": 491233,
  "CYM": 81546,
  "CAF": 6470307,
  "TCD": 19340757,
  "CHL": 20206953,
  "CHN": 1408280000,
  "CXR": 1843,
  "CCK": 596,
  "COL": 53057212,
  "COM": 870038,
  "COG": 6142180,
  "COK": 15040,
  "CRI": 5309625,
  "HRV": 3866233,
  "CUB": 9748007,
  "CUW": 156115,
  "CYP": 966400,
  "CZE": 10876875,
  "COD": 112832000,
  "DNK": 6004342,
  "DJI": 1066809,
  "DMA": 67408,
  "DOM": 10771504,
  "ECU": 18103660,
  "EGY": 107271260,
  "SLV": 6029976,
  "GNQ": 1668768,
  "ERI": 3607000,
  "EST": 1369995,
  "SWZ": 1235549,
  "ETH": 111652998,
  "FLK": 3793,
  "FRO": 55146,
  "FJI": 900869,
  "FIN": 5645651,
  "FRA": 68688000,
  "GUF": 292354,
  "PYF": 279500,
  "GAB": 2469296,
  "GEO": 3704500,
  "DEU": 83517030,
  "GHA": 33742380,
  "GIB": 34003,
  "GRC": 10400720,
  "GRL": 56542,
  "GRD": 109021,
  "GLP": 373791,
  "GUM": 153836,
  "GTM": 18079810,
  "GGY": 64781,
  "GIN": 14363931,
  "GNB": 1781308,
  "GUY": 772975,
  "HTI": 11867032,
  "HND": 9892632,
  "HKG": 7527500,
  "HUN": 9539502,
  "ISL": 391810,
  "IND": 1417492000,
  "IDN": 284438782,
  "IRN": 85961000,
  "IRQ": 46118793,
  "IRL": 5458600,
  "ISR": 10119400,
  "ITA": 58919230,
  "CIV": 29389150,
  "JAM": 2825544,
  "JPN": 123300000,
  "JEY": 103267,
  "JOR": 11734000,
  "KAZ": 20407844,
  "KEN": 53330978,
  "KIR": 120740,
  "XKX": 1873000,
  "KWT": 4881254,
  "KGZ": 7281800,
  "LAO": 7647000,
  "LVA": 1830400,
  "LBN": 5490000,
  "LSO": 2116427,
  "LBR": 5248621,
  "LBY": 7459000,
  "LIE": 40900,
  "LTU": 2894548,
  "LUX": 681973,
  "MAC": 685900,
  "MDG": 31727042,
  "MWI": 20734262,
  "MYS": 34231700,
  "MDV": 515132,
  "MLI": 22395489,
  "MLT": 574250,
  "IMN": 84530,
  "MHL": 42418,
  "MTQ": 339897,
  "MRT": 4927532,
  "MUS": 1243741,
  "MYT": 337011,
  "MEX": 130575786,
  "FSM": 105564,
  "MDA": 2381300,
  "MCO": 38423,
  "MNG": 3544835,
  "MNE": 623327,
  "MSR": 4389,
  "MAR": 36828330,
  "MOZ": 34090466,
  "MMR": 51316756,
  "NAM": 3022401,
  "NRU": 11680,
  "NPL": 29911840,
  "NLD": 18080943,
  "NCL": 264596,
  "NZL": 5324700,
  "NIC": 6803886,
  "NER": 26312034,
  "NGA": 223800000,
  "NIU": 1937,
  "NFK": 2188,
  "PRK": 25950000,
  "MKD": 1826247,
  "MNP": 47329,
  "NOR": 5606944,
  "OMN": 5306976,
  "PAK": 241499431,
  "PLW": 16733,
  "PSE": 5483450,
  "PAN": 4064780,
  "PNG": 11781559,
  "PRY": 6109644,
  "PER": 34350244,
  "PHL": 114123600,
  "PCN": 50,
  "POL": 37401000,
  "PRT": 10749635,
  "PRI": 3203295,
  "QAT": 3173024,
  "REU": 896175,
  "ROU": 19036031,
  "RUS": 146028325,
  "RWA": 14104969,
  "SHN": 4439,
  "KNA": 51320,
  "LCA": 184100,
  "SPM": 5888,
  "VCT": 110872,
  "BLM": 10289,
  "MAF": 32489,
  "WSM": 205557,
  "SMR": 34132,
  "STP": 209607,
  "SAU": 35300280,
  "SEN": 18593258,
  "SRB": 6567783,
  "SYC": 122729,
  "SLE": 9077691,
  "SGP": 6036900,
  "SXM": 41349,
  "SVK": 5413813,
  "SVN": 2130638,
  "SLB": 750325,
  "SOM": 19655000,
  "ZAF": 63100945,
  "KOR": 51159889,
  "SSD": 15786898,
  "ESP": 49315949,
  "LKA": 21763170,
  "SDN": 51662000,
  "SUR": 616500,
  "SWE": 10596652,
  "CHE": 9082848,
  "SYR": 25620000,
  "TWN": 23337936,
  "TJK": 10499000,
  "TZA": 68153004,
  "THA": 65859640,
  "BHS": 398165,
  "GMB": 2422712,
  "TLS": 1391221,
  "TGO": 8095498,
  "TKL": 1499,
  "TON": 100179,
  "TTO": 1368333,
  "TUN": 11972169,
  "TUR": 85664944,
  "TKM": 7057841,
  "TCA": 45114,
  "TUV": 10643,
  "UGA": 45905417,
  "UKR": 32862000,
  "ARE": 10678556,
  "GBR": 68265209,
  "USA": 340110988,
  "URY": 3499451,
  "UZB": 37859698,
  "VUT": 321409,
  "VAT": 825,
  "VEN": 28517000,
  "VNM": 101343800,
  "VGB": 31305,
  "VIR": 87146,
  "WLF": 11246,
  "ESH": 600904,
  "YEM": 32684503,
  "ZMB": 19693423,
  "ZWE": 17073087,
  "ATA": 1000,
  "SGS": 30,
  "SJM": 2500,
  "UMI": 300,
  "ATF": 400,
  "BVT": 0,
  "HMD": 0,
  "IOT": 3000,
  "UNK": 1873000
};

/**
 * TERRA // World Documentary - Locality & Cultural Heritage Knowledge Base
 * Provides intelligent locality mapping (e.g., 'yoruba' -> Nigeria, Africa)
 * and rich documentary essays for nations around the world.
 */

const LOCALITY_KNOWLEDGE_BASE = [
    {
        keywords: ["yoruba", "yorubaland", "ifa", "oyo", "ile-ife", "lagos", "oduduwa", "igbo", "hausa"],
        matchedCountries: ["NGA", "BEN", "TGO"],
        title: "Yoruba Cultural Heritage & Locality",
        description: "The Yoruba people are one of the largest ethnic groups in Africa, predominantly inhabiting Nigeria, Benin, and Togo, known for ancient city-states like Ile-Ife and Oyo."
    },
    {
        keywords: ["swahili", "zanzibar", "serengeti", "kilimanjaro", "masai", "maasai"],
        matchedCountries: ["KEN", "TZA", "UGA"],
        title: "Swahili Coast & East African Heritage",
        description: "The Swahili coast and language culture spans Kenya, Tanzania, and Uganda, uniting trade, Indian Ocean maritime history, and rich savannah ecosystems."
    },
    {
        keywords: ["zulu", "xhosa", "mandela", "table mountain", "kruger", "springbok"],
        matchedCountries: ["ZAF", "LSO", "SWZ"],
        title: "Southern African Heritage & Zulu/Xhosa Locality",
        description: "Home to the Zulu and Xhosa kingdoms, South Africa and its neighbors boast incredible biodiversity and a dramatic history of resilience and reconciliation."
    },
    {
        keywords: ["ashanti", "akan", "kumasi", "gold coast"],
        matchedCountries: ["GHA", "CIV"],
        title: "Ashanti Kingdom & Akan Locality",
        description: "The Ashanti Empire in modern-day Ghana was famed for its wealth in gold, intricate Kente cloth weaving, and legendary resistance against colonial rule."
    },
    {
        keywords: ["berber", "amazigh", "sahara", "maghreb", "atlas mountains"],
        matchedCountries: ["MAR", "DZA", "TUN", "LBY"],
        title: "Amazigh / Berber Heritage of the Maghreb",
        description: "The Amazigh (Berber) peoples are the indigenous inhabitants of North Africa, traversing the Atlas Mountains and the Sahara Desert for millennia."
    },
    {
        keywords: ["nordic", "viking", "fjords", "scandinavia", "sami", "lapland"],
        matchedCountries: ["NOR", "SWE", "DNK", "FIN", "ISL"],
        title: "Nordic & Scandinavian Locality",
        description: "The Nordic nations share Norse Viking history, dramatic fjord landscapes, Arctic Sami culture, and world-renowned social models."
    },
    {
        keywords: ["celtic", "highlands", "gaelic", "druids", "emerald isle"],
        matchedCountries: ["IRL", "GBR"],
        title: "Celtic Heritage & British Isles",
        description: "Rich in Celtic mythology, medieval castles, and ancient stone monuments, Ireland and the United Kingdom have shaped world literature and industrial history."
    },
    {
        keywords: ["samurai", "shinto", "edo", "kyoto", "mt fuji", "ninja"],
        matchedCountries: ["JPN"],
        title: "Japanese Heritage: Samurai & Shinto Tradition",
        description: "Japan's locality is defined by an exquisite harmony of ancient Shinto traditions, Samurai martial philosophy, and ultra-modern innovation."
    },
    {
        keywords: ["mayan", "aztec", "chichen itza", "yucatan", "mesoamerica"],
        matchedCountries: ["MEX", "GTM", "BLZ", "HND"],
        title: "Mesoamerican Heritage: Maya & Aztec Civilizations",
        description: "The Mayan and Aztec civilizations erected monumental pyramids and advanced astronomical systems across Mexico and Central America."
    },
    {
        keywords: ["inca", "machu picchu", "andes", "quechua", "patagonia"],
        matchedCountries: ["PER", "BOL", "ECU", "CHL", "ARG"],
        title: "Andean & Inca Heritage",
        description: "Spanning the mighty Andes mountains, the Inca Empire constructed breathtaking stone citadels like Machu Picchu in Peru."
    },
    {
        keywords: ["caribbean", "reggae", "calypso", "antilles", "west indies"],
        matchedCountries: ["JAM", "TTO", "BRB", "BHS", "CUB", "DOM", "HTI"],
        title: "Caribbean & West Indies Locality",
        description: "The Caribbean islands blend African, European, and indigenous Taino cultures, famous for vibrant musical heritage and turquoise coastal beauty."
    },
    {
        keywords: ["polynesia", "maori", "aotearoa", "haka", "pacific islands"],
        matchedCountries: ["NZL", "FJI", "WSM", "TON"],
        title: "Polynesian & Maori Maritime Heritage",
        description: "Polynesian navigators crossed vast Pacific oceans by stars and currents, creating distinct island cultures such as the Maori of Aotearoa (New Zealand)."
    },
    {
        keywords: ["balkan", "slavic", "danube", "adriatic"],
        matchedCountries: ["SRB", "HRV", "BIH", "MNE", "ALB", "BGR", "ROU", "GRC"],
        title: "Balkan Peninsula & Southeastern Europe",
        description: "A crossroads of Byzantine, Ottoman, and Slavic histories, the Balkans offer stunning Adriatic coastlines and deep cultural resilience."
    }
];

/**
 * Pre-curated high-quality documentary essays for major countries.
 * Used as immediate fallback or alongside AI-generated essays.
 */
const COUNTRY_ESSAY_DATABASE = {
    "NGA": {
        title: "Nigeria: The Giant of Africa & Cultural Dynamo",
        essay: `
            <p><strong>Nigeria</strong>, located in West Africa on the Gulf of Guinea, is Africa's most populous nation and one of its most culturally vibrant powerhouses. Home to over 220 million people and more than 250 ethnic groups—including the <span class="essay-highlight">Yoruba</span>, <span class="essay-highlight">Hausa-Fulani</span>, and <span class="essay-highlight">Igbo</span>—Nigeria is a tapestry of ancient kingdoms, artistic mastery, and modern entrepreneurial spirit.</p>
            <p>Historically, Nigerian soil gave birth to legendary civilizations. The Nok culture produced sophisticated terracotta sculptures as early as 500 BCE, while the Kingdom of Benin and the Yoruba city-state of Ile-Ife became world-renowned for their lost-wax bronze and brass masterpieces. In Yoruba cosmology, Ile-Ife is revered as the cradle of humanity where Oduduwa created the world.</p>
            <p>Today, Nigeria's global influence resonates through Nollywood—one of the world's largest film industries—and Afrobeats, a musical revolution that has captivated audiences globally. From the bustling commercial megacity of Lagos to the federal capital Abuja, Nigeria embodies the ambition, diversity, and dynamism of modern Africa.</p>
        `
    },
    "KEN": {
        title: "Kenya: Cradle of Humankind & Swahili Savannah",
        essay: `
            <p><strong>Kenya</strong> sits astride the equator in East Africa, a land of epic biodiversity, dramatic Rift Valley landscapes, and profound archaeological importance. Recognized by paleoanthropologists as one of the birthplaces of human ancestry, fossils discovered around Lake Turkana date back millions of years.</p>
            <p>The Kenyan coast along the Indian Ocean has been a thriving hub of <span class="essay-highlight">Swahili</span> trade and culture for over a millennium, blending African, Arab, and Indian maritime traditions. Inland, iconic peoples such as the <span class="essay-highlight">Maasai</span> and Kikuyu preserve ancestral cattle-herding and agricultural customs amidst the Serengeti-Mara ecosystem.</p>
            <p>Every year, the Great Migration sees millions of wildebeest and zebra cross the Mara River, creating one of nature's greatest spectacles. With its modern tech hub in Nairobi—often dubbed the 'Silicon Savannah'—Kenya merges wildlife conservation with rapid innovation.</p>
        `
    },
    "ZAF": {
        title: "South Africa: The Rainbow Nation",
        essay: `
            <p><strong>South Africa</strong> occupies the southern tip of the African continent, bordered by both the South Atlantic and Indian Oceans. Known as the 'Rainbow Nation', it is celebrated for its multicultural diversity, featuring eleven official languages including <span class="essay-highlight">Zulu</span>, <span class="essay-highlight">Xhosa</span>, Afrikaans, and English.</p>
            <p>The nation's landscape is breathtakingly varied, ranging from the dramatic flat-topped silhouette of Table Mountain in Cape Town to the sweeping wildlife reserves of Kruger National Park. Historically, South Africa overcame decades of apartheid through an inspiring struggle for freedom led by figures like Nelson Mandela and Desmond Tutu.</p>
            <p>Today, South Africa is an economic and cultural pillar of Africa, celebrated for its world-class wines, vibrant contemporary art, and rich traditions of music and dance.</p>
        `
    },
    "JPN": {
        title: "Japan: Where Ancient Tradition Meets the Future",
        essay: `
            <p><strong>Japan</strong> is an island archipelago in East Asia comprising over 6,800 islands, with the four largest being Honshu, Hokkaido, Kyushu, and Shikoku. The country is defined by an enduring duality: serene <span class="essay-highlight">Shinto shrines</span> and Zen gardens coexisting alongside neon-lit cybernetic skyscrapers.</p>
            <p>For centuries, Japan developed a sophisticated feudal culture governed by the code of the <span class="essay-highlight">Samurai</span> (Bushido) and refined artistic practices such as tea ceremony, calligraphy, and woodblock ukiyo-e prints. The sacred snow-capped cone of Mount Fuji remains the enduring symbol of the nation's spiritual connection to nature.</p>
            <p>In the modern era, Japan transformed into a global technology leader, celebrated for its bullet trains (Shinkansen), precision engineering, and worldwide pop-culture exports including anime, manga, and gastronomy.</p>
        `
    },
    "BRA": {
        title: "Brazil: Biodiversity & Cultural Rhythm of South America",
        essay: `
            <p><strong>Brazil</strong> is the largest country in South America and the fifth-largest in the world, stretching from the Amazon Basin in the north to the Atlantic vineyards and waterfalls of the south. Home to the Amazon Rainforest—often called the 'lungs of the planet'—Brazil harbors unparalleled terrestrial biodiversity.</p>
            <p>Brazilian culture is a vibrant synthesis of indigenous heritage, Portuguese colonial history, and profound African roots, particularly noticeable in the Afro-Brazilian traditions of Bahia, samba music, and Capoeira martial arts.</p>
            <p>Whether experiencing the world-famous Carnival in Rio de Janeiro or gazing at the thunderous Iguazu Falls, Brazil captivates with its warmth, passion, and ecological grandeur.</p>
        `
    },
    "GBR": {
        title: "United Kingdom: Island History & Global Influence",
        essay: `
            <p>The <strong>United Kingdom</strong> comprises England, Scotland, Wales, and Northern Ireland, an island nation off the northwestern coast of continental Europe. Steeped in <span class="essay-highlight">Celtic</span> and Anglo-Saxon history, its landscape is dotted with Neolithic monuments like Stonehenge, Roman fortifications, and medieval castles.</p>
            <p>As the birthplace of the Industrial Revolution and parliamentary democracy, the UK played a central role in shaping modern science, literature, and global trade. From Shakespeare and Newton to the Beatles and contemporary theater, British cultural exports have reached every corner of the globe.</p>
            <p>London, its vibrant cosmopolitan capital, stands as one of the world's primary financial and artistic capitals, where historic landmarks meet cutting-edge architecture.</p>
        `
    },
    "USA": {
        title: "United States: Continental Vastness & Cultural Melting Pot",
        essay: `
            <p>The <strong>United States of America</strong> is a vast North American nation spanning 50 states, from the Atlantic coastline to the Pacific, and extending to Alaska and Hawaii. It is a nation defined by geographical diversity—from the Grand Canyon and Rocky Mountains to the Great Lakes and Everglades.</p>
            <p>Founded as a democratic republic in 1776, the United States grew through immigration from around the world into a multicultural society. American innovation has driven the information age, aviation, space exploration, and entertainment industries.</p>
            <p>Its cities—including New York, Los Angeles, Chicago, and Washington D.C.—serve as global hubs for finance, cinema, music, and diplomacy.</p>
        `
    },
    "FRA": {
        title: "France: Art, Gastronomy & European Enlightenment",
        essay: `
            <p><strong>France</strong> is a Western European nation renowned as a beacon of art, philosophy, cuisine, and architectural brilliance. From the lavender fields of Provence and the alpine peaks of Mont Blanc to the historic châteaux of the Loire Valley, France offers remarkable scenic variety.</p>
            <p>During the Enlightenment and the French Revolution of 1789, France championed principles of liberty, equality, and fraternity that influenced democracies worldwide. Paris, the City of Light, has inspired painters, writers, and thinkers for centuries.</p>
            <p>Today, France remains a pillar of the European Union and a UNESCO-recognized capital of world gastronomy and fashion.</p>
        `
    },
    "IND": {
        title: "India: Ancient Civilization & Vibrant Mosaic",
        essay: `
            <p><strong>India</strong>, located in South Asia, is the world's most populous democracy and one of its oldest continuous civilizations. From the snow-clad Himalayas in the north to the tropical backwaters of Kerala in the south, India's geography is as vast as its cultural heritage.</p>
            <p>The birthplace of major world religions including Hinduism, Buddhism, Jainism, and Sikhism, India is a land of spiritual depth, celebrated for monuments like the Taj Mahal and Varanasi's sacred ghats along the Ganges River.</p>
            <p>Modern India is a fast-paced economic giant, combining a world-class IT and space sector with timeless traditions of classical dance, spices, and cinema.</p>
        `
    },
    "AUS": {
        title: "Australia: Ancient Land & Ancient Continents",
        essay: `
            <p><strong>Australia</strong> is both a continent and a nation, surrounded by the Indian and Pacific oceans. For over 65,000 years, Aboriginal and Torres Strait Islander peoples have cared for this land, possessing one of the world's oldest continuous living cultures.</p>
            <p>Australia is famous for its unique wildlife—such as kangaroos, koalas, and platypuses—and natural wonders like the Great Barrier Reef and the sacred red monolith of Uluru in the Outback.</p>
            <p>With sun-drenched coastal cities like Sydney and Melbourne, Australia offers a relaxed outdoor lifestyle combined with multicultural dynamism.</p>
        `
    }
};

/**
 * Generates a default documentary essay for countries not explicitly in the static database.
 */
function generateDefaultEssay(country) {
    const name = country.name?.common || "This nation";
    const officialName = country.name?.official || name;
    const region = country.region || "its region";
    const subregion = country.subregion || region;
    const popFormatted = country.population ? country.population.toLocaleString() : "a significant population";
    const capital = country.capital && country.capital.length > 0 ? country.capital[0] : "its principal administrative center";
    const languages = country.languages ? Object.values(country.languages).join(", ") : "diverse local languages";

    return {
        title: `${name}: Documentary Profile & Geographic Overview`,
        essay: `
            <p><strong>${name}</strong> (officially the ${officialName}) is a sovereign nation located in <strong>${subregion}</strong> (${region}). With a population of approximately <strong>${popFormatted}</strong> residents, its capital and primary civic center is <strong>${capital}</strong>.</p>
            <p>The cultural heritage of ${name} is expressed through its spoken languages—including ${languages}—alongside traditional arts, regional cuisine, and social customs that have evolved over generations.</p>
            <p>Geographically positioned in ${region}, ${name} plays an active role in regional trade, environmental preservation, and global diplomacy. From its historic landmarks to its contemporary developments, the country continues to chart its distinct path in the modern world.</p>
        `
    };
}

if (typeof window !== "undefined") {
    window.WORLD_POPULATION_DATA = WORLD_POPULATION_DATA;
    window.LOCALITY_KNOWLEDGE_BASE = LOCALITY_KNOWLEDGE_BASE;
}
if (typeof module !== "undefined") {
    module.exports = { WORLD_POPULATION_DATA, LOCALITY_KNOWLEDGE_BASE };
}
