// ==UserScript==
// @name         HeBuguM Chess
// @namespace    hebugum-chess
// @version      2025-05-17
// @match        https://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://hebugum.github.io/userscripts/js/chess.user.js
// @updateURL   https://hebugum.github.io/userscripts/js/chess.user.js
// @run-at       document-end
// @nofremes
// ==/UserScript==

const new_game_panel_style = `
<style>
    .qp-pannel {
        width: 138px;
        position: fixed;
        right: 20px;
        top: calc(50% - 30px);
    }
    .qp-header {
        border-bottom: 1px solid #545451;
        background-color: #41403d;
        width: 100%;
        color: white;
        font-size: 1.5em;
        border-radius: 8px 8px 0px 0px;
        padding-bottom: 4px;
    }
    .qp-action {
        background-color: #41403d;
        text-decoration: none;
        padding: 5px;
        display: block;
        width: 100%;
        color: white;
    }
    .qp-action:hover {
        background-color: #333330;
    }
    .qp-footer {
        background-color: #41403d;
        border-radius: 0px 0px 8px 8px;
        height: 5px;
        padding: 0px 5px;
        width: 100%;
    }
</style>
`;

const new_game_panel = `
<div class="qp-pannel">
    <div class="qp-header">
        <span class="icon-font-chess chess" style="width: 100%"></span>
    </div>
    <a class="qp-action"
        href="/puzzles/rush">
        <span class="icon-font-chess puzzle-rush" style="width: 40px; font-size: 1.2em"></span> Puzzle Rush
    </a>
    <a class="qp-action"
        href="/play/online/new?action=createLiveChallenge&base=180&timeIncrement=2">
        <span class="icon-font-chess blitz" style="width: 40px; font-size: 1.2em"></span> 3 | 2
    </a>
    <a class="qp-action"
        href="/play/online/new?action=createLiveChallenge&base=600&timeIncrement=0">
        <span class="icon-font-chess rapid" style="width: 40px; font-size: 1.2em"></span> 10 min
    </a>
    <div class="qp-footer"></div>
</div>
`;

$(document).ready(function () {
    $("head").append(new_game_panel_style);
    $("body").append(new_game_panel);
});
