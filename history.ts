import * as rx from 'rx'

export interface HistoryInfo {
	state: any
	title?: string
	url?: string
	pop?: boolean
}

export type HistoryRequest = rx.Observable<HistoryInfo>
export type HistoryResponse = rx.Observable<any>

export function historyDriver(request$: HistoryRequest): HistoryResponse {
	let popState$ = rx.Observable.fromEventPattern<PopStateEvent>((h: any) => window.addEventListener('popstate', h),
		(h: any) => window.removeEventListener('popstate', h))
		.map(ev => {
			let event: any = ev || { state: null }
			event.pop = true
			return event
		})
		
	let history$ = request$
		.map(info => info || { state: null }) // basic data cleanliness
		.merge(popState$)
		.distinctUntilChanged() // avoid spamming the browser/infinite cycling
		.share()
	
	let outgoing$ = history$.filter(info => !info.pop)
	
	// Kick off our side effect to the browser	
	outgoing$.subscribe(info => window.history.pushState(info.state, info.title, info.url))
	
	return history$
		.map(item => item.state)
		.startWith(window.history.state)
}