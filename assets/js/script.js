const playerSearchBtn = document.querySelector("#submit-button");
const newSearchBtn = document.querySelector("#submit-button-two");
const playerInputEl = document.querySelector("#player-input");
const playerInputNewEl = document.querySelector("#player-input-new");
const draftYearEl = document.querySelector("#draft-year");
const jerseyEl = document.querySelector("#jersey");
const teamEl = document.querySelector("#team");
const anchorEl = document.querySelector(".stats");
const playerNameEl = document.querySelector("#player-name");
const sectionContainerEl = document.querySelector(".section-container");
const modalEl = document.querySelector(".modal");
const modalContainerEl = document.querySelector(".modal-container");
const nbaTextWrapper = document.querySelector(".nba-text-wrapper");
const newSearchWrapper = document.querySelector(".nba-new-search-wrapper");
let modalCloseEl = document.querySelector(".modal__close");
let appendMeContainerEl = document.querySelector(".append-me");

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
    "X-RapidAPI-Key": "02aa8ccc36msh7aa387c3b284e1fp1af881jsn3ac93989983c",
  },
};

playerSearchBtn.addEventListener("click", function () {
  let playerName = playerInputEl.value;

  if (playerName === "" || playerName === " " || playerName === null) {
    modalEl.classList.add("is-active");
  } else {
    // anchorEl.setAttribute("href", "./stats.html" + playerName)
    nbaTextWrapper.classList.add("hidden");
    appendMeContainerEl.classList.add("hidden");
    newSearchWrapper.classList.remove("hidden");
    getPlayerID(playerName);
    savedSearches(playerName);
  }
});
newSearchBtn.addEventListener("click", function () {
  let playerName = playerInputNewEl.value;

  if (playerName === "" || playerName === " " || playerName === null) {
    modalEl.classList.add("is-active");
  } else {
    getPlayerID(playerName);
    savedSearches(playerName);
  }
});

var getPlayerID = function (player) {
  fetch(`https://www.balldontlie.io/api/v1/players?search=${player}`).then(
    function (response) {
      // debugger;
      if (response.ok) {
        response.json().then(function (data) {
          // Remove class hidden from the container
          sectionContainerEl.classList.remove("hidden");

          if (data.data.length > 0) {
            playerFirstName = data.data[0].first_name;
            playerLastName = data.data[0].last_name;
            playerNameEl.innerHTML = playerFirstName + " " + playerLastName;

            team = data.data[0].team.full_name;
            teamEl.innerHTML = "Team: " + team;

            getPlayerDraftYear(playerLastName, playerFirstName);
          } else {
            // PUT MODAL HERE
            modalEl.classList.add("is-active");
          }
        });
      }
    }
  );
};

var getPlayerDraftYear = function (player, firstname) {
  fetch(
    `https://api-nba-v1.p.rapidapi.com/players?name=${player}`,
    options
  ).then(function (response) {
    response.json().then(function (data) {
      for (let i = 0; i < data.response.length; i++) {
        if (data.response[i].firstname == firstname) {
          playerDraftYear = data.response[i].nba.start;
          playerJerseyNumber = data.response[i].leagues.standard.jersey;

          jerseyEl.innerHTML = "Jersey #: " + playerJerseyNumber;
          draftYearEl.innerHTML =
            "Draft Year: " +
            `<span class="text--yellow">${playerDraftYear}</span>`;

          // Run YouTube function
          fetchTheApi(playerDraftYear);
        }
      }
    });
  });
};

// getPlayerDraftYear()

// YouTube API begin

const videoIframe = document.querySelector(".video-iframe");
const youtubeVideoTitle = document.querySelector("#song");
const videoContainer = document.querySelector(".video-container");

let fetchTheApi = function (userYear) {
  let apiUrl =
    "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=most popular songs of" +
    userYear +
    "&key=AIzaSyDlhGHiQ4BazcwFF_5FyT8TAp5fA9t78RE";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // Run the YouTube embed function with the data as an argument
        createYouTubeContent(data);
      });
    }
  });
};

let createYouTubeContent = function (yaya) {
  console.log(("yaya", yaya));
  for (let i = 0; i < yaya.items.length; i++) {
    // Create title for the container
    youtubeVideoTitle.innerHTML = yaya.items[i].snippet.title;
    // Append Title to container
    videoContainer.appendChild(youtubeVideoTitle);

    // Give the iframe a correct link
    videoIframe.setAttribute(
      "src",
      "https://www.youtube.com/embed/" + yaya.items[i].id.videoId
    );
    // Append iframe to the container
    videoContainer.appendChild(videoIframe);
  }
};

let playersInLocalStorage = JSON.parse(localStorage.getItem("player")) || [];

let savedSearches = function (player) {
  let previousSearchButton = document.createElement("button");
  previousSearchButton.classList.add("btn", "pill");
  previousSearchButton.textContent = player;

  playersInLocalStorage.push(player);
  localStorage.setItem("player", JSON.stringify(playersInLocalStorage));
  appendMeContainerEl.appendChild(previousSearchButton);

  $(".saved-search").on("click", function () {
    let selectedPreviousSearch = $(this).text().trim();
    getPlayerID(selectedPreviousSearch);
    appendMeContainerEl.classList.add("hidden");
  });
};

let loadUserInput = function () {
  var searchedPlayers = JSON.parse(localStorage.getItem("player") || "[]");

  if (searchedPlayers.length === 0) {
    return;
  } else {
    const previousSearchButtonWrapper = document.createElement("div");
    previousSearchButtonWrapper.classList.add("prev-search-wrapper");
    const searchAlert = document.createElement("p");
    searchAlert.classList.add("search-alert");
    searchAlert.textContent = "Previous searches:";
    appendMeContainerEl.appendChild(searchAlert);
    appendMeContainerEl.appendChild(previousSearchButtonWrapper);

    for (let j = 0; j < searchedPlayers.length; j++) {
      let previousSearchButton = document.createElement("button");
      previousSearchButton.textContent = searchedPlayers[j];
      previousSearchButton.classList.add("btn", "pill", "saved-search");
      previousSearchButtonWrapper.appendChild(previousSearchButton);
    }
    $(".saved-search").on("click", function () {
      nbaTextWrapper.classList.add("hidden");
      appendMeContainerEl.classList.add("hidden");
      newSearchWrapper.classList.remove("hidden");
      let selectedPreviousSearch = $(this).text().trim();
      getPlayerID(selectedPreviousSearch);
    });
    const clearSearchButton = document.createElement("button");
    clearSearchButton.textContent = "Clear";
    clearSearchButton.classList.add("btn", "btn--clear", "pill");

    appendMeContainerEl.appendChild(clearSearchButton);
    $(".btn--clear").on("click", function () {
      localStorage.clear();
      appendMeContainerEl.innerHTML = "";
    });
  }
};

modalCloseEl.addEventListener("click", function () {
  modalEl.classList.remove("is-active");
});

loadUserInput();
