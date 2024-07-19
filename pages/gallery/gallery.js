// pages/gallery/gallery.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    this.audioContext = wx.createInnerAudioContext(); // Create the audio context
        this.audioContext.src = "/pages/musics/Lustrous_Moonlight.mp3"; // Step 2: Set the audio source
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
      this.audioContext.play(); // Step 6: Optionally, res
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
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
    af: function (e) {
        console.log(e);
        throw new Error(e);

    },
});