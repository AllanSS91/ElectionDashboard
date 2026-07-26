/* =========================================================
   utils.js
   Responsável pelas exportações e funções utilitárias gerais.
   ========================================================= */

/**
 * Conecta os botões de exportação às suas respectivas funções.
 */
function setupExportButtons() {
  document.getElementById("exportPng").addEventListener("click", exportToPng);
  document.getElementById("exportPdf").addEventListener("click", exportToPdf);
  document.getElementById("exportExcel").addEventListener("click", exportToExcel);
}

/**
 * Atualiza componentes visuais antes de gerar uma exportação.
 */
async function prepareDashboardForExport() {
  if (typeof refreshBrazilMapForExport === "function") {
    refreshBrazilMapForExport();
  }

  /* Aguarda o Leaflet concluir o novo desenho do mapa. */
  await new Promise((resolve) => setTimeout(resolve, 400));
}

/**
 * Gera uma captura do dashboard, ajustando transformações do Leaflet
 * somente na cópia usada para PNG e PDF.
 *
 * @param {HTMLElement} dashboard Área que será exportada.
 * @returns {Promise<HTMLCanvasElement>} Canvas da captura.
 */
/**
 * Retorna a área principal do dashboard, sem a coluna de filtros.
 *
 * @returns {HTMLElement} Área principal a ser exportada.
 */
function getExportTarget() {
  const target = document.querySelector(
    "section.col-12.col-lg-9.col-xl-10"
  );

  if (!target) {
    throw new Error("Área principal do dashboard não encontrada.");
  }

  return target;
}

/**
 * Gera uma captura mantendo o mesmo layout desktop visível na página.
 *
 * @param {HTMLElement} exportTarget Área principal do dashboard.
 * @returns {Promise<HTMLCanvasElement>} Canvas da captura.
 */
async function createExportCanvas(exportTarget) {
  const targetRect = exportTarget.getBoundingClientRect();
  const mapSnapshot = await createLeafletMapSnapshot();

  return html2canvas(exportTarget, {
    scale: 2,
    backgroundColor: getDashboardBackground(),
    useCORS: true,

    /* Preserva os breakpoints de tela grande na cópia temporária. */
    width: Math.ceil(targetRect.width),
    height: exportTarget.scrollHeight,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,

    onclone: (clonedDocument) => {
      const clonedTarget = clonedDocument.querySelector(
        "section.col-12.col-lg-9.col-xl-10"
      );

      if (clonedTarget) {
        clonedTarget.style.width = `${targetRect.width}px`;
        clonedTarget.style.maxWidth = `${targetRect.width}px`;
        clonedTarget.style.flex = `0 0 ${targetRect.width}px`;
      }

      /* Não mostra os botões de exportação dentro do próprio arquivo. */
      const exportActions = clonedDocument
        .getElementById("exportPng")
        ?.closest(".d-flex");

      if (exportActions) {
        exportActions.style.visibility = "hidden";
      }

      const clonedMap = clonedDocument.getElementById("brazilMap");

      if (!clonedMap || !mapSnapshot) {
        return;
      }

      const mapImage = clonedDocument.createElement("img");

      mapImage.src = mapSnapshot;
      mapImage.alt = "Mapa do Brasil por estado";
      mapImage.style.width = "100%";
      mapImage.style.height = "100%";
      mapImage.style.display = "block";
      mapImage.style.objectFit = "fill";

      clonedMap.replaceChildren(mapImage);
    }
  });
}

/**
 * Converte a camada SVG do Leaflet em uma imagem estática para exportação.
 * Isso evita erros de escala e deslocamento do html2canvas.
 *
 * @returns {Promise<string|null>} Imagem PNG no formato data URL.
 */
