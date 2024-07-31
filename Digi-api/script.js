const digiContainer = document.querySelector("#digiContainer");
const digiCount = 1460;
let isSearching = false;
let digimonsList = [];

const saveDigimonsToLocalStorage = () => {
    localStorage.setItem("digimonsList", JSON.stringify(digimonsList));
};

const loadDigimonsFromLocalStorage = () => {
    const storedList = localStorage.getItem("digimonsList");
    if (storedList) {
        digimonsList = JSON.parse(storedList);
        return true;
    }
    return false;
};

const fetchDigimon = async () => {
    for (let i = 1; i <= digiCount; i++) {
        if (isSearching == false) {
            await getDigimons(i);
        } else {
            break;
        }
    }
   
    digimonsList.sort((a, b) => a.id - b.id);
    saveDigimonsToLocalStorage();
};

const getDigimons = async (id) => {
    const url = `https://digi-api.com/api/v1/digimon/${id}`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        digimonsList.push(data);
        createDigimonCard(data);
    } catch (error) {
        console.error(`Error fetching Digimon with ID ${id}:`, error);
    }
};

const fetchDigimonByName = (name) => {
    isSearching = true;
    console.log(`Fetching Digimon with name: ${name}`);
    const filteredDigimons = digimonsList.filter(digi => digi.name.toLowerCase() === name.toLowerCase());
    digiContainer.innerHTML = '';
    if (filteredDigimons.length > 0) {
        filteredDigimons.forEach(digi => createDigimonCard(digi));
    } else {
        console.error(`Digimon not found`);
        digiContainer.innerHTML = '<p>Digimon not found. Please try again.</p>';
    }
    isSearching = false;
};

const createDigimonCard = (digi) => {
    const card = document.createElement('div');
    card.classList.add("digimon");

    const name = digi.name ? digi.name.charAt(0).toUpperCase() + digi.name.slice(1) : "Unknown";
    const id = digi.id ? digi.id.toString().padStart(3, '0') : "000";

    let digiTypes = "Unknown";
    if (digi.types && digi.types[0] && digi.types[0].type) {
        digiTypes = digi.types[0].type.toString();
    }

    const nameForImage = name.replace(/ /g, '_');

    const digimonInnerHTML = `
        <div class="imgContainer">
            <img src="https://digi-api.com/images/digimon/w/${nameForImage}.png" alt="${name}">
        </div>
        <div class="info">
            <span class="number">${id}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Type: <span>${digiTypes}</span></small>
        </div>`;

    card.innerHTML = digimonInnerHTML;
    digiContainer.appendChild(card);
};

const displayDigimons = () => {
    digiContainer.innerHTML = '';
    digimonsList.forEach(digi => createDigimonCard(digi));
};

document.querySelector("#searchButton").addEventListener("click", () => {
    const searchInput = document.querySelector("#searchInput").value.trim();
    if (searchInput) {
        fetchDigimonByName(searchInput);
    } else if (searchInput == '') {
        displayDigimons();
    }
});

document.querySelector("#searchInput").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const searchInput = document.querySelector("#searchInput").value.trim();
        if (searchInput) {
            fetchDigimonByName(searchInput);
        } else {
            displayDigimons();
        }
    }
});

if (!loadDigimonsFromLocalStorage()) {
    fetchDigimon();
} else {
    displayDigimons();
}
