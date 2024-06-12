import {
  WaifuLayerInf,
  WaifuLayerManagerInf,
} from './waifu_project_inf.ts';

class WaifuLayerManager implements WaifuLayerManagerInf {
  protected layerMap: Map<string, WaifuLayerInf>;

  protected top_parent: WaifuLayerInf | undefined;

  protected layerChangeListener: ((_layer: WaifuLayerInf)=>void)[];

  constructor() {
    this.layerMap = new Map();
    this.layerChangeListener = [];
  }

  upDateLayer(id: string, _type?: string | undefined): void {
    const changedLayer = this.getLayer(id);
    if (changedLayer === undefined) return;
    this.layerChangeListener.forEach((v) => {
      v(changedLayer);
    });
  }

  removeLayer(id: string): void {
    const changedLayer = this.getLayer(id);
    if (changedLayer?.parent) {
      changedLayer.parent.childrens = changedLayer
        .parent.childrens.filter((v) => v.id !== changedLayer.id);
    }
  }

  // init the manager
  setTopParent(l:WaifuLayerInf) {
    this.top_parent = l;
    this.layerMap.clear();
    this.travelLayerTree((layer) => {
      this.layerMap.set(layer.id, layer);
      layer.setManager(this);
    });
  }

  travelLayerTree(onLayerReach: (_layer: WaifuLayerInf, _deep: number)=>void) {
    const top = this.top_parent;
    WaifuLayerManager.travelLayerTree(top!, 0, onLayerReach);
  }

  /**
   * @param group start with a group
   * @param deep travel inital deep
   * @param onLayerReach callback when reach a group
   */
  static travelLayerTree(
    group: WaifuLayerInf,
    deep: number,
    onLayerReach: (_layer: WaifuLayerInf, _deep: number)=>void,
  ) {
    if (!group.hasChildren) {
      return;
    }
    group.childrens.forEach((v) => {
      onLayerReach(v, deep);
      if (v.hasChildren) {
        WaifuLayerManager.travelLayerTree(v, deep + 1, onLayerReach);
      }
    });
  }

  getPureLayers(): WaifuLayerInf[] {
    const l: WaifuLayerInf[] = [];
    this.travelLayerTree((layer) => {
      if (!layer.hasChildren) {
        l.push(layer);
      }
    });
    return l;
  }

  getLayer(id: string): WaifuLayerInf | undefined {
    return this.layerMap.get(id);
  }

  onLayerChange(listener: (_layer: WaifuLayerInf)=>void): void {
    this.layerChangeListener.push(listener);
  }
}

export default WaifuLayerManager;
