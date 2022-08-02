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
          backgroundColor: [
            "rgba(237, 165, 62, 0.8)",
            "rgba(0, 171, 128, 0.8)",
            "rgba(172, 20, 30, 0.8)",
          ],
          borderColor: [
            "rgba(237, 165, 62, 1)",
            "rgba(0, 171, 128, 1)",
            "rgba(172, 20, 30, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
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
          backgroundColor: ["rgba(255, 99, 132, 0.8)"],
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
