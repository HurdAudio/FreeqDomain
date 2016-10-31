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
// var masterOscillator = audioCtx.createOscillator();

// Audio mixing path being set up
//
// Create Master Gain. Connect it to desination (speakers)

var masterGainNode = audioCtx.createGain();
// alert(masterGainNode);
var masterVolume = 0.01;
masterGainNode.gain.value = masterVolume;
masterGainNode.connect(audioCtx.destination);
// alert('Master Gain connected to Audio Context Destination');

// Now create Dynamics Compressor - connect this to the Master Gain Node
var masterCompressorNode = audioCtx.createDynamicsCompressor();
// alert(masterCompressorNode);
masterCompressorNode.connect(masterGainNode);
// alert('Compressor now connected to Master Gain');

// Now create lowpass filter and connect this to the compressor
var masterFilterNode = audioCtx.createBiquadFilter();
// alert(masterFilterNode);
masterFilterNode.type = "lowpass";
masterFilterNode.frequency.value = 2000;
masterFilterNode.connect(masterCompressorNode);
// alert('Lowpass filter now plugged into compressor');

// Now create master merger node and connect this to the lowpass filter
var masterMergerNode = audioCtx.createChannelMerger(8);
// alert(masterMergerNode);
masterMergerNode.connect(masterFilterNode);
// alert('Master Merger Node connected to filter');

// New create 8! sub-merger Nodes and hook them to the 8 inputs on the master merger node
var subMergerNode1 = audioCtx.createChannelMerger(8);
// alert(subMergerNode1);
subMergerNode1.connect(masterMergerNode, 0, 0);
// alert('sub1 connected to master');
var subMergerNode2 = audioCtx.createChannelMerger(8);
// alert(subMergerNode2);
subMergerNode2.connect(masterMergerNode, 0, 1);
// alert('sub2 connected to master');
var subMergerNode3 = audioCtx.createChannelMerger(8);
// alert(subMergerNode3);
subMergerNode3.connect(masterMergerNode, 0, 2);
// alert('sub3 connected to master');
var subMergerNode4 = audioCtx.createChannelMerger(8);
// alert(subMergerNode4);
subMergerNode4.connect(masterMergerNode, 0, 3);
// alert('sub4 connected to master');
var subMergerNode5 = audioCtx.createChannelMerger(8);
// alert(subMergerNode5);
subMergerNode5.connect(masterMergerNode, 0, 4);
// alert('sub5 connected to master');
var subMergerNode6 = audioCtx.createChannelMerger(8);
// alert(subMergerNode6);
subMergerNode6.connect(masterMergerNode, 0, 5);
// alert('sub6 connected to master');
var subMergerNode7 = audioCtx.createChannelMerger(8);
// alert(subMergerNode7);
subMergerNode7.connect(masterMergerNode, 0, 6);
// alert('sub7 connected to master');
var subMergerNode8 = audioCtx.createChannelMerger(8);
// alert(subMergerNode8);
subMergerNode8.connect(masterMergerNode, 0, 7);
// alert('sub8 connected to master');





var inputManager = [];
var inputIndex = -1;



var muteState = false;
var pitchSpace = {};
var numberOfDimensions = 1;
var dimensionKey = [];
var primeFactors = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
var oneOverOne = {};
var activeNode = null;
var droneContent = [];
var currentNodeObject = {};






// masterOscillator.type = 'sine';
// masterOscillator.frequency.value = 311.126983722080911;
// masterOscillator.start();
masterGainNode.gain.value = masterVolume;


//Initialize Master Volume fader
var masterVolumeSlider = $('#masterVolumeSlider').append('<input type="range" min="1" max="100" value="1" id="thisIsMasterVolumeSlider" display="none" >');
masterVolumeSlider.attr("overflow", "hidden");
masterVolumeSlider.val('-99');
masterGainNode.gain.value = 0.01;

//Initialize Node Volume fader
var nodeVolumeSlider = $('#nodeVolume').append('<input type="range" min="1" max ="100" value="1" id="thisIsNodeVolumeSlider" display="none" >');

//Initialize Node Pan Slider
var nodePanSlider = $('#panSlider').append('<input type="range" min="1" max="100" value="50" id="thisIsNodePanSlider">');

function getNextInput () {
  ++inputIndex;
  if (inputIndex === 64) {
    inputIndex = 0;
  }
  return inputIndex;
}

