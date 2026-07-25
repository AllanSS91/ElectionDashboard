/* =========================================================
   charts.js
   Responsável pela criação e atualização dos gráficos ApexCharts.
   ========================================================= */

const chartInstances = {};

/**
 * Atualiza todos os gráficos com os dados filtrados.
 *
 * @param {Array<Object>} polls Pesquisas após aplicação dos filtros.
 */
function renderCharts(polls) {
  renderVoteEvolutionChart(polls);
  renderCandidateComparisonChart(polls);
  renderInstituteDonutChart(polls);
  renderMonthlyHistoryChart(polls);
  renderInstituteRankingChart(polls);
  renderMovingAverageChart(polls);
  renderStateHeatmapChart(polls);
}

/**
 * Retorna opções visuais compatíveis com o tema atual.
 *
 * @returns {Object} Cores e configurações compartilhadas.
 */
function getChartTheme() {
  const isDarkTheme =
    document.documentElement.getAttribute("data-bs-theme") === "dark";

  return {
    textColor: isDarkTheme ? "#f8fafc" : "#172033",
    mutedColor: isDarkTheme ? "#a8b6ca" : "#667085",
    gridColor: isDarkTheme
      ? "rgba(255, 255, 255, 0.10)"
      : "rgba(23, 32, 51, 0.12)",
    colors: ["#2d8cff", "#27c08a", "#f7b84b", "#f05b69", "#9b6dff"]
  };
}

/**
 * Remove uma instância de gráfico anterior antes de redesenhá-la.
 *
 * @param {string} chartId ID do container do gráfico.
 */
function destroyChart(chartId) {
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
  }

  document.getElementById(chartId).innerHTML = "";
}

/**
 * Mostra uma mensagem quando não existem dados para um gráfico.
 *
 * @param {string} chartId ID do container.
 */
function showChartEmptyState(chartId) {
  document.getElementById(chartId).innerHTML = `
    <p class="text-body-secondary text-center py-5 mb-0">
      Nenhum dado disponível para os filtros selecionados.
    </p>
  `;
}

/**
 * Gera o gráfico de linha de evolução das intenções de voto.
 */
function renderVoteEvolutionChart(polls) {
  const chartId = "voteEvolutionChart";
  destroyChart(chartId);

  if (!polls.length) {
    showChartEmptyState(chartId);
    return;
  }

  const theme = getChartTheme();
  const candidates = getUniqueValues(polls, "candidato");
  const allDates = [...new Set(polls.map((poll) => poll.data))].sort();
  const voteValues = polls.map((poll) => poll.intencao_voto);
  const lowestVote = Math.min(...voteValues);
  const highestVote = Math.max(...voteValues);

/* Cria uma margem visual proporcional, sem ultrapassar 0% e 100%. */
  const voteRange = Math.max(highestVote - lowestVote, 4);
  const axisPadding = Math.max(voteRange * 0.25, 2);

  const dynamicMin = Math.max(0, Math.floor(lowestVote - axisPadding));
  const dynamicMax = Math.min(100, Math.ceil(highestVote + axisPadding));

  const series = candidates.map((candidate) => ({
    name: candidate,
    data: allDates.map((date) => {
      const datePolls = polls.filter(
        (poll) => poll.candidato === candidate && poll.data === date
      );

      if (!datePolls.length) {
        return 0;
      }

      const totalVotes = datePolls.reduce(
        (total, poll) => total + poll.intencao_voto,
        0
      );

      return Number((totalVotes / datePolls.length).toFixed(1));
    })
  }));

  chartInstances[chartId] = new ApexCharts(
    document.getElementById(chartId),
    {
      chart: {
        type: "line",
        height: 330,
        toolbar: { show: false },
        background: "transparent"
      },
      series,
      colors: theme.colors,
      stroke: { curve: "smooth", width: 3 },
      markers: { size: 4 },
      xaxis: {
        type: "category",
        categories: allDates.map(formatResearchDate),
        labels: {
          rotate: -45,
          style: { colors: theme.mutedColor }
        }
      },
      yaxis: {
        min: dynamicMin,
        max: dynamicMax,
        tickAmount: 5,
        labels: {
            style: { colors: theme.mutedColor },
            formatter: (value) => `${value.toFixed(0)}%`
        }
      },
      grid: { borderColor: theme.gridColor },
      legend: {
        position: "top",
        labels: { colors: theme.textColor }
      },
      tooltip: {
        theme: document.documentElement.getAttribute("data-bs-theme"),
        shared: true,
        intersect: false,
        y: { formatter: (value) => `${value.toFixed(1)}%` }
    }
    }
  );

  chartInstances[chartId].render();
}

