// DADOS DO SUMMARY
async function getDataSummary() {
  try {
    const response = await axios.get("https://api.covid19api.com/summary");
    const dataSummary = response.data;
    return dataSummary;
  } catch (error) {
    console.error(error);
  }
}

// CRIAÇÃO DINÂMICA DE OPTIONS NO SELECT DE PAÍS
async function optionsCountries() {
  const dataSummary = await getDataSummary();
  const dataCountries = dataSummary.Countries;
  let optionsCountries = document.getElementById("cmbCountry");
  let inner = "";
  for (let item of dataCountries) {
    const { Country } = item;
    if (Country.toUpperCase() == "BRAZIL") {
      inner += `<option value="${Country}" selected>${Country}</option>`;
    } else {
      inner += `<option value="${Country}">${Country}</option>`;
    }
  }
  optionsCountries.innerHTML = inner;
}

// DADOS DE CADA PAÍS
async function getDataCountryDaily(country) {
  try {
    const response = await axios.get(
      `https://api.covid19api.com/country/${country}`
    );
    const dataCountry = response.data;
    return dataCountry;
  } catch (error) {
    console.error(error);
  }
}

// INTERAÇÃO COM INPUTS
const buttonSubmit = document.getElementById("filtro");
buttonSubmit.addEventListener("click", filter);

async function filter() {
  const valueInputCountry = document.getElementById("cmbCountry").value;
  const valueInputDateStart = document.getElementById("date_start").value;
  const valueInputDateEnd = document.getElementById("date_end").value;
  const valueInputTypeData = document.getElementById("cmbData").value;

  insertInHtmlCountry(
    valueInputCountry,
    valueInputDateStart,
    valueInputDateEnd,
    valueInputTypeData
  );
}

// INSERIR DADOS NA PÁGINA
async function insertInHtmlCountry(country, dateStart, dateEnd, dataType) {
  // Informações totais do país

  const dataSummary = await getDataSummary();
  const dataCountries = dataSummary.Countries;
  innerConfirmed = "";
  innerDeaths = "";
  innerRecovered = "";
  for (item of dataCountries) {
    let { TotalConfirmed, TotalDeaths, TotalRecovered, Country } = item;
    if (Country === country) {
      innerConfirmed = TotalConfirmed;
      innerDeaths = TotalDeaths;
      innerRecovered = TotalRecovered;
    }
  }

  document.getElementById("kpiconfirmed").textContent = innerConfirmed;
  document.getElementById("kpideaths").textContent = innerDeaths;
  document.getElementById("kpirecovered").textContent = innerRecovered;

  // Informações diárias do país

  const dataCountryDaily = await getDataCountryDaily(country);
  let arrayDate = [];
  let arrayData = [];

  if (!dateStart) {
    dateStart = 0;
  } else {
    dateStart = new Date(dateStart).getTime();
  }
  if (!dateEnd) {
    dateEnd = Infinity;
  } else {
    dateEnd = new Date(dateEnd).getTime();
  }

  for (let i = 0; i < dataCountryDaily.length; i++) {
    if (i === 0) {
      continue;
    }
    let dateAPI = dataCountryDaily[i].Date;
    let timeStamp = new Date(dateAPI).getTime();

    if (timeStamp >= dateStart && timeStamp <= dateEnd) {
      let cases =
        dataCountryDaily[i][dataType] - dataCountryDaily[i - 1][dataType];
      if (cases < 0) {
        cases = 0;
      }
      arrayDate.push(dateAPI.slice(0, 10));
      arrayData.push(cases);
    }
  }
  const sum = arrayData.reduce((partialSum, a) => partialSum + a, 0);
  const average = Math.round(sum / arrayData.length);
  const arrayAverage = new Array(arrayData.length).fill(average);

  let config = {
    type: "line",
    data: {
      labels: [...arrayDate],
      datasets: [
        {
          label: dataType,
          data: [...arrayData],
          backgroundColor: ["#BF7034"],
          borderColor: ["#BF7034"],
          borderWidth: 1,
        },
        {
          label: "Média",
          data: [...arrayAverage],
          backgroundColor: ["#a4262c"],
          borderColor: ["#a4262c"],
          borderWidth: 0.5,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  if (!document.getElementById("linhas")) {
    let canvas = document.createElement("canvas");
    canvas.setAttribute("id", "linhas");
    canvas.setAttribute("width", "300");
    canvas.setAttribute("height", "100");
    document.getElementById("divOfCanvas").appendChild(canvas);
    let chartLine = document.getElementById("linhas");
    let newChartLine = new Chart(chartLine, config);
  } else {
    document.getElementById("linhas").remove();
    let canvas = document.createElement("canvas");
    canvas.setAttribute("id", "linhas");
    canvas.setAttribute("width", "300");
    canvas.setAttribute("height", "100");
    document.getElementById("divOfCanvas").appendChild(canvas);
    let chartLine = document.getElementById("linhas");
    let newChartLine = new Chart(chartLine, config);
  }
}

// CARREGAR DADOS ONLOAD
window.onload = async () => {
  await optionsCountries();
  await insertInHtmlCountry(
    "Brazil",
    "2022-03-25T00:00:00Z",
    "2022-05-27T00:00:00Z",
    "Confirmed"
  );
};
