import BaseWidget from 'canvas/widgets/BaseWidget'

export default function getRootWidgets(widgets: BaseWidget[]): BaseWidget[] {
	const containers = widgets.filter(w => w.isContainer)
	return widgets.filter(widget => {
		return !containers.some(cont => cont.contains(widget))
	})
}
