import * as rx from 'rx';
export function historyDriver(request$) {
    let popState$ = rx.Observable.fromEventPattern((h) => window.addEventListener('popstate', h), (h) => window.removeEventListener('popstate', h))
        .map(ev => Object.assign({ pop: true }, ev || { state: null })); // basic data cleanliness
    let history$ = request$
        .map(info => info || { state: null }) // basic data cleanliness
        .merge(popState$)
        .distinctUntilChanged() // avoid spamming the browser/infinite cycling
        .share();
    let outgoing$ = history$.filter(info => !info.pop);
    // Kick off our side effect to the browser	
    outgoing$.subscribe(info => window.history.pushState(info.state, info.title, info.url));
    return history$
        .map(item => item.state)
        .startWith(window.history.state);
}
//# sourceMappingURL=history.js.map