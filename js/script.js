document.addEventListener('DOMContentLoaded', () => {
    (() => {
        const buttonList = [
            { className: 'operators', innerText: '+' },
            { className: 'operators', innerText: '-' },
            { className: 'operators', innerText: '*' },
            { className: 'operators', innerText: '/' },
            { className: 'numbers', innerText: 7 },
            { className: 'numbers', innerText: 8 },
            { className: 'numbers', innerText: 9 },
            { className: 'result', innerText: '=' },
            { className: 'numbers', innerText: 4 },
            { className: 'numbers', innerText: 5 },
            { className: 'numbers', innerText: 6 },
            { className: 'numbers', innerText: 1 },
            { className: 'numbers', innerText: 2 },
            { className: 'numbers', innerText: 3 },
            { className: 'numbers', innerText: 0 },
            { className: 'decimal', innerText: '.' },
            { className: 'reset', innerText: 'AC' }
        ];
    
        buttonList.forEach(button => {
            const { className, innerText } = button;
            const buttons = document.querySelector('.buttons');
            const buttonElement = document.createElement('button');
            buttonElement.className = className;
            buttonElement.innerText = innerText;
            buttonElement.onclick = event => handleClick(event);
            buttons.appendChild(buttonElement);
        });
    })();

    const properties = { firstValue: '0', operator: '', secondValue: '' };

    const setProperty = (property, value) => properties[property] = value;

    const isNaNFirstValue = str => /[=*+/-]/.test(str) ? null : fullResetValues(str === 'AC' ? '0' : str === '.' ? '0.' : str );

    const setAllProperties = (customFirstValue) => {
        setProperty('firstValue', customFirstValue);
        setProperty('operator', '');
        setProperty('secondValue', '');
    }

    const partialResetValues = customFirstValue => {
        setProperty('firstValue', customFirstValue);
        setProperty('operator', '');
    }

    const fullResetValues = customFirstValue => {
        const { firstValue, operator, secondValue } = properties;
        (firstValue !== customFirstValue || operator !== '' || secondValue !== '') && setAllProperties(customFirstValue);
    }

    const equals = customOperator => {
        const { firstValue, operator, secondValue } = properties;
        const first = Number(firstValue);
        const action = operator;
        const second = Number(secondValue);
        setProperty('operator', customOperator);
        setProperty('secondValue', '');
        switch (action) {
            case '+':
                return setProperty('firstValue', (first + second).toString());
            case '-':
                return setProperty('firstValue', (first - second).toString());
            case '*':
                return setProperty('firstValue', (first * second).toString());
            case '/':
                return setProperty('firstValue', second === 0 ? 'Divided by zero' : (first / second).toString());
            default:
                return;
        }
    }

    const setValueAndButtonList = (value, buttons) => {
        const { firstValue, operator, secondValue } = properties;
        value.innerText = secondValue.length ? secondValue : firstValue;
        buttons.childNodes.forEach(button => {
            const { classList, innerText } = button;
            button.className = `${ classList[0] }${ operator === innerText && operator.length ? ' selected' : '' }`;
        });
    }

    const doActionButton = (str, firstValue, operator, secondValue) => {
        const regexDot = /[.]/;
        const regexOperators = /[*+/-]/;
        switch (str) {
            case '=':
                return secondValue.length && equals('=');
            case 'AC':
                return fullResetValues('0');
            case '+':
            case '-':
            case '*':
            case '/':
                return secondValue.length ? equals(str) : setProperty('operator', str);
            case '.':
                return secondValue.length ? !regexDot.test(secondValue) && setProperty('secondValue', secondValue.concat(str)) :
                    regexOperators.test(operator) ? setProperty('secondValue', '0.') :
                    operator === '=' ? partialResetValues('0.') :
                    !regexDot.test(firstValue) && setProperty('firstValue', firstValue.concat(str));
            default:
                return regexOperators.test(operator) ? setProperty('secondValue', secondValue === '0' ? str : secondValue.concat(str)) :
                    partialResetValues(firstValue === '0' || operator === '=' ? str : firstValue.concat(str));
        }
    }

    const handleClick = event => {
        const { path, target } = event;
        const { children } = path[2];
        const [value, buttons] = children;
        const { innerText: str } = target;
        const { firstValue, operator, secondValue } = properties;
        isNaN(firstValue) ? isNaNFirstValue(str) : doActionButton(str, firstValue, operator, secondValue);
        setValueAndButtonList(value, buttons);
    };
});