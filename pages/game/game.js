let c = 0
let arrayA = []


Page({

    /**
     * 页面的初始数据
     */
    data: {
        startX: 0,
        startY: 0,
        moveX: 0,//上一个move的x
        moveY: 0,//上一个move的y
        endX: 0,
        endY: 0,
        lineWidth: 3,
        color: "#F2F3F4",
        playingMode: 1, //1=打胶 2=掐线 3=打色
    },

    onLoad: function () {

        const context = wx.createCanvasContext("paintCanvas", this);
        this.setData({context});

    },
    paintGlue: function (x, y) {

    },
    paintGoldenLine: function (x, y) {
        //绘制线
    },
    touchStart: function (e) {

        this.setData({
            startX: e.touches[0].x,
            startY: e.touches[0].y,
        })
    },
    touchMove: function (e) {
        const x = e.touches[0].x;
        const y = e.touches[0].y;
        if (this.playingMode === 1) {
            //打胶
            this.paintGlue(x, y);
        }


        this.setData({
            moveX: x,
            moveY: y,
        })

    },


    touchEnd: function (e) {

    },


    /////
    changePlayingMode: function (e) {
        const mode = e.currentTarget.dataset.index;
        console.log(mode);
        this.setData({
            playingMode: e,
        });
    },


})