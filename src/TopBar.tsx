import { css } from '@emotion/css';
import { useClickOutside } from '@reactuses/core';
import { useRef, useState } from 'react';

const topBarCss = css`
height: 2.5rem;
border-bottom: 1px solid rgb(152, 152, 152);
display: flex;
align-items: center;
padding-left: 10px;
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
function DropMenu({ name }: {name: string}) {
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
    <div className={topBarCss}>
      <DropMenu name="文件" />
      <DropMenu name="编辑" />
      <DropMenu name="查看" />
    </div>
  );
}
export default TopBar;
