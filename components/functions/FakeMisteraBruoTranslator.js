// Need "Kuromoji" Library!
// Need "Xorshift128" Function!

const dict = '/components/plugins/Kuromoji/dict';

function FakeMisteraBruoTranslator() {
    const tableSymbolToCharA = [
        { in: 'A1', out: '' },
        { in: 'A2', out: '' },
        { in: 'A3', out: '' },
        { in: 'A4', out: '' },
        { in: 'A5', out: '' },
        { in: 'V1', out: '' },
        { in: 'V2', out: '' },
        { in: 'V3', out: '' },
        { in: 'V4', out: '' },
        { in: 'V5', out: '' },
        { in: 'X1', out: '' },
        { in: 'X2', out: '' },
        { in: 'X3', out: '' },
        { in: 'K1', out: '' },
        { in: 'K2', out: '' },
        { in: 'K3', out: '' },
        { in: 'D1', out: '' },
        { in: 'D2', out: '' },
        { in: 'D3', out: '' },
        { in: 'E1', out: '' },
        { in: 'E2', out: '' },
        { in: 'E3', out: '' },
        { in: 'E4', out: '' },
        { in: 'E5', out: '' },
        { in: 'E6', out: '' },
        { in: 'Y1', out: '' },
        { in: 'Y2', out: '' },
        { in: 'Y3', out: '' },
        { in: 'Y4', out: '' },
        { in: 'N1', out: '' },
        { in: 'R1', out: '' },
        { in: 'R2', out: '' },
        { in: 'R3', out: '' },
        { in: 'R4', out: '' },
        { in: 'R5', out: '' },
        { in: 'R6', out: '' },
        { in: 'R7', out: '' },
        { in: 'R8', out: '' },
        { in: 'R9', out: '' },
        { in: 'R10', out: '' },
        { in: 'R11', out: '' },
        { in: 'R12', out: '' },
        { in: 'S1', out: '' },
        { in: 'S2', out: '' },
        { in: 'S3', out: '' },
        { in: 'S4', out: '' },
        { in: 'S5', out: '' },
    ];

    const tableSymbolToCharB = [
        { in: 'A1', out: 'A' },
        { in: 'A2', out: 'B' },
        { in: 'A3', out: 'C' },
        { in: 'A4', out: 'D' },
        { in: 'A5', out: 'E' },
        { in: 'V1', out: 'F' },
        { in: 'V2', out: 'G' },
        { in: 'V3', out: 'H' },
        { in: 'V4', out: 'I' },
        { in: 'V5', out: 'J' },
        { in: 'X1', out: 'K' },
        { in: 'X2', out: 'L' },
        { in: 'X3', out: 'M' },
        { in: 'K1', out: 'N' },
        { in: 'K2', out: 'O' },
        { in: 'K3', out: 'P' },
        { in: 'D1', out: 'Q' },
        { in: 'D2', out: 'R' },
        { in: 'D3', out: 'S' },
        { in: 'E1', out: 'T' },
        { in: 'E2', out: 'U' },
        { in: 'E3', out: 'V' },
        { in: 'E4', out: 'W' },
        { in: 'E5', out: 'X' },
        { in: 'E6', out: 'Y' },
        { in: 'Y1', out: 'Z' },
        { in: 'Y2', out: '[' },
        { in: 'Y3', out: '\\' },
        { in: 'Y4', out: ']' },
        { in: 'N1', out: '0' },
        { in: 'R1', out: '1' },
        { in: 'R2', out: '2' },
        { in: 'R3', out: '3' },
        { in: 'R4', out: '4' },
        { in: 'R5', out: '5' },
        { in: 'R6', out: '6' },
        { in: 'R7', out: '7' },
        { in: 'R8', out: '8' },
        { in: 'R9', out: '9' },
        { in: 'R10', out: ':' },
        { in: 'R11', out: ';' },
        { in: 'R12', out: '<' },
        { in: 'S1', out: '!' },
        { in: 'S2', out: '"' },
        { in: 'S3', out: '#' },
        { in: 'S4', out: '$' },
        { in: 'S5', out: '%' },
    ];

    const tableSymbolToPronA = [
        { in: 'A1', out: 'i' },
        { in: 'A2', out: 'is' },
        { in: 'A3', out: 'if' },
        { in: 'A4', out: 'im' },
        { in: 'A5', out: 'il' },
        { in: 'V1', out: 'wu' },
        { in: 'V2', out: 'wuz' },
        { in: 'V3', out: 'wuf' },
        { in: 'V4', out: 'wun' },
        { in: 'V5', out: 'wul' },
        { in: 'X1', out: 'ao' },
        { in: 'X2', out: 'am' },
        { in: 'X3', out: 'al' },
        { in: 'K1', out: 'ro' },
        { in: 'K2', out: 'raw' },
        { in: 'K3', out: 'raf' },
        { in: 'D1', out: 'do' },
        { in: 'D2', out: 'daw' },
        { in: 'D3', out: 'daf' },
        { in: 'E1', out: 'sui' },
        { in: 'E2', out: 'suw' },
        { in: 'E3', out: 'sai' },
        { in: 'E4', out: 'saw' },
        { in: 'E5', out: 'so' },
        { in: 'E6', out: 'sya' },
        { in: 'Y1', out: 'ga' },
        { in: 'Y2', out: 'gan' },
        { in: 'Y3', out: 'bo' },
        { in: 'Y4', out: 'bon' },
        { in: 'N1', out: 'ran' },
        { in: 'R1', out: 'sen' },
        { in: 'R2', out: 'pel' },
        { in: 'R3', out: 'tef' },
        { in: 'R4', out: 'sun' },
        { in: 'R5', out: 'pul' },
        { in: 'R6', out: 'tuf' },
        { in: 'R7', out: 'ent' },
        { in: 'R8', out: 'eng' },
        { in: 'R9', out: 'rem' },
        { in: 'R10', out: 'rum' },
        { in: 'R11', out: 'yan' },
        { in: 'R12', out: 'kan' },
        { in: 'S1', out: ':' },
        { in: 'S2', out: '|' },
        { in: 'S3', out: '[' },
        { in: 'S4', out: ']' },
        { in: 'S5', out: '.' },
    ];

    const tableSymbolToPronB = [
        { in: 'A1', out: 'イ' },
        { in: 'A2', out: 'イス' },
        { in: 'A3', out: 'イフ' },
        { in: 'A4', out: 'イム' },
        { in: 'A5', out: 'イル' },
        { in: 'V1', out: 'ウ' },
        { in: 'V2', out: 'ウズ' },
        { in: 'V3', out: 'ウフ' },
        { in: 'V4', out: 'ウン' },
        { in: 'V5', out: 'ウル' },
        { in: 'X1', out: 'アオ' },
        { in: 'X2', out: 'アム' },
        { in: 'X3', out: 'アル' },
        { in: 'K1', out: 'ロ' },
        { in: 'K2', out: 'ラー' },
        { in: 'K3', out: 'ラフ' },
        { in: 'D1', out: 'ド' },
        { in: 'D2', out: 'ダー' },
        { in: 'D3', out: 'ダフ' },
        { in: 'E1', out: 'スイ' },
        { in: 'E2', out: 'スウ' },
        { in: 'E3', out: 'サイ' },
        { in: 'E4', out: 'ソウ' },
        { in: 'E5', out: 'ソ' },
        { in: 'E6', out: 'シャ' },
        { in: 'Y1', out: 'ガ' },
        { in: 'Y2', out: 'ガン' },
        { in: 'Y3', out: 'ボ' },
        { in: 'Y4', out: 'ボン' },
        { in: 'N1', out: 'ラン' },
        { in: 'R1', out: 'セン' },
        { in: 'R2', out: 'ペル' },
        { in: 'R3', out: 'テフ' },
        { in: 'R4', out: 'スン' },
        { in: 'R5', out: 'プル' },
        { in: 'R6', out: 'トフ' },
        { in: 'R7', out: 'エント' },
        { in: 'R8', out: 'エング' },
        { in: 'R9', out: 'レム' },
        { in: 'R10', out: 'ルム' },
        { in: 'R11', out: 'ヤン' },
        { in: 'R12', out: 'カン' },
        { in: 'S1', out: '：' },
        { in: 'S2', out: '｜' },
        { in: 'S3', out: '「' },
        { in: 'S4', out: '」' },
        { in: 'S5', out: '。' },
    ];

    this.translateJapaneseToFakeMisteraBruo = async (textArray) => {
        const convertTokensToMisteraBruoText = (tokens) => {
            let res = [];

            const convertTokenToMisteraBruoText = (token) => {
                const xorshift = new Xorshift128();

                const fixValueRange = (val, mode, min, max) => {
                    // mode = 0 = 00: Limit Min & Max Number
                    // mode = 1 = 01: Limit Only Min Number
                    // mode = 2 = 10: Limit Only Max Number

                    if (mode < 0 || mode > 2) mode = 0;
                    if (min > max) max = min;

                    if (val < min && (mode === 0 || mode === 1)) {
                        return min;
                    } else if (val > max && (mode === 0 || mode === 2)) {
                        return max;
                    } else {
                        return val;
                    }
                };

                const returnObject = (text, flag) => ({
                    text: text,
                    flag: flag,
                });

                const rec = token.reading || token.surface_form;

                if (rec) {
                    if (token.pos === '記号') {
                        switch (token.pos_detail_1) {
                            case '括弧開':
                                return returnObject(tableSymbolToCharA.find((item) => item.in === 'S3').out, 'SIG');
                            case '括弧閉':
                                return returnObject(tableSymbolToCharA.find((item) => item.in === 'S4').out, 'SIG');
                            case '読点':
                            case '句点':
                                return returnObject(tableSymbolToCharA.find((item) => item.in === 'S5').out, 'SIG');
                        }
                    }

                    if (token.pos === '名詞' && token.pos_detail_1 === '数') {
                        return returnObject(
                            '' +
                                parseInt(token.surface_form, 10)
                                    .toString(12)
                                    .split('')
                                    .map((number) => String.fromCodePoint(0xe01d + '0123456789ab'.indexOf(number)))
                                    .join(''),
                            'NUM'
                        );
                    }

                    if (rec === '\n') returnObject(rec, 'IDT');

                    if (!rec.match(/[ァ-ヺ]/g)) return returnObject(rec, 'RAW');

                    const isNoun = token.pos === '名詞';
                    const isVerb = token.pos === '動詞';
                    const isJoinText = token.pos === '助動詞' || (token.pos === '助詞' && (token.pos_detail_1 === '係助詞' || token.pos_detail_1 === '格助詞'));

                    xorshift.setSeed(token.surface_form.split('').reduce((prev, char) => prev * char.codePointAt(0), 1));
                    xorshift.setOutputRange(0, 2);

                    const textLength = isNoun || isVerb ? fixValueRange(token.surface_form.length + xorshift.getNumber(), 1, 1, 0) : token.surface_form.length;

                    xorshift.setOutputRange(0, tableSymbolToCharA.length - 18 - 1);

                    const res = [...Array(textLength)].map(() => tableSymbolToCharA[xorshift.getNumber()].out).join('');

                    return returnObject(res, !isJoinText ? 'ENT' : 'ADD');
                } else {
                    return returnObject('?', 'ERR');
                }
            };

            let index = 0;

            tokens.forEach((token) => {
                const buf = convertTokenToMisteraBruoText(token);

                // console.log(token, buf);

                if (
                    !(
                        buf.flag === 'IDT' ||
                        (res[index] && ((buf.flag === 'ADD' && res[index].flag === 'ENT') || (buf.flag === 'RAW' && res[index].flag === 'RAW')))
                    )
                )
                    res[++index] = {
                        text: '',
                        flag: buf.flag,
                    };

                res[index].text += buf.text;
            });

            return res
                .filter((item) => item)
                .map((item) => item.text)
                .join(' ')
                .replace(/(\x20+)/g, ' ')
                .replace(/(\n\s+)/g, '\n')
                .replace(/(\s+\n)/g, '\n');
        };

        convertMisteraBruoCharAToCharB = (text) => {
            return text
                .split('')
                .map((char) => {
                    const bufA = tableSymbolToCharA.find((item) => item.out === char);
                    const bufB = bufA ? tableSymbolToCharB.find((item) => item.in === bufA.in) : undefined;
                    const bufC = bufB ? bufB.out : char;
                    const bufD = bufC ? bufC : '?';

                    return bufD;
                })
                .join('');
        };

        const getMisteraBruoPronunciation = (text, pronList) => {
            return text
                .split('')
                .map((char) => {
                    if (char !== ' ') {
                        const bufA = tableSymbolToCharA.find((item) => item.out === char);
                        const bufB = bufA ? pronList.find((item) => item.in === bufA.in) : undefined;
                        const bufC = bufB ? bufB.out : char;
                        const bufD = bufC ? bufC : '?';

                        return bufD;
                    } else {
                        return ' ';
                    }
                })
                .join('');
        };

        const translate = new Promise((resolve, reject) => {
            kuromoji.builder({ dicPath: dict }).build((error, tokenizer) => {
                const res = [];

                textArray.map((text) => {
                    const tokens = tokenizer.tokenize(text);
                    const newTextA = convertTokensToMisteraBruoText(tokens);
                    const newTextB = convertMisteraBruoCharAToCharB(newTextA);
                    const newPronunciationA = getMisteraBruoPronunciation(newTextA, tableSymbolToPronA);
                    const newPronunciationB = getMisteraBruoPronunciation(newTextA, tableSymbolToPronB);

                    res.push({
                        textA: newTextA,
                        textB: newTextB,
                        pronunciationA: newPronunciationA,
                        pronunciationB: newPronunciationB,
                    });
                });

                resolve(res);
                reject();
            });
        });

        return await translate.then((res) => res);
    };

    this.translateEnglishToFakeMisteraBruo = () => {
        // WIP
    };
}