function hookUpMergerNodes () {


  for (let i = 0; i < 8; i++) {

    inputManager[i] = [];
    inputManager[i][0] = subMergerNode1;
    inputManager[i][1] = i;

    inputManager[i + 8] = [];
    inputManager[i + 8][0] = subMergerNode2;
    inputManager[i + 8][1] = i;

    inputManager[i + 16] = [];
    inputManager[i + 16][0] = subMergerNode3;
    inputManager[i + 16][1] = i;

    inputManager[i + 24] = [];
    inputManager[i + 24][0] = subMergerNode4;
    inputManager[i + 24][1] = i;

    inputManager[i + 32] = [];
    inputManager[i + 32][0] = subMergerNode5;
    inputManager[i + 32][1] = i;

    inputManager[i + 40] = [];
    inputManager[i + 40][0] = subMergerNode6;
    inputManager[i + 40][1] = i;

    inputManager[i + 48] = [];
    inputManager[i + 48][0] = subMergerNode7;
    inputManager[i + 48][1] = i;

    inputManager[i + 56] = [];
    inputManager[i + 56][0] = subMergerNode8;
    inputManager[i + 56][1] = i;
  }

}

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

function allocateOscillator () {
  var newOscillator = audioCtx.createOscillator();

  return (newOscillator);

}

function allocatePanNode () {
  var panNode = audioCtx.createStereoPanner();

  return (panNode);
}

function allocateGainNode () {
  var newGainNode = audioCtx.createGain();

  return (newGainNode);
}

function convertLocationStringToArray (convertString) {
  var returnArray = [];
  var subString = '';
  var index = 0;

  for (let i=0; i < convertString.length; i++) {
    if ((convertString[i] !== '[') && (convertString[i] !== ']')) {
      if (convertString[i] !== ' ') {
        do {
          subString += convertString[i];
          ++i;
        } while ((convertString[i] !== '[') && (convertString[i] !== ']') && (convertString[i] !== ' '));
      }
    }
    if (subString !== '') {
      returnArray[index] = parseInt(subString);
      ++index;
      subString = '';
    }


  }
  // alert(returnArray);
  return (returnArray);

}

function getKeyValue (obj) {
  var returnNumber = 0;

  if (obj.denominator !== 0) {
    returnNumber = (obj.numerator / obj.denominator);
  }  else {
    alert ('Divide by Zero Error');
    return (1);
  }
  if (obj.exponentNumerator === 0) {
    return (1);
  }
  if (obj.exponentDenominator === 0) {
    alert ('Divide by Zero Error');
    return (1);
  }
  if ((obj.exponentNumerator/obj.exponentDenominator) === 1) {
    return returnNumber;
  } else {
    returnNumber = Math.pow(returnNumber, (obj.exponentNumerator/obj.exponentDenominator));
  }
  return returnNumber;
}

function getFrequencyFromArray (coordArray) {
  var frequencyRatio = 1;
  var obj = {};
  obj.numerator = 1;
  obj.denominator = 1;
  var returnFrequency = oneOverOne.hertz;

  for (let i=0; i < dimensionKey.length; i++) {
    if (coordArray[i] === '0') {
      obj.numerator = obj.numerator * 1;
      obj.denominator = obj.denominator * 1;
    } else if (coordArray[i] > 0) {
      obj.numerator = obj.numerator * (Math.pow(getKeyValue(dimensionKey[i]), coordArray[i]));
    } else {
      obj.denominator = obj.denominator * (Math.pow(getKeyValue(dimensionKey[i]), Math.abs(coordArray[i])));

    }
  }
  frequencyRatio = obj.numerator/obj.denominator;
  if (frequencyRatio > getKeyValue(pitchSpace)) {
    do {
      frequencyRatio = frequencyRatio/getKeyValue(pitchSpace);
    } while (frequencyRatio > getKeyValue(pitchSpace));

  }
  if (frequencyRatio < 1) {
    do {
      frequencyRatio = frequencyRatio * getKeyValue(pitchSpace);
    } while (frequencyRatio < 1);
  }
  returnFrequency = returnFrequency * frequencyRatio;

  return returnFrequency;

}


function initNewOscillator (locationString) {
  var osc = allocateOscillator();
  var arr = [];
  arr = convertLocationStringToArray(locationString);
  var freeq = getFrequencyFromArray(arr);
  osc.type = 'sine';
  osc.frequency.value = freeq;

  return osc;
}

function initNewPan () {
  var newPan = allocatePanNode();
  newPan.pan.value = 0;
  return (newPan);
}

function initNewGain () {
  var newGain = allocateGainNode();
  newGain.gain.value = 1.0;
  return (newGain);
}

function initDroneObject (oscNode, panNode, gainNode, coordString) {
  var returnObject = {};

  returnObject.hertz = oscNode.frequency.value;
  returnObject.osc = oscNode;
  returnObject.pan = panNode;
  returnObject.gain = gainNode;
  returnObject.coordinates = convertLocationStringToArray(coordString);
  returnObject.active = true;
  returnObject.gainvalue = gainNode.gain.value;
  returnObject.panvalue = panNode.pan.value;
  returnObject.waveform = oscNode.type.value;
  returnObject.lfoStates = [ false, false, false, false, false, false ];
  returnObject.intervallicEquivalenceDisplacement = 0;

  return returnObject;

}

