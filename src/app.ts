///re
import CanvasController from 'canvas/CanvasController'
import registerEvents from 'canvas/registerEvents'
import EventsHandler from 'canvas/EventsHandler'
import SidebarController from 'SidebarController'
import {kanban} from 'data'

//render to html
const canvasContainer = document.querySelector('.canvas-container') as HTMLDivElement
const sidebarContainer = document.querySelector('.sidebar-container') as HTMLDivElement

const sidebarController = new SidebarController(sidebarContainer)
const canvasController = new CanvasController(canvasContainer, sidebarController)
const eventHandler = new EventsHandler(canvasController)
registerEvents(eventHandler, canvasController)

let initData = localStorage.getItem('canvas')

if (!initData) {
	initData = kanban
}

if (initData) {
	const newWidgets = canvasController.createWidgetFromHTML(initData)
	newWidgets.forEach(nw => {
		canvasController.appendToCanvas(nw)
	})
} else {

	canvasController.createShapeWidget({x: 10, y: 10, color: '#FF0000'})

	const cnt = canvasController.createShapeWidget({x: 100, y: 100, width: 300, height: 200, color: '#00FF00', container: true})
	canvasController.createShapeWidget({x: 10, y: 10, color: '#666666'}, cnt)
	canvasController.createShapeWidget({x: 10, y: 10, color: '#666666'}, cnt)

}

///////////////////////////////////////////////////////////////////////////
//UI
///////////////////////////////////////////////////////////////////////////

document.querySelector('.add-shape')!.addEventListener('click', () => {
	canvasController.createShapeWidget({x: 10, y: 10, color: '#FF0000'})
})

// document.querySelector('.add-shape-100')!.addEventListener('click', () => {
// 	for (let i = 0; i < 100; i++) {
// 		canvasController.createShapeWidget({x: 10, y: 10 + i, color: '#FF0000'})
// 	}
// })

document.querySelector('.add-container')!.addEventListener('click', () => {
	canvasController.createShapeWidget({x: 100, y: 100, width: 300, height: 200, color: '#00FF00', container: true})
})

document.querySelector('.clear-storage')!.addEventListener('click', () => {
	localStorage.removeItem('canvas')
})

