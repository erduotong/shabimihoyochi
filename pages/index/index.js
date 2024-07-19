// pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        text: "",


        able_continue: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    this.audioContext = wx.createInnerAudioContext(); // Create the audio context
        this.audioContext.src = "/pages/musics/Serene_Stroll.mp3"; // Step 2: Set the audio source
        this.audioContext.loop = true; // Step 3: Enable looping
        this.audioContext.play(); // Step 4: Play the audio
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({text: ""});
        const toshow = "景泰蓝（Cloisonne），又称做“铜胎掐丝珐琅”，是一种将铜与珐琅结合，经过多道工序烧制而成的工艺品。由于工艺繁琐、复杂，代表着中华民族传统工艺的巅峰，景泰蓝是国家级非物质文化遗产之一。";
        let index = 0;
        this.setData({able_continue: true});
        const showText = () => {
            if (!this.data.able_continue) {
                return;
            }
            if (index < toshow.length) {
                this.setData({
                    text: this.data.text + toshow[index],
                });
                index++;
                const timeoutId = setTimeout(showText, 50);
                this.setData({timeoutId}); // 存储定时器ID
            }
        };
        showText();
               this.audioContext.play(); // Step 6: Optionally, resume playbac
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        this.setData({able_continue: false});
           this.audioContext.pause(); // Step
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
  this.audioContext.stop(); // Stop the audio when the page is unloaded
        this.audioContext.destroy(); // Destroy the audio context to release resources
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
});