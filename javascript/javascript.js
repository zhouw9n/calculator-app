//Holds the values entered to show on the display
let inputList = []; 

//Holds last value entered
let lastInput = "";

//Holds valid operations
const validOperations = ["+","-","/","*","."];

//Holds valid keyboard keys
const validKeys = ["1","2","3","4","5","6","7","8","9","0","+","-","/","*",".","(",")","Enter","Escape","Backspace"];

//Holds value for dark mode 1 = yes, 0 = no
let darkMode = 1;

// Sets up the click event listener for toggling between dark and light mode
function setupToogleListner() {
    const toggle = document.getElementById("switch");
    toggle.addEventListener("click", () => {
        const body = document.getElementsByTagName("body")[0];

        if (darkMode === 1) {
        body.classList.add("lightmode");
        darkMode = 0;
        setToggleLightMode();
        } 
        else {
        body.classList.remove("lightmode");
        darkMode = 1;
        setToggleDarkMode();
        }
    });
}




function setToggleLightMode() {
    const toggle = document.getElementById("toggle");
    const icon = document.getElementById("icon");

    toggle.classList.add("lightmode");
    icon.classList.remove("bi-moon-stars-fill");
    icon.classList.add("bi-sun-fill");
}

function setToggleDarkMode() {
    const toggle = document.getElementById("toggle");
    const icon = document.getElementById("icon");
    toggle.classList.remove("lightmode");
    icon.classList.remove("bi-sun-fill");
    icon.classList.add("bi-moon-stars-fill");
}

// Wait for the DOM content to be fully loaded before setting up event listeners
window.addEventListener("DOMContentLoaded", setupKeyboardListener);
window.addEventListener("DOMContentLoaded", setupButtonListener);
window.addEventListener("DOMContentLoaded",setupToogleListner);

// Sets up the keydown event listener to handle keyboard input
function setupKeyboardListener() {
    window.addEventListener("keydown", onKeyDown);
}

// When key is pressed it validates the input before passing the key to the handleInput function
function onKeyDown(event) {
    const key = event.key;
    
    if(validKeys.includes(key)) {
        handleInput(key);
    }
}

// Sets up the click event listener to handle mouse input
function setupButtonListener() {
    const buttons = document.getElementsByTagName("button");

Array.from(buttons).forEach(button => {
    button.addEventListener("click", () => {
        const key = button.innerHTML;
        handleInput(key);
    });
});
}

//Routes input to the appropriate calculator function
function handleInput(key) {
    switch (key) {
        case "C":
        case "Backspace":
        case "Escape":
            clearCalculator();
            break;
        case "( )":
        case "(":
        case ")":
            addBracket();
            break;
        case "%":
            percentOperation();
            break;
        case "/":
            divisionOperation();
            break;
        case "x":
        case "*":
            multiplyOperation();
            break;
        case "-":
            minusOperation();
            break;
        case "+":
            addOperation();
            break;
        case "=":
        case "Enter":
            getResult();
            break;
        case ".":
            addDecimal()
            break;
        default:
            addNumber(key);
    }
}

function clearCalculator() {
    //Resets list
    inputList = [];

    //Clears results display
    const resultsDisplay = document.getElementById("resultWindow");
    resultsDisplay.innerHTML = "";
    
    //Clears calculation display
    const calculationDisplay = document.getElementById("calculationWindow");
    calculationDisplay.innerHTML ="";

    //Resets last input
    lastInput = "";
}

function minusOperation() {
    if (!validOperations.includes(lastInput)) {
        inputList.push("-");
        lastInput = "-";
        updateResultsDisplay();
    }
}

function addOperation() {
    if (!validOperations.includes(lastInput) && lastInput !== "") {
        inputList.push("+");
        lastInput = "+";
        updateResultsDisplay();
    }
}

function multiplyOperation() {
    if (!validOperations.includes(lastInput) && lastInput !== "") {
        inputList.push("*");
        lastInput = "*";
        updateResultsDisplay();
    }
}

