// ==UserScript==
// @name        HeBuguM's Book Helper
// @namespace   hebugum-books-helper
// @include     https://*goodreads.com/*
// @include     https://*thestorygraph.com/*
// @version     1.01
// @noframes
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://hebugum.github.io/userscripts/book-helper.user.js
// @connect     chitanka.info
// @connect     185.138.176.146
// ==/UserScript==

// ==Code==

$(document).ready(function () {

    var path = window.location.pathname;

    //////
    // Goodread Challenge
    //////////

    if ($(".readingChallenge").length > 0) {
        var _this = $(".readingChallenge");
        var target = parseInt(_this.find("progress").attr("max"));
        var current = parseInt(_this.find("progress").attr("value"));

        var today = new Date();
        var days_a_book = daysInYear(today.getFullYear()) / target;

        var next_date = new Date('01 January ' + today.getFullYear());
        var next_date_day_number = (next_date.getDate() + (days_a_book * (current + 1)));
        next_date.setDate(next_date_day_number - 1);

        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = today.getTime() - next_date.getTime();
        var days = millisBetween / millisecondsPerDay;
        var days_left = Math.floor(days) * -1;

        var days_left_html = ''
        var date_left_title = next_date.getDate() + ' ' + (next_date.toLocaleString('bg', { month: 'long' })) + ', ' + (next_date.toLocaleString('bg', { weekday: 'long' }));
        if (days_left > 0) {
            days_left_html = '<div class="readingChallengeStatusBox__message" title="' + date_left_title + '"><small>' + days_left + ' days ahead!</small></div>';
        } else if (days_left == 0) {
            days_left_html = '<div class="readingChallengeStatusBox__message" title="' + date_left_title + '"><small>Finish your book today!</small></div>';
        } else if (days_left < 0) {
            days_left_html = '<div class="readingChallengeStatusBox__message" title="' + date_left_title + '"><small>' + days_left * -1 + ' days behind!</small></div>';
        }
        $(".readingChallenge").find(".gr-progressBar").append(days_left_html);
    }

    //////
    // Goodreads Other Editions
    //////////

    $("a[href*='work/editions/']").each(function () {
        let url = $(this).attr("href");
        if ($(this).text().match(/\d{1,} edition/)) {
            let title_link = $(this).closest("td").find("a.bookTitle")
            let edition_url = title_link.attr("href");
            if (edition_url) {
                let match_id = edition_url.match(/\/book\/show\/(\d{1,})/);
                if (match_id) {
                    title_link.after("<a class='inter uitext greyText right' href='/book/edit/" + match_id[1] + "'>✎</a>");
                }
            }
        }
        if (url.indexOf("?") < 0) {
            $(this).attr("href", url + "?sort=title");
        }
    });

    //////
    ///   Goodreads Book Page
    //////////

    /// Читанка Търсене
    if (path.match(/book\/(show|edit)\//)) {
        let title = $("h1#bookTitle").text().trim();
        if (!title) {
            title = $("input#book_title").val().split("(")[0].trim()
        }

        let div_chitanka = '<div class=" clearFloats bigBox">\
        <div class="h2Container gradientHeaderContainer">\
           <h2 class="brownBackground"><a href="https://chitanka.info"><img src="https://forum.chitanka.info/styles/promylib/imageset/site_logo.png" style="width: 25px;float: left;margin-right: 8px;"></a> Читанка\
                <div class="changeSearchChitanka" data-title="'+ title + '" style="float: right;margin-right: 5px;margin-top: 2px; cursor: pointer"><img src="https://s.gr-assets.com/assets/layout/header/icn_nav_search.svg"></div>\
           </h2>\
        </div>\
        <div class="bigBoxBody">\
        <div class="bigBoxContent containerWithHeaderContent">\
        <div class="smallText chitanka_results"></div>\
        <div class="clear"></div></div></div><div class="bigBoxBottom"></div></div>';
        if ($('.recommendItBar').length) {
            $('.recommendItBar').after(div_chitanka);
        } else if ($(".rightContainer").length) {
            $("a:contains('Delete Photo')").next().next().after(div_chitanka)
        }

        searchChitanka(title);
    }

    $(document).on("click", ".changeSearchChitanka", function () {
        var new_search = prompt("Читанка търсене:", $(this).attr("data-title"));
        if (new_search) {
            searchChitanka(new_search);
        }
    });

    //////
    ///   Регионална Библиотека "Любен Каравелов" - Русе
    //////////

    if (path.match(/book\/(show|edit)\//)) {
        let title = $("h1#bookTitle").text().trim();
        if (!title) {
            title = $("input#book_title").val().split("(")[0].trim()
        }

        let div_libruse = '<div class=" clearFloats bigBox">\
        <div class="h2Container gradientHeaderContainer">\
           <h2 class="brownBackground"><a href="https://www.libruse.bg/opac/"><img src="https://www.libruse.bg/images/sign.svg" style="width: 25px;float: left;margin-right: 8px;"></a> Библиотека "Любен Каравелов" \
                <div class="changeSearchLibruse" data-title="'+ title + '" style="float: right;margin-right: 5px;margin-top: 2px; cursor: pointer"><img src="https://s.gr-assets.com/assets/layout/header/icn_nav_search.svg"></div>\
           </h2>\
        </div>\
        <div class="bigBoxBody">\
        <div class="bigBoxContent containerWithHeaderContent">\
        <div class="smallText libruse_results"></div>\
        <div class="clear"></div></div></div><div class="bigBoxBottom"></div></div>';
        if ($('.recommendItBar').length) {
            $('.recommendItBar').after(div_libruse);
        } else if ($(".rightContainer").length) {
            $("a:contains('Delete Photo')").next().next().after(div_libruse)
        }

        searchLibruse(title);
    }

    $(document).on("click", ".changeSearchLibruse", function () {
        var new_search = prompt('Библиотека "Любен Каравелов" търсене:', $(this).attr("data-title"));
        if (new_search) {
            searchLibruse(new_search);
        }
    });

    //////
    ///   The StoryGrapth
    //////////

    // The Story Graph Link
    if (path.match(/book\/show\//)) {
        let original_title = $("div.infoBoxRowTitle:contains('Original Title')").next().text();
        if (original_title) {
            let author = $("span[itemprop='author']").find(".authorName__container").first().find("span[itemprop='name']").text();
            if (author) {
                let storygraph = '<div id ="storygraph" style="display: flex;justify-content: center;">\
                   <a target="_blank" href="https://app.thestorygraph.com/browse?search_term='+ encodeURIComponent(original_title + ' ' + author) + '" style="font-size: 15px;color: black;text-decoration: none;">\
                       <img src="https://app.thestorygraph.com/icons/apple-icon-60x60.png" style="float: left;height: 26px;margin-top: -6px;">\
                       The StoryGraph</a>\
                </div>';
                $("div#imagecol").append(storygraph);
                console.log(original_title, author);
            }
        }
    }

    $("span.review-response-summary").each(function () {
        let review = $(this).text().replaceAll(" | ", "<br>");
        $(this).html(review);
    });

});

function searchChitanka(title) {
    var spinner_html = '<div class="spinnerContainer"><div class="spinner"><div class="spinner__mask"><div class="spinner__maskedCircle"></div></div></div></div>';
    var search_html = '<img src="https://s.gr-assets.com/assets/layout/header/icn_nav_search.svg">';
    var found_books = [];
    $(".changeSearchChitanka").html(spinner_html);

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://chitanka.info/search.json?q=" + encodeURIComponent(title),
        onload: function (response) {
            $(".changeSearchChitanka").attr("data-title", title).html(search_html);
            $(".chitanka_results").html("");
            var resp = JSON.parse(response.responseText);
            if (resp.result.nbResults == 0) {
                $(".chitanka_results").append("Няма намерени произведения за <b>" + title + "</b>");
            }

            // Книги
            resp.result.books.each(function (book) {
                found_books.push(book.title + "|" + book.titleAuthor);
                var div = '<div class="bookAuthorProfile__topContainer">\
    <div class="bookAuthorProfile__photoContainer">\
        <img src="https://chitanka.info/'+ book.cover + '" style="max-width: 65px; max-height: 85px"></div>\
        <div class="bookAuthorProfile__widgetContainer" style="vertical-align: top; width: calc(100% - 85px)">\
        <div class="bookAuthorProfile__name" style="font-size: 14px;"><a href="https://chitanka.info/book/'+ book.id + '" target="_blank">' + book.title + '</a></div>\
        <div class="bookAuthorProfile__followerCount">'+ book.titleAuthor + '</div>\
        <div class="bookAuthorProfile__followerCount">Превод: '+ book.translators[0]?.name + '</div>\
        <div class="bookAuthorProfile__followerCount">\
        <a href="https://chitanka.info/book/'+ book.id + '.epub" target="_blank"><img src="https://gobooks.com/images/epub-icon.svg" style="width: 25px"></a>\
    </div>\
</div>';
                $(".chitanka_results").append(div);
            });

            // Текстове
            resp.result.texts.each(function (text) {
                var div = '<div class="bookAuthorProfile__topContainer" style="margin-bottom: 3px;">\
    <div class="bookAuthorProfile__photoContainer" style="margin-right: 5px">\
        <a href="https://chitanka.info/text/'+ text.id + '" target="_blank" style="float: left; margin-top: 1px;"><img src="https://forum.chitanka.info/styles/promylib/imageset/site_logo.png" style="width: 25px"></a>\
    </div>\
    <div class="bookAuthorProfile__widgetContainer" style="vertical-align: top; width: calc(100% - 85px)">\
    <div class="bookAuthorProfile__name" style="font-size: 12px;">'+ text.title + '</div>\
    <div class="bookAuthorProfile__followerCount" style="margin-top: 0px;">'+ text.authors[0]?.name + '</div>\
</div>';
                if (found_books.indexOf(text.title + "|" + text.authors[0]?.name) < 0) {
                    $(".chitanka_results").append(div);
                }
            });
        }
    });
}

function searchLibruse(title) {
    var spinner_html = '<div class="spinnerContainer"><div class="spinner"><div class="spinner__mask"><div class="spinner__maskedCircle"></div></div></div></div>';
    var search_html = '<img src="https://s.gr-assets.com/assets/layout/header/icn_nav_search.svg">';
    var found_books = [];
    $(".changeSearchLibruse").html(spinner_html);
    let domain = 'http://185.138.176.146:18082'
    let url = domain + "/cgi-bin/koha/opac-search.pl?q=" + encodeURIComponent(title) + "&limit=branch:BLK";

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            $(".changeSearchLibruse").attr("data-title", title).html(search_html);
            $(".libruse_results").html("");

            var doc = document.createElement('div');
            doc.innerHTML = response.responseText;

            if ($(doc).find("strong:contains('Не са открити резултати!')").length) {
                $(".libruse_results").html("Не са открити резултати!");
            } else if ($(doc).find("h5:contains('Нямате читателска карта')").length) {
                $(".libruse_results").html("<a href='https://www.libruse.bg/opac/' target='_blank'>Вход</a>");
            } else if ($(doc).find("h1.title").length) {
                let libUrl = response.finalUrl;
                let libTitle = $(doc).find("h1.title").text();
                let libCover = '';
                if ($(doc).find("a.localimage").find("img").attr("src")) {
                    libCover = domain + $(doc).find("a.localimage").find("img").attr("src");
                }

                let holdings = [];
                $(doc).find("table#holdingst").find("tbody").find("tr").each(function (row) {
                    let color = "blue";
                    let status = $(this).find("td.status").text().split("(")[0].trim() + ' ' + $(this).find("td.date_due").text().trim();
                    if (status.indexOf("Достъпен") >= 0) {
                        status = 'Свободна'
                        color = 'green';
                    } else if (status.indexOf("читалня") >= 0) {
                        status = 'Хранилище'
                        color = 'red';
                    }
                    holdings.push('<li style="color: ' + color + '">' + status + '</li>');
                });

                var div = '<div class="bookAuthorProfile__topContainer">\
    <div class="bookAuthorProfile__photoContainer">\
        <img src="'+ libCover + '" style="max-width: 65px; max-height: 85px">\
    </div>\
    <div class="bookAuthorProfile__widgetContainer" style="vertical-align: top; width: calc(100% - 85px)">\
        <div class="bookAuthorProfile__name" style="font-size: 14px;"><a href="'+ libUrl + '" target="_blank">' + libTitle + '</a>\
    </div>\
    <div class="bookAuthorProfile__followerCount">'+ $(doc).find("h5.author").text() + '</div>\
    <ul>'+ holdings.join('') + '</ul>\
</div>';
                $(".libruse_results").append(div);

            } else if ($(doc).find("strong:contains('Вашето търсене върна')").length) {
                $(".libruse_results").html("<a href='" + url + "' target='_blank'>" + $(doc).find("strong:contains('Вашето търсене върна')").text() + "</a>");
            } else {
                $(".libruse_results").html("<a href='" + url + "' target='_blank'>Виж резултата от търсенето</a>");
            }

        }
    });
}

function daysInYear(year) {
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        return 366;
    } else {
        return 365;
    }
}