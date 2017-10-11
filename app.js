(function() {
    var sequence = [];
    var count = 0;
    var order = 0;
    var currentlyPlaying;
    var currentlyLit;
    var allowClick = false;
    var currentlyPlayingPromise;

    function playSequence() {
        for (var i = 0; i < sequence.length; i++) {
            playStep(sequence[i]);
            setTimeout(function() { cleanStep() }, 2000);
        }
        allowClick = true;
    }

    function addStep() {
        sequence.push(randomIntFromInterval(1, 4));
    }


    function playStep(step) {
        playSound(step);
        litBlock(step);
    }

    function okStep(id) {
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
            if (!okStep(stepId)) {
                allowClick = false;
                order = 0;
                playSequence();
            } else {
                order++;
                if (order === count) {
                    count++;
                    allowClick = false;
                    order = 0;
                    continueGame();
                }
            }
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
    }

    function litBlock(id) {
        if (currentlyLit) {
            currentlyLit.css("filter", "brightness(100%)");
        }
        var block = $("#b" + id);
        currentlyLit = block;
        block.css("filter", "brightness(150%)");
    }

    function cleanStep() {
        if (currentlyPlayingPromise !== undefined) {
            currentlyPlayingPromise.then(function() {
                    currentlyPlaying.pause();
                    currentlyPlaying.currentTime = 0;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
        if (currentlyLit) {
            currentlyLit.css("filter", "brightness(100%)");
        }
    }
    //helper functions
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
})();