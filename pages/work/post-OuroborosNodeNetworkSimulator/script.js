const documentElement = document.getElementsByClassName('document')[0];

const outputElement = document.getElementById('output');
const inputElement = document.getElementById('input');

const logElement = document.getElementById('log');

const userListElement = document.getElementById('userList');
const sendStoreListElement = document.getElementById('sendStoreList');
const getStoreListElement = document.getElementById('getStoreList');
const sendDataInfoElement = document.getElementById('sendDataInfo');

const userNodeGraphicElement = document.getElementById('userNodeGraphic');
const sendDataGraphicElement = document.getElementById('sendDataGraphic');

const logFunctionElement = document.getElementById('logFunction');

const userListFunctionElement = document.getElementById('userListFunction');
const sendStoreListFunctionElement = document.getElementById('sendStoreListFunction');
const getStoreListFunctionElement = document.getElementById('getStoreListFunction');
const sendDataInfoFunctionElement = document.getElementById('sendDataInfoFunction');

const userNodeGraphicFunctionElement = document.getElementById('userNodeGraphicFunction');
const sendDataGraphicFunctionElement = document.getElementById('sendDataGraphicFunction');

const userNumElement = document.getElementById('userNum');
const userNameElement = document.getElementById('userName');
const sendUserNameElementA = document.getElementById('sendUserNameA');
const sendUserNameElementB = document.getElementById('sendUserNameB');
const pointNumElement = document.getElementById('pointNum');
const sendDataElement = document.getElementById('sendData');

const setUserNameElement = document.getElementById('setUserName');
const setUserIPv4AddressElement = document.getElementById('setUserIPv4Address');
const setUserIPv6AddressElement = document.getElementById('setUserIPv6Address');
const setPassPhraseElement = document.getElementById('setPassPhrase');

const userSelectorElement = document.getElementById('userSelector');
const userControllerElements = document.getElementsByClassName('userController');
const mapSelectorElement = document.getElementById('mapSelector');
const mapControllerElements = document.getElementsByClassName('mapController');

// Ouroboros Node Network

const ouroborosNodeNetwork = new OuroborosNodeNetwork();

ouroborosNodeNetwork.setLogCommand(pushReportLog, pushErrorLog);

let globalUsers = ouroborosNodeNetwork.getGlobalUsers();
let selectUser = undefined;
let selectSendUser = undefined;
let runDataResult = undefined;

// Initialize

updateDisplay();

// Common

function getTimestampString(date) {
    const paddingZero = (val, digit) => String(val).padStart(digit, '0');

    return (
        [paddingZero(date.getFullYear(), 4), paddingZero(date.getMonth() + 1, 2), paddingZero(date.getDate(), 2)].join('.') +
        '-' +
        [paddingZero(date.getHours(), 2), paddingZero(date.getMinutes(), 2), paddingZero(date.getSeconds(), 2)].join(':')
    );
}

function getFlagColor(flag) {
    let res = '#ccc';

    switch (flag) {
        case 'SYN':
            res = '#fc0';
            break;
        case 'ACK':
            res = '#f80';
            break;
        case 'PST':
            res = '#080';
            break;
        case 'REC':
            res = '#088';
            break;
        case 'FIN':
            res = '#08f';
            break;
        case 'DUM':
            res = '#888';
            break;
        case 'DEL':
            res = '#800';
            break;
        case 'ERR':
            res = '#f00';
            break;
    }

    return res;
}

async function convertCanvasToImage(canvasElement, option) {
    const res = await new Promise((resolve, reject) =>
        canvasElement.toBlob(
            (blob) => {
                resolve(URL.createObjectURL(blob));
                reject();
            },
            option.type,
            option.quality
        )
    );

    return res;
}

function downloadTextFile(text, fileName) {
    generateFileFromTextData(text, fileName, 'text/plain');
}

function downloadDataFile(text, fileName) {
    generateFileFromTextData(text, fileName, 'text/csv');
}

function generateFileFromTextData(text, fileName, type) {
    const blob = new Blob([text], { type: type });

    downloadLink(URL.createObjectURL(blob), fileName);
}

function moveNewPage(url) {
    const linkElement = document.createElement('a');

    linkElement.href = url;
    linkElement.target = '_blank';
    linkElement.rel = 'noreferrer';
    linkElement.click();

    return linkElement;
}

