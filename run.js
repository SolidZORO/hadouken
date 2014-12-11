/*
     __  _____    ____  ____  __  ____ __ _______   __
    / / / /   |  / __ \/ __ \/ / / / //_// ____/ | / /
   / /_/ / /| | / / / / / / / / / / ,<  / __/ /  |/ /
  / __  / ___ |/ /_/ / /_/ / /_/ / /| |/ /___/ /|  /
 /_/ /_/_/  |_/_____/\____/\____/_/ |_/_____/_/ |_/

 HADOUKEN是一個用nodejs寫的dayone日誌轉換工具，用於把dayone的日誌處理成html。
 SolidZORO 2014-12-10 19:53:13
*/



// 引用組件
var fs = require("fs");
var sugar = require('fs-sugar');
var xml2js = require('xml2js').parseString;
var jade = require('jade');
var gm = require('gm');
var md = require("node-markdown").Markdown;





/////////////////////////////////////////////////////////////
// 參數
// 配置
var CONFIG = {
    // 主題
    THEME: 'ryu',
    // OSX系統用戶名
    USERNAME: 'SolidZORO',
    // 站點名稱
    SITE_NAME: 'SolidZORO',
    // 站點說明
    SITE_DESC: '黑魔法師。',
    // 站點網址
    SITE_URL: 'http://solidzoro.com',
    // 輸出首頁的名字，如果你的站點index.html已被佔用，可改成其他。
    INDEX: 'index.html',
    // 縮略圖大小（自定義）
    BANNER_THUMB_SIZE: '480',
    // 几篇日志翻一页？
    PAGE_NUM: 15,
    // 如果日誌中有這個Tag，則不生成到html中。
    KEEP_LOCAL: '秘密',
    // 自定義閱讀
    READ_MORE: '閱讀全文',


    ATTACHMENT: 'attachment',
    BANNER_ORIGIN: 'origin',
    BANNER_THUMB: 'thumb',

    DAY: 'day',
    TAG: 'tag',
    PAGE: 'p'
}

// 路徑
var PATH = {
    ATTACHMENT: './' + CONFIG.ATTACHMENT + '/',
    BANNER_ORIGIN: './' + CONFIG.ATTACHMENT + '/' + CONFIG.BANNER_ORIGIN + '/',
    BANNER_THUMB: './' + CONFIG.ATTACHMENT + '/' + CONFIG.BANNER_THUMB + '/',
    BANNER_THUMB_SIZE: './' + CONFIG.ATTACHMENT + '/' + CONFIG.BANNER_THUMB + '/' + CONFIG.BANNER_THUMB_SIZE + '/',

    DAY: './' + CONFIG.DAY + '/',
    TAG: './' + CONFIG.TAG + '/',
    PAGE: './' + CONFIG.PAGE + '/',
    DAYONE_ENTRIES: '/Users/' + CONFIG.USERNAME + '/Library/Mobile\ Documents/5U8NS4GX82\~com\~dayoneapp\~dayone/Documents/Journal_dayone/entries/',
    DAYONE_PHOTOS: '/Users/' + CONFIG.USERNAME + '/Library/Mobile\ Documents/5U8NS4GX82\~com\~dayoneapp\~dayone/Documents/Journal_dayone/photos/'
}

// dayone的新功能，會用陀螺儀自動獲取你的狀態，如果拿著手機跑，就是Running，這條信息會插在string數組的最上方。
// 這就導致了數組排序變化，出現判斷失誤問題。所以要做對比，給沒有狀態的日誌splice加入空狀態。
var ACTIVITY = ['Stationary', 'Walking', 'Running', 'Biking', 'Easting', 'Automotive', 'Flying', 'Train'];







/////////////////////////////////////////////////////////////
// #變量
// [數組] 所有日誌，entries實在不好拼，所以取簡單一點的day好了，而且我去掉了複數。
var all_day = [];

// 日誌長度
var all_day_length = 0;

// [數組] 所有Tag
var all_tag = [];

// [數組] 聚合Tag的頁面
var tag_collection = [];






