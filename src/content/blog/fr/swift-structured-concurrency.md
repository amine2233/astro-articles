---
title: "La concurrence structurée en Swift 6 : guide pratique"
description: "Utiliser async let, les task groups et les actors sans se battre avec le compilateur."
date: 2026-09-20
tags: [swift, concurrency, ios]
---

Swift 6 transforme la sécurité contre les data races en **garantie à la compilation**. C'est une excellente nouvelle pour les apps en production, mais cela oblige à être explicite sur l'endroit où le code s'exécute.

## `async let` pour un nombre fixe de tâches

Quand on connaît à l'avance le nombre d'appels indépendants, `async let` est l'outil le plus simple :

```swift
func loadDashboard() async throws -> Dashboard {
    async let user = api.fetchUser()
    async let orders = api.fetchOrders(limit: 20)
    async let stats = api.fetchStats()

    return try await Dashboard(user: user, orders: orders, stats: stats)
}
```

Les trois requêtes démarrent immédiatement et s'exécutent en parallèle. Si l'une échoue, les autres sont annulées automatiquement.

## Les task groups pour un nombre dynamique de tâches

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

## Les actors pour l'état mutable partagé

> Règle simple : si deux tâches peuvent toucher la même valeur mutable, placez-la derrière un actor.

```swift
actor ImageCache {
    private var storage: [URL: UIImage] = [:]

    func image(for url: URL) -> UIImage? { storage[url] }
    func insert(_ image: UIImage, for url: URL) { storage[url] = image }
}
```

## En résumé

| Besoin | Outil |
|---|---|
| Nombre d'appels fixe et connu | `async let` |
| Nombre d'appels dynamique | `TaskGroup` |
| État mutable partagé | `actor` |
| Mises à jour de l'UI | `@MainActor` |
