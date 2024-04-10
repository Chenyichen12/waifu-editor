
//枚举类型关键帧的种类，one代表初始状态，two代表两帧状态,three代表三帧状态
enum Type{
    One,TWO,THREE
}

class entry {
    //条目的名字，关键帧数值，是否被注册，以及关键帧的类型
    name: string;
    value: number;
    isregister: boolean;
    type: Type;
     constructor(name: string, value: number, isregister: boolean, type: Type=Type.One) {
        this.type=type;
        this.name = name;
        this.value = value;
        this.isregister = isregister;
    }
    //设置关键帧的数值
    setValue(value:number):void{
        this.value=value;
    }
    //获取关键帧的数值
    getValue():number{
        return this.value;
    }
    //设置关键帧的类型
    SetType(type:Type):void{
        this.type=type;
    }
    //获取关键帧的类型
    getType():Type{
        return this.type;
    }
    //设置条目的名字
    getName():string{
        return this.name;
    }
    //设置条目是否被注册
    setIsregister(isregister:boolean):void{
        this.isregister=isregister;
    }
    //获取条目是否被注册
    getIsregister():boolean{
        return this.isregister;
    }
}