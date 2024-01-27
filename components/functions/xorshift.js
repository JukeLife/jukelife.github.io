function Xorshift32(seed) {
    let data = seed || 2463534242;

    let outputMin = 0;
    let outputMax = 10;

    this.setSeed = (seed = 2463534242) => {
        data = seed;
    };

    this.setOutputRange = (min, max) => {
        outputMin = min;
        outputMax = max;
    };

    this.setOutputBase = (base) => {
        outputMin = 0;
        outputMax = base - 1;
    };

    this.getNext = () => {
        data = data ^ (data << 13);
        data = data ^ (data >> 17);
        data = data ^ (data << 5);

        return data;
    };

    this.getNumber = () => {
        const r = Math.abs(this.getNext());

        return outputMin + (r % (outputMax - outputMin + 1));
    };

    this.getNumberArray = (n) => {
        let res = [];

        for (let i = 0; i < n; i++) res.push(this.getNumber());

        return res;
    };

    this.getNumberString = (n) => {
        return this.getNumberArray(n)
            .map((val) => val.toString(outputMax + 1))
            .join('');
    };
}

function Xorshift64(seed) {
    let data = seed || 88172645463325252;

    let outputMin = 0;
    let outputMax = 10;

    this.setSeed = (seed = 88172645463325252) => {
        data = seed;
    };

    this.setOutputRange = (min, max) => {
        outputMin = min;
        outputMax = max;
    };

    this.setOutputBase = (base) => {
        outputMin = 0;
        outputMax = base - 1;
    };

    this.getNext = () => {
        data = data ^ (data << 13);
        data = data ^ (data >> 7);
        data = data ^ (data << 17);

        return data;
    };

    this.getNumber = () => {
        const r = Math.abs(this.getNext());

        return outputMin + (r % (outputMax - outputMin + 1));
    };

    this.getNumberArray = (n) => {
        let res = [];

        for (let i = 0; i < n; i++) res.push(this.getNumber());

        return res;
    };

    this.getNumberString = (n) => {
        return this.getNumberArray(n)
            .map((val) => val.toString(outputMax + 1))
            .join('');
    };
}

function Xorshift96(seed) {
    let data = {
        x: 123456789,
        y: 362436069,
        z: seed || 521288629,
    };

    let rotor = {
        a: 3,
        b: 6,
        c: 19,
    };

    let outputMin = 0;
    let outputMax = 10;

    this.setSeed = (seed) => {
        data.z = seed;
    };

    this.resetSeed = (seed = 521288629) => {
        data.x = 123456789;
        data.y = 362436069;
        data.z = seed;
    };

    this.setData = (x, y, z) => {
        data = {
            x: x || 123456789,
            y: y || 362436069,
            z: z || 521288629,
        };
    };

    this.setRotor = (a, b, c) => {
        rotor = {
            a: a || 3,
            b: b || 6,
            c: c || 19,
        };
    };

    this.setOutputRange = (min, max) => {
        outputMin = min;
        outputMax = max;
    };

    this.setOutputBase = (base) => {
        outputMin = 0;
        outputMax = base - 1;
    };

    this.getNext = () => {
        const t = data.x ^ (data.x << rotor.a);

        data.x = data.y;
        data.y = data.z;
        data.z = data.z ^ (data.z >>> rotor.c) ^ (t ^ (t >>> rotor.b));

        return data.z;
    };

    this.getNumber = () => {
        const r = Math.abs(this.getNext());

        return outputMin + (r % (outputMax - outputMin + 1));
    };

    this.getNumberArray = (n) => {
        let res = [];

        for (let i = 0; i < n; i++) res.push(this.getNumber());

        return res;
    };

    this.getNumberString = (n) => {
        return this.getNumberArray(n)
            .map((val) => val.toString(outputMax + 1))
            .join('');
    };
}

function Xorshift128(seed) {
    let data = {
        x: 123456789,
        y: 362436069,
        z: 521288629,
        w: seed || 88675123,
    };

    let rotor = {
        a: 11,
        b: 8,
        c: 19,
    };

    let outputMin = 0;
    let outputMax = 10;

    this.setSeed = (seed) => {
        data.w = seed;
    };

    this.resetSeed = (seed = 88675123) => {
        data.x = 123456789;
        data.y = 362436069;
        data.z = 521288629;
        data.w = seed;
    };

    this.setData = (x, y, z, w) => {
        data = {
            x: x || 123456789,
            y: y || 362436069,
            z: z || 521288629,
            w: w || 88675123,
        };
    };

    this.setRotor = (a, b, c) => {
        rotor = {
            a: a || 11,
            b: b || 8,
            c: c || 19,
        };
    };

    this.setOutputRange = (min, max) => {
        outputMin = min;
        outputMax = max;
    };

    this.setOutputBase = (base) => {
        outputMin = 0;
        outputMax = base - 1;
    };

    this.getNext = () => {
        const t = data.x ^ (data.x << rotor.a);

        data.x = data.y;
        data.y = data.z;
        data.z = data.w;
        data.w = data.w ^ (data.w >>> rotor.c) ^ (t ^ (t >>> rotor.b));

        return data.w;
    };

    this.getNumber = () => {
        const r = Math.abs(this.getNext());

        return outputMin + (r % (outputMax - outputMin + 1));
    };

    this.getNumberArray = (n) => {
        let res = [];

        for (let i = 0; i < n; i++) res.push(this.getNumber());

        return res;
    };

    this.getNumberString = (n) => {
        return this.getNumberArray(n)
            .map((val) => val.toString(outputMax + 1))
            .join('');
    };
}
