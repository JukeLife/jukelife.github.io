const testFunctionLogElementA = document.getElementById('testFunctionLogA');
const testFunctionLogElementB = document.getElementById('testFunctionLogB');
const testFunctionLogElementC = document.getElementById('testFunctionLogC');

const paddingZero = (val, digit) => String(val).padStart(digit, '0');

function testFunctionA() {
    for (let i = 1; i <= 10; i++) {
        const res = heavyFunction(i);

        pushLog(testFunctionLogElementA, `ステップ${paddingZero(i, 2)} … 合計${res}回の計算を行いました。`);
    }
}

function testFunctionB(i = 1) {
    if (i <= 10) {
        setTimeout(() => {
            const res = heavyFunction(i);

            pushLog(testFunctionLogElementB, `ステップ${paddingZero(i, 2)} … 合計${res}回の計算を行いました。`);

            testFunctionB(++i);
        }, 0);
    }
}

function heavyFunction(val) {
    const calcCollatzProblem = (val) => {
        if (val < 1) return undefined;

        let n = val;
        // let res = [];
        let count = 0;

        while (n !== 1) {
            if (n % 2 === 0) {
                n /= 2;
            } else {
                n = 3 * n + 1;
            }

            // res.push(n);

            count++;
        }

        return {
            val: val,
            // res: res,
            count: count,
        };
    };

    const increment = 100000;

    let res = 0;

    for (let i = val * increment; i < (val + 1) * increment; i++) res += calcCollatzProblem(i).count;

    return res;
}

function pushLog(element, text) {
    const getTimestampString = (date) =>
        [paddingZero(date.getFullYear(), 4), paddingZero(date.getMonth() + 1, 2), paddingZero(date.getDate(), 2)].join('.') +
        '-' +
        [paddingZero(date.getHours(), 2), paddingZero(date.getMinutes(), 2), paddingZero(date.getSeconds(), 2)].join(':');

    const log = `[${getTimestampString(new Date())}] ${text}\n`;

    console.log(log);

    element.innerHTML += log;

    element.scrollTo(0, element.scrollHeight);
}
