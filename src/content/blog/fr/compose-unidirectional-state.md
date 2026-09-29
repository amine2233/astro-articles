---
title: "État unidirectionnel en Jetpack Compose avec un mini store Redux"
description: "Un store de 40 lignes pour des écrans Compose prévisibles et testables."
date: 2026-09-12
tags: [kotlin, android, compose, architecture]
---

Pas besoin de framework pour obtenir la prévisibilité de Redux sur Android. Un `StateFlow` et un reducer suffisent.

## Le store

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

## L'utiliser dans un écran

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

## Pourquoi ça marche bien en pratique

- Le reducer est une **fonction pure**, donc trivial à tester unitairement.
- Chaque changement d'UI passe par `dispatch` : un point unique pour logger ou rejouer les actions.
- Les écrans restent simples : ils affichent l'état et émettent des actions.
