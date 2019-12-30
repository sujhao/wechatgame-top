import RankItem from "./RankItem";
import AdapterHelper from "./AdapterHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRankingList extends cc.Component {

    @property({ type: cc.ScrollView })
    rankingScrollView: cc.ScrollView = null;

    @property({ type: cc.Label })
    txtLoading: cc.Label = null;

    @property({ type: cc.Prefab })
    prefabRankItem: cc.Prefab = null;

    onLoad() {
        // AdapterHelper.fixApdater()
        console.log("GameRankingList onHaoLoad");
    }

    start() {
        console.log("GameRankingList onHaostart");
        this.reInitView();
        wx.onMessage(data => {
            console.log("接收主域发来消息：", data)
            if (data.messageType == 1) {
                this.fetchFriendData(data);
            }
            // else if (data.messageType == 2) {//
            //     this.submitScore(data);
            else if (data.messageType == 3) {
                this.reInitView();
            }
            // } else if (data.messageType == 4) {
            //     console.log("子域分享成功====", data)
            //     this.fetchGroupFriendData(data);
            // }
        });

        // this.rankingScrollView.node.active = true;
        // let playerInfo = {
        //     "avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/8ibX3tlehP8FemeOz…MTDftsOFgyeMdNypbkrkrxmywsXRW9icZnE1AwRgXT0yA/132",
        //     "nickname":"test",
        //     "KVDataList":[
        //         {"key":"gamescore", "value":"100"}
        //     ]
        // };
        // console.log("initPlayerInfo==", playerInfo);
        // let item:cc.Node = cc.instantiate(this.prefabRankItem);
        // item.getComponent(RankItem).init(0, playerInfo);
        // this.rankingScrollView.content.addChild(item);
        // // if (playerInfo.avatarUrl == userData.avatarUrl) {
        //     let userItem = cc.instantiate(this.prefabRankItem);
        //     userItem.getComponent(RankItem).init(0, playerInfo);
        //     userItem.y = -354;
        //     this.node.addChild(userItem, 1000);
        // // }

    }

    update(dt) {
        // console.log("子域======")
    }

    private submitScore(data) { //提交得分
        let topName: string = data["topName"];
        let score: number = data["score"];
        wx.getUserCloudStorage({
            // 以key/value形式存储
            keyList: [topName],
            success: function (getres) {
                console.log('getUserCloudStorage', 'success', getres)
                if (getres.KVDataList.length != 0) {
                    console.log("getres.KVDataList===", getres.KVDataList);
                    if (getres.KVDataList[0].value > score) {
                        return;
                    }
                }
                // 对用户托管数据进行写数据操作
                wx.setUserCloudStorage({
                    KVDataList: [{ key: topName, value: "" + score }],
                    success: function (res) {
                        console.log('setUserCloudStorage', 'success', res)
                    },
                    fail: function (res) {
                        console.log('setUserCloudStorage', 'fail')
                    },
                    complete: function (res) {
                        console.log('setUserCloudStorage', 'complete')
                    }
                });
            },
            fail: function (res) {
                console.log('getUserCloudStorage', 'fail')
            },
            complete: function (res) {
                console.log('getUserCloudStorage', 'complete')
            }
        });
    }

    private reInitView() {
        this.rankingScrollView.node.active = false;
        this.rankingScrollView.content.removeAllChildren();
    }

    private fetchFriendData(data) {
        this.reInitView();
        this.txtLoading.node.active = true;
        this.txtLoading.string = "玩命加载中...";
        this.rankingScrollView.node.active = true;
        let userData = data.userinfo
        console.log('fetchFriendDatagetUserInfo-success', userData)
        //取出所有好友数据
        wx.getFriendCloudStorage({
            keyList: [data["topName"]],
            success: res => {
                console.log("wx.getFriendCloudStorage success", res);
                this.txtLoading.node.active = false;
                let data = res.data;
                data.sort((a, b) => {
                    if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                        return 0;
                    }
                    if (a.KVDataList.length == 0) {
                        return 1;
                    }
                    if (b.KVDataList.length == 0) {
                        return -1;
                    }
                    return b.KVDataList[0].value - a.KVDataList[0].value;
                });

                for (let i = 0; i < data.length; i++) {
                    let playerInfo = data[i];
                    console.log("initPlayerInfo==", playerInfo);
                    let item: cc.Node = cc.instantiate(this.prefabRankItem);
                    item.getComponent(RankItem).init(i, playerInfo);
                    this.rankingScrollView.content.addChild(item);
                }
            },
            fail: res => {
                console.log("wx.getFriendCloudStorage fail", res);
                this.txtLoading.string = "数据加载失败，请检测网络，谢谢。";
            },
        });
    }

    private fetchGroupFriendData(data) {
        this.reInitView();
        this.txtLoading.node.active = true;
        this.txtLoading.string = "玩命加载中...";
        this.rankingScrollView.node.active = false;
        // let userData = data.userinfo
        //取出所有好友数据
        wx.getGroupCloudStorage({
            shareTicket: data["shareTicket"],
            keyList: [data["topName"]],
            success: res => {
                console.log("wx.getGroupCloudStorage success", res);
                this.txtLoading.node.active = false;
                let data = res.data;
                data.sort((a, b) => {
                    if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                        return 0;
                    }
                    if (a.KVDataList.length == 0) {
                        return 1;
                    }
                    if (b.KVDataList.length == 0) {
                        return -1;
                    }
                    return b.KVDataList[0].value - a.KVDataList[0].value;
                });
                for (let i = 0; i < data.length; i++) {
                    var playerInfo = data[i];
                    var item = cc.instantiate(this.prefabRankItem);
                    item.getComponent(RankItem).init(i, playerInfo);
                    this.rankingScrollView.content.addChild(item);
                    // if (data[i].avatarUrl == userData.avatarUrl) {
                    //     let userItem = cc.instantiate(this.prefabRankItem);
                    //     userItem.getComponent(RankItem).init(i, playerInfo);
                    //     userItem.y = -354;
                    //     this.node.addChild(userItem, 1000);
                    // }
                }
            },
            fail: res => {
                console.log("wx.getFriendCloudStorage fail", res);
                this.txtLoading.string = "数据加载失败，请检测网络，谢谢。";
            },
        });
    }

}