/////////////////////////////////////////////////////////////
// #函數
// 判斷字符是否已在數組中 S
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
// 判斷字符是否已在數組中 E




// 檢查路徑
// console.log(CONFIG.ATTACHMENT);
// console.log(CONFIG.BANNER_ORIGIN);
// console.log(CONFIG.BANNER_THUMB);
// console.log(CONFIG.BANNER_THUMB_SIZE);
// console.log(CONFIG.DAY);
// console.log(CONFIG.TAG);
// console.log(CONFIG.PAGE);
// console.log('--------------------------');
// console.log(PATH.ATTACHMENT);
// console.log(PATH.BANNER_ORIGIN);
// console.log(PATH.BANNER_THUMB);
// console.log(PATH.BANNER_THUMB_SIZE);
// console.log(PATH.DAY);
// console.log(PATH.TAG);
// console.log(PATH.PAGE);
// console.log(PATH.DAYONE_ENTRIES);
// console.log(PATH.DAYONE_PHOTOS);








/////////////////////////////////////////////////////////////
// 如果dayone日誌目錄存在，才開始運行。
/////////////////////////////////////////////////////////////
if (fs.existsSync(PATH.DAYONE_ENTRIES)) {



    /////////////////////////////////////////////////////////////
    // 清除文件夾
    /////////////////////////////////////////////////////////////
    // 日誌詳細頁
    if (fs.existsSync(PATH.DAY)) {
        sugar.rmrDirSync(PATH.DAY);
    }
    // 日誌Tag
    if (fs.existsSync(PATH.TAG)) {
        sugar.rmrDirSync(PATH.TAG);
    }
    // 日誌頁數
    if (fs.existsSync(PATH.PAGE)) {
        sugar.rmrDirSync(PATH.PAGE);
    }
    // 原圖
    if (fs.existsSync(PATH.BANNER_ORIGIN)) {
        sugar.rmrDirSync(PATH.BANNER_ORIGIN);
    }
    // 縮略圖（以及各種尺寸縮略圖一起清了）
    if (fs.existsSync(PATH.BANNER_THUMB)) {
        sugar.rmrDirSync(PATH.BANNER_THUMB);
    }


    /////////////////////////////////////////////////////////////
    // 創建文件夾
    /////////////////////////////////////////////////////////////
    // 日誌詳細頁
    if (!fs.existsSync(PATH.DAY)) {
        fs.mkdirSync(PATH.DAY);
    }
    // 日誌Tag
    if (!fs.existsSync(PATH.TAG)) {
        fs.mkdirSync(PATH.TAG);
    }
    // 日誌頁數
    if (!fs.existsSync(PATH.PAGE)) {
        fs.mkdirSync(PATH.PAGE);
    }
    // 附件目錄
    if (!fs.existsSync(PATH.ATTACHMENT)) {
        fs.mkdirSync(PATH.ATTACHMENT);
    }
    // 原圖
    if (!fs.existsSync(PATH.BANNER_ORIGIN)) {
        fs.mkdirSync(PATH.BANNER_ORIGIN);
    }
    // 如果dayone目錄存在圖片，就拷到origin目錄裡。
    if (fs.existsSync(PATH.DAYONE_PHOTOS)) {
        sugar.copyDirSync(PATH.DAYONE_PHOTOS, PATH.BANNER_ORIGIN);
    }
    // 縮略圖
    if (!fs.existsSync(PATH.BANNER_THUMB)) {
        fs.mkdirSync(PATH.BANNER_THUMB);
    }
    // 縮略圖（帶有自定義尺寸的）
    if (!fs.existsSync(PATH.BANNER_THUMB_SIZE)) {
        fs.mkdirSync(PATH.BANNER_THUMB_SIZE);
    }

    /////////////////////////////////////////////////////////////
    // 遍歷dayone日誌 S
    // readdirSync裡的i計數器其實沒有用到，因為我初始化了 all_day_length。
    /////////////////////////////////////////////////////////////
    fs.readdirSync(PATH.DAYONE_ENTRIES).forEach(function (file, i) {

        // 過濾.doentry後綴的文件
        var regex_dayone = /\.doentry/;
        var result_dayone = regex_dayone.exec(file);

        // 假如找到了dayone日誌文件，就開始處理它們 S
        if (result_dayone) {

            // 讀取dayone的日誌文件（其實就是xml）
            var day_xml = fs.readFileSync(PATH.DAYONE_ENTRIES + file, 'utf-8');

            // 處理日誌，簡直就是浩大的工程！ S
            xml2js(day_xml, function (err, day_json) {
                if (err) {
                    return 'err';
                };



                // 如果日誌tags裏有「秘密」或你自定義的隱私keyword，就排除掉這篇日誌 S
                if (!in_array(CONFIG.KEEP_LOCAL, day_json.plist.dict[0].array[0].string)) {

                    // [對象] 每一個日誌都是一個對象，這個{}一定要放在這裏，放在外面就bug了。大坑啊！
                    // TODO，如果知道原理的同學可以告訴我一下原理： solidzoro __ icloud __ com
                    var day = {};

                    // 狀態，如果日誌沒有狀態，就設定為空''
                    if (!in_array(day_json.plist.dict[0].string[0], ACTIVITY)) {
                        day_json.plist.dict[0].string.splice(0, 0, '');
                    }
                    day.activity = day_json.plist.dict[0].string[0];


                    // ID
                    day.id = day_json.plist.dict[0].string[3];


                    // 日期（原格式為 2014-11-23T15:32:15Z）
                    day.source_date = day_json.plist.dict[0].date[0];


                    // 處理時間
                    day.source_date = day.source_date.replace(/T/, " ");
                    day.source_date = day.source_date.replace(/Z/, '');

                    day.timestamp = new Date(day.source_date);
                    day.timestamp = day.timestamp.getTime() / 1000;
                    day.source_timestamp = new Date(day.timestamp * 1000);

                    var day_date_Y = day.source_timestamp.getFullYear();
                    var day_date_M = (day.source_timestamp.getMonth() + 1) < 10 ? '0' + (day.source_timestamp.getMonth() + 1) : day.source_timestamp.getMonth() + 1;
                    var day_date_D = day.source_timestamp.getDate() < 10 ? '0' + day.source_timestamp.getDate() : day.source_timestamp.getDate();
                    var day_date_h = day.source_timestamp.getHours() < 10 ? '0' + day.source_timestamp.getHours() : day.source_timestamp.getHours();
                    var day_date_m = day.source_timestamp.getMinutes() < 10 ? '0' + day.source_timestamp.getMinutes() : day.source_timestamp.getMinutes();
                    var day_date_s = day.source_timestamp.getSeconds() < 10 ? '0' + day.source_timestamp.getSeconds() : day.source_timestamp.getSeconds();

                    day.date = day_date_Y + '-' + day_date_M + '-' + day_date_D;
                    day.date_zh = day_date_Y + '年 ' + day_date_M + '月 ' + day_date_D + '日';

                    // URL
                    day.url = day_date_Y + '-' + day_date_M + '-' + day_date_D + '-' + day_date_h + day_date_m + day_date_s;



                    // 把只有一個字段的日誌分解成 標題與內容，順便把配圖也找一下 S
                    day.source_title_and_content = day_json.plist.dict[0].string[1];

                    if (day.source_title_and_content !== '') {

                        // 正則 標題
                        var regex_title = /(.{2,})(?:\n\n)?/;
                        // 正則 標題+內容
                        var regex_title_and_content = /(.{2,})(?:\n\n)?((?:.|\n)*)?/;

                        // 結果 標題
                        var result_title = regex_title.exec(day.source_title_and_content);
                        // 結果 標題+內容
                        var result_title_and_content = regex_title_and_content.exec(day.source_title_and_content);


                        // 假如日誌有標題的話
                        if (result_title[0]) {

                            // 標題賦值（去掉還行）
                            day.title = result_title[0].replace(/[\r\n]/g, "");

                            // 處理日誌內容，以及markdown化 S
                            if (result_title_and_content[2]) {
                                day.source_content = result_title_and_content[2];

                                // 擷取more
                                var regex_content_more = /((:?.|\n)*?)<!--\s?more\s?-->/;
                                var result_content_more = regex_content_more.exec(day.source_content);

                                if (result_content_more !== null) {
                                    // var more = '[' + CONFIG.READ_MORE + '](../day/' + day.url + '.html){class="read_more"}';
                                    var more = '<a href="../day/' + day.url + '.html" class="read_more">' + CONFIG.READ_MORE + '</a>';
                                    day.content_list_html = md(result_content_more[1] + more);
                                }

                                day.content = day.source_content;
                            } else {
                                day.content = "這篇日誌沒有內容。";
                            };

                            day.content_html = md(day.content);
                            // 處理日誌內容，以及markdown化 S



                            // 拼接日誌配圖路徑（都是jpg的，如果不是jpg，dayone也會轉成jpg）
                            day.source_banner = PATH.BANNER_ORIGIN + day.id + '.jpg';


                            // 如果找到日誌配圖圖片，就賦值並壓縮小圖 S
                            if (fs.existsSync(day.source_banner)) {

                                // 原圖
                                day.banner_origin = day.source_banner;

                                // 壓縮成指定大小的圖片
                                gm(day.banner_origin).resize(CONFIG.BANNER_THUMB_SIZE).write(PATH.BANNER_THUMB_SIZE + day.id + '.jpg', function (err) {
                                    if (err) {
                                        return console.dir(arguments);
                                    }
                                });

                                // 縮略圖
                                day.banner_thumb = PATH.BANNER_THUMB_SIZE + day.id + '.jpg';

                            };
                            // 如果找到日誌配圖圖片，就賦值並壓縮小圖 E


                        }
                    }
                    // 把文章內容一分為二（標題與內容）E



                    // 遍歷日誌Tag S
                    if (typeof (day_json.plist.dict[0].array) !== "undefined") {

                        day.source_tags = day_json.plist.dict[0].array[0].string;

                        // 這裏for只是用來遍歷tag，把all_tag裏不存在的tag壓到all_tag裏
                        for (var i in day.source_tags) {
                            if (!in_array(day.source_tags[i], all_tag)) {
                                all_tag.push(day.source_tags[i]);
                            }
                        }

                        // 這裏為什麼有這個？？
                        day.tags = day.source_tags;
                    }
                    // 遍歷日誌Tag E


                    // 全部處理完後就賦值給日誌數組
                    all_day[all_day_length] = day;
                    all_day_length++;
                }
                // 如果日誌tags裏有「秘密」或你自定義的隱私keyword，就排除掉這篇日誌 E

            });
            // 處理日誌，簡直就是浩大的工程！ E



            // console.log(day.title);
            // all_day.push(day);
        }
        // 假如找到了dayone日誌文件，就開始處理它們 E



    });
    // 遍歷dayone日誌 E







    /////////////////////////////////////////////////////////////
    // 按發布日期倒序日誌排列。
    /////////////////////////////////////////////////////////////
    all_day = all_day.slice(0);
    all_day.sort(function (a, b) {
        return b.timestamp - a.timestamp;
    });





    /////////////////////////////////////////////////////////////
    // 通用分頁計數器
    /////////////////////////////////////////////////////////////
    // 對日誌總數取餘
    var totle_page_num_temp1 = all_day_length % CONFIG.PAGE_NUM;
    // 計算日誌的頁數
    var totle_page_num_temp2 = all_day_length / CONFIG.PAGE_NUM;

    // 如果 日誌總數/每頁日誌數==0（比如15%5，剛好除盡，就給3頁）
    if (totle_page_num_temp1 == 0) {
        var totle_page_num = totle_page_num_temp2;
    } else {
        var totle_page_num = (parseInt(totle_page_num_temp2)) + 1;
    };









    /////////////////////////////////////////////////////////////
    // 首頁渲染並寫入 S
    /////////////////////////////////////////////////////////////
    var all_day_index = [];
    for (var i = 0; i < CONFIG.PAGE_NUM; i++) {
        all_day_index.push(all_day[i]);
    }
    var jade_index = jade.compileFile('./themes/' + CONFIG.THEME + '/index.jade');
    var html_data = jade_index({
        HOME_PATH: './',
        BODY_CLASS: 'katana-list katana-index',
        CONFIG: CONFIG,
        PATH: PATH,
        totle_page_num: totle_page_num,
        current_page_num: 1,
        datas: all_day_index
    });
    fs.writeFileSync(CONFIG.INDEX, html_data);
    // 首頁渲染並寫入 E






    /////////////////////////////////////////////////////////////
    // 單篇日誌渲染並寫入 S
    /////////////////////////////////////////////////////////////
    var jade_day = jade.compileFile('./themes/' + CONFIG.THEME + '/day.jade');

    // 遍歷日誌數量
    for (var i = 0; i < all_day_length; i++) {

        // jade模板賦值
        var html_data = jade_day({
            HOME_PATH: '../',
            BODY_CLASS: 'katana-detaile katana-day',
            CONFIG: CONFIG,
            PATH: PATH,
            title: all_day[i].title,
            data: all_day[i]
        });


        if (!fs.existsSync(PATH.DAY)) {
            fs.mkdirSync(PATH.DAY);
        }
        fs.writeFileSync(PATH.DAY + all_day[i].url + '.html', html_data);

    }
    // 單篇日誌渲染並寫入 E







    /////////////////////////////////////////////////////////////
    // 日誌分頁染並寫入 S
    /////////////////////////////////////////////////////////////
    // [數組] 存放Page頁
    var one_page = [];
    var jade_page = jade.compileFile('./themes/' + CONFIG.THEME + '/page.jade');

    for (var i = 0, p = 0; i < all_day_length; i += CONFIG.PAGE_NUM) {

        one_page.push(all_day.slice(i, i + CONFIG.PAGE_NUM));
        var html_data = jade_page({
            HOME_PATH: '../',
            BODY_CLASS: 'katana-list katana-page',
            CONFIG: CONFIG,
            PATH: PATH,
            totle_page_num: totle_page_num,
            current_page_num: (p + 1),
            title: '第' + (p + 1) + '頁',
            datas: one_page[p]

        });

        // 判斷page目錄是否存在
        if (!fs.existsSync(PATH.PAGE)) {
            fs.mkdirSync(PATH.PAGE);
        }
        fs.writeFileSync(PATH.PAGE + '/' + (p + 1) + '.html', html_data);
        p++;
    }
    // 日誌分頁染並寫入 E







    /////////////////////////////////////////////////////////////
    // 單個tag渲染並寫入 S
    /////////////////////////////////////////////////////////////
    var jade_tag = jade.compileFile('./themes/' + CONFIG.THEME + '/tag.jade');
    // 遍歷tag
    for (var t = 0; t < all_tag.length; t++) {

        // 緩衝數組
        tag_collection[t] = [];

        // 遍歷日誌
        for (var e = 0; e < all_day_length; e++) {
            // 過濾沒有tag的日誌
            if ((typeof (all_day[e].tags)) !== 'undefined') {
                // 交叉對比，得到結果push到單個tag日誌文件裏
                if (in_array(all_tag[t], all_day[e].tags)) {
                    tag_collection[t].push(all_day[e]);
                }
            }
        }

        // jade模板賦值
        var html_data = jade_tag({
            HOME_PATH: '../',
            BODY_CLASS: 'katana-list katana-tag',
            CONFIG: CONFIG,
            PATH: PATH,
            title: all_tag[t],
            datas: tag_collection[t]
        });

        // console.log(tag_collection);

        if (!fs.existsSync(PATH.TAG)) {
            fs.mkdirSync(PATH.TAG);
        }
        fs.writeFileSync(PATH.TAG + all_tag[t] + '.html', html_data);

    }
    // 單個tag渲染並寫入 E




    /////////////////////////////////////////////////////////////
    // 完畢提示
    /////////////////////////////////////////////////////////////
    console.log('\n全部日誌轉換完畢。\n共' + all_day_length + '篇，分' + totle_page_num + '頁輸出。');

}