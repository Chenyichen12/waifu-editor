interface ResizeComp{
    getWidth():number
    setWidth(_width: number):void
    getMiniumWidth():number
}

class ResizeManager {
  private compList: ResizeComp[];

  private totalWidth: number;

  constructor(totalWidth: number, list: ResizeComp[]) {
    this.compList = list;
    this.totalWidth = totalWidth;
    this.setTotalWidth(totalWidth);
  }

  setTotalWidth(width: number, _where?: boolean) {
    const resizeAmount = width - this.totalWidth;
    this.totalWidth = width;
    const [allCompWidth, allCompMinWidth] = this.compList.reduce(
      (p, cur) => [p[0] + cur.getWidth(), p[1] + cur.getMiniumWidth()],
      [0, 0],
    );
    if (allCompMinWidth > this.totalWidth) {
      this.compList.forEach((v) => {
        v.setWidth(v.getMiniumWidth());
      });
      return;
    }
    // always expand the rightmostcomp
    if (resizeAmount >= 0) {
      const leftMostComp = this.compList[this.compList.length - 1];
      const rightCompLen = allCompWidth - leftMostComp.getWidth();
      this.compList[this.compList.length - 1].setWidth(this.totalWidth - rightCompLen);
    } else {
      ResizeManager.shrinkComp(this.compList, -resizeAmount);
    }
  }

  dragComp(comp:ResizeComp, dragAmount: number) {
    const isShrink = dragAmount < 0;
    const index = this.compList.findIndex((v) => v === comp);
    if (index === -1 || index === this.compList.length - 1) {
      throw new Error('no this comp');
    }
    const shrinkGroup = isShrink ? this.compList.slice(0, index)
      : this.compList.slice(index + 1);
    const originWidth = shrinkGroup.reduce((p, c) => p + c.getWidth(), 0);
    ResizeManager.shrinkComp(shrinkGroup, Math.abs(dragAmount));
    const afterWidth = shrinkGroup.reduce((p, c) => p + c.getWidth(), 0);

    const widthAmount = originWidth - afterWidth;
    if (isShrink) {
      this.compList[index + 1].setWidth(this.compList[index + 1].getWidth() + widthAmount);
    } else {
      this.compList[index].setWidth(this.compList[index].getWidth() + widthAmount);
    }
  }

  private static shrinkComp(compGroup: ResizeComp[], amount: number) {
    const list = [...compGroup].reverse();
    let yu = amount;
    for (let index = 0; index < list.length; index += 1) {
      const element = list[index];
      const howMuchResize = element.getWidth() - element.getMiniumWidth();
      if (howMuchResize - yu >= 0) {
        element.setWidth(element.getWidth() - yu);
        return;
      }
      element.setWidth(element.getMiniumWidth());
      yu -= howMuchResize;
    }
  }
}

export default ResizeManager;
export type { ResizeComp };
