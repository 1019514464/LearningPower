/*
 * @Description: 学习强国自动化脚本
 * @version: 0.0.1
 * @Author: Veagau
 * @LastEditors: Veagau
 * @Date: 2019-03-27 15:49:14
 * @LastEditTime: 2019-03-29 17:49:33
 */

//全局变量定义
// var vState = 0;//视频学习状态
var sState = 0;//视频分享状态
var vTimeTotal = 20000;//视频学习目标时间，默认视频学习时长25分钟（1500000）
var vTime = 0;//视频学习时间
var sTimeTotal = 10000;//视频分享目标时间，默认视频分享时长10秒
var sTime = 0;//视频分享时间
var loops = 2;//视频分享次数，默认分享6次

/**
 * @name:延迟函数ms→s 
 * @param {int}mm 
 * @return: null
 */
function toSDelay(params) {
    sleep(params * 1000);
}

/**
 * @name:初始化函数 
 * @param {none} 
 * @return: none
 */
function initScript() {
    // vState = 0;//视频学习状态
    sState = 0;//视频分享状态
    vTimeTotal = 20000;//视频学习目标时间
    vTime = 0;//视频学习时间
    sTimeTotal = 10000;//视频分享目标时间，默认视频分享时长10秒
    sTime = 0;//视频分享时间
    loops = 2;//视频分享次数，默认分享6次
    toast('Hello World!');
    toSDelay(2);
    toast('学习强国启动中……');
    var initState = launchApp("学习强国");
    toSDelay(3);
    if (initState == false) {
        toast("启动失败\n找不到该应用")
    }
    return true;
};

/**
 * @name: 视频学习
 * @param none
 * @return: none
 */
function videoStudy() {
    while (!desc("学习").exists());
    if (click("视频学习") == true) {
        toast("开始视频学习");
    }
    toSDelay(2);
    if (click("联播频道") == true) {
        toast("进入联播频道");
    }
    toSDelay(5);
    return true;
}

/**
 * @name: 视频学习子任务01→观看新闻联播
 * @param {type} 
 * @return: 
 */
function videoWatch() {
    var firstVideo = className("android.widget.FrameLayout").bounds(0, 361, 1080, 1165).depth(4).findOne();
    if (firstVideo.click() == true) {
        toast("进入新闻联播");
        toSDelay(5);
    }
    if (text("继续播放").exists()) {
        text("继续播放").click();
    }
    var videoTimer01 = setInterval(function () {
        vTime = vTime + 5;
        toast("已学习" + vTime + "秒");
    }, 5000);
    setTimeout(function () {
        clearInterval(videoTimer01);
        toast("视频任务完成");
    }, vTimeTotal);
    return true;
}
/**
 * @name: 视频学习子任务02→视频收藏分享
 * @param {none} 
 * @return: none
 */
function videoShare(params) {
    //while (!desc("学习").exists());
    if (params == 0) {
        var secondVideo = className("android.widget.FrameLayout").bounds(0, 1165, 1080, 1482).depth(4).findOne();
        if (secondVideo.click() == true) {
            toast("进入第二条视频新闻");
            params = 1;
            toSDelay(5);
        }
        else params = -1;
    }
    if (params == 1) {
        if (text("继续播放").exists()) {
            text("继续播放").click();
        }
        var videoTimer02 = setInterval(function () {
            sTime = sTime + 5;
            toast("已学习" + sTime + "秒");
        }, 5000);
        setTimeout(function () {
            clearInterval(videoTimer02);
            params = 2;
            toSDelay(2);
            toast("视频观看完成");
        }, sTimeTotal);
    }
    if (params == 2) {
        var starIcon = className("android.widget.ImageView").bounds(774, 1818, 918, 1890).depth(2).findOne();
        if (starIcon.click() == true) {
            toast("收藏成功");
            params = 3;
            toSDelay(5);
        }
        else params = -1;
        popupDeal();//处理首次收藏提示弹窗
    }
    if (params == 3) {
        weChatShare(loops);
        toast("视频分享任务完成");
    }
    if (params == -1) {
        toast("点击失败");
    }
    return true;
}

/**
 * @name: 弹窗处理函数
 * @param 
 * @return: 
 */
function popupDeal(params) {
    while (text("我知道了").exists()) {
        text("我知道了").click();
    }
}
/**
 * @name: 微信分享函数
 * @param {type} 
 * @return: 
 */
function wechatShare(loop) {
    for (var i = 1; i <= loop; i++) {
        while (!text("观点").exists());
        var shareIcon = className("android.widget.ImageView").bounds(918, 1818, 1026, 1890).depth(2).findOne();
        shareIcon.click()
        toast("开始分享第" + i + "次");
        toSDelay(5);
        while (!text("分享给微信好友").exists());
        var wechatIcon = className("android.widget.RelativeLayout").bounds(570, 976, 780, 1273).depth(4).findOne();
        wechatIcon.click();
        toast("跳转微信中……");
        while (!text("多选").exists());//等待微信界面载入
        toSDelay(2);
        back();
        toSDelay(2);
    }
    return true;
}

auto.waitFor(); //辅助权限等待授予
initScript();
videoStudy();
videoWatch();
//back();
//videoShare(sState);