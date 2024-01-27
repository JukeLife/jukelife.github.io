function Post(arg) {
    const postDisplayDataNum = arg.postDisplayDataNum;
    const containerElement = arg.containerElement;
    const pageElement = arg.pageElement;
    const prevButtonElement = arg.prevButtonElement;
    const nextButtonElement = arg.nextButtonElement;
    const initButtonElement = arg.initButtonElement;
    const lastButtonElement = arg.lastButtonElement;

    const url = new URL(window.location.href);

    let postData = undefined;
    let postPage = parseInt(url.searchParams.get('page')) - 1 || 0;

    if (postPage < 0) postPage = 0;

    fetch(arg.dataPath)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            postData = res;

            this.setPostData();

            prevButtonElement.map((item) => item.addEventListener('click', () => this.movePostPage(1)));
            nextButtonElement.map((item) => item.addEventListener('click', () => this.movePostPage(2)));
            initButtonElement.map((item) => item.addEventListener('click', () => this.movePostPage(3)));
            lastButtonElement.map((item) => item.addEventListener('click', () => this.movePostPage(4)));
        })
        .catch((_) => {
            prevButtonElement.map((item) => (item.disabled = true));
            nextButtonElement.map((item) => (item.disabled = true));
            initButtonElement.map((item) => (item.disabled = true));
            lastButtonElement.map((item) => (item.disabled = true));
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

    const createPostElement = (postData) => {
        const postElement = document.createElement('section');

        if (postData.date) {
            const postDateElement = document.createElement('p');

            postDateElement.innerHTML = `<code>${createDateTextForArray(postData.update)}</code>`;

            postElement.appendChild(postDateElement);
        }

        if (postData.title) {
            const postTitleElement = document.createElement('h2');

            postTitleElement.innerHTML = postData.link ? createLinkTag(postData.link, postData.title) : postData.title;
            postTitleElement.className = 'joinHeading';

            postElement.appendChild(postTitleElement);
        }

        if (postData.summary) {
            const postSummaryElement = document.createElement('p');

            postSummaryElement.innerHTML = postData.summary;

            postElement.appendChild(postSummaryElement);
        }

        if (postData.image) {
            const postImageElement = document.createElement('figure');

            postImageElement.innerHTML = `<img src="${postData.image}" />`;

            postElement.appendChild(postImageElement);
        }

        return postElement;
    };

    this.setPostData = () => {
        if (postData === undefined) return;

        for (let i = 0; i < postDisplayDataNum; i++) {
            const index = postDisplayDataNum * postPage + i;

            if (index >= postData.length) break;

            containerElement.appendChild(createPostElement(postData[index]));
        }

        pageElement.map((item) => (item.innerHTML = `${postPage + 1} / ${Math.ceil(postData.length / postDisplayDataNum)}`));
        prevButtonElement.map((item) => (item.disabled = postPage - 1 < 0));
        nextButtonElement.map((item) => (item.disabled = postDisplayDataNum * (postPage + 1) >= postData.length));
        initButtonElement.map((item) => (item.disabled = postPage - 1 < 0));
        lastButtonElement.map((item) => (item.disabled = postDisplayDataNum * (postPage + 1) >= postData.length));
    };

    this.movePostPage = (mode) => {
        let newPostPage = postPage + 1;

        switch (mode) {
            case 1:
                if (postPage - 1 < 0) return;

                newPostPage--;
                break;
            case 2:
                if (postDisplayDataNum * (postPage + 1) >= postData.length) return;

                newPostPage++;
                break;
            case 3:
                newPostPage = 1;
                break;
            case 4:
                newPostPage = postData.length !== 0 ? Math.ceil(postData.length / postDisplayDataNum) : 1;
                break;
        }

        url.searchParams.set('page', newPostPage.toString());

        location.href = url;
    };
}
