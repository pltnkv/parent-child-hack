import CanvasController from 'canvas/CanvasController'
import IBounds from 'types/IBounds'
import {IBaseWidgetData} from 'canvas/widgets/IBaseWidgetData'
import {MovingWidgets} from 'canvas/EventsHandler'
import createElement from 'utils/createElement'

export default abstract class BaseWidget {
	element: HTMLElement

	constructor(private controller: CanvasController, element: HTMLElement, initData: IBaseWidgetData) {
		this.element = element
		if (initData.container) {
			this.containerType = 'flex'
		}
	}

	get isAttachedToCanvas(): boolean {
		return this.element.parentElement === this.controller.widgetsContainer
	}

	get isContainer(): boolean {
		return this.element.getAttribute('container') !== null
	}

	get isDADEnabled(): boolean {
		return this.element.getAttribute('disable-dad') === null
	}

	set isDADEnabled(value: boolean) {
		if (value) {
			this.element.removeAttribute('disable-dad')
		} else {
			this.element.setAttribute('disable-dad', 'true')
		}
	}

	get containerType(): 'not' | 'flex' | 'block' {
		const attrVal = this.element.getAttribute('container')
		if (attrVal === 'flex') {
			return 'flex'
		} else if (attrVal === 'block') {
			return 'block'
		} else {
			return 'not'
		}
	}

	set containerType(value: 'not' | 'flex' | 'block') {
		if (value === 'not') {
			let res: boolean
			if (this.element.children.length > 0) {
				res = confirm('Remove all children')
			} else {
				res = true
			}

			if (res) {
				const childWidgets = Array.from(this.element.children).map(child => this.controller.getWidgetByElement(child)!)
				this.controller.deleteWidgets(childWidgets)
				this.element.removeAttribute('container')
				this.element.style.display = 'block'
			}
		} else {
			this.element.setAttribute('container', value)
			this.element.innerText = ''
			this.element.style.display = value
		}
	}

	contains(widget: BaseWidget): boolean {
		if (this === widget) {
			return false
		} else {
			return this.element.contains(widget.element)
		}
	}

	appendChild(widget: BaseWidget, index?: number) {
		const refChild = index === undefined ? null : this.element.children[index]
		this.element.insertBefore(widget.element, refChild)
		widget.element.style.position = 'relative'
	}

	get childrenWidgets(): BaseWidget[] {
		return Array.from(this.element.children)
			.map(child => this.controller.getWidgetByElement(child)!)
	}

	get parentWidget(): BaseWidget | undefined {
		if (this.isAttachedToCanvas) {
			return undefined
		} else {
			return this.controller.getWidgetByElement(this.element.parentElement)
		}
	}

	get isPositionControlledByParent():boolean {
		return this.parentWidget?.containerType === 'flex'
	}

	destroy() {
		this.element.remove()
	}

	////////////////////////////////////////////////////////////////
	// Drag-and-drop
	////////////////////////////////////////////////////////////////

	private ghostElements: HTMLElement[] = []
	private movingWidgets: MovingWidgets = []
	private posThresholds: number[] = []
	private targetIndex: number = 0
	private originalChildren: Element[] = []
	private direction: 'row' | 'column' | 'free' = 'free'

	addGhosts(movingWidgets: MovingWidgets) {
		this.direction = <any>this.element.style.flexDirection || 'row' //todo impl free
		this.originalChildren = Array.from(this.element.children)
		this.posThresholds = this.getPosThresholds(this.originalChildren)

		this.movingWidgets = movingWidgets
		this.ghostElements = movingWidgets.map(mw => {
			return createElement({
				position: 'relative',
				pointerEvents: 'none',
				border: '1px solid #2b79ff',
				width: mw.w.width + 'px',
				height: mw.w.height + 'px',
				margin: mw.w.element.style.margin,
			})
		})
		this.ghostElements.forEach(ghost => {
			this.element.insertBefore(ghost, null)
		})
		this.highlighted = true
	}

	private getPosThresholds(children: Element[]) {
		return children.map(c => {
			const rect = c.getBoundingClientRect()
			if (this.direction === 'row') {
				return rect.left + rect.width / 2
			} else if (this.direction === 'column') {
				return rect.top + rect.height / 2
			} else {
				throw new Error('getPosThresholds not work with "free" direction')
			}
		})
	}

	updateGhosts(mouseX: number, mouseY: number) {
		this.targetIndex = this.findTargetIndex(this.direction === 'row' ? mouseX : mouseY)
		this.ghostElements.forEach(ghost => {
			this.element.insertBefore(ghost, this.originalChildren![this.targetIndex])
		})
	}

	private findTargetIndex(pos: number): number {
		for (let i = 0; i < this.posThresholds.length; i++) {
			if (pos < this.posThresholds[i]) {
				return i
			}
		}
		return this.posThresholds.length
	}

	applyGhosts() {
		this.removeGhostsElements()
		this.movingWidgets.forEach((mw, index) => {
			const ghost = this.ghostElements[index]
			mw.w.element.style.top = ghost.style.top
			mw.w.element.style.left = ghost.style.left
			this.appendChild(mw.w, this.targetIndex)
		})
		this.clearGhostsData()
		this.controller.forceUpdateSelectionBorder()
	}

	removeGhosts() {
		this.removeGhostsElements()
		this.clearGhostsData()
	}

	private removeGhostsElements() {
		this.ghostElements.forEach(ghost => {
			ghost.remove()
		})
	}

	private clearGhostsData() {
		this.ghostElements = []
		this.movingWidgets = []
		this.highlighted = false
	}

	////////////////////////////////////////////////////////////////
	// Geometry
	////////////////////////////////////////////////////////////////

	get x(): number {
		return parseInt(this.element.style.left)
	}

	set x(value: number) {
		this.element.style.left = value + 'px'
		this.controller.onWidgetRectChanged()
	}

	get y() {
		return parseInt(this.element.style.top)
	}

	set y(value: number) {
		this.element.style.top = value + 'px'
		this.controller.onWidgetRectChanged()
	}

	get width() {
		return parseInt(this.element.style.width)
	}

	set width(value: number) {
		this.element.style.width = value + 'px'
		this.controller.onWidgetRectChanged()
	}

	get height() {
		return parseInt(this.element.style.height)
	}

	set height(value: number) {
		this.element.style.height = value + 'px'
		this.controller.onWidgetRectChanged()
	}

	set highlighted(value: boolean) {
		if (value) {
			this.element.style.outline = '1px solid #000'
		} else {
			this.element.style.outline = 'none'
		}
	}

	get relativeBounds(): IBounds {
		const x = this.x
		const y = this.y
		const width = this.width
		const height = this.height
		return {
			x,
			y,
			width,
			height,
			top: y,
			left: x,
			bottom: y + height,
			right: x + width,
		}
	}

	get absoluteBounds(): IBounds {
		return this.element.getBoundingClientRect()
	}
}
