// Need "Xorshift128" Function!

function Caesarwave() {
    const xorshift = new Xorshift128();

    xorshift.setOutputBase(16);

    const pattern = '0123456789abcdef';
    const hashDigit = Math.ceil(Math.log(Number.MAX_SAFE_INTEGER) / Math.log(16));

    this.generateEigenvalue = async (data, key) => {
        const keyHash = await getSha256(key);

        resetSeed(keyHash);

        const dataBin = convertStringToUnicodeByte(data);
        const keyRand = xorshift.getNumberString(dataBin.length);
        const eigenvalue = addPatterns(dataBin, keyRand, pattern);

        return eigenvalue;
    };

    this.decryptEigenvalue = async (eigenvalue, key) => {
        const keyHash = await getSha256(key);

        resetSeed(keyHash);

        const keyRand = xorshift.getNumberString(eigenvalue.length);
        const dataBin = subtractPatterns(eigenvalue, keyRand, pattern);
        const data = convertUnicodeByteToString(dataBin);

        return data;
    };

    const resetSeed = (keyHash) => {
        xorshift.resetSeed(parseInt(keyHash.substring(0, hashDigit), 16));
    };

    const getSha256 = async (data, base = 16) => {
        const buf = new TextEncoder().encode(data);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        const digit = Math.ceil(Math.log(256) / Math.log(base));

        return Array.from(new Uint8Array(hash))
            .map((val) => val.toString(base).padStart(digit, '0'))
            .join('');
    };

    const addPatterns = (valA, valB, pattern = '0123456789') => {
        let res = [];
        let rec = 0;

        const getCharIndex = (val, i) => (i < val.length ? pattern.indexOf(val[val.length - i - 1]) : 0);

        for (let i = 0; true; i++) {
            const bufA = getCharIndex(valA, i);
            const bufB = getCharIndex(valB, i);

            if (bufA === -1 || bufB === -1) return null;

            const bufC = bufA + bufB + rec;

            if (bufC >= pattern.length) {
                res.push(bufC - pattern.length);

                // rec = 1;
            } else {
                res.push(bufC);

                // rec = 0;
            }

            if (i >= valA.length && i >= valB.length) break;
        }

        return res
            .reverse()
            .map((val) => pattern[val])
            .join('')
            .replace(new RegExp(`^${pattern[0]}+`), '');
    };

    const subtractPatterns = (valA, valB, pattern = '0123456789') => {
        let res = [];
        let rec = 0;

        const getCharIndex = (val, i) => (i < val.length ? pattern.indexOf(val[val.length - i - 1]) : 0);

        for (let i = 0; true; i++) {
            const bufA = getCharIndex(valA, i);
            const bufB = getCharIndex(valB, i);

            if (bufA === -1 || bufB === -1) return null;

            const bufC = bufA - bufB - rec;

            if (bufC < 0) {
                res.push(bufC + pattern.length);

                // rec = 1;
            } else {
                res.push(bufC);

                // rec = 0;
            }

            if (i >= valA.length && i >= valB.length) break;
        }

        return res
            .reverse()
            .map((val) => pattern[val])
            .join('')
            .replace(new RegExp(`^${pattern[0]}+`), '');
    };

    const convertStringToUnicodeByte = (text) => {
        if (!text) return '';

        let res = '';

        const getHexByte = (val) => val.toString(16).padStart(2, '0');

        for (let i = 0; i < text.length; i++) {
            const buf = text.charCodeAt(i);

            if (buf <= 0x7f) {
                res += getHexByte(buf);
            } else if (buf <= 0x07ff) {
                res += getHexByte(((buf >> 6) & 0x1f) | 0xc0);
                res += getHexByte((buf & 0x3f) | 0x80);
            } else {
                res += getHexByte(((buf >> 12) & 0x0f) | 0xe0);
                res += getHexByte(((buf >> 6) & 0x3f) | 0x80);
                res += getHexByte((buf & 0x3f) | 0x80);
            }
        }

        return res;
    };

    const convertUnicodeByteToString = (text) => {
        if (!text) return '';

        let res = '';
        let buf = [];
        let rec = undefined;

        for (let i = 0; i < text.length; i += 2) buf.push(parseInt(text.substring(i, i + 2), 16));

        while ((rec = buf.shift())) {
            let ren = null;

            if (rec <= 0x7f) {
                ren += rec;
            } else if (rec <= 0xdf) {
                ren += (rec & 0x1f) << 6;
                ren += buf.shift() & 0x3f;
            } else if (rec <= 0xe0) {
                ren += ((buf.shift() & 0x1f) << 6) | 0x0800;
                ren += buf.shift() & 0x3f;
            } else {
                ren += (rec & 0x0f) << 12;
                ren += (buf.shift() & 0x3f) << 6;
                ren += buf.shift() & 0x3f;
            }

            res += String.fromCharCode(ren);
        }

        return res;
    };
}