function downloadLink(url, fileName) {
    const linkElement = document.createElement('a');

    linkElement.href = url;
    linkElement.download = fileName;
    linkElement.click();

    return linkElement;
}

function hideElement(element, hide) {
    if (hide) {
        element.classList.add('hide');
    } else {
        element.classList.remove('hide');
    }
}

// Interface

function openInterface(id) {
    documentElement.classList.remove(`${id}Close`);

    document.getElementById(id).classList.remove('close');
}

function closeInterface(id) {
    documentElement.classList.add(`${id}Close`);

    document.getElementById(id).classList.add('close');
}

// Input

function disablePanel(element, disabled) {
    ['input', 'button', 'textarea'].map((elementTagName) => {
        const elements = element.getElementsByTagName(elementTagName);

        if (elements) for (let i = 0; i < elements.length; i++) elements[i].disabled = disabled;
    });
}

function disableControlPanel(disabled) {
    disablePanel(inputElement, disabled);
}

function disableUserSelector(disabled = globalUsers < 1) {
    disablePanel(userSelectorElement, disabled);
}

function disableUserController(disabled = selectUser === undefined) {
    for (let i = 0; i < userControllerElements.length; i++) disablePanel(userControllerElements[i], disabled);
}

function disableMapSelector(disabled = selectUser === undefined || ouroborosNodeNetwork.returnSendStores(selectUser) === undefined) {
    disablePanel(mapSelectorElement, disabled);
}

function disableMapController(disabled = selectSendUser === undefined) {
    for (let i = 0; i < mapControllerElements.length; i++) disablePanel(mapControllerElements[i], disabled);
}

// Output

function omitText(text, length) {
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

    const getTextByte = (text) => encodeURIComponent(text).replace(/%../g, '_').length;

    return getTextByte(text) > length ? `${cutTextByByte(text, length - 2)}…` : text;
}

function pushLog(text, color = undefined) {
    const timestamp = getTimestampString(new Date());

    let res = `[${timestamp}] `;

    text.split('\n').map((text, line) => {
        if (line === 0) {
            res += `${text}\n`;
        } else {
            res += `${' '.repeat(timestamp.length + 2)} ${text}\n`;
        }
    });

    if (color) {
        logElement.innerHTML += `<span class="${color}_tc">${res}</span>`;
    } else {
        logElement.innerHTML += res;
    }

    // console.log(res);

    logElement.scrollTo(0, logElement.scrollHeight);
}

function pushReportLog(text) {
    pushLog(text);
}

function pushErrorLog(text) {
    pushLog(text, 'red');
}

function saveLog() {
    const data = logElement.innerText;

    if (!data) return;

    downloadTextFile(data, 'Log.txt');
}

function drawNodeGraphic(canvas, option) {
    canvas.fillStyle = option.lineColor;

    canvas.beginPath();
    canvas.arc(option.x, option.y, option.radius, 0, 2 * Math.PI);
    canvas.fill();
    canvas.closePath();

    canvas.fillStyle = option.bodyColor;

    canvas.beginPath();
    canvas.arc(option.x, option.y, option.radius - option.weight, 0, 2 * Math.PI);
    canvas.fill();
    canvas.closePath();

    canvas.font = `bold ${((option.radius - option.weight - option.margin) * 2) / option.label.length}px courier`;

    const textMeasure = canvas.measureText(option.label);
    const textWidth = textMeasure.width;
    const textHeight = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent;

    canvas.fillStyle = option.lineColor;

    canvas.fillText(option.label, option.x + (textWidth / 2) * -1, option.y + textHeight / 2);
}

