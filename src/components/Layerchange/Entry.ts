

export  interface Entry {
    name: string
    children: Entry[]
    parentName: string  // 用于查找父图层
    isVisible: boolean //是否可见（小眼睛图标）
    listExpand:boolean //是否展开（小三角图标）
    isSelect:boolean //是否选中
}