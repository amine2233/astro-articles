---
title: "Structured concurrency in Swift 6: a practical guide"
description: "How to use async let, task groups and actors without fighting the compiler."
date: 2026-09-20
tags: [swift, concurrency, ios]
---

Swift 6 turns data-race safety into a **compile-time guarantee**. That is great news for production apps, but it forces you to be explicit about where your code runs.

## `async let` for a fixed number of tasks

When you know upfront how many independent calls you need, `async let` is the simplest tool:

```swift
func loadDashboard() async throws -> Dashboard {
    async let user = api.fetchUser()
    async let orders = api.fetchOrders(limit: 20)
    async let stats = api.fetchStats()

    return try await Dashboard(user: user, orders: orders, stats: stats)
}
```

All three requests start immediately and run in parallel. If one throws, the others are cancelled automatically.

## Task groups for a dynamic number of tasks

```swift
func thumbnails(for ids: [Photo.ID]) async throws -> [Photo.ID: UIImage] {
    try await withThrowingTaskGroup(of: (Photo.ID, UIImage).self) { group in
        for id in ids {
            group.addTask { (id, try await loader.thumbnail(id)) }
        }
        return try await group.reduce(into: [:]) { $0[$1.0] = $1.1 }
    }
}
```

## Actors for shared mutable state

> Rule of thumb: if two tasks can touch the same mutable value, put it behind an actor.

```swift
actor ImageCache {
    private var storage: [URL: UIImage] = [:]

    func image(for url: URL) -> UIImage? { storage[url] }
    func insert(_ image: UIImage, for url: URL) { storage[url] = image }
}
```

## Summary

| Need | Tool |
|---|---|
| Fixed, known number of calls | `async let` |
| Dynamic number of calls | `TaskGroup` |
| Shared mutable state | `actor` |
| UI updates | `@MainActor` |
