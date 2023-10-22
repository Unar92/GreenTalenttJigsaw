// Check if the query parameter 'nocache' is present in the URL
if (!window.location.href.includes('nocache')) {
    // If not, generate a random 'nocache' value
    const randomParam = `nocache=${Math.random()}`;
    
    // Get the current URL
    const currentURL = window.location.href;
    
    // Redirect to the same page with the random query parameter added
    const separator = (currentURL.includes('?') ? '&' : '?');
    window.location.href = currentURL + separator + randomParam;
  }
/// custom code 
$(document).ready(function () {
    // Add a random query parameter to the current URL

    $('#cs-form').submit(function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type: "POST",
            url: 'process_form.php',
            data: formData,
            success: function (response) {
                var emailFromForm = $('.usrEmail').val(); 
                var nameFromForm = $('.usrName').val(); 
                $('#success_message').html(response);
                $('#success_message').animate({ opacity: 1 }, 1000);
                $("#cs-form").hide();

                window.location.href = 'puzzle.html';
                // Check if userSession exists and if yes, remove it
                if (sessionStorage.getItem('userSession')) {
                    sessionStorage.removeItem('userSession');
                }
                var userSession = {
                    'userSession': 'active',
                    'retryCount': 2,
                    'userEmail': emailFromForm, // The user's email
                    'userName': nameFromForm // The user's name
                };
                sessionStorage.setItem('userSession', JSON.stringify(userSession));
            },
            error: function () {
                $('#error_message').html("Error while sending data.");
                $('#error_message').animate({ opacity: 1 }, 1000);

            }
        });
    });
});




//timer 
var countdownTimer; // global variable
var endTime; // global variable

function startTimer() {
    var duration = 47; // in seconds
    var currentTime = Date.parse(new Date());
    endTime = new Date(currentTime + duration * 1000);

    countdownTimer = setInterval(function () {
        var now = new Date().getTime();
        var distance = endTime - now;

        timeLeft = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('timer').textContent = timeLeft;

        if (distance < 1000) {
            clearInterval(countdownTimer);
            document.getElementById('timer').textContent = "00:00";
            window.location.href = 'puzzle-lost.php';
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdownTimer);
    var now = new Date().getTime();
    var timeElapsed = Math.floor((now - endTime + 45000) / 1000); // Calculate time elapsed
    updateScore(timeElapsed); // Call the function to update score
    window.location.href = 'puzzle-won.php';

}


function updateScore(score) {
    var user = sessionStorage.getItem('userSession');
    $.ajax({
        type: "POST",
        url: 'update_score.php',
        data: { score: score, user: user },
        success: function (response) {
            console.log(response);
        },
        error: function () {
            console.log("Error while updating score.");
        }
    });
}

function userLost() {
    
    var userSession = JSON.parse(sessionStorage.getItem('userSession'));
    userSession.retryCount--;
    sessionStorage.setItem('userSession', JSON.stringify(userSession));

    updateRetryMessage();
}

function updateRetryMessage() {
    var userSession = JSON.parse(sessionStorage.getItem('userSession'));
    if (userSession && userSession.retryCount >= 0) {
        $(".retry-message").text("YOU CAN TRY FOR " + userSession.retryCount + " MORE TIMES");
        $(".retry-btn").text("Retry (" + userSession.retryCount + ")");
    } else {
        $(".retry-message").text("NO RETRY LEFT");
        $(".retry-btn").hide();


    }
}

$(document).ready(function () {

    updateRetryMessage();
    var userSession = JSON.parse(sessionStorage.getItem('userSession'));
    if (userSession && userSession.userSession == 'active') {
        if (userSession.retryCount > 0) {
           // $("#cs-form").hide();
            
            //Show the game here

        } else {
            // Inform user that he/she has no more retries
           $(".retry-message").hide();
            $(".retry-btn").hide();
        }
    }
});





//animation effect for elements 
$(document).ready(function () {
  
    $('.animated-element').animate({ opacity: 1 }, 1000); // Fades in over 1 second
});


// get --vh variable
let vh = window.innerHeight * 0.01;


function enterFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}