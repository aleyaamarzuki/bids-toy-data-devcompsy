// declare all variables
let symptoms;
let disease_keylist;
let acc = 0;
let tmp;
var resp = [];
let permArr = [];
let usedChars = [];
var trials = [];
var testTrials = [];
var testBlock = [];

/* ******************************************
 * Create components of the experiment
******************************************* */

/** permute - produce permutations of array with no repeats
 * taken from https://stackoverflow.com/a/9960925/7214634
 * @param {array} input array to be permuted
 * @return {array} all possible permutations of elements from array
 */
function permute(input) {
  let i; let ch;
  for (i = 0; i < input.length; i++) { //   loop over all elements
    ch = input.splice(i, 1)[0]; // 1. pull out each element in turn
    usedChars.push(ch); //   push this element
    if (input.length == 0) { // 2. if input is empty, we pushed every element
      permArr.push(usedChars.slice()); //   so add it as a permutation
    }
    permute(input); // 3. compute the permutation of the smaller array
    input.splice(i, 0, ch); // 4. add the original element to the beginning
    //   making input the same size as when we started
    //   but in a different order
    usedChars.pop(); // 5. remove the element we pushed
  }
  return permArr; // return, but this only matters in the last call
}

/** Simple Encryption Algorithm for in-house use
 * The code is a simple copy-paste from https://javascript.tutorialink.com/javascript-aes-encryption-and-decryption-advanced-encryption-standard/
 * I don't see any particular problem with this code as long as we don't release it in public. * 
 */
let code = (function(){
  return{
    encryptMessage: function(messageToencrypt = '', secretkey = ''){
      var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
      return encryptedMessage.toString();
    },
    decryptMessage: function(encryptedMessage = '', secretkey = ''){
      var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
      var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return decryptedMessage;
    }
  }
})();

// key codes: 88 is X and 89 is Y key
// first element is always common, second element is always rare
disease_keylist = [88, 89];
disease_keylist = jsPsych.randomization.shuffle(disease_keylist);

// inter-trial interval

const intertrial = {
  type: 'html-keyboard-response',
  stimulus: '',
  trial_duration: 500,
  response_ends_trial: false,
  choices: jsPsych.NO_KEYS,
};

// enter unique ID
var participantID = {
  type: 'survey-text',
  questions: [
    {prompt: '<h2>Please enter your Participant ID below.</h2> <br> If you are unable to enter your student ID, ' +
              'please enter a number that you will remember.'}
  ],
  data: {
    include: false,
  },
  // on_finish: function(data) {
  //   let decrypted = code.encryptMessage(pptID, 'my-passwd');
  //   jsPsych.data.addProperties({ppt: decrypted});
  // },
}

// instructions for training phase
const instructionTraining = {
  type: 'html-keyboard-response',
  stimulus: ['<p style="display:inline-block;align:center;font-size:16pt;' +
    'width:60%"> In this phase of the experiment you will be presented with' +
    ' statements about various students. They will be described by a single' + 
    ' characteristic and their group membership. There will be 36 students' +
    ' overall with a break in the middle. Please study each student\'s description carefully.' +
    ' You will have 5 seconds to do this. If the 5 seconds have passed, you will move on to the ' +
    ' next student.' +
    '</p><br>Press \'space\' to continue.'],
  choices: ['space'],
};

// instructions for test phase
const instructionTest= {
  type: 'html-keyboard-response',
  stimulus: ['<p style="display:inline-block;align:center;font-size:16pt;' +
    'width:60%">' +
    'Well done on completing the first phase! Now, you will begin ' +
    'the test phase. In this phase, you will be required to rate how much ' +
    'you think you would like each group.' +   
    '<br> After you responded to those ratings, you will continue to encounter students,' + 
    'but this time their description will be incomplete - they will be missing their name and group membership. ' +
    'Your task will be to allocate these students into the two groups you have seen previously. ' +
    'If you think the student should go into Group X, press ' +
    '\'X\'. If you think the student should go to Group Y, press \'Y\'.' +
    '<br>Try to be as accurate as you can.</p>' +
    '<br>This phase will have 32 students to allocate.</p>' +
    '<br>Press \'space\' to continue.'],
  choices: ['space'],
};

