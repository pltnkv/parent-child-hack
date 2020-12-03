import IOffset from 'types/IOffset'
import IBounds from 'types/IBounds'
import {offsetToBounds} from 'utils/mathUtils'

export default function getUnionBounds(bounds: IBounds[]): IBounds {
	const res: IOffset = {left: Number.MAX_VALUE, top: Number.MAX_VALUE, bottom: Number.MIN_VALUE, right: Number.MIN_VALUE}
	bounds.forEach(r => {
		if (r.left < res.left) {
			res.left = r.left
		}
		if (r.top < res.top) {
			res.top = r.top
		}
		if (r.right > res.right) {
			res.right = r.right
		}
		if (r.bottom > res.bottom) {
			res.bottom = r.bottom
		}
	})
	return offsetToBounds(res)
}
