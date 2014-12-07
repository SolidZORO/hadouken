// 引用
var fs = require("fs");
var rd = require('rd');
var parseString = require('xml2js').parseString;
var jade = require('jade');
var gm = require('gm');
var md = require("node-markdown").Markdown;

// #參數
// 主題
var THEME_NAME = 'sample';


// #常量
// 日誌目錄，不曉得是不是每個人的dayone目錄都是長這樣的，如果是，只要把username抽出來就好
var DIR_ENTRIES = '/Users/SolidZORO/Library/Mobile\ Documents/5U8NS4GX82\~com\~dayoneapp\~dayone/Documents/Journal_dayone/entries/';
// var DIR_ENTRIES = './test/'

// 原圖及縮略圖目錄
var DIR_BANNER_O = './attachment/origin/';
var DIR_BANNER_T = './attachment/thumbnail/';





// 存放日誌但數組
var entries = [];
var test = [];

// 存放日誌長度，模擬數組下標，遍歷完文件會還原。
var entrie_length = -1;

// 存放日誌tag的數組
var entrie_tags = [];


var entrie_tags_page = [];






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





// 因為這裏遍歷的是所有文件，參數i會把遍歷的所有文件都算上，而我需要的是經過正則判斷的文件，
// 所以不能用這個i，而用了entrie_length，所以，看起來有點怪。

// 遍歷文件 S
fs.readdirSync(DIR_ENTRIES).forEach(function (file, i) {

    // 按名字過濾日誌文件
    var regex_entrie_file = /\.doentry/;
    var result_entrie_file = regex_entrie_file.exec(file);

    // 只有*.doentry文件才處理 S
    if (result_entrie_file) {
        entrie_length++;

        // 單篇日誌對象
        var entrie = {};
        var entrie_xml = fs.readFileSync(DIR_ENTRIES + file, 'utf-8');

        // 處理日誌 S
        parseString(entrie_xml, function (err, entrie_json) {
            if (err) {
                return 'err';
            };


            // id賦值
            entrie.id = entrie_json.plist.dict[0].string[2];
            test.push(entrie.id);
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
            var M = (entrie.url.getMonth() + 1) < 10 ? '0' + (entrie.url.getMonth() + 1) : entrie.url.getMonth() + 1;
            var D = entrie.url.getDate() < 10 ? '0' + entrie.url.getDate() : entrie.url.getDate();
            var h = entrie.url.getHours() < 10 ? '0' + entrie.url.getHours() : entrie.url.getHours();
            var m = entrie.url.getMinutes() < 10 ? '0' + entrie.url.getMinutes() : entrie.url.getMinutes();
            var s = entrie.url.getSeconds() < 10 ? '0' + entrie.url.getSeconds() : entrie.url.getSeconds();
            entrie.url = Y + '-' + M + '-' + D + '-' + h + m + s;





            // 把文章內容一分為二（標題與內容）S
            var e_string = entrie_json.plist.dict[0].string[0];
            if (e_string !== '') {

                // 匹配只有 標題
                var regex_title = /(.{2,})(?:\n\n)?/;
                // 匹配有 標題 和 內容
                var regex_title_and_content = /(.{2,})(?:\n\n)?((?:.|\n)*)?/;

                // 結果只有 標題
                var result_title = regex_title.exec(e_string);
                // 結果有 標題和內容
                var result_title_and_content = regex_title_and_content.exec(e_string);


                // 如果找到標題，先賦值
                if (result_title[0]) {
                    // 標題賦值
                    entrie.title = result_title[0].replace(/[\r\n]/g, "");

                    // 與日誌匹配的圖片路徑拼接
                    var e_banner = DIR_BANNER_O + entrie.id + '.jpg';
                    // 如果找到該路徑的圖片，就賦值，然後準備一份壓縮小圖給首頁用
                    if (fs.existsSync(e_banner)) {

                        // 原圖
                        entrie.banner = e_banner;

                        // 480
                        gm(e_banner).resize(480).write(DIR_BANNER_T + '480/' + entrie.id + '.jpg', function (err) {
                            if (err) return console.dir(arguments);
                        });
                        entrie.banner_480 = DIR_BANNER_T + '480/' + entrie.id + '.jpg';
                    };


                    // 日誌內容賦值，MD轉HTML
                    if (result_title_and_content[2]) {
                        var e_text = result_title_and_content[2];
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
        entries[entrie_length] = entrie;
    }
    // 只有*.doentry文件才處理 E
});
// 遍歷文件 E



// 上面模擬數組的長度用完了，這裏還原回正常狀態
entrie_length += 1;


// 按發布日期倒序日誌排列。
var entries = entries.slice(0);
entries.sort(function (a, b) {
    return b.date_timestamp - a.date_timestamp;
});









// 首頁渲染並寫入 S
var template_index = jade.compileFile('./themes/' + THEME_NAME + '/index.jade');
var html_index = template_index({
    entries: entries
});
fs.writeFileSync('index.html', html_index);
// 首頁渲染並寫入 E
// 單篇日誌渲染並寫入 S
var template_entrie = jade.compileFile('./themes/' + THEME_NAME + '/day.jade');

// 遍歷日誌數量
for (var i = 0; i < entrie_length; i++) {
    var html_entrie = template_entrie({
        entrie: entries[i]
    });
    fs.writeFileSync('./day/' + entries[i].url + '.html', html_entrie);
}
// 單篇日誌渲染並寫入 E









// 單個tag渲染並寫入 S
var template_tag = jade.compileFile('./themes/' + THEME_NAME + '/tag.jade');

// 遍歷tag
for (var t = 0; t < entrie_tags.length; t++) {

    // 緩衝數組
    entrie_tags_page[t] = [];

    // 遍歷日誌
    for (var e = 0; e < entrie_length; e++) {

        // 過濾沒有tag的日誌
        if ((typeof (entries[e].tags)) !== 'undefined') {

            // 交叉對比，得到結果push到單個tag日誌文件裏
            if (in_array(entrie_tags[t], entries[e].tags)) {

                entrie_tags_page[t].push(entries[e]);
            }

        }
    }

    var html_tag = template_tag({
        title: entrie_tags[t],
        tags: entrie_tags_page[t]
    });

    fs.writeFileSync('./tag/' + entrie_tags[t] + '.html', html_tag);
}

// 單個tag渲染並寫入 E

console.log("日誌已輸出到index.html，共" + entrie_length + "篇。");