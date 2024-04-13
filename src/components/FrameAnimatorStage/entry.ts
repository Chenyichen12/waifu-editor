
//枚举类型关键帧的种类，one代表初始状态，two代表两帧状态,three代表三帧状态
enum Type{
    One,TWO,THREE
}

export class Entry {
    //条目的id,名字，关键帧数值，是否被注册，以及关键帧的类型
    id: number;
    name: string;
    value: number;
    isregister: boolean;
    type: Type;
    public constructor(id:number,name: string, value: number, isregister: boolean, type: Type=Type.One) {
        this.id=id;
        this.type=type;
        this.name = name;
        this.value = value;
        this.isregister = isregister;
    }
    public setId(id:number):void{
        this.id=id;
    }

    public getId():number{
        return this.id;
    }
    //设置关键帧的数值
    public setValue(value:number):void{
        this.value=value;
    }
    //获取关键帧的数值
    public getValue():number{
        return this.value;
    }
    //设置关键帧的类型
    public SetType(type:Type):void{
        this.type=type;
    }
    //获取关键帧的类型
    public getType():Type{
        return this.type;
    }
    //设置条目的名字
    public getName():string{
        return this.name;
    }
    //设置条目是否被注册
    public setIsregister(isregister:boolean):void{
        this.isregister=isregister;
    }
    //获取条目是否被注册
    public getIsregister():boolean{
        return this.isregister;
    }
}