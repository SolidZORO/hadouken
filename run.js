// 引用
var fs = require("fs");
var sugar = require('fs-sugar');
var parseString = require('xml2js').parseString;
var jade = require('jade');
var gm = require('gm');
var md = require("node-markdown").Markdown;

// 參數
// =========================================
// 主題
var THEME_NAME = 'sample';
var USER_NAME = 'SolidZORO';
// 縮略圖大小（自定義）
var BANNER_THUMBNAIL_SIZE = '480';


// 附件目錄名字
var BANNER_ORIGIN = 'origin/';
var BANNER_THUMBNAIL = 'thumbnail/';

// 附件目錄位置
var DIR_ATTACHMENT = './attachment/';
var DIR_BANNER_ORIGIN = DIR_ATTACHMENT + BANNER_ORIGIN;
var DIR_BANNER_THUMBNAIL = DIR_ATTACHMENT + BANNER_THUMBNAIL;
var DIR_BANNER_THUMBNAIL_SIZE = DIR_BANNER_THUMBNAIL + BANNER_THUMBNAIL_SIZE + '/';
var DIR_ENTRIES_DAY = './day/';
var DIR_ENTRIES_TAG = './tag/';


// #常量
// =========================================
// 日誌目錄，不曉得是不是每個人的dayone目錄都是長這樣的，如果是，只要把username抽出來就好
var DIR_ENTRIES_SOURCE = '/Users/' + USER_NAME + '/Library/Mobile\ Documents/5U8NS4GX82\~com\~dayoneapp\~dayone/Documents/Journal_dayone/entries/';
var DIR_PHOTOS_SOURCE = '/Users/' + USER_NAME + '/Library/Mobile\ Documents/5U8NS4GX82\~com\~dayoneapp\~dayone/Documents/Journal_dayone/photos/';




// 如果dayone日誌目錄存在，才開始運行。
if (fs.existsSync(DIR_ENTRIES_SOURCE)) {

    // 清除上一次的文章
    if (fs.existsSync(DIR_ENTRIES_DAY)) {
        sugar.rmrDirSync(DIR_ENTRIES_DAY);
    }
    if (fs.existsSync(DIR_ENTRIES_TAG)) {
        sugar.rmrDirSync(DIR_ENTRIES_TAG);
    }
    if (fs.existsSync(DIR_BANNER_ORIGIN)) {
        sugar.rmrDirSync(DIR_BANNER_ORIGIN);
    }
    if (fs.existsSync(DIR_BANNER_THUMBNAIL)) {
        sugar.rmrDirSync(DIR_BANNER_THUMBNAIL);
    }



    // 創建附件文件夾
    if (!fs.existsSync(DIR_ATTACHMENT)) {
        fs.mkdirSync(DIR_ATTACHMENT);
    }

    // 創建原圖文件夾
    if (!fs.existsSync(DIR_BANNER_ORIGIN)) {
        fs.mkdirSync(DIR_BANNER_ORIGIN);
    }

    // 創建縮略圖文件夾
    if (!fs.existsSync(DIR_BANNER_THUMBNAIL)) {
        fs.mkdirSync(DIR_BANNER_THUMBNAIL);
    }

    // 創建縮略圖（自定義）文件夾
    if (!fs.existsSync(DIR_BANNER_THUMBNAIL_SIZE)) {
        fs.mkdirSync(DIR_BANNER_THUMBNAIL_SIZE);
    }

    // 如果dayone目錄存在圖片，就拷到origin目錄裡。
    if (fs.existsSync(DIR_PHOTOS_SOURCE)) {
        sugar.copyDirSync(DIR_PHOTOS_SOURCE, DIR_BANNER_ORIGIN);
    }


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
    fs.readdirSync(DIR_ENTRIES_SOURCE).forEach(function (file, i) {

        // 按名字過濾日誌文件
        var regex_entrie_file = /\.doentry/;
        var result_entrie_file = regex_entrie_file.exec(file);

        // 只有*.doentry文件才處理 S
        if (result_entrie_file) {
            entrie_length++;

            // 單篇日誌對象
            var entrie = {};
            var entrie_xml = fs.readFileSync(DIR_ENTRIES_SOURCE + file, 'utf-8');

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
                        var e_banner = DIR_BANNER_ORIGIN + entrie.id + '.jpg';

                        // 如果找到該路徑的圖片，就賦值，然後準備一份壓縮小圖給首頁用
                        if (fs.existsSync(e_banner)) {

                            // 原圖
                            entrie.banner = e_banner;

                            // 壓縮成480
                            gm(e_banner).resize(BANNER_THUMBNAIL_SIZE).write(DIR_BANNER_THUMBNAIL_SIZE + entrie.id + '.jpg', function (err) {
                                if (err) {
                                    return console.dir(arguments);
                                }
                            });

                            entrie.banner_thumbnail = DIR_BANNER_THUMBNAIL_SIZE + entrie.id + '.jpg';

                        };


                        // 日誌內容賦值，MD轉HTML
                        if (result_title_and_content[2]) {
                            var e_content = result_title_and_content[2];

                            // // 首頁用的正文(判斷10或10行。)，但是不大準。
                            var regex_content_intro = /(^(:?.*\n){0,20})/;
                            var result_content_intro = regex_content_intro.exec(e_content);
                            if (result_content_intro[0]) {
                                var e_content_intro = result_content_intro[0];
                            } else {
                                var e_content_intro = e_content;
                            }
                            entrie.content_intro = md(e_content_intro);



                            // head用的正文
                            var regex_content_desc = /(^(:?.*){0,1})/;
                            var result_content_desc = regex_content_desc.exec(e_content);
                            if (result_content_desc[0]) {
                                var e_content_desc = result_content_desc[0];
                            } else {
                                var e_content_desc = e_content;
                            }
                            entrie.content_desc = e_content_desc;


                        } else {
                            var e_content = "這篇日誌沒有內容。";
                        };

                        entrie.content = md(e_content);
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

        // jade模板賦值
        var html_entrie = template_entrie({
            entrie: entries[i]
        });

        if (!fs.existsSync(DIR_ENTRIES_DAY)) {
            fs.mkdirSync(DIR_ENTRIES_DAY);
        }
        fs.writeFileSync(DIR_ENTRIES_DAY + entries[i].url + '.html', html_entrie);

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

        // jade模板賦值
        var html_tag = template_tag({
            title: entrie_tags[t],
            tags: entrie_tags_page[t]
        });

        if (!fs.existsSync(DIR_ENTRIES_TAG)) {
            fs.mkdirSync(DIR_ENTRIES_TAG);
        }
        fs.writeFileSync(DIR_ENTRIES_TAG + entrie_tags[t] + '.html', html_tag);

    }
    // 單個tag渲染並寫入 E

    console.log("所有日誌轉換完畢，共" + entrie_length + "篇。");

}