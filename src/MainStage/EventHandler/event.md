```mermaid
stateDiagram-v2
正常状态-->拖动状态: 空格按下 
拖动状态-->正常状态: 空格放开
正常状态-->多选状态: shift按下
多选状态-->正常状态: shift放开
```