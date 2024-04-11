/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-06 15:43:59
 */
type undoFunction = () => void;

class UnDoStack {
    protected stack: undoFunction[]

    constructor() {
        this.stack = [];
    }

    unDo() {
        if (this.stack.length == 0) {
            return;
        }
        const f = this.stack.pop();
        f!();
    }

    pushUnDo(f: undoFunction) {
        this.stack.push(f);
    }
}

export default UnDoStack;