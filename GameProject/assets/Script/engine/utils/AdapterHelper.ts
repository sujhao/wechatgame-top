import Logger from "./Logger";

export default class AdapterHelper {


    public static winSizeWidth:number;
    public static winSizeHeiht:number;

    public static fixApdater() {
        let framesize = cc.view.getFrameSize();

        // [2019-12-24 17:25:0:371] [HaoJslog] [log]  winsize= 1136 640
        // Logger.log("getVisibleSize=", cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
        Logger.log("winsize=", cc.winSize.width, cc.winSize.height);
        if(!this.winSizeWidth){
            this.winSizeWidth = cc.winSize.width;   
            this.winSizeHeiht = cc.winSize.height;
            Logger.log("winSizeWidth Height=",this.winSizeWidth, this.winSizeHeiht);
        }
        let designsize = cc.view.getDesignResolutionSize();
        Logger.log("designsize=", designsize.width, designsize.height);
        let canvas: cc.Canvas = cc.Canvas.instance;
        let ratio: number = framesize.height / framesize.width;
        let designRatio: number = designsize.height / designsize.width;
        Logger.log("framesize=", framesize.width, framesize.height);
        if (ratio > designRatio) {
            canvas.fitHeight = false;
            canvas.fitWidth = true;
            Logger.log("fitwidth");
        } else {
            canvas.fitHeight = true;
            canvas.fitWidth = false;
            Logger.log("fitheight");
        }
        Logger.log("canvas======", canvas.node.width, canvas.node.height);
    }
}


