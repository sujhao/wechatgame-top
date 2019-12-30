
const {ccclass, property} = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {

    @property({type:cc.Node})
    backSprite:cc.Node = null;

    @property({type:cc.Label})
    rankLabel:cc.Label = null;

    @property({type:cc.Label})
    nickLabel:cc.Label = null;

    @property({type:cc.Label})
    topScoreLabel:cc.Label = null;

    @property({type:cc.Sprite})
    avatarImgSprite:cc.Sprite = null;

    // onLoad () {}

    private spriteWidth:number = 60;
    private spriteHeight:number = 60;

    start () {

    }

    // update (dt) {}

    public init(topIndex:number, data:object){
        console.log("RankItem init==", topIndex, data);
        let avatarUrl:string = data["avatarUrl"];
        let nickName:string = data["nickname"];
        let grade:number = data["KVDataList"].length != 0 ? data["KVDataList"][0].value : 0;

        // if (topIndex % 2 == 0) {
        //     this.backSprite.color = new cc.Color(55, 55, 55, 255);
        // }
        // if (topIndex == 0) {
        //     this.rankLabel.node.color = new cc.Color(255, 0, 0, 255);
        //     this.rankLabel.node.setScale(2);
        // } else if (topIndex == 1) {
        //     this.rankLabel.node.color = new cc.Color(255, 255, 0, 255);
        //     this.rankLabel.node.setScale(1.6);
        // } else if (topIndex == 2) {
        //     this.rankLabel.node.color = new cc.Color(100, 255, 0, 255);
        //     this.rankLabel.node.setScale(1.3);
        // }
        this.rankLabel.string = (topIndex + 1).toString();
        this.nickLabel.string = nickName;
        this.topScoreLabel.string = grade.toString();
        this.createImage(avatarUrl);
    }

    private createImage(avatarUrl) {
        try {
            let image = wx.createImage();
            image.onload = () => {
                try {
                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    this.avatarImgSprite.node.width = this.spriteWidth;
                    this.avatarImgSprite.node.height = this.spriteHeight;
                } catch (e) {
                    this.avatarImgSprite.node.active = false;
                }
            };
            image.src = avatarUrl;
        }catch (e) {
            this.avatarImgSprite.node.active = false;
        }
    }
}
