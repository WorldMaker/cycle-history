var rx = require('rx');
function historyDriver(request$) {
    var outgoing$ = request$
        .distinctUntilChanged() // avoid spamming the browser/infinite cycling
        .map(function (info) { return info || { state: null }; }) // basic data cleanliness
        .share();
    // Kick off our side effect to the browser	
    outgoing$.subscribe(function (info) { return window.history.pushState(info.state, info.title, info.url); });
    var popState$ = rx.Observable.fromEventPattern(function (h) { return window.addEventListener('popstate', h); }, function (h) { return window.removeEventListener('popstate', h); })
        .map(function (ev) { return ev || { state: null }; }); // basic data cleanliness
    return rx.Observable.merge(popState$, outgoing$)
        .map(function (item) { return item.state; })
        .startWith(window.history.state);
}
exports.historyDriver = historyDriver;
//# sourceMappingURL=history.js.map