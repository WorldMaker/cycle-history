import * as rx from 'rx'

export interface HistoryInfo {
	state: any
	title?: string
	url?: string
}

export type HistoryRequest = rx.Observable<HistoryInfo>
export type HistoryResponse = rx.Observable<any>

type StateObservable = rx.Observable<{ state: any }>

export function historyDriver(request$: HistoryRequest): HistoryResponse {
	let outgoing$ = request$
		.distinctUntilChanged() // avoid spamming the browser/infinite cycling
		.map(info => info || { state: null }) // basic data cleanliness
		.share()
	
	// Kick off our side effect to the browser	
	outgoing$.subscribe(info => window.history.pushState(info.state, info.title, info.url))
	
	let popState$ = rx.Observable.fromEventPattern<PopStateEvent>((h: any) => window.addEventListener('onpopstate', h),
		(h: any) => window.removeEventListener('onpopstate', h))
		.map(ev => ev || { state: null }) // basic data cleanliness
	
	return rx.Observable.merge(<StateObservable>popState$, <StateObservable>outgoing$)
		.map(item => item.state)
		.startWith(window.history.state)
}