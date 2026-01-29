// records_search.js

const searchBar = document.getElementById('search-bar');
const suggestions = document.getElementById('suggestions');
const modal = document.getElementById('record-modal');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal');
const modalContent = document.getElementById('modal-content');

let allRecordsCached = []; 
let currentHighlightedIndex = -1; // No item highlighted initially
let currentSuggestions = []; // Store the current filtered suggestions

// Wait until records are loaded globally
document.addEventListener('DOMContentLoaded', () => {
  if (window.allRecords) {
    allRecordsCached = window.allRecords;
  } else {
    // If not loaded yet, wait a bit
    setTimeout(() => {
      allRecordsCached = window.allRecords || [];
    }, 1000);
  }
});

function filterRecords(query) {
  return allRecordsCached.filter(record => {
    const title = (record['Title'] || "").toLowerCase();
    const artist = (record['Artist'] || "").toLowerCase();
    const label = (record['Label'] || "").toLowerCase();
    return title.includes(query) || artist.includes(query) || label.includes(query);
  });
}

searchBar.addEventListener('input', () => {
  const query = searchBar.value.trim().toLowerCase();
  if (!query) {
    suggestions.style.display = 'none';
    currentHighlightedIndex = -1;
    currentSuggestions = [];
    return;
  }

  currentSuggestions = filterRecords(query);
  displaySuggestions(currentSuggestions, query);
});

function displaySuggestions(records, query) {
  suggestions.innerHTML = '';
  currentHighlightedIndex = -1; // reset highlight

  if (records.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No results';
    li.style.padding = '5px';
    suggestions.appendChild(li);
    suggestions.style.display = 'block';
    return;
  }

  // Show only top 10 suggestions for convenience
  records.slice(0,10).forEach((record, index) => {
    const li = document.createElement('li');
    li.style.padding = '5px';
    li.style.cursor = 'pointer';
    li.textContent = `${record['Title']} - ${record['Artist']}`;
    li.addEventListener('click', () => {
      showRecordModal(record);
      suggestions.style.display = 'none';
    });
    suggestions.appendChild(li);
  });

  suggestions.style.display = 'block';
}

searchBar.addEventListener('keydown', (e) => {
  const items = suggestions.querySelectorAll('li');
  if (!items.length || suggestions.style.display === 'none') return;

  if (e.key === 'ArrowDown') {
    // Move highlight down
    e.preventDefault();
    currentHighlightedIndex = (currentHighlightedIndex + 1) % items.length;
    updateHighlight(items);
  } else if (e.key === 'ArrowUp') {
    // Move highlight up
    e.preventDefault();
    currentHighlightedIndex = (currentHighlightedIndex - 1 + items.length) % items.length;
    updateHighlight(items);
  } else if (e.key === 'Enter') {
    // If enter is pressed and an item is highlighted, select it
    if (currentHighlightedIndex >= 0 && currentHighlightedIndex < items.length) {
      e.preventDefault();
      const selectedRecord = currentSuggestions[currentHighlightedIndex];
      showRecordModal(selectedRecord);
      suggestions.style.display = 'none';
    }
  }
});

function updateHighlight(items) {
  // Clear previous highlights
  items.forEach(li => {
    li.style.background = '';
  });
  if (currentHighlightedIndex >= 0) {
    items[currentHighlightedIndex].style.background = '#eee';
  }
}

function showRecordModal(record) {
  modalContent.innerHTML = ''; // clear old content

  const releaseId = record['release_id'];
  // Construct image path
  const imagePath = `/assets/records/imgs/${releaseId}.jpg`;

  const img = document.createElement('img');
  img.src = imagePath;
  img.alt = record['Title'] || "No Title";
  img.style.maxWidth = "100%";
  img.style.display = "block";
  img.style.marginBottom = "20px";

  // If image fails to load, replace with placeholder
  img.onerror = () => {
    img.onerror = null;
    img.remove();
    const placeholder = document.createElement("div");
    placeholder.style.height = "180px";
    placeholder.style.background = "#eee";
    placeholder.style.display = "flex";
    placeholder.style.alignItems = "center";
    placeholder.style.justifyContent = "center";
    placeholder.style.fontSize = "12px";
    placeholder.style.color = "#999";
    placeholder.innerText = "No Image Available";
    modalContent.insertBefore(placeholder, modalContent.firstChild);
  };

  modalContent.appendChild(img);

  const title = document.createElement('h2');
  title.innerText = record['Title'] || "No Title";
  modalContent.appendChild(title);

  const artist = document.createElement('p');
  artist.innerText = `Artist: ${record['Artist'] || "No Artist"}`;
  modalContent.appendChild(artist);

  const label = document.createElement('p');
  label.innerText = `Label: ${record['Label'] || "Not Available"}`;
  modalContent.appendChild(label);

  const format = document.createElement('p');
  format.innerText = `Format: ${record['Format'] || "Not Available"}`;
  modalContent.appendChild(format);

  const released = document.createElement('p');
  released.innerText = `Released: ${record['Released'] || "Not Available"}`;
  modalContent.appendChild(released);

  // Show modal and overlay
  modal.style.display = 'block';
  modalOverlay.style.display = 'block';
}

// Close modal on button or overlay click
closeModalBtn.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', hideModal);

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Check if modal is visible
    if (modal.style.display === 'block') {
      hideModal();
    }
  }
});

function hideModal() {
  modal.style.display = 'none';
  modalOverlay.style.display = 'none';
}
