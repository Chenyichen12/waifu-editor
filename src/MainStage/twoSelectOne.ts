/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-10 08:42:14
 */
type isNever<T> = [T] extends [never] ? true : false;

type UnionToIntersection<T> = (T extends any ? (x: T) => void : never) extends (
    x: infer R
) => void
    ? R
    : never;

type LastOfUnion<T> = UnionToIntersection<
    T extends any ? (x: T) => void : never
> extends (x: infer L) => void
    ? L
    : never;

type UnionToTuple<T, R extends any[] = []> = isNever<T> extends true
    ? R
    : UnionToTuple<Exclude<T, LastOfUnion<T>>, [LastOfUnion<T>, ...R]>;
// 以上为 联合类型转元祖
// -------

type V = {
    a?: string;
    b?: number;
    c?: boolean;
};

type RequireKey<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: T[P]
}


type RequireTupleOne<T, K extends any[], R extends any[] = []> = R['length'] extends K['length'] ? never : (RequireKey<V, K[R['length']]> | RequireTupleOne<T, K, [...R, 1]>)

// const value1: RequireTupleOne<V, UnionToTuple<keyof V>> = {}

// 再封装一下
type RequireAllOne<T> = RequireTupleOne<T, UnionToTuple<keyof T>>

// V对象里的key 必须必填一个
// const value2: RequireAllOne<V> = {}



type Without<FirstType, SecondType> = { [KeyType in Exclude<keyof FirstType, keyof SecondType>]?: never };

type MergeExclusive<FirstType, SecondType> =
    (FirstType | SecondType) extends object ?
    (Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType) :
    FirstType | SecondType;

export type { MergeExclusive, RequireAllOne }
