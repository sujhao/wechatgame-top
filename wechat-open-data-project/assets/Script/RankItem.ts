
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

    @property({type:cc.Sprite})
    private topIcon:cc.Sprite = null;
    
    @property({type:[cc.SpriteFrame]})
    private topSpriteFrameList:cc.SpriteFrame[] = [];

    // onLoad () {}

    private spriteWidth:number = 60;
    private spriteHeight:number = 60;

    start () {

    }


    public init(topIndex:number, data:object){
        console.log("RankItem init==", topIndex, data);
        let avatarUrl:string = data["avatarUrl"];
        let nickName:string = data["nickname"];
        let grade:number = data["KVDataList"].length != 0 ? data["KVDataList"][0].value : 0;

        if (topIndex % 2 == 0) {
            this.backSprite.color = new cc.Color(55, 55, 55, 255);
        }

        if(topIndex <= 2){
            this.topIcon.node.active = true;
            this.topIcon.spriteFrame = this.topSpriteFrameList[topIndex]
        }
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
