import { Ref, ShallowRef, ref, shallowRef } from "vue"
import { v4 as uuid } from "uuid"
import { ImageAsset } from './ProjectAssets'
interface LayerOptions {
	//名字 是否选择 是否可见都应该是响应式的
	name?: Ref<string>
	isSelected?: Ref<boolean>
	isVisible?: Ref<boolean>
	layerId?: string
}
enum LayerType {
	Group, Root, NormalLayer
}
abstract class Layer {
	name: Ref<string>
	isSelected
	isVisible
	readonly layerId: string
	abstract get type(): LayerType
	constructor(option: LayerOptions) {
		this.name = option.name ?? ref("未命名");
		this.isSelected = option.isSelected ?? ref(false);
		this.isVisible = option.isVisible ?? ref(true);
		this.layerId = option.layerId ?? uuid();
	}
}

class Group extends Layer {
	isExpand: Ref<boolean>
	children: ShallowRef<Layer[]>
	get type() {
		return LayerType.Group;
	}
	constructor(option: LayerOptions & { isExpand?: Ref<boolean> } & { children?: ShallowRef<Layer[]> }) {
		super(option);
		this.isExpand = option.isExpand ?? ref(true);
		this.children = option.children ?? shallowRef([])
	}
}

interface rect {
	top: number
	left: number
	width: number
	height: number
}

class Root extends Group {
	bound: rect
	constructor(option: LayerOptions & { isExpand?: Ref<boolean> } & { top?: number, left?: number, width: number, height: number } & { children?: ShallowRef<Layer[]> }) {
		super(option);
		this.bound = {
			top: option.top ?? 0,
			left: option.left ?? 0,
			width: option.width,
			height: option.height
		}
	}
	readonly isExpand: Ref<boolean> = ref(true);
	readonly isSelected = ref(false);
	readonly isVisible = ref(true);
	get type() {
		return LayerType.Root;
	}
}

class NormalLayer extends Layer {
	asset: ImageAsset;
	constructor(option: LayerOptions & { asset: ImageAsset }) {
		super(option);
		this.asset = option.asset;
	}
	get type() {
		return LayerType.NormalLayer;
	}
}
export { Layer, LayerType, Group, Root, NormalLayer }
