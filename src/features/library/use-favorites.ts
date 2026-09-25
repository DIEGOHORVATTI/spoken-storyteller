import { useStoredState } from 'src/lib/use-stored-state'

export type FavoriteNovel = {
  slug: string
  title: string
}

type FavoritesStorage = {
  items: FavoriteNovel[]
}

export function useFavorites() {
  const { state, setState } = useStoredState<FavoritesStorage>('favorite-novels', { items: [] })
  const favorites = state.items

  const isFavorite = (slug: string) => favorites.some((favorite) => favorite.slug === slug)

  const toggle = (novel: FavoriteNovel) =>
    setState({
      items: isFavorite(novel.slug)
        ? favorites.filter((favorite) => favorite.slug !== novel.slug)
        : [...favorites, novel].toSorted((a, b) => a.title.localeCompare(b.title)),
    })

  return { favorites, isFavorite, toggle }
}
