const SITE_URL = 'https://centralnovel.com'
const API_URL = `${SITE_URL}/wp-json`
const CHAPTERS_PER_PAGE = 100

export type NovelSummary = {
  id: number
  slug: string
  title: string
}

export type Novel = {
  slug: string
  title: string
  categoryId: number
  chapterCount: number
  cover?: string
  synopsis?: string
}

export type ChapterSummary = {
  id: number
  slug: string
  title: string
}

export type Chapter = ChapterSummary & {
  paragraphs: string[]
}

type Params = Record<string, string | number>

type SearchResult = { id: number; title: string; url: string; subtype: string }
type Category = { id: number; name: string; count: number }
type Post = {
  id: number
  slug: string
  title: { rendered: string }
  content?: { rendered: string }
}
type YoastHead = {
  json?: { title?: string; og_description?: string; og_image?: { url: string }[] }
}

async function request<T>(path: string, params: Params = {}) {
  const url = new URL(`${API_URL}${path}`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)))

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Central Novel respondeu ${response.status}`)

  return { data: (await response.json()) as T, headers: response.headers }
}

function parseHtml(html: string) {
  return new DOMParser().parseFromString(html, 'text/html')
}

function decodeEntities(text: string) {
  return parseHtml(text).documentElement.textContent?.trim() ?? text
}

function seriesSlugFromUrl(url: string) {
  return new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? ''
}

function toChapterSummary(post: Post): ChapterSummary {
  return { id: post.id, slug: post.slug, title: decodeEntities(post.title.rendered) }
}

export async function searchNovels(query: string): Promise<NovelSummary[]> {
  const { data } = await request<SearchResult[]>('/wp/v2/search', {
    search: query,
    per_page: 20,
    _fields: 'id,title,url,subtype',
  })

  return data
    .filter((result) => result.subtype === 'series')
    .map((result) => ({
      id: result.id,
      slug: seriesSlugFromUrl(result.url),
      title: decodeEntities(result.title),
    }))
}

export async function getNovel(slug: string): Promise<Novel> {
  const [categories, head] = await Promise.all([
    request<Category[]>('/wp/v2/categories', { slug, _fields: 'id,name,count' }),
    request<YoastHead>('/yoast/v1/get_head', { url: `${SITE_URL}/series/${slug}/` }).catch(
      () => null,
    ),
  ])

  const category = categories.data[0]
  if (!category) throw new Error('Obra não encontrada')

  const meta = head?.data.json

  return {
    slug,
    title: decodeEntities(category.name),
    categoryId: category.id,
    chapterCount: category.count,
    cover: meta?.og_image?.[0]?.url,
    synopsis: meta?.og_description?.replace(/^Sinopse:\s*/i, ''),
  }
}

export async function getChapters(categoryId: number): Promise<ChapterSummary[]> {
  const fetchPage = (page: number) =>
    request<Post[]>('/wp/v2/posts', {
      categories: categoryId,
      per_page: CHAPTERS_PER_PAGE,
      page,
      orderby: 'date',
      order: 'asc',
      _fields: 'id,slug,title',
    })

  const first = await fetchPage(1)
  const totalPages = Number(first.headers.get('X-WP-TotalPages') ?? 1)
  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => fetchPage(index + 2)),
  )

  return [first, ...rest].flatMap((page) => page.data.map(toChapterSummary))
}

export async function getChapter(slug: string): Promise<Chapter> {
  const { data } = await request<Post[]>('/wp/v2/posts', {
    slug,
    _fields: 'id,slug,title,content',
  })

  const post = data[0]
  if (!post) throw new Error('Capítulo não encontrado')

  const content = parseHtml(post.content?.rendered ?? '')
  content.querySelectorAll('sup').forEach((footnote) => footnote.remove())

  const paragraphs = [...content.querySelectorAll('p')]
    .map((paragraph) => paragraph.textContent?.replace(/\s+/g, ' ').trim() ?? '')
    .filter(Boolean)

  return { ...toChapterSummary(post), paragraphs }
}
