var fs = require("fs");
var parseString = require('xml2js').parseString;
var jade = require('jade');

// dayone的日誌目錄
var DIR_ENTRIES = './dayone_file/entries/';
// dayone的照片目錄
var DIR_PHOTOS = './dayone_file/photos/';

// 所有日誌
var entries = {};


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

                // 照片賦值
                var e_photo = DIR_PHOTOS + entrie.id + '.jpg';
                if (fs.existsSync(e_photo)) {
                    entrie.photo = e_photo;
                };

                // 內容賦制
                if (result2[2]) {
                    var e_text = result2[2];
                } else {
                    var e_text = "這篇日誌沒有內容。";
                };
                entrie.text = e_text;
            }
        }
        // 把文章內容一分為二（標題與內容）S

        // 把單個日誌帶入entries數組

    });
    // 處理日誌 E


    // 渲染並寫入 S
    var template_entrie = jade.compile(fs.readFileSync('entrie.jade'));
    var html_entrie = template_entrie({
        entrie: entrie
    });
    fs.writeFileSync('./entrie/' + entrie.id + '.html', html_entrie);
    // 渲染並寫入 E

    entries[i] = entrie;

});
// 遍歷 E



// 渲染並寫入 S
var template_index = jade.compile(fs.readFileSync('index.jade'));
var html_index = template_index({
    entries: entries
});
fs.writeFileSync('index.html', html_index);
// 渲染並寫入 E

console.log("日誌已輸出到index.html");