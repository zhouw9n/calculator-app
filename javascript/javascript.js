//== GLOBAL VARIABLES ==//

// Holds the values for internal calculation
let INPUT_LIST = []; 

// Holds the values for display, reflects what the users sees (e.g., shows "%")
let DISPLAY_LIST = [];

// Holds last value entered
let LAST_INPUT = "";

// Holds valid operations
const VALID_OPERATIONS = ["+","-","/","*","."];

// Holds valid keyboard keys
const VALID_KEYS = ["1","2","3","4","5","6","7","8","9","0","+","-","/","*",".","(",")","Enter","Escape","Backspace"];

// Holds value for dark mode 1 = yes, 0 = no
let DARK_MODE = 1;






// Wait for the DOM content to be fully loaded before setting up event listeners
window.addEventListener("DOMContentLoaded", setupKeyboardListener);
window.addEventListener("DOMContentLoaded", setupButtonListener);
window.addEventListener("DOMContentLoaded",setupToggleListner);

// Sets up the click event listener for toggling between dark and light mode
function setupToggleListner() {
    const toggle = document.getElementById("switch");
    toggle.addEventListener("click", () => {
        const body = document.getElementsByTagName("body")[0];

        if (DARK_MODE === 1) {
        body.classList.add("lightmode");
        DARK_MODE = 0;
        setToggleLightMode();
        } 
        else {
        body.classList.remove("lightmode");
        DARK_MODE = 1;
        setToggleDarkMode();
        }
    });
}

// Set theme to light mode
function setToggleLightMode() {
    const toggle = document.getElementById("toggle");
    const icon = document.getElementById("icon");

    toggle.classList.add("lightmode");
    icon.classList.remove("bi-moon-stars-fill");
    icon.classList.add("bi-sun-fill");
}

// Set theme to dark mode
function setToggleDarkMode() {
    const toggle = document.getElementById("toggle");
    const icon = document.getElementById("icon");
    toggle.classList.remove("lightmode");
    icon.classList.remove("bi-sun-fill");
    icon.classList.add("bi-moon-stars-fill");
}

// Set up the keydown event listener to handle keyboard input
function setupKeyboardListener() {
    window.addEventListener("keydown", onKeyDown);
}

// When key is pressed it validates the input before passing the key to the handleInput function
function onKeyDown(event) {
    const key = event.key;
    
    if(VALID_KEYS.includes(key)) {
        handleInput(key);
    }
}

// Set up the click event listener to handle mouse input
function setupButtonListener() {
    const buttons = document.getElementsByTagName("button");

Array.from(buttons).forEach(button => {
    button.addEventListener("click", () => {
        const key = button.innerHTML;
        handleInput(key);
    });
});
}

// Route input to the appropriate calculator function
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
    // Reset list
    INPUT_LIST = [];
    DISPLAY_LIST = [];

    // Cleas results display
    const resultsDisplay = document.getElementById("resultWindow");
    resultsDisplay.innerHTML = "";
    
    // Clear calculation display
    const calculationDisplay = document.getElementById("calculationWindow");
    calculationDisplay.innerHTML ="";

    // Reset last input
    LAST_INPUT = "";
}

function minusOperation() {
    if (!VALID_OPERATIONS.includes(LAST_INPUT)) {
        INPUT_LIST.push("-");
        DISPLAY_LIST.push("-");
        LAST_INPUT = "-";
        updateResultsDisplay();
    }
}

function addOperation() {
    if (!VALID_OPERATIONS.includes(LAST_INPUT) && LAST_INPUT !== "") {
        INPUT_LIST.push("+");
        DISPLAY_LIST.push("+");
        LAST_INPUT = "+";
        updateResultsDisplay();
    }
}

function multiplyOperation() {
    if (!VALID_OPERATIONS.includes(LAST_INPUT) && LAST_INPUT !== "") {
        INPUT_LIST.push("*");
        DISPLAY_LIST.push("*");
        LAST_INPUT = "*";
        updateResultsDisplay();
    }
}

function divisionOperation() {
    if (!VALID_OPERATIONS.includes(LAST_INPUT) && LAST_INPUT !== "") {
        INPUT_LIST.push("/");
        DISPLAY_LIST.push("/");
        LAST_INPUT = "/";
        updateResultsDisplay();
    }
}

function addDecimal() {
    const charList = [];

    // Reconstructs last number from the array to determine if a decimal is already in the number
    for (let i = INPUT_LIST.length-1; i >= 0; i--) {
        // Exits for loop if until operator is determined
        if(VALID_OPERATIONS.includes(INPUT_LIST[i]) && INPUT_LIST[i] !== ".") break;
        let char = INPUT_LIST[i];
        charList.push(char);
    }

    // Joins characters to create last whole number
    const wholeNumber =charList.join("");
    
    // Checks if last number in the array includes a decimal, is an operator, or is empty
    if(!wholeNumber.includes(".") && !VALID_OPERATIONS.includes(LAST_INPUT) && LAST_INPUT !== "") {
        INPUT_LIST.push(".");
        DISPLAY_LIST.push(".");
        LAST_INPUT = ".";
        updateResultsDisplay();
    }
    
}

