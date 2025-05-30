let input = document.querySelector(".search-input");

let searchBtn = document.querySelector(".search");
let clearBtn = document.querySelector(".clear");
let resultContainer = document.querySelector(".results");
let countryAliases = ["country", "countries"];
let beachAliases = ["beach", "beaches"];
let templeAliases = ["temples", "temple"];

const matchedInput = (word) => {
  if (countryAliases.includes(word)) return "countries";
  if (beachAliases.includes(word)) return "beaches";
  if (templeAliases.includes(word)) return "temples";
  return null;
};

const findResult = () => {
  resultContainer.innerHTML = "";
  let inputValue = input.value.toLowerCase().trim();
  let finalWord = matchedInput(inputValue);

  fetch("travel_recommendation_api.json")
    .then((res) => res.json())
    .then((data) => {
      let finalResult = [];
      for (let item in data) {
        if (
          item === finalWord &&
          (finalWord === "beaches" || finalWord === "temples")
        ) {
          finalResult = data[item];
        } else if (item === finalWord && finalWord === "countries") {
          finalResult = data[item].map((elem) => elem.cities).flat(1);
        } else {
          let countryMatch = data.countries.find(
            (country) => country.name.toLowerCase() === inputValue
          );

          if (countryMatch) {
            finalResult = countryMatch.cities;
          }
        }
      }

      if (finalResult.length > 0) {
        finalResult.forEach((result) => {
          let searchResult = document.createElement("div");
          searchResult.className = "search-result";
          searchResult.innerHTML = `
            <img src=${result.imageUrl} alt=${result.name} />
            <div class="content">
              <p class="title">${result.name}</p>
              <p class="title-description">
                ${result.description}
              </p>
              <button>Visit</button>
            </div>
          `;
          resultContainer.appendChild(searchResult);
        });
      } else {
        resultContainer.innerHTML = `<p style="font-size:20px;margin-left:150px;padding-top:10px">No results found...</p>`;
      }
    });
};

searchBtn.addEventListener("click", findResult);

clearBtn.addEventListener("click", () => {
  input.value = "";
  resultContainer.innerHTML = "";
});

input.addEventListener("input", () => {
  if (input.value.trim() === "") {
    resultContainer.innerHTML = "";
  }
});
