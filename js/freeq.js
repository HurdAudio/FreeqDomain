'use strict';
// Initialize Audio Context

$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    }
  );

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Create oscillator and gain node for the purpose of testing master volume
var masterOscillator = audioCtx.createOscillator();
var masterGainNode = audioCtx.createGain();
var masterVolume = 0.5;
var muteState = false;
var pitchSpace = {};
var numberOfDimensions = 1;
var dimensionKey = [];
var primeFactors = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
var oneOverOne = {};




masterOscillator.connect(masterGainNode);
masterGainNode.connect(audioCtx.destination);

masterOscillator.type = 'sine';
masterOscillator.frequency.value = 311.126983722080911;
masterOscillator.start();
masterGainNode.gain.value = masterVolume;


//Initialize Master Volume fader
var masterVolumeSlider = $('#masterVolumeSlider').append('<input type="range" min="1" max="100" value="1" id="thisIsMasterVolumeSlider" display="none" >');
masterVolumeSlider.attr("overflow", "hidden");
masterVolumeSlider.val('-99');
masterGainNode.gain.value = 0.01;

//Initialize Node Volume fader
var nodeVolumeSlider = $('#nodeVolume').append('<input type="range" min="1" max ="100" value="1" id="thisIsNodeVolumeSlider" display="none" >');

function convertToDisplayString (obj) {
  var returnString = '';

  if (obj.numerator === 0) {
    alert ('0-space not permitted');
    return ('Invalid Space');
  }

  if (obj.denominator === 1) {
    returnString = obj.numerator.toString();
  } else if (obj.denominator === 0) {
    alert ('Divide by Zero Bug');
    return ('Invalid Value');
  } else {
    returnString = obj.numerator.toString() + '/' + obj.denominator;
  }

  if (obj.exponentDenominator === 0) {
    alert('Divide by Zero Bug');
    return ('Invalid Value');
  }

  if ((obj.exponentNumerator / obj.exponentDenominator) === 1) {
    return returnString;
  } else if (obj.exponentDenominator === 1) {
    returnString = returnString + '^' + obj.exponentNumerator;
  } else {
    returnString = returnString + '^(' + obj.exponentNumerator + '/' + obj.exponentDenominator + ')';
  }
  return returnString;
}

function getDimensionalString (num) {
  var returnString = '';

  if (num === 0) {
    alert('Zero Dimensional Harmonic Space Acieved. Destroying universe now...');
    return('Error Dimensional State');
  }
  if (num === 1) {
    returnString = '1-Dimensional';
  } else {
    returnString = num + '-Dimensions';
  }
  return returnString;
}

function getKeyString (arrOfObj) {
  var returnString = 'Key = [ ';

  for (let i = 0; i < arrOfObj.length; i++) {
    returnString = returnString + convertToDisplayString(arrOfObj[i]);
    if ((i + 1) < arrOfObj.length) {
      returnString = returnString + ', ';
    }
  }
  returnString = returnString + ' ]';
  return returnString;
}

function displayGlobals (nSpace, origin, nDimension, key) {
  var pitchSpaceDisplayString = convertToDisplayString(nSpace) + '-Space';
  var oneOverOneDisplayString = '1/1 = ' + origin.pitchClass + ' at ' + origin.hertz.toFixed(2) + ' Hertz';
  var numberDimensionsString = getDimensionalString(nDimension);
  var keyString = getKeyString(key);

  console.log('This is where we display values in the view bar.');
  $('#pitchSpaceDisplay').text(pitchSpaceDisplayString);
  console.log(nSpace);
  $('#oneOverOneDisplay').text(oneOverOneDisplayString);
  console.log(origin);
  $('#numberDimensionsDisplayedHere').text(numberDimensionsString);
  console.log(nDimension);
  $('#keyDisplayCell').text(keyString);
  console.log(key);
}

