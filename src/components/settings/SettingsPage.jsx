import { Box, Typography, Button, Stack } from '@mui/material'
import { st } from './settingsTheme'

export const PageHeader = ({ title, description, action }) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 2,
      mb: 3,
    }}
  >
    <Box>
      <Typography
        sx={{
          fontSize: { xs: '22px', sm: '26px' },
          fontWeight: 700,
          color: st.ink,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          fontFamily: st.fontSans,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          sx={{
            mt: 0.75,
            fontSize: '14px',
            color: st.inkSecondary,
            lineHeight: 1.55,
            maxWidth: 520,
            fontFamily: st.fontSans,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
    {action}
  </Box>
)

export const Panel = ({ children, noPadding, sx }) => (
  <Box
    sx={{
      bgcolor: st.panel,
      border: `1px solid ${st.line}`,
      borderRadius: st.radiusLg,
      overflow: 'hidden',
      ...sx,
    }}
  >
    <Box sx={{ p: noPadding ? 0 : { xs: 2, sm: 2.5 } }}>{children}</Box>
  </Box>
)

export const PanelDivider = () => (
  <Box sx={{ height: '1px', bgcolor: st.line, my: 0 }} />
)

export const FormFooter = ({ onCancel, saving, saveLabel = 'Save', formId }) => (
  <Stack
    direction="row"
    spacing={1.5}
    justifyContent="flex-end"
    sx={{
      mt: 3,
      pt: 2.5,
      borderTop: `1px solid ${st.line}`,
    }}
  >
    {onCancel && (
      <Button
        onClick={onCancel}
        disabled={saving}
        sx={{
          textTransform: 'none',
          color: st.inkSecondary,
          borderColor: st.line,
          fontWeight: 500,
          px: 2.5,
        }}
        variant="outlined"
      >
        Cancel
      </Button>
    )}
    <Button
      type="submit"
      form={formId}
      disabled={saving}
      variant="contained"
      sx={{
        textTransform: 'none',
        bgcolor: st.accent,
        fontWeight: 600,
        px: 3,
        boxShadow: 'none',
        borderRadius: st.radius,
        '&:hover': { bgcolor: st.accentHover, boxShadow: 'none' },
      }}
    >
      {saving ? 'Saving…' : saveLabel}
    </Button>
  </Stack>
)

export const FieldLabel = ({ children, required }) => (
  <Typography
    component="div"
    sx={{
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: st.inkSecondary,
      mb: 0.75,
      fontFamily: st.fontSans,
    }}
  >
    {children}
    {required && (
      <Box component="span" sx={{ color: st.danger }}>
        {' '}
        *
      </Box>
    )}
  </Typography>
)

export const StatusDot = ({ ok, label }) => (
  <Typography
    component="span"
    sx={{
      fontSize: '12px',
      fontWeight: 600,
      color: ok ? st.ok : st.warn,
      fontFamily: st.fontMono,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.75,
    }}
  >
    <Box
      component="span"
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        bgcolor: ok ? st.ok : st.warn,
      }}
    />
    {label}
  </Typography>
)
