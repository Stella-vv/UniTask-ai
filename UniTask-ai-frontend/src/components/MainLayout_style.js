export const styles = {
  pageContainer: {
    bgcolor: 'background.default',
    p: 2,
  },
  appContainer: {
    display: 'flex',
    gap: 2,
    height: 'calc(100vh - 32px)',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    pt: 4, 
    width: '100%', 
  },
  mainHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '500',
  },
  headerProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  avatar: {
    bgcolor: 'primary.main',
    width: 40,
    height: 40,
  },
  logoutIcon: {
    fontSize: '32px',
    color: '#0F192D', 
    cursor: 'pointer'
  },
  pageContentContainer: {
    p: 4, 
    bgcolor: 'background.paper', 
    borderRadius: '16px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
    border: '1px solid rgba(0,0,0,0.02)', 
    flexGrow: 1, 
    overflowY: 'auto',
    minHeight: 0, 
  },
  pageContentText: {
    color: 'text.secondary', 
    textAlign: 'center', 
    py: 4, 
  },
};