function getHertz (pitchClass, octave) {
  var hertzReturn;

  switch (pitchClass) {
    case ('E-flat' || 'D-sharp'):
      hertzReturn = 311.126983722080911;
      break;
    case ('E'):
      hertzReturn = 329.62755691286993;
      break;
    case ('F'):
      hertzReturn = 349.228231433003884;
      break;
    case ('F-sharp' || 'G-flat'):
      hertzReturn = 369.994422711634399;
      break;
    case ('G'):
      hertzReturn = 391.995435981749294;
      break;
    case ('A-flat' || 'G-sharp'):
      hertzReturn = 415.304697579945139;
      break;
    case ('A'):
      hertzReturn = 440;
      break;
    case ('B-flat' || 'A-sharp'):
      hertzReturn = 466.163761518089916;
      break;
    case ('B'):
      hertzReturn = 493.883301256124112;
      break;
    case ('C'):
      hertzReturn = 261.625565300598635;
      break;
    case ('D-flat' || 'C-sharp'):
      hertzReturn = 277.182630976872096;
      break;
    case ('D'):
      hertzReturn = 293.66476791740756;
      break;
    default:
      hertzReturn = 0;
      break;
  }

  if (hertzReturn === 0) {
    alert('INVALID PITCH CLASS');
    return hertzReturn;
  }

  switch (octave) {
    case (-5):
      return (hertzReturn/512);
    case (-4):
      return (hertzReturn/256);
    case (-3):
      return (hertzReturn/128);
    case (-2):
      return (hertzReturn/64);
    case (-1):
      return (hertzReturn/32);
    case (0):
      return (hertzReturn/16);
    case (1):
      return (hertzReturn/8);
    case (2):
      return (hertzReturn/4);
    case (3):
      return (hertzReturn/2);
    case (4):
      return hertzReturn;
    case (5):
      return (hertzReturn * 2);
    case (6):
      return (hertzReturn * 4);
    case (7):
      return (hertzReturn * 8);
    case (8):
      return (hertzReturn * 16);
    case (9):
      return (hertzReturn * 32);
    case (10):
      return (hertzReturn * 64);
    case (11):
      return (hertzReturn * 128);
    case (12):
      return (hertzReturn * 256);
    case (13):
      return (hertzReturn * 512);
    default:
      alert('INVALID OCTAVE SETTING');
      return hertzReturn;
  }
}

function setOneOverOne (obj, pitchClassName, octaveValue) {

  obj.pitchClass = pitchClassName;
  obj.hertz = getHertz(pitchClassName, octaveValue);

  return (obj);
}

function setVal (obj, numeratorVal, denominatorVal = 1, exponentNumeratorVal = 1, exponentDenominatorVal = 1) {

  obj.numerator = numeratorVal;
  obj.denominator = denominatorVal;
  obj.exponentNumerator = exponentNumeratorVal;
  obj.exponentDenominator = exponentDenominatorVal;

  return (obj);
}

function initializeGlobals () {

  // Globals consist of Pitch-Space (the interval of pitch-class equivalence), the 1/1, the number of dimensions within that space, and the numerical identity of each dimension. This is the key against which all other data gets decoded into sound.

  // Pitch space defaults to the octave (2-space)
  pitchSpace = setVal(pitchSpace, 2);

  // 1/1 defaults to E-flat at 311.126983722080911 Hertz;
  oneOverOne = setOneOverOne(oneOverOne, 'E-flat', 4);

  // Number of dimensions will eventually default to 2 - once support is added for 2-dimensional consturcts
  numberOfDimensions = 1;

  // Initialize dimensionKey
  for (let i = 0; i < numberOfDimensions; i++) {
    dimensionKey[i] = {};
    dimensionKey[i] = setVal(dimensionKey[i], primeFactors[i+1]);
  }
  displayGlobals(pitchSpace, oneOverOne, numberOfDimensions, dimensionKey);
  return (true);
}

initializeGlobals();


$(document).ready(function(){
     $('.parallax').parallax();



    console.log( "ready!" );

    $(".dropdown-button").dropdown();
    $(".parallax" ).fadeTo( "slow" , 0.3);
    $("#volumeDisplay").text('-99dB');

    $('#thisIsMasterVolumeSlider').on('input', function () {
        // $('#thisIsMasterVolumeSlider').hide();
        var newVolume = $('#thisIsMasterVolumeSlider').val();
        masterVolume = newVolume;
        masterGainNode.gain.value = Math.abs((masterVolume - 1)/100);
        $('#volumeDisplay').text((newVolume - 100) +'dB');
        muteState = false;


    });



    $('#muteButton').on('click', function () {

      if (muteState) {
        muteState = false;
        masterGainNode.gain.value = Math.abs((masterVolume - 1)/100);
        $('#volumeDisplay').text((masterVolume - 100) + 'dB');


      } else {
        masterGainNode.gain.value = 0.0;
        $('#volumeDisplay').text('MUTED');
        muteState = true;
      }

    });

});
