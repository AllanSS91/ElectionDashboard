/* =========================================================
   filters.js
   Cria os filtros laterais e aplica-os aos dados do dashboard.
   ========================================================= */

let filtersCreated = false;

/**
 * Cria os campos de filtro apenas uma vez, após o CSV ser carregado.
 *
 * @param {Array<Object>} polls Lista completa de pesquisas.
 */
function renderFilters(polls) {
  if (filtersCreated) {
    return;
  }

  const container = document.getElementById("filtersContainer");

  container.innerHTML = `
    ${createSelectFilter("instituteFilter", "Instituto", getUniqueValues(polls, "instituto"))}
    ${createSelectFilter("candidateFilter", "Candidato", getUniqueValues(polls, "candidato"))}
    ${createSelectFilter("partyFilter", "Partido", getUniqueValues(polls, "partido"))}
    ${createSelectFilter("stateFilter", "Estado (UF)", getUniqueValues(polls, "uf"))}
    ${createSelectFilter("regionFilter", "Região", getUniqueValues(polls, "regiao"))}
    ${createSelectFilter("roundFilter", "Turno", ["1", "2"])}

    <div class="filter-group">
      <label for="startDate">Data inicial</label>
      <input id="startDate" class="form-control" type="date">
    </div>

    <div class="filter-group">
      <label for="endDate">Data final</label>
      <input id="endDate" class="form-control" type="date">
    </div>
  `;

  document.querySelectorAll("#filtersContainer select, #filtersContainer input")
    .forEach((field) => {
      field.addEventListener("change", applyFilters);
    });

  document.getElementById("clearFilters").addEventListener("click", clearFilters);

  filtersCreated = true;
}

/**
 * Gera o HTML de um seletor de filtro.
 *
 * @param {string} id ID do campo.
 * @param {string} label Texto visível do campo.
 * @param {Array<string>} options Opções disponíveis.
 * @returns {string} HTML do filtro.
 */
function createSelectFilter(id, label, options) {
  const optionsHtml = options
    .map((option) => `<option value="${option}">${option}</option>`)
    .join("");

  return `
    <div class="filter-group">
      <label for="${id}">${label}</label>
      <select id="${id}" class="form-select">
        <option value="">Todos</option>
        ${optionsHtml}
      </select>
    </div>
  `;
}

/**
 * Extrai valores únicos de uma coluna, ordenados alfabeticamente.
 *
 * @param {Array<Object>} polls Dados completos.
 * @param {string} field Nome da propriedade desejada.
 * @returns {Array<string>} Valores únicos.
 */
function getUniqueValues(polls, field) {
  return [...new Set(polls.map((poll) => poll[field]))]
    .filter(Boolean)
    .sort((first, second) => first.localeCompare(second, "pt-BR"));
}

/**
 * Aplica todos os filtros aos dados completos.
 * A função também considera a pesquisa rápida da navbar.
 */
function applyFilters() {
  const institute = document.getElementById("instituteFilter").value;
  const candidate = document.getElementById("candidateFilter").value;
  const party = document.getElementById("partyFilter").value;
  const state = document.getElementById("stateFilter").value;
  const region = document.getElementById("regionFilter").value;
  const round = document.getElementById("roundFilter").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const searchTerm = document.getElementById("quickSearch").value
    .trim()
    .toLowerCase();

  filteredPolls = allPolls.filter((poll) => {
    const matchesInstitute = !institute || poll.instituto === institute;
    const matchesCandidate = !candidate || poll.candidato === candidate;
    const matchesParty = !party || poll.partido === party;
    const matchesState = !state || poll.uf === state;
    const matchesRegion = !region || poll.regiao === region;
    const matchesRound = !round || poll.turno === round;
    const matchesStartDate = !startDate || poll.data >= startDate;
    const matchesEndDate = !endDate || poll.data <= endDate;

    const matchesSearch =
      !searchTerm ||
      poll.candidato.toLowerCase().includes(searchTerm) ||
      poll.instituto.toLowerCase().includes(searchTerm) ||
      poll.partido.toLowerCase().includes(searchTerm);

    return (
      matchesInstitute &&
      matchesCandidate &&
      matchesParty &&
      matchesState &&
      matchesRegion &&
      matchesRound &&
      matchesStartDate &&
      matchesEndDate &&
      matchesSearch
    );
  });

  updateDashboard();
  showEmptyResultsMessage();
}

/**
 * Limpa todos os filtros e recupera os dados completos.
 */
function clearFilters() {
  document.querySelectorAll("#filtersContainer select, #filtersContainer input")
    .forEach((field) => {
      field.value = "";
    });

  document.getElementById("quickSearch").value = "";

  filteredPolls = [...allPolls];
  updateDashboard();
  showEmptyResultsMessage();
}

/**
 * Exibe uma mensagem caso nenhum registro corresponda aos filtros.
 */
function showEmptyResultsMessage() {
  const alertContainer = document.getElementById("alertContainer");

  if (filteredPolls.length === 0) {
    alertContainer.innerHTML = `
      <div class="alert alert-warning" role="alert">
        <i class="fa-solid fa-filter-circle-xmark me-2"></i>
        Nenhuma pesquisa foi encontrada para os filtros selecionados.
      </div>
    `;
  } else {
    alertContainer.innerHTML = "";
  }
}