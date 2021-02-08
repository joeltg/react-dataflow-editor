import React, { memo, useCallback, useContext, useMemo } from "react"
import { createPortal } from "react-dom"

import { useDispatch, useSelector } from "react-redux"

import * as actions from "./redux/actions.js"

import { GetValue, Node, Blocks, EditorState, Schema } from "./interfaces.js"

import { StyleContext } from "./styles.js"

export interface BlockContentProps<S extends Schema> {
	id: number
	blocks: Blocks<S>
	container: HTMLDivElement
}

function renderBlockContent<S extends Schema>(props: BlockContentProps<S>) {
	const node = useSelector<EditorState<S>, Node<S> | undefined>(({ nodes }) =>
		nodes.get(props.id)
	)

	if (node === undefined) {
		return null
	} else {
		return createPortal(
			<InnerBlockContent node={node} blocks={props.blocks} />,
			props.container
		)
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

	const { getBlockHeaderStyle, getBlockContainerStyle } = useContext(
		StyleContext
	)

	const block = blocks[kind]

	const { blockHeaderStyle, blockContainerStyle } = useMemo(
		() => ({
			blockHeaderStyle: getBlockHeaderStyle(block),
			blockContainerStyle: getBlockContainerStyle(block),
		}),
		[block]
	)

	return (
		<div className="container" style={blockContainerStyle}>
			<div className="header" style={blockHeaderStyle}>
				{block.name}
			</div>
			<block.component value={value} setValue={setValue} />
		</div>
	)
}

export const BlockContent = memo(renderBlockContent)
