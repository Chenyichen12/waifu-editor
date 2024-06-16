import {
  ReactNode,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from 'react';
import { useDraggable } from '@reactuses/core';
import TopBar from './TopBar.tsx';
import appInformation from './app/app_information.ts';
import {
  contentCss, contentBody, buttonBarCss, subWindowCss,
  mainStageCss, barDivider,
  subWindowMinWidth,
  dragCursorStyle,
} from './app_css.tsx';
import ResizeManager, { ResizeComp } from './resize_comp.ts';

/**
 * the dom which can resize width
 */
class ResizeAbleDom implements ResizeComp {
  private dom: HTMLDivElement;

  private minWidth: number;

  private width: number;

  public onDrag:(_width: number)=>void;

  constructor(dom: HTMLDivElement, minWidth: number, width: number) {
    this.dom = dom;
    this.minWidth = minWidth;
    this.width = width;
    this.onDrag = () => {};
    this.setWidth(width);
  }

  dragWidth(width: number) {
    this.onDrag(width);
  }

  getWidth(): number {
    return this.width;
  }

  getMiniumWidth(): number {
    return this.minWidth;
  }

  setWidth(width: number): void {
    this.dom.style.width = `${width}px`;
    this.width = width;
  }
}

/**
 * the prop of contentBody
 */
type ContentProp = {
  children?: ReactNode; // slot
  className: string; // css class
  ifDivider?: boolean // if has divider that can drag
}

/**
 * the contentBody
 * ref is a resizeable dom which can add in manager
 * auto call ondrag when the divider is dragging
 */
const ContentReizeBody = forwardRef<
  ResizeAbleDom,
  ContentProp
>(({
  children = null, className, ifDivider = true,
}, ref) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [resizeDom, setResizeDom] = useState<ResizeAbleDom | undefined>(undefined);
  useDraggable(dragRef, {
    onStart: () => {
      // change the style of root because the cursor may out of divider
      const root = document.querySelector('#root') as HTMLDivElement;
      root.style.cursor = dragCursorStyle;
    },
    onMove: (_pos, ev) => {
      if (containerRef.current === null || resizeDom === undefined) {
        return;
      }
      const right = ev.clientX;
      const left = containerRef.current.offsetLeft;
      resizeDom.dragWidth(right - left);
    },
    onEnd: () => {
      const root = document.querySelector('#root') as HTMLDivElement;
      root.style.cursor = '';
    },
  });
  useImperativeHandle(ref, () => {
    const res = new ResizeAbleDom(
    containerRef.current!,
    subWindowMinWidth, // the minWidth of window is subWindowsMinWidth
    containerRef.current!.clientWidth,
    );
    setResizeDom(res);
    return res;
  }, []);
  return (
    <div className={className} ref={containerRef}>

      {children}
      {ifDivider ? <div ref={dragRef} className={barDivider} /> : null}
    </div>
  );
});

function App() {
  const layerBodyRef = useRef<ResizeAbleDom>(null);
  const keyBodyRef = useRef<ResizeAbleDom>(null);
  const mainBodyRef = useRef<ResizeAbleDom>(null);
  useEffect(() => {
    const list = [layerBodyRef.current!, keyBodyRef.current!, mainBodyRef.current!];
    const m = new ResizeManager(list.reduce((p, cur) => p + cur.getWidth(), 0), list);
    // listen
    layerBodyRef.current!.onDrag = (w) => {
      m.setCompWidth(layerBodyRef.current!, w);
    };
    keyBodyRef.current!.onDrag = (w) => {
      m.setCompWidth(keyBodyRef.current!, w);
    };
  }, []);
  return (
    <div className={contentCss}>
      {appInformation.appOs === 'macos' ? <TopBar /> : <TopBar />}
      <div className={contentBody}>
        <ContentReizeBody
          ref={layerBodyRef}
          className={subWindowCss}
        >
          <div />
        </ContentReizeBody>
        <ContentReizeBody
          ref={keyBodyRef}
          className={subWindowCss}
        />
        <ContentReizeBody className={mainStageCss} ifDivider={false} ref={mainBodyRef} />
      </div>
      <div className={buttonBarCss} />
    </div>
  );
}

export default App;
