---
title: "Building a CLI tool in Swift with ArgumentParser"
description: "From swift package init to a distributable binary in 15 minutes."
date: 2026-09-01
tags: [swift, cli, tooling]
---

> This article exists only in English. Notice that no "Lire en français" link appears, and the FR switcher falls back to the French home page.

```bash
swift package init --type tool --name devnotes
```

```swift
import ArgumentParser

@main
struct DevNotes: ParsableCommand {
    @Argument(help: "Title of the new post")
    var title: String

    @Option(name: .shortAndLong, help: "Language: en or fr")
    var lang: String = "en"

    func run() throws {
        let slug = title.lowercased().split(separator: " ").joined(separator: "-")
        print("Creating src/content/blog/\(lang)/\(slug).md")
    }
}
```

Build a release binary:

```bash
swift build -c release
cp .build/release/devnotes /usr/local/bin/
```
