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
  console.log(firstTen);

  //GRÁFICO DE BARRAS
  const chartBar = document.getElementById("barras");
  const newChartBar = new Chart(chartBar, {
    type: "bar",
    data: {
      labels: [
        firstTen[0].Country,
        firstTen[1].Country,
        firstTen[2].Country,
        firstTen[3].Country,
        firstTen[4].Country,
        firstTen[5].Country,
        firstTen[6].Country,
        firstTen[7].Country,
        firstTen[8].Country,
        firstTen[9].Country,
      ],
      datasets: [
        {
          label: "Total de mortes",
          data: [
            firstTen[0].TotalDeaths,
            firstTen[1].TotalDeaths,
            firstTen[2].TotalDeaths,
            firstTen[3].TotalDeaths,
            firstTen[4].TotalDeaths,
            firstTen[5].TotalDeaths,
            firstTen[6].TotalDeaths,
            firstTen[7].TotalDeaths,
            firstTen[8].TotalDeaths,
            firstTen[9].TotalDeaths,
          ],
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
