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
var requests = [];
var requests2 = [];
var requests3 = [];
var randomActiveNodes = 0;
var randomDroneState = [];





var muteState = false;
var pitchSpace = {};
var numberOfDimensions = 1;
var dimensionKey = [];
var primeFactors = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];
var oneOverOne = {};
var activeNode = null;
var droneContent = [];
var currentNodeObject = {};
var parallaxContainerHeight = 1200;
var parallaxContainerWidth = 1900;






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
nodeVolumeSlider = 1;

//Initialize Node Pan Slider
var nodePanSlider = $('#panSlider').append('<input type="range" min="1" max="100" value="50" id="thisIsNodePanSlider">');
nodePanSlider = 50;

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
      if ((convertString[i] !== ' ') && (convertString[i] !== ',')) {
        do {
          subString += convertString[i];
          ++i;
        } while ((convertString[i] !== '[') && (convertString[i] !== ']') && (convertString[i] !== ' ') && (convertString[i] !== ','));
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
  // alert(returnFrequency);
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
  newGain.gain.value = 0.0;
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

function getTonality (coArray) {
  var isOrigin = true;
  var index = (coArray.length - 1);

  for (let i = 0; i < coArray.length; i++) {
    if (coArray[i] !== 0) {
      isOrigin = false;
    }
  }
  if (isOrigin === true) {
    return ('Origin');
  }
  if (coArray[index] === 0) {
    do {
      --index;
    } while (coArray[index] === 0);
  }
  if (coArray[index] > 0) {
    return ('Otonal');
  } else {
    return ('Utonal');
  }
}

function updateEditorPane (nodalObject) {
  var frequencyRatioString = getFrequencyRatioStringFromArray(nodalObject.coordinates);
  var currentNodeDisplayString = 'Current Node: ' + frequencyRatioString + ', ' + nodalObject.hertz.toFixed(2) + ' Hertz';
  $('#currentNodeDisplay').text(currentNodeDisplayString);
  var identifierString = activeNode.attr("coordinates") + ' ' + getTonality(nodalObject.coordinates);
  $('#otonalUtonalIdentifier').text(identifierString);

}

function updateNodeRadius (targetNode, gainValue) {
  var borderPix = Math.floor(gainValue / 3);
  var borderString = 'solid red ' + borderPix + 'px';

  targetNode.parent().css("border", borderString);
}

function getObjectByCoordinateMatch (arrayToMatch) {
  var match = true;

  for (let i = 0; i < droneContent.length; i++) {
    for (let j = 0; j < droneContent[i].coordinates.length; j++) {
      if (arrayToMatch[j] !== droneContent[i].coordinates[j]) {
        match = false;
      }
    }
    if (match === true) {
      return (droneContent[i]);
    } else {
      match = true;
    }
  }
  alert('ERROR - No match found in Drone Array');
}

function arrayToString (arr) {
  var returnString = '[';

  for (let i = 0; i < arr.length; i++) {
    returnString = returnString + arr[i];
    if (i < (arr.length - 1)) {
      returnString = returnString + ',';
    }
  }
  returnString = returnString + ']';

  return (returnString);
}



function addNewNode (siblingNode, pendStateString) {
  // function to dynamically add a new node with coordinate values calculated. alt is set to "node".

  var iString = '<div class="valign"><a class="btn-floating btn-large waves-effect waves-light grey z-depth-2"><i class="material-icons" coordinates="';
  var iStringMid = '';
  var iStringEnd = '" sonicstatus="off" parameters="unedited" alt="node">music_note</i></a></div>';
  var siblingCoordString = siblingNode.find('.material-icons').attr("coordinates");
  var positionArray = convertLocationStringToArray(siblingCoordString);
  // alert(siblingNode.parent().attr("id"));


  if (pendStateString === 'prepend') {
    positionArray[0] = positionArray[0] - 1;
    iStringMid = arrayToString(positionArray);
    siblingNode.parent().prepend(iString + iStringMid + iStringEnd);
    parallaxContainerWidth += 20;
    $('.parallax-container').css("width", (parallaxContainerWidth + 'px'));

  } else if (pendStateString === 'append') {
    positionArray[0] = positionArray[0] + 1;
    iStringMid = arrayToString(positionArray);
    siblingNode.parent().append(iString + iStringMid + iStringEnd);
    parallaxContainerWidth += 20;
    $('.parallax-container').css("width", (parallaxContainerWidth + 'px'));


  }




}

function setRandomGlobalsPart1 (getString) {

  var $xhr = $.ajax({ url: getString,
    success: function (data) {
      var randomPSpace = {};
      var pitchClassNumber = 0;
      var pitchClassString = '';
      var displacement = 0;
      console.log(data);






        if ((data.data[0] +1) > (data.data[1] + 1)) {
          randomPSpace.numerator = (data.data[0] + 1);
          randomPSpace.denominator = (data.data[1] + 1);
        } else {
          randomPSpace.numerator = (data.data[1] + 1);
          randomPSpace.denominator = (data.data[0] + 1);
        }
        randomPSpace.exponentNumerator = (data.data[2]);
        randomPSpace.exponentDenominator = (data.data[3] + 1);
        pitchSpace = randomPSpace;
        // One over One generation here


        pitchClassNumber = (data.data[4] % 12);
          switch (pitchClassNumber) {
            case (0):
              pitchClassString = 'C';
              break;
            case (1):
              pitchClassString = 'D-flat';
              break;
            case (2):
              pitchClassString = 'D';
              break;
            case (3):
              pitchClassString = 'E-flat';
              break;
            case (4):
              pitchClassString = 'E';
              break;
            case (5):
              pitchClassString = 'F';
              break;
            case (6):
              pitchClassString = 'F-sharp';
              break;
            case (7):
              pitchClassString = 'G';
              break;
            case (8):
              pitchClassString = 'A-flat';
              break;
            case (9):
              pitchClassString = 'A';
              break;
            case (10):
              pitchClassString = 'B-flat';
              break;
            case (11):
              pitchClassString = 'B';
              break;
            default:
              alert('this condition not possible');
              break;
          }

          oneOverOne.pitchClass = pitchClassString;

          displacement = (data.data[5] % 3);
          displacement -= 3;
          oneOverOne.hertz = getHertz(pitchClassString, 4 + displacement);
          console.log(oneOverOne);
          // alert(oneOverOne);

          numberOfDimensions = (data.data[6] % 8) + 1;

          randomActiveNodes = (data.data[7] % 64) + 1;

      },
      error: function(xhr,status, strErr) {
          var backupArray = [];
          var randomPSpace = {};
          var pitchClassNumber = 0;
          var pitchClassString = '';
          var displacement = 0;
          console.log('status: ', status);
          console.log('strErr: ', strErr);

          console.log('Query failed!');
          // alert('API FAILURE');
          backupArray[0] = Math.round((Math.random() * 256) + 1);
          backupArray[1] = Math.round((Math.random() * 256) + 1);
          backupArray[2] = Math.round((Math.random() * 256) + 1);
          backupArray[3] = Math.round((Math.random() * 256) + 1);
          backupArray[4] = Math.floor(Math.random() * 12);
          backupArray[5] = Math.round((Math.random() * 3) - 2);
          backupArray[6] = Math.round((Math.random() * 8) + 1);
          backupArray[7] = Math.round((Math.random() * 64) + 1);


          if (backupArray[0] > backupArray[1]) {
            randomPSpace.numerator = (backupArray[0]);
            randomPSpace.denominator = (backupArray[1]);
          } else {
            randomPSpace.numerator = (backupArray[1]);
            randomPSpace.denominator = (backupArray[0]);
          }
          randomPSpace.exponentNumerator = (backupArray[2]);
          randomPSpace.exponentDenominator = (backupArray[3]);

                // One over One generation here


          pitchClassNumber = (backupArray[4]);
            switch (pitchClassNumber) {
              case (0):
                pitchClassString = 'C';
                break;
              case (1):
                pitchClassString = 'D-flat';
                break;
              case (2):
                pitchClassString = 'D';
                break;
              case (3):
                pitchClassString = 'E-flat';
                break;
              case (4):
                pitchClassString = 'E';
                break;
              case (5):
                pitchClassString = 'F';
                break;
              case (6):
                pitchClassString = 'F-sharp';
                break;
              case (7):
                pitchClassString = 'G';
                break;
              case (8):
                pitchClassString = 'A-flat';
                break;
              case (9):
                pitchClassString = 'A';
                break;
              case (10):
                pitchClassString = 'B-flat';
                break;
              case (11):
                pitchClassString = 'B';
                break;
              default:
                alert('this condition not possible');
                break;
            }

            oneOverOne.pitchClass = pitchClassString;

            displacement = (backupArray[5]);
            oneOverOne.hertz = getHertz(pitchClassString, 4 + displacement);
            console.log(oneOverOne);

            numberOfDimensions = (backupArray[6]);

            randomActiveNodes = (backupArray[7]);

        },
        timeout: 2000 // sets timeout to 2 seconds
      });
      requests.push($xhr);

}

function setRandomGlobalsPart2 (getString, intonation) {
  var index = 0;
  var $xhr = $.ajax({ url: getString,
    success: function(data) {
      var randomKey = [];
      var index2 = 0;


        console.log(data);
        console.log(data.data);

        if (intonation === 'hybrid') {
          for (let i = 0; i < (numberOfDimensions * 4); i+4 ) {
            randomKey[index2] = {};
            if (((data.data[i] % 29) + 1) > ((data.data[i+1] % 5) + 1)) {
              randomKey[index2].numerator = ((data.data[i] % 5) + 1);
              randomKey[index2].denominator = ((data.data[i+1] % 5) + 1);
            } else {
              randomKey[index2].numerator = ((data.data[i+1] % 5) + 1);
              randomKey[index2].denominator = ((data.data[i] % 5) + 1);
            }
            randomKey[index2].exponentNumerator = ((data.data[i+2] % 3));
            randomKey[index2].exponentDenominator = ((data.data[i+3] % 2) +1);
            ++index2;
          }
          dimensionKey = randomKey;
          index = (numberOfDimensions * 4);
        }
        randomDroneState = [];

        for (let j = 0; j < randomActiveNodes; j++) {
          randomDroneState[j] = {};
          randomDroneState[j].coordinates = [];
          for (let k = 0; k < numberOfDimensions; k++) {
            randomDroneState[j].coordinates[k] = ((data.data[index] % 64) - 32);
            ++index;
          }
        }
      },
      error: function(xhr,status, strErr) {
        // alert('We <Are></Are>')
        var backupArray = [];
        var randomKey = [];
        var index2 = 0;
        console.log('Query failed!');
        console.log(strErr);
        if (intonation === 'hybrid') {
          for (let i = 0; i < (numberOfDimensions * 4); i++) {
            backupArray[i] = (Math.floor(Math.random() * 13) + 1);
          }
          for (let k = 0; k < (numberOfDimensions * 4); k+4) {
            if (backupArray[k] > backupArray[k+1]) {
              randomKey[index2].numerator = (backupArray[k]);
              randomKey[index2].denominator = (backupArray[k+1]);
            } else {
              randomKey[index2].numerator = (backupArray[k+1]);
              randomKey[index2].denominator = (backupArray[k]);
            }
            randomKey[index2].exponentNumerator = backupArray[k+2];
            randomKey[index2].exponentDenominator = backupArray[k+3];
            ++index2;
          }
          dimensionKey = randomKey;
          index = 0;

        }
        randomDroneState = [];
        backupArray = [];
        for (let j = 0; j < (numberOfDimensions * randomActiveNodes); j++) {
          backupArray[j] = (Math.floor(Math.random() * 64) - 32);
        }
        for (let l = 0; l < randomActiveNodes; l++) {
          randomDroneState[l] = {};
          randomDroneState[l].coordinates = [];
          for (let m = 0; m < numberOfDimensions; m++ ) {
            randomDroneState[l].coordinates[m] = backupArray[index];
            ++index;
          }
        }
      },
      timeout: 2000 // set timeout to 2 seconds
    });
    requests2.push($xhr);


}


function setRandomGlobalsPart3 (getString) {
  var index = 0;
  var $xhr = $.ajax({ url: getString,
    success: function(data) {


        console.log(data);
        console.log(data.data);

        for (let i = 0; i < randomDroneState.length; i++) {
          randomDroneState[i].gainvalue = (data.data[index]/256);
          ++index;
          switch (data.data[index] % 4) {
            case (0):
              randomDroneState[i].waveform = 'sine';
              break;
            case (1):
              randomDroneState[i].waveform = 'square';
              break;
            case (2):
              randomDroneState[i].waveform = 'triangle';
              break;
            case (3):
              randomDroneState[i].waveform = 'sawtooth';
              break;
            default:
              randomDroneState[i].waveform = 'sine';
              break;
          }
          ++index;
          randomDroneState[i].panvalue = ((data.data[index] % 2) - 1);
          ++index;
          randomDroneState[i].intervallicEquivalenceDisplacement = ((data.data[index] % 2) - 1);
          ++index;
        }
      },
    error: function(xhr,status, strErr) {
      var backupArray = [];
      console.log('Query failed!');
      console.log(strErr);
      // alert('API FAILURE');
      for (let i = 0; i < (randomDroneState.length * 4); i+4) {
        backupArray[i] = Math.random();
        backupArray[i+1] = (Math.floor(Math.random() * 4));
        backupArray[i+2] = ((Math.random() * 2) - 1);
        backupArray[i+3] = (Math.floor(Math.random() * 4) - 4);
      }
      for (let k = 0; k < randomDroneState.length; k++) {
        randomDroneState[k].gainvalue = backupArray[index];
        ++index;
        switch (backupArray[index]) {
          case (0):
            randomDroneState[k].waveform = 'sine';
            break;
          case (1):
            randomDroneState[k].waveform = 'square';
            break;
          case (2):
            randomDroneState[k].waveform = 'triangle';
            break;
          case (3):
            randomDroneState[k].waveform = 'sawtooth';
            break;
          default:
            randomDroneState[k].waveform = 'sine';
            break;
        }
        ++index;
        randomDroneState[k].panvalue = backupArray[index];
        ++index;
        randomDroneState[k].intervallicEquivalenceDisplacement = backupArray[index];
        ++index;
      }
    },
    timeout: 2000 // 2 seconds timeout
    });
  requests3.push($xhr);


}


function getFrequencyOfPSpace (pSpaceObject) {
  var returnFrequencyValue = 0;

  if (pSpaceObject.denominator === 0) {
    alert('DIVIDE BY ZERO ERROR!');
    return(1);
  } else if (pSpaceObject.denominator === 1) {
    returnFrequencyValue = pSpaceObject.numerator;
  } else {
    returnFrequencyValue = (pSpaceObject.numerator / pSpaceObject.denominator);
  }
  if (pSpaceObject.exponentDenominator === 0) {
    alert('Divide By Zero Error!');
    return (returnFrequencyValue);
  } else if ((pSpaceObject.exponentNumerator / pSpaceObject.exponentDenominator) === 0) {
    alert('Bad Exponent in P Space');
    return (returnFrequencyValue);
  } else if ((pSpaceObject.exponentNumerator / pSpaceObject.exponentDenominator) === 1) {
    return (returnFrequencyValue);
  } else {
    returnFrequencyValue = Math.pow(returnFrequencyValue, (pSpaceObject.exponenetNumerator / pSpaceObject.exponentDenominator));
  }
  return (returnFrequencyValue);
}

function getFrequencyRatioOfPSpace (pSpaceRatio) {
  var returnNumber;

  if (pSpaceRatio.denominoator === 0) {
    return (1);
  } else if (pSpaceRatio.denominoator === 1) {
    returnNumber = pSpaceRatio.numerator;
  } else {
    returnNumber = pSpaceRatio.numerator / pSpaceRatio.denominator;
  }
  if ((pSpaceRatio.exponenetNumerator / pSpaceRatio.exponentDenominator) === 1) {
    return returnNumber;
  } else if ((pSpaceRatio.exponentNumerator / pSpaceRatio.exponentDenominator) === 0) {
    return (1);
  } else if (pSpaceRatio.exponentDenominator === 0) {
    return (1);
  } else {
    returnNumber = Math.pow(returnNumber, (pSpaceRatio.exponenetNumerator / pSpaceRatio.exponentDenominator));
  }
  return (returnNumber);
}

function renderDroneObject (arrayOfDroneMembers) {
  var frequencyOfNode = 1;
  var generatedDroneInputHandle = 0;
  // alert(arrayOfDroneMembers);


  for (let i=0; i < arrayOfDroneMembers.length; i++) {
    arrayOfDroneMembers[i].osc = allocateOscillator();
    frequencyOfNode = getFrequencyFromArray(arrayOfDroneMembers[i].coordinates);
    // alert(frequencyOfNode);
    //
    if (arrayOfDroneMembers[i].intervallicEquivalenceDisplacement !== 0) {
      if (arrayOfDroneMembers[i].intervallicEquivalenceDisplacement > 0) {
        for (let j = 0; j < arrayOfDroneMembers[i].intervallicEquivalenceDisplacement; j++) {
          frequencyOfNode = frequencyOfNode * getFrequencyRatioOfPSpace(pitchSpace);

        }
      } else {
        for (let j = 0; j < Math.abs(arrayOfDroneMembers[i].intervallicEquivalenceDisplacement); j++) {
          frequencyOfNode = frequencyOfNode / getFrequencyRatioOfPSpace(pitchSpace);
        }

      }

    }
    arrayOfDroneMembers[i].hertz = frequencyOfNode;
    if (frequencyOfNode < 22050) {
      arrayOfDroneMembers[i].osc.frequency.value = arrayOfDroneMembers[i].hertz;
    }
    arrayOfDroneMembers[i].osc.type = arrayOfDroneMembers[i].waveform;
    arrayOfDroneMembers[i].pan = initNewPan();
    arrayOfDroneMembers[i].pan.pan.value = arrayOfDroneMembers[i].panvalue;
    arrayOfDroneMembers[i].gain = initNewGain();
    arrayOfDroneMembers[i].gain.gain.value = arrayOfDroneMembers[i].gainvalue;
    generatedDroneInputHandle = getNextInput();
    arrayOfDroneMembers[i].gain.connect(inputManager[generatedDroneInputHandle][0], 0, 0);
    arrayOfDroneMembers[i].pan.connect(arrayOfDroneMembers[i].gain);
    arrayOfDroneMembers[i].osc.connect(arrayOfDroneMembers[i].pan);
    arrayOfDroneMembers[i].lfoStates = [ false, false, false, false, false, false ];

    arrayOfDroneMembers[i].osc.start();
    // alert ('Playing Oscillator now');
    // alert (arrayOfDroneMembers[i].gain.gain.value);






  }
}



function generateRandomDrone (intonationString) {

  var queryStringPart1 = 'https://qrng.anu.edu.au/API/jsonI.php?length=';
  var arrayLengthRequired = 0;
  var queryStringPart3 = '&type=uint8';
  var queryString = '';
  var randomKey = [];

  // clear out any previous sounding dronesState

  if (randomDroneState.length > 0) {

    for (let i = 0; i < randomDroneState.length; i++) {
      if (randomDroneState[i].osc !== undefined) {

        randomDroneState[i].osc.stop();
      }
    }

  }

  if (droneContent.length > 0) {
    for (let j = 0; j < droneContent.length; j++) {
      droneContent[j].osc.stop();
    }
  }

  // Generate P-space parameters - This requires 4 parameters - numerator, denominator, exponentnumerator and exponentdeonminator.
  // arrayLengthRequired = 4;
  // queryString = queryStringPart1 + arrayLengthRequired + queryStringPart3;
  // randomPSpace = generatePSpaceOrKey(queryString);

  // // Generate 1/1
  // arrayLengthRequired = 2;
  // queryString = queryStringPart1 + arrayLengthRequired + queryStringPart3;
  // randomOneOverOne = generateOneOverOne(queryString);

  // // Generate dimensions
  // arrayLengthRequired = 1;
  // queryString = queryStringPart1 + arrayLengthRequired + queryStringPart3;
  // randomDimensions = generateRandomDimension(queryString);


  //Refactored for fewer API calls. Lumping pSpace generation, OneOverOne assignment, number of dimensions and number of active nodes into one function.
  // API failure will default to internal math random function.

  arrayLengthRequired = 8;
  queryString = queryStringPart1 + arrayLengthRequired + queryStringPart3;
  setRandomGlobalsPart1(queryString);


  // Generate dimensional key
  Promise.all(requests).then(function (results) {
    // alert(pitchSpace);
    console.log(results);
    if (intonationString === 'hybrid') {
      arrayLengthRequired = (4 * numberOfDimensions) + (numberOfDimensions * randomActiveNodes);

    } else {
      arrayLengthRequired = (numberOfDimensions * randomActiveNodes);
    }
    queryString = queryStringPart1 + arrayLengthRequired + queryStringPart3;
    setRandomGlobalsPart2(queryString, intonationString);

    //
    // for (let i = 0; i < randomDimensions; i++) {
    //   randomKey[i] = {};
    //
    //   if (intonationString === 'hybrid') {
    //     randomKey[i] = generatePSpaceOrKey(queryString);
    //   } else {
    if (intonationString === 'just') {
      for (let i = 0; i < numberOfDimensions; i++ ) {
        randomKey[i] = {};
        randomKey[i].numerator = primeFactors[i];
        randomKey[i].denominator = 1;
        randomKey[i].exponentNumerator = 1;
        randomKey[i].exponentDenominator = 1;
      }
      dimensionKey = randomKey;
    }

    // // Generate number of active nodes
    // arrayLengthRequired = 1;
    // queryString = queryStringPart1 + arrayLengthRequired + queryStringPart3;
    // randomActiveNodes = generateRandomNodes(queryString);




    // Step through new droneState array and generate Gain, Waveform, Pan and intervallic equivalence displacement
    // arrayLengthRequired = 1;
    // queryString = queryStringPart1 + arrayLengthRequired + queryStringPart3;
    //
    // for (let i = 0; i < randomDroneState.length; i++) {
    //   randomDroneState[i].gainvalue = generateGainState(queryString);
    //   randomDroneState[i].waveform = generateWaveformSelection(queryString);
    //   randomDroneState[i].panvalue = generatePanState(queryString);
    //   randomDroneState[i].intervallicEquivalenceDisplacement = generateIntervallicEquivalenceDisplacement(queryString);
    // }



    Promise.all(requests2).then(function(secondresults) {

      console.log(secondresults);
      // alert(randomDroneState);
      //Set gain, waveform, pan and displacement on each node.

      // alert(randomDroneState);
      arrayLengthRequired = (randomActiveNodes * 4);
      queryString = queryStringPart1 + arrayLengthRequired + queryStringPart3;
      setRandomGlobalsPart3(queryString);

      Promise.all(requests3).then(function(thirdresults) {

        console.log(thirdresults);


        renderDroneObject(randomDroneState);
      })
      .catch(function(err) {
        console.log(err);
      });
    })
    .catch(function (err) {
      console.log(err);
    });
  })
  .catch(function (err) {
    console.log(err);
  });
}

hookUpMergerNodes();
initializeGlobals();


$(document).ready(function(){
     $('.parallax').parallax();



    console.log( "ready!" );

    $(".dropdown-button").dropdown();
    $(".parallax" ).fadeTo( "slow" , 0.5);
    $("#volumeDisplay").text('-99dB');

    $('#thisIsMasterVolumeSlider').on('input', function () {
        // $('#thisIsMasterVolumeSlider').hide();
        var newVolume = $('#thisIsMasterVolumeSlider').val();
        masterVolume = newVolume;
        masterGainNode.gain.value = Math.abs((masterVolume - 1)/100);
        $('#volumeDisplay').text((newVolume - 100) +'dB');
        muteState = false;


    });

    $('#thisIsNodeVolumeSlider').on('input', function () {
        // $('#thisIsMasterVolumeSlider').hide();
        var newVolume = $('#thisIsNodeVolumeSlider').val();
        currentNodeObject.gain.gain.value = Math.abs((newVolume - 1)/100);
        currentNodeObject.gainvalue = currentNodeObject.gain.gain.value;
        updateNodeRadius(activeNode, newVolume);

    });

    $('#thisIsNodePanSlider').on('input', function () {
        var newPanVal = $('#thisIsNodePanSlider').val();
        if (newPanVal === 50) {
          currentNodeObject.pan.pan.value = 0;
        } else {
          currentNodeObject.pan.pan.value = (((newPanVal/99) * 2) - 1);
        }


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

    $('#randomDroneJust').on('click', function() {
      generateRandomDrone('just');

    });

    $('#randomDroneHybrid').on('click', function() {
      generateRandomDrone('hybrid');

    });

    $('#sinewave').on('click', function() {
      currentNodeObject.osc.type = 'sine';

    });

    $('#squarewave').on('click', function () {
      currentNodeObject.osc.type = 'square';
    });

    $('#trianglewave').on('click', function () {
      currentNodeObject.osc.type = 'triangle';
    });

    $('#sawtoothwave').on('click', function () {
      currentNodeObject.osc.type = 'sawtooth';
    });

    $('#addNodes').on('click', function () {
      var grabDiv = $('#canvas :first-child');
      var lastDiv = $('#canvas :last-child');
      var grabNodeDiv;
      var pend = '';


      do {
        //prepend to first child
        grabNodeDiv = grabDiv.children(':first');
        pend = 'prepend';
        addNewNode(grabNodeDiv, pend);




        //append to last child
        grabNodeDiv = grabDiv.children('div').last();
        pend = 'append';
        addNewNode(grabNodeDiv, pend);

        // set grabDiv to next child - need to write this code when adding second dimension
        if ((grabDiv.attr("id")) !== (lastDiv.attr("id"))) {
          grabDiv = grabDiv.next('div');
        }

      } while ((grabDiv.attr("id")) !== (lastDiv.attr("id")));


    });

    $('#nodeCanvas').on('click', function(event) {
      var clickedNode = $(event.target);
      var nodeOscillator;
      var nodePan;
      var nodeGain;
      var inputHandle;
      var checkArray;



      if ((clickedNode.attr("id") === 'origin') || (clickedNode.attr("alt") === 'node')) {
        // alert('Verified that we have clicked on a damn node');
        if (activeNode === null) {
          // alert('Clicked while no nodes are active.');

          // display our editor pane, set activeNode to current node, update node icon and color.


          activeNode = clickedNode;
          activeNode.text('volume_up');
          activeNode.parent().attr("class", "btn-floating btn-large waves-effect waves-light teal z-depth-4");



          if (activeNode.attr("parameters") === 'unedited') {
            // if node is "unedited", enable new oscillator and start it, set property to edited. Push new node into user drone. Set editor pane.
            // alert('This node has not been previously edited');
            $('#editPanel').show();
            activeNode.attr("parameters", "edited");
            nodeOscillator = initNewOscillator(activeNode.attr("coordinates"));
            nodePan = initNewPan();
            nodeGain = initNewGain();
            inputHandle = getNextInput();
            // alert(inputHandle);
            // alert(inputManager[inputHandle][0]);
            // alert(inputManager[inputHandle][1]);
            nodeGain.connect(inputManager[inputHandle][0], 0, 0);
            // nodeGain.connect(inputManager[8][0], 0, 0);
            nodePan.connect(nodeGain);
            nodeOscillator.connect(nodePan);

            nodeOscillator.start();
            currentNodeObject = initDroneObject(nodeOscillator, nodePan, nodeGain, activeNode.attr("coordinates"));
            droneContent.push(currentNodeObject);

            updateEditorPane(currentNodeObject);

            // initLFOPane(activeNode);

          } else {
            // alert('edited');
            // if node is "edited", unmute old oscillator. Update editor pane.
            // find our matching object in the droneContent array. Make that current.
            // alert(clickedNode.attr("coordinates"));
            checkArray = convertLocationStringToArray(clickedNode.attr("coordinates"));
            currentNodeObject = getObjectByCoordinateMatch (checkArray);
            // Update relevant parameters. Unhide edit pane.
            currentNodeObject.gain.gain.value = currentNodeObject.gainvalue;
            currentNodeObject.active = true;
            // Make edit pane current.
            updateEditorPane(currentNodeObject);
            $('#editPanel').show();



          }
        } else if ((clickedNode.attr("coordinates")) === (activeNode.attr("coordinates"))) {
          // user has selected active node. This turns node off and mutes its output. Editor pane is hidden. activeNode returns to null.
          currentNodeObject.active = false;
          currentNodeObject.gain.gain.value = 0.0;
          activeNode.parent().attr("class", "btn-floating btn-large waves-effect waves-light grey z-depth-2");
          $('#editPanel').css("display", "none");
          activeNode.text('music_note');
          activeNode = null;

        } else {
          // ActiveNode is not Null.  ActiveNode is not equal to clickedNode.

          // user has moved to current node from another node. Update our editor pane accordingly
          // shut down active pane and do some housework to maintain previously playing node(s)
          $('#editPanel').css("display", "none");
          activeNode = clickedNode;
          activeNode.text('volume_up');
          activeNode.parent().attr("class", "btn-floating btn-large waves-effect waves-light teal z-depth-4");

          // Is new node unedited?
          if (activeNode.attr("parameters") === 'unedited') {
            // alert('This node has not been previously edited');

            // Initialize a new node, new object, push it into droneContent array.
            $('#editPanel').show();
            activeNode.attr("parameters", "edited");
            nodeOscillator = initNewOscillator(activeNode.attr("coordinates"));
            nodePan = initNewPan();
            nodeGain = initNewGain();
            inputHandle = getNextInput();
            // nodeGain.connect(inputManager[inputHandle][0], 0, inputManager[inputHandle][1]);
            nodeGain.connect(inputManager[inputHandle][0], 0, 0);

            nodePan.connect(nodeGain);
            nodeOscillator.connect(nodePan);

            nodeOscillator.start();
            currentNodeObject = initDroneObject(nodeOscillator, nodePan, nodeGain, activeNode.attr("coordinates"));
            droneContent.push(currentNodeObject);

            updateEditorPane(currentNodeObject);

          } else {
            // Re-activate previously active node

              checkArray = convertLocationStringToArray(clickedNode.attr("coordinates"));
              currentNodeObject = getObjectByCoordinateMatch (checkArray);
              if (currentNodeObject.active === true) {
                updateEditorPane(currentNodeObject);
                $('#editPanel').show();
              } else {
                currentNodeObject.gain.gain.value = currentNodeObject.gainvalue;
                currentNodeObject.active = true;
                // Make edit pane current.
                updateEditorPane(currentNodeObject);
                $('#editPanel').show();
              }

          }

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
