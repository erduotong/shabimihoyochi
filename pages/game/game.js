let c = 0
let arrayA = []


Page({

    /**
     * 页面的初始数据
     */
    data: {
        CanvasWidth: 699,
        CanvasHeight: 520,
        colors: {
            red: 0,
            green: 0,
            blue: 0,
        },
        size: 1,
        colorShowerStyle: "background-color: rgb(0, 0, 1)",
        context: null,
        startX: 0,
        startY: 0,
        moveX: 0,//上一个move的x
        moveY: 0,//上一个move的y
        endX: 0,
        endY: 0,
        playingMode: "1", //1=打胶 2=掐线 3=打色 4=混色
        edu: 0,
    },

    onLoad: function () {

        const context = wx.createCanvasContext("paintCanvas", this);
        this.setData({context});

    },
    outputImage: function () {

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
            x: this.data.moveX,
            y: this.data.moveY,
            width: this.data.size + 2,
            height: this.data.size + 2,
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
        const {context} = this.data
        wx.canvasGetImageData({
            canvasId: "paintCanvas",
            x: x,
            y: y,
            width: width,
            height: height,
            success: (res) => {
                const data = res.data;
                const total = {
                    num: 0,
                    red: 0,
                    green: 0,
                    blue: 0,
                }
                let points = []
                for (let i = 0; i < data.length; i += 4) {

                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];
                    if (a === 0) {
                        continue;
                    }
                    if (r === 253 && g === 175 && b === 7) {
                        continue
                    }
                    total.num++;
                    total.red += r;
                    total.green += g;
                    total.blue += b;
                    //计算该像素点的坐标
                    const pixelX = (i / 4) % width;
                    const pixelY = Math.floor((i / 4) / width);
                    points.push({
                        x: pixelX + x,
                        y: pixelY + y,
                    })
                }
                if (total.num === 0) {
                    return;
                }
                const averageColor = {
                    red: total.red / total.num,
                    green: total.green / total.num,
                    blue: total.blue / total.num,
                }

                context.setStrokeStyle(`rgb(${averageColor.red}, ${averageColor.green}, ${averageColor.blue})`);
                context.setLineWidth(1);
                context.setLineCap("butt");
                context.setLineJoin("miter");
                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    context.lineTo(points[i].x, points[i].y);
                }
                context.stroke();
                context.draw(true);
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

    },
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

    },


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
    },


/////
    changePlayingMode: function (e) {
        const mode = e.currentTarget.dataset.index;

        this.setData({
            playingMode: mode,
        });


    },
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

    },
    changeRed: function (e) {
        const value = e.detail.value;
        this.setData({
            "colors.red": value,
        })
        this.changeColor()

    },
    changeGreen: function (e) {
        const value = e.detail.value;
        this.setData({
            "colors.green": value,
        })
        this.changeColor()
    },
    changeBlue: function (e) {
        const value = e.detail.value;
        this.setData({
            "colors.blue": value,
        })
        this.changeColor()
    },
    changeSize: function (e) {
        const value = e.detail.value;
        this.setData({
            "size": value,
        })
    },
    saveImage: function () {
        //转存图片
        wx.canvasToTempFilePath({
            canvasId: "paintCanvas",
            quality: 1,
            success: function (res) {
                const tempFilePath = res.tempFilePath;
                wx.saveImageToPhotosAlbum({
                    filePath: tempFilePath,
                    success() {
                        wx.showToast({
                            title: "保存成功",
                            icon: "success",
                            duration: 2000,
                        })
                    },
                    fail(err) {
                        console.error("保存失败:", err);
                        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                            console.log("用户拒绝授权");
                            wx.openSetting({
                                success(settingdata) {
                                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                                        console.log("获取权限成功，再次点击图片保存到相册");
                                    } else {
                                        console.log("获取权限失败");
                                    }
                                },
                            })
                        }
                    },
                })
            },
        })
    },
    resetCanvas: function () {
        wx.showModal({
            title: "警告",
            content: "是否要清空已进行的操作？该操作不可逆",
            success: (res) => {
                if (res.confirm) {
                    //清空画布
                    const {context} = this.data;
                    context.draw();
                } else if (res.cancel) {
                    wx.showToast({
                        title: "操作已取消",
                        icon: "error",
                        duration: 500,
                    })
                }
            },
        })
    },
    nextEdu: function () {
        if (this.data.edu <= 5) {
            this.setData({
                edu: this.data.edu + 1,
            });
        }
        if (this.data.edu > 5) {
            this.setData({
                edu: 0,
            })
        }
        switch (this.data.edu) {
            case 1:
                this.setData({
                    playingMode: "1",
                })
                break;
            case 2:
                this.setData({
                    playingMode: "2",
                })
                break;
            case 3:
                this.setData({
                    playingMode: "3",
                })
                break;
            case 4:
                this.setData({
                    playingMode: "4",
                })
                break;
        }
    },
})