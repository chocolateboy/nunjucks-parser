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

nunjucks-parser - extract dependencies and other metadata from nunjucks templates

# INSTALLATION

    $ npm install nunjucks nunjucks-parser

# SYNOPSIS

```javascript
import nunjucks      from 'nunjucks'
import { parseFile } from 'nunjucks-parser'

const env = nunjucks.configure('src/html')
const data = { foo: 42 }
const { content, template, dependencies } = await parseFile(env, 'index.html.njk', { data })

console.log(dependencies)
```

# DESCRIPTION

This module exports a pair of [nunjucks](https://mozilla.github.io/nunjucks/) helper functions,
[`parseFile`](#parsefile) and [`parseString`](#parsestring), which function like enhanced versions of the built-in [`Environment#render`](https://mozilla.github.io/nunjucks/api.html#render)
and [`Environment#renderString`](https://mozilla.github.io/nunjucks/api.html#renderstring) methods.

In addition to always returning promises — which, amongst other things, sidesteps a bug in the synchronous
API which [silently swallows errors](https://github.com/mozilla/nunjucks/issues/678) — these methods
also return more data than the `render` methods i.e.:

- content (string): the rendered template string
- template (Template): the [Template](https://mozilla.github.io/nunjucks/api.html#template) instance used to render the template
  source
- dependencies (Array&lt;Object&gt;): an array of objects representing the direct and
  transitive dependencies reachable from the parent template

## Why?

Bundlers such as [parcel](https://parceljs.org/) provide the ability to track the direct and transitive dependencies of
assets so that changes to those dependencies trigger updates in their dependents. nunjucks doesn't provide a built-in
way to do this, so this functionality must currently be done in a non-optimal way e.g. by monitoring every file in
a directory that has an `.njk` extension.

This package provides an easy way to retrieve a template's dependencies. In addition, it exposes some other metadata
that is not exposed by the built-in `render` and `renderString` methods.

## Why Not?

This module doesn't provide direct access to a template's AST.
Instead, it focuses on exposing the kind of metadata an AST might be queried for
(although, in the particular case of dependencies, that data [cannot be extracted from the AST](https://github.com/devmattrick/parcel-plugin-nunjucks/issues/1#issuecomment-423495829)).
In the event that you need the actual AST, use nunjucks' parser class.

```javascript
import { parser, nodes } from 'nunjucks'

const src = 'Hello, {{ name }}'
const ast = parser.parse(src)

nodes.printNodes(ast)
```

# EXPORTS

## parseFile

**Signature**: parseFile(env: [Environment](https://mozilla.github.io/nunjucks/api.html#environment), templatePath: string, options: Object?) -> Promise&lt;Object&gt;

```javascript
const { content, template, dependencies } = await parseFile(env, src, { data })
```

An enhanced version of [renderFile](#renderFile) which augments its result with an array of objects representing the template's dependencies.
Each dependency object contains the following fields:

- name (string): the template's name as it appears in the source (may have been resolved to an absolute path/URI if it's relative)
- parent (string?): null if the dependency has no parent file; otherwise the resolved path of its parent file
- path (string): the resolved path of this dependency (child template)

The following options are supported:

- data (Object): an optional value to expose as the template's "context"

## parseString

**Signature**: renderString(env: [Environment](https://mozilla.github.io/nunjucks/api.html#environment), src: string, options: Object) -> Promise&lt;Object&gt;

```javascript
const { content, template, dependencies } = await parseFile(env, src, { data, path })
```

An enhanced version of [renderFile](#renderfile) which augments its result with an array of objects representing the template's dependencies.
Each dependency object contains the following fields:

- name (string): the name for a template as it appears in the source (may have been resolved to an absolute path/URI if it's relative)
- parent (string?): null if the dependency has no parent file; otherwise the resolved path of its parent file
- path (string): the resolved path of this dependency (child template)

The following options are supported:

- data (Object): an optional value to expose as the template's "context"
- path (string?): an optional path/URL for the template: used to resolve file-relative paths and for error reporting

## renderFile

**Signature**: renderString(env: [Environment](https://mozilla.github.io/nunjucks/api.html#environment), src: string, options: Object) -> Promise&lt;Object&gt;

```javascript
const { content, template } = await renderString(env, src, { data })
```

A promisified variant of [`Environment#render`](https://mozilla.github.io/nunjucks/api.html#render) which yields the resulting [Template](https://mozilla.github.io/nunjucks/api.html#template) object (`template`)
as well as its rendered string (`content`).

The following options are supported:

- data (Object): an optional value to expose as the template's "context"

## renderString

**Signature**: renderString(env: [Environment](https://mozilla.github.io/nunjucks/api.html#environment), src: string, options: Object) -> Promise&lt;Object&gt;

```javascript
const { content, template } = await renderString(env, src, { data })
```

A promisified variant of [`Environment#renderString`](https://mozilla.github.io/nunjucks/api.html#renderstring) which yields the resulting [Template](https://mozilla.github.io/nunjucks/api.html#template) object (`template`)
as well as its rendered string (`content`).

The following options are supported:

- data (Object): an optional value to expose as the template's "context"

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

# VERSION

0.0.1

# AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

# COPYRIGHT AND LICENSE

Copyright © 2018 by chocolateboy.

This is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](http://www.opensource.org/licenses/artistic-license-2.0.php).
