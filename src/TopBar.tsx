import { useClickOutside } from '@reactuses/core';
import { useEffect, useRef, useState } from 'react';
import {
  BsXLg, BsFullscreen, BsFullscreenExit, BsDashLg,
} from 'react-icons/bs';
import { getCurrent } from '@tauri-apps/api/webviewWindow';
import {
  dropMenuIem,
  dropMenuContent, menuContent, topBarCss, leftMenu, rightMenu, miniBtnCss, closeBtnCss,
} from './topbar_css.ts';
import FuncMap from './app/func_map.ts';

type content = {
  name: string,
  func: (()=>void)|(()=>Promise<void>)
}
function DropMenuContent({ contentList }: {contentList: content[]}) {
  return (
    contentList.map((v) => <div className={dropMenuIem} key={v.name} role="button" tabIndex={-1} onClick={v.func}>{v.name}</div>)
  );
}

function DropMenu({ name }: { name: string }) {
  const [isShowDrop, setShowDrop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => {
    setShowDrop(false);
  });
  return (

    <div
      ref={menuRef}
      role="button"
      tabIndex={-1}
      className={menuContent}
      style={{
        backgroundColor: isShowDrop ? 'rgb(219, 219, 219)' : '',
      }}
      onClick={() => {
        setShowDrop(!isShowDrop);
      }}
    >
      <span>{name}</span>
      <div
        style={{
          display: isShowDrop ? '' : 'none',
        }}
        className={dropMenuContent}
      >
        {FuncMap.has(name)
          ? <DropMenuContent contentList={FuncMap.get(name)!} /> : undefined}
      </div>

    </div>
  );
}

function TopBar() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    const w = getCurrent();
    w.onResized(async () => {
      const ifFull = await w.isMaximized();
      setIsFullScreen(ifFull);
    });
  }, []);
  return (
    <div
      className={topBarCss}
    >
      <div className={leftMenu}>
        <DropMenu name="文件" />
        <DropMenu name="编辑" />
        <DropMenu name="查看" />

      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        style={{
          flex: 1,
          height: '80%',
        }}
        data-tauri-drag-region
      />
      <div className={rightMenu}>
        <div
          className={miniBtnCss}
          tabIndex={-1}
          role="button"
          aria-label="Minimize"
          onClick={() => {
            const w = getCurrent();
            w.minimize();
          }}
        >
          <BsDashLg />
        </div>
        <div
          className={miniBtnCss}
          tabIndex={-1}
          role="button"
          aria-label="Expand"
          onClick={() => {
            const w = getCurrent();
            w.toggleMaximize();
          }}
        >
          {isFullScreen ? <BsFullscreen /> : <BsFullscreenExit /> }
        </div>
        <div
          className={closeBtnCss}
          tabIndex={-1}
          role="button"
          aria-label="Close"
          onClick={() => {
            const w = getCurrent();
            w.close();
          }}
        >
          <BsXLg />
        </div>

      </div>
    </div>
  );
}

export default TopBar;