// welcome message
const welcome = {
  type: 'html-keyboard-response',
  stimulus: ['<p style = "font-size:48px;line-height:2;">' +
        'Welcome to the Experiment! <br> Please press \'space\'.</p>',
  ],
  choices: ['space'],
  on_start: function() {
    jsPsych.data.addProperties({session: sessionCurrent});
  },
};

// between block rest during test
const testRest = {
  type: 'html-keyboard-response',
  stimulus: ['<p style = "font-size:24px;line-height:2;width:600px ">' +
        'You have completed a block. Take a breath and press \'space\' ' +
        'on the keyboard when you are ready to continue</p>',
  ],
  choices: ['space'],
};

// remind people to press EXIT EXPERIMTENT button at the end
const ratingIntermezzo = {
  type: 'html-keyboard-response',
  stimulus: ['<h1>Ratings</h1>' +
      '<p style="display:inline-block;align:center;font-size:16pt;' +
      'width:60%">Thank you for providing your ratings. <br><br> Please press \'space\' to continue to the allocation task.</p>'],
  choices: ['space'],
};


// debrief
const debrief = {
  type: 'external-html',
  url: 'assets/debrief.html',
  cont_btn: 'exit',
  // on_start: function() {
  //   const results = jsPsych.data.get().filter({include: true}).csv();
  //   jatos.submitResultData(results);
  //   jatos.uploadResultFile(results, sessionCurrent + '_' + jatos.workerId + '.csv')
  //       .then(() => console.log('File was successfully uploaded'))
  //       .catch(() => console.log('File upload failed'));
  // },
};

// consent form

/* sample function that might be used to check if a subject has given
* consent to participate. If the button is clicked without checking the
* 'I agree' box, prompt participants to check it.
* taken from JSpsych external-html documentation
* @param {boolean} elem True or False boolean
*/
const checkConsent = function(elem) {
  if (document.getElementById('consent_checkbox').checked) {
    return true; // return true if it has been checked
  } else {
    alert('If you wish to participate, you must check the box next to' +
          ' the statement \'I agree to participate in this study.\'');
    return false;
  }
  return false;
};

const consent = {
  type: 'external-html',
  url: 'assets/consent.html',
  cont_btn: 'start',
  check_fn: checkConsent,
};


/* ******************************************
* Create adjective and list
******************************************* */

// taken from https://github.com/aruljohn/popular-baby-names

const girls = ['Emma',
  'Olivia',
  'Ava',
  'Isabella',
  'Sophia',
  'Charlotte',
  'Mia',
  'Amelia',
  'Harper',
  'Evelyn',
  'Abigail',
  'Emily',
  'Elizabeth',
  'Mila',
  'Ella',
  'Avery',
  'Sofia',
  'Camila',
  'Aria',
  'Scarlett',
  'Victoria',
  'Madison',
  'Luna',
  'Grace',
  'Chloe',
  'Penelope',
  'Layla',
  'Riley',
  'Zoey',
  'Nora',
  'Lily',
  'Eleanor',
  'Hannah',
  'Lillian',
  'Addison',
  'Aubrey',
  'Ellie',
  'Stella',
  'Natalie',
  'Zoe',
  'Leah',
  'Hazel',
  'Violet',
  'Aurora',
  'Savannah',
  'Audrey',
  'Brooklyn',
  'Bella',
  'Claire',
  'Skylar'];

const boys = ['Liam',
  'Noah',
  'William',
  'James',
  'Oliver',
  'Benjamin',
  'Elijah',
  'Lucas',
  'Mason',
  'Logan',
  'Alexander',
  'Ethan',
  'Jacob',
  'Michael',
  'Daniel',
  'Henry',
  'Jackson',
  'Sebastian',
  'Aiden',
  'Matthew',
  'Samuel',
  'David',
  'Joseph',
  'Carter',
  'Owen',
  'Wyatt',
  'John',
  'Jack',
  'Luke',
  'Jayden',
  'Dylan',
  'Grayson',
  'Levi',
  'Isaac',
  'Gabriel',
  'Julian',
  'Mateo',
  'Anthony',
  'Jaxon',
  'Lincoln',
  'Joshua',
  'Christopher',
  'Andrew',
  'Theodore',
  'Caleb',
  'Ryan',
  'Asher',
  'Nathan',
  'Thomas',
  'Leo'];

