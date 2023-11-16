// 此脚本针对网站
// http://www.yuwenlexue.com/category/ershang.html

//输出全部
(()=>{
    let allKewen = '';
    let allCiyu = '';
    let allObj = JSON.parse(localStorage.getItem("MyPaChongTopA"));
    for(const k in allObj){
        let {kewen,ciyu} = allObj[k];
        allKewen += `--:${k}\n${kewen}\n\n`
        allCiyu += `--:${k}\n${ciyu}\n\n`
    }
    console.log(allKewen);
    console.log(allCiyu);
})();


//爬取并存储，浏览页面自己存储
window.addEventListener("load", () => {
    let loadData = () => {
        const dataName = "MyPaChongTopA";
        class Data {
            saveData() {
                localStorage.setItem(dataName, JSON.stringify(this));
            }
            add(id, slug, kewen, ciyu) {
                this[id + slug] = { kewen, ciyu };
            }
        }
        let paTextData = localStorage.getItem(dataName);
        let data = {};
        if (paTextData) {
            data = JSON.parse(paTextData)
        }
        Object.setPrototypeOf(data, Data.prototype);
        return data;
    };

    let data = loadData();
    let oldonPost = onPost;
    let kewen;
    let ciyu;
    onPost = function onPost(id, slug) {
        // datas.push({ "pid": id, "slug": slug });

        //解析课文
        const regKW = (text) => {
            d = new DOMParser().parseFromString(text, "text/html");
            return d.body.querySelector("div").querySelector("div").innerText;
        }
        //解析词语
        const regCY = (text) => {
            let rrr = new RegExp("< *b *[^<>]*>[^<>]*我会写[^<>]*< */ *b *>([^<>]*(< *br */ *>))*[^<>]*").exec(text);
            if (!rrr) {
                return;
            }
            return rrr[0].replace(/<[^<>]*br[^<>]*>/g, "\n");
        }

        $.ajax({
            url: "/doArtiAjax",
            type: 'POST',
            async: false,
            data: { "pid": id, "slug": slug },
            success: function (reb) {
                kewen = regKW(reb);
                ciyu = regCY(reb);
                data.add(id, slug, kewen, ciyu)
                console.log(kewen)
                console.log(ciyu)
            }
        });
    }


    let imgs = document.querySelectorAll("img");
    for (let i = 0; i < imgs.length; i++) {
        const v = imgs[i];
        if (v.src != "http://www.yuwenlexue.com/images/wen.png") {
            continue;
        }
        v.onclick();
    }
    onPost = oldonPost;

    data.saveData();
    console.log(data)
})