async function createLeafletMapSnapshot() {
  const map = document.getElementById("brazilMap");
  const sourceSvg = map?.querySelector(".leaflet-overlay-pane svg");

  if (!map || !sourceSvg) {
    return null;
  }

  const mapRect = map.getBoundingClientRect();
  const svgClone = sourceSvg.cloneNode(true);

  const originalPaths = [...sourceSvg.querySelectorAll("path")];
  const clonedPaths = [...svgClone.querySelectorAll("path")];

  if (!originalPaths.length) {
    return null;
  }

  /* Calcula os limites reais dos estados, sem usar o deslocamento Leaflet. */
  const pathBounds = originalPaths.map((path) => path.getBBox());
  const minX = Math.min(...pathBounds.map((bounds) => bounds.x));
  const maxX = Math.max(...pathBounds.map((bounds) => bounds.x + bounds.width));
  const minY = Math.min(...pathBounds.map((bounds) => bounds.y));
  const maxY = Math.max(...pathBounds.map((bounds) => bounds.y + bounds.height));

  const padding = 14;
  const mapAspect = mapRect.width / mapRect.height;
  let viewWidth = maxX - minX + padding * 2;
  let viewHeight = maxY - minY + padding * 2;

  /* Mantém a proporção do cartão e centraliza o Brasil. */
  if (viewWidth / viewHeight > mapAspect) {
    viewHeight = viewWidth / mapAspect;
  } else {
    viewWidth = viewHeight * mapAspect;
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const viewX = centerX - viewWidth / 2;
  const viewY = centerY - viewHeight / 2;

  clonedPaths.forEach((path, index) => {
    const computedStyle = getComputedStyle(originalPaths[index]);

    [
      "fill",
      "fill-opacity",
      "stroke",
      "stroke-opacity",
      "stroke-width",
      "stroke-linecap",
      "stroke-linejoin"
    ].forEach((property) => {
      path.setAttribute(property, computedStyle.getPropertyValue(property));
    });
  });

  svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgClone.setAttribute("width", mapRect.width * 2);
  svgClone.setAttribute("height", mapRect.height * 2);
  svgClone.setAttribute(
    "viewBox",
    `${viewX} ${viewY} ${viewWidth} ${viewHeight}`
  );

  svgClone.style.transform = "none";
  svgClone.style.background = "#10233d";

  const svgText = new XMLSerializer().serializeToString(svgClone);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = Math.ceil(mapRect.width * 2);
      canvas.height = Math.ceil(mapRect.height * 2);

      context.fillStyle = "#10233d";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => resolve(null);
    image.src = svgUrl;
  });
}

/**
 * Localiza posições entre cartões para evitar cortes no PDF.
 *
 * @param {HTMLElement} exportTarget Área exportada.
 * @param {HTMLCanvasElement} canvas Canvas final.
 * @returns {Array<number>} Pontos seguros de quebra em pixels.
 */
function getPdfBreakPoints(exportTarget, canvas) {
  const targetRect = exportTarget.getBoundingClientRect();
  const scale = canvas.width / targetRect.width;

  return [...exportTarget.querySelectorAll(".chart-card")]
    .map((card) => {
      const cardRect = card.getBoundingClientRect();

      return Math.round(
        (cardRect.top - targetRect.top) * scale
      );
    })
    .sort((first, second) => first - second);
}

/**
 * Exporta a área completa do dashboard como imagem PNG.
 */
async function exportToPng() {
  try {
    showExportLoading("exportPng", true);

    await prepareDashboardForExport();

    const exportTarget = getExportTarget();
    const canvas = await createExportCanvas(exportTarget);

    downloadFile(
      canvas.toDataURL("image/png"),
      `dashboard-eleicoes-${getFileDate()}.png`
    );

    showAlert("Imagem PNG exportada com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao exportar PNG:", error);
    showAlert("Não foi possível exportar a imagem PNG.", "danger");
  } finally {
    showExportLoading("exportPng", false);
  }
}

/**
 * Exporta a área completa do dashboard como documento PDF.
 */
