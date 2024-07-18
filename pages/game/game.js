let c = 0
let arrayA = []


Page({

    /**
     * 页面的初始数据
     */
    data: {
        colors: {
            red: 0,
            green: 0,
            blue: 0,
        },
        size: 0,
        colorShowerStyle: "background-color: rgb(0, 0, 0)",
        context: null,
        startX: 0,
        startY: 0,
        moveX: 0,//上一个move的x
        moveY: 0,//上一个move的y
        endX: 0,
        endY: 0,
        playingMode: "1", //1=打胶 2=掐线 3=打色 4=混色
    },

    onLoad: function () {

        const context = wx.createCanvasContext("paintCanvas", this);
        this.setData({context});

    },
    outputImage: function (){

    },
    paintDying: function (x, y) {
        const {
            moveX,
            moveY,
            context,
        } = this.data;
        const {
            red,
            green,
            blue,

        } = this.data.colors
        wx.canvasGetImageData({
            canvasId: "paintCanvas",
            x: this.data.endX,
            y: this.data.endY,
            width: 5,
            height: 5,
            success: (res) => {
                const data = res.data;
                let foundGrey = false;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    if (r === 253 && g === 175 && b === 7) {

                        foundGrey = true;

                        break;
                    }
                }
                if (foundGrey) {//发现是金色
                    console.log("发现金色")

                } else {
                    context.setStrokeStyle(`rgb(${red}, ${green}, ${blue})`);
                    context.setLineWidth(this.data.size);
                    context.setLineCap("round");
                    context.setLineJoin("round");

                    context.beginPath();
                    context.moveTo(moveX, moveY);
                    context.lineTo(x, y);
                    context.stroke();
                    context.draw(true);
                }

            },
        })


    },
    paintGlue: function (x, y) {
//绘制一个从上一个move到当前move的线段 comp
        const {
            moveX,
            moveY,
            context,
        } = this.data;
        context.setStrokeStyle("grey");
        context.setLineWidth(1);
        context.setLineCap("round");
        context.setLineJoin("round");

        context.beginPath();
        context.moveTo(moveX, moveY);
        context.lineTo(x, y);
        context.stroke();
        context.draw(true);

    },
    paintGoldenLine: function () {

        //绘制线
        wx.canvasGetImageData({
            canvasId: "paintCanvas",
            x: this.data.endX,
            y: this.data.endY,
            width: 8,
            height: 8,
            success: (res) => {
                const data = res.data;
                let foundGrey = false;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    if (r === 128 && g === 128 && b === 128) {
                        foundGrey = true;
                        break;
                    }
                }
                console.log("foundGrey", foundGrey)
                //开画
                if (!foundGrey) {
                    wx.showToast({
                        title: "请在胶水上掐丝",
                        icon: "error",
                        duration: 500,
                    })
                    return
                }

                const {
                    startX,
                    startY,
                    endX,
                    endY,
                    context,
                } = this.data
                context.setStrokeStyle("#fdaf07");
                context.setLineWidth(3);
                context.setLineCap("round");
                context.setLineJoin("round");

                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(endX, endY);
                context.stroke();
                context.draw(true);
            },
        })
    },
    mergeColor: function (x, y, width, height) {
        //获得该区域的颜色，然后再用paintDying的类似方法解决
        wx.canvasGetImageData({
            canvasId: "paintCanvas",
            x: x,
            y: y,
            width: width,
            height: height,
            success: (res) => {
                const data = res.data;
                let totalR = 0, totalG = 0, totalB = 0, count = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    if (r === 253 && g === 175 && b === 7) {
                        continue; // Skip this color
                    }

                    totalR += r;
                    totalG += g;
                    totalB += b;
                    count++;
                }

                if (count === 0) {
                    console.log("No colors to blend");
                    return;
                }

                const avgR = Math.round(totalR / count);
                const avgG = Math.round(totalG / count);
                const avgB = Math.round(totalB / count);

                const context = wx.createCanvasContext("paintCanvas");
                context.setFillStyle(`rgb(${avgR}, ${avgG}, ${avgB})`);
                context.fillRect(x, y, width, height);
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    if (r === 253 && g === 175 && b === 7) {
                        const pixelX = x + (i / 4) % width;
                        const pixelY = y + Math.floor((i / 4) / width);
                        context.setFillStyle(`rgb(${r}, ${g}, ${b})`);
                        context.fillRect(pixelX, pixelY, 1, 1);
                    }
                }
                context.draw(true);
            },
            fail: (err) => {
                console.error("Failed to get image data:", err);
            },
        })
    },

    touchStart: function (e) {

        this.setData({
            startX: e.touches[0].x,
            startY: e.touches[0].y,
            moveX: e.touches[0].x,
            moveY: e.touches[0].y,
        })

    }
    ,
    touchMove: function (e) {
        const x = e.touches[0].x;
        const y = e.touches[0].y;

        if (this.data.playingMode === "1") {
            //打胶

            this.paintGlue(x, y);
        }
        if (this.data.playingMode === "3") {
            this.paintDying(x, y);
        }
        if (this.data.playingMode === "4") {
            this.mergeColor(x, y, this.data.size, this.data.size)
        }
        this.setData({
            moveX: x,
            moveY: y,
        })

    }
    ,


    touchEnd: function (e) {
        const x = e.changedTouches[0].x;
        const y = e.changedTouches[0].y;
        this.setData({
            endX: x,
            endY: y,
        })
        if (this.data.playingMode === "2") {
            this.paintGoldenLine();
        }
    }
    ,


/////
    changePlayingMode: function (e) {
        const mode = e.currentTarget.dataset.index;

        this.setData({
            playingMode: mode,
        });


    }
    ,
    changeColor: function () {

        const {
            red,
            green,
            blue,
        } = this.data.colors;
        if (red === 253 && green === 175 && blue === 7) {
            wx.showToast({
                title: "颜色过于接近，请更换",
                icon: "error",
                duration: 2000,
            })
            this.setData({
                colors: {
                    red: 0,
                    green: 0,
                    blue: 0,
                },
            })
        }
        const color = `rgb(${red}, ${green}, ${blue})`;
        this.setData({
            colorShowerStyle: `background-color: ${color};`,
        });
        console.log(color)
    }
    ,
    changeRed: function (e) {
        const value = e.detail.value;
        this.setData({
            "colors.red": value,
        })
        this.changeColor()

    }
    ,
    changeGreen: function (e) {
        const value = e.detail.value;
        this.setData({
            "colors.green": value,
        })
        this.changeColor()
    }
    ,
    changeBlue: function (e) {
        const value = e.detail.value;
        this.setData({
            "colors.blue": value,
        })
        this.changeColor()
    }
    ,
    changeSize: function (e) {
        const value = e.detail.value;
        this.setData({
            "size": value,
        })
    }
    ,

})