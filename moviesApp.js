// var nouns = null;
// var colors = null;
// var adjs = null;
// var verbs = null;
// var trigger = false;
var movies = null;


var getMovies = function () {
  fetch("https://deployimdb.herokuapp.com/movies", {
    credentials: 'include'
  }).then(function (response) {
      if (response.status == 401) {
        //NOT LOGGED IN
        //TODO show the <login-reg-div>
        showLoginRegDiv();
      } else if (response.status != 200) {
        showTopErrorDiv("Unexpected error occured. Try again.");
      } else if (response.status == 200) {
        response.json().then(function (data) {
          console.log("movie loaded from server", data);
          console.log("the movies are: ", data);
          movies = data;

          // data is an array of string values
          var movieList = document.querySelector("#mainHolder");
          movieList.innerHTML = "";

          // add the movie
          data.forEach( function (movie) { //for movie in movies
              var newMovieContainer = document.createElement("div");
              newMovieContainer.className = "movie-container";

              var movieTitleSpan = document.createElement("span");
              movieTitleSpan.innerHTML = movie.title;
              movieTitleSpan.className = "movie-info";
              newMovieContainer.appendChild(movieTitleSpan);

              var movieProducerSpan = document.createElement("span");
              if (movie.producer) {
                movieProducerSpan.innerHTML = `Producer: ${movie.producer}`;
              } else {
                movieProducerSpan.innerHTML = "Not listed";
              }
              movieProducerSpan.className = "movie-info";
              newMovieContainer.appendChild(movieProducerSpan)


              var movieLengthSpan = document.createElement("span");
              if (movie.length) {
                movieLengthSpan.innerHTML = `Length: ${movie.length} mins`;
              } else {
                movieLengthSpan.innerHTML = "No length available";
              }
              movieLengthSpan.className = "movie-info";
              newMovieContainer.appendChild(movieLengthSpan);

              var movieRatingSpan = document.createElement("span");
              if (movie.rating) {
                movieRatingSpan.innerHTML = `Rating: ${movie.rating} stars`;
              } else {
                movieRatingSpan.innerHTML = "No rating";
              }
              movieRatingSpan.className = "movie-info";
              newMovieContainer.appendChild(movieRatingSpan);

              var movieGenreSpan =  document.createElement("span");
              movieGenreSpan.innerHTML = movie.genre;
              movieGenreSpan.className = "movie-info";
              newMovieContainer.appendChild(movieGenreSpan);

              var deleteButton = document.createElement("button");
              deleteButton.innerHTML = "Delete";
              deleteButton.className = "button";
              deleteButton.onclick = function () {
                var proceed = confirm(`Do you want to delete ${movie.title}?`);
                if (proceed) {
                  deleteMovie(movie.id);
                }
              };
              newMovieContainer.appendChild(deleteButton);

              var updateButton = document.createElement("button");
              updateButton.innerHTML = "Update";
              updateButton.className = "button";
              updateButton.onclick = function () {
                showEditForm(movie, newMovieContainer)
              };
              newMovieContainer.appendChild(updateButton);

              movieList.appendChild(newMovieContainer);
              console.log("appended to movieList: ", newMovieContainer)
            });// end of "data.forEach( function (movie)"
            showTopAddMovieDiv();
          });// end of "response.json().then(function (data)" INSIDE of "else if (response.status == 200)"
      }// end of "else if (response.status == 200)"
  });
};


