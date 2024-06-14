import TopBar from './TopBar.tsx';
import appInformation from './app/app_information.ts';
import { contentCss, contentBody, buttonBarCss } from './app_css.tsx';

function App() {
  return (
    <div className={contentCss}>
      {appInformation.appOs === 'macos' ? null : <TopBar />}
      <div className={contentBody} />
      <div className={buttonBarCss} />
    </div>
  );
}

export default App;
