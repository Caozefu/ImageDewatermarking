function getResultImgUrl(img) {
    var canvas = document.getElementById("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var c = ctx.getImageData(0, 0, img.width, img.height);
    c.data.forEach((val, index) => {
        if (val <= 15 && val !== 0) {
            c.data[index] = 0;
        }
    });
    console.log(c.data);
    var colorList = [];
    //chrome浏览器报错，ie浏览器报安全错误信息，原因往下看
    for (var i = 0; i < c.height; ++i) {
        for (var j = 0; j < c.width; ++j) {
            var x = i * 4 * c.width + 4 * j,  //imagedata读取的像素数据存储在data属性里，是从上到下，从左到右的，每个像素需要占用4位数据，分别是r,g,b,alpha透明通道
                r = c.data[x],
                g = c.data[x + 1],
                b = c.data[x + 2],
                a = c.data[x + 3];

            colorList.push({
                r, g, b, a
            })
        }
    }
    ctx.putImageData(c, 0, 0, 0, 0, 256, 256);    //裁剪效果见图1
    console.log(canvas.toDataURL());
    document.getElementById('btn').href = canvas.toDataURL();
}

function changepic() {
    var reads = new FileReader();
    var f = document.getElementById('upload').files[0];
    reads.readAsDataURL(f);
    reads.onload = function (e) {
        document.getElementById('show').src = this.result;
    };
}

window.onload = function () {
    document.getElementById('upload').onchange = function () {
        changepic()
    };
    document.getElementById('downloadFileName').onchange = function () {
        document.getElementById('btn').download = this.value;
    }
    var img = document.getElementById('show');
    img.src = "";
    img.isLoad = false;
    img.onload = function () {
        if (!img.isLoad && img.src) {
            getResultImgUrl(img);
            img.isLoad = true;
        }
    }
}


