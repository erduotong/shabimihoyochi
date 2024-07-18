Page({
    data: {
        points: [],
    },
    onLoad: function (options) {
        this.getPPointsPosition();

    },
    getPPointsPosition: function () {
        const query = wx.createSelectorQuery();
        query.selectAll(".time-point").boundingClientRect();
        query.exec((res) => {
            const points = res[0].map(point => {
                return {
                    x: point.left + point.width / 2,
                    y: point.top + point.height / 2,
                };
            });
            this.setData({points: points}, this.drawCurves);
        });
    },
    drawCurves: function () {
        const ctx = wx.createCanvasContext("lineCanvas");
        if (this.data.points.length < 2) {
            return;
        } // 需要至少两个点来绘制曲线

        ctx.moveTo(this.data.points[0].x, this.data.points[0].y); // 移动到第一个点

        for (let i = 1; i < this.data.points.length; i++) {
            const startPoint = this.data.points[i - 1];
            const endPoint = this.data.points[i];
            const controlPoint = {
                x: (startPoint.x + endPoint.x) / 2,
                y: (startPoint.y + endPoint.y) / 2,
            };

            // 调整控制点的位置，使曲线不会完全连接到中心点
            // 这里的调整逻辑可以根据实际需求进行修改
            controlPoint.x += (Math.random() - 0.5) * 20; // 随机调整控制点位置
            controlPoint.y += (Math.random() - 0.5) * 20;

            ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
        }

        ctx.setStrokeStyle("#345e9c"); // 设置线条颜色
        ctx.setLineWidth(2); // 设置线条宽度
        ctx.stroke();
        ctx.draw();
    }

});