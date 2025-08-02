import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

export const dashboardCardData = [
  {
    icon: <MenuBookIcon />,
    title: 'Course',
    description: 'You have x courses',
    // path: '/course',
    path: '/tutor/course', // 修改为指向课程列表
  },
  {
    icon: <AssignmentIcon />,
    title: 'Assignment',
    description: '5 submissions to review',
    path: '/tutor/assignment',
  },
  {
    icon: <LiveHelpIcon />,
    title: 'Q&As',
    description: 'x Q&As',
    path: '/tutor/qnas',
  },
  {
    icon: <HelpOutlineIcon />,
    title: 'FAQs',
    description: 'x FAQs',
    path: '/tutor/faqs',
  },
];