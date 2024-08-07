$(document).ready(function() {
    const itemsPerPage = 20;
    let currentPage = 0;
    let totalPages = 0;
    const apiUrl = 'https://digi-api.com/api/v1/digimon';
    const pagesToLoad = 9;

    const fetchTotalData = () => {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(data) {
                totalPages = 1; // Inicializa totalPages
                fetchDigimonData(currentPage, pagesToLoad); // Carrega páginas iniciais
            }
        });
    };

    function isNullOrEmpty(value) {
        return value === null || value === undefined || value === '';
    }

    $("#searchButton").on("click", function(){
        pesquisar();
    });

    $("#searchInput").on('keydown', function(e){
        if(e.key === "Enter"){
            pesquisar();
        }  
    });

    function pesquisar() {
        let pesquisa = $("#searchInput").val();
        if (isNullOrEmpty(pesquisa)) {
            const digiContainer = $('#digiContainer');
            digiContainer.empty();
            fetchDigimonData(currentPage, 8); // Ajuste o número de páginas conforme necessário
            $('.pagination').show();
            return false;
        }

        $.ajax({
            url: `${apiUrl}/${pesquisa}`,
            method: 'GET',
            success: function(data) {
                debugger;
                const name = data.name ? data.name.charAt(0).toUpperCase() + data.name.slice(1) : "Unknown";
                const id = data.id ? data.id.toString().padStart(3, '0') : "000";
                
                const digiContainer = $('#digiContainer');
                digiContainer.empty();
                const digimonInnerHTML = `
                <a href="#" class="digimon" data-toggle="modal" data-target="#digimonModal" data-id="${data.id}" data-name="${name}" data-image="${data.images[0].href}">
                    <div class="imgContainer">
                        <img src="${data.images[0].href}" alt="${name}">
                    </div>
                    <div class="info">
                        <span class="number">${id}</span>
                        <h5 class="name" style="font-size:20px">${name}</h5>
                    </div>
                </a>`;

                digiContainer.append(digimonInnerHTML);
                $('.pagination').hide();

                // Event listener for card clicks
                $('.digimon').on('click', function() {
                    const id = $(this).data('id');
                    var data = loadInfoDigimon(id);
                    const name = data.name
                    const description = data.descriptions[1].description;
                    
                    const image = data.images[0].href;
                   

                    $('.modal-body').html(`
                        <img src="${image}" class="img-fluid" alt="${name}">
                        <div class="info">
                            <span class="number">${id}</span>
                            <h5 class="name">${name}</h5>
                            <p class="description text-muted">${description}</p>
                        </div>
                    `);
                });
            },
            error: function(data){
                const digiContainer = $('#digiContainer');
                digiContainer.empty();
                const digimonInnerHTML = `
                <div class="noDigi">
                    <h1>Esse Digimon não existe </h1>
                    <img src="assests/Cutemon_sad-removebg-preview.png">
                    <a href="javascript:reload()">voltar para o inicio</a>
                <div>
                `;
                digiContainer.append(digimonInnerHTML);
                return false;
            }
        });
    }
    const fetchDigimonData = (page = 0, numPages = 1) => {
        var count = $('a.digimon').length;

        if (count === 0) {
            for (let i = 0; i < numPages; i++) {
                $.ajax({
                    url: `${apiUrl}${i===0? "" : `?page=${i}`}`,
                    method: 'GET',
                    async: false,
                    success: function(data) {
                        totalPages = Math.max(totalPages, page + i + 1); // Atualiza totalPages
                        displayDigimon(data.content);
                    }
                });
            }
        } else {
            for (let i = 0; i < pagesToLoad; i++) {
                $.ajax({
                    url: `${apiUrl}?page=${currentPage + totalPages + i}&size=${itemsPerPage}`,
                    method: 'GET',
                    success: function(data) {
                        totalPages++;
                        displayDigimon(data.content);
                    }
                });
            }
        }
    };

    const loadInfoDigimon = (id) =>{
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

    const displayDigimon = (digimonList) => {
        const digiContainer = $('#digiContainer');
    
        digimonList.forEach(digi => {
            const name = digi.name ? digi.name.charAt(0).toUpperCase() + digi.name.slice(1) : "Unknown";
            const id = digi.id ? digi.id.toString().padStart(3, '0') : "000";
            const digimonInnerHTML = `
                <a href="#" class="digimon fade-in" id="digimon" data-toggle="modal" data-target="#digimonModal" data-id="${digi.id}" data-name="${name}" data-image="${digi.image}">
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

        // Event listener for card clicks
        $('.digimon').on('click', function() {
            const id = $(this).data('id');
            const name = $(this).data('name');
            var data = loadInfoDigimon(id);
            let description = '';
            if (data.descriptions.length > 1){
                 description = data.descriptions[1].description ?? "";
            }
                
            const image = data.images[0].href;


    
            $('.modal-body').html(`
                 <div class="text-center">
                    <img src="${image}" class="img-fluid rounded shadow-sm mb-4" alt="${name.charAt(0).toUpperCase() + name.slice(1)}">
                </div>
                <div class="info">
                    <span class="number">${id.toString().padStart(3, '0')}</span>
                    <h4 class="name mt-2">${name.charAt(0).toUpperCase() + name.slice(1)}</h4>
                    <p class="description text-muted">${description}</p>
                </div>
            `);
        });
    };

    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            fetchDigimonData(currentPage, 8); // Carrega mais páginas
        }
    });

    // Inicializa os dados e exibe as páginas iniciais
    fetchTotalData();
    $("#searchInput").focus();
});
