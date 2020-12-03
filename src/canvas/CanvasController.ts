import ShapeWidget, {IShapeWidgetData} from 'canvas/widgets/ShapeWidget'
import BaseWidget from 'canvas/widgets/BaseWidget'
import ControlsLayer from 'canvas/ControlsLayer'
import createElement from 'utils/createElement'
import getUnionBounds from 'utils/getUnionBounds'
import IPoint from 'types/IPoint'
import {MovingWidgets} from 'canvas/EventsHandler'
import getRootWidgets from 'utils/getRootElements'
import SidebarController from 'SidebarController'

let idCounter = 0

export default class CanvasController {

	sidebar: SidebarController
	selectedWidgets: BaseWidget[] = []
	widgets: BaseWidget[] = []
	widgetsContainer: HTMLElement
	controlsLayer: ControlsLayer

	constructor(public canvasContainer: HTMLElement, sidebarController: SidebarController) {
		this.sidebar = sidebarController
		this.widgetsContainer = createElement({position: 'absolute', width: '100%', height: '100%'})
		canvasContainer.appendChild(this.widgetsContainer)
		this.controlsLayer = new ControlsLayer(canvasContainer)
		setInterval(() => {
			this.saveData()
		}, 500)
	}

	createWidgetFromHTML(html: string): BaseWidget[] {
		const div = document.createElement('div')
		div.innerHTML = html.trim()
		return Array.from(div.children).map(child => {
			return this.createWidgetFromElement(child as HTMLElement)
		})
	}

	private createWidgetFromElement(el: HTMLElement): BaseWidget {
		const widget = new ShapeWidget( //todo not only ShapeWidget
			this,
			{
				id: ++idCounter,
				type: 'shape',
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				color: '#000000',
				container: false,
			},
		)
		widget.element = el
		this.widgets.push(widget)

		Array.from(widget.element.children).forEach(child => {
			this.createWidgetFromElement(child as HTMLElement)
		})

		return widget
	}

	createTextWidget(data: any) {
		// this.state.widgets.push({
		// 	id: ++idCounter,
		// 	type: 'text',
		// 	x: data.x || 0,
		// 	y: data.y || 0,
		// 	text: data.text || 'text',
		// 	color: data.color || '#000000',
		// })
		// this.stateChanged = true
	}

	createShapeWidget(data: Partial<IShapeWidgetData>, parent?: BaseWidget): BaseWidget {
		const widget = new ShapeWidget(
			this,
			{
				id: ++idCounter,
				type: 'shape',
				x: data.x || 0,
				y: data.y || 0,
				width: data.width || 100,
				height: data.height || 100,
				color: data.color || '#000000',
				container: data.container || false,
			},
		)
		this.widgets.push(widget)
		if (parent) {
			parent.appendChild(widget)
		} else {
			this.appendToCanvas(widget)
		}
		return widget
	}

	appendToCanvas(widget: BaseWidget) {
		//TODO support zIndex
		this.widgetsContainer.appendChild(widget.element)
		widget.element.style.position = 'absolute'
		this.saveData()
	}

	getWidgetByElement(element: Element | null): BaseWidget | undefined {
		return element
			? this.widgets.find(w => element === w.element)!
			: undefined
	}

	moveWidget(widget: BaseWidget, newX: number, newY: number) {
		widget.x = newX
		widget.y = newY
	}

	selectWidgets(widgets: BaseWidget[]) {
		this.selectedWidgets = widgets.filter((item, pos, self) => self.indexOf(item) === pos)
		this.forceUpdateSelectionBorder()
		this.sidebar.onSelectionUpdated(this.selectedWidgets)
	}

	forceUpdateSelectionBorder() {
		if (this.selectedWidgets.length > 0) {
			this.controlsLayer.drawSelectionBorder(getUnionBounds(this.selectedWidgets.map(w => w.absoluteBounds)))
		} else {
			this.controlsLayer.hideSelectionBorder()
		}
	}

	unselectWidget() {
		if (this.selectedWidgets.length > 0) {
			this.selectedWidgets = []
			this.forceUpdateSelectionBorder()
			this.sidebar.onSelectionClear()
		}
	}

	getSelectedWidgets(rootOnly: boolean = false): BaseWidget[] {
		if (rootOnly) {
			return getRootWidgets(this.selectedWidgets)
		} else {
			return this.selectedWidgets
		}
	}

	deleteWidgets(deletingWidgets: BaseWidget[]) {
		deletingWidgets.forEach(w => {
			const children = w.childrenWidgets
			if (children.length > 0) {
				this.deleteWidgets(children)
			}
			w.destroy()
		})
		this.widgets = this.widgets.filter(w => deletingWidgets.indexOf(w) === -1)
		this.saveData()
	}

	isWidgetsSelected(): boolean {
		return this.selectedWidgets.length > 0
	}

	findWidgetByElement(element: any): BaseWidget | undefined {
		return this.widgets.find(w => {
			return w.element === element
		})
	}

	findTargetContainer(absPoint: IPoint, movingWidgets: MovingWidgets): BaseWidget | undefined {
		const elements = document.elementsFromPoint(absPoint.x, absPoint.y)
		let widgetElement: BaseWidget | undefined
		const targetWidgetElement = elements.find(elementUnderPoint => {
			if (elementUnderPoint.getAttribute('data-id')) {
				widgetElement = this.getWidgetByElement(elementUnderPoint)
				return widgetElement
					&& widgetElement.isContainer
					&& widgetElement.isDADEnabled
					&& !movingWidgets.some(mw => widgetElement === mw.w)
			} else {
				return false
			}

		})
		return targetWidgetElement ? widgetElement : undefined
	}

	private saveData() {
		localStorage.setItem('canvas', this.widgetsContainer.innerHTML)
	}

	////////////////////////////////////////
	// Events
	onWidgetRectChanged() {
		this.forceUpdateSelectionBorder()
	}
}
