import { css, injectGlobal } from '@emotion/css';
import fontHeiUrl from './assets/SourceHanSansCN-Light.otf';

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
*{
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
});
