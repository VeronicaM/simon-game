(function() {
    var sequence = [];
    var count = 0;
    var order = 0;
    var currentlyPlaying;
    var currentlyLit;
    var allowClick = false;
    var currentlyPlayingPromise;
    var index = 0;

    function playSequence() {
        index = 0;
        interval = setInterval(function() {
            cleanStep(sequence[index]);
            //clean previous step to take into consideration last interval run  
            cleanStep(sequence[index - 1]);
            var play = setTimeout(function(id) {
                playStep(id);
                index++;
            }.bind(null, sequence[index]), 300);
            if (index >= sequence.length) {
                activateBoard();
                clearInterval(interval);
            }
        }, 800);
    }

    function addStep() {
        sequence.push(randomIntFromInterval(1, 4));
    }


    function playStep(step) {
        // playSound(step); 
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
            playStep(stepId);
            allowClick = false;
            setTimeout(function(stepId) {
                cleanStep(stepId);
                //check if the clicked button matches the right position in the sequence
                if (!isStepOk(stepId)) {
                    //if it doesn't, replay sequence
                    deactivateBoard();
                    order = 0;
                    playSequence();
                } else {
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
            }.bind(null, stepId), 600);

        }
    });
    $("#start").on("click", function(e) {
        count = 1;
        continueGame();
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
        if (currentlyPlayingPromise !== undefined) {
            currentlyPlayingPromise.then(function() {
                    currentlyPlaying.pause();
                    currentlyPlaying.currentTime = 0;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
        var sound = $("#a" + id)[0];
        currentlyPlaying = sound;
        currentlyPlayingPromise = sound.play();
        //  sound.play();
    }

    function litBlock(id) {
        var block = $("#b" + id);
        block.css("filter", "brightness(170%)");
    }

    function activateBoard() {
        $(".block").css("cursor", "pointer");
        allowClick = true;
    }

    function deactivateBoard() {
        $(".block").css("cursor", "default");
        allowClick = false;
    }

    function cleanStep(id) {
        if (currentlyPlayingPromise !== undefined) {
            currentlyPlayingPromise.then(function() {
                    currentlyPlaying.pause();
                    currentlyPlaying.currentTime = 0;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
        var block = $("#b" + id);
        block.css("filter", "brightness(100%)");
    }
    //helper functions
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
})();