import IRect from 'types/IRect'
import IBounds from 'types/IBounds'
import IOffset from 'types/IOffset'
import IPoint from 'types/IPoint'

export function rectToBounds(rect: IRect): IBounds {
	return {
		...rect,
		top: rect.y,
		left: rect.x,
		bottom: rect.y + rect.height,
		right: rect.x + rect.width,
	}
}

export function offsetToBounds(offset: IOffset): IBounds {
	return {
		...offset,
		x: offset.left,
		y: offset.top,
		height: offset.bottom - offset.top,
		width: offset.right - offset.left,
	}
}

export function isBoundsIntersect(r1: IBounds, r2: IBounds): boolean {
	return !(r2.left > r1.right ||
		r2.right < r1.left ||
		r2.top > r1.bottom ||
		r2.bottom < r1.top)
}

export function isPointIntersectsBounds(point: IPoint, bounds: IBounds): boolean {
	return point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom
}

