(function() {
    var sequence = [];
    var count = 0;
    var order = 0;
    var allowClick = false;
    var index = 0;
    var play = 0;
    var interval = 0;
    var restartGame = false;
    var WIN_CONDITION = 20;
    var wasClicked = false;
    var checkMove = 0;

    function playSequence() {
        index = 0;
        interval = setInterval(function() {
            cleanStep();
            play = setTimeout(function(id) {
                playStep(id);
                index++;
            }.bind(null, sequence[index]), 300);
            if (index >= sequence.length) {
                activateBoard();
                clearInterval(interval);
                clearTimeout(play);
            }
        }, 800);
    }

    function addStep() {
        sequence.push(randomIntFromInterval(1, 4));
    }

    function playStep(step) {
        playSound(step);
        litBlock(step);
    }

    function isStepOk(id) {
        if (id == sequence[order]) {
            return true;
        }
        return false;
    }

    //Event and DOM handlers 
    $(".block").on("click", function(e) {
        if (allowClick) {
            var stepId = $(this)[0].attributes.id.value.charAt(1);
            //play the step and deactivate board while wwaiting for evaluatin
            playStep(stepId);
            deactivateBoard();

            setTimeout(function(stepId) {
                cleanStep(stepId);
                //check if the clicked button matches the right position in the sequence
                if (!isStepOk(stepId)) {
                    handleStepWrong();
                } else {
                    handleStepOk();
                }
            }.bind(null, stepId), 600);

        }
    });



    $('#strict').change(function() {
        if ($(this).is(":checked")) {
            restartGame = true;
        } else {
            restartGame = false;
        }
    });
    $("#start").on("click", function(e) {
        if (sequence.length === 0) {
            count = 1;
            continueGame();
        } else {
            restart();
        }
    });

    function continueGame() {
        displayCount();
        addStep();
        playSequence();
    }

    function displayCount() {
        $("#count").text(count);
    }

    function playSound(id) {
        try {
            var sound = $("#a" + id)[0];
            sound.play();
        } catch (ex) {
            // console.log(ex);
        }

    }

    function litBlock(id) {
        var block = $("#b" + id);
        block.css("filter", "brightness(170%)");
    }

    function activateBoard() {
        $(".block").css("cursor", "pointer");
        allowClick = true;
        //wait 5 seconds for a click 
        wasClicked = false;
        checkMove = setTimeout(function() {
            if (!wasClicked) {
                handleStepWrong();
            }
        }, 5000);
    }

    function deactivateBoard() {
        $(".block").css("cursor", "default");
        allowClick = false;
        wasClicked = true;
        clearTimeout(checkMove);
    }

    function cleanStep() {
        for (var i = 1; i <= 4; i++) {
            var sound = $("#a" + i)[0];
            sound.pause();
            sound.currentTime = 0;
        }
        for (var i = 1; i <= 4; i++) {
            var block = $("#b" + i);
            block.css("filter", "brightness(100%)");
        }

    }

    function playFail() {
        try {
            var sound = $("#fail")[0];
            sound.play();
            $("#message").css("color", "red");
            $("#message").text("Try again!");
        } catch (ex) {
            // console.log(ex);
        }
    }
    //helper functions
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function handleStepOk() {
        //take into account the starting at zero counting 
        if ((order + 1) === WIN_CONDITION) {
            win();
        } else {
            $("#message").text("");
            //if it does, increase position in sequence and continue as before
            order++;
            activateBoard();
            //if the sequence is over, increase positions number and continue game
            if (order === count) {
                count++;
                deactivateBoard();
                order = 0;
                continueGame();
            }
        }
    }

    function handleStepWrong() {
        //if it doesn't, replay sequence
        playFail();
        if (restartGame) {
            restart();
        } else {
            deactivateBoard();
            order = 0;
            playSequence();
        }
    }

    function restart() {
        count = 1;
        order = 0;
        sequence = [];
        clearInterval(interval);
        clearTimeout(play);
        index = 0;
        cleanStep();
        continueGame();

    }

    function win() {
        restart();
        $("#message").css("color", "green");
        $("#message").text("You Won !");
    }
})();