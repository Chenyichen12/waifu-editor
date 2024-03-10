import { Root, Layer, NormalLayer, Group } from "./LayerStruct";
import { ref, shallowRef } from "vue";
import { ImageAsset } from './ProjectAssets'
import Psd, { NodeChild } from '@webtoon/psd'
class Project {
	protected static _instance = shallowRef<Project | null>(null);
	name: string = "未命名";
	// root和instance的生命周期相同 root组成了所有资源的根节点
	protected _root: Root = new Root({
		width: 0, height: 0
	});
	//图片合集 内有texture
	protected _assetsList: ImageAsset[] = [];

	protected constructor() { }
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
					newProject._assetsList.push(asset);

					const newNormal = new NormalLayer({
						name: ref(child.name),
						asset: asset
					})
					res.push(newNormal);
				}
			}
			return res;
		}

	}

}

export default Project;
