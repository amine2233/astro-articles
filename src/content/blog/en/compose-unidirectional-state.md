---
title: "Unidirectional state in Jetpack Compose with a tiny Redux store"
description: "A 40-line store that keeps your Compose screens predictable and testable."
date: 2026-09-12
tags: [kotlin, android, compose, architecture]
---

You don't need a framework to get Redux-style predictability on Android. A `StateFlow` and a reducer are enough.

## The store

```kotlin
class Store<S, A>(
    initial: S,
    private val reducer: (S, A) -> S,
    private val scope: CoroutineScope,
) {
    private val _state = MutableStateFlow(initial)
    val state: StateFlow<S> = _state.asStateFlow()

    fun dispatch(action: A) {
        _state.update { reducer(it, action) }
    }
}
```

## Using it in a screen

```kotlin
@Composable
fun CartScreen(store: Store<CartState, CartAction>) {
    val state by store.state.collectAsStateWithLifecycle()
    LazyColumn {
        items(state.items, key = { it.id }) { item ->
            CartRow(item, onRemove = { store.dispatch(CartAction.Remove(item.id)) })
        }
    }
}
```

## Why it works well in practice

- The reducer is a **pure function**, so it is trivial to unit test.
- Every UI change goes through `dispatch`, which gives you a single place to log or replay actions.
- Screens stay dumb: they render state and emit actions.
