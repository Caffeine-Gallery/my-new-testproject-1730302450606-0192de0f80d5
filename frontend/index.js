import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let currentValue = '';
let operator = '';
let waitingForSecondOperand = false;

function showLoading() {
    document.getElementById('loading').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('loading').classList.add('d-none');
}

window.appendToDisplay = function(value) {
    if (waitingForSecondOperand) {
        display.value = value;
        waitingForSecondOperand = false;
    } else {
        display.value += value;
    }
    currentValue = display.value;
};

window.setOperation = function(op) {
    if (currentValue !== '') {
        operator = op;
        waitingForSecondOperand = true;
    }
};

window.clearDisplay = function() {
    display.value = '';
    currentValue = '';
    operator = '';
    waitingForSecondOperand = false;
};

window.calculate = async function() {
    if (currentValue !== '' && operator !== '') {
        const secondOperand = parseFloat(display.value);
        const firstOperand = parseFloat(currentValue);
        let result;

        showLoading();

        try {
            switch (operator) {
                case '+':
                    result = await backend.add(firstOperand, secondOperand);
                    break;
                case '-':
                    result = await backend.subtract(firstOperand, secondOperand);
                    break;
                case '*':
                    result = await backend.multiply(firstOperand, secondOperand);
                    break;
                case '/':
                    const divisionResult = await backend.divide(firstOperand, secondOperand);
                    if (divisionResult === null) {
                        display.value = 'Error: Division by zero';
                        hideLoading();
                        return;
                    }
                    result = divisionResult;
                    break;
            }

            display.value = result.toString();
            currentValue = result.toString();
            operator = '';
        } catch (error) {
            console.error('Error during calculation:', error);
            display.value = 'Error';
        } finally {
            hideLoading();
        }
    }
};