const names = jsPsych.randomization.shuffle(girls.concat(boys).flat());

/* Create abstract design for both training and test phases */

// create physical stimuli
negative = [
  "annoying",
  "cruel",
  "cynical",
  "desperate",
  "deviant",
  "disloyal",
  "eerie",
  "filthy",
  "foolish",
  "haphazard",
  "harmful",
  "harsh",
  "ignorant",
  "immoral",
  "impossible",
  "incompetent",
  "insincere",
  "insulting",
  "jealous",
  "malicious",
  "negative",
  "obnoxious",
  "offensive",
  "panicky",
  "possessive",
  "psychotic",
  "resentful",
  "selfish",
  "sinister",
  "toxic",
  "unfaithful",
  "vicious",
  "vile",
  "wicked"
];

positive = [
  "athletic",
  "authentic",
  "awesome",
  "brainy",
  "capable",
  "cheerful",
  "courageous",
  "deserving",
  "efficient",
  "engaging",
  "fortunate",
  "generous",
  "helpful",
  "honourable",
  "hopeful",
  "humane",
  "independent",
  "intelligent",
  "interesting",
  "joyful",
  "lively",
  "loyal",
  "outstanding",
  "positive",
  "professional",
  "reasonable",
  "reliable",
  "skilled",
  "successful",
  "superb",
  "trustworthy",
  "useful",
  "wise",
  "witty"
];

let condition = 1;

// if (jatos.workerId % 2 == 0) {
//   condition = 0;
// }

if (condition == 1) {
  common = jsPsych.randomization.shuffle(positive);
  rare = jsPsych.randomization.shuffle(negative);
} else {
  common = jsPsych.randomization.shuffle(negative);
  rare = jsPsych.randomization.shuffle(positive);
}

/* *******************************************
 * ********* Create training phase ***********
 ******************************************* */

const training = [
  ['majority', 'A', '1'],
  ['majority', 'A', '2'],
  ['majority', 'A', '3'],
  ['majority', 'A', '4'],
  ['majority', 'B', '1'],
  ['majority', 'B', '2'],
  ['minority', 'A', '5'],
  ['minority', 'A', '6'],
  ['minority', 'B', '3']
];

var stimuli = [];
var old_common_majority = [];
var old_common_minority = [];
var old_rare_majority = [];
var old_rare_minority = [];

// combine training blocks (randomize within blocks)
for (let i = 0; i < 4; i++) {
  var current = jsPsych.randomization.shuffle(training);
  trials = trials.concat(current);
  for (let k = 0; k < current.length; k++) {
    let location = current[k][2];
    // if common feature, calculate location
    if (current[k].includes('A')) {
      let multiplier = i * 6;
      stimuli.push(parseInt(location, 10) + multiplier);
      // save old items based on group membership
      if (current[k].includes('majority')) {
        old_common_majority.push(parseInt(location, 10) + multiplier);
      } else {
        old_common_minority.push(parseInt(location, 10) + multiplier);
      }
    // if rare feature, calculate location
    } else {
      let multiplier = i * 3;
      stimuli.push(parseInt(location, 10) + multiplier);
      // save old items based on group membership
      if (current[k].includes('majority')) {
        old_rare_majority.push(parseInt(location, 10) + multiplier);
      } else {
        old_rare_minority.push(parseInt(location, 10) + multiplier);
      }
    }
  }
}

/* combine test blocks (randomize within blocks)
for (let i = 0; i < 20; i++) {
  testTrials = testTrials.concat(
      jsPsych.randomization.shuffle(testItems));
}
*/

const trainingBlock = []; // training matrix
let blk = 1; // block number

