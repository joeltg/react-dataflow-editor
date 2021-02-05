import React, { useCallback, useContext, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

import * as actions from "./redux/actions.js"

import { GetValue, Node, Blocks, SystemState, Schema } from "./interfaces.js"

import { defaultBackgroundColor } from "./utils.js"
import { StyleContext } from "./styles.js"

export interface BlockContentProps<S extends Schema> {
	id: number
	blocks: Blocks<S>
}

export function BlockContent<S extends Schema>({
	id,
	blocks,
}: BlockContentProps<S>) {
	const node = useSelector<SystemState<S>, Node<S> | null>(({ nodes }) => {
		const node = nodes.get(id)
		return node === undefined ? null : node
	})

	if (node === null) {
		return null
	} else {
		return <InnerBlockContent node={node} blocks={blocks} />
	}
}

interface InnerBlockContentProps<S extends Schema> {
	node: Node<S>
	blocks: Blocks<S>
}

function InnerBlockContent<S extends Schema>({
	node: { id, kind, value },
	blocks,
}: InnerBlockContentProps<S>) {
	const dispatch = useDispatch()

	const setValue = useCallback(
		(value: GetValue<S, keyof S>) => dispatch(actions.updateNode(id, value)),
		[id]
	)

	const { getBlockHeaderStyle } = useContext(StyleContext)

	const block = blocks[kind]

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
