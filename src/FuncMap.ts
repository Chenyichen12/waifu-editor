import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

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

export default FuncMap;