for (var i = 0; i < trials.length; i++) {
  // select correct response key and category based on current stimuli
  let trait;
  // select trait based on abstract stimulus type
  if (trials[i].includes('A')) {
    // set up individual features
    trait = common[stimuli[i] - 1];
  } else if (trials[i].includes('B')) {
    trait = rare[stimuli[i] - 1];
  }
  // select correct category given stimulus type
  if (trials[i].includes('majority')) {
    var correct = disease_keylist[0];
  } else {
    var correct = disease_keylist[1];
  }
  trainingBlock.push({
    type: 'categorize-html',
    stimulus: ['<p style = "line-height:1.5;font-size:60px">' +
            names[Math.floor((Math.random() * 100))] + ' from Group ' +
            String.fromCharCode(correct) + ' is ' + trait + '.</p>'],
    choices: ['space'],
    prompt: '<div style="margin-bottom:10px"><p style = "font-size:24px">' +
      'Please read and study the statement above.' +
      '</p></div>',
    data: {
      trait: [trait],
      stimulus: trials[i][1],
      category: trials[i][0], // stimuli category
      phase: 'training',
      trial: i + 1,
      include: true,
      block: blk,
    },
    key_answer: '',
    show_stim_with_feedback: false,
    show_feedback_on_timeout: false,
    correct_text: '',
    incorrect_text: '',
    feedback_duration: 0,
    trial_duration: 5000,
    timeout_message: '',
    on_finish: function(data) {
      // decode responses into common or rare
      if (disease_keylist.indexOf(data.key_press) === 0) {
        resp = 'majority';
      } else if (disease_keylist.indexOf(data.key_press) === 1) {
        resp = 'minority';
      } else {
        resp = 'none';
      };
      data.abresp = resp; // record abstract respons
      if (data.key_press === 8) {
        jsPsych.endCurrentTimeline(); // end if backspace is pressed
      }
    },
  });
  trainingBlock.push(intertrial); // intertrial interval
  if (i > 1 && (i + 1) % 18 === 0) {
    trainingBlock.push({
      type: 'html-keyboard-response',
      stimulus: ['<p style = "font-size:24px;line-height:2;width:600px ">' +
            'You have completed a training block. <br>Take a short ' +
            'breath and press \'space\' when you are ready to continue.</p>'],
      choices: ['space'],
    });
    blk += 1;
  }
}

// create training phase timeline element
const trainingPhase = {
  type: 'html-keyboard-response',
  timeline: trainingBlock,
  data: {
    keys: disease_keylist,
    condition: condition,
  },
};

// compile pre-training ratings

/* *******************************************
 * ****** Create ratings scales ********
 ******************************************* */

var ratingStimuli = [
  { stimulus: '<p style = "line-height:2;font-size:32px">Please rate how much do you like <strong> Group X </strong> on the scale below:</p>'},
  { stimulus: '<p style = "line-height:2;font-size:32px">Please rate how much do you like <strong> Group Y </strong> on the scale below:</p>'}
];

const likert = {
    type: 'html-slider-response',
    prompt: '<p style = "line-height:2;font-size:24px">Use the slider to respond.</p>',
    stimulus: jsPsych.timelineVariable('stimulus'),
    data: {
      include: true,
      phase: 'rating',
    },
    labels: ["(Extremely dislike)", "(Neutral)", "(Extremely like)"],
    min: 0,
    max: 10,
    start: 5,
    require_movement: false,
    slider_width: 800,
  }

const testRatings = {
  type: 'html-slider-response',
  timeline: [intertrial, likert],
  randomize_order: true,
  timeline_variables: ratingStimuli,
  data: {
    keys: disease_keylist,
    condition: condition,
  },
};

/* *******************************************
 * *********** Create test phase *************
 ******************************************* */