function getFrequencyRatioStringFromArray (locationArray) {
  var returnString = '';
  var newObj = {};
  newObj.numerator = 1;
  newObj.denominator = 1;
  newObj.exponentNumerator = 1;
  newObj.exponentDenominator = 1;

  for (let i = 0; i < locationArray.length; i++){
    if (locationArray[i] !== 0) {
      if (locationArray[i] > 0) {
        newObj.numerator = newObj.numerator * (Math.pow(getKeyValue(dimensionKey[i]), locationArray[i]));
      } else {
        newObj.denominator = newObj.denominator * (Math.pow(getKeyValue(dimensionKey[i]), (Math.abs(locationArray[i]))));
      }
    }
  }
  if ((newObj.numerator / newObj.denominator) > getKeyValue(pitchSpace)) {
    do {
      newObj.denominator = newObj.denominator * getKeyValue(pitchSpace);
    } while ((newObj.numerator / newObj.denominator) > getKeyValue(pitchSpace));
  } else if ((newObj.numerator / newObj.denominator) < 1) {
    do {
      newObj.numerator = newObj.numerator * getKeyValue(pitchSpace);
    } while ((newObj.numerator / newObj.denominator) < 1);
  }

  for (let i = 0; i < primeFactors.length; i++) {
    if ((newObj.numerator % primeFactors[i] === 0) && (newObj.denominator % primeFactors[i] === 0)) {
      do {
        newObj.numerator = newObj.numerator / primeFactors[i];
        newObj.denominator = newObj.denominator / primeFactors[i];
      } while ((newObj.numerator % primeFactors[i] === 0) && (newObj.denominator % primeFactors[i] === 0));
    }
  }
  returnString = newObj.numerator + '/' + newObj.denominator;
  return (returnString);

}

function updateEditorPane (nodalObject) {
  var frequencyRatioString = getFrequencyRatioStringFromArray(nodalObject.coordinates);
  var currentNodeDisplayString = 'Current Node: ' + frequencyRatioString + ', ' + nodalObject.hertz.toFixed(2) + ' Hertz';
  $('#currentNodeDisplay').text(currentNodeDisplayString);

}

hookUpMergerNodes();
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

    $('#incrementInterval').on('click', function() {
      currentNodeObject.intervallicEquivalenceDisplacement += 1;
      currentNodeObject.hertz = currentNodeObject.hertz * getKeyValue(pitchSpace);
      currentNodeObject.osc.frequency.value = currentNodeObject.hertz;
      updateEditorPane(currentNodeObject);

    });

    $('#decrimentInterval').on('click', function() {
      currentNodeObject.intervallicEquivalenceDisplacement -= 1;
      currentNodeObject.hertz = currentNodeObject.hertz / getKeyValue(pitchSpace);
      currentNodeObject.osc.frequency.value = currentNodeObject.hertz;
      updateEditorPane(currentNodeObject);

    });

    $('#nodeCanvas').on('click', function(event) {
      var clickedNode = $(event.target);
      var nodeOscillator;
      var nodePan;
      var nodeGain;
      var inputHandle;


      console.log(clickedNode);

      if ((clickedNode.attr("id") === 'origin') || (clickedNode.attr("alt") === 'node')) {
        console.log("We have our node!");
        if (activeNode === null) {

          // display our editor pane, set activeNode to current node, update node icon and color.

          $('#editPanel').show();
          activeNode = clickedNode;
          activeNode.text('volume_up');
          activeNode.parent().attr("class", "btn-floating btn-large waves-effect waves-light teal z-depth-4");



          if (activeNode.attr("parameters") === 'unedited') {
            // if node is "unedited", enable new oscillator and start it, set property to edited. Push new node into user drone. Set editor pane.

            activeNode.attr("parameters", "edited");
            nodeOscillator = initNewOscillator(activeNode.attr("coordinates"));
            nodePan = initNewPan();
            nodeGain = initNewGain();
            inputHandle = getNextInput();
            nodeGain.connect(inputManager[inputHandle][0], 0, inputManager[inputHandle][1]);
            nodePan.connect(nodeGain);
            nodeOscillator.connect(nodePan);

            nodeOscillator.start();
            currentNodeObject = initDroneObject(nodeOscillator, nodePan, nodeGain, activeNode.attr("coordinates"));
            droneContent.push(currentNodeObject);

            updateEditorPane(currentNodeObject);

            // updateCurrentNodeEditorDisplay(activeNode.attr("coordinates"));
            // initNewVolumeEditorPaneAndBorder(activeNode);
            // initLFOPane(activeNode);
            // initWaveFormPane(activeNode);
            // initHarmonicEquivalenceTransversalPane(activeNode);

          } else {
            // if node is "edited", unmute old oscillator. Update editor pane.


          }
        } else if (activeNode === clickedNode) {
          // user has selected active node. This turns node off and mutes its output. Editor pane is hidden. activeNode returns to null.
        } else {
          // user has moved to current node from another node. Update our editor pane accordingly
        }
      }

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
