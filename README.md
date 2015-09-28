# cycle-history
HTML5 Browser History driver for [Cycle](http://cycle.js.org)

Manipulates and responds to browser history changes using the modern `window.history`
API. This is a useful prerequisite for single-page applications.

[MDN documentation on window.history](https://developer.mozilla.org/en-US/docs/Web/API/Window/history)

## Requests

Request history state changes using an observable of objects in the form:

```js
{
	state: {},
	title: "Example",
	url: "/example"
}
```

Where `state` may be any serializable JS object. MDN suggests keeping it small as
it will be persisted to disk in history files. `title` and `url` are both optional
strings used for browser history displays. `url` will update the browser's address
bar but will not force a browser navigation. Any URL on the site may be used, not
just hash/hashbang fragments, and this can be useful, in conjunction with appropriate
server-side code, for things like SEO and deep-linking.

## Responses

The response from the history driver is an observable of `state` objects, including
the ones from history driver requests as well as any that come back due to browser
navigation (such as a user pressing the back button).
