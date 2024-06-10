import { css, injectGlobal } from '@emotion/css';
import TopBar from './TopBar.tsx';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
html,#root,body{
  height: 100%;
  margin: 0px;
  
}
*{
  user-select:none;
}
`;

const buttonBarCss = css`
height: 2rem;
border-top: 1px solid rgb(152, 152, 152)
`;
const contentCss = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const contentBody = css`
  flex: 1;
  background-color: white;
`;

function App() {
  return (
    <div className={contentCss}>
      <TopBar />
      <div className={contentBody} />
      <div className={buttonBarCss} />
    </div>
  );
}

export default App;
