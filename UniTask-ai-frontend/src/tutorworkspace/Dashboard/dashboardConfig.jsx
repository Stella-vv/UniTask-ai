import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

export const dashboardCardData = [
  {
    icon: <MenuBookIcon />,
    title: 'Course',
    description: 'You have 3 courses',
    path: '/course',
  },
  {
    icon: <AssignmentIcon />,
    title: 'Assignment',
    description: '5 submissions to review',
    path: '/assignment',
  },
  {
    icon: <ForumIcon />,
    title: 'Forum',
    description: '2 unanswered questions',
    path: '/forum',
  },
  {
    icon: <LiveHelpIcon />,
    title: 'Q&As',
    description: '5 Q&As',
    path: '/qnas',
  },
  {
    icon: <HelpOutlineIcon />,
    title: 'FAQs',
    description: '6 FAQs',
    path: '/faqs',
  },
];