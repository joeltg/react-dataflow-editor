# react-dataflow-editor

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme) [![license](https://img.shields.io/github/license/joeltg/react-dataflow-editor)](https://opensource.org/licenses/MIT) [![NPM version](https://img.shields.io/npm/v/react-dataflow-editor)](https://www.npmjs.com/package/react-dataflow-editor) ![TypeScript types](https://img.shields.io/npm/types/react-dataflow-editor) ![lines of code](https://img.shields.io/tokei/lines/github/joeltg/react-dataflow-editor)

A generic drag-and-drop dataflow editor for React.

> ✨ You can read about the design of this component in [this blog post](https://research.protocol.ai/blog/2021/designing-a-dataflow-editor-with-typescript-and-react/)!

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Schema](#schema)
  - [Editor](#editor)
- [API](#api)
- [Demo](#demo)
- [Contributing](#contributing)

## Install

```
npm i react-dataflow-editor
```

## Usage

### Schema

To use the editor, you must first define a static _schema_ listing the kinds of nodes you want to use. Here's an example schema:

```typescript
const kinds = {
	add: {
		name: "Addition",
		inputs: { a: null, b: null },
		outputs: { sum: null },
		backgroundColor: "lavender",
	},
	div: {
		name: "Division",
		inputs: { dividend: null, divisor: null },
		outputs: { quotient: null, remainder: null },
		backgroundColor: "darksalmon",
	},
}
```

This schema declares two kinds of nodes - an `add` node with two inputs `a` and `b` and one output `sum`, and a `div` node with two inputs `dividend` and `divisor` and two outputs `quotient` and `remainder`.

A schema is an object assignable to the type `Record<string, { name: string; inputs: Record<string, null>; outputs: Record<string, null>; backgroundColor: string }>`. However the schema **must be defined without type annotations** (and with TypeScript's strict mode enabled); this is because the editor is designed to leverage TypeScript's default type assignment rules to derive a more specific concrete typing of each schema that it will use to paramerize the editor component.

### Editor

Once you've defined your schema (with no type annotations), you can pass it into the `Editor` component, along with a state value and a dispatch method. `Editor` is a controlled component - meaning the editor always renders the value of the current state prop, no matter what - but it doesn't use an `onChange: (newState) => void` callback like most controlled React components. Instead, it uses a `dispatch` callback that gets invoked with individual actions when the user tries to create/delete/move nodes or edges.

If all you want is to get the new state value on every change, you should use the exported `makeReducer` method in conjunction with React's `useReducer` hook, like in this example:

```typescript
import React, { useReducer } from "react"
import {
	Editor,
	EditorState,
	GetSchema,
	EditorAction,
	makeReducer,
} from "react-dataflow-editor"

// Derive a concrete type-level schema from the kinds catalog
type S = GetSchema<typeof kinds>

interface MyEditorProps {
	initialValue?: EditorState<S>
}

const defaultInitialValue: EditorState<S> = {
	nodes: {},
	edges: {},
	focus: null,
}

function MyEditor(props: MyEditorProps) {
	const reducer = makeReducer(kinds)
	const [state, dispatch] = useReducer(
		reducer,
		props.initialValue || defaultInitialValue
	)

	return <Editor<S> kinds={kinds} state={state} dispatch={dispatch} />
}
```

If you want to take more fine-grained control over the editor actions - for example, if you wanted to prevent the user from deleting certain nodes - you can write you own `dispatch` method with your own logic inside it. In that case, you'll probably want to make use of the exported `reduce` method instead.

The `kinds`, `dispatch`, and `options` props provided to the `Editor` component **must not change** - the editor will not update to reflect new values of these props. Only their initial values will be used.

### Viewer

If you want to render a read-only version of the editor, use the separate `Viewer` component. The viewer component takes all the same props as the editor component, including a `dispatch` callback, but the only actions that it will get invoked with are `Focus` actions. If you want users to be able to and deselect nodes and edges (and if you want to use the currently-selected node or edge in your application), you still need to use the `useReducer` hook the same way.

## Demo

- [Editable demo](https://joeltg.github.io/react-dataflow-editor/demo/editable.html) ([source](https://github.com/joeltg/react-dataflow-editor/blob/gh-pages/demo/editable.tsx))
- [Read-only demo](https://joeltg.github.io/react-dataflow-editor/demo/readonly.html) ([source](https://github.com/joeltg/react-dataflow-editor/blob/gh-pages/demo/readonly.tsx))

![](./static/example-action-delete-edge.gif)

## Contributing

PRs accepted!

I'm very interested in improving the real-world usability of the library. In particular I don't really know how to expose control over styling and layout in a useful way, so if you're trying to use this component I'd love to hear what kind of interface you'd like to have. Please open an issue to discuss this!

## License

MIT © 2021 Joel Gustafson
