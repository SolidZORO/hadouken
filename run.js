// 引用
var fs = require("fs");
var parseString = require('xml2js').parseString;
var jade = require('jade');
var gm = require('gm');
var md = require("node-markdown").Markdown;

// 目錄
// var DIR_ENTRIES = './attachment/entries/';
var DIR_ENTRIES = '/Users/SolidZORO/Library/Mobile\ Documents/5U8NS4GX82\~com\~dayoneapp\~dayone/Documents/Journal_dayone/entries/';
var DIR_PHOTOS_O = './attachment/origin/';
var DIR_PHOTOS_T = './attachment/thumbnail/';

// 配置的主題
var THEME_NAME = 'sample';





// 所有日誌
var entries = [];
var entrie_tags = [];









// 遍歷文件 S
fs.readdirSync(DIR_ENTRIES).forEach(function (file, i) {

    var entrie = {};

    var entrie_xml = fs.readFileSync(DIR_ENTRIES + file, 'utf-8');
    parseString(entrie_xml, function (err, entrie_json) {
        if (err) {
            return 'err';
        };

        // id賦值
        entrie.id = entrie_json.plist.dict[0].string[2];

        // 日期賦值
        entrie.date = entrie_json.plist.dict[0].date[0];

        // 處理時間格式，原格式為 2014-11-23T15:32:15Z
        entrie.date = entrie.date.replace(/T/, " ");
        entrie.date = entrie.date.replace(/Z/, '');
        entrie.date_timestamp = new Date(entrie.date);
        entrie.date_timestamp = entrie.date_timestamp.getTime() / 1000;

        // 通過文章日期處理成url
        entrie.url = new Date(entrie.date_timestamp * 1000);
        var Y = entrie.url.getFullYear();
        var M = (entrie.url.getMonth() + 1 < 10 ? '0' + (entrie.url.getMonth() + 1) : entrie.url.getMonth() + 1);
        var D = entrie.url.getDate() < 10 ? '0' + entrie.url.getDate() : entrie.url.getDate();
        var h = entrie.url.getHours() < 10 ? '0' + entrie.url.getHours() : entrie.url.getHours();
        var m = entrie.url.getMinutes() < 10 ? '0' + entrie.url.getMinutes() : entrie.url.getMinutes();
        var s = entrie.url.getSeconds() < 10 ? '0' + entrie.url.getSeconds() : entrie.url.getSeconds();
        entrie.url = Y + '-' + M + '-' + D + '-' + h + m + s;





        // 把文章內容一分為二（標題與內容）S
        var e_string = entrie_json.plist.dict[0].string[0];
        if (e_string !== '') {

            // 匹配只有 標題
            var reg1 = /(.{2,})(?:\n\n)?/;
            // 匹配有 標題 和 內容
            var reg2 = /(.{2,})(?:\n\n)?((?:.|\n)*)?/;

            // 結果只有 標題
            var result1 = reg1.exec(e_string);
            // 結果有 標題和內容
            var result2 = reg2.exec(e_string);


            // 如果找到標題，先賦值
            if (result1[0]) {
                // 標題賦值
                entrie.title = result1[0].replace(/[\r\n]/g, "");

                // 與日誌匹配的圖片路徑拼接
                var e_photo = DIR_PHOTOS_O + entrie.id + '.jpg';
                // 如果找到該路徑的圖片，就賦值，然後準備一份壓縮小圖給首頁用
                if (fs.existsSync(e_photo)) {

                    // 原圖
                    entrie.photo = e_photo;

                    // 480
                    gm(e_photo).resize(480).write(DIR_PHOTOS_T + '480/' + entrie.id + '.jpg', function (err) {
                        if (err) return console.dir(arguments);
                    });
                    entrie.photo_480 = DIR_PHOTOS_T + '480/' + entrie.id + '.jpg';
                };


                // 日誌內容賦值，MD轉HTML
                if (result2[2]) {
                    var e_text = result2[2];
                } else {
                    var e_text = "這篇日誌沒有內容。";
                };
                entrie.text = md(e_text);
            }
        }
        // 把文章內容一分為二（標題與內容）E



        // 遍歷tag標籤 S
        if (typeof (entrie_json.plist.dict[0].array) !== "undefined") {
            entrie.tags_arr = entrie_json.plist.dict[0].array[0].string;
            for (var i in entrie.tags_arr) {

                // 判斷字符是否已在數組中
                function in_array(needle, haystack, argStrict) {
                    var key = '',
                        strict = !!argStrict;

                    if (strict) {
                        for (key in haystack) {
                            if (haystack[key] === needle) {
                                return true;
                            }
                        }
                    } else {
                        for (key in haystack) {
                            if (haystack[key] == needle) {
                                return true;
                            }
                        }
                    }

                    return false;
                }

                // 如果entrie_tags數組中沒有當前tag，就push到數組裏。
                if (!in_array(entrie.tags_arr[i], entrie_tags)) {
                    entrie_tags.push(entrie.tags_arr[i]);
                }
            }
            // 這裏是for給當前文章tags的
            entrie.tags = entrie_json.plist.dict[0].array[0].string;
        }
        // 遍歷tag標籤 E


    });
    // 處理日誌 E




    // 渲染並寫入 S
    var template_entrie = jade.compile(fs.readFileSync('./themes/' + THEME_NAME + '/entrie.jade'));
    var html_entrie = template_entrie({
        entrie: entrie
    });
    fs.writeFileSync('./day/' + entrie.url + '.html', html_entrie);
    // 渲染並寫入 E



    // 單篇日誌裝入日誌合集
    entries[i] = entrie;

});
// 遍歷 E



// 按發布日期倒序日誌排列。
var entries = entries.slice(0);
entries.sort(function (a, b) {
    return b.date_timestamp - a.date_timestamp;
});









// 渲染並寫入 S
var template_index = jade.compile(fs.readFileSync('./themes/' + THEME_NAME + '/index.jade'));
var html_index = template_index({
    entries: entries
});
fs.writeFileSync('index.html', html_index);
// 渲染並寫入 E

console.log("日誌已輸出到index.html");