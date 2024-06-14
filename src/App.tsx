import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useDraggable } from '@reactuses/core';
import TopBar from './TopBar.tsx';
import appInformation from './app/app_information.ts';
import {
  contentCss, contentBody, buttonBarCss, subWindowCss,
  barDivider,
  mainStageCss,
  subWindowMinWidth,
} from './app_css.tsx';
import ResizeManager, { ResizeComp } from './resize_comp.ts';

function BodyDivider({ onDrag }:{onDrag: (_position: number)=>void}) {
  const dragDom = useRef<HTMLDivElement>(null);
  useDraggable(dragDom, {
    onMove: (pos, _ev) => {
      onDrag(pos.x);
    },
  });
  return (
    <div className={barDivider} ref={dragDom} />
  );
}

class ResizeAbleDom implements ResizeComp {
  private dom: HTMLDivElement;

  private minWidth: number;

  private width: number;

  constructor(dom: HTMLDivElement, minWidth:number, width: number) {
    this.dom = dom;
    this.minWidth = minWidth;
    this.width = width;
    this.setWidth(width);
  }

  getWidth(): number {
    return this.width;
  }

  getMiniumWidth(): number {
    return this.minWidth;
  }

  setWidth(width: number): void {
    this.dom.style.width = `${width}px`;
  }
}

function App() {
  const layerBodyRef = useRef<HTMLDivElement>(null);
  const keyBodyRef = useRef<HTMLDivElement>(null);
  const mainStageBodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className={contentCss}>
      {appInformation.appOs === 'macos' ? null : <TopBar />}
      <div className={contentBody}>
        <div ref={layerBodyRef} className={subWindowCss} style={{ backgroundColor: 'red' }}>
          11111
          <BodyDivider />
        </div>
        <div ref={keyBodyRef} className={subWindowCss} style={{ backgroundColor: 'gray' }}>
          11111
          <BodyDivider />
        </div>
        <div ref={mainStageBodyRef} className={mainStageCss} />
      </div>
      <div className={buttonBarCss} />
    </div>
  );
}

export default App;
