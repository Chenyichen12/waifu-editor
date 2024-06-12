import { css, cx } from '@emotion/css';

export const topBarCss = css`
display: flex;
border-bottom: 1px solid rgb(152, 152, 152);
justify-content: space-between;
height: 2.5rem;
align-items: center;
`;
export const leftMenu = css`
display: flex;
padding-left: 10px;
`;
export const rightMenu = css`
display:flex;
height: 100%;
`;
export const menuContent = css`
padding: 0.4rem 0.8rem;
text-align: center;
border-radius: 0.5rem;
margin-right: 0.1rem;
position: relative;
&:hover{
    background-color: rgb(219, 219, 219);
}
&:active{
    background-color: rgb(120, 120, 120);
}
`;
export const closeBtnCss = cx(menuContent, css`
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
export const miniBtnCss = cx(closeBtnCss, css`
  &:hover{
    background-color: rgb(168, 167, 167);
  }
  &:active{
      background-color: rgb(120, 120, 120);
    }
`);
export const dropMenuContent = css`
position: absolute;
top: 100%;
left: 0px;
background-color: rgb(240, 240, 240);
text-align: left;
border-radius: 0.3rem;
padding-top: 0.3rem;
min-width: 10rem;

`;

export const dropMenuIem = css`
  padding: 0.3rem 0.3rem 0.3rem 0.3rem;
  white-space: nowrap;
  &:hover{
    background-color: rgb(159, 159, 159);
  }
  &:active{
      background-color: rgb(120, 120, 120);
    }
`;
