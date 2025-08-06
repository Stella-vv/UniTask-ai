// test/studentworkspace/FaqList/FaqList.jsx

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
// --- FIX: This line must match the export in the style file ---
import { studentFaqListStyles as styles } from './FaqList_style';
import api from '../../api';

const StudentFaqList = () => {
  const [faqData, setFaqData] = useState([]);
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const res = await api.get('/courses/');
        setCourses(res.data || []);
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
  }, []);

  // Fetch assignments based on course
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!selectedCourseId) {
        setAssignments([]);
        setSelectedAssignmentId('');
        return;
      }
      try {
        setAssignmentsLoading(true);
        const res = await api.get(`/assignments/course/${selectedCourseId}`);
        setAssignments(res.data || []);
        setSelectedAssignmentId('');
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
      } finally {
        setAssignmentsLoading(false);
      }
    };
    fetchAssignments();
  }, [selectedCourseId]);

  // Fetch FAQs based on course/assignment
  useEffect(() => {
    const fetchFaqs = async () => {
      if (!selectedCourseId) {
        setFaqData([]);
        return;
      }
      
      const endpoint = selectedAssignmentId 
        ? `/faqs/assignment/${selectedAssignmentId}`
        : `/faqs/assignment/${selectedCourseId}`;
      
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
  }, [selectedCourseId, selectedAssignmentId]);


  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
  };
  
  const handleAssignmentChange = (e) => {
    setSelectedAssignmentId(e.target.value);
  };

  const handleAccordionChange = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  return (
    <Box sx={sharedStyles.container}>
      <Box sx={sharedStyles.topHeader}>
        <Typography variant="h4" sx={sharedStyles.headerTitle}>
          FAQs
        </Typography>
      </Box>

      <Box sx={sharedStyles.contentArea}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={styles.filterContainer}>
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

export default StudentFaqList;