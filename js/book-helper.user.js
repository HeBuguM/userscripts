// ==UserScript==
// @name        HeBuguM's Book Helper
// @namespace   hebugum-books-helper
// @include     https://*goodreads.com/*
// @include     https://*thestorygraph.com/*
// @version     1.26
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://hebugum.github.io/userscripts/js/book-helper.user.js
// @updateURL   https://hebugum.github.io/userscripts/js/book-helper.user.js
// @connect     chitanka.info
// @connect     185.138.176.146
// @noframes
// ==/UserScript==

// ==Code==

var spinner_icon = '<img src="https://hebugum.github.io/userscripts/assets/loading.gif" style="height: 19px">';
var search_icon = '<img src="https://hebugum.github.io/userscripts/assets/search.png" style="height: 19px">';
var libruse_domain = 'http://185.138.176.146:18082/'

var path = window.location.pathname;

$(document).ready(function () {

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
        if(today.getFullYear() < next_date.getFullYear()) {
            next_date = new Date('31 December ' + today.getFullYear());
        }

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
            $(this).attr("href", url + "?sort=title&per_page=50");
        }
    });

    //////
    ///   Goodreads Book Page
    //////////

    if (path.match(/book\/show\/(\d{1,})/)) {
        let quotes_link = $("a.DiscussionCard[href*='/work/quotes/']");
        if(quotes_link.length) {
            let main_work = quotes_link.attr("href").match(/\/work\/quotes\/(\d{1,})/);
            if(main_work) {
                let book_page_editions = '<center id="HeBuguM_leftColumn" style="margin-bottom: 10px"><a href="https://www.goodreads.com/work/editions/'+main_work[1]+'?sort=title&per_page=50" class="Button Button--secondary Button--small"><span class="Button__labelItem">All Editions</span></a></center>';
                $(".BookPage__leftColumn").find(".Sticky").append(book_page_editions);
            }
        }
    }

    //////
    ///   Goodreads Cookie Link
    //////////

    if ($("a.gr-hyperlink:contains('API')").length) {
        $("a.gr-hyperlink:contains('API')").after("<br><a class='gr-hyperlink gr-hyperlink--black' onclick=\"prompt('Cookie',document.cookie);\" style='cursor: pointer'>Cookie</a>");
    }

    /// Читанка Търсене
    if (path.match(/book\/(show|edit)\//)) {
        let title = $("h1#bookTitle").text().trim();
        if (!title && $("input#book_title").length) {
            title = $("input#book_title").val().split("(")[0].trim()
        }
        if (!title && $("h1[data-testid='bookTitle']").length) {
            title =  $("h1[data-testid='bookTitle']").text().trim()
        }

        let div_chitanka = '<div class="ChitankaDiv clearFloats bigBox" style="width: 100%;">\
        <div class="h2Container gradientHeaderContainer">\
           <h2 class="brownBackground Text Text__title3" style="margin-bottom: 1.2rem">\
                <a href="https://chitanka.info"><img src="https://hebugum.github.io/userscripts/assets/chitanka.png" style="width: 25px;float: left;margin-right: 8px;"></a> Читанка\
                <div class="changeSearchChitanka" data-title="'+ title + '" style="float: right;margin-right: 5%;margin-top: 2px; cursor: pointer"><img src="https://hebugum.github.io/userscripts/assets/search.png"></div>\
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
        } else if($(".BookPage__leftColumn")) {
            if(!$(".HeBuguM__Container").length)  {
                let HeBuguM__Container = '<hr class="Divider Divider--largeMargin" role="presentation">\
                <div class="HeBuguM__Container SocialSignalsSection">\
                    <div class="SocialSignalsSection__container">\
                        <div class="ChitankaSection SocialSignalsSection__signal" style="align-items: start;"></div>\
                        <div class="LibruseSection SocialSignalsSection__signal" style="align-items: start;"></div>\
                    </div>\
                </div>\
                <hr class="Divider Divider--largeMargin" role="presentation">';
                $(".FeaturedDetails").after(HeBuguM__Container);
                $(".ChitankaSection").append(div_chitanka);
            }
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
        if (!title && $("input#book_title").length) {
            title = $("input#book_title").val().split("(")[0].trim()
        }
        if (!title && $("h1[data-testid='bookTitle']").length) {
            title =  $("h1[data-testid='bookTitle']").text().trim()
        }

        let div_libruse = '<div class="LubruseDiv clearFloats bigBox" style="width: 100%;">\
        <div class="h2Container gradientHeaderContainer">\
           <h2 class="brownBackground Text Text__title3" style="margin-bottom: 1.2rem">\
           <a href="https://www.libruse.bg/opac/"><img src="https://hebugum.github.io/userscripts/assets/libruse.png" style="width: 25px;float: left;margin-right: 8px;"></a> Библиотека \
                <div class="changeSearchLibruse" data-title="'+ title + '" style="float: right;margin-right: 5%;margin-top: 2px; cursor: pointer"><img src="https://hebugum.github.io/userscripts/assets/search.png"></div>\
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
        } else if($(".BookPage__leftColumn")) {
            $(".LibruseSection").append(div_libruse);
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
        if(!original_title) {
            let match = "\"originalTitle\"\:\"(.*)\"\,\"awardsWon\"";
            if($("#__NEXT_DATA__").text().match(match)[1]) {
                original_title = $("#__NEXT_DATA__").text().match(match)[1];
            }
        }
        if(!original_title) {
            let match = "\"originalTitle\"\:\"(.*)\"\,\"awardsWon\"";
            if($("h1[data-testid='bookTitle']").length) {
                original_title = $("h1[data-testid='bookTitle']").text().trim();
            }
        }
        if (original_title) {
            let author = $("span[itemprop='author']").find(".authorName__container").first().find("span[itemprop='name']").text();
            if(!author) {
                author = $("a.ContributorLink").first().text();
            }
            if (author) {
                let storygraph = '<div id ="storygraph" style="display: flex;justify-content: center;">\
                   <a target="_blank" class="Button Button--secondary Button--small" href="https://app.thestorygraph.com/browse?search_term='+ encodeURIComponent(original_title + ' ' + author) + '" style="font-size: 15px;text-decoration: none;">\
                       <img src="https://hebugum.github.io/userscripts/assets/thestorygraph.png" style="float: left;height: 17px;margin-top: 1px;margin-right: 2px;">\
                       The StoryGraph</a>\
                </div>';
                if($("div#imagecol").length) {
                    $("div#imagecol").append(storygraph);
                } else if($(".BookPage__leftColumn")) {
                    $(".BookPage__leftColumn").find(".Sticky").append(storygraph);
                }
            }
        }
    }

    $("span.review-response-summary").each(function () {
        let review = $(this).text().replaceAll(" | ", "<br>");
        $(this).html(review);
    });

});

