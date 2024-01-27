{
    const headerElement = document.getElementsByTagName('header')[0];

    if (headerElement.innerHTML === '') {
        headerElement.innerHTML = `
            <img class="brand" src="/assets/images/logo.png" />
            <div class="splash">
                現実にも空想にも、面白さがある<br />
                それを感じた生命体が世界に佇む
            </div>
            <div class="link tab bottom">
                <a href="/index.html">HOME</a>
                <a href="/pages/work.html">WORK</a>
                <a href="/pages/blog.html">BLOG</a>
                <a href="/pages/info.html">INFO</a>
            </div>
        `;

        headerElement.className = 'block flex';
    }

    const footerElement = document.getElementsByTagName('footer')[0];

    if (footerElement.innerHTML === '') {
        footerElement.innerHTML = `
            <div class="link tab top">
                <a href="/index.html">HOME</a>
                <a href="/pages/term.html">TERM</a>
            </div>
            <div class="credit">
                Copyright © 2024 JukeLife all rights reserved.
            </div>
        `;

        footerElement.className = 'block flex';
    }
}
