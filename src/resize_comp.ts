interface ResizeComp{
    getWidth():number
    setWidth(_width: number):void
    getMiniumWidth():number
}

/**
 * the rightest element are always the first to shrink or expand then the second right
 */
class ResizeManager {
  private compList: ResizeComp[];

  private totalWidth: number;

  constructor(totalWidth: number, list: ResizeComp[]) {
    this.compList = list;
    this.totalWidth = totalWidth;
    this.setTotalWidth(totalWidth);
  }

  private static borrowWidth(amount: number, list: ResizeComp[]) {
    let howMuch = amount;
    for (let index = 0; index < list.length; index += 1) {
      const element = list[index];
      if (element.getWidth() - element.getMiniumWidth() >= howMuch) {
        const target = element.getWidth() - howMuch;
        element.setWidth(target);
        return amount;
      }
      howMuch -= element.getWidth() - element.getMiniumWidth();
      element.setWidth(element.getMiniumWidth());
    }
    return amount - howMuch;
  }

  // the container width relate to the windows width
  // call when the window resize
  setTotalWidth(width: number) {
    if (this.compList.length === 0) {
      this.totalWidth = width > 0 ? width : 0;
      return;
    }
    if (width >= this.totalWidth) {
      const amount = width - this.totalWidth;
      const leftMost = this.compList[this.compList.length - 1];
      leftMost.setWidth(leftMost.getWidth() + amount);
      this.totalWidth = width;
      return;
    }
    const minWidth = this.compList.reduce((v, p) => v + p.getMiniumWidth(), 0);
    if (minWidth > width) {
      this.compList.forEach((v) => v.setWidth(v.getMiniumWidth()));
      this.totalWidth = minWidth;
      return;
    }
    // resize the rightmost when shrink
    const amount = ResizeManager.borrowWidth(this.totalWidth - width, [...this.compList].reverse());
    this.totalWidth -= amount;
  }

  // don't resize the rightest comp it should always resize left one
  setCompWidth(comp: ResizeComp, width:number) {
    const index = this.compList.findIndex((v) => v === comp);
    if (index === -1 || index === this.compList.length - 1) {
      return;
    }
    const amount = width - comp.getWidth();
    const shrinkGroup = amount >= 0 ? this.compList.slice(index + 1)
      : this.compList.slice(0, index + 1);
    if (amount >= 0) {
      const bigger = ResizeManager.borrowWidth(amount, shrinkGroup);
      comp.setWidth(comp.getWidth() + bigger);
    } else {
      const smaller = ResizeManager.borrowWidth(-amount, shrinkGroup);
      const resizeComp = this.compList[index + 1];
      resizeComp.setWidth(resizeComp.getWidth() + smaller);
    }
  }
}

export default ResizeManager;
export type { ResizeComp };
