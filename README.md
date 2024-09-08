# DIGIVICE
O projeto envolve a criação de um Digivice virtual, inspirado nos dispositivos vistos na franquia Digimon. Usando a Digi-API, o dispositivo permitirá aos usuários acessar informações sobre diferentes Digimons, incluindo suas evoluções e tipos. O projeto pode ser desenvolvido como uma aplicação web ou um aplicativo móvel.

> :construction: Projeto em construção :construction:

# Funcionalidades Principais
Pesquisa de Digimons: O usuário pode inserir o nome de um Digimon para obter suas informações detalhadas.
Linhas de Evolução: Visualização das possíveis evoluções de um Digimon, desde sua forma inicial até a forma final.
Tipos: Exibição das tipagens de cada Digimon.
Favoritos: O usuário pode salvar seus Digimons favoritos para fácil acesso posterior.
Busca por Tipo : Filtros para buscar Digimons por tipo, atributo ou nível de evolução.

#Tecnologias Utilizadas
Frontend: HTML, CSS, JavaScript
Backend: Ainda a ser decidido, com potencial para ser desenvolvido com Node.js, Python, ou qualquer outra tecnologia adequada.
Integração com a Digi-API: A aplicação fará chamadas à Digi-API para obter informações atualizadas sobre os Digimons.
Banco de Dados: Dependendo do backend escolhido, opções como Firebase, MongoDB, ou SQLite podem ser consideradas para armazenar informações do usuário.

# Passos para Implementação
Configuração do Ambiente: Preparar o ambiente de desenvolvimento, instalando as dependências necessárias e configurando o ambiente de trabalho.
Integração com a Digi-API: Implementar chamadas à API para buscar dados sobre os Digimons.
Desenvolvimento das Funcionalidades Principais: Codificar as funcionalidades principais como pesquisa, exibição de informações e favoritos.
Design e Interface de Usuário: Criar uma interface de usuário amigável, garantindo uma boa experiência.
Testes e Depuração: Testar o projeto para assegurar que todas as funcionalidades estejam funcionando corretamente.
Deploy: Fazer o deploy da aplicação em um servidor ou plataforma de hospedagem adequada.

# Exemplo de Uso da Digi-API

```Javascript
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
```
# Onde posso acompanhar o progresso do site?
Atualmente, o projeto está disponível de forma provisória no seguinte endereço: https://caravanastours.com.br/digimon. Em breve, ele estará em um domínio próprio.


