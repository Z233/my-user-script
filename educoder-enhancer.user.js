// ==UserScript==
// @name         Educoder enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  目前已有功能：实训作业显示完成状态以及按剩余提交时间从小到大排序
// @author       You
// @match        https://www.educoder.net/classrooms/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// ==/UserScript==

(function(window) {
    'use strict';

    const headers = new Headers({
        "Cookie": document.cookie,
    });
    const finished = "<span class='tag-style ml10' style='background-color: #5cb85c;'>已完成</span>";
    const unfinished = "<span class='tag-style ml10' style='background-color: #d9534f;'>未完成</span>";

    const re = /(?<=shixun_homework\/)\d*(?=\/detail)/;

    waitForKeyElements("#root > div > div > section > section > aside > section > section > main > section > aside.minH500.skt-loading > aside", () => {
        const $item = $("div[class^='listItem']");
        const $bottom = $("#root > div > div > section > section > aside > section > section > main > section > aside.minH500.skt-loading > aside > aside");

        // 标记完成状态
        const $links = $("div[class^='listItem'] > div[class^='info'] > div[class^='title'] > div[class^='titleLeft'] > a");
        $links.map((i, e) => {
            const url = `https://www.educoder.net/api/homework_commons/${re.exec($(e)[0].href)[0]}/works_list.json`
            fetch(url, {
                headers: headers,
            })
                .then(res => res.json())
                .then(res => {
                if(res.challenges_count == res.complete_count) {
                    $(e).parent().append(finished)
                } else {
                    $(e).parent().append(unfinished)
                }
            })

        });

        // 从小到大排序
        $item.sort((a, b) => {
            const [aDay, aHour, aMin] = $(a).find("span.ml15.c-grey-999").eq(3).text().match(/\d+/g).map(Number);
            const [bDay, bHour, bMin] = $(b).find("span.ml15.c-grey-999").eq(3).text().match(/\d+/g).map(Number);
            const aDate = parseInt(aDay) * 1440 + parseInt(aHour) * 60 + parseInt(aMin);
            const bDate = parseInt(bDay) * 1440 + parseInt(bHour) * 60 + parseInt(bMin);
            if (aDate - bDate > 0) {
                return 1;
            } else {
                return -1;
            }
        })
        $item.detach().appendTo("#root > div > div > section > section > aside > section > section > main > section > aside.minH500.skt-loading > aside");
        $bottom.detach().appendTo("#root > div > div > section > section > aside > section > section > main > section > aside.minH500.skt-loading > aside");
    });

})(window);
