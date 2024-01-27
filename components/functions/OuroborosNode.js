// Need "cryptico" Library!
// Need "CryptoJS" Library!

function OuroborosNode(userData) {
    let userIPv4Address = userData.userIPv4Address || undefined;
    let userIPv6Address = userData.userIPv6Address || undefined;
    let userName = userData.userName || 'Anonymous';

    const rsaBits = 1024;

    let rsaKey = cryptico.generateRSAKey(userName + String(userData.passPhrase), rsaBits);
    let publicKey = cryptico.publicKeyString(rsaKey);

    const JsonFormatter = {
        stringify: function (recObject) {
            let resObject = {
                ct: recObject.ciphertext.toString(CryptoJS.enc.Base64),
            };

            if (recObject.iv) resObject.iv = recObject.iv.toString();
            if (recObject.salt) resObject.s = recObject.salt.toString();

            return JSON.stringify(resObject);
        },
        parse: function (recText) {
            const recObject = JSON.parse(recText);

            let resObject = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(recObject.ct),
            });

            if (recObject.iv) resObject.iv = CryptoJS.enc.Hex.parse(recObject.iv);
            if (recObject.s) resObject.salt = CryptoJS.enc.Hex.parse(recObject.s);

            return resObject;
        },
    };

    let aesOption = {
        iv: undefined,
        format: JsonFormatter,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    };

    let insertRandomDataMinTimes = 0;
    let insertRandomDataMaxTimes = 1;

    // Common

    const getRandomIndex = (array) => Math.floor(Math.random() * array.length);

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    const getRandomString = (length, charset = '0123456789ABCDEF') => {
        let res = '';

        for (let i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * charset.length);

            res += charset.substring(index, index + 1);
        }

        return res;
    };

    const setObjectProperty = (res, rec, resProperty, recProperty) => {
        if (rec && rec[recProperty]) res[resProperty] = rec[recProperty];
    };

    const convertShortUserData = (rec) => {
        if (!rec) return rec;

        let res = {};

        setObjectProperty(res, rec, '4', 'userIPv4Address');
        setObjectProperty(res, rec, '6', 'userIPv6Address');
        setObjectProperty(res, rec, 'n', 'userName');
        setObjectProperty(res, rec, 'p', 'publicKey');

        return res;
    };

    const convertNormalUserData = (rec) => {
        if (!rec) return rec;

        let res = {};

        setObjectProperty(res, rec, 'userIPv4Address', '4');
        setObjectProperty(res, rec, 'userIPv6Address', '6');
        setObjectProperty(res, rec, 'userName', 'n');
        setObjectProperty(res, rec, 'publicKey', 'p');

        return res;
    };

    const convertShortOnionData = (rec) => {
        if (!rec) return rec;

        let res = {};

        setObjectProperty(res, rec, 's', 'secretData');
        setObjectProperty(res, rec, 'p', 'publicData');
        setObjectProperty(res, rec, 'r', 'relayMap');
        setObjectProperty(res, rec, 'n', 'nextUser');
        setObjectProperty(res, rec, 'f', 'flag');

        return res;
    };

    const convertNormalOnionData = (rec) => {
        if (!rec) return rec;

        let res = {};

        setObjectProperty(res, rec, 'secretData', 's');
        setObjectProperty(res, rec, 'publicData', 'p');
        setObjectProperty(res, rec, 'relayMap', 'r');
        setObjectProperty(res, rec, 'nextUser', 'n');
        setObjectProperty(res, rec, 'flag', 'f');

        return res;
    };

    const convertShortOption = (rec) => {
        if (!rec) return rec;

        let res = {};

        setObjectProperty(res, rec, 'k', 'aesKey');
        setObjectProperty(res, rec, 'i', 'aesInitialVector');

        return res;
    };

    const convertNormalOption = (rec) => {
        if (!rec) return rec;

        let res = {};

        setObjectProperty(res, rec, 'aesKey', 'k');
        setObjectProperty(res, rec, 'aesInitialVector', 'i');

        return res;
    };

    // User

    this.setUserIPv4Address = (newUserIPv4Address) => {
        userIPv4Address = newUserIPv4Address || undefined;
    };

    this.setUserIPv4AddressString = (newUserIPv4Address) => {
        let buf = 0;

        newUserIPv4Address.split('.').map((item, index) => (buf += parseInt(item) * Math.pow(2, (3 - index) * 8)));

        this.setUserIPv4Address(buf);
    };

    this.setUserIPv6Address = (newUserIPv6Address) => {
        userIPv6Address = newUserIPv6Address || undefined;
    };

    this.setUserIPv6AddressString = (newUserIPv6Address) => {
        const buf = newUserIPv6Address.split(':').map((item) => parseInt(item, 16));

        this.setUserIPv6Address(buf);
    };

    this.setUserName = (newUserName) => {
        userName = String(newUserName) || 'Anonymous';
    };

    this.setPassPhrase = (passPhrase) => {
        rsaKey = cryptico.generateRSAKey(userName + String(passPhrase), rsaBits);
        publicKey = cryptico.publicKeyString(rsaKey);
    };

    this.getPublicProfile = () => {
        const convertNumberToIPv4String = (val) => {
            const getSection = (i) => {
                const shiftCut = (3 - i) * 8;

                return (((val << shiftCut) >>> shiftCut) >>> (i * 8)).toString(10);
            };

            return [...Array(4)]
                .map((_, i) => getSection(i))
                .reverse()
                .join('.');
        };

        const convertArrayToIPv6String = (array) => {
            return array.map((val) => val.toString(16).padStart(4, '0')).join(':');
        };

        return {
            userIPv4Address: convertNumberToIPv4String(userIPv4Address),
            userIPv6Address: convertArrayToIPv6String(userIPv6Address),
            userName: userName,
            publicKey: publicKey,
        };
    };

    const matchUser = (userA, userB) => {
        return (userA.userIPv4Address === userB.userIPv4Address || userA.userIPv6Address === userB.userIPv6Address) && userA.userName === userB.userName;
    };

    // Store

    let sendStores = [];
    let getStores = [];

    this.returnSendStores = () => {
        return sendStores.length > 0 ? sendStores.map((item) => item) : undefined;
    };

    this.returnGetStores = () => {
        return getStores.length > 0 ? getStores.map((item) => item) : undefined;
    };

    this.findSendStore = (sendUser) => {
        return sendStores.find((item) => matchUser(item.user, sendUser));
    };

    this.findGetStore = (getUser) => {
        return getStores.find((item) => matchUser(item.user, getUser));
    };

    this.setSendStore = (sendUser, sendData = '') => {
        const sendStore = this.findSendStore(sendUser);

        if (sendStore === undefined) {
            sendStores.push({
                user: sendUser,
                data: sendData,
                relayMap: undefined,
            });

            return sendStores.slice(-1)[0];
        } else {
            if (sendData) sendStore.data = sendData;

            return sendStore;
        }
    };

    this.setGetStore = (getUser, getData, flag = 'DAT') => {
        const getStore = this.findGetStore(getUser);

        let data = undefined;

        const timestamp = new Date();

        if (getData) {
            data = getData;
        } else {
            switch (flag) {
                case 'SYN':
                    data = 'Check first connection.';
                    break;
                case 'FIN':
                    data = 'Check last response.';
                    break;
            }
        }

        if (getStore === undefined) {
            getStores.push({
                user: getUser,
                container: [
                    {
                        data: data,
                        timestamp: timestamp,
                        flag: flag,
                    },
                ],
            });
        } else {
            getStore.container.push({
                data: data,
                timestamp: timestamp,
                flag: flag,
            });
        }

        return getStore;
    };

    const swapRelayMap = (relayMap) => {
        const sendUser = relayMap.find((item) => item.label === 'GET');
        const postUser = relayMap.find((item) => item.label === 'PST');

        sendUser.label = 'PST';
        postUser.label = 'GET';

        return relayMap;
    };

    const setSendRelayMap_V1 = (user) => {
        return user;
    };

    const setSendRelayMap_V2 = (user) => {
        const passPhrase = user.userName;
        const salt = CryptoJS.lib.WordArray.random(128 / 8);

        user.option = {
            aesKey: CryptoJS.PBKDF2(passPhrase, salt, {
                keySize: 128 / 32,
                iterations: 1000,
                hasher: CryptoJS.algo.SHA256,
            }),
            aesInitialVector: CryptoJS.lib.WordArray.random(128 / 8),
        };

        return user;
    };

    const useSendRelayMapSystem = setSendRelayMap_V2;

    this.setSendRelayMap = (sendUser, userList, point = 3) => {
        const pickArray = (array, n) => {
            let arrayIndex = [...Array(array.length)].map((_, i) => i);

            return array.length >= n ? [...Array(n)].map(() => array[arrayIndex.splice(getRandomIndex(arrayIndex), 1)[0]]) : undefined;
        };

        const sendUserBuffer = sendUser;
        const postUserBuffer = this.getPublicProfile();

        sendUserBuffer.label = 'GET';
        postUserBuffer.label = 'PST';

        const newUserList = userList.filter((item) => !matchUser(item, sendUserBuffer) && !matchUser(item, postUserBuffer));

        let relayMap = pickArray(newUserList, point);

        relayMap.forEach((user) => (user.label = 'DUM'));
        relayMap.splice(getRandomIndex(relayMap), 0, sendUserBuffer);
        relayMap.splice(getRandomIndex(relayMap), 0, postUserBuffer);

        relayMap = relayMap.map((user) => useSendRelayMapSystem(user));

        const sendStore = this.findSendStore(sendUser) || this.setSendStore(sendUser);

        sendStore.relayMap = relayMap;

        return sendStore;
    };

    this.clearSendData = (sendUser) => {
        const sendStore = this.findSendStore(sendUser);

        if (sendStore !== undefined) sendStore.data = undefined;
    };

    this.clearGetData = (getUser) => {
        const getStore = this.findGetStore(getUser);

        if (getStore !== undefined) getStore.data = [];
    };

    this.removeSendStore = (sendUser) => {
        const lastSendStoresLength = sendStores.length;

        sendStores = sendStores.filter((store) => !matchUser(store.user, sendUser));

        return lastSendStoresLength !== sendStores.length;
    };

    this.removeGetStore = (getUser) => {
        const lastGetStoresLength = getStores.length;

        getStores = getStores.filter((store) => !matchUser(store.user, getUser));

        return lastGetStoresLength !== getStores.length;
    };

    this.removeAllSendStore = () => {
        sendStores = [];

        return true;
    };

    this.removeAllGetStore = () => {
        getStores = [];

        return true;
    };

    // Action

    let publicData = undefined;

    const createOnionData_V1 = (rec, nextUser) => {
        const secretData = cryptico.encrypt(JSON.stringify(rec), nextUser.publicKey).cipher;

        return secretData;
    };

    const createOnionData_V2 = (rec, nextUser) => {
        aesOption.iv = nextUser.option.aesInitialVector;

        const data = CryptoJS.AES.encrypt(JSON.stringify(rec), nextUser.option.aesKey, aesOption).toString();
        const option = cryptico.encrypt(JSON.stringify(convertShortOption(nextUser.option)), nextUser.publicKey).cipher;

        if (data === undefined || option === undefined) return undefined;

        const secretData = {
            d: data,
            o: option,
        };

        return JSON.stringify(secretData);
    };

    const useCreateOnionDataSystem = createOnionData_V2;

    this.createOnionData = (sendUser, postFlag = 'PST', sendFlag = 'REC') => {
        const sendStore = this.findSendStore(sendUser);
        const sendRandomUser = sendFlag === 'DEL';

        const sendUserIndex = !sendRandomUser ? sendStore.relayMap.findIndex((item) => item.label === 'GET') : getRandomIndex(sendStore.relayMap);
        const postUserIndex = sendStore.relayMap.findIndex((item) => item.label === 'PST');

        if (sendUserIndex === -1 || postUserIndex === -1) return undefined;

        let i = sendUserIndex;

        let res = {
            secretData: sendStore.data,
            publicData: publicData,
            relayMap: !sendRandomUser ? sendStore.relayMap : undefined,
            nextUser: undefined,
            flag: sendFlag,
        };

        while (true) {
            let secretData = undefined;

            try {
                secretData = useCreateOnionDataSystem(convertShortOnionData(res), sendStore.relayMap[i]);
            } catch (error) {
                console.error(error);

                return undefined;
            }

            if (secretData === undefined) return undefined;

            res = {
                secretData: secretData,
                publicData: publicData,
                relayMap: undefined,
                nextUser: sendStore.relayMap[i],
                flag: 'NUL',
            };

            if (i !== postUserIndex + 1) {
                res.flag = 'DUM';
            } else {
                res.flag = postFlag;

                break;
            }

            res.nextUser = convertShortUserData(res.nextUser);

            i = i !== 0 ? i - 1 : sendStore.relayMap.length - 1;
        }

        sendStore.data = undefined;

        return res;
    };

    const createReplyData = (decryptedData) => {
        const getUser = decryptedData.relayMap.find((item) => item.label === 'PST');

        this.setGetStore(getUser, decryptedData.secretData, decryptedData.flag);

        const sendStore = this.setSendStore(getUser);

        sendStore.relayMap = swapRelayMap(decryptedData.relayMap);

        let res = undefined;

        switch (decryptedData.flag) {
            case 'SYN':
                res = this.createOnionData(sendStore.user, 'SYN', 'ACK');
                break;
            case 'ACK':
                res = this.createOnionData(sendStore.user, 'ACK', 'FIN');
                break;
            case 'REC':
                res = this.createOnionData(sendStore.user, 'REC', sendStore.data ? 'REC' : 'FIN');
                break;
            case 'FIN':
                res = this.createOnionData(sendStore.user, 'FIN', 'DEL');
                break;
        }

        return res;
    };

    const processDataA_V1 = (getDataBuffer) => {
        let res = convertNormalOnionData(JSON.parse(cryptico.decrypt(getDataBuffer, rsaKey).plaintext));

        res.nextUser = convertNormalUserData(res.nextUser);

        return res;
    };

    const processDataA_V2 = (getDataBuffer) => {
        const getData = JSON.parse(getDataBuffer);

        const option = convertNormalOption(JSON.parse(cryptico.decrypt(getData.o, rsaKey).plaintext));

        aesOption.iv = option.aesInitialVector;

        const data = CryptoJS.AES.decrypt(getData.d, option.aesKey, aesOption).toString(CryptoJS.enc.Utf8);

        let res = convertNormalOnionData(JSON.parse(data));

        res.nextUser = convertNormalUserData(res.nextUser);

        return res;
    };

    const processDataA_V3 = (getDataBuffer) => {
        const dataA = JSON.parse(getDataBuffer);

        let decryptedDataA = {
            d: undefined,
            o: convertNormalOption(JSON.parse(cryptico.decrypt(dataA.o, rsaKey).plaintext)),
        };

        aesOption.iv = decryptedDataA.o.aesInitialVector;

        decryptedDataA.d = JSON.parse(CryptoJS.AES.decrypt(dataA.d, decryptedDataA.o.aesKey, aesOption).toString(CryptoJS.enc.Utf8));

        let res = undefined;

        if (decryptedDataA.d.f !== undefined) {
            res = convertNormalOnionData(decryptedDataA.d);

            res.nextUser = convertNormalUserData(res.nextUser);
        } else if (decryptedDataA.d.d !== undefined) {
            const dataC = JSON.parse(decryptedDataA.d.d);

            let decryptedDataC = {
                d: undefined,
                o: convertNormalOption(JSON.parse(cryptico.decrypt(dataC.o, rsaKey).plaintext)),
            };

            aesOption.iv = decryptedDataC.o.aesInitialVector;

            decryptedDataC.d = JSON.parse(CryptoJS.AES.decrypt(dataC.d, decryptedDataC.o.aesKey, aesOption).toString(CryptoJS.enc.Utf8));

            res = convertNormalOnionData(decryptedDataC.d);

            res.nextUser = convertNormalUserData(res.nextUser);
        }

        return res;
    };

    const useProcessDataSystemA = processDataA_V3;

    const processDataB_V1 = (decryptedData) => {
        return decryptedData.secretData;
    };

    const processDataB_V2 = (decryptedData) => {
        return decryptedData.secretData;
    };

    const processDataB_V3 = (decryptedData) => {
        const dataB = {
            d: decryptedData.secretData,
            r: getRandomString(
                getRandomInt(decryptedData.secretData.length * insertRandomDataMinTimes, decryptedData.secretData.length * insertRandomDataMaxTimes)
            ),
        };

        const nextUser = setSendRelayMap_V2(decryptedData.nextUser);

        aesOption.iv = nextUser.option.aesInitialVector;

        const dataA = {
            d: dataB,
            o: convertShortOption(nextUser.option),
        };

        const encryptedDataA = {
            d: CryptoJS.AES.encrypt(JSON.stringify(dataA.d), nextUser.option.aesKey, aesOption).toString(),
            o: cryptico.encrypt(JSON.stringify(dataA.o), nextUser.publicKey).cipher,
        };

        if (encryptedDataA.d === undefined || encryptedDataA.o === undefined) return undefined;

        return JSON.stringify(encryptedDataA);
    };

    const useProcessDataSystemB = processDataB_V3;

    this.processData = (getDataBuffer) => {
        let res = {
            secretData: undefined,
            publicData: undefined,
            nextUser: undefined,
            flag: undefined,
        };

        let decryptedData = undefined;

        try {
            decryptedData = useProcessDataSystemA(getDataBuffer);
        } catch (error) {
            console.error(error);

            res.flag = 'ERR';

            return res;
        }

        if (decryptedData === undefined) {
            res.flag = 'ERR';

            return res;
        }

        if (decryptedData.relayMap !== undefined && decryptedData.nextUser === undefined) {
            decryptedData = createReplyData(decryptedData);

            if (decryptedData === undefined) {
                res.flag = 'ERR';

                return res;
            }

            res.secretData = decryptedData.secretData;
        } else {
            switch (decryptedData.flag) {
                case 'DUM':
                    res.secretData = useProcessDataSystemB(decryptedData);
                    break;
                case 'DEL':
                    res.secretData = undefined;
                    break;
            }
        }

        res.publicData = decryptedData.publicData;
        res.nextUser = decryptedData.nextUser;
        res.flag = decryptedData.flag;

        return res;
    };
}
