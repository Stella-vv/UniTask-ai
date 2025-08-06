import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { faqListStyles as styles } from '../../tutorworkspace/FaqList/FaqList_style'; // Reusing tutor styles

const BASE_URL = 'http://localhost:8008';

const StudentFaqList = () => {
  const [faqData, setFaqData] = useState([]);
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [courses, setCourses] = useState([{ id: 1, name: 'COMP9900 - Capstone Project' }]);
  const [selectedCourseId, setSelectedCourseId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${BASE_URL}/api/faqs/assignment/${selectedCourseId}`);
        setFaqData(res.data || []);
      } catch (err) {
        console.error('Failed to fetch FAQ data:', err);
        setError('Failed to load FAQs. Please check backend or network.');
        setFaqData([]);
      } finally {
        setLoading(false);
      }
    };
    if (selectedCourseId) fetchFaqs();
  }, [selectedCourseId]);

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
    setExpandedFaqId(null);
  };

  const handleAccordionChange = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  return (
    <Box sx={styles.container}>
      {/* Blue top bar */}
      <Box sx={styles.topHeader}>
        {/* The HelpOutlineIcon has been removed from here */}
        <Typography variant="h4" sx={styles.headerTitle}>
          FAQs
        </Typography>
      </Box>

      <Box sx={styles.contentArea}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Course selection */}
        <Box sx={styles.controlSection}>
          <FormControl>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourseId}
              onChange={handleCourseChange}
              label="Select Course"
              sx={styles.courseSelector}
              disabled={courses.length === 0}
            >
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* FAQ List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Loading FAQs...</Typography>
          </Box>
        ) : faqData.length === 0 ? (
          <Box sx={styles.emptyState}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No FAQs found
            </Typography>
            <Typography variant="body2">
              {courses.find((c) => c.id === selectedCourseId)?.name
                ? `No FAQ has been added for ${courses.find((c) => c.id === selectedCourseId)?.name}.`
                : 'Select a course to view FAQs.'}
            </Typography>
          </Box>
        ) : (
          faqData.map((faq) => (
            <Accordion
              key={faq.id}
              disableGutters
              expanded={expandedFaqId === faq.id}
              onChange={() => handleAccordionChange(faq.id)}
              sx={styles.accordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ '& .faq-title': styles.questionText }}
              >
                <Typography className="faq-title">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={styles.accordionDetails}>
                <Typography variant="body2" sx={styles.answerText}>
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