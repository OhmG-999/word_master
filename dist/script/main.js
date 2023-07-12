/**
 * Store each of the URLs form accepted by the API to get data
 * 
 * 🔗 WORD_OF_THE_DAY provide one randow word each day
 * 🔗🔗 RANDOM_WORD will give you a new random word each time
 * 🔗🔗🔗 ALWAYS_SAME_WORD - alway give the word specified in the last parameter (puzzle=) - change the last parameter in the URL for a different random word
*/
import _ from '.confetti.js'

const WORD_OF_THE_DAY = "https://words.dev-apis.com/word-of-the-day";
const RANDOM_WORD = "https://words.dev-apis.com/wordof-the-day/get-word-of-the-day?random=1";
const ALWAYS_SAME_WORD = "https://words.dev-apis.com/wordof-the-day/get-word-of-the-day?puzzle=1337";
const GUESS_RESULT = "https://words.dev-apis.com/validate-word";
const CORRECT_POSITION = "correct-position";
const INCORRECT_POSITION = "incorrect-position";
const DOES_NOT_EXIST = "does-not-exist";
let _wordToBeGuessed = "";
let _typedLetters = "";
let _result = "";

// Convert each formm NodeList to an Array with slice()
const form1 = Array.prototype.slice.call(
    document.querySelectorAll('#attempt-1 input')
);

const form2 = Array.prototype.slice.call(
    document.querySelectorAll('#attempt-2 input')
); 

const form3 = Array.prototype.slice.call(
    document.querySelectorAll('#attempt-3 input')
); 

const form4 = Array.prototype.slice.call(
    document.querySelectorAll('#attempt-4 input')
); 

const form5 = Array.prototype.slice.call(
    document.querySelectorAll('#attempt-5 input')
); 

const form6 = Array.prototype.slice.call(
    document.querySelectorAll('#attempt-6 input')
); 

// Create a multidimensional array of forms
const forms = [form1, form2, form3, form4, form5, form6];

function init(){
    setWordToBeGuessed();

    console.log(forms);
    
    forms.forEach((form) =>{
        form.forEach((input) => {
            input.addEventListener('keyup', (event) => {
                const letter = isLetter(event.key);
                if (letter){
                    setTypedLetter(event.key.toLowerCase()); 
                    if (input.value.length >= input.maxLength){
                        disableInputedField(input.id);
                        event.preventDefault();
                        focusNext(form);
                    }
                }
                else {
                    event.preventDefault;
                    removeNonLetterCharacters(input.id);
                } 
            }); 
        });
    })

    forms.forEach((form) =>{
        form[4].addEventListener("keyup", () => {

            let isWordGuessedValid = postWordGuessed(getTypedLetter());
    
            if (isWordGuessedValid) {
                verifyWord(getTypedLetter(), getWordToBeGuessed(), form);
                poof();
            }
            else {
                alert("The word " + getTypedLetter + " is not a valid English word. You have waisted one chance");
            }
            _typedLetters = "";
        })
    })    
}

// Getter & Setter
// Get the word to guess from the endpoint
async function getWordToGuess(WORD_URL){
    const promise = await fetch(WORD_URL);
    const guess = await promise.json();
    const word = guess.word;
    
    return word;
}

async function setWordToBeGuessed(){
    _wordToBeGuessed = await getWordToGuess(WORD_OF_THE_DAY);
}

function getWordToBeGuessed(){
    return _wordToBeGuessed;
}

function setTypedLetter(keyTyped) {
    _typedLetters = _typedLetters + keyTyped;
}

function getTypedLetter(){
    return _typedLetters;
}

// Helper functions
// Disable the input field once a letter has been typed
function disableInputedField(attributeID){
    document.getElementById(attributeID).readOnly = true;
}

function focusNext(form){
    const currInput = document.activeElement;
    const currInputIndex = form.indexOf(currInput);
    if (currInputIndex < form.length - 1){
        const nextinputIndex = (currInputIndex + 1) % form.length;
        const input = form[nextinputIndex];
        input.focus();
    }  
    else{
        // TODO moved to the first element of the next form 
    }
}

// Remove non-alpha characters from the input field
function removeNonLetterCharacters(attributeID){
    document.getElementById(attributeID).value = "";
}

// Validate the user's input and return true if the input is a letter
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

// check if the word typed is a valid 5 letters word
async function postWordGuessed(guessedWord){
    const promise = await fetch(GUESS_RESULT, {
        method: "POST",
        body: JSON.stringify({
            word: guessedWord
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })
    const response = await promise.json();
    const result = response.validWord;
    
    return result;
}

// Verify & confirm if inputed letters are at their correct position
function verifyWord(inputedWord, wordToGuess, form){

    let characterChecked = [];
    for (i=0; i<inputedWord.length; i++){

        let inputedCharacter = inputedWord.charAt(i);
        let inputedCharacterIndex = inputedWord.indexOf(inputedCharacter);
        

        if (wordToGuess.includes(inputedCharacter)){
            let result = isLetterAtCorrectIndex(inputedCharacterIndex, wordToGuess.indexOf(inputedCharacter));
            console.log("The inputedCharacterIndex is " + inputedCharacterIndex + " and the index in wordToGuess is " + wordToGuess.indexOf(inputedCharacter));
            console.log(result);
            if (!characterChecked.includes(inputedCharacter)){
                switch (result){
                    case true:
                        applyCssRule(form[i].id, CORRECT_POSITION);
                        break;
                    case false:
                        applyCssRule(form[i].id, INCORRECT_POSITION);
                        break;
                }
                characterChecked.push(inputedCharacter);
            }
        }
        else {
            applyCssRule(form[i].id, DOES_NOT_EXIST);
        }
        console.log(characterChecked);
    }
    

    function isLetterAtCorrectIndex(inputedLetterIndex, wordToBeGuessedIndex){
        let response = false;
        if (inputedLetterIndex === wordToBeGuessedIndex){
            response = true;
        }
        return response;
    }

    function applyCssRule(elementID, cssClass){
        let element = document.getElementById(elementID);
        element.classList.add(cssClass);
    }
}

init();