function updateUserNodeGraphic() {
    const calcOptimalGridPattern = (number) => {
        const evaluation = (item) => item.mod + Math.abs(item.y - item.x);

        let res = {
            x: 1,
            y: number,
            mod: number,
        };

        for (let i = 2; i <= number; i++) {
            const buf = {
                x: Math.ceil(number / i),
                y: i,
                mod: number % i,
            };

            if (evaluation(res) > evaluation(buf)) res = buf;
        }

        return res;
    };

    const globalUsers = ouroborosNodeNetwork.getGlobalUsersData();

    if (!globalUsers) {
        hideElement(userNodeGraphicFunctionElement, true);

        return;
    }

    const canvas = userNodeGraphicElement.getContext('2d');
    const canvasWidth = userNodeGraphicElement.width;
    const canvasHeight = userNodeGraphicElement.height;

    canvas.clearRect(0, 0, canvasWidth, canvasHeight);

    const grid = calcOptimalGridPattern(globalUsers.length);
    const gridWidth = canvasWidth / grid.x;
    const gridHeight = canvasHeight / grid.y;
    const gridRadius = (gridWidth <= gridHeight ? gridWidth : gridHeight) * 0.5 - 16;

    for (let i in globalUsers) {
        const gridY = parseInt(i / grid.x);
        const gridX = i - gridY * grid.x;
        const posX = (gridX + 0.5) * gridWidth;
        const posY = (gridY + 0.5) * gridHeight;

        drawNodeGraphic(canvas, {
            x: posX,
            y: posY,
            radius: gridRadius,
            weight: 4,
            label: globalUsers[i].userName,
            margin: 16,
            bodyColor: '#eee',
            lineColor: '#211',
        });
    }

    hideElement(userNodeGraphicFunctionElement, false);
}

async function exeUserNodeGraphic(mode) {
    const targetElement = document.getElementById('userNodeGraphic');
    const exportFileName = 'User Node Graphic.png';

    let res;

    switch (mode) {
        case 'show':
            res = await convertCanvasToImage(targetElement, {
                type: 'image/png',
                quality: 1,
            });

            moveNewPage(res);
            break;
        case 'download':
            res = await convertCanvasToImage(targetElement, {
                type: 'image/png',
                quality: 1,
            });

            downloadLink(res, exportFileName);
            break;
    }
}

