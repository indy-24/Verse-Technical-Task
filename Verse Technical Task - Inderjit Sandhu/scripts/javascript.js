// Improvements:
// Include validation for search? e.g. if no results come up
// display the search query above results e.g. search results for *users search*
// Add a loading animation - even the actual Giffy website takes a while so a loading animation would be useful
// add the hover option to display more info such as the tag - think you can find these from the API
// if unknown image, atm it leaves a blank space - could add error handling to just continue and add the next gif in its space

var key = "xEijBEHMZQ00Db5qVqNxwj2vOVtHs8tw";   // API key from Giphy Developer section on website
var trendingTotal = 0;                          // Tracks number of currently trending gifs - used as an offset point for loading more
var searchNumber = 12;                          // defines how many results will appear upon a user's search
var toAdd = 12;                                 // defines number of trending Gifs to load
   
// ensures the load, search, remove and load more gifs functions are ready for use on app load of button click
document.addEventListener("DOMContentLoaded", loadTrendingGifs);                           
document.addEventListener("DOMContentLoaded", search);                                     
document.getElementById("search-button").addEventListener("click", removeGifs);            
document.getElementById("load-more-trending").addEventListener("click", loadMoreTrending); 

// -------------------------------------- loads trending Gifs on app load ---------------------------------------
function loadTrendingGifs() {
  // obtains the trending URL from Giphy - starts from offset of current trending total count
  let url = "https://api.giphy.com/v1/gifs/trending?api_key="+key+"&limit="+toAdd+"&offset="+trendingTotal;
  
  fetch(url)                                                    // fetches URL from Giphy API 
  .then(response => response.json() )
  .then(content => {
    // adds the new gifs to add to the DOM
    for (var i = 0; i < toAdd; i++) {
      var figure = document.createElement("figure");              // creates a figure tag
      var img = document.createElement("img");                    // creates an image tag
      img.src = content.data[i].images.downsized.url;             // obtains the loaded image
      img.alt = content.data[i].title;                            // adds the image alt to the image
      img.title = content.data[i].title;                          // adds the image title to the image
      figure.appendChild(img);                                  
      var gifOut = document.querySelector(".trending-results");   // adds the new Gif to the page
      gifOut.appendChild(figure);
    }

    // displays to user number of displayed and total Gifs
    var numberGifs = document.getElementById("trending-number");
    numberGifs.innerHTML = "Showing " + trendingTotal + " of " + content.pagination.total_count + " trending Gifs";
  });
  // updates trending total - meaning next time when more are loaded, 
  // only Gifs from the offset point of trendingTotal are loaded
  trendingTotal += toAdd;
}

// ---------------------------- Recalls loading trending Gifs function when user presses the load more button -----------------------------
function loadMoreTrending() {
  loadTrendingGifs();
}

// ----------------------------------------------- Displays Gifs the user has searched for -------------------------------------------------
function search() {
  
  // stops page reloading and automatically removing the newly loaded Gifs
  document.getElementById("search-button").addEventListener("click", ev => {ev.preventDefault();  
    // used Giphy developers search end point - includes searchNumber to display this number of results
    let url = "https://api.giphy.com/v1/gifs/search?api_key="+key+"&limit="+searchNumber+"&q=";
    let search = document.getElementById("search-bar").value.trim();                              // removes white space from input
    url = url.concat(search);                                                                     //adds users search query to URL


    

    // updates and displays the user's search string as a heading
    var searchHeading = document.getElementById("search-heading");
    searchHeading.textContent = search + " Gifs";
    searchHeading.style.display = "inline-block";

    // checks to see if user left search bar empty - informs them to type if they have
    if (search === "") {
      searchHeading.textContent = "No Gifs found. Why? Because you left the search bar empty! Please try again.";
    }

    fetch(url)
    .then(response => response.json() )
    .then(content => {
      // Loads the searchNumber of Gifs to the screen
      for (var i = 0; i < searchNumber; i++) {
      // Adds the new Gif to the DOM
      var figure = document.createElement("figure");
      var img = document.createElement("img");
      img.src = content.data[i].images.downsized.url;
      img.alt = content.data[i].title;
      img.title = content.data[i].title;
      figure.appendChild(img);
      var gifOut = document.querySelector("#search-results");                                      // add new Gif under search results section
      gifOut.appendChild(figure);
      }
    });
  }); // end add event listener
}

// ----------------------------------------------- Removes the existing gifs from the page -------------------------------------------------
function removeGifs() {
  // removes currently displayed searched gifs
  var searchRemove = document.getElementById("search-results");
  searchRemove.parentNode.removeChild(searchRemove);                    
  //recreates the search-results div for the next search query
  var div = document.createElement('div');
  var oldDiv = document.getElementById("search-section");
  div.id = "search-results";
  oldDiv.insertAdjacentElement("beforeend", div);                            // adds the new div to the end of parent div
  
  // uncomment lines below to remove the trending Gifs upon a search
  // var trendingRemove = document.getElementById("trending");
  // if (!(trendingRemove == null) || (!trendingRemove == "undefined")) {    // if the trending element is found
  //   trendingRemove.parentNode.removeChild(trendingRemove);                // remove, else ignore and proceed
  // }
}