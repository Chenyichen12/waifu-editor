import { platform } from '@tauri-apps/plugin-os';

class AppInformation {
  private osPlateform: undefined | string;

  constructor() {
    this.osPlateform = undefined;
  }

  get appOs():string {
    return this.osPlateform!;
  }

  async init() {
    this.osPlateform = await platform();
  }
}

const appInformation = new AppInformation();
await appInformation.init();
export default appInformation;
