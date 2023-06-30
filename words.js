const startDate = new Date('2023-06-26'); // Set your desired starting date
const currentDate = new Date(); // Get the current date

// Calculate the time difference in milliseconds
const timeDiff = currentDate.getTime() - startDate.getTime();

// Calculate the number of days elapsed by dividing the time difference by the number of milliseconds in a day
const daysElapsed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));


function populateStorage() {
    localStorage.setItem("firstPlay", currentDate.getTime());
    localStorage.setItem("daysPlayed", 0);
    localStorage.setItem("dailyWins", 0);
};
  



const guesses = document.getElementById("guesses");
const start = document.getElementById("start");
const end = document.getElementById("end");
const buttons = document.getElementsByClassName("calc-btn");
let streakModal = document.getElementById("streak");
let streakText = document.getElementById("streak-text");

let latestVersion = 0.1;
if (localStorage.getItem("version") != latestVersion) {
    localStorage. clear();
    localStorage.setItem("version", latestVersion);
};





window.addEventListener("keydown", function (e) {
    let key = e.key;

    // Check if F5 key is pressed
    if (key === "F5" || key === "F12") {
      // Allow default behavior for F5 key
      return;
    }
    e.preventDefault();

    if (!localStorage.getItem("firstPlay")) {
        populateStorage();
    }; 

    // Check if user has already played today
    if (daysElapsed - localStorage.getItem("latestPlay") == 0) {
        showPopup("You already played today!");
    } else {
        parseKey(e.key);
    };
    
});

let guessIndex = 0;
let guessedWord = "";

function checkGuess(guessedWord, compare) {

    if (guessedWord == words[5]) {

        for (let i = guessIndex-4; i < guessIndex; i++) {
            const child = guesses.children[i];
            shake(child);
        };
        showPopup("You need to use all four lines!");
        return false
    }
    if (word_list[guessedWord.charAt(0).toLowerCase()].includes(guessedWord.toLowerCase())) {
        let diffScore = 0;
        for (let i = 0; i < guessedWord.length; i++) {
            if (compare[i] != guessedWord[i]) {
                diffScore ++;
            }
        }
        if (diffScore != 1) {
            for (let i = guessIndex-4; i < guessIndex; i++) {
                const child = guesses.children[i];
                shake(child);
            };
            showPopup("Just one different letter per line!");
            return false
        }
    } else {   
        for (let i = guessIndex-4; i < guessIndex; i++) {
            const child = guesses.children[i];
            shake(child);
        };     
        showPopup("This word isn't in the list!");
        return false
    }
    return true
}

function getRandomNumber(n) {
    return Math.floor(Math.random() * (n + 1));
}

function shake(element) {
    element.classList.add('btn-wrong');
    setTimeout(function () {
        element.classList.remove('btn-wrong');;
    }, 600);
};

function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.classList.add("show");
    popup.textContent = message;
    navigator.vibrate(200);
    setTimeout(function () {
        popup.classList.remove("show");
    }, 1700);
}




function parseKey(pressedKey) {
    
    pressedKey = pressedKey.toUpperCase()
    if (pressedKey == "ENTER") {
        if (guessIndex % 4 == 0 && guessIndex != 0) {
            if (guessIndex == 16) {
                let msPlayed = currentDate.getTime() - parseInt(localStorage.getItem("firstPlay"));
                let daysPlayed = Math.floor(msPlayed / (1000 * 60 * 60 * 24))
                localStorage.setItem("daysPlayed", daysPlayed+1);
                if (checkGuess(guessedWord, words[5])) {
                    if (guessIndex == 16) {
                        let buttonsStorage = [];
                        for (element of buttons) {
                            buttonsStorage.push(element.textContent);
                            element.classList.add('btn-victory');
                        };
                        localStorage.setItem("buttonsStorage", buttonsStorage);
                        showPopup("You won!");
                        localStorage.setItem("dailyWins", parseInt(localStorage.getItem("dailyWins"))+1);
                        localStorage.setItem("latestPlay", daysElapsed);
                        streakText.textContent = `You have played for ${localStorage.getItem("daysPlayed")} days, winning ${localStorage.getItem("dailyWins")} out of them.`;
                        streakModal.showModal();
                    };
                } else {
                    if (word_list[guessedWord.charAt(0).toLowerCase()].includes(guessedWord.toLowerCase())) {
                        showPopup("You lost!");
                        localStorage.setItem("latestPlay", daysElapsed);
                    };
                };
            } else if (checkGuess(guessedWord, words[guessIndex/4-1])) {
                words[guessIndex/4] = guessedWord; 
                guessedWord = "";
                for (let i = guessIndex-4; i < guessIndex; i++) {
                    const child = guesses.children[i];
                    child.classList.add('btn-accepted');
                }
            };
        };
        

    } else if (pressedKey == "BACKSPACE") {
        if (guessIndex > 0) {
            if (guessIndex % 4 == 0) {
                for (let i = guessIndex-4; i < guessIndex; i++) {
                    const child = guesses.children[i];
                    child.classList.remove('btn-accepted');
                }
            }
            guessIndex--;
            guesses.children.item(guessIndex).textContent = "";
        }
        guessedWord = guessedWord.slice(0, -1); 
    } else if (keyLayout.includes(pressedKey)) {
        if (guessIndex % 4 == 0 && guessIndex != 0 && guessedWord != "") {
            return
        };
        
        guesses.children.item(guessIndex).textContent = pressedKey;
        guessIndex++;
        guessedWord += pressedKey;
    }

}

for (let i = 0; i<16; i++) {
    let cell = document.createElement("div");
    cell.className = "calc-btn";
    guesses.appendChild(cell);
}


let combinationIndex = daysElapsed;
//let combinationIndex = getRandomNumber(combinations.length-1);


let words = [combinations[combinationIndex][0].toUpperCase(), "", "", "", "", combinations[combinationIndex][1].toUpperCase()];
let startWord = words[0];
let endWord = words[5];

for (let letter of startWord) {
    let cell = document.createElement("div");
    cell.className = "calc-btn";
    cell.textContent = letter;
    start.appendChild(cell);
}

for (let letter of endWord) {
    let cell = document.createElement("div");
    cell.className = "calc-btn";
    cell.textContent = letter;
    end.appendChild(cell);
}


const keyboard = document.getElementById("keyboard");



const keyLayout = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "BACKSPACE", "Z", "X", "C", "V", "B", "N", "M", "ENTER"
];

for (let keyName of keyLayout) {
    let cell = document.createElement("div");
    cell.className = "key-btn";
    switch (keyName) {
        case "BACKSPACE":
            cell.innerHTML = `<i class="material-icons-outlined">backspace</i>`;
            break;
        case "ENTER":
            cell.innerHTML = `<i class="material-icons-outlined">check_circle</i>`;
            break;
        default:
            cell.textContent = keyName;
            break;
    };
    cell.addEventListener("click", function() {
        let keyInput = this.textContent;
        if (keyInput == "check_circle") {
            keyInput = "ENTER";
        }
        parseKey(keyInput);
    });
    keyboard.appendChild(cell);
}

let buttonsStored = localStorage.getItem("buttonsStorage").split(",");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].textContent = buttonsStored[i];
    buttons[i].classList.add('btn-greyed');
};
