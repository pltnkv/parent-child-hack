import createElement from 'utils/createElement'
import IBounds from 'types/IBounds'

export default class ControlsLayer {

	private selectionAreaDiv: HTMLElement
	private selectionBorderDiv: HTMLElement
	private controlTopDiv: HTMLElement
	private controlBottomDiv: HTMLElement
	private controlLeftDiv: HTMLElement
	private controlRightDiv: HTMLElement

	constructor(public canvasContainer: HTMLElement) {
		const layerElement = createElement({position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none'})
		canvasContainer.appendChild(layerElement)

		this.selectionAreaDiv =
			createElement({position: 'absolute', visibility: 'hidden', pointerEvents: 'none', border: '1px solid #2b79ff', background: 'rgba(43, 121, 255, 0.2)'})
		layerElement.appendChild(this.selectionAreaDiv)

		this.selectionBorderDiv = createElement({position: 'absolute', visibility: 'hidden', pointerEvents: 'none', border: '1px solid #2b79ff'})
		layerElement.appendChild(this.selectionBorderDiv)

		this.controlTopDiv = this.createControl('top', 'ns-resize')
		this.controlLeftDiv = this.createControl('left', 'ew-resize')
		this.controlBottomDiv = this.createControl('bottom', 'ns-resize')
		this.controlRightDiv = this.createControl('right', 'ew-resize')
		layerElement.appendChild(this.controlTopDiv)
		layerElement.appendChild(this.controlLeftDiv)
		layerElement.appendChild(this.controlBottomDiv)
		layerElement.appendChild(this.controlRightDiv)
	}

	private createControl(type: string, cursor: string): HTMLElement {
		const box = createElement(
			{
				position: 'absolute',
				visibility: 'hidden',
				width: '20px',
				height: '20px',
				margin: '-10px 0 0 -10px',
				padding: '5px',
				pointerEvents: 'auto',
				cursor: cursor,
			})
		box.setAttribute('control-type', type)
		const circle = createElement(
			{
				border: '2px solid rgba(0,0,0,0.4)',
				backgroundColor: '#FFF',
				borderRadius: '50%',
				width: '10px',
				height: '10px',
				pointerEvents: 'none',
			})
		box.appendChild(circle)
		return box
	}

	drawControls(bounds: IBounds) {
		this.controlTopDiv.style.visibility = 'visible'
		this.controlBottomDiv.style.visibility = 'visible'
		this.controlLeftDiv.style.visibility = 'visible'
		this.controlRightDiv.style.visibility = 'visible'

		this.controlTopDiv.style.top = bounds.top + 'px'
		this.controlTopDiv.style.left = bounds.left + bounds.width / 2 + 'px'

		this.controlBottomDiv.style.top = bounds.bottom + 'px'
		this.controlBottomDiv.style.left = bounds.left + bounds.width / 2 + 'px'

		this.controlLeftDiv.style.top = bounds.top + bounds.height / 2 + 'px'
		this.controlLeftDiv.style.left = bounds.left + 'px'

		this.controlRightDiv.style.top = bounds.top + bounds.height / 2 + 'px'
		this.controlRightDiv.style.left = bounds.right + 'px'
	}

	hideControls() {
		this.controlTopDiv.style.visibility = 'hidden'
		this.controlBottomDiv.style.visibility = 'hidden'
		this.controlLeftDiv.style.visibility = 'hidden'
		this.controlRightDiv.style.visibility = 'hidden'
	}

	drawSelectionArea(bounds: IBounds) {
		this.selectionAreaDiv.style.left = bounds.x + 'px'
		this.selectionAreaDiv.style.top = bounds.y + 'px'
		this.selectionAreaDiv.style.width = bounds.width + 'px'
		this.selectionAreaDiv.style.height = bounds.height + 'px'
		this.selectionAreaDiv.style.visibility = 'visible'
	}

	hideSelectionArea() {
		this.selectionAreaDiv.style.visibility = 'hidden'
	}

	drawSelectionBorder(bounds: IBounds) {
		this.selectionBorderDiv.style.left = bounds.x + 'px'
		this.selectionBorderDiv.style.top = bounds.y + 'px'
		this.selectionBorderDiv.style.width = bounds.width + 'px'
		this.selectionBorderDiv.style.height = bounds.height + 'px'
		this.selectionBorderDiv.style.visibility = 'visible'
		this.drawControls(bounds)
	}

	hideSelectionBorder() {
		this.selectionBorderDiv.style.visibility = 'hidden'
		this.hideControls()
	}

}