/**
 * Gera barras comparando a média de intenção de voto por candidato.
 */
function renderCandidateComparisonChart(polls) {
  const chartId = "candidateComparisonChart";
  destroyChart(chartId);

  if (!polls.length) {
    showChartEmptyState(chartId);
    return;
  }

  const theme = getChartTheme();
  const averages = getAverageByField(polls, "candidato");

  chartInstances[chartId] = new ApexCharts(
    document.getElementById(chartId),
    {
      chart: {
        type: "bar",
        height: 330,
        toolbar: { show: false },
        background: "transparent"
      },
      series: [{
        name: "Intenção média",
        data: averages.map((item) => Number(item.value.toFixed(1)))
      }],
      colors: [theme.colors[0]],
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: "55%"
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (value) => `${value.toFixed(1)}%`
      },
      xaxis: {
        categories: averages.map((item) => item.label),
        labels: { style: { colors: theme.mutedColor } }
      },
      yaxis: {
        labels: {
          style: { colors: theme.mutedColor },
          formatter: (value) => `${value.toFixed(0)}%`
        }
      },
      grid: { borderColor: theme.gridColor },
      tooltip: {
        theme: document.documentElement.getAttribute("data-bs-theme"),
        y: { formatter: (value) => `${value.toFixed(1)}%` }
      }
    }
  );

  chartInstances[chartId].render();
}

/**
 * Gera o gráfico de donut com a quantidade de registros por instituto.
 */
function renderInstituteDonutChart(polls) {
  const chartId = "instituteDonutChart";
  destroyChart(chartId);

  if (!polls.length) {
    showChartEmptyState(chartId);
    return;
  }

  const theme = getChartTheme();
  const counts = getCountByField(polls, "instituto");

  chartInstances[chartId] = new ApexCharts(
    document.getElementById(chartId),
    {
      chart: {
        type: "donut",
        height: 330,
        background: "transparent"
      },
      series: counts.map((item) => item.value),
      labels: counts.map((item) => item.label),
      colors: theme.colors,
      legend: {
        position: "bottom",
        labels: { colors: theme.textColor }
      },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: "Pesquisas",
                color: theme.mutedColor
              }
            }
          }
        }
      },
      tooltip: {
        theme: document.documentElement.getAttribute("data-bs-theme"),
        y: { formatter: (value) => `${value} registros` }
      }
    }
  );

  chartInstances[chartId].render();
}

/**
 * Gera gráfico de área com a quantidade de pesquisas por mês.
 */
