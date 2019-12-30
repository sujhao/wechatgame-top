import Logger from "./Logger";

export default class PrefabLoader {

    public static loadPrefab(url: string, callback: Function) {
        cc.loader.loadRes(url, (errorMessage, loadedResource) => {
            if (errorMessage) {
                Logger.warn('载入Prefab失败, 原因:' + errorMessage);
                return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
                Logger.warn('你载入的不是Prefab, 你做了什么事?');
                return;
            }
            callback(loadedResource);
        });
    }
}
