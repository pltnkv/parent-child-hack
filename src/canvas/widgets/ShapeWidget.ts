import BaseWidget from 'canvas/widgets/BaseWidget'
import CanvasController from 'canvas/CanvasController'
import {IBaseWidgetData} from 'canvas/widgets/IBaseWidgetData'

export interface IShapeWidgetData extends IBaseWidgetData {
	type: 'shape'
	x: number
	y: number
	width: number
	height: number
	color: string
}

export default class ShapeWidget extends BaseWidget {

	constructor(controller: CanvasController, initData: IShapeWidgetData) {

		const div = document.createElement('div')
		div.style.top = initData.y + 'px'
		div.style.left = initData.x + 'px'
		div.style.width = initData.width + 'px'
		div.style.height = initData.height + 'px'
		div.style.backgroundColor = initData.color
		div.setAttribute('data-id', 'true')

		super(controller, div, initData)
	}
}
