const apiUrl = 'https://digi-api.com/api/v1/digimon';
let currentPage = 0;
const pageSize = 100;
let source = false;

const obterDigimons = (page) => {
    $.ajax({
        url: `${apiUrl}?page=${page}&pageSize=${pageSize}`,
        method: 'GET',
        success: function(data) {
            const digiContainer = $('#digiContainer');
    debugger
            data.content.forEach(digi => {
                const name = digi.name ? digi.name.charAt(0).toUpperCase() + digi.name.slice(1) : "Unknown";
                const id = digi.id ? digi.id.toString().padStart(3, '0') : "000";
                const digimonInnerHTML = `
                    <a href="#" class="digimon fade-in" id="digimon" data-toggle="modal" data-target="#digimonModal" onclick="modal(${digi.id})">
                        <div class="imgContainer">
                            <img src="${digi.image}" alt="${name}">
                        </div>
                        <div class="info">
                            <span class="number">${id}</span>
                            <h4 class="name" style="font-size:20px">${name}</h4>
                        </div>
                    </a>`;
        
                digiContainer.append(digimonInnerHTML);
            });

            currentPage++; // Incrementa a página atual
        }
    });
};

//FUNÇÃO PARA VER SE O VALOR É NULL, UNDEFINED OU VAZIO
function isNullOrEmpty(value) {
    return value === null || value === undefined || value === '';
}

//FUNÇÃO DE PESQUISAR POR ID
const pesquisar = (id) => {
    source = true;
    $.ajax({
        url: `${apiUrl}/${id}`,
        method: 'GET',
        success: function(digi) {
            const digiContainer = $('#digiContainer');
            const name = digi.name ? digi.name.charAt(0).toUpperCase() + digi.name.slice(1) : "Unknown";
            const id = digi.id ? digi.id.toString().padStart(3, '0') : "000";
            const digimonInnerHTML = `
                <a href="#" class="digimon fade-in" id="digimon" data-toggle="modal" data-target="#digimonModal" data-id="${digi.id}" data-name="${name}" data-image="${digi.image}">
                    <div class="imgContainer">
                        <img src="${digi.images[0].href}" alt="${name}">
                    </div>
                    <div class="info">
                        <span class="number">${id}</span>
                        <h4 class="name" style="font-size:20px">${name}</h4>
                    </div>
                </a>`;
            digiContainer.empty();
            digiContainer.append(digimonInnerHTML);
        },
            error: function(data){
                const digiContainer = $('#digiContainer');
                digiContainer.empty();
                const digimonInnerHTML = `
                <div class="text-center mt-3">
                    <h1>Esse Digimon não existe </h1>
                    <img src="assets/img/Cutemon_sad-removebg-preview.png">
                <div>
                    <a href="javascript:reload()">voltar para o inicio</a>
                `;
                digiContainer.append(digimonInnerHTML);
                return false;
            }
    });
};

//APERTANDO A TECLA ENTER NA PESQUISA
$("#searchInput").on('keydown', function(e){    
    if(e.key === "Enter"){
        pesquisar(this.value);
    }  
});

//APERTANDO NO BOTÃO DA PESQUISA
$("#searchButton").on("click", function(){
    pesquisar($("#searchInput").val());
});

//INFORMAÇÕES DA MODAL
const modal = (id) => {
    var data = infoDigimon(id);
    const name = data.name;
    const description = data.descriptions.length > 1 ? data.descriptions[1].description : "";
    const image = data.images[0].href;

    let cardsHtml = '';
    if (data.nextEvolutions.length > 0) {
        for (let i = 0; i < Math.min(data.nextEvolutions.length, data.nextEvolutions.length); i++) {
            const evolution = data.nextEvolutions[i];
            cardsHtml += `
                <div class="col-sm-2 mb-3">
                    <div class="card text-center">
                        <h5>${evolution.digimon || "Unknown"}</h5>
                        <img src="${evolution.image || "default-image.jpg"}" class="img-fluid card-img-top" alt="${evolution.digimon || "No Name"}">
                        <div><strong>ID:</strong> ${evolution.id ? evolution.id.toString().padStart(3, '0') : "N/A"}</div>
                    </div>
                </div>
            `;
        }
    } else {
        cardsHtml = `<p>Sem informações de digievoluções</p>`;
    }

    let skills = '';
    if (data.skills.length > 0) {
        for (let i = 0; i < data.skills.length; i++) {
            skills += data.skills[i].skill;
            if (i < data.skills.length - 1) {
                skills += ', ';
            }
        }
    } else {
        skills = 'Sem informações';
    }

    // Atualizar o conteúdo da modal com o Accordion
    var html = `
        <div class="row">
            <div class="col-lg-4">
                <img src="${image}" class="img-fluid" alt="${name}">
            </div>
            <div class="col-lg-8">
                <h4>${name}</h4>
                <p><strong>ID:</strong> ${id.toString().padStart(3, '0')}</p>
                <p><strong>Descrição:</strong> ${description || "Sem informações"}</p>
                <p><strong>Level:</strong> ${data.levels.length > 0 ? data.levels[0].level : "Sem informações"}</p>
                <p><strong>Tipo:</strong> ${data.types.length > 0 ? data.types[0].type : "Sem informações"}</p>
                <p><strong>Atributos:</strong> ${data.attributes.length > 0 ? data.attributes[0].attribute : "Sem informações"}</p>
                <p><strong>Skills:</strong> ${skills}</p>
            </div>
        </div>

        <!-- Accordion -->
        <div class="accordion mt-4" id="accordionExample">
            <div class="card">
                <button class="btn" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <div id="headingOne">
                        <h5 class="mb-0">   
                            Digievolutions
                        </h5>
                    </div>
                </button>

                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div class="card-body">
                        <div class="row">
                            ${cardsHtml}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('.modal-body').empty();
    $('.modal-body').html(html);
}

//PEGA AS INFORMAÇÕES POR ID
const infoDigimon = (id) =>{
    let retorno = []
    $.ajax({
        url :`${apiUrl}/${id}`,
        method: 'GET',
        async: false,
        success: function(data){
            retorno = data;
        }
    })
    return retorno;
}

//FUNÇÃO PARA RECARREGAR A TELA
const reload = () =>{
    window.location.reload();
}

//INICIA QUANDO A TELA CARREGA
$(document).ready(function() { 
    $('html, body').scrollTop(0);

    obterDigimons(currentPage);

    $(window).on('scroll', () => {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            if(!source){
                obterDigimons(currentPage);
            }
        }
    });
});