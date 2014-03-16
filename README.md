# Hircine

A tiny selector engine for awesome browsers.

## The name

> Hircine is the Daedric Prince whose sphere is the Hunt, the Sport of Daedra, the Great Game, the Chase, and is known as the Huntsman and the Father of Manbeasts.

&mdash; unknown author, [The Book of Daedra](http://uesp.net/wiki/Lore:The_Book_of_Daedra)

## Installation

Hircine is available (as `hircine`) via [Bower](http://bower.io), [Jam](http://jamjs.org), and [npm](http://npmjs.org). Hircine also works with [Ender](http://ender.var.require.io).

## Basic usage

If you've ever used [Sizzle](http://sizzlejs.com) (jQuery's selector engine) then you should feel right at home with Hircine.

```js
elements = hircine("tag#id.class");
# elements is now a clean array of nodes matching your query
```

Hircine is however less capable – it's just for fun and learning – and won't be able to handle super-crazy queries. Please check the [documentation for `querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document.querySelectorAll) if you want to know more.

## Todo

- Tests.
- JSDoc.

## License

MIT Licensed; see the [LICENSE file](LICENSE) for more info.