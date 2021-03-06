# nunjucks-parser

[![Build Status](https://github.com/chocolateboy/nunjucks-parser/workflows/test/badge.svg)](https://github.com/chocolateboy/nunjucks-parser/actions?query=workflow%3Atest)
[![NPM Version](https://img.shields.io/npm/v/nunjucks-parser.svg)](https://www.npmjs.org/package/nunjucks-parser)

<!-- TOC -->

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
- [COMPATIBILITY](#compatibility)
- [SEE ALSO](#see-also)
- [VERSION](#version)
- [AUTHOR](#author)
- [COPYRIGHT AND LICENSE](#copyright-and-license)

<!-- TOC END -->

# NAME

nunjucks-parser - extract dependencies from nunjucks templates

# INSTALLATION

    $ npm install nunjucks # peer dependency
    $ npm install nunjucks-parser

# SYNOPSIS

<!-- TOC:ignore -->
### layout.html

<details>

```jinja
{% include "components/header.html" %}
<h1>Hello, world!</h1>
{% include "components/footer.html" %}
```

<!-- TOC:ignore -->
### header.html

```xml
<h1>Header</h1>
```

<!-- TOC:ignore -->
### footer.html

```jinja
<h1>Footer</h1>
{% include "./copyright.txt" %}
```

<!-- TOC:ignore -->
### copyright.txt

```
Copyright ⓒ example.com 2018
```

</details>

<!-- TOC:ignore -->
### example.js

```javascript
import nunjucks      from 'nunjucks'
import { parseFile } from 'nunjucks-parser'

const env = nunjucks.configure('./example')
const { content, dependencies } = await parseFile(env, 'layout.html')
```

<!-- TOC:ignore -->
### content

```html
<h1>Header</h1>
<h1>Hello, world!</h1>
<h1>Footer</h1>
Copyright ⓒ example.com 2018
```

<!-- TOC:ignore -->
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

This module exports [nunjucks](https://mozilla.github.io/nunjucks/) helper
functions which simplify the use of the built-in
[`Environment#render`](https://mozilla.github.io/nunjucks/api.html#render) and
[`Environment#renderString`](https://mozilla.github.io/nunjucks/api.html#renderstring)
functions and enhance them to return the template's direct and transitive
dependencies as well as its rendered content.

## Why?

Bundlers such as [Parcel](https://parceljs.org/) provide the ability to track
asset dependencies so that changes to those dependencies trigger updates in
their dependents. However, nunjucks doesn't provide a built-in way to do this.

This module provides a simple and efficient way to query this information
without resorting to inefficient workarounds such as monitoring every file in a
directory that has an `.njk` extension. It also provides promisified versions
of the built-in `render` functions which fix nits and bypass
[bugs](https://github.com/mozilla/nunjucks/issues/678) in the standard API.

## Why Not?

This module doesn't provide direct access to a template's AST. Instead, it
focuses on exposing the kind of metadata an AST might be queried for (although,
in the case of dependencies, that data
[cannot be extracted from the AST](https://github.com/chocolateboy/parcel-plugin-nunjucks/issues/1#issuecomment-423495829)).
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

- **Signature**: parseFile (env: [Environment][], templatePath: string, options?: Options) ⇒ Promise&lt;[Result](#result)&gt;

```javascript
const { content, dependencies } = await parseFile(env, templatePath, { data })
```

An enhanced version of [`renderFile`](#renderfile) which returns the template's
dependencies as well as its rendered content.

The following options are supported:

- data (object): an optional value to expose as the template's "context"

Dependencies are returned in the order in which they're traversed (depth
first), and all descendants are returned, including those that are loaded
dynamically.

If deduplicated dependencies are needed, they can be distinguished by the
`path` property, e.g.:

```javascript
import { uniqBy } from 'lodash'

const deduped = uniqBy(dependencies, 'path')
```

## parseString

- **Signature**: parseString (env: [Environment][], src: string, options?: Options) ⇒ Promise&lt;[Result](#result)&gt;

```javascript
const { content, dependencies } = await parseString(env, src, { data, path })
```

An enhanced version of [`renderString`](#renderstring) which returns the
template's dependencies as well as its rendered content.

In addition to the options supported by [`parseFile`](#parsefile),
`parseString` also supports the following options:

- path (string): the optional absolute path/URI of the template: used to resolve relative paths and for error reporting

## renderFile

- **Signature**: renderFile (env: [Environment][], templatePath: string, options?: Options) ⇒ Promise&lt;string&gt;

A version of
[`Environment#render`](https://mozilla.github.io/nunjucks/api.html#render)
which is (always) async and which is passed its context via an options object.

The following options are supported:

- data (object): an optional value to expose as the template's "context"

## renderString

- **Signature**: renderString (env: [Environment][], src: string, options?: Options) ⇒ Promise&lt;string&gt;

A version of
[`Environment#renderString`](https://mozilla.github.io/nunjucks/api.html#renderstring)
which is (always) async and which is passed its context and path via an options
object.

In addition to the options supported by [`renderFile`](#renderfile),
`renderString` also supports the following options:

- path (string): the optional absolute path/URI of the template: used to resolve relative paths and for error reporting

# DEVELOPMENT

<details>

<!-- TOC:ignore -->
## NPM Scripts

The following NPM scripts are available:

- build - compile the library for testing and save to the target directory
- build:doc - generate the README's TOC (table of contents)
- build:release - compile the library for release and save to the target directory
- clean - remove the target directory and its contents
- rebuild - clean the target directory and recompile the library
- test - recompile the library and run the test suite
- test:run - run the test suite

</details>

# COMPATIBILITY

This package is tested and supported on environments which meet the following
requirements:

- ES6 Proxy support, e.g.
  - [Maintained Node.js versions](https://github.com/nodejs/Release#readme)
  - browsers > IE11

# SEE ALSO

* [nunjucks](https://www.npmjs.com/package/nunjucks)
* [parcel-plugin-nunjucks](https://www.npmjs.com/package/@chocolateboy/parcel-plugin-nunjucks)

# VERSION

1.1.0

# AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

# COPYRIGHT AND LICENSE

Copyright © 2018-2020 by chocolateboy.

This is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](https://www.opensource.org/licenses/artistic-license-2.0.php).

[Environment]: https://mozilla.github.io/nunjucks/api.html#environment
