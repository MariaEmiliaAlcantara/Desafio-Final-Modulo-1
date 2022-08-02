async function getData() {
  try {
    const response = await axios.get("https://api.covid19api.com/summary");
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function insertInHtml() {
  const data = await getData();
  const dataGlobal = data.Global;

  // INFORMAÇÕES KPIS
  let globalTotalConfirmed = dataGlobal.TotalConfirmed;
  let globalTotalDeaths = dataGlobal.TotalDeaths;
  let globalTotalRecovered = dataGlobal.TotalRecovered;
  let dateOfSearch = new Date();

  // INSERIR KPIS
  let pConfirmed = document.getElementById("confirmed");
  let pDeath = document.getElementById("death");
  let pRecovered = document.getElementById("recovered");
  let updateDate = document.getElementById("dateSpan");

  pConfirmed.textContent = globalTotalConfirmed;
  pDeath.textContent = globalTotalDeaths;
  pRecovered.textContent = globalTotalRecovered;
  updateDate.textContent = dateOfSearch;

  // INFORMAÇÕES PIZZA
  let globalNewConfirmed = dataGlobal.NewConfirmed;
  let globalNewDeaths = dataGlobal.NewDeaths;
  let globalNewRecovered = dataGlobal.NewRecovered;

  // GRÁFICO DE PIZZA
  const chartPizza = document.getElementById("pizza");
  const newChartPizza = new Chart(chartPizza, {
    type: "pie",
    data: {
      labels: ["Confirmados", "Recuperados", "Mortes"],
      datasets: [
        {
          label: "Distribuição de novos casos",
          data: [globalNewConfirmed, globalNewRecovered, globalNewDeaths],
          backgroundColor: ["#BF7034", "#407855", "#a4262c"],
          borderColor: ["#BF7034", "#407855", "#a4262c"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Distribuição de novos casos",
        },
      },
    },
  });

  // INFORMAÇÕES BARRAS
  const dataCountries = data.Countries;
  let array = [];
  for (let item of dataCountries) {
    let { Country, TotalDeaths } = item;
    array.push({ Country, TotalDeaths });
  }
  array.sort((a, b) => b.TotalDeaths - a.TotalDeaths);
  let firstTen = array.slice(0, 10);
  const firstTenCountry = firstTen.map((item) => item.Country);
  const firstTenCasesDeaths = firstTen.map((item) => item.TotalDeaths);

  //GRÁFICO DE BARRAS
  const chartBar = document.getElementById("barras");
  const newChartBar = new Chart(chartBar, {
    type: "bar",
    data: {
      labels: firstTenCountry,
      datasets: [
        {
          label: "Total de mortes",
          data: firstTenCasesDeaths,
          backgroundColor: ["#40587c"],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Total de mortes por país - TOP 10",
        },
      },
    },
  });
}

window.onload = async () => {
  await insertInHtml();
};
