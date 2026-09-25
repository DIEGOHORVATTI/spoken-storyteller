import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'

type FavoriteButtonProps = {
  active: boolean
  onToggle: () => void
}

export function FavoriteButton({ active, onToggle }: FavoriteButtonProps) {
  return (
    <Tooltip title={active ? 'Remover das favoritas' : 'Favoritar'}>
      <IconButton onClick={onToggle} color={active ? 'warning' : 'default'}>
        {active ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
      </IconButton>
    </Tooltip>
  )
}