var showEditForm = function(movie, newMovieContainer) {

      newMovieContainer.innerHTML = ""
      //var updateMovieDiv =  document.createElement("div");

      var umTitle = document.createElement("div");
      umTitle.className = "movie-info";
        var umTitleInputBox = document.createElement("input");
        umTitleInputBox.type = "text";
        umTitleInputBox.value = movie.title;
        umTitle.appendChild(umTitleInputBox);
      newMovieContainer.appendChild(umTitle);

      var umProducer = document.createElement("div");
      umProducer.className = "movie-info";
        var umProducerInputBox = document.createElement("input");
        umProducerInputBox.type = "text";
        umProducerInputBox.value = movie.producer;
        umProducer.appendChild(umProducerInputBox);
      newMovieContainer.appendChild(umProducer);

      var umLength = document.createElement("div");
      umLength.className = "movie-info";
        var umLengthInputBox = document.createElement("input");
        umLengthInputBox.type = "text";
        umLengthInputBox.value = movie.length;
        umLength.appendChild(umLengthInputBox);
      newMovieContainer.appendChild(umLength);

      var umRating = document.createElement("div");
      umRating.className = "movie-info";
        var umRatingInputBox = document.createElement("input");
        umRatingInputBox.type = "text";
        umRatingInputBox.value = movie.rating
        umRating.appendChild(umRatingInputBox);
      newMovieContainer.appendChild(umRating);

      var umGenre = document.createElement("div");
      umGenre.className = "movie-info";
        var umGenreInputBox = document.createElement("input");
        umGenreInputBox.type = "text";
        umGenreInputBox.value = movie.genre;
        umGenre.appendChild(umGenreInputBox);
      newMovieContainer.appendChild(umGenre);

      var umHoldButtonSpan = document.createElement("div");
        var umButton = document.createElement("button");
        umButton.className = "button";
        umButton.innerHTML = "Update"
        umButton.onclick = function () {
          var proceed = confirm(`Do you want to permanently alter this info?`);
          if (proceed) {
            var newTitle = umTitleInputBox.value;
            var newProducer = umProducerInputBox.value;
            var newLength = umLengthInputBox.value;
            var newRating = umRatingInputBox.value;
            var newGenre = umGenreInputBox.value;
            var data = "title=" + encodeURIComponent(newTitle);
            data += "&producer=" + encodeURIComponent(newProducer);
            data += "&length=" + encodeURIComponent(newLength);
            data += "&rating=" + encodeURIComponent(newRating);
            data += "&genre=" + encodeURIComponent(newGenre);
            //data += "&id=" + encodeURIComponent(movie.id);

            console.log(data);
          //{} following fetch is for options
          fetch(`https://deployimdb.herokuapp.com/movies/${movie.id}`, {
            method: 'PUT',
            credentials: 'include',
            body: data,
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            }
          }).then(function (response) {
            console.log("movie saved.");
            getMovies();
            hideTopErrorDiv();
          });
          }
        };
        umHoldButtonSpan.appendChild(umButton);
      newMovieContainer.appendChild(umHoldButtonSpan);

};

var deleteMovie = function (id) {
  fetch(`https://deployimdb.herokuapp.com/movies/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then(function (response) {
    console.log("movie deleted.");
    getMovies();
    // one more thing to do: refresh the restaurants
  });
};

var updateMovie = function (id) {
  fetch(`https://deployimdb.herokuapp.com/movies/${id}`, {
    method: 'PUT',
    credentials: 'include'
  }).then(function (response) {
    console.log("movie info updated.");
    getMovies();
    // one more thing to do: refresh the restaurants
  });
};

/////
var hideTopErrorDiv = function () {
  tErrorDiv = document.querySelector("#t-error-div");
  tErrorDiv.style.display = "none";
}
hideTopErrorDiv();
/////
var showTopErrorDiv = function (content) {
  tErrorDiv = document.querySelector("#t-error-div");
  tErrorDiv.style.display = "block";
  tErrorDiv.innerHTML = content
}

/////
var hideMainLoginDiv = function () {
  mainLoginDiv = document.querySelector("#main-login-div");
  mainLoginDiv.style.display = "none";
}
hideMainLoginDiv();
/////
var showMainLoginDiv = function () {
  mainLoginDiv = document.querySelector("#main-login-div");
  mainLoginDiv.style.display = "block";
}
/////
var hideLoginRegDiv = function () {
  loginRegDiv = document.querySelector("#login-reg-div");
  loginRegDiv.style.display = "none";
}
hideLoginRegDiv();

var showLoginRegDiv = function () {
  loginRegDiv = document.querySelector("#login-reg-div");
  loginRegDiv.style.display = "block";
}

/////
var hideTopAddMovieDiv = function () {
  tamDiv = document.querySelector("#tam-div");
  tamDiv.style.display = "none";
}
hideTopAddMovieDiv();

var showTopAddMovieDiv = function () {
  tamDiv = document.querySelector("#tam-div");
  tamDiv.style.display = "block";
}

/////
var hideMainRegDiv = function () {
  mainRegDiv = document.querySelector("#main-reg-div");
  mainRegDiv.style.display = "none";
}
hideMainRegDiv();

var showMainRegDiv = function () {
  mainRegDiv = document.querySelector("#main-reg-div");
  mainRegDiv.style.display = "block";
}
/////
var hideAddMovieBox = function () {
  addMovieBox = document.querySelector("#add-movie-box");
  addMovieBox.style.display = "none";
}
hideAddMovieBox();

var showAddMovieBox = function () {
  addMovieBox = document.querySelector("#add-movie-box");
  addMovieBox.style.display = "block";
}
/////
var tLoginButton = document.querySelector("#t-login-button");
tLoginButton.onclick = function () {
  showMainLoginDiv();
  hideLoginRegDiv();
};
/////
var tRegButton = document.querySelector("#t-reg-button");
tRegButton.onclick = function () {
  showMainRegDiv();
  hideLoginRegDiv();
};
/////
var addMovieButton = document.querySelector("#add-movie-button");
addMovieButton.onclick = function () {
  showAddMovieBox();
  hideTopAddMovieDiv();
};
/////


