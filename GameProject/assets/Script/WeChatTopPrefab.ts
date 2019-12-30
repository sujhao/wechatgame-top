import PrefabLoader from "./engine/utils/PrefabLoader";
import Logger from "./engine/utils/Logger";
import WechatHelper from "./engine/utils/WechatHelper";

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
        this.texture = new cc.Texture2D();
        let designsize = cc.view.getDesignResolutionSize();
        window.sharedCanvas.width = designsize.width;
        window.sharedCanvas.height = designsize.height;
        WechatHelper.getFriendTopScore();
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


    private onClickClose(){
        this.node.destroy();
        WechatHelper.closeTop();
    }


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
