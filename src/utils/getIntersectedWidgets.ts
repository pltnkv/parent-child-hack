import BaseWidget from 'canvas/widgets/BaseWidget'
import {isBoundsIntersect} from 'utils/mathUtils'
import IBounds from 'types/IBounds'

export default function getIntersectedWidgets(absBounds: IBounds, widgets: BaseWidget[]): BaseWidget[] {
	return widgets.filter(w => {
		return isBoundsIntersect(w.absoluteBounds, absBounds)
	})
}

