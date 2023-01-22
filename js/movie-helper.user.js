// ==UserScript==
// @name         HeBuguM's Movie Helper
// @namespace    hebugum-movie-helper
// @version      1.11
// @match        https://pro.imdb.com/title/*
// @match        https://pro.imdb.com/name/*
// @match        https://www.imdb.com/title/*
// @downloadURL  https://hebugum.github.io/userscripts/js/movie-helper.user.js
// @updateURL    https://hebugum.github.io/userscripts/js/movie-helper.user.js
// @run-at       document-idle
// @noframes
// ==/UserScript==

// IMDb Pro Overlay Removal
(function() {
    document.getElementById("logged_out_upsell")?.remove();
})();


// RARBG & Subtitles Search
const titleElement = document.querySelector('body h1[data-testid="hero-title-block__title"]');
replaceTitle();
new MutationObserver(replaceTitle).observe(titleElement,{childList: true});

function replaceTitle(_, observer) {
    if (observer) observer.disconnect();
    const imdbId = document.querySelector(`meta[property="imdb:pageConst"]`)?.content ?? "";
    const title = titleElement.innerText;

    // RARBG
    titleElement.innerHTML = `${title} <a href="https://rarbgto.org/torrents.php?imdb=${imdbId}" title="RARBG Search" target="_blank" style="color: white;text-decoration: none;">↗</a>`;

    // Subtitles
    const reviewsElement = document.querySelector(`ul[data-testid="reviewContent-all-reviews"]`);
    if(reviewsElement) {
        const torrentSearch = document.createElement("div")
        torrentSearch.innerHTML = `
        <h1 style="font-weight: bold; margin-top: 0.75rem">Download</h1>
        <ul class="ipc-inline-list ipc-inline-list--show-dividers ipc-inline-list--inline ipc-metadata-list-item__list-content baseAlt" role="presentation">
		    <li class="ipc-inline-list__item"><a target="_blank" href="https://zamunda.net/bananas?&search=${title}" class="ipc-metadata-list-item__list-content-item--link torrent-search" style="color: var(--ipt-on-baseAlt-accent2-color);">Zamunda</a></li>
            <li class="ipc-inline-list__item"><a target="_blank" href="http://zelka.org/browse.php?search=${title}" class="ipc-metadata-list-item__list-content-item--link torrent-search" style="color: var(--ipt-on-baseAlt-accent2-color);">Zelka</a></li>
            <li class="ipc-inline-list__item"><a target="_blank" href="https://arenabg.com/bg/torrents/?text=${title}" class="ipc-metadata-list-item__list-content-item--link torrent-search" style="color: var(--ipt-on-baseAlt-accent2-color);">ArenaBG</a></li>
            <li class="ipc-inline-list__item"><a target="_blank" href="https://hdbits.org/browse.php?search=${imdbId}" class="ipc-metadata-list-item__list-content-item--link torrent-search" style="color: var(--ipt-on-baseAlt-accent2-color);">HDBits</a></li>
            <li class="ipc-inline-list__item"><a target="_blank" href="https://hd-torrents.org/torrents.php?active=1&options=0&search=${imdbId}" class="ipc-metadata-list-item__list-content-item--link torrent-search" style="color: var(--ipt-on-baseAlt-accent2-color);">HD-Torrents</a></li>
	    </ul>`;
        reviewsElement.after(torrentSearch);

        const subtitleSearch = document.createElement("div")
        subtitleSearch.innerHTML = `
        <h1 style="font-weight: bold; margin-top: 0.75rem">Subtitles</h1>
        <ul class="ipc-inline-list ipc-inline-list--show-dividers ipc-inline-list--inline ipc-metadata-list-item__list-content baseAlt" role="presentation">
		    <li class="ipc-inline-list__item"><a target="_blank" href="http://subs.sab.bz/index.php?act=search&movie=${title}" class="ipc-metadata-list-item__list-content-item--link" style="color: var(--ipt-on-baseAlt-accent2-color);">subs.sab.bz</a></li>
            <li class="ipc-inline-list__item"><a target="_blank" href="https://subsunacs.net/search.php?p=1&t=1&m=${title}" class="ipc-metadata-list-item__list-content-item--link" style="color: var(--ipt-on-baseAlt-accent2-color);">subsunacs</a></li>
            <li class="ipc-inline-list__item"><a target="_blank" href="https://yavka.net/subtitles.php?s=${title}" class="ipc-metadata-list-item__list-content-item--link" style="color: var(--ipt-on-baseAlt-accent2-color);">YavkA</a></li>
	    </ul>`;
        reviewsElement.after(subtitleSearch);
    }
}
