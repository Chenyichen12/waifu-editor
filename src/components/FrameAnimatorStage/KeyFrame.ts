/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-18 14:30:00
 */
type uv = {
    u: number,
    v: number
}
class KeyFrameData {
    currentValue: number
    pointUvData: uv[]

    rotationNum?: number
    constructor(currentValue: number, pointUvData: uv[], rotationNum?: number) {
        this.currentValue = currentValue;
        this.pointUvData = pointUvData
        this.rotationNum = rotationNum
    }
}

export default KeyFrameData