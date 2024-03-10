import { Texture } from "pixi.js"
import { v4 as uuid } from "uuid"
interface rect{
	width: number
	height: number
	top: number
	left: number
}

interface Asset{
	readonly assetId: string
	get type(): string;
}

class ImageAsset implements Asset{
	texture?: Texture
	bound: rect
	readonly assetId: string;
	constructor(bound: rect,id?: string){
		this.assetId = id ?? uuid();
		this.bound = bound;
	}
	async loadFromArray(array: Uint8ClampedArray){
		const imageData = new ImageData(array,this.bound.width,this.bound.height);
		const bitMap = await createImageBitmap(imageData);	
		this.texture = Texture.from(bitMap);
	}
	get type(){
		return "ImageAssert"
	}
}

export { ImageAsset}