const test = [
  ['majority', 'A', 'old', '1'],
  ['majority', 'A', 'old', '2'],
  ['majority', 'A', 'old', '3'],
  ['majority', 'A', 'old', '4'],
  ['majority', 'A', 'new', '1'],
  ['majority', 'A', 'new', '2'],
  ['majority', 'A', 'new', '3'],
  ['majority', 'A', 'new', '4'],
  ['majority', 'B', 'old', '1'],
  ['majority', 'B', 'old', '2'],
  ['majority', 'B', 'old', '3'],
  ['majority', 'B', 'old', '4'],
  ['majority', 'B', 'new', '5'],
  ['majority', 'B', 'new', '6'],
  ['majority', 'B', 'new', '7'],
  ['majority', 'B', 'new', '8'],
  ['minority', 'A', 'old', '1'],
  ['minority', 'A', 'old', '2'],
  ['minority', 'A', 'old', '3'],
  ['minority', 'A', 'old', '4'],
  ['minority', 'A', 'new', '1'],
  ['minority', 'A', 'new', '2'],
  ['minority', 'A', 'new', '3'],
  ['minority', 'A', 'new', '4'],
  ['minority', 'B', 'old', '1'],
  ['minority', 'B', 'old', '2'],
  ['minority', 'B', 'old', '3'],
  ['minority', 'B', 'old', '4'],
  ['minority', 'B', 'new', '5'],
  ['minority', 'B', 'new', '6'],
  ['minority', 'B', 'new', '7'],
  ['minority', 'B', 'new', '8']
];

// combine training blocks (randomize within blocks)

var testing = [];
for (let index = 0; index < 1; index++) {
  testing.push(jsPsych.randomization.shuffle(test));
}
testing = testing.flat();

// reset block counter
blk = 1;
// compile test phase array with all trials
for (let i = 0; i < testing.length; i++) {
    // select correct response key and category based on current stimuli
    let trait;
    var stim;
    let location = parseInt(testing[i][3], 10);
    // select trait based on abstract stimulus type
    // according to combination of abstract stim and new/old and majority/minority
    // start with a common trait denoted by A
    if (testing[i].includes('A')) {
      // set up individual features
      if (testing[i].includes('old') && testing[i].includes('majority')) {
       stim = common[old_common_majority[location - 1]];
      } else if (testing[i].includes('old') && testing[i].includes('minority')) {
       stim = common[old_common_minority[location - 1]];
      } else if (testing[i].includes('new') && testing[i].includes('majority')) {
       stim = common[34 - location];
      } else if (testing[i].includes('new') && testing[i].includes('minority')) {
       stim = common[34 - location];
      }
    // if it is a rare trait
    } else if (testing[i].includes('B')) {
     //set up physical feature
     if (testing[i].includes('old') && testing[i].includes('majority')) {
       stim = rare[old_rare_majority[location - 1]];
      } else if (testing[i].includes('old') && testing[i].includes('minority')) {
       stim = rare[old_rare_minority[location - 1]];
      } else if (testing[i].includes('new') && testing[i].includes('majority')) {
       stim = rare[34 - location];
      } else if (testing[i].includes('new') && testing[i].includes('minority')) {
       stim = rare[34 - location];
      }
    }
    testBlock.push({
      type: 'categorize-html',
      stimulus: ['<p style = "line-height:1.5;font-size:60px">' + 
      'This student is<br>' + stim + '.</p>'],
      choices: ['x', 'y'],
      trial_duration: 10000,
      feedback_duration: 500,
      show_stim_with_feedback: false,
      key_answer: disease_keylist,
      correct_text: '<p style="font-size:30px">Response recorded.</p>',
       incorrect_text: '<p style="font-size:30px">Response recorded.</p>',
       timeout_message: '<p style="font-size:30px">Please respond faster!</p>',
       prompt: '<p style = "font-size:30px">' +
        'Does you allocate this student to Group X or Y?' +
        '</p>',
    data: {
      trait: stim,
      stimulus: testing[i][1],
      old: testing[i].includes('old'),
      category: 'none',
      phase: 'test',
      trial: i + 1,
      include: true,
      block: blk,
    },
    on_finish: function(data) {
      if (disease_keylist.indexOf(data.key_press) === 0) {
        resp = 'majority';
      } else if (disease_keylist.indexOf(data.key_press) === 1) {
        resp = 'minority';
      } else {
        resp = 'none';
      };
      data.abresp = resp;
    },
  });
  // have a rest after each block
  // if (i > 1 && (i + 1) % 32 === 0) {
  //   testBlock.push(testRest);
  //   blk += 1;
  // }
}


// create test phase timeline elements
const testPhaseBlock = {
  type: 'html-keyboard-response',
  timeline: testBlock,
  data: {
    keys: disease_keylist,
    condition: condition,
  },
};