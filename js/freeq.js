'use strict';
// Initialize Audio Context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Create oscillator and gain node for the purpose of testing master volume
var masterOscillator = audioCtx.createOscillator();
var masterGainNode = audioCtx.createGain();
var initialVolume = 0.0;
var masterVolume = 0.5;
var muteState = false;

masterOscillator.connect(masterGainNode);
masterGainNode.connect(audioCtx.destination);

masterOscillator.type = 'sine';
masterOscillator.frequency.value = 311.126983722080911;
masterOscillator.start();
masterGainNode.gain.value = masterVolume;


//Initialize Master Volume fader
var masterVolumeSlider = $('#masterVolumeSlider').append('<input type="range" min="1" max="100" value="0" id="thisIsMasterVolumeSlider" display="none" >');
masterVolumeSlider.attr("overflow", "hidden");
masterVolumeSlider.val('-99');
masterGainNode.gain.value = 0.01;


// $masterVolumeSlider.attr(type,'range');
// masterVolumeSlider.min = 0;
// masterVolumeSlider.max = 1;


$(document).ready(function(){
     $('.parallax').parallax();



    console.log( "ready!" );

    $(".dropdown-button").dropdown();
    $(".parallax" ).fadeTo( "slow" , 0.1);
    $("#volumeDisplay").text('-99dB');

    $('#thisIsMasterVolumeSlider').on('input', function () {
        // $('#thisIsMasterVolumeSlider').hide();
        var newVolume = $('#thisIsMasterVolumeSlider').val();
        masterVolume = newVolume;
        masterGainNode.gain.value = Math.abs((masterVolume - 1));
        $('#volumeDisplay').text((newVolume - 100) +'dB');
        muteState = false;


    });

    $('#muteButton').on('click', function () {

      if (muteState) {
        muteState = false;
        masterGainNode.gain.value = Math.abs((masterVolume - 1));
        $('#volumeDisplay').text((masterVolume - 100) + 'dB');


      } else {
        masterGainNode.gain.value = 0.0;
        $('#volumeDisplay').text('MUTED');
        muteState = true;
      }

    });

});
