const inputSlider = document.querySelector(".slider");
const passwordLengthNumber = document.querySelector("#passwordLengthNumber");
const passwordDisplay = document.querySelector("#passwordDisplay");
const dataCopy = document.querySelector(".dataCopy");
const copyMsg = document.querySelector("#copyMsg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const strengthIndicator = document.querySelector(".strengthColor");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const generatePassword = document.querySelector(".generatePassword");
const symbols =' `~`!@#$%^&*()_-+=[{}]|\'";:.>,</?*';
const resetBtn = document.querySelector(".reset");

//initially
let password = ""; 
let passwordLengthDisplay = 10 ;
let checkCount = 0;
sliderEffect();

//set  passwordLengthNumber
function sliderEffect() {
    inputSlider.value = passwordLengthDisplay;
    passwordLengthNumber.innerText = passwordLengthDisplay;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLengthDisplay - min)*100/(max - min)) + "%  100%"
}

function setIndicator(color){
    strengthIndicator.style.backgroundColor = color ;
    strengthIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min , max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123))
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91))
}

function generateSymbol(){
    const randomNumber = getRandomInteger(0 , symbols.length);
    return symbols.charAt(randomNumber);

}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLengthDisplay >= 8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLengthDisplay >= 6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyPassword() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make copy wala text visible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
    
}

inputSlider.addEventListener('input', (e) => {
    passwordLengthDisplay = e.target.value;
    sliderEffect();
});

dataCopy.addEventListener('click' , () => {
    if(passwordDisplay.value){
        copyPassword();
    }
})

function shufflePassword(array){
    for (let i = array.length - 1 ; i > 0 ; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++ ;
        }
    });

    //special Conditioon
    if(passwordLengthDisplay < checkCount){
        passwordLengthDisplay = checkCount;
        sliderEffect();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

generatePassword.addEventListener('click', () => {
    // none of the checkbox is checked
    if(checkCount <= 0) return ;

    if(passwordLengthDisplay < checkCount){
        passwordLengthDisplay = checkCount;
        sliderEffect();
    }

    // lets find new password
    password = "";
    //lets puts the stuff mentioned by checkbox
//     if(uppercaseCheck.checked){
//         password += generateUpperCase();
//     }
//     if(lowercaseCheck.checked){
//         password += generateLowerCase();
//     }
//     if(numberCheck.checked){
//         password += generateRandomNumber();
//     }
//     if(symbolCheck.checked){
//         password += generateSymbol();
//     }

// 

let funcArr = [];

if(uppercaseCheck.checked){
    funcArr.push(generateUpperCase);
}
if(lowercaseCheck.checked){
    funcArr.push(generateLowerCase);
}
if(numberCheck.checked){
    funcArr.push(generateRandomNumber);
}
if(symbolCheck.checked){
    funcArr.push(generateSymbol);
}

 // compulsary addition
 for (let i=0 ; i<funcArr.length; i++){
    password += funcArr[i]();
 }
  // remaining addition
  for(let i=0 ; i<passwordLengthDisplay-funcArr.length ; i++){
    let randomIndex = getRandomInteger(0 , funcArr.length);
    password += funcArr[randomIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  //show in ui
  passwordDisplay.value = password;
  //calculate strength
  calculateStrength();



});

function resetButton(){
    // document.getElementById("passwordDisplay").value='';
    window.location.reload();
}