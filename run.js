var fs = require("fs");
var parseString = require('xml2js').parseString;
var jade = require('jade');
var gm = require('gm');
var markdown = require("markdown").markdown;
var md = require("node-markdown").Markdown;
// var sanitize = require('sanitize-caja');
// var sanitizeHtml = require('sanitize-html');
var sanitizeHtml = require('sanitize-html');
var validator = require('validator');

// 日誌目錄
// var DIR_ENTRIES = './attachment/entries/';
var DIR_ENTRIES = '/Users/SolidZORO/Library/Mobile\ Documents/5U8NS4GX82\~com\~dayoneapp\~dayone/Documents/Journal_dayone/entries/';

// 附件目錄
var DIR_PHOTOS_O = './attachment/origin/';
var DIR_PHOTOS_T = './attachment/thumbnail/';

// 配置的主題
var THEME_NAME = 'sample';

// 所有日誌
var entries = [];
var entrie_tags_book = [];






// 判斷字符是否已在數組中 2
function in_array(needle, haystack, argStrict) {
    //  discuss at: http://phpjs.org/functions/in_array/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: vlado houba
    // improved by: Jonas Sciangula Street (Joni2Back)
    //    input by: Billy
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
    //   returns 1: true
    //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
    //   returns 2: false
    //   example 3: in_array(1, ['1', '2', '3']);
    //   example 3: in_array(1, ['1', '2', '3'], false);
    //   returns 3: true
    //   returns 3: true
    //   example 4: in_array(1, ['1', '2', '3'], true);
    //   returns 4: false

    var key = '',
        strict = !!argStrict;

    //we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] == ndl)
    //in just one for, in order to improve the performance
    //deciding wich type of comparation will do before walk array
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









// 遍歷文件 S
fs.readdirSync(DIR_ENTRIES).forEach(function (file, i) {

    // 單篇日誌
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

        // console.log(entrie.date_timestamp);

        // 文章內容
        var e_string = entrie_json.plist.dict[0].string[0];

        // 把文章內容一分為二（標題與內容）S
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
                    entrie.photo = e_photo + '.jpg';

                    // 480
                    gm(e_photo).resize(480).write(DIR_PHOTOS_T + '480/' + entrie.id + '.jpg', function (err) {
                        if (err) return console.dir(arguments);
                    });
                    entrie.photo_480 = DIR_PHOTOS_T + '480/' + entrie.id + '.jpg';


                    // // 1024
                    // gm(e_photo).resize(1280).write(DIR_PHOTOS_T + '1280/' + entrie.id + '.jpg', function (err) {
                    //     if (err) return console.dir(arguments);
                    // });
                    // entrie.photo_1280 = DIR_PHOTOS_T + '1280/' + entrie.id + '.jpg';

                };




                // 內容賦制
                if (result2[2]) {
                    var e_text = result2[2];
                } else {
                    var e_text = "這篇日誌沒有內容。";
                };
                entrie.text = md(e_text);
                // entrie.text = sanitizeHtml(entrie.text);
                // entrie.text = e_text;
            }
        }
        // 把文章內容一分為二（標題與內容）S



        // 遍歷tag標籤
        if (typeof (entrie_json.plist.dict[0].array) !== "undefined") {

            // 這裏是for給全局tags_book的
            entrie.tags_arr = entrie_json.plist.dict[0].array[0].string;
            for (var i in entrie.tags_arr) {
                // 如果entrie_tags_book數組中沒有當前tag，就push到數組裏。
                // if (!inArray(entrie.tags_arr[i], entrie_tags_book)) {
                if (!in_array(entrie.tags_arr[i], entrie_tags_book)) {
                    // console.log(entrie.tags_arr[i]);
                    entrie_tags_book.push(entrie.tags_arr[i]);
                }
            }

            // 這裏是for給當前文章tags的
            entrie.tags = entrie_json.plist.dict[0].array[0].string;
            // console.log(typeof (entrie.tags));
        }

        // console.log(entrie_json.plist.dict[0].array[0].string);

        // 把單個日誌帶入entries數組

    });
    // 處理日誌 E




    // 渲染並寫入 S
    var template_entrie = jade.compile(fs.readFileSync('./themes/' + THEME_NAME + '/entrie.jade'));
    var html_entrie = template_entrie({
        entrie: entrie
    });
    fs.writeFileSync('./day/' + entrie.url + '.html', html_entrie);
    // 渲染並寫入 E

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