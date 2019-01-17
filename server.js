const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const readline = require('readline');

const rl = readline.createInterface({
  input: require("fs").createReadStream("/usr/share/dict/words")
});

var dictionary = {}

rl.on('line', (input) => {
  dictionary[input] = true;
});

    
rl.on('close', () => {
  alarm = true;
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  enabled: true,
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/bio', (req, res) => {
  res.render('bio');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

function remove(word) {
  dictionary[word] = true;
}

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

app.post('/contact', (req, res) => {
  var word = req.body.word.toLowerCase();
  var words = oneLetterRemoved(word);
  if (word.length < Math.floor(Math.random() * 3) + 3) {
    res.render('failure', {reason: "Pathetic, robot, you can't even think of a long word?"});
  }
  else if (!dictionary[word]) { // check if the word has been used recently
    res.render('failure', {reason: "Filthy robot, that's not even a word..."});
  } else if (wordsInDictionary(words)) {
    dictionary[word] = false;
    setTimeout(remove, 60000, word);
    res.render('victory');
  } else {  
    res.render('failure', {reason: "Where's the word in there, metalskin?"});
  }
});

app.get('/sketch', (req, res) => {
  res.render('sketch');
});

app.listen(80, () => {

});
