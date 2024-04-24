/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-23 17:32:00
 */

type LayerCon = {
    id: string
    name: string
    isShow: boolean
}
abstract class Layer {
    id: string
    name: string
    isShow: boolean

    constructor(option: LayerCon) {
        this.id = option.id;
        this.name = option.name
        this.isShow = option.isShow
    }
}

class PictureLayer extends Layer {
    readonly pictureId;

    url: string | undefined = undefined;

    constructor(option: LayerCon, picId: string) {
        super(option);
        this.pictureId = picId;

    }
}

class GroupLayer extends Layer {
    children: Layer[]
    isExpand: boolean
    constructor(option: LayerCon, isExpand: boolean) {
        super(option);
        this.children = []
        this.isExpand = isExpand;
    }
}

export { GroupLayer, PictureLayer, Layer }