const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const readline = require('readline');

// Firstly, we construct a dictionary of American English from the words file
const rl = readline.createInterface({
  input: require("fs").createReadStream("/usr/share/dict/words")
});

// dictionary[word] = false means that you are currently inactive
// dictionary[word] = undefined means that you are not a word
// These both evaluate to false in conditionals and sometimes these 
// cases need not be discriminated.
var dictionary = {}

// Every time we read a new word, we add it in lowercase to the dictionary
rl.on('line', (input) => {
  dictionary[input.toLowerCase()] = true;
});

// Set an alarm for when we're done setting up the dictionary
var alarm = false;

rl.on('pause', () => {
  console.log("Dictionary constructed");
});

// Using EJS as the templating engine so that we can stick to more JavaScript
app.set('view engine', 'ejs');

// Serving css and js from the public directory
app.use(express.static(__dirname + '/public'));

// Using bodyparser to send forms
app.use(bodyParser.urlencoded({
  enabled: true,
  extended: true
}));
app.use(bodyParser.json());

// The following GET requests should be self explanatory
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/bio', (req, res) => {
  res.render('bio');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/sketch', (req, res) => {
  res.render('sketch');
});

// Conceptually, we imagine that there is a list of words we are not allowed to use
// at the moment, due to the fact that someone already used it. This function removes
// the given word from this list.
function remove(word) {
  dictionary[word] = true;
}

// Generate all of the words which are the given word without a single letter.
function oneLetterRemoved(word) {
  const length = word.length;
  let i = 1;
  var words = [];
  while (i < length) {
    words.push(word.substring(0, i - 1) + word.substring(i, length));
    i++;
  }
  return words;
}

// Check if any of these words are in the dictionary.
function wordsInDictionary(words) {
  var i = 0;
  while (i < words.length) {
    if (words[i] in dictionary) {
      console.log(words[i]);
      return true;
    }
    i++;
  }
  return false;
}

// Here, we deal with the logic for the CAPTCHA on the contact page.
app.post('/contact', (req, res) => {
  var word = req.body.word.toLowerCase();
  var words = oneLetterRemoved(word);
  if (word.length < Math.floor(Math.random() * 3) + 3) {
    res.render('failure', {reason: "Pathetic, robot, you can't even think of a long word?"});
  } else if (!(word in dictionary)) { // check if the word has been used recently
    res.render('failure', {reason: "Filthy robot, that's not even a word..."});
  } else if (!dictionary[word]) {
    res.render('failure', {reason: "That word is out of commission because someone has used it in the last 60 seconds"});
  } else if (wordsInDictionary(words)) {
    dictionary[word] = false;
    setTimeout(remove, 60000, word);
    res.render('victory');
  } else {  
    res.render('failure', {reason: "Where's the word in there, metalskin?"});
  }
});

app.listen(80, () => {

});
