import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import { osPlatform } from './AppInformation.ts';

type menuItem = {
    name: string,
    func: (()=>void) | (()=>Promise<void>),
}

const FuncMap = new Map<string, menuItem[]>();
FuncMap.set('文件', [{
  name: '从psd导入',
  func: async () => {
    const file = await open({
      filters: [{ name: 'psd', extensions: ['psd', 'psb'] }],
    });
    if (file?.path === undefined) {
      return;
    }
    const res = await invoke('get_psd_resource', { path: file.path });
    console.log(res);
  },
}, {
  name: '打开项目',
  func: () => {
    console.log('open');
  },
},
{
  name: '保存',
  func: () => {
    console.log('save');
  },
}]);
// 当平台为macos时候才使用
if (osPlatform === 'macos') {
  await listen('menu_event', (e) => {
    const v = e.payload as string[];
    const array = FuncMap.get(v[0]);
    const item = array!.find((value) => v[1] === value.name)!;
    item.func();
  });
}
export default FuncMap;
