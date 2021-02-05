import React, { useCallback, useContext, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

import * as actions from "./redux/actions.js"

import { Node, Schema, SystemState, Values } from "./interfaces.js"

import { defaultBackgroundColor } from "./utils.js"
import { StyleContext } from "./styles.js"

export interface BlockContentProps<V extends Values> {
	id: number
	schema: Schema<V>
}

export function BlockContent<V extends Values>({
	id,
	schema,
}: BlockContentProps<V>) {
	const node = useSelector<SystemState<V>, Node<V> | null>(({ nodes }) => {
		const node = nodes.get(id)
		return node === undefined ? null : node
	})

	if (node === null) {
		return null
	} else {
		return <InnerBlockContent node={node} schema={schema} />
	}
}

interface InnerBlockContentProps<V extends Values> {
	node: Node<V>
	schema: Schema<V>
}

function InnerBlockContent<V extends Values>({
	node: { id, kind, value },
	schema,
}: InnerBlockContentProps<V>) {
	const dispatch = useDispatch()

	const setValue = useCallback(
		(value: V[keyof V]) => dispatch(actions.updateNode(id, value)),
		[id]
	)

	const { getBlockHeaderStyle } = useContext(StyleContext)

	const block = schema[kind]

	const blockHeaderStyle = useMemo(() => getBlockHeaderStyle(block), [block])

	return (
		<div
			style={{
				margin: "1px 4px",
				backgroundColor: block.backgroundColor || defaultBackgroundColor,
			}}
		>
			<div className="header" style={blockHeaderStyle}>
				{block.name}
			</div>
			<block.component value={value} setValue={setValue} />
		</div>
	)
}
