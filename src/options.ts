export interface Options {
	borderColor: string
	backgroundColor: string
	unit: number
	height: number
	nodeWidth: number
	portRadius: number
	portMargin: number
	nodeMarginX: number
	nodeHeaderHeight: number
	canvasPaddingRight: number
}

export const defaultOptions: Options = {
	borderColor: "dimgray",
	backgroundColor: "lightgray",
	unit: 54,
	height: 12,
	nodeWidth: 156,
	portRadius: 12,
	portMargin: 12,
	nodeMarginX: 4,
	nodeHeaderHeight: 24,
	canvasPaddingRight: 480,
}
