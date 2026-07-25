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
 * Exporta a área completa do dashboard como imagem PNG.
 */
async function exportToPng() {
  const dashboard = document.getElementById("dashboardContent");

  try {
    showExportLoading("exportPng", true);

    const canvas = await html2canvas(dashboard, {
      scale: 2,
      backgroundColor: getDashboardBackground(),
      useCORS: true
    });

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
  const dashboard = document.getElementById("dashboardContent");

  try {
    showExportLoading("exportPdf", true);

    const canvas = await html2canvas(dashboard, {
      scale: 2,
      backgroundColor: getDashboardBackground(),
      useCORS: true
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageHeight = (canvas.height * pageWidth) / canvas.width;

    let remainingHeight = imageHeight;
    let position = 0;

    const imageData = canvas.toDataURL("image/png");

    pdf.addImage(imageData, "PNG", 0, position, pageWidth, imageHeight);
    remainingHeight -= pageHeight;

    while (remainingHeight > 0) {
      position = remainingHeight - imageHeight;
      pdf.addPage();
      pdf.addImage(imageData, "PNG", 0, position, pageWidth, imageHeight);
      remainingHeight -= pageHeight;
    }

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