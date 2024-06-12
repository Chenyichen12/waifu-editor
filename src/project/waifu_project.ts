/* eslint-disable no-use-before-define */
import WaifuLayerManager from './waifu_layermanager.ts';

class WaifuProject {
  protected project_name: string | undefined;

  protected project_path: string | undefined;

  protected layer_manager: WaifuLayerManager | undefined;

  constructor() {
    this.project_name = undefined;
    this.project_path = undefined;
  }

  get projectPath(): string | undefined {
    return this.project_path;
  }

  set projectPath(p: string | undefined) {
    this.project_path = p;
  }

  get name(): string {
    return this.name;
  }

  set name(n: string) {
    this.project_name = n;
  }

  setLayerManager(manager: WaifuLayerManager) {
    this.layer_manager = manager;
  }

  getLayerManager(): WaifuLayerManager {
    return this.layer_manager!;
  }
}
export default WaifuProject;
