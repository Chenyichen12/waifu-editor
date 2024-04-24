/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-27 18:03:33
 */
import { Root, Layer, NormalLayer, Group } from "./LayerStruct";
import { ref, shallowRef } from "vue";
import { ImageAsset } from './ProjectAssets'
import Psd, { NodeChild } from '@webtoon/psd'
import UnDoStack from "../../UnDoStack/UnDoStack";
import EntryManager from "../FrameAnimatorStage/EntryManager";
class Project {
	protected static _instance = shallowRef<Project | null>(null);
	name: string = "未命名";
	// root和instance的生命周期相同 root组成了所有资源的根节点
	protected _root: Root = new Root({
		width: 0, height: 0
	});

	unDoStack: UnDoStack

	protected _entryManager: EntryManager
	get entryManager() { return this._entryManager }

	protected _currentSelectedLayer: string[] = []
	set currentSelectedLayer(entry: string[]) {
		this._currentSelectedLayer = entry;
		for (const listen of this.selectionListener) {
			listen(this._currentSelectedLayer);
		}
	}

	protected selectionListener: ((selection: string[]) => void)[] = [];
	onSelectionChange(callBack: (selection: string[]) => void) {
		this.selectionListener.push(callBack);
		return () => {
			this.selectionListener = this.selectionListener.filter((v) => v !== callBack);
		}
	}
	get currentSelectedLayer() { return this._currentSelectedLayer }
	//图片合集 内有texture
	protected _assetsList: Map<string, ImageAsset> = new Map<string, ImageAsset>();

	protected constructor() {
		this.unDoStack = new UnDoStack();
		this._entryManager = new EntryManager();
	}
	static get instance() {
		return Project._instance;
	}
	get root() {
		return this._root;
	}
	get assetList() {
		return this._assetsList;
	}

	static async initFromPsd(f: File | Blob) {
		const newProject = new Project();
		const p = Psd.parse(await f.arrayBuffer());
		const rootChild = await parseChild(p.children);
		const newRoot = new Root({
			name: ref(p.name),
			children: shallowRef(rootChild),
			width: p.width,
			height: p.height,
		})
		newProject._root = newRoot;
		newProject.entryManager.initDefault();
		Project._instance.value = newProject;

		async function parseChild(nodeChild: NodeChild[]): Promise<Layer[]> {
			const res: Layer[] = [];
			for (const child of nodeChild) {
				if (child.type == "Group") {
					const c = await parseChild(child.children);
					res.push(new Group({
						name: ref(child.name),
						children: shallowRef(c)
					}));
				} else {
					const asset = new ImageAsset({
						top: child.top,
						left: child.left,
						width: child.width,
						height: child.height
					})
					await asset.loadFromArray(await child.composite());
					newProject._assetsList.set(asset.assetId, asset);

					const newNormal = new NormalLayer({
						name: ref(child.name),
						assetId: asset.assetId
					})
					res.push(newNormal);
				}
			}
			return res;
		}

	}
}

export default Project;
