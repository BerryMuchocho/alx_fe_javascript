// ----------------------
// DOM elements
// ----------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// ----------------------
// Quotes + storage
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
// Populate categories
// REQUIRED FUNCTION NAME
// ----------------------
function populateCategories() {
  const savedFilter = localStorage.getItem("selectedCategory") || "all";

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

// ----------------------
// Filter quotes
// REQUIRED FUNCTION NAME
// ----------------------
function filterQuotes() {
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
// Random quote (still needed)
// ----------------------
function displayRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
}

// ----------------------
// Events
// ----------------------
newQuoteButton.addEventListener("click", displayRandomQuote);

// ----------------------
// Init
// ----------------------
populateCategories();
filterQuotes();
