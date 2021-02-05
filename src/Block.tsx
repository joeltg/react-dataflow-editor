import React, { useCallback, useContext, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

import * as actions from "./redux/actions.js"

import { Node, Schema, SystemState, Values } from "./interfaces.js"

import { defaultBackgroundColor } from "./utils.js"
import { StyleContext } from "./styles.js"

export interface BlockContentProps<K extends string, V extends Values<K>> {
	id: number
	schema: Schema<K, V>
}

export function BlockContent<K extends string, V extends Values<K>>({
	id,
	schema,
}: BlockContentProps<K, V>) {
	const node = useSelector<SystemState<K, V>, Node<K, V> | null>(
		({ nodes }) => {
			const node = nodes.get(id)
			return node === undefined ? null : node
		}
	)

	if (node === null) {
		return null
	} else {
		return <InnerBlockContent node={node} schema={schema} />
	}
}

interface InnerBlockContentProps<K extends string, V extends Values<K>> {
	node: Node<K, V>
	schema: Schema<K, V>
}

function InnerBlockContent<K extends string, V extends Values<K>>({
	node: { id, kind, value },
	schema,
}: InnerBlockContentProps<K, V>) {
	const dispatch = useDispatch()

	const setValue = useCallback(
		(value: V[K]) => dispatch(actions.updateNode(id, value)),
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
