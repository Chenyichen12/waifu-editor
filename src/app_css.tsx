import { css, injectGlobal } from '@emotion/css';
import fontHeiUrl from './assets/SourceHanSansCN-Light.otf';
import BsArrowExpand from './assets/bs_icon/arrows-expand-vertical.svg';
// eslint-disable-next-line no-unused-expressions
injectGlobal`
html,#root,body{
  height: 100%;
  margin: 0px;
  @font-face {
    font-family: fontHei;
    src: url(${fontHeiUrl}) format("opentype");
  } 
}
#root{
  user-select:none;
  -webkit-user-select: none;
  cursor: default;
  font-family: fontHei;
}
`;
export const buttonBarCss = css({
  height: '2rem',
  borderTop: '1px solid rgb(152,152,152)',
});
export const contentCss = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});
export const contentBody = css({
  flex: '1',
  backgroundColor: 'white',
  display: 'flex',
});

export const subWindowMinWidth = 120;

export const subWindowCss = css({
  width: `${subWindowMinWidth + 50}px`,
});

export const dragCursorStyle = `url(${BsArrowExpand}) 8 8, col-resize`;
export const barDivider = css({
  width: '2px',
  backgroundColor: 'black',
  float: 'right',
  height: '100%',
  '&:hover': {
    cursor: dragCursorStyle,
  },
});

export const mainStageCss = css({
  flex: '1',
  backgroundColor: 'aqua',
});
