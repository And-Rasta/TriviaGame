
'use strict'

const missed = -255;                 


const maxTime = 30;                         // How long the player will have to answer a question.
var gameStarted = false;                    // Flag the game has started
var game;                                   // Game object
var timerInterval;                          // Interval function.
var questionClose = "</a></p>";             // Closing HTML for a question.
var imagePath = "./assets/images/";         // Path to images
var progressBarRef;                         // Reference to our progress bar plugin


var bgPath = './assets/images/background-images/';      
var backgroundImages = [
    bgPath + 'hp1.jpg',
    bgPath + 'hp2.jpg',
    bgPath + 'hp3.jpg',
    bgPath + 'hp4.jpg',
    bgPath + 'hp5.jpg',  
];

// Our question object
function Question(question, answers, aboutAnswer, correctIndex, imgPath) {
    this.question = question;               // The question 
    this.answers = answers;                 // An array of selectable answers
    this.aboutAnswer = aboutAnswer;         // A blurb about the answer
    this.correctIndex = correctIndex;       // The index of which answer is correct
    this.imagePath = imgPath;               // Path of an image to display
}


////////// QUESTION SETUP //////////////////////////////////////////////////////////////////////////////
var question1 = new Question("What is Hagrid's full name?", 
            [ 
                "Hagrid 'Hell's Angels' Giant", 
                "Hagrid Potter",
                "Rubeus Hagrid",
                "Hodor Hagrid"
            ], "The half-giant Hogwarts gamekeeper is named Rubeus Hagrid", 
            2,  imagePath + "hagrid.jpg");

var question2 = new Question("Where does Moaning Myrtle live?", 
            [
                "Harry's closet",
                "Girls' bathroom at Hogwarts",
                "Brothel in Hogsmeade",
                "Azkaban Prison",
            ], "Moaning Myrtle haunts the girl's toilets on the first floor at Hogwarts, after she was killed by a Basilisk.", 
            1, imagePath + "myrtle.jpg");

var question3 = new Question("Who is Hermione Granger's pet?",
            [
                "Kneazle the Kinkajou",
                "Gruffalo the Grunion",
                "Scabbers the Rat",
                "Crookshanks the Cat",   
            ], "Right in the pilot episode, we learn Charlie has a crush on the Waitress", 
            3, imagePath + "gato.jpg");

var question4 = new Question("What is a Dementor?",
            [
                "A prank that goes bad",
                "A spell to turn you into a demon",
                "A creature that sucks out your soul",
                "A sickly sweet candy",
            ], "These guards of Azkaban prison are magical creaturs who feed on human happiness, extracting souls with their Dementor's Kiss.", 
            2, imagePath + "dementor.gif");

            var question5 = new Question("What was the name of Dee's \"Crazy\" Irish Character?", 
            [
                "Crazy Paddy",
                "Crazy MacDonald",
                "Crazy McPoyle",
                "Miss Information"
            ], "In Season 4, Dee attempts to become famous by creating different internet personalities", 0, imagePath + "crazy-paddy.gif");

            var question6 = new Question('"May I offer you a ________ during this trying time?"',
            [
                "Beer",
                "French Fry",
                "Soda",
                "Egg",
            ], "Frank Reynolds, more than once, offers people under bad circumstances an egg with using that phrase.", 3, imagePath + "egg-offering.gif");
///// END QUESTION SETUP /////////////////////////////////////////////////////////////////////////////////

// Build an array of questions
var questionList = [
    question1,        
    question2,
    question3,
    question4,
    question5,
    question6,
];


// Utility function to return the opening HTML of a question.  Must pass the array index of the question.
// Must pair with the const questionClose.
// USAGE: questionOpen(i) + answer[i] + questionClose;
function questionOpen(idx) {
    // idx will always begin at Zero (0), so we bump it up once.
    return '<p><a href="#" class="answer-choice" data-val="' + idx + '">' + (idx + 1) + ". ";
}

// This function advances our timer by 1.
function runTimer() {
    progressBarRef.advanceProgressBar();            // Update the progress bar
    // Subtract one from the timer and see if we've hit zero.
    if(--gameObj.timer <= 0) {
        // Add one to missed questions
        gameObj.questionsMissed++;
        // Stop the timer
        clearInterval(timerInterval);
        // Check the answer, passing our missed flag
        gameObj.checkAnswer(missed);
    }
    // Update the timer display.
    $(gameObj.timerSelector).text(gameObj.timer);
}

