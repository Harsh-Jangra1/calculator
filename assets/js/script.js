const currentOperandElement = document.querySelector('.current-operand');
const previousOperandElement = document.querySelector('.previous-operand');
const buttons = document.querySelector('.buttons');

const state = {
    current: '0',
    previous: '',
    operation: null,
    shouldResetCurrent: false,
};

const operatorSymbols = {
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷',
    '%': '%',
};

function formatResult(value) {
    if (!Number.isFinite(value)) {
        return 'Error';
    }

    const normalized = Number.parseFloat(value.toFixed(12));

    return String(normalized);
}

function render() {
    currentOperandElement.textContent = state.current;

    if (!state.previous || !state.operation) {
        previousOperandElement.textContent = '';
        return;
    }

    previousOperandElement.textContent = `${state.previous} ${operatorSymbols[state.operation] ?? state.operation}`;
}

function appendNumber(number) {
    if (state.current === 'Error') {
        clearAll();
    }

    if (state.shouldResetCurrent) {
        state.current = number === '.' ? '0' : '';
        state.shouldResetCurrent = false;
    }

    if (number === '.' && state.current.includes('.')) {
        return;
    }

    if (state.current === '0' && number !== '.') {
        state.current = number;
    } else {
        state.current += number;
    }

    render();
}

function chooseOperation(operation) {
    if (state.current === 'Error' || state.current === '') {
        return;
    }

    if (state.previous && state.operation && !state.shouldResetCurrent) {
        compute();

        if (state.current === 'Error') {
            return;
        }
    }

    state.previous = state.current;
    state.operation = operation;
    state.shouldResetCurrent = true;
    render();
}

function compute() {
    if (!state.operation || state.previous === '' || state.current === '') {
        return;
    }

    const previousValue = Number(state.previous);
    const currentValue = Number(state.current);

    let result;

    switch (state.operation) {
        case '+':
            result = previousValue + currentValue;
            break;
        case '-':
            result = previousValue - currentValue;
            break;
        case '*':
            result = previousValue * currentValue;
            break;
        case '/':
            result = currentValue === 0 ? Number.NaN : previousValue / currentValue;
            break;
        case '%':
            result = currentValue === 0 ? Number.NaN : previousValue % currentValue;
            break;
        default:
            return;
    }

    state.current = formatResult(result);
    state.previous = '';
    state.operation = null;
    state.shouldResetCurrent = true;
    render();
}

function clearAll() {
    state.current = '0';
    state.previous = '';
    state.operation = null;
    state.shouldResetCurrent = false;
    render();
}

function deleteLastDigit() {
    if (state.current === 'Error') {
        clearAll();
        return;
    }

    if (state.shouldResetCurrent) {
        state.current = '0';
        state.shouldResetCurrent = false;
        render();
        return;
    }

    state.current = state.current.length > 1 ? state.current.slice(0, -1) : '0';
    render();
}

buttons.addEventListener('click', (event) => {
    const button = event.target.closest('button');

    if (!button) {
        return;
    }

    if (button.dataset.number) {
        appendNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperation(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case 'clear':
            clearAll();
            break;
        case 'delete':
            deleteLastDigit();
            break;
        case 'calculate':
            compute();
            break;
        default:
            break;
    }
});

document.addEventListener('keydown', (event) => {
    const { key } = event;

    if (/^[0-9]$/.test(key) || key === '.') {
        appendNumber(key);
        return;
    }

    if (['+', '-', '*', '/', '%'].includes(key)) {
        chooseOperation(key);
        return;
    }

    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        compute();
        return;
    }

    if (key === 'Backspace') {
        deleteLastDigit();
        return;
    }

    if (key === 'Escape' || key === 'Delete') {
        clearAll();
    }
});

render();
