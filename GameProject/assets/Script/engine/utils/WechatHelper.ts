import Logger from "../../engine/utils/Logger";

export enum WechatSub_MsgType {
    GetFriendScore = 1,
    SubmitTopScore = 2,
    CloseTop = 3,
}

export default class WechatHelper {

    private static wxSystemInfo: any = null;  //微信系统信息
    private static wxUserInfo: any = null;    //微信用户信息
    private static isInitShareCallbackEvent: boolean = false; //是否初始化监听微信分享回调


    /**
     * 是否微信小游戏环境
     */
    public static isWechatGame() {
        // Logger.log("isWechatGame=", cc.sys.platform, cc.sys.WECHAT_GAME, cc.sys.WECHAT_GAME_SUB)
        return cc.sys.platform == cc.sys.WECHAT_GAME;
    }

    /**
     * 是否微信开放域环境
     */
    public static isWechatGameSub() {
        Logger.log("isWechatGameSub=", cc.sys.platform, cc.sys.WECHAT_GAME, cc.sys.WECHAT_GAME_SUB)
        return cc.sys.platform == cc.sys.WECHAT_GAME_SUB;
    }

    /**
     * 获取微信系统信息
     */
    public static getSystemInfo() {
        if (!this.isWechatGame()) return;
        if (!WechatHelper.wxSystemInfo) {
            WechatHelper.wxSystemInfo = wx.getSystemInfoSync();
        }
        Logger.log("wxSystemInfo=", JSON.stringify(WechatHelper.wxSystemInfo));
        return WechatHelper.wxSystemInfo;
    }

    /**
     * 获取微信用户信息
     * @param callback 
     */
    public static getUserInfo(callback: Function = null): void {
        if (!this.isWechatGame()) return;
        if (!WechatHelper.wxUserInfo) {
            wx.getSetting({
                success(res) {
                    Logger.log("WechatHelper.getSetting==", res)
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        // 必须是在用户已经授权的情况下调用
                        wx.getUserInfo({
                            success(res) {
                                const userInfo = res.userInfo
                                WechatHelper.wxUserInfo = userInfo
                                const nickName = userInfo.nickName
                                const avatarUrl = userInfo.avatarUrl
                                const gender = userInfo.gender // 性别 0：未知、1：男、2：女
                                const province = userInfo.province
                                const city = userInfo.city
                                const country = userInfo.country
                                Logger.log("getUserInfo===", userInfo);
                            },
                            fail(res) {
                                Logger.warn("getUserInfo=fail==", res);
                            },
                            complete(res) {
                                Logger.warn("getUserInfo=complete==", res);
                                if (callback) {
                                    callback(WechatHelper.wxUserInfo);
                                }
                            }
                        })
                    }
                }
            })
        } else {
            if (callback) {
                callback(WechatHelper.wxUserInfo);
            }
        }
    }

    /**
     * 提交排行榜信息
     * @param score 
     */
    public static submitTopScore(score: number, topName: string = "testTop") {
        if (this.isWechatGame()) {
            Logger.log("WechatHelper.submitTopScore=", score);
            wx.getOpenDataContext().postMessage({
                messageType: WechatSub_MsgType.SubmitTopScore,
                topName: topName,
                score: score,
                userinfo: WechatHelper.wxUserInfo
            });
        }
    }

    /**
     * 获取排行榜信息
     */
    public static getFriendTopScore(topName: string = "testTop") {
        if (this.isWechatGame()) {
            Logger.log("WechatHelper.getFriendTopScore=======");
            wx.getOpenDataContext().postMessage({
                messageType: WechatSub_MsgType.GetFriendScore,
                topName: topName,
                userinfo: WechatHelper.wxUserInfo
            });
        }
    }



    /**
     * 关闭微信子域排行榜
     */
    public static closeTop() {
        if (this.isWechatGame()) {
            wx.getOpenDataContext().postMessage({
                messageType: WechatSub_MsgType.CloseTop,
            });
        }
    }

    //评论游戏
    public static commentGame() {
        if (this.isWechatGame()) {
            wx.openCustomerServiceConversation({});
        }
    }

    /**
     * 初始化微信分享回调
     */
    private static initShareCallbackEvent() {
        if (this.isWechatGame()) {
            if (!WechatHelper.isInitShareCallbackEvent) {
                Logger.log("WechatHelper.initShareCallbackEvent=");
                WechatHelper.isInitShareCallbackEvent = true;
                wx.onShareAppMessage((res) => {
                    Logger.log("WechatHelper.onShareAppMessage======", res);
                });
            }
        }
    }

    /**
     * @param pictureName 
     */
    public static sharePicture(pictureName: string = "shareGroup") {
        if (this.isWechatGame()) {
            let titleStr = '快来跟我一起玩耍吧。';
            // if (pictureName == "shareGroup") {
            //     titleStr = "看看你在群里排第几？快来和我挑战笑消吧。";
            // }
            WechatHelper.initShareCallbackEvent();
            Logger.log("WechatHelper.sharePicture=", pictureName);
            let designsize = cc.view.getDesignResolutionSize();
            wx.shareAppMessage({
                //转发标题，不传则默认使用当前小游戏的昵称。
                title: titleStr,

                //查询字符串，从这条转发消息进入后，
                //可通过 wx.getLaunchInfoSync() 或 wx.onShow() 
                //获取启动参数中的 query。必须是 key1=val1&key2=val2 的格式。
                query: "shareGroup=1",
                //转发显示图片的链接，可以是网络图片路径或本地图片文件路径或相对代码包根目录的图片文件路径。显示图片长宽比是 5:4
                imageUrl: canvas.toTempFilePathSync({
                    width: designsize.width,
                    height: designsize.height
                })
            });
        }
    }
}
