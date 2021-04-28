"use strict";
const kinds = {
    a: {
        inputs: { foo: null, bar: null },
        outputs: {},
        backgroundColor: "lavendar",
        title: "Thing A",
    },
};
function foo() { }
function bar(kinds) {
    // const a = foo<MakeSchema<Kinds>>()
}
function foo2() {
    throw new Error();
}
const fff = foo2();
const fjdaskl = bar(fff);
const a = foo();
// interface Kind<S extends Schema, K extends keyof S> {
// 	inputs: S[K]["inputs"][]
// 	outputs: S[K]["outputs"][]
// 	backgroundColor: string
// 	title: string
// }
// const kinds = {
// 	a: {
// 		inputs: ["foo", "bar"],
// 		outputs: [],
// 		backgroundColor: "lavendar",
// 		title: "Thing A",
// 	},
// }
// type Kinds<S extends Schema> = { [K in keyof S]: Kind<S, K> }
// function
