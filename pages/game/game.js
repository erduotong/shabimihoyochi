let c = 0
let arrayA=[]
let painthistory=[]
Page({
   
  /**
   * 页面的初始数据
   */
  data: {
        k:100,
        scoredata:100,
        context: null,
        lastX: 0,
        lastY: 0,
        lineWidth: 3,
        color: '#F2F3F4',
      isPlaying: false
  },
  starttu() {
    this.setData({
        isPlaying:!this.data.isPlaying
    })
  },
  onLoad: function () {
    const self = this
    const context = wx.createCanvasContext('paintCanvas', this);
    this.setData({ context });
    // const query=wx.createSelectorQuery()
    // query.select('#paintCanvas2')
    //   .fields({ node: true, size: true})
    //   .exec(res => {
    //     const canvas = res[0].node
    //     const ctx = canvas.getContext('2d')
    //     self.setData({ mycontext:ctx });
    //   })
  },

  touchStart: function (e) {
    this.setData({
      lastX: e.touches[0].x,
      lastY: e.touches[0].y,
    });
  },

  touchMove: function (e) {
    if (this.data.isPlaying){
      
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
    }
 
  },

  touchEnd: function (e) {
    setTimeout(() => {
      wx.canvasGetImageData({
        canvasId: 'paintCanvas',
        height: 1000,
        width: 500,
        x: 0,
        y: 0,
        success: function (res) {
          arrayA.push(res.data);
          console.log(arrayA);
          console.log("success");
  
        },
        fail: function (err) {
          console.log(err);
          console.log("fail11111")
        }
      });
    },50)
    
  },
  // saveCanvasState:function (c) {
  //   painthistory.push(canvas.toDataURL)
  // },
    

  undo: function(b){
    this.setData({
      k:1
    })
    
    // 1、清除画布的所有内容
    this.data.context.clearRect(0,0,1000,500);
    this.data.context.draw();
    
    // 2、取出上一步画的内容数据
     arrayA.splice(arrayA.length-1,1);
    let d= arrayA.pop();
   
    
    // 3、将取出的数据绘制回画布
    wx.canvasPutImageData({
      canvasId: 'paintCanvas',
      data: d,
      height: 1000,
      width: 500,
      x: 0,
      y: 0,
      success(res){
        console.log(res);
      },
      fail(err) {
        console.log(err);
      }
    })
     this.updateDate()
      // if (arrayA.length > 1) {
      //   arrayA.pop(); // 移除当前状态
      //   const previousImageData = arrayA[arrayA.length - 1];
      //   const canvas = document.canvasGetImageData('paincanvas');
      //   const ctx = canvas.getContext('2d');
      //   ctx.putImageData(previousImageData, 0, 0);
      // }
    },
    updateDate:function(){
    if(this.data.k){
      console.log(1);
      let newScoredata = this.data.scoredata - 10;
    if(newScoredata<0) newScoredata=0;
      this.setData({
        k:0,
        scoredata:newScoredata
      })
    };
    
      this.setData({
        
      })
    },


  
  })