import BaseWidget from 'canvas/widgets/BaseWidget'
import Color from 'utils/Color'

//Apply to set of widget
type MultiProxy = {
	get: () => any
	set: (value: any) => void
}

//Apply to single element
type ElementProxy = {
	get: (widget: BaseWidget) => any
	set: (widget: BaseWidget, value: any) => void
}

enum StyleName {
	Fill = 'fill',
	Text = 'text',
	TextSize = 'text-size',
	TextColor = 'text-color',
	Padding = 'padding',
	Margin = 'margin',
	BorderColor = 'border-color',
	BorderWidth = 'border-width',
	BorderRadius = 'border-radius',
	WidgetType = 'widget-type',
	JustifyContent = 'justify-content',
	FlexDirection = 'flex-direction',
	AlignItems = 'align-items',
	DisableDAD = 'disable-dad',
}

const styles: {[index: string]: ElementProxy} = {
	[StyleName.Fill]: {
		get: (widget: BaseWidget) => {
			const val = widget.element.style.backgroundColor
			const clr = new Color()
			clr.setColor(val)
			return clr.getHEX()
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.backgroundColor = value
		},
	},
	[StyleName.Text]: {
		get: (widget: BaseWidget) => {
			return widget.element.innerText
		},
		set: (widget: BaseWidget, value: any) => {
			if (!widget.isContainer) {
				widget.element.innerText = value
			}
		},
	},
	[StyleName.TextSize]: {
		get: (widget: BaseWidget) => {
			return parseInt(widget.element.style.fontSize) || 14
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.fontSize = value + 'px'
		},
	},
	[StyleName.TextColor]: {
		get: (widget: BaseWidget) => {
			const val = widget.element.style.color || '#000'
			const clr = new Color()
			clr.setColor(val)
			return clr.getHEX()
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.color = value
		},
	},
	[StyleName.Padding]: {
		get: (widget: BaseWidget) => {
			return parseInt(widget.element.style.padding) || 0
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.padding = value + 'px'
		},
	},
	[StyleName.Margin]: {
		get: (widget: BaseWidget) => {
			return parseInt(widget.element.style.margin) || 0
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.margin = value + 'px'
		},
	},
	[StyleName.BorderColor]: {
		get: (widget: BaseWidget) => {
			const val = widget.element.style.borderColor || '#000'
			const clr = new Color()
			clr.setColor(val)
			return clr.getHEX()
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.borderColor = value
		},
	},
	[StyleName.BorderWidth]: {
		get: (widget: BaseWidget) => {
			return parseInt(widget.element.style.borderWidth) || 0
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.borderStyle = 'solid'
			widget.element.style.borderWidth = value + 'px'
		},
	},
	[StyleName.BorderRadius]: {
		get: (widget: BaseWidget) => {
			return parseInt(widget.element.style.borderRadius) || 0
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.borderRadius = value + 'px'
		},
	},
	[StyleName.WidgetType]: {
		get: (widget: BaseWidget) => {
			return widget.containerType
		},
		set: (widget: BaseWidget, value: any) => {
			widget.containerType = value
		},
	},
	[StyleName.JustifyContent]: {
		get: (widget: BaseWidget) => {
			return widget.element.style.justifyContent || 'flex-start'
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.justifyContent = value
		},
	},
	[StyleName.FlexDirection]: {
		get: (widget: BaseWidget) => {
			return widget.element.style.flexDirection || 'row'
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.flexDirection = value
		},
	},
	[StyleName.AlignItems]: {
		get: (widget: BaseWidget) => {
			return widget.element.style.alignItems || 'stretch'
		},
		set: (widget: BaseWidget, value: any) => {
			widget.element.style.alignItems = value
		},
	},
	[StyleName.DisableDAD]: {
		get: (widget: BaseWidget) => {
			return !widget.isDADEnabled
		},
		set: (widget: BaseWidget, value: any) => {
			widget.isDADEnabled = !value
		},
	},

}

function getInputByStyleName(styleName: string): string {
	if (styleName === StyleName.WidgetType
		|| styleName === StyleName.JustifyContent
		|| styleName === StyleName.FlexDirection
		|| styleName === StyleName.AlignItems) {
		return 'select'
	}
	return 'input'
}

function getMultiProxy(styleName: string, widgets: BaseWidget[]): MultiProxy {
	return {
		get: () => {
			let commonVal: any = styles[styleName].get(widgets[0])
			for (let i = 1; i < widgets.length; i++) {
				const styleVal = styles[styleName].get(widgets[i])
				if (commonVal === styleVal) {
					commonVal = styleVal
				} else {
					return undefined
				}
			}
			return commonVal
		},
		set: (value: any) => {
			widgets.forEach(w => {
				styles[styleName].set(w, value)
			})
		},
	}
}

export default class SidebarController {

	private styleProxies = new Map<string, MultiProxy>()
	private selectionOptionsContainer: HTMLElement

	constructor(private container: HTMLElement) {
		this.selectionOptionsContainer = container.querySelector('.selected-widgets-options') as HTMLElement
		Object.keys(styles).forEach(s => this.attachEvent(s))
	}

	private attachEvent(styleName: string) {
		this.getOptionElement(styleName).addEventListener('change', (e) => {
			const styleProxy = this.styleProxies.get(styleName)
			if (styleProxy) {
				let val: any
				if (styleName === StyleName.DisableDAD) {
					val = (e.target as any).checked
				} else {
					val = (e.target as any).value
				}
				styleProxy.set(val)
			}
			this.update()
		})
	}

	private getOptionElement(styleName: string): HTMLElement {
		return this.container.querySelector('.' + styleName) as HTMLElement
	}

	update() {
		const hasContainer = this.styleProxies.get(StyleName.WidgetType)!.get() !== 'not'
		const hide = hasContainer ? 'none' : 'block'
		const show = hasContainer ? 'block' : 'none'
		this.getOptionElement(StyleName.Text).style.display = hide
		this.getOptionElement(StyleName.TextSize).style.display = hide
		this.getOptionElement(StyleName.TextColor).style.display = hide
		this.getOptionElement(StyleName.JustifyContent).style.display = show
		this.getOptionElement(StyleName.FlexDirection).style.display = show
		this.getOptionElement(StyleName.AlignItems).style.display = show
		this.getOptionElement(StyleName.DisableDAD).style.display = show

		this.styleProxies.forEach((proxy, styleName) => {
			const styleValue = proxy.get()
			const input = this.getStyleInput(styleName)
			if (styleName === StyleName.DisableDAD) {
				input.checked = styleValue === undefined ? false : styleValue
			} else {
				input.value = styleValue === undefined ? '' : styleValue
			}
		})
	}

	private getStyleInput(styleName: string): HTMLInputElement {
		return this.container.querySelector(`.${styleName} ${getInputByStyleName(styleName)}`) as HTMLInputElement
	}

	onSelectionUpdated(widgets: BaseWidget[]) {
		if (widgets.length > 0) {
			Object.keys(styles).forEach(styleName => {
				this.styleProxies.set(styleName, getMultiProxy(styleName, widgets))
			})
			this.update()
			this.selectionOptionsContainer.style.display = 'block'
		}
	}

	onSelectionClear() {
		this.selectionOptionsContainer.style.display = 'none'
		this.styleProxies.clear()
	}
}