var loginSubmitButton = document.querySelector("#login-submit-button");
loginSubmitButton.onclick = function() {
  var emailLoginInput = document.querySelector("#emailLogin");
  var passwordLoginInput = document.querySelector("#passwordLogin");
  console.log("Login inputs: ", emailLoginInput, passwordLoginInput);

  var emailLogin = emailLoginInput.value;
  var passwordLogin = passwordLoginInput.value;
  var data = "email=" + encodeURIComponent(emailLogin);
  data += "&password=" + encodeURIComponent(passwordLogin);

  emailLoginInput.value = "";
  passwordLoginInput.value = "";

  console.log(data);
  //{} following fetch is for options
  fetch("https://deployimdb.herokuapp.com/sessions", {
    method: 'POST',
    body: data,
    credentials: 'include',
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    if (response.status == 201) {
      console.log("Password verified??");
      getMovies();
      hideMainLoginDiv();
      showTopAddMovieDiv();
    } else {
      console.log("Status not 201. status=", response.status)
      showTopErrorDiv("Incorrect email or Password.")
      hideMainLoginDiv();
      showLoginRegDiv();
    }

  });


};

var regSubmitButton = document.querySelector("#reg-submit-button");
regSubmitButton.onclick = function () {
      hideTopErrorDiv();

      var fnameRegInput = document.querySelector("#fnameReg");
      var lnameRegInput = document.querySelector("#lnameReg");
      var emailRegInput = document.querySelector("#emailReg");
      var passwordRegInput = document.querySelector("#passwordReg");
      console.log("Inputs: ", fnameRegInput, lnameRegInput, emailRegInput, passwordRegInput);

      var fnameReg = fnameRegInput.value;
      var lnameReg = lnameRegInput.value;
      var emailReg = emailRegInput.value;
      var passwordReg = passwordRegInput.value;
      var data = "fname=" + encodeURIComponent(fnameReg);
      data += "&lname=" + encodeURIComponent(lnameReg);
      data += "&email=" + encodeURIComponent(emailReg);
      data += "&password=" + encodeURIComponent(passwordReg);

      fnameRegInput.value = "";
      lnameRegInput.value = "";
      emailRegInput.value = "";
      passwordRegInput.value = "";

      console.log(data);
    //{} following fetch is for options
    fetch("https://deployimdb.herokuapp.com/users", {
      method: 'POST',
      body: data,
      credentials: 'include',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    }).then(function (response) {
      if (response.status == 422) {
        showTopErrorDiv("Invalid Email. Account already exists for that email.")
      } else if (response.status != 201) {
        showTopErrorDiv("Unexpected error occured. Try again");
      } else if (response.status == 201) {
        console.log("User Saved");
        console.log(emailReg);
        //getMovies();
        showLoginRegDiv();

        hideMainRegDiv();//TODO need to figure out where to put
        //showTopAddMovieDiv();
      }

    });

};

/////
var tamButton = document.querySelector("#tam-button");
tamButton.onclick = function () {
      var tamTitleInput = document.querySelector("#tamTitle");
      var tamProducerInput = document.querySelector("#tamProducer");
      var tamLengthInput = document.querySelector("#tamLength");
      var tamRatingInput = document.querySelector("#tamRating");
      var tamGenreInput = document.querySelector("#tamGenre");
      console.log("Inputs: ", tamTitleInput, tamProducerInput, tamLengthInput, tamRatingInput, tamGenreInput);

      var tamTitle = tamTitleInput.value;
      var tamProducer = tamProducerInput.value;
      var tamLength = tamLengthInput.value;
      var tamRating = tamRatingInput.value;
      var tamGenre = tamGenreInput.value;
      var data = "title=" + encodeURIComponent(tamTitle);
      data += "&producer=" + encodeURIComponent(tamProducer);
      data += "&length=" + encodeURIComponent(tamLength);
      data += "&rating=" + encodeURIComponent(tamRating);
      data += "&genre=" + encodeURIComponent(tamGenre);

      tamTitleInput.value = "";
      tamProducerInput.value = "";
      tamLengthInput.value = "";
      tamRatingInput.value = "";
      tamGenreInput.value = "";

      console.log(data);
    //{} following fetch is for options
    fetch("https://deployimdb.herokuapp.com/movies", {
      method: 'POST',
      body: data,
      credentials: 'include',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    }).then(function (response) {
      console.log("movie saved.");
      getMovies();
      // refresh the list of nouns
    });
      hideAddMovieBox();
      showTopAddMovieDiv();
};

getMovies();
