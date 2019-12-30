import PrefabLoader from "./engine/utils/PrefabLoader";
import Logger from "./engine/utils/Logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WeChatTopPrefab extends cc.Component {

    @property({ type: cc.Sprite })
    private topSprite: cc.Sprite = null;

    private texture: cc.Texture2D;


    onLoad() {
        Logger.log("WeChatTopPrefab=====onLoad");
    }

    start() {
        if (CC_WECHATGAME) {
            // this.tex = new cc.Texture2D();
            // window.sharedCanvas.width = GameConfig.DesignWidth;
            // window.sharedCanvas.height = GameConfig.DesignHeight;
            // // // 发消息给子域
            // // if (this.shareTicket != null) {
            // //     window.wx.postMessage({
            // //         messageType: 5,
            // //         MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
            // //         shareTicket: this.shareTicket
            // //     });
            // // } else {
            //     Logger.log("RankingListView=====getFriendTopScore");
            //     WechatHelper.getFriendTopScore();
            // }
        } 
    }


    // 刷新子域的纹理到游戏
    private updateSubDomainCanvas() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (window.sharedCanvas != undefined) {
                this.texture.initWithElement(window.sharedCanvas);
                this.topSprite.spriteFrame = new cc.SpriteFrame(this.texture);
            }
        }
    }


    update(dt) {
        this.updateSubDomainCanvas();
    }


    // update (dt) {}

    public static show(parentNode: cc.Node = null) {
        PrefabLoader.loadPrefab("prefab/WeChatTopPrefab", (loadedResource: any) => {
            if (!parentNode) {
                parentNode = cc.director.getScene();
            }
            let dialogNode: cc.Node = cc.instantiate(loadedResource);
            parentNode.addChild(dialogNode);
            dialogNode.setPosition(0, 0);
        });
    }
}
