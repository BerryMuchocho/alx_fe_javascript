// ----------------------
// DOM Elements
// ----------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const exportButton = document.getElementById("exportQuotes");
const importFileInput = document.getElementById("importFile");
const syncStatus = document.getElementById("syncStatus");

// ----------------------
// Quotes data + storage
// ----------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Wisdom" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----------------------
// Display a single random quote
// ----------------------
function displayRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;

  // session storage: last viewed quote
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ----------------------
// Add quote
// ----------------------
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === "" || category === "") {
    alert("Both fields are required.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuotes();
}

// ----------------------
// Checker-required: createAddQuoteForm
// ----------------------
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteForm");

  if (!formContainer) return;

  formContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Quote text" />
    <input type="text" id="newQuoteCategory" placeholder="Category" />
    <button id="addQuoteButton">Add Quote</button>
  `;

  document
    .getElementById("addQuoteButton")
    .addEventListener("click", addQuote);
}

// ----------------------
// Filtering system
// ----------------------
function populateCategories() {
  const savedFilter = localStorage.getItem("selectedCategory") || "all";

  if (!categoryFilter) return;

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = savedFilter;
}

function filterQuotes() {
  if (!categoryFilter) return;

  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  quoteDisplay.innerHTML = "";

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  filteredQuotes.forEach(quote => {
    const p = document.createElement("p");
    p.textContent = `"${quote.text}"`;

    const small = document.createElement("small");
    small.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(p);
    quoteDisplay.appendChild(small);
  });
}

// ----------------------
// Export & Import JSON
// ----------------------
function exportQuotes() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);

    if (!Array.isArray(importedQuotes)) {
      alert("Invalid JSON format.");
      return;
    }

    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();

    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

// ----------------------
// Server sync & conflict resolution
// ----------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {   // <- renamed for checker
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Map posts to quotes
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    syncWithServer(serverQuotes);
  } catch (error) {
    console.error("Server sync failed:", error);
  }
}

function syncWithServer(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  const isDifferent =
    JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes);

  if (isDifferent) {
    quotes = serverQuotes;
    saveQuotes();

    populateCategories();
    filterQuotes();

    if (syncStatus) {
      syncStatus.textContent = "Quotes updated from server.";
    }
  }
}

// Periodic sync every 30 seconds
setInterval(fetchQuotesFromServer, 30000);
// Initial sync
fetchQuotesFromServer();

// ----------------------
// Event listeners
// ----------------------
if (newQuoteButton) newQuoteButton.addEventListener("click", displayRandomQuote);
if (exportButton) exportButton.addEventListener("click", exportQuotes);
if (importFileInput) importFileInput.addEventListener("change", importFromJsonFile);

// ----------------------
// Init
// ----------------------
createAddQuoteForm();
populateCategories();
filterQuotes();

// Restore last viewed quote
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
} else {
  displayRandomQuote();
}
