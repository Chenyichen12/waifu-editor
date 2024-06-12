/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

interface WaifuLayerManagerInf{
    upDateLayer(id: string, type?:string):void;
    removeLayer(id: string):void;
}
interface WaifuLayerInf {
    type: string
    get id(): string
    get name(): string
    set name(name: string)
    get selected(): boolean
    set selected(s: boolean)

    get parent(): WaifuLayerInf | undefined
    get hasChildren(): boolean
    get childrens(): WaifuLayerInf[]
    set childrens(c: WaifuLayerInf[])

    setManager(manager: WaifuLayerManagerInf):void;
}

export type { WaifuLayerInf, WaifuLayerManagerInf };
