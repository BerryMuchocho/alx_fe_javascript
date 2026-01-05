// REQUIRED: quotes array with text + category
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Wisdom" }
];

// REQUIRED: function name must be displayRandomQuote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = '';

  const p = document.createElement('p');
  p.textContent = `"${quote.text}"`;

  const small = document.createElement('small');
  small.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
}

// REQUIRED: function name must be addQuote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text === '' || category === '') {
    return;
  }

  quotes.push({ text, category });

  textInput.value = '';
  categoryInput.value = '';

  displayRandomQuote();
}

// REQUIRED: event listener on Show New Quote button
document
  .getElementById('newQuote')
  .addEventListener('click', displayRandomQuote);
