// records.js

// Path to your CSV file
const CSV_URL = "../assets/records/idohaber-collection-20241208-1829.csv";

function init() {
  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    dynamicTyping: false,
    complete: function(results) {
      const records = results.data;
      window.allRecords = records; // Make available globally
      displayRecords(records);
      // Update the subtitle with the count of records
      const countElement = document.getElementById("record-count");
      if (countElement) {
        countElement.innerText = `Total in Collection: ${records.length}`;
      }
    },
    error: function(err) {
      console.error("Error parsing CSV:", err);
    }
  });
}

function displayRecords(records) {
  const container = document.getElementById("collection-grid");
  container.innerHTML = ''; // Clear old entries if any
  
  for (const record of records) {
    const releaseId = record['release_id'];
    if (!releaseId) continue;

    const imagePath = `/assets/records/imgs/${releaseId}.jpg`;
    const card = createRecordCard(record, imagePath);
    container.appendChild(card);
  }
}

function createRecordCard(record, imageUrl) {
  const card = document.createElement("div");
  card.className = "record-card";

  const link = document.createElement("a");
  link.href = `https://www.discogs.com/release/${record['release_id']}`;
  link.target = "_blank";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = record['Title'] || "No Title";
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
    placeholder.innerText = "No Image";
    link.insertBefore(placeholder, link.firstChild);
  };
  link.appendChild(img);

  const info = document.createElement("div");
  info.className = "record-info";

  const title = document.createElement("h2");
  title.innerText = record['Title'] || "No Title";
  info.appendChild(title);

  const artist = document.createElement("p");
  artist.innerText = record['Artist'] || "No Artist";
  info.appendChild(artist);
  
  const label = document.createElement("p");
  label.className = 'details';
  label.innerText = `Label: ${record['Label'] || "Not Available"}`;
  info.appendChild(label);

  const format = document.createElement("p");
  format.className = 'details';
  format.innerText = `Format: ${record['Format'] || "Not Available"}`;
  info.appendChild(format);

  const released = document.createElement("p");
  released.className = 'details';
  released.innerText = `Released: ${record['Released'] || "Not Available"}`;
  info.appendChild(released);

  link.appendChild(info);
  card.appendChild(link);
  return card;
}

init();