function percentOperation() {
    let lastNumber = "";
    let baseNumber = "";
    let lastOperator = ""
    let countToRemove = 0;

    // Step 1: Extract the most recent number entered from INPUT_LIST
    // Traverse the array backwards, building the last number digit by digit
    for (let i = INPUT_LIST.length - 1; i >= 0; i--) {
        // Stop if we find an operator (but allow decimal points in the number)
        if (VALID_OPERATIONS.includes(INPUT_LIST[i]) && INPUT_LIST[i] !== ".") break;
        // Add current digit to the start of the last number to piece it together
        lastNumber = INPUT_LIST[i] + lastNumber; 
        // Check last operator
        lastOperator = INPUT_LIST[i-1];
        // Track how many characters we need to remove later
        countToRemove++;
    }

    // Step 2: Extract the base number before the operator (used for + or - percent context to avoid false caluclation)
    for (let i = INPUT_LIST.length - (countToRemove + 2); i >= 0; i--) {
        if (VALID_OPERATIONS.includes(INPUT_LIST[i]) && INPUT_LIST[i] !== ".") break;
        baseNumber = INPUT_LIST[i] + baseNumber;
    }

    // Step 3: Validate the most recent number and base number
    const parsedNumber = parseFloat(lastNumber);
    if (isNaN(parsedNumber)) return;
    const parsedBase = parseFloat(baseNumber);
    if (isNaN(parsedBase)) return;

    // Step 4: Remove the last number from the end of INPUT_LIST so we can insert the percentage form
    INPUT_LIST.splice(INPUT_LIST.length - countToRemove, countToRemove);

    // Step 5: Handle percentage logic baased on context (+- vs */)
    if (lastOperator === "+" || lastOperator === "-") {
        // For + or - convert "base ± percent" into "base ± (base * percent)"
        // e.g. prevents 100-50% becoming 99.5 instead of the correct result 100-(100*0.5)=50
        INPUT_LIST.push("(");
        INPUT_LIST.push(baseNumber);
        INPUT_LIST.push("*");
        INPUT_LIST.push(parsedNumber/100);
        INPUT_LIST.push(")");
        // Update last input
        LAST_INPUT = ")";
    }
    else {
        // For * or / or standalone numbers: just convert to decimal percent (e.g. 50 > 0.5)
        const numberInPercent = parsedNumber / 100;

        // Update last input
        LAST_INPUT = numberInPercent;

        // Updates the array with the percentage result
        INPUT_LIST.push(numberInPercent.toString());
    }

    // Step 6: Update display list and UI
    // For visual display, show to user % sign
    DISPLAY_LIST.push("%"); 
    updateResultsDisplay();
    
}

function addBracket() {
    // Counts numbers of opening and closing brackets
    // Filter function, for each character, which the character equals ( or ) return true
    // Saves it in an array, with .length able to find out amount
    const openBracketCount = INPUT_LIST.filter(char => char === "(").length;
    const closeBracketCount = INPUT_LIST.filter(char => char === ")").length;

    // Condition to set opening bracket
    if((INPUT_LIST.length === 0 && LAST_INPUT !== "(") || (VALID_OPERATIONS.includes(LAST_INPUT) && LAST_INPUT !== "(")) {
        INPUT_LIST.push("(");
        DISPLAY_LIST.push("(");
        LAST_INPUT = "(";
    } 
    // Condition to set closing bracket
    else if (openBracketCount > closeBracketCount && LAST_INPUT !== "(" && !VALID_OPERATIONS.includes(LAST_INPUT)) {
        INPUT_LIST.push(")");
        DISPLAY_LIST.push(")");
        LAST_INPUT = ")";
    }
    updateResultsDisplay();
}

function addNumber(key) {
    INPUT_LIST.push(key);
    DISPLAY_LIST.push(key);
    LAST_INPUT = key;
    updateResultsDisplay();
}

function getResult() {
    // Prevents evaluation if the last input is empty or just a minus sign
    if (LAST_INPUT !== "" && !VALID_OPERATIONS.includes(LAST_INPUT)) {
    const display = document.getElementById("resultWindow");
    const calculation = INPUT_LIST.join("");

    // Check for division by zero (e.g. 1 / 0) using regex
    if (/\/0(\D|$)(?!\d)/.test(calculation)) {
        display.innerHTML = "Error";
        return;
    }

    // Updates the calculation history display with current input
    const expression = DISPLAY_LIST.join("");
    updateCalculationDisplay(expression);

    // Takes the string and handles it as a mathematical calculation
    const result = eval(calculation);

    // Displays teh result on the screen
    display.innerHTML = result;

    // Resets INPUT_LIST and initialize with the result for the next calculation
    INPUT_LIST = [];
    INPUT_LIST.push(result.toString());
    DISPLAY_LIST = [];
    DISPLAY_LIST.push(result.toString());
    LAST_INPUT = result.toString();
    }    
}

// Updates the calculation history display with the full expession that was calculated
function updateCalculationDisplay(calculation) {
    const calculationDisplay = document.getElementById("calculationWindow");
    calculationDisplay.innerHTML = calculation;
}

// Updates the results display with the contents of INPUT_LIST to show all the inputs made or the result
function updateResultsDisplay() {
    const display = document.getElementById("resultWindow");
    display.innerHTML = DISPLAY_LIST.join("");
    // Scrolls to the right after each new injection
    display.scrollLeft = display.scrollWidth;
}





