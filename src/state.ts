export type Position = { x: number; y: number }

export type Kind<I extends string, O extends string> = Readonly<{
	name: string
	inputs: Readonly<Record<I, null>>
	outputs: Readonly<Record<O, null>>
	backgroundColor: string
}>

export type Schema = Record<string, { inputs: string; outputs: string }>

export type GetInputs<
	S extends Schema,
	K extends keyof S = keyof S
> = S[K]["inputs"]

export type GetOutputs<
	S extends Schema,
	K extends keyof S = keyof S
> = S[K]["outputs"]

export type Kinds<S extends Schema> = {
	readonly [K in keyof S]: Kind<GetInputs<S, K>, GetOutputs<S, K>>
}

export type GetSchema<B extends Kinds<Schema>> = {
	[k in keyof B]: B[k] extends Kind<infer I, infer O>
		? { inputs: I; outputs: O }
		: never
}

export type Node<S extends Schema, K extends keyof S = keyof S> = {
	[k in K]: {
		id: string
		kind: k
		inputs: Record<GetInputs<S, k>, null | string>
		outputs: Record<GetOutputs<S, k>, string[]>
		position: Position
	}
}[K]

export type Source<S extends Schema, K extends keyof S = keyof S> = {
	id: string
	output: GetOutputs<S, K>
}

export type Target<S extends Schema, K extends keyof S = keyof S> = {
	id: string
	input: GetInputs<S, K>
}

export type Edge<
	S extends Schema,
	SK extends keyof S = keyof S,
	TK extends keyof S = keyof S
> = {
	id: string
	source: Source<S, SK>
	target: Target<S, TK>
}

export type Focus =
	| { element: "node"; id: string }
	| { element: "edge"; id: string }

export type EditorState<S extends Schema> = {
	nodes: Record<string, Node<S>>
	edges: Record<string, Edge<S>>
	focus: Focus | null
}
