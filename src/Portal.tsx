import React, { memo, useCallback, useContext, useMemo } from "react"
import { createPortal } from "react-dom"

import { useDispatch, useSelector } from "react-redux"

import * as actions from "./redux/actions.js"

import { GetValue, Node, Blocks, EditorState, Schema } from "./interfaces.js"

import { StyleContext } from "./styles.js"
import { blockMarginX, blockMarginY, CanvasContext } from "./utils.js"

export interface PortalProps<S extends Schema> {
	id: number
	blocks: Blocks<S>
	container: SVGForeignObjectElement
}

export const Portal = memo(renderPortal)

function renderPortal<S extends Schema>(props: PortalProps<S>) {
	const node = useSelector<EditorState<S>, Node<S> | undefined>(({ nodes }) =>
		nodes.get(props.id)
	)

	if (node === undefined) {
		return null
	} else {
		return createPortal(
			<PortalContent node={node} blocks={props.blocks} />,
			props.container
		)
	}
}

interface PortalContentProps<S extends Schema> {
	node: Node<S>
	blocks: Blocks<S>
}

function PortalContent<S extends Schema>({
	node: { id, kind, value },
	blocks,
}: PortalContentProps<S>) {
	const dispatch = useDispatch()

	const setValue = useCallback(
		(value: GetValue<S, keyof S>) => dispatch(actions.updateNode(id, value)),
		[id]
	)

	const { getBlockHeaderStyle, getBlockContentStyle } = useContext(StyleContext)

	const block = blocks[kind]

	const { blockHeaderStyle, blockContentStyle } = useMemo(
		() => ({
			blockHeaderStyle: getBlockHeaderStyle(block),
			blockContentStyle: {
				...getBlockContentStyle(block),
				margin: `${blockMarginY}px ${blockMarginX}px`,
			},
		}),
		[block]
	)

	const { observer } = useContext(CanvasContext)
	const ref = useCallback((div: HTMLDivElement) => {
		if (div !== null) {
			observer.observe(div)
		}
	}, [])

	return (
		<div ref={ref} className="content" style={blockContentStyle}>
			<div className="header" style={blockHeaderStyle}>
				{block.name}
			</div>
			<block.component value={value} setValue={setValue} />
		</div>
	)
}
