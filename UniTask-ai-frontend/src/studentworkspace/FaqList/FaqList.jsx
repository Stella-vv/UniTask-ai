import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { faqListStyles as sharedStyles } from '../../tutorworkspace/FaqList/FaqList_style';
import { studentFaqListStyles as styles } from './FaqList_style';
import api from '../../api';

// Define the functional component to display a list of FAQs for students.
const StudentFaqList = () => {
  // State to hold the fetched FAQ data.
  const [faqData, setFaqData] = useState([]);
  // State to manage which FAQ accordion is currently expanded.
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  
  // State for the list of courses used in the filter.
  const [courses, setCourses] = useState([]);
  // State for the currently selected course ID.
  const [selectedCourseId, setSelectedCourseId] = useState('');
  // State to track loading status for courses.
  const [coursesLoading, setCoursesLoading] = useState(true);

  // State for the list of assignments based on the selected course.
  const [assignments, setAssignments] = useState([]);
  // State for the currently selected assignment ID.
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  // State to track loading status for assignments.
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  // State to track loading status for FAQs.
  const [loading, setLoading] = useState(false);
  // State to store any errors during data fetching.
  const [error, setError] = useState('');

  // Effect to fetch the list of courses on component mount.
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const res = await api.get('/courses/');
        setCourses(res.data || []);
        // If courses are fetched, select the first one by default.
        if (res.data && res.data.length > 0) {
          setSelectedCourseId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses.');
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []); // Empty dependency array ensures this runs only once.

  // Effect to fetch assignments whenever the selected course changes.
  useEffect(() => {
    const fetchAssignments = async () => {
      // If no course is selected, clear the assignments list.
      if (!selectedCourseId) {
        setAssignments([]);
        setSelectedAssignmentId('');
        return;
      }
      try {
        setAssignmentsLoading(true);
        const res = await api.get(`/assignments/course/${selectedCourseId}`);
        setAssignments(res.data || []);
        setSelectedAssignmentId(''); // Reset assignment selection when course changes.
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
      } finally {
        setAssignmentsLoading(false);
      }
    };
    fetchAssignments();
  }, [selectedCourseId]); // Re-run when selectedCourseId changes.

  // Effect to fetch FAQs when the course or assignment selection changes.
  useEffect(() => {
    const fetchFaqs = async () => {
      if (!selectedCourseId) {
        setFaqData([]);
        return;
      }
      
      // Determine the API endpoint based on whether a specific assignment is selected.
      const endpoint = selectedAssignmentId 
        ? `/faqs/assignment/${selectedAssignmentId}`
        : `/faqs/course/${selectedCourseId}`; // Fallback to course-level FAQs.
      
      try {
        setLoading(true);
        setError('');
        const res = await api.get(endpoint);
        setFaqData(res.data || []);
      } catch (err) {
        console.error('Failed to fetch FAQ data:', err);
        setError('Failed to load FAQs for the selected criteria.');
        setFaqData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, [selectedCourseId, selectedAssignmentId]); // Re-run when filter criteria change.


  // Handler for changing the selected course.
  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
  };
  
  // Handler for changing the selected assignment.
  const handleAssignmentChange = (e) => {
    setSelectedAssignmentId(e.target.value);
  };

  // Handler to toggle the expanded state of an accordion item.
  const handleAccordionChange = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // Main component render.
  return (
    <Box sx={sharedStyles.container}>
      {/* Header section. */}
      <Box sx={sharedStyles.topHeader}>
        <Typography variant="h4" sx={sharedStyles.headerTitle}>
          FAQs
        </Typography>
      </Box>

      {/* Main content area. */}
      <Box sx={sharedStyles.contentArea}>
        {/* Display error message if any. */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Container for filter dropdowns. */}
        <Box sx={styles.filterContainer}>
          {/* Course selection dropdown. */}
          <FormControl sx={styles.formControl} disabled={coursesLoading || courses.length === 0}>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourseId}
              onChange={handleCourseChange}
              label="Select Course"
            >
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Assignment selection dropdown. */}
          <FormControl sx={styles.assignmentFormControl} disabled={assignmentsLoading || assignments.length === 0}>
            <InputLabel>Select Assignment</InputLabel>
            <Select
              value={selectedAssignmentId}
              onChange={handleAssignmentChange}
              label="Select Assignment"
            >
              <MenuItem value="">
                <em>All Assignments</em>
              </MenuItem>
              {assignments.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Conditional rendering for loading, empty, or data states. */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Loading FAQs...</Typography>
          </Box>
        ) : faqData.length === 0 ? (
          <Box sx={sharedStyles.emptyState}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No FAQs Found
            </Typography>
            <Typography variant="body2">
              No FAQs match your selected criteria. Try a different course or assignment.
            </Typography>
          </Box>
        ) : (
          // Map through FAQ data and render each as an accordion.
          faqData.map((faq) => (
            <Accordion
              key={faq.id}
              disableGutters
              expanded={expandedFaqId === faq.id}
              onChange={() => handleAccordionChange(faq.id)}
              sx={sharedStyles.accordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ '& .faq-title': sharedStyles.questionText }}
              >
                <Typography className="faq-title">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={sharedStyles.accordionDetails}>
                <Typography variant="body2" sx={sharedStyles.answerText}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default StudentFaqList;