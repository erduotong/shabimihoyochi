Page({
    data: {
      context: null,
      lastX: 0,
      lastY: 0,
      lineWidth: 5,
      color: '#000000',
    },
  
    onLoad: function () {
      const context = wx.createCanvasContext('paintCanvas', this);
      this.setData({ context });
    },
  
    touchStart: function (e) {
      this.setData({
        lastX: e.touches[0].x,
        lastY: e.touches[0].y,
      });
    },
  
    touchMove: function (e) {
      const { context, lastX, lastY, lineWidth, color } = this.data;
      const x = e.touches[0].x;
      const y = e.touches[0].y;
  
      context.setStrokeStyle(color);
      context.setLineWidth(lineWidth);
      context.setLineCap('round');
      context.setLineJoin('round');
  
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(x, y);
      context.stroke();
  
      context.draw(true);
  
      this.setData({
        lastX: x,
        lastY: y,
      });
    },
  
    touchEnd: function (e) {
      
        // 结束绘制时，可以在这里处理一些逻辑，例如保存图片等
    },
  });