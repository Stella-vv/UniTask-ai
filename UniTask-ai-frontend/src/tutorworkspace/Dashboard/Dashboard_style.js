export const dashboardStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', 
    gap: 4,
    p: 4,
    height: '100%',
  },
  
  welcomeText: {
    fontWeight: 400,
    color: 'text.primary',
    textAlign: 'center',
    mb: 2,
  },
  
  cardsContainer: {
    width: '100%',
    maxWidth: '1000px',
  },
  
  cardsGrid: {
    bgcolor: 'background.default',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    width: '100%',
  },
};

export const dashboardCardStyles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: 3,
    textAlign: 'center',
    textDecoration: 'none',
    color: 'inherit',
    minHeight: '140px',
    flex: 1,
    borderRight: '1px solid #E2E8F0',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    
    '&:hover': {
      bgcolor: '#F8FAFC',
      transform: 'translateY(-1px)',
    },
  },
  
  firstCard: {
    borderTopLeftRadius: '12px',
    borderBottomLeftRadius: '12px',
  },
  
  lastCard: {
    borderRight: 'none',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  
  iconContainer: {
    mb: 1.5,
    color: 'text.primary',
    
    '& .MuiSvgIcon-root': {
      fontSize: '28px',
    },
  },
  
  title: {
    fontWeight: 600,
    color: 'text.primary',
    mb: 0.5,
    fontSize: '1rem',
  },
  
  description: {
    color: 'text.secondary',
    fontSize: '0.875rem',
    lineHeight: 1.2,
  },
};