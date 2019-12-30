import Logger from "./engine/utils/Logger";
import WechatHelper from "./engine/utils/WechatHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    start() {
    }

    private onClickTop() {
        if (WechatHelper.isWechatGame()) {

        }
    }
}
