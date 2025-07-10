import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

export const dashboardCardData = [
  {
    icon: <MenuBookIcon />,
    title: 'Course',
    description: 'You have 1 courses',
    path: '/student/course-detail', // 修改为指向课程详情页面
  },
  {
    icon: <AssignmentIcon />,
    title: 'Assignment',
    description: '1 new assignment',
    path: '/student/assignment',
  },
  {
    icon: <LiveHelpIcon />,
    title: 'Q&As',
    description: '5 Q&As',
    path: '/student/qnas',
  },
  {
    icon: <HelpOutlineIcon />,
    title: 'FAQs',
    description: '3 FAQs',
    path: '/student/faqs',
  },
];