import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { Link as RouterLink } from 'react-router-dom';
import { courseDetailStyles } from './CourseDetail_style';

// Mock data - replace with actual data from props or API later
const mockCourseData = {
  title: 'Web Front-End Programming',
  courseId: '645321',
  courseSummary: `This is a first course in wireless and mobile networking examining the fundamental theories as well as the latest advances in wireless data and mobile communication networks. Topics include fundamental concepts in wireless coding, modulation, and signal propagation, WiFi and wireless local area networks, cellular networks, Bluetooth, and Internet of Things networks. The course will also overview some of the emerging wireless networking concepts, such as wireless sensing, and droneassisted mobile networks. Hands-on experiments with mobile devices will be part of the learning exercise, which involves wireless packet capture, analysis, and programming.`,
  assessments: [
    { id: 1, name: 'Final Exam Assessment Format: Individual 40%' },
    { id: 2, name: 'Hands-on Experiments (Labs) Assessment Format: Individual 20%' },
    { id: 3, name: 'Mid-lecture Quizzes Assessment Format: Individual 15%' },
    { id: 4, name: 'Term Project Assessment Format: Individual 25%' },
  ]
};

const CourseDetail = () => {
  const course = mockCourseData;

  return (
    <Box sx={courseDetailStyles.container}>
      {/* Top Dark Blue Header */}
      <Box sx={courseDetailStyles.topBlueHeader}>
        <Typography variant="h4" sx={courseDetailStyles.headerTitle}>
          Course Detail
        </Typography>
      </Box>
      
      {/* Main Content Area - Light Blue */}
      <Box sx={courseDetailStyles.contentArea}>
        {/* Course Title and Action Buttons */}
        <Box sx={courseDetailStyles.titleSection}>
          <Typography variant="h4" sx={courseDetailStyles.courseTitle}>
            {course.title}
          </Typography>
          <Box sx={courseDetailStyles.actionButtons}>
            <Button 
              variant="contained" 
              startIcon={<EditIcon />}
              sx={courseDetailStyles.modifyButton}
            >
              Modify
            </Button>
            <Button 
              variant="contained" 
              startIcon={<DeleteIcon />}
              sx={courseDetailStyles.deleteButton}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Course ID */}
        <Typography variant="h6" sx={courseDetailStyles.courseId}>
          Course ID: {course.courseId}
        </Typography>

        {/* Course Summary */}
        <Box sx={courseDetailStyles.summarySection}>
          <Typography variant="h6" sx={courseDetailStyles.sectionTitle}>
            Course Summary
          </Typography>
          <Typography variant="body1" sx={courseDetailStyles.summaryText}>
            {course.courseSummary}
          </Typography>
        </Box>

        {/* Assessments */}
        <Box sx={courseDetailStyles.assessmentsSection}>
          <Typography variant="h6" sx={courseDetailStyles.sectionTitle}>
            Assessments
          </Typography>
          <List sx={courseDetailStyles.assessmentsList}>
            {course.assessments.map((assessment, index) => (
              <ListItem key={assessment.id} sx={courseDetailStyles.assessmentItem}>
                <ListItemText 
                  primary={`${index + 1}. ${assessment.name}`}
                  primaryTypographyProps={{
                    sx: courseDetailStyles.assessmentText
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={courseDetailStyles.navigationButtons}>
          <Button
            component={RouterLink}
            to="/assignment"
            variant="contained"
            startIcon={<AssignmentIcon />}
            sx={courseDetailStyles.navButton}
          >
            Assignment
          </Button>
          <Button
            component={RouterLink}
            to="/qnas"
            variant="contained"
            startIcon={<LiveHelpIcon />}
            sx={courseDetailStyles.navButton}
          >
            Q&As
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetail;