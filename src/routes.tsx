import { Navigate, useParams, useRoutes } from 'react-router-dom'

import { paths } from './paths'
import { HomePage } from './pages/home-page'
import { NovelPage } from './pages/novel-page'
import { MainLayout } from './layouts/main-layout'
import { ChapterPage } from './pages/chapter-page'

function ChapterRoute() {
  const { chapterSlug } = useParams()
  return <ChapterPage key={chapterSlug} />
}

export function Router() {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'novel/:novelSlug', element: <NovelPage /> },
        { path: 'novel/:novelSlug/:chapterSlug', element: <ChapterRoute /> },
        { path: '*', element: <Navigate to={paths.home} replace /> },
      ],
    },
  ])
}
