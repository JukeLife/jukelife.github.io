function Notice(arg) {
    const noticeDisplayDataNum = arg.noticeDisplayDataNum;
    const displayElement = arg.displayElement;
    const prevButtonElement = arg.prevButtonElement;
    const nextButtonElement = arg.nextButtonElement;

    let noticeData = undefined;
    let noticePage = 0;

    displayElement.innerHTML = 'データを取得しています。';

    fetch(arg.dataPath)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            noticeData = res;

            this.setNoticeData(0);

            prevButtonElement.addEventListener('click', () => this.setNoticeData(-1));
            nextButtonElement.addEventListener('click', () => this.setNoticeData(+1));
        })
        .catch((_) => {
            displayElement.innerHTML = 'データの取得に失敗しました。';

            prevButtonElement.disabled = true;
            nextButtonElement.disabled = true;
        });

    const createDateTextForArray = (array) => {
        if (array && array.length === 3) {
            const paddingZero = (number, digit) => (typeof number === 'number' ? number : 0).toString().padStart(digit, '0');

            return `${paddingZero(array[0], 4)}年${paddingZero(array[1], 2)}月${paddingZero(array[2], 2)}日`;
        } else {
            return 'XXXX年XX月XX日';
        }
    };

    const createLinkTag = (link, text = link) => {
        if (link || link !== '') {
            if (link.startsWith('https://') || link.startsWith('http://')) {
                return `<a href="${link}" target="_blank" rel="noreferrer">${text}</a>`;
            } else {
                return `<a href="${link}">${text}</a>`;
            }
        } else {
            return `<a>${text}</a>`;
        }
    };

    this.setNoticeData = (n) => {
        if (noticeData === undefined || noticePage + n < 0 || noticeDisplayDataNum * (noticePage + n) >= noticeData.length) return;

        noticePage += n;

        let buf = [];

        for (let i = 0; i < noticeDisplayDataNum; i++) {
            const index = noticeDisplayDataNum * noticePage + i;

            if (index >= noticeData.length) break;

            let date = createDateTextForArray(noticeData[index].date);

            let text =
                noticeData[index].link && noticeData[index].link !== ''
                    ? createLinkTag(noticeData[index].link, noticeData[index].text)
                    : noticeData[index].text;

            buf.push(`<code>${date}</code> ${text}`);
        }

        displayElement.innerHTML = buf.join('<br />');

        prevButtonElement.disabled = noticePage - 1 < 0;
        nextButtonElement.disabled = noticeDisplayDataNum * (noticePage + 1) >= noticeData.length;
    };
}
