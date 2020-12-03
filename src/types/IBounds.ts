import IRect from 'types/IRect'

export default interface IBounds extends IRect {
	readonly top: number,
	readonly left: number,
	readonly bottom: number,
	readonly right: number
}
