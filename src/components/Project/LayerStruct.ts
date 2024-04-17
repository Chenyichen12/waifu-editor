/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-27 18:03:33
 */
import { Ref, ShallowRef, ref, shallowRef } from "vue"
import { v4 as uuid } from "uuid"
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
	//2023.4.13添加
	 abstract getLayer(name: string): Layer
	 abstract setVisible(name: string, isVisible: boolean): void
	 abstract setLock(name: string, lock: Boolean): void
	 abstract addLayer(l: Layer): void
	 abstract deleteLayer(name: string): void
	 abstract onLayerVisibleChange(callback: (l: Layer)=>void): void
	 abstract onLayerDelete(callback: (l:Layer)=>void): void
//.................................................
	constructor(option: LayerOptions) {
		this.name = option.name ?? ref("未命名");
		this.isSelected = option.isSelected ?? ref(false);
		this.isVisible = option.isVisible ?? ref(true);
		this.layerId = option.layerId ?? uuid();
	}



}
//图层--图层文件夹
class Group extends Layer {
	getLayer(name: string): Layer {
		throw new Error("Method not implemented.")
	}
	setVisible(name: string, isVisible: boolean): void {
		throw new Error("Method not implemented.")
	}
	setLock(name: string, lock: Boolean): void {
		throw new Error("Method not implemented.")
	}
	addLayer(l: Layer): void {
		throw new Error("Method not implemented.")
	}
	deleteLayer(name: string): void {
		throw new Error("Method not implemented.")
	}
	onLayerVisibleChange(callback: (l: Layer) => void): void {
		throw new Error("Method not implemented.")
	}
	onLayerDelete(callback: (l: Layer) => void): void {
		throw new Error("Method not implemented.")
	}
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
	getLayer(name: string): Layer {
		throw new Error("Method not implemented.")
	}
	setVisible(name: string, isVisible: boolean): void {
		throw new Error("Method not implemented.")
	}
	setLock(name: string, lock: Boolean): void {
		throw new Error("Method not implemented.")
	}
	addLayer(l: Layer): void {
		throw new Error("Method not implemented.")
	}
	deleteLayer(name: string): void {
		throw new Error("Method not implemented.")
	}
	onLayerVisibleChange(callback: (l: Layer) => void): void {
		throw new Error("Method not implemented.")
	}
	onLayerDelete(callback: (l: Layer) => void): void {
		throw new Error("Method not implemented.")
	}
	assetId: string;
	constructor(option: LayerOptions & { assetId: string }) {
		super(option);
		this.assetId = option.assetId;
	}
	get type() {
		return LayerType.NormalLayer;
	}
}
export { Layer, LayerType, Group, Root, NormalLayer }
