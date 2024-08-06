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
        let pesquisa = $("#searchInput").val();
        if(isNullOrEmpty(pesquisa)){
            fetchDigimonData();
            return false;
        }

        $.ajax({
            url: apiUrl + "/" + pesquisa,
            method: 'GET',
            success: function(data) {
                const digiContainer = $('#digiContainer');
                digiContainer.empty();
                const digimonInnerHTML = `
                <div class="digimon">
                    <div class="imgContainer">
                        <img src="${data.images[0].href}" alt="${data.name}">
                    </div>
                    <div class="info">
                        <span class="number">${data.id ? data.id.toString().padStart(3, '0') : "000"}</span>
                        <h3 class="name">${data.name}</h3>
                    </div>
                </div>`;

            digiContainer.append(digimonInnerHTML);
            }
        });

    })

    const fetchDigimonData = (page = 0) => {
        $.ajax({
            url: `${apiUrl}`,
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
                <div class="digimon">
                    <div class="imgContainer">
                        <img src="${digi.image}" alt="${name}">
                    </div>
                    <div class="info">
                        <span class="number">${id}</span>
                        <h3 class="name">${name}</h3>
                    </div>
                </div>`;

            digiContainer.append(digimonInnerHTML);
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