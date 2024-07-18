// components/multi-media/multi-media.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: "text"
    },
    detail: {
      type: String,
      value: "this is a multi-media component."
    },
    subDetail: {
      type: String,
      value: "here are some sub details."
    },
    link: {
      type: String,
      value: null
    },
    style: {
      type: String,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    attached: function () {
      var image_data = {};
      image_data.icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktaW5mby1jaXJjbGUiIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTggMTVBNyA3IDAgMSAxIDggMWE3IDcgMCAwIDEgMCAxNHptMCAxQTggOCAwIDEgMCA4IDBhOCA4IDAgMCAwIDAgMTZ6Ii8+CiAgPHBhdGggZD0ibTguOTMgNi41ODgtMi4yOS4yODctLjA4Mi4zOC40NS4wODNjLjI5NC4wNy4zNTIuMTc2LjI4OC40NjlsLS43MzggMy40NjhjLS4xOTQuODk3LjEwNSAxLjMxOS44MDggMS4zMTkuNTQ1IDAgMS4xNzgtLjI1MiAxLjQ2NS0uNTk4bC4wODgtLjQxNmMtLjIuMTc2LS40OTIuMjQ2LS42ODYuMjQ2LS4yNzUgMC0uMzc1LS4xOTMtLjMwNC0uNTMzTDguOTMgNi41ODh6TTkgNC41YTEgMSAwIDEgMS0yIDAgMSAxIDAgMCAxIDIgMHoiLz4KPC9zdmc+";
      this.setData({image_data});
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function () {
      if (this.properties.link) {
        if (this.properties.link=="back") {
          wx.navigateBack();
          return;
        }
        var pages = getCurrentPages();
        pages = pages.map(item => "/"+item.route);
        const index = pages.indexOf(this.properties.link);
        if (index==-1) {
          wx.navigateTo({
            url: this.properties.link,
          });
        } else {
          const delta = pages.length-index-1;
          wx.navigateBack({delta});
        }
        
      }
    },

    onImageLoaded: function (e) {
      var dstyle = "";
      var ratio = e.detail.height/e.detail.width;
      if (this.properties.style.indexOf("height")==-1) {
        dstyle += "height: "+String(ratio*100)+"vw;";
      } else {
        dstyle += "height: 100%;";
      }
        
      if (this.properties.style.indexOf("width")==-1) {
        dstyle += "width: 100vw;";
      }
      
      this.setData({dstyle});
    }
  }
})