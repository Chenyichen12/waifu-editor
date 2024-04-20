/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-16 23:15:00
 */

import { aroundKey } from "./AnimateEntry";

export default interface Entry {
    //条目的id,名字，关键帧数值，是否被注册，以及关键帧的类型
    id: string;
    name: string;
    value: number;
    isregister: boolean;
    aroundType: aroundKey
    howManyKey: number
    isSelect: boolean
    onSelect: () => void
    onValueChange: (newVal: number, preVal: number) => void
}