function renderMonthlyHistoryChart(polls) {
  const chartId = "monthlyHistoryChart";
  destroyChart(chartId);

  if (!polls.length) {
    showChartEmptyState(chartId);
    return;
  }

  const theme = getChartTheme();
  const monthlyData = {};

  polls.forEach((poll) => {
    const month = poll.data.substring(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  const months = Object.keys(monthlyData).sort();

  chartInstances[chartId] = new ApexCharts(
    document.getElementById(chartId),
    {
      chart: {
        type: "area",
        height: 330,
        toolbar: { show: false },
        background: "transparent"
      },
      series: [{
        name: "Pesquisas",
        data: months.map((month) => monthlyData[month])
      }],
      colors: [theme.colors[1]],
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.5,
          opacityTo: 0.05
        }
      },
      stroke: { curve: "smooth", width: 3 },
      xaxis: {
        categories: months.map(formatMonth),
        labels: { style: { colors: theme.mutedColor } }
      },
      yaxis: {
        labels: { style: { colors: theme.mutedColor } }
      },
      grid: { borderColor: theme.gridColor },
      tooltip: {
        theme: document.documentElement.getAttribute("data-bs-theme")
      }
    }
  );

  chartInstances[chartId].render();
}

/**
 * Gera ranking horizontal dos institutos pela quantidade de registros.
 */
function renderInstituteRankingChart(polls) {
  const chartId = "instituteRankingChart";
  destroyChart(chartId);

  if (!polls.length) {
    showChartEmptyState(chartId);
    return;
  }

  const theme = getChartTheme();
  const ranking = getCountByField(polls, "instituto")
    .sort((first, second) => second.value - first.value);

  chartInstances[chartId] = new ApexCharts(
    document.getElementById(chartId),
    {
      chart: {
        type: "bar",
        height: 330,
        toolbar: { show: false },
        background: "transparent"
      },
      series: [{
        name: "Registros",
        data: ranking.map((item) => item.value)
      }],
      colors: [theme.colors[2]],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 5
        }
      },
      dataLabels: { enabled: true },
      xaxis: {
        categories: ranking.map((item) => item.label),
        labels: { style: { colors: theme.mutedColor } }
      },
      yaxis: {
        labels: { style: { colors: theme.mutedColor } }
      },
      grid: { borderColor: theme.gridColor },
      tooltip: {
        theme: document.documentElement.getAttribute("data-bs-theme")
      }
    }
  );

  chartInstances[chartId].render();
}

/**
 * Gera a média móvel de três pesquisas por candidato.
 */
function renderMovingAverageChart(polls) {
  const chartId = "movingAverageChart";
  destroyChart(chartId);

  if (!polls.length) {
    showChartEmptyState(chartId);
    return;
  }

  const theme = getChartTheme();
  const candidates = getUniqueValues(polls, "candidato");

  const allDates = [...new Set(polls.map((poll) => poll.data))].sort();

const series = candidates.map((candidate) => {
  const candidatePolls = polls
    .filter((poll) => poll.candidato === candidate)
    .sort((first, second) => first.dateObject - second.dateObject);

  const voteValues = candidatePolls.map((poll) => poll.intencao_voto);

  /* Guarda a média móvel de cada data disponível para o candidato. */
  const movingAverageByDate = {};

  candidatePolls.forEach((poll, index) => {
    movingAverageByDate[poll.data] = calculateMovingAverage(
      voteValues,
      index,
      3
    );
  });

  /* Todas as séries recebem as mesmas datas.
     Datas sem pesquisa assumem zero para manter o traçado e o tooltip
     alinhados entre todos os candidatos. */
  return {
    name: candidate,
    data: allDates.map((date) => movingAverageByDate[date] ?? 0)
  };
});

  chartInstances[chartId] = new ApexCharts(
    document.getElementById(chartId),
    {
      chart: {
        type: "line",
        height: 330,
        toolbar: { show: false },
        background: "transparent"
      },
      series,
      colors: theme.colors,
      stroke: { curve: "smooth", width: 3, dashArray: 4 },
      xaxis: {
        type: "category",
        categories: allDates.map(formatResearchDate),
        labels: {
          rotate: -45,
          style: { colors: theme.mutedColor }
        }
      },
      yaxis: {
        labels: {
          style: { colors: theme.mutedColor },
          formatter: (value) => `${value.toFixed(0)}%`
        }
      },
      grid: { borderColor: theme.gridColor },
      legend: {
        position: "top",
        labels: { colors: theme.textColor }
      },
      tooltip: {
        theme: document.documentElement.getAttribute("data-bs-theme"),
        shared: true,
        intersect: false,
        y: {
        formatter: (value) => `${value.toFixed(1)}%`
        }
      }
    }
  );

  chartInstances[chartId].render();
}

/**
 * Gera heatmap com a média de intenção de voto por estado e candidato.
 */
