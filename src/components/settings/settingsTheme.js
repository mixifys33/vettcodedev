/** Settings area — separate visual language from dashboard/analytics */
export const st = {
  workspace: '#E4E7EC',
  panel: '#FFFFFF',
  panelMuted: '#F7F8FA',
  ink: '#0C0F14',
  inkSecondary: '#5C6573',
  inkMuted: '#8B95A5',
  line: '#D5DAE1',
  lineStrong: '#B8C0CC',
  accent: '#2563EB',
  accentSoft: '#EFF6FF',
  accentHover: '#1D4ED8',
  ok: '#059669',
  okSoft: '#ECFDF5',
  warn: '#D97706',
  warnSoft: '#FFFBEB',
  danger: '#DC2626',
  radius: '6px',
  radiusLg: '10px',
  fontMono: '"IBM Plex Mono", "Consolas", monospace',
  fontSans: '"Inter", system-ui, sans-serif',
}

export const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: st.radius,
    bgcolor: st.panel,
    fontSize: '14px',
    fontFamily: st.fontSans,
    '& fieldset': { borderColor: st.line },
    '&:hover fieldset': { borderColor: st.lineStrong },
    '&.Mui-focused fieldset': { borderColor: st.accent, borderWidth: '1px' },
  },
  '& .MuiInputLabel-root': { fontSize: '13px', color: st.inkSecondary },
  '& .MuiInputLabel-root.Mui-focused': { color: st.accent },
  '& .MuiFormHelperText-root': { fontSize: '12px', mt: 0.75 },
}
