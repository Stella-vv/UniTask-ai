import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

export const dashboardIcons = {
  course: MenuBookIcon,
  assignment: AssignmentIcon,
  faqs: HelpOutlineIcon,
};


export const dashboardCardData = [
  {
    icon: <MenuBookIcon />,
    title: 'Course',
    description: 'You have x courses',
    path: '/student/course-detail', // 修改为指向课程详情页面
  },
  {
    icon: <AssignmentIcon />,
    title: 'Assignment',
    description: 'x new assignment',
    path: '/student/assignment',
  },
  {
    icon: <HelpOutlineIcon />,
    title: 'FAQs',
    description: 'x FAQs',
    path: '/student/faqs',
  },
];