function renderStateHeatmapChart(polls) {
  const chartId = "stateHeatmapChart";
  destroyChart(chartId);

  if (!polls.length) {
    showChartEmptyState(chartId);
    return;
  }

  const theme = getChartTheme();
  const states = getUniqueValues(polls, "uf");
  const candidates = getUniqueValues(polls, "candidato");

  const series = candidates.map((candidate) => ({
    name: candidate,
    data: states.map((state) => {
      const statePolls = polls.filter(
        (poll) => poll.candidato === candidate && poll.uf === state
      );

      const average = statePolls.length
        ? statePolls.reduce(
          (total, poll) => total + poll.intencao_voto,
          0
        ) / statePolls.length
        : 0;

      return {
        x: state,
        y: Number(average.toFixed(1))
      };
    })
  }));

  chartInstances[chartId] = new ApexCharts(
    document.getElementById(chartId),
    {
      chart: {
        type: "heatmap",
        height: 330,
        toolbar: { show: false },
        background: "transparent"
      },
      series,
      dataLabels: { enabled: true },
      colors: [theme.colors[0]],
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.65,
          radius: 4,
          colorScale: {
            ranges: [
              { from: 0, to: 0, color: "#334155", name: "Sem dados" },
              { from: 0.1, to: 20, color: "#1d4ed8", name: "Até 20%" },
              { from: 20.1, to: 30, color: "#2563eb", name: "20% a 30%" },
              { from: 30.1, to: 100, color: "#27c08a", name: "Acima de 30%" }
            ]
          }
        }
      },
      xaxis: {
        labels: { style: { colors: theme.mutedColor } }
      },
      yaxis: {
        labels: { style: { colors: theme.mutedColor } }
      },
      legend: {
        labels: { colors: theme.textColor }
      },
      tooltip: {
        theme: document.documentElement.getAttribute("data-bs-theme"),
        y: { formatter: (value) => `${value.toFixed(1)}%` }
      }
    }
  );

  chartInstances[chartId].render();
}

/**
 * Agrupa registros por data e calcula a média de intenção de voto.
 *
 * @param {Array<Object>} polls Dados de um candidato.
 * @returns {Array<Array<number>>} Pares de timestamp e média.
 */
function getAverageByDate(polls) {
  const groupedData = {};

  polls.forEach((poll) => {
    const key = poll.data;

    if (!groupedData[key]) {
      groupedData[key] = [];
    }

    groupedData[key].push(poll.intencao_voto);
  });

  return Object.entries(groupedData)
    .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
    .map(([date, values]) => [
      new Date(`${date}T12:00:00`).getTime(),
      Number(
        (values.reduce((total, value) => total + value, 0) / values.length)
          .toFixed(1)
      )
    ]);
}

/**
 * Calcula a média de intenção de voto por campo informado.
 */
function getAverageByField(polls, field) {
  const groupedData = {};

  polls.forEach((poll) => {
    if (!groupedData[poll[field]]) {
      groupedData[poll[field]] = [];
    }

    groupedData[poll[field]].push(poll.intencao_voto);
  });

  return Object.entries(groupedData)
    .map(([label, values]) => ({
      label,
      value: values.reduce((total, value) => total + value, 0) / values.length
    }))
    .sort((first, second) => second.value - first.value);
}

/**
 * Conta quantos registros existem para cada valor de um campo.
 */
function getCountByField(polls, field) {
  const counts = {};

  polls.forEach((poll) => {
    counts[poll[field]] = (counts[poll[field]] || 0) + 1;
  });

  return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

/**
 * Calcula média móvel a partir de uma posição e janela informadas.
 */
function calculateMovingAverage(values, index, windowSize) {
  const start = Math.max(0, index - windowSize + 1);
  const windowValues = values.slice(start, index + 1);

  return Number(
    (windowValues.reduce((total, value) => total + value, 0) /
      windowValues.length).toFixed(1)
  );
}

/**
 * Formata a referência AAAA-MM como mês/ano em português.
 */
function formatMonth(month) {
  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "2-digit"
  }).format(date);
}

/**
 * Formata a data real de uma pesquisa para o eixo horizontal.
 */
function formatResearchDate(dateString) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(`${dateString}T12:00:00`));
}
