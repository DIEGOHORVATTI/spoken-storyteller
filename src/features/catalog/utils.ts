export function chapterLabel(chapterTitle: string, novelTitle = '') {
  if (!novelTitle || !chapterTitle.startsWith(novelTitle)) return chapterTitle
  return chapterTitle.slice(novelTitle.length).replace(/^\s*[–—:-]\s*/, '') || chapterTitle
}
