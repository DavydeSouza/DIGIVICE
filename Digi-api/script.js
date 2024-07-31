const digiContainer = document.querySelector("#digiContainer");
const digiCount = 1460;
let isSearching = false;

const fetchDigimon = async () => {
    for (let i = 1; i <= digiCount; i++) {
        if (isSearching == false) { // Verifica se não estamos em modo de pesquisa
            await getDigimons(i);
        } else {
            break; // Para de carregar se estivermos pesquisando
        }
    }
};

const getDigimons = async (id) => {
    const url = `https://digi-api.com/api/v1/digimon/${id}`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        createDigimonCard(data);
    } catch (error) {
        console.error(`Error fetching Digimon with ID ${id}:`, error);
    }
};
const fetchDigimonByName = async (name) => {
    isSearching = true;
    console.log(`Fetching Digimon with name: ${name}`);
    const url = `https://digi-api.com/api/v1/digimon/${name.toLowerCase()}`;
    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error(`Digimon not found`);
        }
        digiContainer.innerHTML = ''; // Limpa os resultados anteriores
        const data = await resp.json();
        console.log(`Fetched Digimon data:`, data);
        createDigimonCard(data);
    } catch (error) {
        console.error(`Error fetching Digimon:`, error);
        digiContainer.innerHTML = '<p>Digimon not found. Please try again.</p>';
    } finally {
        isSearching = false; // Volta ao modo de carregamento normal
    }
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

document.querySelector("#searchButton").addEventListener("click",() => {
    const searchInput = document.querySelector("#searchInput").value.trim();
    if (searchInput) {
        fetchDigimonByName(searchInput);
    }else if (searchInput == ''){
        digiContainer.innerHTML = '';
        fetchDigimon();
    }
});

document.querySelector("#searchInput").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {  
        event.preventDefault(); // Evita o comportamento padrão do Enter
        const searchInput = document.querySelector("#searchInput").value.trim();
        if (searchInput) {
            fetchDigimonByName(searchInput);
        } else {
            digiContainer.innerHTML = '';
            fetchDigimon();
        }
    }
});



fetchDigimon();
