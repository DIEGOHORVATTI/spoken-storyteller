export const paths = {
  home: '/',
  novel: (novelSlug: string) => `/novel/${novelSlug}`,
  chapter: (novelSlug: string, chapterSlug: string) => `/novel/${novelSlug}/${chapterSlug}`,
}
