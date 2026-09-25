import type { Theme, SxProps } from '@mui/material/styles'

import Avatar from '@mui/material/Avatar'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'

type NovelCoverProps = {
  src?: string
  title: string
  width: number
  sx?: SxProps<Theme>
}

export function NovelCover({ src, title, width, sx }: NovelCoverProps) {
  return (
    <Avatar
      variant="rounded"
      src={src}
      alt={title}
      sx={[
        {
          width,
          height: Math.round(width * 1.41),
          bgcolor: 'background.neutral',
          color: 'text.disabled',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <MenuBookRoundedIcon />
    </Avatar>
  )
}
