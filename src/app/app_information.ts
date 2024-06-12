import { platform } from '@tauri-apps/plugin-os';

class AppInformation {
  private osPlateform: undefined | string;

  constructor() {
    this.osPlateform = undefined;
  }

  // app platform
  get appOs():string {
    return this.osPlateform!;
  }

  // run before the page
  async init() {
    this.osPlateform = await platform();
  }
}

const appInformation = new AppInformation();
await appInformation.init();
export default appInformation;
