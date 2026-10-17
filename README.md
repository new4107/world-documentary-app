# TERRA — World Documentary & Country Explorer

A rich, cinematic "World Documentary" web application built with modern web technologies, AI semantic search, regional filters, demographic cards, and interactive documentary profiles.

## ✨ Key Features

1. **Grid (Cards) of All World Countries**:
   - Fetches live demographic and geographic data from the REST Countries API (`https://restcountries.com/v3.1/all`).
   - Each country card prominently displays the **Flag** visible right inside the card, along with key details: **Region**, **Population** (formatted with commas), and **Capital**.
   - Includes official country name and interactive hover zoom & elevation effects.

2. **AI-Integrated Searchbar & Locality Intelligence**:
   - Integrated with **Google Gemini AI API** for intelligent semantic query processing.
   - Supports searching by locality, ethnic group, historical kingdom, or region (e.g. typing `"yoruba"` immediately maps to **Nigeria, Benin, Togo** in **Africa** with an explanatory AI banner!).
   - Also supports queries like `"Swahili"`, `"Nordic"`, `"Samurai"`, `"Inuit"`, `"Caribbean"`, `"Balkan"`, and custom AI semantic questions.

3. **Functional Theme Switch Toggle Icon**:
   - A top-right toggle switch button with animated sun/moon icons.
   - Smoothly switches between **Dark Mode** (cinematic documentary aesthetic) and **Light Mode** (editorial documentary aesthetic).
   - Automatically saves your preference in `localStorage`.

4. **"Region" Dropdown Selector**:
   - Easily filter nations by region: `"All Regions"`, `"Africa"`, `"Americas"`, `"Asia"`, `"Europe"`, `"Oceania"`, and `"Antarctic"`.
   - Works seamlessly in tandem with search queries and sorting options (Population High-Low, Alphabetical, Area).

5. **Documentary Popup Modal & Short Essay**:
   - Clicking on any country card opens a stunning modal popup.
   - Shows comprehensive nation details: Subregion, Capital, Population, Total Area, Languages, Currencies, and Bordering Nations.
   - **Documentary Essay & Cultural Heritage**: Displays an authoritative, beautifully formatted short essay about the nation's history, geography, and cultural impact.
   - **Text-to-Speech Audio Tour**: Click **"Narrate Essay"** to listen to the documentary essay read aloud using the browser's Web Speech API.
   - **AI Deep Dive**: Click **"AI Deep Dive"** to generate an extended custom documentary analysis of the country on the fly using Gemini AI.

## 🚀 How to Run Locally

### Option 1: Using Python HTTP Server (Recommended)
Double-click `start-server.bat` or run the following command in PowerShell / Terminal:
```powershell
python -m http.server 8000
```
Then open your browser and navigate to:
**http://localhost:8000/**

### Option 2: Direct Browser Open
You can also open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari). Note that some web speech or API features work best over `http://localhost`.

## 📁 Project Structure
- `index.html` — Main semantic HTML layout, header, search bar, dropdowns, card grid, and popup modal.
- `styles.css` — Design system with CSS variables, dark/light themes, glassmorphism, animations, and responsive breakpoints.
- `localityData.js` — Rich locality knowledge base (e.g. Yoruba, Swahili, Nordic) and pre-curated documentary essays.
- `app.js` — Core application controller (REST Countries API fetch, Gemini AI search, filtering/sorting, theme toggle, and modal essay reader).
- `start-server.bat` — Simple Windows launcher script for local testing.
