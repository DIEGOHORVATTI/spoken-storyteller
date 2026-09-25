# Spoken Storyteller

Player de light novels: busca obras no [Central Novel](https://centralnovel.com), lista os
capítulos e lê em voz alta (Web Speech API), com uma voz por personagem.

```bash
bun install
bun run dev        # http://localhost:3000
bun test           # parser de falas e vozes
bun run typecheck
```

## Estrutura

```
src/
  theme/                  tema MUI (o mesmo do scale, sem MUI X)
  features/
    catalog/              API do Central Novel (wp-json, CORS liberado) + hooks React Query
    player/
      script.ts           quem fala cada trecho do parágrafo
      voices.ts           personagem → voz/tom (determinístico) e fila de falas
      speech-player.ts    player sobre speechSynthesis
      hooks/, components/
    library/              progresso de leitura (localStorage)
  pages/                  só compõem hooks e componentes
```

## API do Central Novel

| O quê            | Endpoint                                                                 |
| ---------------- | ------------------------------------------------------------------------ |
| Buscar obras     | `GET /wp-json/wp/v2/search?search=<q>` (filtra `subtype === 'series'`)   |
| Obra             | `GET /wp-json/wp/v2/categories?slug=<slug>` (slug da série = categoria)  |
| Capa e sinopse   | `GET /wp-json/yoast/v1/get_head?url=https://centralnovel.com/series/<slug>/` |
| Capítulos        | `GET /wp-json/wp/v2/posts?categories=<id>&per_page=100&page=N&order=asc` |
| Texto            | `GET /wp-json/wp/v2/posts?slug=<capitulo>` → `content.rendered`          |