//////
///   Functions
//////////

function searchChitanka(title) {
    var found_books = [];
    $(".changeSearchChitanka").html(spinner_icon);

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://chitanka.info/search.json?q=" + encodeURIComponent(title),
        onload: function (response) {
            $(".changeSearchChitanka").attr("data-title", title).html(search_icon);
            $(".chitanka_results").html("");
            var resp = JSON.parse(response.responseText);
            console.log(resp);
            if (resp.result?.nbResults == 0) {
                $(".chitanka_results").append("Няма намерени произведения за <b>" + title + "</b>");
            }

            // Книги

           if(resp.result?.books.length) {
               $(resp.result.books.slice(0,8)).each(function (i,book) {
                   found_books.push(book.title + "|" + book.titleAuthor);
                   let div = '<div class="bookAuthorProfile__topContainer">\
<div class="bookAuthorProfile__photoContainer FeaturedPerson__avatar" style="display: inline-block;margin-right: 5px">\
<img src="https://chitanka.info/'+ book.cover + '" style="width: 55px; height: 80px">\
</div>\
<div class="bookAuthorProfile__widgetContainer" style="display: inline-block;vertical-align: top; width: calc(100% - 66px)">\
<div class="bookAuthorProfile__name Text" style="font-weight: bold;"><a href="https://chitanka.info/book/'+ book.id + '" target="_blank">' + book.title + '</a></div>\
<div class="bookAuthorProfile__followerCount Text Text__body3 Text__subdued">'+ (book.titleAuthor ?  book.titleAuthor : "") + '</div>\
<div class="bookAuthorProfile__followerCount Text Text__body3 Text__subdued">'+ (book.translators[0]?.name ? 'Превод: ' + book.translators[0]?.name : "") + '</div>\
<div class="bookAuthorProfile__followerCount Text Text__body3 Text__subdued">\
<a href="https://chitanka.info/book/'+ book.id + '.epub" target="_blank"><img src="https://hebugum.github.io/userscripts/assets/epub.png" style="width: 24px; display: inline-block;"></a>\
<a href="https://chitanka.info/book/'+ book.id + '.mobi" target="_blank"><img src="https://hebugum.github.io/userscripts/assets/amazon.png" style="width: 24px; display: inline-block;"></a>\
</div>\
</div>';
                   $(".chitanka_results").append(div);
               });
            }

            // Текстове
            if(resp.result?.texts.length) {
                $(resp.result.texts.slice(0,5)).each(function (i,text) {
                    let div = '<div class="bookAuthorProfile__topContainer" style="margin-bottom: 3px;">\
<div class="bookAuthorProfile__photoContainer FeaturedPerson__avatar Text" style="display: inline-block;margin-right: 5px">\
<img src="https://forum.chitanka.info/styles/promylib/imageset/site_logo.png" style="width: 25px">\
</div>\
<div class="bookAuthorProfile__widgetContainer" style="display: inline-block;vertical-align: top; width: calc(100% - 66px)">\
<div class="bookAuthorProfile__name" style="font-weight: bold;"><a href="https://chitanka.info/text/'+ text.id + '" target="_blank" style="margin-top: 1px;">'+ text.title + '</a></div>\
<div class="bookAuthorProfile__followerCount Text Text__body3 Text__subdued" style="margin-top: 0px;">'+ (text.authors[0]?.name ? text.authors[0]?.name : "") + '</div>\
</div>';
                    if (found_books.indexOf(text.title + "|" + text.authors[0]?.name) < 0) {
                        $(".chitanka_results").append(div);
                    }
                });
            }
        }
    });
}

