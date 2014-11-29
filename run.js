var fs = require("fs");
var rd = require('rd');
var parseString = require('xml2js').parseString;
var jade = require('jade');

var entries = Object;


var header = jade.renderFile('header.jade');
console.log(header);
console.log('<body>');


// 遍歷 S
rd.eachSync('./dayone_file/entries', function (file, stat, callback) {

        fs.readFile(file, function (err, data) {
            if (err) {
                return 'err';
            };

            // 處理日誌 S
            parseString(data, function (err, data) {
                if (err) {
                    return 'err';
                };

                // 文章id
                var id = data.plist.dict[0].string[2];
                // 文章內容
                var string = data.plist.dict[0].string[0];
                // 文章日期
                var date = data.plist.dict[0].date[0];
                entries.date = date;




                // 把文章內容一分為二（標題與內容）S
                if (string !== '') {

                    // 匹配只有 標題
                    var reg1 = /(.{2,})(?:\n\n)?/;
                    // 匹配有 標題 和 內容
                    var reg2 = /(.{2,})(?:\n\n)?((?:.|\n)*)?/;

                    // 結果只有 標題
                    var result1 = reg1.exec(string)
                        // 結果有 標題和內容
                    var result2 = reg2.exec(string)


                    var title;
                    var text;

                    // 如果找到標題，先賦值
                    if (result1[0]) {

                        var PHOTO = './dayone_file/photos/' + id + '.jpg';
                        // 判斷文章是否有圖片 S

                        fs.exists(PHOTO, function (exists) {
                            if (exists) {
                                entries.photo = PHOTO;
                            }
                        });
                        // 判斷文章是否有圖片 S
                        // console.log(entries.photo);



                        title = result1[0].replace(/[\r\n]/g, "");
                        entries.title = title;

                        // 找到內容，再賦值。
                        if (result2[2]) {
                            text = result2[2];
                            entries.text = text;
                        } else {
                            text = "這篇日誌沒有內容。";
                            entries.text = text;
                        };
                    }
                }
                // 把文章內容一分為二（標題與內容）S

            });
            // 處理日誌 E


            // jade模板渲染 S
            var fileIndex = fs.readFileSync('hello.jade', {
                encoding: 'utf8'
            });
            var templateIndex = jade.compile(fileIndex);

            var htmlIndex = templateIndex({
                entries: entries
            });
            // jade模板渲染 E


            console.log(htmlIndex);

        })

    }

);

setTimeout(function () {
    console.log('</body></html>');
}, 500);


// 遍歷 E