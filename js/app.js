/* =========================================================
   app.js
   Responsável por iniciar o dashboard, carregar os dados
   e atualizar os indicadores principais.
   ========================================================= */

/* Armazena todos os registros lidos do arquivo CSV. */
let allPolls = [];

/* Armazena os registros após a aplicação dos filtros. */
let filteredPolls = [];

/**
 * Aguarda o HTML ser carregado antes de iniciar o dashboard.
 */
document.addEventListener("DOMContentLoaded", async () => {
  setupThemeToggle();
  setupQuickSearch();
  setupExportButtons();

  await loadDashboardData();
});

/**
 * Lê o arquivo CSV localizado na pasta data.
 * O arquivo pode ser substituído futuramente sem alterar o JavaScript,
 * desde que mantenha os mesmos nomes de colunas.
 */
async function loadDashboardData() {
  showLoading(true);

  try {
    const response = await fetch("data/pesquisas2026.csv");

    if (!response.ok) {
      throw new Error("Não foi possível localizar o arquivo de dados.");
    }

    const csvContent = await response.text();

    allPolls = parseCsv(csvContent);
    filteredPolls = [...allPolls];

    if (allPolls.length === 0) {
      throw new Error("O arquivo CSV não possui registros válidos.");
    }

    /* Exibe o dashboard antes de criar gráficos e mapa. */
  showLoading(false);

  updateDashboard();
  updateLastUpdateDate();

  } catch (error) {
    showAlert(error.message, "danger");
    console.error("Erro ao carregar os dados:", error);
  } finally {
    showLoading(false);
  }
}

/**
 * Converte o texto CSV em uma lista de objetos JavaScript.
 *
 * @param {string} csvContent Conteúdo completo do arquivo CSV.
 * @returns {Array<Object>} Registros tratados.
 */
function parseCsv(csvContent) {
  const lines = csvContent.trim().split(/\r?\n/);
  const headers = lines[0]
    .replace(/^\uFEFF/, "")
    .split(",")
    .map((header) => header.trim());

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",").map((value) => value.trim());
      const record = {};

      headers.forEach((header, index) => {
        record[header] = values[index] ?? "";
      });

      return {
        ...record,
        intencao_voto: Number(record.intencao_voto),
        entrevistados: Number(record.entrevistados),
        margem_erro: Number(record.margem_erro),
        dateObject: new Date(`${record.data}T12:00:00`)
      };
    })
    .filter((record) => !Number.isNaN(record.dateObject.getTime()));
}

/**
 * Atualiza todos os componentes que dependem dos dados filtrados.
 * Os filtros, gráficos e mapa serão conectados nas próximas etapas.
 */
function updateDashboard() {
  updateKpis(filteredPolls);

  if (typeof renderFilters === "function") {
    renderFilters(allPolls);
  }

  if (typeof renderCharts === "function") {
    renderCharts(filteredPolls);
  }

  if (typeof renderBrazilMap === "function") {
    renderBrazilMap(filteredPolls);
  }
}

/**
 * Calcula e exibe os indicadores principais do dashboard.
 *
 * @param {Array<Object>} polls Dados atualmente exibidos.
 */
function updateKpis(polls) {
  const uniqueCandidates = new Set(polls.map((poll) => poll.candidato));
  const totalRespondents = polls.reduce(
    (total, poll) => total + poll.entrevistados,
    0
  );

  const averageVote = polls.length
    ? polls.reduce((total, poll) => total + poll.intencao_voto, 0) / polls.length
    : 0;

  const averageMargin = polls.length
    ? polls.reduce((total, poll) => total + poll.margem_erro, 0) / polls.length
    : 0;

  const latestPoll = [...polls].sort(
    (a, b) => b.dateObject - a.dateObject
  )[0];

  setElementText("kpiTotalPolls", polls.length);
  setElementText("kpiCandidates", uniqueCandidates.size);
  setElementText("kpiAverage", `${averageVote.toFixed(1)}%`);
  setElementText(
    "kpiLastPoll",
    latestPoll ? formatDate(latestPoll.dateObject) : "--/--/----"
  );
  setElementText("kpiRespondents", totalRespondents.toLocaleString("pt-BR"));
  setElementText("kpiMarginError", `${averageMargin.toFixed(1)}%`);
}

/**
 * Mostra a data mais recente disponível no CSV na barra superior.
 */
function updateLastUpdateDate() {
  const latestDate = [...allPolls].sort(
    (a, b) => b.dateObject - a.dateObject
  )[0]?.dateObject;

  setElementText(
    "lastUpdate",
    latestDate ? formatDate(latestDate) : "--/--/----"
  );
}

/**
 * Alterna entre os temas escuro e claro.
 */
function setupThemeToggle() {
  const themeButton = document.getElementById("themeToggle");

  themeButton.addEventListener("click", () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-bs-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-bs-theme", nextTheme);
    updateDashboard();

    themeButton.innerHTML =
      nextTheme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
  });
}

/**
 * Prepara a pesquisa rápida.
 * A filtragem efetiva será adicionada junto aos filtros na Etapa 4.
 */
function setupQuickSearch() {
  const searchInput = document.getElementById("quickSearch");

  const applySearchWithDelay = debounce(() => {
    if (typeof applyFilters === "function") {
      applyFilters();
    }
  }, 250);

  searchInput.addEventListener("input", applySearchWithDelay);
}

/**
 * Controla a exibição da tela de carregamento e do dashboard.
 *
 * @param {boolean} isLoading Define se o carregamento está ativo.
 */
function showLoading(isLoading) {
  document.getElementById("loadingState").classList.toggle("d-none", !isLoading);
  document.getElementById("dashboardContent").classList.toggle("d-none", isLoading);
}

/**
 * Exibe uma mensagem amigável na tela.
 *
 * @param {string} message Texto da mensagem.
 * @param {string} type Tipo Bootstrap: danger, warning, success ou info.
 */
function showAlert(message, type = "info") {
  document.getElementById("alertContainer").innerHTML = `
    <div class="alert alert-${type}" role="alert">
      <i class="fa-solid fa-circle-exclamation me-2"></i>${message}
    </div>
  `;
}

/**
 * Atualiza o texto de um elemento pelo seu ID.
 *
 * @param {string} elementId ID do elemento.
 * @param {string|number} value Valor a ser exibido.
 */
function setElementText(elementId, value) {
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = value;
  }
}

/**
 * Formata uma data para o padrão brasileiro.
 *
 * @param {Date} date Data a ser formatada.
 * @returns {string} Data no formato dd/mm/aaaa.
 */
function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}