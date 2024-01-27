// Need "OuroborosNode" Script!

function OuroborosNodeNetwork() {
    let globalUsers = [];

    let pushReportLog = (message) => console.log(message);
    let pushErrorLog = (message) => console.error(message);

    // Common

    this.getGlobalUsers = () => {
        return globalUsers;
    };

    this.setLogCommand = (pushReportLogFunction, pushErrorLogFunction) => {
        pushReportLog = (message) => pushReportLogFunction(message);
        pushErrorLog = (message) => pushErrorLogFunction(message);
    };

    const searchUserNode = (userName) => {
        return globalUsers.find((user) => user.getPublicProfile().userName === userName);
    };

    const getUserNode = (userData) => {
        // Access to Secret Data

        if (userData) {
            if (typeof userData === 'string') {
                const userNode = searchUserNode(userData);

                if (userNode) {
                    return userNode;
                } else {
                    pushErrorLog(`ユーザー「${userData}」は存在しません！`);

                    return undefined;
                }
            } else {
                const userNode = searchUserNode(userData.userName);

                if (userNode) {
                    return userNode;
                } else {
                    pushErrorLog(`ユーザーは存在しません！`);

                    return undefined;
                }
            }
        } else {
            return undefined;
        }
    };

    const getUserData = (userData) => {
        // Access to Public Data

        const userNode = getUserNode(userData);

        if (userNode) {
            return userNode.getPublicProfile();
        } else {
            return undefined;
        }
    };

    this.getGlobalUsersData = () => {
        return globalUsers.length > 0 ? globalUsers.map((user) => user.getPublicProfile()) : undefined;
    };

    this.isSameUser = (userDataA, userDataB) => {
        const dataA = getUserData(userDataA);
        const dataB = getUserData(userDataB);

        return dataA.userName === dataB.userName && (dataA.userIPv4Address === dataB.userIPv4Address || dataA.userIPv6Address === dataB.userIPv6Address);
    };

    // User

    this.createUser = (userName = undefined, runBefore, runAfter) => {
        const getRandomInt = (binaryDigit) => Math.floor(Math.random() * Math.pow(2, binaryDigit));

        const getRandomString = (length, charset = '0123456789ABCDEF') => {
            let res = '';

            for (let i = 0; i < length; i++) {
                const index = Math.floor(Math.random() * charset.length);

                res += charset.substring(index, index + 1);
            }

            return res;
        };

        runBefore;

        const createNode = new Promise((resolve, reject) => {
            const node = new OuroborosNode({
                userIPv4Address: getRandomInt(32),
                userIPv6Address: [...Array(8)].map(() => getRandomInt(16)),
                userName: userName || getRandomString(8),
                passPhrase: getRandomString(32),
            });

            resolve(node);
            reject();
        });

        createNode
            .then((node) => {
                globalUsers.push(node);

                pushReportLog(`ユーザー「${node.getPublicProfile().userName}」を作成`);
            })
            .catch(() => pushErrorLog('ユーザーの作成に失敗'))
            .finally(() => runAfter);
    };

    this.setUserName = (userData, newName) => {
        const node = getUserNode(userData);
        const data = getUserData(userData);

        if (node) {
            node.setUserName(newName);

            pushReportLog(`ユーザー「${data.userName}」の名前を「${newName}」に変更`);
        }
    };

    this.setUserIPv4Address = (userData, newIPv4Address) => {
        const node = getUserNode(userData);
        const data = getUserData(userData);

        if (node) {
            node.setUserIPv4AddressString(newIPv4Address);

            pushReportLog(`ユーザー「${data.userName}」のIPv4を「${data.userIPv4Address}」から「${node.getPublicProfile().userIPv4Address}」に変更`);
        }
    };

    this.setUserIPv6Address = (userData, newIPv6Address) => {
        const node = getUserNode(userData);
        const data = getUserData(userData);

        if (node) {
            node.setUserIPv6AddressString(newIPv6Address);

            pushReportLog(`ユーザー「${data.userName}」のIPv6を「${data.userIPv6Address}」から「${node.getPublicProfile().userIPv6Address}」に変更`);
        }
    };

    this.setPassPhrase = (userData, newPassPhrase) => {
        const node = getUserNode(userData);
        const data = getUserData(userData);

        if (node) {
            node.setPassPhrase(newPassPhrase);

            pushReportLog(`ユーザー「${data.userName}」がパスフレーズから新しい鍵を生成`);
        }
    };

    this.getUser = (userData) => {
        return getUserData(userData);
    };

    this.pickRandomUser = () => {
        const getRandomIndex = (array) => Math.floor(Math.random() * array.length);

        return globalUsers[getRandomIndex(globalUsers)].getPublicProfile();
    };

    this.removeUser = (userData) => {
        const node = getUserNode(userData);

        if (node) {
            const userName = node.getPublicProfile().userName;

            globalUsers = globalUsers.filter((user) => user !== node);

            pushReportLog(`ユーザー「${userName}」を削除`);

            return true;
        } else {
            return false;
        }
    };

    this.removeAllUser = () => {
        if (globalUsers.length !== 0) {
            globalUsers = [];

            pushReportLog('全てのユーザーを削除');
        } else {
            pushErrorLog('ユーザーは存在しません！');
        }
    };

    // Store

    this.createSendStore = (postUser, sendUser, point = 3) => {
        const postUserData = getUserData(postUser);

        if (!postUserData) return;

        const sendUserData = getUserData(sendUser);

        if (!sendUserData) return;

        const usersData = this.getGlobalUsersData();

        if (usersData.length - 2 < point) {
            pushErrorLog(`${usersData.length - 2}以下の数値を指定してください！`);

            return;
        }

        getUserNode(postUser).setSendRelayMap(sendUserData, this.getGlobalUsersData(), point);

        pushReportLog(`送信オブジェクト（${postUserData.userName} → ${sendUserData.userName}）を作成`);
    };

    this.setSendData = (postUser, sendUser, sendData) => {
        const postUserData = getUserData(postUser);

        if (!postUserData) return;

        const sendUserData = getUserData(sendUser);

        if (!sendUserData) return;

        if (sendData) {
            getUserNode(postUser).setSendStore(sendUserData, sendData);

            pushReportLog(`送信オブジェクト（${postUserData.userName} → ${sendUserData.userName}）のデータを設定`);
        } else {
            getUserNode(postUser).clearSendData(sendUserData);

            pushReportLog(`送信オブジェクト（${postUserData.userName} → ${sendUserData.userName}）のデータを削除`);
        }
    };

    this.returnSendStores = (targetUser) => {
        const targetUserNode = getUserNode(targetUser);

        if (!targetUserNode) return;

        return targetUserNode.returnSendStores();
    };

    this.returnGetStores = (targetUser) => {
        const targetUserNode = getUserNode(targetUser);

        if (!targetUserNode) return;

        return targetUserNode.returnGetStores();
    };

    this.returnSendStore = (targetUser, sendUser) => {
        const targetUserData = getUserData(targetUser);

        if (!targetUserData) return;

        const sendUserData = getUserData(sendUser);

        if (!sendUserData) return;

        const sendStore = getUserNode(targetUser).findSendStore(sendUserData);

        if (sendStore) {
            return sendStore;
        } else {
            pushErrorLog(`送信オブジェクト（${targetUserData.userName} → ${sendUserData.userName}）は存在しません！`);
        }
    };

    this.returnGetStore = (targetUser, postUser) => {
        const targetUserData = getUserData(targetUser);

        if (!targetUserData) return;

        const postUserData = getUserData(postUser);

        if (!postUserData) return;

        const getStore = getUserNode(targetUser).findGetStore(postUserData);

        if (getStore) {
            return getStore;
        } else {
            pushErrorLog(`受信オブジェクト（${postUserData.userName} → ${targetUserData.userName}）は存在しません！`);
        }
    };

    this.removeSendStore = (targetUser, sendUser) => {
        const targetUserData = getUserData(targetUser);

        if (!targetUserData) return;

        const sendUserData = getUserData(sendUser);

        if (!sendUserData) return;

        const sendStore = getUserNode(targetUser).findSendStore(sendUserData);

        if (sendStore) {
            getUserNode(targetUser).removeSendStore(sendUserData);

            pushReportLog(`送信オブジェクト（${targetUserData.userName} → ${sendUserData.userName}）を削除`);
        } else {
            pushErrorLog(`送信オブジェクト（${targetUserData.userName} → ${sendUserData.userName}）は存在しません！`);
        }
    };

    this.removeGetStore = (targetUser, postUser) => {
        const targetUserData = getUserData(targetUser);

        if (!targetUserData) return;

        const postUserData = getUserData(postUser);

        if (!postUserData) return;

        const getStore = getUserNode(targetUser).findGetStore(postUserData);

        if (getStore) {
            getUserNode(targetUser).removeGetStore(postUserData);

            pushReportLog(`受信オブジェクト（${postUserData.userName} → ${targetUserData.userName}）を削除`);
        } else {
            pushErrorLog(`受信オブジェクト（${postUserData.userName} → ${targetUserData.userName}）は存在しません！`);
        }
    };

    this.removeAllSendStore = (targetUser) => {
        const targetUserNode = getUserNode(targetUser);

        if (targetUserNode) {
            targetUserNode.removeAllSendStore();

            pushReportLog(`ユーザー「${targetUserNode.getPublicProfile().userName}」が有する全ての送信オブジェクトを削除`);
        }
    };

    this.removeAllGetStore = (targetUser) => {
        const targetUserNode = getUserNode(targetUser);

        if (targetUserNode) {
            targetUserNode.removeAllGetStore();

            pushReportLog(`ユーザー「${targetUserNode.getPublicProfile().userName}」が有する全ての受信オブジェクトを削除`);
        }
    };

    // Action

    const swapUser = (userA, userB) => {
        const userC = userA;

        userA = userB;
        userB = userC;
    };

    const getTextByte = (text) => encodeURIComponent(text).replace(/%../g, '_').length;

    const omitText = (text, length) => {
        const cutTextByByte = (text, length) => {
            let res = '';
            let count = 0;

            for (let i = 0; i < text.length; i++) {
                const addByte = text[i].match(/[ -~｡-ﾟ]/) ? 1 : 2;

                count += addByte;

                if (count > length) break;

                res += text[i];
            }

            return res;
        };

        return getTextByte(text) > length ? `${cutTextByByte(text, length - 2)}…` : text;
    };

    const exportRunDataLog = (flag, some) => {
        const postUserName = some.postUserData.userName;
        const sendUserName = some.sendUserData.userName;
        const objectName = `オブジェクト（${postUserName} → ${sendUserName}）`;

        let log = '';
        let res = -1;

        switch (flag) {
            case 'SYN':
                log = `[SYN] ユーザー「${some.processUserName}」がユーザー「${sendUserName}」へ接続を要求`;
                res = 0;
                break;
            case 'ACK':
                log = `[ACK] ユーザー「${some.processUserName}」がユーザー「${postUserName}」の要求を確認`;
                res = 0;

                swapUser(some.postUserData, some.sendUserData);
                break;
            case 'PST':
                log = `[PST] ユーザー「${some.processUserName}」が${objectName}をユーザー「${some.nextUserName}」へ送信`;
                res = 0;
                break;
            case 'REC':
                log = `[REC] ユーザー「${some.processUserName}」が${objectName}を受信＆返信`;
                res = 0;

                swapUser(some.postUserData, some.sendUserData);
                break;
            case 'FIN':
                log = `[FIN] ユーザー「${some.processUserName}」がユーザー「${sendUserName}」の応答＆終了を確認`;
                res = 0;

                swapUser(some.postUserData, some.sendUserData);
                break;
            case 'DUM':
                log = `[DUM] ユーザー「${some.processUserName}」が${objectName}をユーザー「${some.nextUserName}」へ送信`;
                res = 0;
                break;
            case 'DEL':
                log = `[DEL] ユーザー「${some.processUserName}」が${objectName}を破棄`;
                res = 1;
                break;
            case 'ERR':
                log = `[ERR] ユーザー「${some.processUserName}」が${objectName}の復号に失敗`;
                res = 2;
                break;
        }

        if (res === 0) log += `\nデータサンプル：${some.dataSummary}\nデータ長：${some.dataLength}バイト`;

        pushReportLog(log);

        return res;
    };

    const createOnionData = (postUserData, sendUserData) => {
        const postUserNode = getUserNode(postUserData);

        if (!postUserNode) return undefined;

        const sendStore = postUserNode.findSendStore(sendUserData);

        if (!sendStore) return undefined;

        if (sendStore.data) {
            return postUserNode.createOnionData(sendUserData, 'PST', 'REC');
        } else {
            return postUserNode.createOnionData(sendUserData, 'PST', 'SYN');
        }
    };

    this.runData = (postUser, sendUser) => {
        const postUserData = getUserData(postUser);

        if (!postUserData) return undefined;

        const sendUserData = getUserData(sendUser);

        if (!sendUserData) return undefined;

        let res = createOnionData(postUserData, sendUserData);
        let rec = [];

        let processUserName = postUserData.userName;
        let nextUserName = res.nextUser.userName;

        while (true) {
            const dist = {
                flag: res.flag,
                processUserName: processUserName,
                nextUserName: nextUserName,
                postUserData: postUserData,
                sendUserData: sendUserData,
                dataSummary: omitText(res.secretData, 32),
                dataLength: getTextByte(res.secretData),
            };

            rec.push(dist);

            if (exportRunDataLog(res.flag, dist) !== 0) return rec;

            const processUserNode = getUserNode(res.nextUser);

            if (!processUserNode) return undefined;

            res = processUserNode.processData(res.secretData);

            processUserName = getUserData(processUserNode.getPublicProfile()).userName;
            nextUserName = res.nextUser ? res.nextUser.userName : undefined;
        }
    };

    this.asyncRunData = (some) => {
        if (some.phase === 1) {
            some.postUserData = getUserData(some.postUser);

            if (!some.postUserData) {
                some.phase = -1;

                return;
            }

            some.sendUserData = getUserData(some.sendUser);

            if (!some.sendUserData) {
                some.phase = -1;

                return;
            }

            some.res = createOnionData(some.postUserData, some.sendUserData);

            some.processUserName = some.postUserData.userName;
            some.nextUserName = some.res.nextUser.userName;
        }

        if (some.phase === 2) {
            const processUserNode = getUserNode(some.res.nextUser);

            if (!processUserNode) {
                some.phase = -1;

                return;
            }

            some.res = processUserNode.processData(some.res.secretData);

            some.processUserName = getUserData(processUserNode.getPublicProfile()).userName;
            some.nextUserName = some.res.nextUser ? some.res.nextUser.userName : undefined;
        }

        const dist = {
            flag: some.res.flag,
            processUserName: some.processUserName,
            nextUserName: some.nextUserName,
            postUserData: some.postUserData,
            sendUserData: some.sendUserData,
            dataSummary: omitText(some.res.secretData, 32),
            dataLength: getTextByte(some.res.secretData),
        };

        some.rec.push(dist);

        if (exportRunDataLog(some.res.flag, dist) !== 0) {
            some.phase = 0;

            return;
        }

        if (some.phase === 1) {
            some.phase = 2;

            return;
        }
    };
}
