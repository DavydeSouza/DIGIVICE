$(document).ready(function() {
    const itemsPerPage = 20;
    let currentPage = 0;
    let totalPages = 1;
    const apiUrl = 'https://digi-api.com/api/v1/digimon';

    const fetchTotalData = () => {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(data) {
                totalPages = Math.ceil(data.pageable.totalElements / itemsPerPage);
                fetchDigimonData(currentPage);
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
            fetchDigimonData(currentPage);
            $('.pagination').show();
            return false;
        }

        $.ajax({
            url: `${apiUrl}/${pesquisa}`,
            method: 'GET',
            success: function(data) {
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
                        <h4 class="name">${name}</h4>
                    </div>
                </a>`;

                digiContainer.append(digimonInnerHTML);
                $('.pagination').hide();

                // Event listener for card clicks
                $('.digimon').on('click', function() {
                    const id = $(this).data('id');
                    const name = $(this).data('name');
                    const image = $(this).data('image');

                    name ? name.charAt(0).toUpperCase() + name.slice(1) : "Unknown";
                    id ? id.toString().padStart(3, '0') : "000";
            
                    $('#digimonModalLabel').text(name);
                    $('.modal-body').html(`
                        <img src="${image}" class="img-fluid" alt="${name}">
                        <div class="info">
                            <span class="number">${id}</span>
                            <h4 class="name">${name}</h4>
                        </div>
                    `);
                });
            }
        });
    }

    const fetchDigimonData = (page = 0) => {
        $.ajax({
            url: `${apiUrl}?page=${page}&size=${itemsPerPage}`,
            method: 'GET',
            success: function(data) {
                displayDigimon(data.content);
                updatePagination();
            }
        });
    };

    const displayDigimon = (digimonList) => {
        const digiContainer = $('#digiContainer');
        digiContainer.empty();
    
        digimonList.forEach(digi => {
            const name = digi.name ? digi.name.charAt(0).toUpperCase() + digi.name.slice(1) : "Unknown";
            const id = digi.id ? digi.id.toString().padStart(3, '0') : "000";
    
            const digimonInnerHTML = `
                <a href="#" class="digimon" data-toggle="modal" data-target="#digimonModal" data-id="${digi.id}" data-name="${name}" data-image="${digi.image}">
                    <div class="imgContainer">
                        <img src="${digi.image}" alt="${name}">
                    </div>
                    <div class="info">
                        <span class="number">${id}</span>
                        <h4 class="name">${name}</h4>
                    </div>
                </a>`;
    
            digiContainer.append(digimonInnerHTML);
        });

        // Event listener for card clicks
        $('.digimon').on('click', function() {
            const id = $(this).data('id');
            const name = $(this).data('name');
            const image = $(this).data('image');
    
            $('#digimonModalLabel').text(name.charAt(0).toUpperCase() + name.slice(1));
            $('.modal-body').html(`
                <img src="${image}" class="img-fluid" alt="${name.charAt(0).toUpperCase() + name.slice(1)}">
                <div class="info">
                    <span class="number">${id.toString().padStart(3, '0')}</span>
                    <h4 class="name">${name}</h4>
                </div>
            `);
        });
    };
    
    const updatePagination = () => {
        $('#pageNumber').text(`Page ${currentPage + 1}`);
        $('#prevPage').prop('disabled', currentPage === 0);
        $('#nextPage').prop('disabled', currentPage >= totalPages - 1);
    };

    $('#prevPage').click(function() {
        if (currentPage > 0) {
            currentPage--;
            fetchDigimonData(currentPage);
        }
    });

    $('#nextPage').click(function() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            fetchDigimonData(currentPage);
        }
    });

    // Inicializa os dados e exibe a primeira página
    fetchTotalData();
});
