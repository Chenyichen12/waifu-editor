/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-05-06 08:45:16
 */
export interface Entry {
    name: string
    id: string
    children: Entry[]
    parent?: Entry  // 用于查找父图层
    isVisible: boolean //是否可见（小眼睛图标）
    listExpand: boolean //是否展开（小三角图标）
    isSelect: boolean //是否选中
    type: "refator" | "child"
    imageUrl?: string
}