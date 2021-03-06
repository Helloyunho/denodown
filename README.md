# Denodown

> Generates Markdown document from Deno file(probably mod.ts).

## How did you make it?

Basically I read some important components' source from [deno's official doc website](https://github.com/denoland/doc_website/) and hand-copied the source while changing some things for markdown.

## Install:

```
deno install --allow-read --allow-write --allow-run https://deno.land/x/denodown/index.ts
```

## Usage:

```
denodown <filename> <options>

Options:

  -o, --out         <out>  - Sets the output directory.       (Default: "out/")
  -v, --vuepress           - Sets vuepress mode to enable.    (Default: false)

```

## Supported Site Generators

- None (Pure markdown)
- Vuepress (Only with default theme)

More site generators are going to be supported.
