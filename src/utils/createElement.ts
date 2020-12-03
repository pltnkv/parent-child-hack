export default function createElement(styles: Partial<CSSStyleDeclaration>): HTMLDivElement {
	const div = document.createElement('div')
	for (let p in styles) {
		div.style[p] = styles[p] as any
	}
	return div
}
