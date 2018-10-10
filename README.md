# nunjucks-parser

[![Build Status](https://secure.travis-ci.org/chocolateboy/nunjucks-parser.svg)](http://travis-ci.org/chocolateboy/nunjucks-parser)
[![NPM Version](http://img.shields.io/npm/v/nunjucks-parser.svg)](https://www.npmjs.org/package/nunjucks-parser)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [NAME](#name)
- [INSTALLATION](#installation)
- [SYNOPSIS](#synopsis)
- [DESCRIPTION](#description)
  - [Why?](#why)
  - [Why Not?](#why-not)
- [TYPES](#types)
  - [Dependency](#dependency)
  - [Result](#result)
- [EXPORTS](#exports)
  - [parseFile](#parsefile)
  - [parseString](#parsestring)
  - [renderFile](#renderfile)
  - [renderString](#renderstring)
- [DEVELOPMENT](#development)
  - [NPM Scripts](#npm-scripts)
- [COMPATIBILITY](#compatibility)
- [SEE ALSO](#see-also)
- [VERSION](#version)
- [AUTHOR](#author)
- [COPYRIGHT AND LICENSE](#copyright-and-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# NAME

nunjucks-parser - extract dependencies from nunjucks templates

# INSTALLATION

    $ npm install nunjucks # peer dependency
    $ npm install nunjucks-parser

# SYNOPSIS

### layout.html

<details>

```jinja
{% include "components/header.html" %}
<h1>Hello, world!</h1>
{% include "components/footer.html" %}
```

### header.html

```xml
<h1>Header</h1>
```

### footer.html

```jinja
<h1>Footer</h1>
{% include "./copyright.txt" %}
```

### copyright.txt

```
Copyright ⓒ example.com 2018
```

</details>

### example.js

```javascript
import nunjucks      from 'nunjucks'
import { parseFile } from 'nunjucks-parser'

const env = nunjucks.configure('./example')
const { content, dependencies } = await parseFile(env, 'layout.html')
```

### content

```html
<h1>Header</h1>
<h1>Hello, world!</h1>
<h1>Footer</h1>
Copyright ⓒ example.com 2018
```

### dependencies

```javascript
[
    {
        name: "layout.html",
        path: "/home/user/example/layout.html",
        parent: null
    },
    {
        name: "components/header.html",
        path: "/home/user/example/components/header.html",
        parent: "/home/user/example/layout.html"
    },
    {
        name: "components/footer.html",
        path: "/home/user/example/components/footer.html",
        parent: "/home/user/example/layout.html"
    },
    {
        name: "./copyright.txt",
        path: "/home/user/example/components/copyright.txt",
        parent: "/home/user/example/components/footer.html"
    }
]
```

# DESCRIPTION

This module exports [nunjucks](https://mozilla.github.io/nunjucks/) helper functions which simplify
the use of the built-in [`Environment#render`](https://mozilla.github.io/nunjucks/api.html#render)
and [`Environment#renderString`](https://mozilla.github.io/nunjucks/api.html#renderstring) functions
and enhance them to return the template's direct and transitive dependencies as well as its rendered content.

## Why?

Bundlers such as [Parcel](https://parceljs.org/) provide the ability to track asset dependencies
so that changes to those dependencies trigger updates in their dependents. However, nunjucks doesn't
provide a built-in way to do this.

This module provides a simple and efficient way to query this information without resorting to inefficient
workarounds such as monitoring every file in a directory that has an `.njk` extension. It also provides
promisified versions of the built-in `render` functions which fix nits and bypass
[bugs](https://github.com/mozilla/nunjucks/issues/678) in the standard API.

## Why Not?

This module doesn't provide direct access to a template's AST. Instead, it focuses on exposing the kind of
metadata an AST might be queried for (although, in the case of dependencies, that data
[cannot be extracted from the AST](https://github.com/devmattrick/parcel-plugin-nunjucks/issues/1#issuecomment-423495829)).
In the event that you need the actual AST, use nunjucks' parser class.

```javascript
import { parser, nodes } from 'nunjucks'

const src = 'Hello, {{ name }}!'
const ast = parser.parse(src)

nodes.printNodes(ast)
```

# TYPES

The following types are referenced in the [exports](#exports) below.

## Dependency

```typescript
type Dependency = {
    name: string;
    path: string;
    parent: string | null;
}
```

Each dependency object contains the following fields:

- name: the dependency's name as it appears in the source
- path: the dependency's absolute path or URI
- parent: the resolved path of the dependency's parent file or URI, or null if it doesn't have one

## Result

```typescript
type Result = {
    content: string;
    dependencies: Array<Dependency>;
}
```

# EXPORTS

## parseFile

**Signature**: parseFile(env: [Environment](https://mozilla.github.io/nunjucks/api.html#environment), templatePath: string, options?: Object) → Promise&lt;[Result](#result)&gt;<br/>

```javascript
const { content, dependencies } = await parseFile(env, templatePath, { data })
```

An enhanced version of [`renderFile`](#renderfile) which returns the template's dependencies as well as its rendered content.

The following options are supported:

- data (Object): an optional value to expose as the template's "context"

Dependencies are returned in the order in which they're traversed (depth first), and all descendants
are returned, including those that are loaded dynamically.

If deduplicated dependencies are needed, they can be distinguished by the `path` property e.g.:

```javascript
const deduped = _.uniqBy(dependencies, 'path')
```

## parseString

**Signature**: parseString(env: [Environment](https://mozilla.github.io/nunjucks/api.html#environment), src: string, options?: Object) → Promise&lt;[Result](#result)&gt;<br />

```javascript
const { content, dependencies } = await parseString(env, src, { data, path })
```

An enhanced version of [`renderString`](#renderstring) which returns the template's dependencies as well as its rendered content.

In addition to the options supported by [`parseFile`](#parsefile), `parseString` also supports the following options:

- path (string): the optional absolute path/URI of the template: used to resolve relative paths and for error reporting

## renderFile

**Signature**: renderFile(env: [Environment](https://mozilla.github.io/nunjucks/api.html#environment), src: templatePath, options?: Object) → Promise&lt;string&gt;

A version of [`Environment#render`](https://mozilla.github.io/nunjucks/api.html#render) which is (always)
async and which is passed its context via an options object.

The following options are supported:

- data (Object): an optional value to expose as the template's "context"

## renderString

**Signature**: renderString(env: [Environment](https://mozilla.github.io/nunjucks/api.html#environment), src: string, options?: Object) → Promise&lt;string&gt;

A version of [`Environment#renderString`](https://mozilla.github.io/nunjucks/api.html#renderstring) which is (always)
async and which is passed its context and path via an options object.

In addition to the options supported by [`renderFile`](#renderfile), `renderString` also supports the following options:

- path (string): the optional absolute path/URI of the template: used to resolve relative paths and for error reporting

# DEVELOPMENT

<details>

## NPM Scripts

The following NPM scripts are available:

- build - compile a production build of the library and save it to the target directory
- build:dev - compile a development build of the library and save it to the target directory
- clean - remove the target directory and its contents
- test - compile the library and run the test suite

</details>

# COMPATIBILITY

This package is tested and supported on environments which meet the following requirements:

- ES6 Proxy support e.g.
  - Node >= v6.0
  - browsers > IE11

# SEE ALSO

* [nunjucks](https://www.npmjs.com/package/nunjucks)
* [parcel-plugin-nunjucks](https://www.npmjs.com/package/@chocolateboy/parcel-plugin-nunjucks)

# VERSION

1.0.1

# AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

# COPYRIGHT AND LICENSE

Copyright © 2018 by chocolateboy.

This is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](http://www.opensource.org/licenses/artistic-license-2.0.php).
