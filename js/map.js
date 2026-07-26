/* =========================================================
   map.js
   Responsável pelo mapa coroplético do Brasil com Leaflet.
   ========================================================= */

const BRAZIL_GEOJSON_URL =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

let brazilMap;
let brazilStatesLayer;
let brazilGeoJson;

/**
 * Cria ou atualiza o mapa do Brasil a partir das pesquisas filtradas.
 *
 * @param {Array<Object>} polls Pesquisas após aplicação dos filtros.
 */
async function renderBrazilMap(polls) {
  const mapContainer = document.getElementById("brazilMap");

  if (!mapContainer) {
    return;
  }

  try {
    initializeBrazilMap();

    if (!brazilGeoJson) {
      brazilGeoJson = await loadBrazilGeoJson();
    }

    renderStatesLayer(polls);
  } catch (error) {
    console.error("Erro ao carregar o mapa:", error);

    mapContainer.innerHTML = `
      <p class="text-body-secondary text-center py-5 mb-0">
        Não foi possível carregar o mapa do Brasil.
      </p>
    `;
  }
}

/**
 * Inicializa o mapa apenas uma vez.
 */
function initializeBrazilMap() {
  if (brazilMap) {
    return;
  }

  brazilMap = L.map("brazilMap", {
    zoomControl: true,
    attributionControl: false,
    scrollWheelZoom: false,
    zoomSnap: 0.25
  });

  brazilMap.setView([-14.235, -51.9253], 4);
}

/**
 * Busca o arquivo GeoJSON com os limites dos estados brasileiros.
 *
 * @returns {Promise<Object>} Dados geográficos dos estados.
 */
async function loadBrazilGeoJson() {
  const response = await fetch(BRAZIL_GEOJSON_URL);

  if (!response.ok) {
    throw new Error("Não foi possível obter os limites dos estados.");
  }

  return response.json();
}

/**
 * Desenha os estados e aplica a cor correspondente à média de votos.
 *
 * @param {Array<Object>} polls Dados filtrados.
 */
function renderStatesLayer(polls) {
  if (brazilStatesLayer) {
    brazilStatesLayer.remove();
  }

  const stateAverages = calculateStateAverages(polls);

  brazilStatesLayer = L.geoJSON(brazilGeoJson, {
    style: (feature) => {
      const stateAbbreviation = getStateAbbreviation(feature);
      const average = stateAverages[stateAbbreviation]?.average || 0;

      return {
        color: "#d7e0ea",
        weight: 1,
        fillColor: getStateColor(average),
        fillOpacity: average ? 0.82 : 0.3
      };
    },

    onEachFeature: (feature, layer) => {
      const stateAbbreviation = getStateAbbreviation(feature);
      const stateData = stateAverages[stateAbbreviation];
      const stateName = getStateName(feature);

      const averageText = stateData
        ? `${stateData.average.toFixed(1)}%`
        : "Sem dados";

      const regionText = stateData?.region || "Não informada";

      layer.bindTooltip(
        `
          <strong>${stateName} (${stateAbbreviation})</strong><br>
          Região: ${regionText}<br>
          Intenção média: ${averageText}
        `,
        { sticky: true }
      );

      layer.on({
        mouseover: (event) => {
          event.target.setStyle({
            weight: 3,
            color: "#ffffff",
            fillOpacity: 0.95
          });
        },

        mouseout: (event) => {
          brazilStatesLayer.resetStyle(event.target);
        },

        click: (event) => {
          brazilMap.fitBounds(event.target.getBounds(), {
            padding: [20, 20]
          });
        }
      });
    }
  }).addTo(brazilMap);

  setTimeout(() => {
    refreshBrazilMapForExport();
  }, 300);
}

/**
 * Calcula a média de intenção de voto e identifica a região por estado.
 *
 * @param {Array<Object>} polls Pesquisas filtradas.
 * @returns {Object} Dados agrupados por UF.
 */
function calculateStateAverages(polls) {
  const groupedStates = {};

  polls.forEach((poll) => {
    if (!groupedStates[poll.uf]) {
      groupedStates[poll.uf] = {
        votes: [],
        region: poll.regiao
      };
    }

    groupedStates[poll.uf].votes.push(poll.intencao_voto);
  });

  Object.keys(groupedStates).forEach((state) => {
    const votes = groupedStates[state].votes;

    groupedStates[state].average =
      votes.reduce((total, value) => total + value, 0) / votes.length;
  });

  return groupedStates;
}

/**
 * Define a cor de cada estado conforme sua média de intenção de voto.
 *
 * @param {number} average Média de intenção de voto.
 * @returns {string} Cor hexadecimal.
 */
function getStateColor(average) {
  if (average === 0) {
    return "#64748b";
  }

  if (average <= 20) {
    return "#2563eb";
  }

  if (average <= 30) {
    return "#1d4ed8";
  }

  if (average <= 40) {
    return "#15803d";
  }

  return "#22c55e";
}

/**
 * Obtém o nome do estado em diferentes formatos possíveis de GeoJSON.
 *
 * @param {Object} feature Estado do GeoJSON.
 * @returns {string} Nome do estado.
 */
function getStateName(feature) {
  return (
    feature.properties.name ||
    feature.properties.nome ||
    feature.properties.NM_UF ||
    "Estado não identificado"
  );
}

/**
 * Converte o nome do estado do GeoJSON para a sigla oficial da UF.
 *
 * @param {Object} feature Estado do GeoJSON.
 * @returns {string} Sigla da UF.
 */
function getStateAbbreviation(feature) {
  const stateName = normalizeStateName(getStateName(feature));

  const abbreviations = {
  "ACRE": "AC",
  "ALAGOAS": "AL",
  "AMAPA": "AP",
  "AMAZONAS": "AM",
  "BAHIA": "BA",
  "CEARA": "CE",
  "DISTRITO FEDERAL": "DF",
  "ESPIRITO SANTO": "ES",
  "GOIAS": "GO",
  "MARANHAO": "MA",
  "MATO GROSSO": "MT",
  "MATO GROSSO DO SUL": "MS",
  "MINAS GERAIS": "MG",
  "PARA": "PA",
  "PARAIBA": "PB",
  "PARANA": "PR",
  "PERNAMBUCO": "PE",
  "PIAUI": "PI",
  "RIO DE JANEIRO": "RJ",
  "RIO GRANDE DO NORTE": "RN",
  "RIO GRANDE DO SUL": "RS",
  "RONDONIA": "RO",
  "RORAIMA": "RR",
  "SANTA CATARINA": "SC",
  "SAO PAULO": "SP",
  "SERGIPE": "SE",
  "TOCANTINS": "TO"
};

  return abbreviations[stateName] || "--";
}

/**
 * Remove acentos e padroniza o texto para comparações.
 *
 * @param {string} text Texto original.
 * @returns {string} Texto normalizado.
 */
function normalizeStateName(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

/**
 * Recalcula o tamanho e o enquadramento do mapa.
 * Usada também antes das exportações.
 */
function refreshBrazilMapForExport() {
  if (!brazilMap || !brazilStatesLayer) {
    return;
  }

  brazilMap.invalidateSize({
    pan: false,
    animate: false
  });

  brazilMap.fitBounds(brazilStatesLayer.getBounds(), {
    padding: [8, 8],
    maxZoom: 4.5,
    animate: false
  });
}
