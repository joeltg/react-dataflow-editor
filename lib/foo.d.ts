declare type KindID = string;
interface Kind {
    inputs: Record<string, null>;
    outputs: Record<string, null>;
    backgroundColor: string;
    title: string;
}
declare type MakeSchema<Kinds extends Record<KindID, Kind>> = {
    [K in keyof Kinds]: {
        inputs: keyof Kinds[K]["inputs"];
        outputs: keyof Kinds[K]["outputs"];
    };
};
declare const kinds: {
    a: {
        inputs: {
            foo: null;
            bar: null;
        };
        outputs: {};
        backgroundColor: string;
        title: string;
    };
};
declare type S = MakeSchema<typeof kinds>;
declare type Schema = Record<string, {
    inputs: string;
    outputs: string;
}>;
declare function foo<S2 extends Schema>(): S2;
declare function bar<Kinds extends Record<KindID, Kind>>(kinds: Kinds): void;
declare function foo2(): never;
declare const fff: never;
declare const fjdaskl: void;
declare const a: MakeSchema<{
    a: {
        inputs: {
            foo: null;
            bar: null;
        };
        outputs: {};
        backgroundColor: string;
        title: string;
    };
}>;
declare type A = typeof a;
