import { v4 as uuid } from 'uuid';
import {Ref, ref, shallowRef} from "vue";
import {Assert,rect} from "./ProjectAsserts.ts";
enum layerType{
    Root,
    Group,
    Normal
}
abstract class AbstractLayer {
    protected _name
    protected _isVisible
    protected _layerId
    private _isSelected

    protected constructor(name: string, isVisible = true, isSelected = false) {
        this._layerId = uuid();
        this._name = ref(name);
        this._isSelected = ref(isSelected);
        this._isVisible = ref(isVisible);
    }
    abstract readonly type: layerType;
    get name() {
        return this._name.value
    }

    get layerId() {
        return this._layerId;
    }

    get isVisible() {
        return this._isVisible.value;
    }

    set isVisible(value) {
        this._isVisible.value = value;
    }

    get isSelected() {
        return this._isSelected.value;
    }

    set isSelected(value) {
        this._isSelected.value = value;
    }
}

class GroupLayer extends AbstractLayer {
    protected _isExpand
    protected _children
    constructor(name: string, children: AbstractLayer[] = [], isVisible = true, isSelected = false, isExpand = true) {
        super(name, isVisible, isSelected);
        this._isExpand = ref(isExpand);
        this._children = shallowRef(children);
    }

    get type(): layerType {
        return layerType.Group;
    }

    get isExpand() {
        return this._isExpand.value;
    }

    set isExpand(value) {
        this._isExpand.value = value;
    }

    get children() {
        return this._children.value;
    }

    set children(value) {
        this._children.value = value;
    }
    addChild(layer: AbstractLayer){
        this._children.value.push(layer);
    }
}


class RootLayer extends GroupLayer {
    protected _rect;
    constructor(name: string,r:rect,children: AbstractLayer[] = []) {
        super(name, children,true, false, true);
        this._rect = r;
    }
    get rect(){
        return this._rect
    }

    get type(): layerType {
        return layerType.Root;
    }

    get isVisible() {
        return true
    }

    set isVisible(_value) {
        return
    }

    get isSelected() {
        return false
    }

    set isSelected(_value) {
        return
    }

    get isExpand() {
        return true
    }

    set isExpand(_value) {
        return
    }
}
class NormalLayer extends AbstractLayer{
    assert

    get type(): layerType {
        return layerType.Normal;
    }

    constructor(name: string, assert:Ref<Assert>, isVisible: boolean = true, isSelected: boolean = true) {
        super(name, isVisible, isSelected);
        this.assert = assert
    }
}
export {RootLayer,NormalLayer,GroupLayer,AbstractLayer,layerType}