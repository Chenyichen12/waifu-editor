import { css, cx } from '@emotion/css';
import { useClickOutside } from '@reactuses/core';
import { useRef, useState } from 'react';
import {
  BsXLg, BsApp, BsDashLg,
} from 'react-icons/bs';
import { getCurrent } from '@tauri-apps/api/webviewWindow';

const topBarCss = css`
display: flex;
border-bottom: 1px solid rgb(152, 152, 152);
justify-content: space-between;
height: 2.5rem;
align-items: center;
`;
const leftMenu = css`
display: flex;
padding-left: 10px;
`;

const rightMenu = css`
  display:flex;
  height: 100%;
`;

const menuContent = css`
    padding: 0.4rem 0.8rem;
    text-align: center;
    border-radius: 0.5rem;
    margin-right: 0.1rem;
    position: relative;
    &:hover{
        background-color: rgb(168, 167, 167);
    }
    &:active{
        background-color: rgb(120, 120, 120);
    }
`;

const closeBtnCss = cx(menuContent, css`
  font-size: large;
  padding: 0px 0px;
  border-radius: 0px;
  aspect-ratio: 1/1;
  margin: 0px;
  height: 100%;
  transition: background-color 0.1s linear;
  background-color: white;
  position: relative;
  &:hover{
    background-color: rgba(252, 51, 44, 1.0);
  }
  svg{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
`);

const miniBtnCss = cx(closeBtnCss, css`
  &:hover{
    background-color: rgb(168, 167, 167);
  }
  &:active{
        background-color: rgb(120, 120, 120);
    }
`);

const dropMenuContent = css`
    position: absolute;
    top: 100%;
    left: 0px;
    background-color: rgb(218, 216, 216);
    text-align: left;
    border-radius: 0.3rem;
    padding-top: 0.3rem;
    min-width: 5rem;
`;

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
        sssss
      </div>

    </div>
  );
}

function TopBar() {
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
        onMouseDown={async () => {
          await getCurrent().startDragging();
        }}
      />
      <div className={rightMenu}>
        <div
          className={miniBtnCss}
          tabIndex={-1}
          role="button"
          aria-label="Minimize"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
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
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        >
          <BsApp />
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