function updateSendDataGraphic() {
    const canvas = sendDataGraphicElement.getContext('2d');
    const canvasWidth = userNodeGraphicElement.width;
    const canvasHeight = userNodeGraphicElement.height;

    canvas.clearRect(0, 0, canvasWidth, canvasHeight);

    const postUser = selectUser;
    const sendUser = selectSendUser;

    if (!postUser || !sendUser || ouroborosNodeNetwork.isSameUser(postUser, sendUser)) {
        hideElement(sendDataGraphicFunctionElement, true);

        return;
    }

    const sendStore = ouroborosNodeNetwork.returnSendStore(postUser, sendUser);

    if (!sendStore) {
        hideElement(sendDataGraphicFunctionElement, true);

        return;
    }

    const TAU = 2 * Math.PI;

    const nodeLength = sendStore.relayMap.length;
    const margin = 16;

    // mapRadius = (2 * nodeRadius * 2) / (2 * Math.sin(Math.PI / nodeLength));
    // mapRadius = (canvasHeight - 2 * nodeRadius - 2 * margin) / 2;

    // (2 * nodeRadius * 2) / (2 * Math.sin(Math.PI / nodeLength)) = (canvasHeight - 2 * nodeRadius - 2 * margin) / 2;
    // 4 * nodeRadius = (canvasHeight - 2 * nodeRadius - 2 * margin) * Math.sin(Math.PI / nodeLength);
    // (4 + 2 * Math.sin(Math.PI / nodeLength)) * nodeRadius = (canvasHeight - 2 * margin) * Math.sin(Math.PI / nodeLength);
    // nodeRadius = ((canvasHeight - 2 * margin) * Math.sin(Math.PI / nodeLength)) / (4 + 2 * Math.sin(Math.PI / nodeLength));

    const nodeRadius = ((canvasHeight - 2 * margin) * Math.sin(Math.PI / nodeLength)) / (4 + 2 * Math.sin(Math.PI / nodeLength));
    const mapRadius = (canvasHeight - 2 * nodeRadius - 2 * margin) / 2;

    drawNodeGraphic(canvas, {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        radius: mapRadius,
        weight: 4,
        label: `${postUser.userName} -> ${sendUser.userName}`,
        margin: 16,
        bodyColor: '#eee',
        lineColor: '#211',
    });

    for (let i = 0; i < nodeLength; i++) {
        const angle = (i / nodeLength) * TAU;

        drawNodeGraphic(canvas, {
            x: canvasWidth / 2 + mapRadius * Math.cos(angle),
            y: canvasHeight / 2 + mapRadius * Math.sin(angle),
            radius: nodeRadius,
            weight: 4,
            label: sendStore.relayMap[i].userName,
            margin: 16,
            bodyColor: '#eee',
            lineColor: '#211',
        });
    }

    if (!runDataResult) {
        hideElement(sendDataGraphicFunctionElement, false);

        return;
    }

    const searchUserIndex = (userData) => {
        if (userData === undefined) return -1;

        const userName = typeof userData === 'string' ? userData : userData.userName;

        return sendStore.relayMap.findIndex((item) => item.userName === userName);
    };

    const drawArrow = (canvas, option) => {
        if (option.startAngleIndex === -1 || option.endAngleIndex === -1) return;

        const xor = (a, b) => (a || b) && !(a && b);
        const cct = (r, t) => ({ x: r * Math.cos(t), y: r * Math.sin(t) });
        const addVector = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });

        const angleIndexDiff = option.endAngleIndex - option.startAngleIndex;
        const isClockwise = xor(angleIndexDiff > 0, Math.abs(angleIndexDiff) === 1);

        canvas.fillStyle = option.color;

        {
            const shaveAngle = option.shave * TAU * (isClockwise ? -1 : 1);
            const startAngle = (option.startAngleIndex / option.angle) * TAU + shaveAngle;
            const endAngle = (option.endAngleIndex / option.angle) * TAU - shaveAngle;

            canvas.beginPath();
            canvas.arc(canvasWidth / 2, canvasHeight / 2, option.radius + option.volume - option.weight / 2, startAngle, endAngle, isClockwise);
            canvas.arc(canvasWidth / 2, canvasHeight / 2, option.radius + option.volume + option.weight / 2, endAngle, startAngle, !isClockwise);
            canvas.fill();
            canvas.closePath();
        }

        {
            const arrowTipAngle = (option.endAngleIndex / option.angle + option.shave * (isClockwise ? 1 : -1)) * TAU;
            const arrowTipDirection = arrowTipAngle + 0.25 * TAU * (isClockwise ? -1 : 1);
            const arrowTipPosO = addVector({ x: canvasWidth / 2, y: canvasHeight / 2 }, cct(option.radius + option.volume, arrowTipAngle));
            const arrowTipPosA = addVector(arrowTipPosO, cct(option.size, arrowTipDirection + (0 / 3) * TAU));
            const arrowTipPosB = addVector(arrowTipPosO, cct(option.size, arrowTipDirection + (1 / 3) * TAU));
            const arrowTipPosC = addVector(arrowTipPosO, cct(option.size, arrowTipDirection + (2 / 3) * TAU));

            canvas.beginPath();
            canvas.moveTo(arrowTipPosA.x, arrowTipPosA.y);
            canvas.lineTo(arrowTipPosB.x, arrowTipPosB.y);
            canvas.lineTo(arrowTipPosC.x, arrowTipPosC.y);
            canvas.fill();
            canvas.closePath();
        }
    };

    const drawLabel = (canvas, option) => {
        canvas.font = `bold ${option.size}px courier`;

        const textMeasure = canvas.measureText(option.label);
        const textWidth = textMeasure.width;
        const textHeight = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent;

        canvas.fillStyle = option.bodyColor;

        canvas.fillRect(
            option.x + (textWidth / 2) * -1 - option.margin,
            option.y + (textHeight / 2) * -1 - option.margin,
            textWidth + option.margin * 2,
            textHeight + option.margin * 2
        );

        canvas.fillStyle = option.lineColor;

        canvas.fillText(option.label, option.x + (textWidth / 2) * -1, option.y + textHeight / 2);
    };

    runDataResult.map((item, index) => {
        const startAngleIndex = searchUserIndex(item.processUserName);
        const endAngleIndex = searchUserIndex(item.nextUserName);
        const volume = (index + 1) * 0.5 * nodeRadius * (1 / nodeLength);
        const centerAngle = ((startAngleIndex + 0.5) / nodeLength) * TAU;
        const color = getFlagColor(item.flag);

        drawArrow(canvas, {
            angle: nodeLength,
            startAngleIndex: startAngleIndex,
            endAngleIndex: endAngleIndex,
            radius: mapRadius,
            shave: 5 / 360,
            volume: volume,
            weight: 4,
            size: 16,
            color: color,
        });

        drawLabel(canvas, {
            x: canvasWidth / 2 + (mapRadius + volume) * Math.cos(centerAngle),
            y: canvasHeight / 2 + (mapRadius + volume) * Math.sin(centerAngle),
            label: `(${index + 1})`,
            size: 16,
            margin: 4,
            bodyColor: color,
            lineColor: '#eee',
        });
    });

    hideElement(sendDataGraphicFunctionElement, false);
}