function divisionOperation() {
    if (!validOperations.includes(lastInput) && lastInput !== "") {
        inputList.push("/");
        lastInput = "/";
        updateResultsDisplay();
    }
}

function addDecimal() {
    const charList = [];
    //Reconstructs last number from the array to determine if a decimal is already in the number
    for (let i = inputList.length-1; i >= 0; i--) {
        //Exits for loop if until operator is determined
        if(validOperations.includes(inputList[i]) && inputList[i] !== ".") break;
        let char = inputList[i];
        charList.push(char);
    }
    //Joins characters to create last whole number
    const wholeNumber =charList.join("");
    
    //Checks if last number in the array includes a decimal, is an operator, or is empty
    if(!wholeNumber.includes(".") && !validOperations.includes(lastInput) && lastInput !== "") {
        inputList.push(".");
        lastInput = ".";
        updateResultsDisplay();
    }
    
}

function percentOperation() {
    let lastNumber = "";
    let countToRemove = 0;

    // Reconstructs the last number from the array
    for (let i = inputList.length - 1; i >= 0; i--) {
        // Breaks loop if it detects a valid operation (except ".")
        if (validOperations.includes(inputList[i]) && inputList[i] !== ".") break;
        lastNumber = inputList[i] + lastNumber;
        countToRemove++;
    }

    // Check if lastNumber is empty or not a valid number
    const parsedNumber = parseFloat(lastNumber);
    if (isNaN(parsedNumber)) return;

    // Converts last number to percent by dividing by 100
    const numberInPercent = parsedNumber / 100;

    // Updates last input
    lastInput = numberInPercent;

    // Deletes the amount of entries in the list depending on the size of the number
    inputList.splice(inputList.length - countToRemove, countToRemove);

    // Updates the array with the percentage result
    inputList.push(numberInPercent.toString());

    updateResultsDisplay();
}

function addBracket() {
    //Counts numbers of opening and closing brackets
    //Filter function, for each character, which the character equals ( or ) return true
    //Saves it in an array, with .length able to find out amount
    const openBracketCount = inputList.filter(char => char === "(").length;
    const closeBracketCount = inputList.filter(char => char === ")").length;

    //Condition to set opening bracket
    if(inputList.length === 0 || validOperations.includes(lastInput) || lastInput === "(") {
        inputList.push("(");
        lastInput = "(";
    } 
    //Condition to set closing bracket
    else if (openBracketCount > closeBracketCount && lastInput !== "(" && !validOperations.includes(lastInput)) {
        inputList.push(")");
        lastInput = ")";
    }
    updateResultsDisplay();
}

function addNumber(key) {
    inputList.push(key);
    lastInput = key;
    updateResultsDisplay();
}

function getResult() {
    //Prevents evaluation if the last input is empty or just a minus sign
    if (lastInput !== "" && !validOperations.includes(lastInput)) {
    const display = document.getElementById("resultWindow");
    const calculation = display.innerHTML;

    //Updates the calculation history display with current input
    updateCalculationDisplay(calculation)

    //Takes the string and handles it as a mathematical calculation
    const result = eval(calculation);

    //Displays teh result on the screen
    display.innerHTML = result;

    //Resets inputList and initialize with the result for the next calculation
    inputList = [];
    inputList.push(result.toString());
    lastInput = result.toString();
    }    
}

//Updates the calculation history display with the full expession that was calculated
function updateCalculationDisplay(calculation) {
    const calculationDisplay = document.getElementById("calculationWindow");
    calculationDisplay.innerHTML = calculation;
}

//Updates the results display with the contents of inputList to show all the inputs made or the result
function updateResultsDisplay() {
    const display = document.getElementById("resultWindow");
    display.innerHTML = inputList.join("");
    // Scrolls to the right after each new injection
    display.scrollLeft = display.scrollWidth;
}