async function exportToPdf() {
  try {
    showExportLoading("exportPdf", true);

    await prepareDashboardForExport();

    const exportTarget = getExportTarget();
    const canvas = await createExportCanvas(exportTarget);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const margin = 0;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const rowBreaks = [...new Set(getPdfBreakPoints(exportTarget, canvas))]
      .sort((first, second) => first - second);

    /*
     * A primeira página termina antes da primeira linha de gráficos
     * em duas colunas, mantendo cada linha inteira em uma única folha.
     */
    const breakPosition = rowBreaks.length >= 3
      ? rowBreaks[2]
      : canvas.height / 2;

    const pageSlices = [
      { start: 0, height: breakPosition },
      { start: breakPosition, height: canvas.height - breakPosition }
    ];

    const largestSlice = Math.max(...pageSlices.map((slice) => slice.height));
    const minimumPixelsPerMillimeter = largestSlice / pageHeight;
    const printableWidth = Math.min(
      pageWidth - margin * 2,
      canvas.width / minimumPixelsPerMillimeter
    );
    const pixelsPerMillimeter = canvas.width / printableWidth;

    pageSlices.forEach((slice, index) => {
      if (index > 0) {
        pdf.addPage();
      }

      const pageCanvas = document.createElement("canvas");
      const context = pageCanvas.getContext("2d");

      pageCanvas.width = canvas.width;
      pageCanvas.height = slice.height;

      context.drawImage(
        canvas,
        0,
        slice.start,
        canvas.width,
        slice.height,
        0,
        0,
        canvas.width,
        slice.height
      );

      const imageHeight = slice.height / pixelsPerMillimeter;
      const imageX = (pageWidth - printableWidth) / 2;
      const imageY = 0;

      pdf.addImage(
        pageCanvas.toDataURL("image/png"),
        "PNG",
        imageX,
        imageY,
        printableWidth,
        imageHeight
      );
    });

    pdf.save(`dashboard-eleicoes-${getFileDate()}.pdf`);

    showAlert("Documento PDF exportado com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao exportar PDF:", error);
    showAlert("Não foi possível exportar o documento PDF.", "danger");
  } finally {
    showExportLoading("exportPdf", false);
  }
}

/**
 * Exporta somente os registros atualmente filtrados para Excel.
 */
function exportToExcel() {
  try {
    showExportLoading("exportExcel", true);

    const exportData = filteredPolls.map((poll) => ({
      "Data da pesquisa": formatDate(poll.dateObject),
      "Instituto": poll.instituto,
      "Candidato": poll.candidato,
      "Partido": poll.partido,
      "UF": poll.uf,
      "Região": poll.regiao,
      "Turno": `${poll.turno}º turno`,
      "Intenção de voto (%)": poll.intencao_voto,
      "Entrevistados": poll.entrevistados,
      "Margem de erro (%)": poll.margem_erro
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Pesquisas filtradas");

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 22 },
      { wch: 24 },
      { wch: 12 },
      { wch: 8 },
      { wch: 18 },
      { wch: 12 },
      { wch: 22 },
      { wch: 16 },
      { wch: 20 }
    ];

    XLSX.writeFile(
      workbook,
      `pesquisas-eleicoes-${getFileDate()}.xlsx`
    );

    showAlert("Planilha Excel exportada com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao exportar Excel:", error);
    showAlert("Não foi possível exportar a planilha Excel.", "danger");
  } finally {
    showExportLoading("exportExcel", false);
  }
}

/**
 * Altera visualmente o botão durante uma exportação.
 *
 * @param {string} buttonId ID do botão.
 * @param {boolean} isLoading Define se a exportação está em andamento.
 */
function showExportLoading(buttonId, isLoading) {
  const button = document.getElementById(buttonId);

  if (!button.dataset.originalContent) {
    button.dataset.originalContent = button.innerHTML;
  }

  button.disabled = isLoading;

  button.innerHTML = isLoading
    ? '<i class="fa-solid fa-spinner fa-spin me-1"></i> Exportando...'
    : button.dataset.originalContent;
}

/**
 * Faz download de uma imagem gerada pelo navegador.
 *
 * @param {string} dataUrl Conteúdo da imagem.
 * @param {string} fileName Nome final do arquivo.
 */
function downloadFile(dataUrl, fileName) {
  const link = document.createElement("a");

  link.href = dataUrl;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Retorna a data atual em formato adequado para nomes de arquivos.
 *
 * @returns {string} Data no formato aaaa-mm-dd.
 */
function getFileDate() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Define o fundo da exportação conforme o tema ativo.
 *
 * @returns {string} Cor de fundo em hexadecimal.
 */
function getDashboardBackground() {
  const currentTheme = document.documentElement.getAttribute("data-bs-theme");

  return currentTheme === "light" ? "#f2f5f9" : "#0b1628";
}

/**
 * Aguarda um intervalo antes de executar uma função.
 * Evita atualizações excessivas durante a digitação.
 *
 * @param {Function} callback Função a executar.
 * @param {number} delay Tempo de espera em milissegundos.
 * @returns {Function} Função com atraso.
 */
function debounce(callback, delay = 300) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