async function exeSendDataGraphic(mode) {
    const targetElement = document.getElementById('sendDataGraphic');
    const exportFileName = 'Send Data Graphic.png';

    let res;

    switch (mode) {
        case 'show':
            res = await convertCanvasToImage(targetElement, {
                type: 'image/png',
                quality: 1,
            });

            moveNewPage(res);
            break;
        case 'download':
            res = await convertCanvasToImage(targetElement, {
                type: 'image/png',
                quality: 1,
            });

            downloadLink(res, exportFileName);
            break;
    }
}

function updateSendDataInfo() {
    const data = runDataResult;

    if (data) {
        sendDataInfoElement.innerHTML = `
            <table class="fit">
                <caption>通信されたデータの詳細</caption>
                <thead>
                    <tr>
                        <th style="width: 10%;">番号</th>
                        <th style="width: 10%;">フラグ</th>
                        <th style="width: 15%;">送信元</th>
                        <th style="width: 15%;">送信先</th>
                        <th style="width: 40%;">サンプル</th>
                        <th style="width: 10%;">長さ</th>
                    </tr>
                </thead>
                <tbody>
                    ${data
                        .map(
                            (item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td style="color: ${getFlagColor(item.flag)};" >${item.flag}</td>
                                    <td>${item.processUserName ? item.processUserName : '<span class="red_tc">なし</span>'}</td>
                                    <td>${item.nextUserName ? item.nextUserName : '<span class="red_tc">なし</span>'}</td>
                                    <td>${item.dataSummary ? item.dataSummary : '<span class="red_tc">空のデータ</span>'}</td>
                                    <td>${item.dataSummary ? item.dataLength : '<span class="red_tc">0</span>'}</td>
                                </tr>
                            `
                        )
                        .join('')}
                </tbody>
            </table>
        `;

        hideElement(sendDataInfoFunctionElement, false);
    } else {
        sendDataInfoElement.innerHTML = '';

        hideElement(sendDataInfoFunctionElement, true);
    }
}

function saveSendDataInfo() {
    const data = runDataResult;

    if (!data) return;

    let res = '番号,フラグ,送信元,送信先,サンプル,長さ\n';

    data.map((item, index) => {
        res += `${index + 1},${item.flag},${item.processUserName ? item.processUserName : 'NONE'},${item.nextUserName ? item.nextUserName : 'NONE'},${
            item.dataSummary ? item.dataSummary : 'NULL'
        },${item.dataSummary ? item.dataLength : '0'}\n`;
    });

    downloadDataFile(res, 'Send Data Info.csv');
}

function updateDisplay(updateInput = true) {
    updateUserList();

    if (updateInput) updateUserInformation();

    updateSendStoreList();
    updateGetStoreList();
    updateSendData();

    disableUserSelector();
    disableUserController();
    disableMapSelector();
    disableMapController();

    updateUserNodeGraphic();
    updateSendDataGraphic();
    updateSendDataInfo();
}

function updateUserList() {
    const data = ouroborosNodeNetwork.getGlobalUsersData();

    if (data) {
        userListElement.innerHTML = `
            <table class="fit">
                <caption>公開サーバーに登録されているユーザーの一覧</caption>
                <thead>
                    <tr>
                        <th>IPv4</th>
                        <th>ユーザー名</th>
                        <th>公開鍵</th>
                    </tr>
                </thead>
                <tbody>
                    ${data
                        .map((user) => {
                            return `
                                <tr>
                                    <td>${user.userIPv4Address}</td>
                                    <td>${user.userName}</td>
                                    <td>${omitText(user.publicKey, 32)}</td>
                                </tr>
                            `;
                        })
                        .join('')}
                </tbody>
            </table>
        `;

        hideElement(userListFunctionElement, false);
    } else {
        userListElement.innerHTML = '';
        userNameElement.value = '';

        hideElement(userListFunctionElement, true);
    }
}

function saveUserList() {
    const data = ouroborosNodeNetwork.getGlobalUsersData();

    if (!data) return;

    let res = 'IPv4,IPv6,ユーザー名,公開鍵\n';

    data.map((user) => {
        res += `${user.userIPv4Address},${user.userIPv6Address},${user.userName},${user.publicKey}\n`;
    });

    downloadDataFile(res, 'User List.csv');
}

function updateUserInformation() {
    setUserNameElement.value = selectUser ? selectUser.userName : '';
    setUserIPv4AddressElement.value = selectUser ? selectUser.userIPv4Address : '';
    setUserIPv6AddressElement.value = selectUser ? selectUser.userIPv6Address : '';
    setPassPhraseElement.value = '';

    if (selectUser) userNameElement.value = selectUser.userName;
}

function updateSendStoreList() {
    const data = selectUser ? ouroborosNodeNetwork.returnSendStores(selectUser) : undefined;

    if (data) {
        sendStoreListElement.innerHTML = `
            <table class="fit">
                <caption>ユーザーが保有している送信オブジェクト</caption>
                <thead>
                    <tr>
                        <th style="width: 20%;">送信先</th>
                        <th style="width: 30%;">マップ</th>
                        <th style="width: 50%;">データ</th>
                    </tr>
                </thead>
                <tbody>
                    ${data
                        .map(
                            (item) => `
                                <tr>
                                    <td>${item.user.userName}</td>
                                    <td>${item.relayMap ? item.relayMap.map((item) => item.userName).join(' → ') : '<span class="red_tc">未指定</span>'}</td>
                                    <td>${item.data ? omitText(item.data, 32) : '<span class="red_tc">未指定</span>'}</td>
                                </tr>
                            `
                        )
                        .join('')}
                </tbody>
            </table>
        `;

        hideElement(sendStoreListFunctionElement, false);
    } else {
        sendStoreListElement.innerHTML = '';
        sendUserNameElementA.value = '';
        sendUserNameElementB.value = '';

        hideElement(sendStoreListFunctionElement, true);
    }
}

function saveSendStoreList() {
    const data = selectUser ? ouroborosNodeNetwork.returnSendStores(selectUser) : undefined;

    if (!data) return;

    let res = '送信先,マップ,データ\n';

    data.map((item) => {
        res += `${item.user.userName},${item.relayMap ? item.relayMap.map((item) => item.userName).join(' → ') : 'NULL'},${item.data ? item.data : 'NULL'}\n`;
    });

    downloadDataFile(res, 'Send Store List.csv');
}

function updateGetStoreList() {
    const data = selectUser ? ouroborosNodeNetwork.returnGetStores(selectUser) : undefined;

    if (data) {
        getStoreListElement.innerHTML = `
            <table class="fit">
                <caption>ユーザーが保有している受信オブジェクト</caption>
                <thead>
                    <tr>
                        <th style="width: 20%;">送信元</th>
                        <th style="width: 20%;">日時</th>
                        <th style="width: 10%;">フラグ</th>
                        <th style="width: 50%;">データ</th>
                    </tr>
                </thead>
                <tbody>
                    ${data
                        .map((item) => {
                            if (item.container) {
                                return item.container
                                    .map((container, index) =>
                                        index === 0
                                            ? `
                                                <tr>
                                                    <td rowspan="${item.container.length}">${item.user.userName}</td>
                                                    <td>${getTimestampString(container.timestamp)}</td>
                                                    <td>${container.flag}</td>
                                                    <td>${container.data ? container.data : '<span class="red_tc">空のデータ</span>'}</td>
                                                </tr>
                                            `
                                            : `
                                                <tr>
                                                    <td>${getTimestampString(container.timestamp)}</td>
                                                    <td>${container.flag}</td>
                                                    <td>${container.data ? container.data : '<span class="red_tc">空のデータ</span>'}</td>
                                                </tr>
                                            `
                                    )
                                    .join('');
                            } else {
                                return `
                                    <tr>
                                        <td>${item.user.userName}</td>
                                        <td colspan="3" class="red_tc">データが存在しません</td>
                                    </tr>
                                `;
                            }
                        })
                        .join('')}
                </tbody>
            </table>
        `;

        hideElement(getStoreListFunctionElement, false);
    } else {
        getStoreListElement.innerHTML = '';

        hideElement(getStoreListFunctionElement, true);
    }
}

function saveGetStoreList() {
    const data = selectUser ? ouroborosNodeNetwork.returnGetStores(selectUser) : undefined;

    if (!data) return;

    let res = '送信元,日時,フラグ,データ\n';

    data.map((item) => {
        if (item.container) {
            item.container.map((container) => {
                res += `${item.user.userName},${getTimestampString(container.timestamp)},${container.flag},${container.data ? container.data : 'NULL'}\n`;
            });
        } else {
            res += `${item.user.userName}\n`;
        }
    });

    downloadDataFile(res, 'Get Store List.csv');
}

function updateSendData() {
    const postUser = selectUser;
    const sendUser = selectSendUser;

    if (postUser && sendUser) {
        const sendStore = ouroborosNodeNetwork.returnSendStore(postUser, sendUser);

        if (sendStore) {
            sendDataElement.value = sendStore.data ? sendStore.data : '';

            return;
        }
    }

    sendDataElement.value = '';
}

// User

function createUsers(userNum = Number(userNumElement.value) || 0) {
    if (userNum <= 0) {
        pushErrorLog('1以上の数値を指定してください！');

        return;
    }

    disableControlPanel(true);

    ouroborosNodeNetwork.createUser(undefined);

    if (userNum > 1) {
        setTimeout(() => createUsers(--userNum), 0);
    } else {
        setTimeout(() => {
            pushReportLog('処理を完了');
            disableControlPanel(false);
            updateDisplay();
        }, 0);
    }
}

function setUser(userName = String(userNameElement.value)) {
    const data = ouroborosNodeNetwork.getUser(userName);

    selectUser = data;
    selectSendUser = undefined;
    runDataResult = undefined;

    if (data) pushReportLog(`ユーザー「${userName}」を指定`);

    updateDisplay();
}

function setUserName(userName = String(setUserNameElement.value)) {
    if (selectUser) {
        ouroborosNodeNetwork.setUserName(selectUser, userName);

        selectUser = ouroborosNodeNetwork.getUser(userName);
        runDataResult = undefined;
    } else {
        pushErrorLog('ユーザーが指定されていません！');
    }

    updateDisplay(false);
}

function setUserIPv4Address(userIPv4Address = String(setUserIPv4AddressElement.value)) {
    if (selectUser) {
        ouroborosNodeNetwork.setUserIPv4Address(selectUser, userIPv4Address);

        selectUser = ouroborosNodeNetwork.getUser(selectUser);
        runDataResult = undefined;
    } else {
        pushErrorLog('ユーザーが指定されていません！');
    }

    updateDisplay(false);
}

function setUserIPv6Address(userIPv6Address = String(setUserIPv6AddressElement.value)) {
    if (selectUser) {
        ouroborosNodeNetwork.setUserIPv6Address(selectUser, userIPv6Address);

        selectUser = ouroborosNodeNetwork.getUser(selectUser);
        runDataResult = undefined;
    } else {
        pushErrorLog('ユーザーが指定されていません！');
    }

    updateDisplay(false);
}

function setPassPhrase(passPhrase = String(setPassPhraseElement.value)) {
    if (selectUser) {
        ouroborosNodeNetwork.setPassPhrase(selectUser, passPhrase);

        selectUser = ouroborosNodeNetwork.getUser(selectUser);
        runDataResult = undefined;
    } else {
        pushErrorLog('ユーザーが指定されていません！');
    }

    updateDisplay(false);
}

function removeUsers(userNum = Number(userNumElement.value) || 0) {
    if (userNum <= 0) {
        pushErrorLog('1以上の数値を指定してください！');

        return;
    }

    if (globalUsers.length === 0) {
        pushErrorLog('ユーザーは存在しません！');

        return;
    }

    if (userNum > globalUsers.length) {
        pushErrorLog(`${globalUsers.length}以下の数値を指定してください！`);

        return;
    }

    disableControlPanel(true);

    removeUser(ouroborosNodeNetwork.pickRandomUser().userName, false);

    if (userNum > 1) {
        setTimeout(() => removeUsers(--userNum), 0);
    } else {
        setTimeout(() => {
            pushReportLog('処理を完了');
            disableControlPanel(false);
            updateDisplay();
        }, 0);
    }
}

function removeUser(userName = String(userNameElement.value), update = true) {
    const data = ouroborosNodeNetwork.removeUser(userName);

    if (data) {
        if (userName === String(userNameElement.value)) userNameElement.value = '';

        if (selectUser && selectUser.userName === userName) {
            selectUser = undefined;
            runDataResult = undefined;
        }

        if (selectSendUser && selectSendUser.userName === userName) {
            selectSendUser = undefined;
            runDataResult = undefined;
        }
    }

    if (update) updateDisplay();
}

function removeAllUser() {
    ouroborosNodeNetwork.removeAllUser();

    selectUser = undefined;
    selectSendUser = undefined;
    runDataResult = undefined;

    userNameElement.value = '';

    updateDisplay();
}

function removeAllSendStore() {
    ouroborosNodeNetwork.removeAllSendStore(selectUser);

    updateDisplay();
}

function removeAllGetStore() {
    ouroborosNodeNetwork.removeAllGetStore(selectUser);

    updateDisplay();
}

// Store

function checkUser(selectSendUser) {
    const returnError = (message) => {
        pushErrorLog(message);

        updateDisplay();
    };

    if (selectUser === undefined) {
        returnError('送信元のユーザーが指定されていません！');

        return undefined;
    }

    if (selectSendUser === undefined) {
        returnError('送信先のユーザーが指定されていません！');

        return undefined;
    }

    const postUser = ouroborosNodeNetwork.getUser(selectUser);
    const sendUser = ouroborosNodeNetwork.getUser(selectSendUser);

    if (postUser && sendUser) {
        return {
            postUser: postUser,
            sendUser: sendUser,
        };
    } else {
        return undefined;
    }
}

function createSendStore(sendUserName = String(sendUserNameElementA.value), point = Number(pointNumElement.value)) {
    const res = checkUser(sendUserName);

    if (res === undefined) return;

    runDataResult = undefined;

    ouroborosNodeNetwork.createSendStore(res.postUser, res.sendUser, point);

    updateDisplay();
}

function setSendStore(sendUserName = String(sendUserNameElementB.value), exportLog = true) {
    const res = checkUser(sendUserName);

    if (res === undefined) return;

    const sendStore = ouroborosNodeNetwork.returnSendStore(res.postUser, res.sendUser);

    if (sendStore) {
        selectSendUser = res.sendUser;
        runDataResult = undefined;

        if (exportLog) pushReportLog(`送信オブジェクト（${res.postUser.userName} → ${res.sendUser.userName}）を指定`);
    }

    updateDisplay();
}

function setSendData(sendData = String(sendDataElement.value)) {
    const res = checkUser(selectSendUser);

    if (res === undefined) return;

    runDataResult = undefined;

    ouroborosNodeNetwork.setSendData(res.postUser, res.sendUser, sendData);

    updateDisplay();
}

function clearSendData() {
    const res = checkUser(selectSendUser);

    if (res === undefined) return;

    runDataResult = undefined;

    ouroborosNodeNetwork.setSendData(res.postUser, res.sendUser, undefined);

    updateDisplay();
}

function runData() {
    disableControlPanel(true);

    setSendStore();

    const user = checkUser(selectSendUser);

    if (user === undefined) return;

    runDataResult = ouroborosNodeNetwork.runData(user.postUser, user.sendUser);

    disableControlPanel(false);
    updateDisplay();
}

function asyncRunData(some) {
    if (some === undefined) {
        disableControlPanel(true);

        setSendStore();

        const user = checkUser(selectSendUser);

        if (user === undefined) return;

        some = {
            postUser: user.postUser,
            sendUser: user.sendUser,
            phase: 1,
            rec: [],
        };

        runDataResult = undefined;
    }

    ouroborosNodeNetwork.asyncRunData(some);

    if (some.phase > 0) {
        setTimeout(() => asyncRunData(some), 0);
    } else {
        setTimeout(() => {
            runDataResult = some.rec;

            pushReportLog('処理を完了');
            disableControlPanel(false);
            updateDisplay();
        }, 0);
    }
}

function removeSendStore() {
    setSendStore();

    const res = checkUser(selectSendUser);

    if (res === undefined) return;

    selectSendUser = undefined;
    runDataResult = undefined;

    ouroborosNodeNetwork.removeSendStore(res.postUser, res.sendUser);

    updateDisplay();
}
