var fs = require("fs");
var rd = require('rd');
var parser = require('xml2json');

// 遍歷目錄下的文件
var entries = [];
rd.each('./dayone_file/entries', function (file, stat, next) {
        fs.readFile(file, function (err, data) {
            if (err) {
                return "err_readFile";
            };

            // var arr1 = {
            //     "plist": {
            //         "version": 1,
            //         "dict": {
            //             "key": ["Creation Date", "Creator", "Entry Text", "Location", "Starred", "Tags", "Time Zone", "UUID", "Weather"],
            //             "date": "2014-11-24T14:51:58Z",
            //             "dict": [{
            //                 "key": ["Device Agent", "Generation Date", "Host Name", "OS Agent", "Software Agent"],
            //                 "string": ["Macintosh/MacBookPro11,3", "Nobunaga", "MacOS/10.10.1", "Day One Mac/1.9.6"],
            //                 "date": "2014-11-24T14:51:58Z"
            //             }, {
            //                 "key": ["Administrative Area", "Country", "Latitude", "Locality", "Longitude", "Place Name"],
            //                 "string": ["广东省", "中国", "深圳市", "天地源盛唐大厦&amp;&#35;40;深圳&#41;"],
            //                 "real": [22.530103368458608, 114.02445991357567]
            //             }, {
            //                 "key": ["Celsius", "Description", "Fahrenheit", "IconName", "Pressure MB", "Relative Humidity", "Service", "Sunrise Date", "Sunset Date", "Visibility KM", "Wind Bearing", "Wind Chill Celsius", "Wind Speed KPH"],
            //                 "string": [24, "Mostly Clear", 75, "cloudyn.png", "HAMweather"],
            //                 "integer": [1015, 69, 110, 24, 7],
            //                 "date": ["2014-11-23T22:43:24Z", "2014-11-24T09:39:26Z"],
            //                 "real": 11.265408
            //             }],
            //             "string": ["ole 法式忌廉芝士麵包晚上剛下班就和冬玉和小李跑世界之窗的ole買法式忌廉麵包（寶龍已沒口福的去拿電源了），他們入手後都驚訝那麼大一塊，真是有夠超值。但似乎小李沒買這款，買的是另外一款便宜2塊錢的小改款，也就是沒有芝士和牛油的麵包，所以他吃起來就沒有我們那麼幸福（但人家有進口台灣牛乳啊做搭配啊），吃著那個厚厚的芝士和偶有的橘子粒真是幸福感爆表COMBO 99了。不過這次沒能買到剛剛出爐的忌廉麵包，而且服務員的態度有夠差，居然讓一位素不相識的顧客阿姨（應該是服務員的朋友）給我們包裝，一開始我不知道阿姨是給我們裝麵包，以為是她要自己買，把我的袋子抓去那一瞬間真是有嚇到我。下次嘛，還是要找時間到歡樂海岸的ole吃才對，哪裡的法式忌廉麵包很好賣，所以都是不斷在出爐，吃起來的口感才最正。另外就是，吃忌廉麵包最好還是配牛奶或紅茶，而且，千萬不可以吃光一整塊，不然就只有等著哭哭。", "Asia/Chongqing", "C388602D8452483AB1E54A9357F050D0"],
            //             "false": {},
            //             "array": {
            //                 "string": ["麵包", "食", "ole"]
            //             }
            //         }
            //     }
            // }
            // console.log(arr1.plist.dict.string[2]);


            // 載入數據
            var entries_json = parser.toJson(data);

            // 這個輸出正常
            console.log(entries_json);

            //這個輸出成undefined TODO
            console.log(entries_json.plist);

            // // 處理日誌 S
            // parseString(data, function (err, data) {
            //     if (err) {
            //         return "err_parseString";
            //     };

            //     // 解析xml並賦值
            //     var date = data.plist.dict[0].date[0];
            //     var string = data.plist.dict[0].string[0];
            //     var id = data.plist.dict[0].string[1];
            //     // entries.push(id);
            //     console.log(id);

            //     // 處理正則 S
            //     if (string !== '') {

            //         // 應為dayone的日誌內容只有一段不區分標題和內容。
            //         // 所以要用這段正則把日誌分成2個值，1是標題，2是正文
            //         var reg = /(.*)(?:\n\n)((?:.|\n)*)/;
            //         var result = reg.exec(string);

            //         if (result !== (null && undefined)) {
            //             var title = (result[1] !== (null && undefined)) ? result[1] : '這個日誌沒有標題';
            //             var content = (result[2] !== (null && undefined)) ? result[2] : '這個日誌沒有內容';
            //         }
            //     }
            //     // 處理正則 E

            // });
            // // 處理日誌 E

        });
        next();
    },

    function (err) {
        if (err) {
            return "err_each";
        };
    }
);