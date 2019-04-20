// array to hold all the buttons/search words for gifs
var gifButtons = ["Dumbledore", "cats", "alpacas", "Bangtan"];
var oneButton; // variable to store dynamically created buttons

$(document).ready(function() {
    // show all buttons in gifButtons
    displayButtons();

    // if user wants to add a new gif button, type in input box & click submit
    $("#more-buttons").on("click", function() {
        console.log("click");

        // store user's input & clear input box
        storeInput();
        console.log(gifButtons);

        // reload gif buttons to include new button
        displayButtons();

    });

    
});

function storeInput() {
    // stores the user's input
    var userInput = $("#get-more-gifs").val();
    // clear's the user's input after storing
    $("#get-more-gifs").val("");

    // only store input if there's actually some text
    if(userInput.length>0) {
        // stores user's input into the gifButtons array
        gifButtons.push(userInput);
    };
};

function displayButtons() {
    // clear button display to ensure no repeats
    $("#gif-buttons-here").html("");

    // for each item in button array, create a button & show on page
    for(var i=0; i<gifButtons.length; i++) {
        oneButton = $("<button>", {class: "gif-button", text: gifButtons[i], value: gifButtons[i]});

        $("#gif-buttons-here").append(oneButton);
    }

    //show gifs associated w/ the button text
    showGifs();
};

function showGifs() {
    // if button w/ phrase for gif is selected
    $(".gif-button").on("click", function() {
        console.log("click");
        // clear previous gifs
        $(".gif-div").remove();

        // get value of button that was clicked
        var searchWord = $(this).val();
        // set the query url to giphy api w/ the button word
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchWord + "&api_key=dc6zaTOxFJmzC&limit=10"

        console.log(searchWord);

        // send query to giphy api to 'get' items based on search word
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) { // the following function executes based on the response
            console.log(response);

            // for each of the 10 gifs sent out do the following
            for(var i=0; i<10; i++) {
                // dynamically create an overarching div to store gif
                var gifDiv = $("<div>", {class: "gif-div"});
                // create image element to store gif & set image source to gif url
                var gifImage = $("<img>", {src: response.data[i].images.fixed_height_still.url,
                                        class: "gif-image",
                                        // following 3 attributes associated w/ animatedStillGifs function
                                        "state": "still",
                                        "data-still": response.data[i].images.fixed_height_still.url,
                                        "data-animated": response.data[i].images.fixed_height.url});
                // dynamically create element to store gif rating & set text to rating
                var gifRating = $("<p>", {class: "gif-rating", text: "Rating: " + response.data[i].rating});
                var addFavorite = $("<p>", {class: "add-favorite",
                                        text: "Add to Favorites",
                                        "link-still": response.data[i].images.fixed_height_still.url,
                                        "link-animated": response.data[i].images.fixed_height.url,
                                        "link-rating": response.data[i].rating});

                // append image & rating to overarching div
                gifDiv.append(gifRating, addFavorite, gifImage);

                // append overarching div to static element on html page
                $("#gifs-here").append(gifDiv);
            };

            animatedStillGifs();
            addToFavorites();
        });
    });
};

function animatedStillGifs () {
    // click on gif to animate or still image
    $(".gif-image").on("click", function() {
        console.log("gif clicked");
        console.log($(this).attr("src"));

        // if image is still, change to animated
        if($(this).attr("state")==="still") {
            $(this).attr("src", $(this).attr("data-animated"));
            $(this).attr("state", "animated");
        }
        else { // if image is animated, change to still
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("state", "still");
        };
    });
};

function addToFavorites() {
    $(".add-favorite").on("click", function() {
        console.log("add to favorite clicked");

        var favoriteGIF = $("<div>");
        var favoriteGIFImage = $("<img>", {src: $(this).attr("link-still"),
                                        class: "gif-image",
                                        "state": "still",
                                        "data-still": $(this).attr("link-still"),
                                        "data-animated": $(this).attr("link-animated")});
        var favoriteGIFRating = $("<p>", {text: $(this).attr("link-rating")});

        favoriteGIF.append(favoriteGIFRating, favoriteGIFImage);

        $("#fav-gifs").append(favoriteGIF);
    })
}