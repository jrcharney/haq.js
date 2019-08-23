# haqs.js
Concise Functional Javascript Library

It started as something simple:

```js
var qs = parent => (query,all) => (typeof(parent) === "string") ? qs(qs()(parent))(query,all) : (parent||document)[`querySelector${(all||false)?"All":""}`](query);
```

It has now grown to a series of functions in its own library!

**haqs.js** (pronounced "hacks.js") is a series of functions frequently used in [my Codepen projects](https://codepen.io/jrcharney/) and hopefully yours to.

haqs aims to be light, unlike jQuery. Every object is either a fundamental Javascript type or a DOM Node, NodeList, Element, or other standard element.

There's still [plenty of things](TODO.md) to take care of.

> *Drink all the booze, haqs.js all the things!* ;-)
