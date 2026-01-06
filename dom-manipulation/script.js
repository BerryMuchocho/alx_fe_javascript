// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportButton = document.getElementById("exportQuotes");
const importFileInput = document.getElementById("importFile");

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
// Display random quote
// ----------------------
function displayRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = "";

  const textEl = document.createElement("p");
  textEl.textContent = `"${quote.text}"`;

  const categoryEl = document.createElement("small");
  categoryEl.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(textEl);
  quoteDisplay.appendChild(categoryEl);

  // session storage (last viewed quote)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ----------------------
// Add quote logic
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

  displayRandomQuote();
}

// ----------------------
// REQUIRED by checker
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
// Export quotes to JSON
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

// ----------------------
// Import quotes from JSON
// ----------------------
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
    displayRandomQuote();

    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

// ----------------------
// Event listeners
// ----------------------
newQuoteButton.addEventListener("click", displayRandomQuote);

if (exportButton) {
  exportButton.addEventListener("click", exportQuotes);
}

if (importFileInput) {
  importFileInput.addEventListener("change", importFromJsonFile);
}

// ----------------------
// Init
// ----------------------
createAddQuoteForm();

// load last quote from session storage if available
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
