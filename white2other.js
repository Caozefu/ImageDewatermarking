// 2019-11-17 update: 更新去水印规则，支持黑色图标
function getResultImgUrl(img) {
    var canvas = document.getElementById("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var c = ctx.getImageData(0, 0, img.width, img.height);
    
    // console.log(c.data);
    var colorList = [];
    for (var i = 0; i < c.height; ++i) {
        for (var j = 0; j < c.width; ++j) {
            var x = i * 4 * c.width + 4 * j,  //imagedata读取的像素数据存储在data属性里，是从上到下，从左到右的，每个像素需要占用4位数据，分别是r,g,b,alpha透明通道
                r = c.data[x],
                g = c.data[x + 1],
                b = c.data[x + 2],
                a = c.data[x + 3];

            if (r === 255 && g === 255 && b === 255) {
                a = 0;
            } else if (r > 200 || g > 200 || b > 200) {
                r = 255;
                g = 255;
                b = 255;
                a = 0;
            }
            if (r < 35 || g < 35 || b < 35) {
                r = 0;
                g = 0;
                b = 0;
            }

            colorList.push({
                r, g, b, a
            })
        }
    }
    // console.log(colorList);
    let res = [];
    colorList.forEach(item => {
        res.push(item.r);
        res.push(item.g);
        res.push(item.b);
        res.push(item.a);
    });
    for (let i = 0; i < res.length; i ++) {
        c.data[i] = res[i];
    }
    ctx.putImageData(c, 0, 0, 0, 0, parseInt(img.width), parseInt(img.height));
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