var  gameObj = {
    timer: maxTime,             // Timer placeholder
    questionsCorrect: 0,        // Counter for questions correct
    questionsIncorrect: 0,      // Counter for questions incorrect
    questionsMissed: 0,         // Counter for questions missed
    questions: questionList,    // Our list of questions
    currentQuestionIdx: 0,      // The index of the current question
    
    /* UI ELEMENTS */
    screenSelector: ".game-screen",
    questionSelector: "#question-display",  
    timerSelector: "#timer-display",
    answersSelector: "#answers-display",
    resultsSelector: "#results-display",
    guessedCorrectSelector: "#guessed-correct",
    guessedIncorrectSelector: "#guessed-incorrect",
    guessedMissedSelector: "#guessed-missed",
    
    // Function to display the results of the game
    showResults: function() {
        $(this.resultsSelector).css({"display": "block", "z-index": "9999" });
        $(this.guessedCorrectSelector).html("<h2>Correct: " + this.questionsCorrect + "</h2>");
        $(this.guessedIncorrectSelector).html("<h2 class='text-red'>Incorrect: " + this.questionsIncorrect + "</h2>");
        $(this.guessedMissedSelector).html("<h2>Missed: " + this.questionsMissed + "</h2>");
        blinkPressStartInterval = setInterval(function() { blinkText('.pressStart')}, 1000);
        gameStarted = false;
    },

    // Function to show the current question
    nextQuestion: function() {
        // Check if there are no more questions.  If not, showResults.
        if(this.currentQuestionIdx >= this.questions.length) {
            this.showResults();
            return;
        }        
        // Reset the timer
        this.timer = maxTime;
        // Clear out the answers Display
        $(this.answersSelector).empty();
        
        // Initialize our progressBar
        progressBarRef = new CenterProgressBar("#progress-bar-wrapper", "green", 100 / maxTime);  

        // Display the timer immediately
        $(this.timerSelector).text(maxTime)

        // Set the timer-interval to run every second
        timerInterval = setInterval(runTimer, 1000);

        // Display the current question
        $(this.questionSelector).text(this.questions[this.currentQuestionIdx].question);
        
        // Set an index to display the answers
        var idx=0;
        // Loop through the answerss
        this.questions[this.currentQuestionIdx].answers.forEach(function(currentValue) {
            // Add the answer to the screen
            $(gameObj.answersSelector).append(questionOpen(idx) + currentValue + questionClose);
            // Advance our index
            idx++;

        });        

    },

    // Checks to see if the answer is correct or incorrect
    checkAnswer: function(answerIdx) {
        // Stops our timer
        clearInterval(timerInterval);
        // Clears our answer display area in our UI
        $(this.answersSelector).empty();    
        // Make sure this wasn't a missed question
        if(answerIdx != missed) {
            // If the answer is correct
            if(answerIdx === this.questions[this.currentQuestionIdx].correctIndex) {
                console.log(answerIdx + " = " + this.questions[this.currentQuestionIdx].answerIdx);
                this.questionsCorrect++;
                $(this.answersSelector).append("<h1>Correct!</h1>")
            // Otherwise
            } else {
                this.questionsIncorrect++;
                $(this.answersSelector).append("<h1 class='text-red'>Incorrect</h1>")
            }
        }
        // Display a blurb about the answer
        $(this.answersSelector).append("<p>" + this.questions[this.currentQuestionIdx].aboutAnswer + "</p>");
        // Displays the image associated with the answer
        $(this.answersSelector).append('<img src="' + this.questions[this.currentQuestionIdx].imagePath + '" class="winning-image" />' );
        // Moves the question up one
        this.currentQuestionIdx++;
        // Times out for 5 seconds, and calls the next question
        window.setTimeout(function() { 
            gameObj.nextQuestion(); 
        }, 6000);
    },

    // Resets the game
    reset: function() {
        // Makes sure the results window is hidden
        $(this.resultsSelector).css("display", "none");
        // Reset all game variables
        this.questionsCorrect = 0;
        this.questionsIncorrect = 0;
        this.questionsMissed = 0;
        this.currentQuestionIdx = 0;
        this.timer = maxTime;
        $(this.timerSelector).text(0);
        this.nextQuestion();
    },
}



function initializeGame() {

    if(gameStarted === false) {
        gameStarted = true;
        clearInterval(blinkPressStartInterval);
        $('#start-to-play').animate({opacity: 0}, 300, function() {
            $(this).css("display", "none");
            $(this).css("z-index", "-9999");
        });        
        gameObj.reset();        
    }
}

var backgroundInterval;         // Hold a reference to the interval of rotating background-images
var blinkPressStartInterval;    // Hold a reference to the interval of the blinking start message
var imageIdx = 0;               // Start from background image one.

//  Moves to the next background image
function backgroundImageRotate() {
    if(++imageIdx >= backgroundImages.length) {
        imageIdx = 0;
    }
    $(".background").animate({ opacity: 0 }, 1000, function() {
        $('.background').css('background-image', "url(" + backgroundImages[imageIdx] + ")").animate({ opacity: 1 }, 1000);
    })
}

// Fades the opacity of text to 0 and then back to create a "blink" effect
function blinkText(selector) {
    $(selector).animate({ opacity: 0}, 300, function() {
        $(selector).animate({ opacity: 1}, 300);
    })
}

$(document).ready(function () {

    // Initiate the interval for the background images    
    backgroundInterval = setInterval(backgroundImageRotate, 10000);

    // Initiate the interval for blinking the press enter textg
    blinkPressStartInterval = setInterval(function() { blinkText('.pressStart')}, 1000);
    
    // If we clicked the start-to-play div run the initializeGame function
    $("#start-to-play").on("click", function() {
        initializeGame();
    });  
    // OR, if we press enter on the screen try the initializeGame function.
    $(document).keypress(function (event) {
        
        if (event.keyCode === 13) {
            initializeGame();
        }
    });
    // When the user clicks on an answer, we grab the data-val attribute and turn it into an integer, and pass it to the
    // checkAnswer function
    $("#answers-display").on("click", ".answer-choice", function() {
        gameObj.checkAnswer(parseInt($(this).data('val')));
    });
    // If they click on the Results Display div, try and initialize the game. 
    $("#results-display").on("click", function() {
        initializeGame();
    })

});