function searchLibruse(title) {
    $(".changeSearchLibruse").html(spinner_icon);

    let url = libruse_domain + "/cgi-bin/koha/opac-search.pl?q=" + encodeURIComponent(title) + "&limit=branch:BLK";

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            $(".changeSearchLibruse").attr("data-title", title).html(search_icon);
            $(".libruse_results").html("");

            var doc = document.createElement('div');
            doc.innerHTML = response.responseText;

            if ($(doc).find("h1:contains('Не са открити резултати!')").length) {
                $(".libruse_results").html("Не са открити резултати!");
            } else if ($(doc).find("h1.title").length) {
                let libUrl = response.finalUrl;
                let libTitle = $(doc).find("h1.title").text();
                let libCover = '';
                if ($(doc).find("div.local-coverimg").find("img").attr("src")) {
                    libCover = libruse_domain + $(doc).find("div.local-coverimg").find("img").attr("src");
                }

                let holdings = [];
                $(doc).find("table#holdingst").find("tbody").find("tr").each(function (row) {
                    let color = "blue";
                    let status = $(this).find("td.status").text().split("(")[0].trim().replace("Заети","Заета") + ' ' + $(this).find("td.date_due").text().trim();
                    if (status.indexOf("На разположение") >= 0) {
                        status = 'На разположение'
                        color = 'green';
                    } else if (status.indexOf("читалня") >= 0) {
                        status = 'Само за читалня'
                        color = 'red';
                    }
                    holdings.push('<li class="Text Text__body3" style="color: ' + color + '">' + status + '</li>');
                });

                let div = '<div class="bookAuthorProfile__topContainer">\
    <div class="bookAuthorProfile__photoContainer FeaturedPerson__avatar" style="display: inline-block;margin-right: 5px">\
        <img src="'+ libCover + '" style="width: 55px; height: 80px" alt=" ">\
    </div>\
    <div class="bookAuthorProfile__widgetContainer" style="display: inline-block;vertical-align: top; width: calc(100% - 66px)">\
        <div class="bookAuthorProfile__name Text" style="font-weight: bold;"><a href="'+ libUrl + '" target="_blank">' + libTitle + '</a>\
    </div>\
    <div class="bookAuthorProfile__followerCount Text Text__body3 Text__subdued">'+ $(doc).find("h5.author").text() + '</div>\
    <ul style="padding-left: 1.5em">'+ holdings.join('') + '</ul>\
</div>';
                $(".libruse_results").append(div);

            } else if ($(doc).find("h1:contains('Търсенето Ви върна')").length) {
                let results = $(doc).find(".searchresults").find("table.table-striped").find("tbody").find("tr");
                if(results.length) {
                    $(results.slice(0,10)).each(function (i,result) {
                        let res_title = $(result).find("a.title").text();
                        let res_author = $(result).find("a.author").text();
                        let res_link = $(result).find("a.title").attr("href");
                        let access = $(result).find("span.label:contains('На разположение')").closest('span.results_summary').text();
                        let access_color = 'gray';
                        if(access) {
                            access = access.replace('Достъпност','').replace('Няма свободни артикули:','Няма свободни артикули');
                            if(access.indexOf('Няма свободни артикули') > -1) {
                                access_color = 'red';
                            }
                            if(access.indexOf('Артикулите ги има') > -1) {
                                access_color = 'green';
                            }
                        }

                        let div = '<div class="bookAuthorProfile__topContainer" style="margin-bottom: 3px;">\
<div class="bookAuthorProfile__photoContainer FeaturedPerson__avatar Text" style="display: inline-block;margin-right: 5px">\
<a href="'+ libruse_domain + res_link + '" target="_blank" style="float: left; margin-top: 1px;"><img src="https://www.libruse.bg/images/sign.svg" style="width: 25px"></a>\
</div>\
<div class="bookAuthorProfile__widgetContainer" style="display: inline-block;vertical-align: top; width: calc(100% - 66px)">\
<div class="bookAuthorProfile__name" style="font-weight: bold;"><a href="'+ libruse_domain + res_link + '" target="_blank">'+ res_title + '</a></div>\
<div class="bookAuthorProfile__name" style="margin-top: 0px;">'+res_author+'</div>\
<div class="bookAuthorProfile__followerCount Text Text__body4 Text__subdued" style="margin-top: 0px; margin-bottom: 10px; color: '+access_color+' !important;">'+access+'</div>\
</div>';
                        $(".libruse_results").append(div);
                    });
                }
                $(".libruse_results").append("<div><a href='" + url + "' target='_blank'>" + $(doc).find("strong:contains('Вашето търсене върна')").text() + "</a></div>");
            } else if ($(doc).find("h3:contains('Може да ползвате потребителско име и парола за временен достъп')").length) {
                $(".libruse_results").html("<a href='https://www.libruse.bg/opac/' target='_blank'>Изтекла сесия! Влезте в читателския си акаунт 🔗</a>");
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
