import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadIcon from '@mui/icons-material/Upload';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../api';
import { faqListStyles as styles } from './FaqList_style';

// Define the component to display a list of FAQs for a specific assignment.
const FaqList = () => {
  // Hooks for navigation and accessing URL parameters.
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  // State to hold the list of FAQs, loading status, errors, and assignment name.
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignmentName, setAssignmentName] = useState('');

  // A memoized function to fetch the assignment name and its associated FAQs.
  const fetchFaqs = useCallback(async () => {
    if (!assignmentId) {
      setError("Assignment ID not found in URL.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Fetch assignment details to get the name for the header.
      const assignmentRes = await api.get(`/assignments/detail/${assignmentId}`);
      setAssignmentName(assignmentRes.data.name);
      // Fetch the list of FAQs for the assignment.
      const res = await api.get(`/faqs/assignment/${assignmentId}`);
      setFaqList(res.data || []);
    } catch (e) {
      console.error('Failed to fetch FAQs:', e);
      setError('Failed to load FAQs for this assignment.');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]); // Re-run if assignmentId changes.

  // Effect to call the data fetching function on component mount.
  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // Handler to navigate to the FAQ upload page.
  const goUpload = () => navigate(`/tutor/assignment/${assignmentId}/faqs/upload`);
  
  // Handler to navigate to the FAQ modification page for a specific FAQ.
  const handleEdit = (faqId, event) => {
    event.stopPropagation(); // Prevent the accordion from toggling when the edit icon is clicked.
    navigate(`/tutor/assignment/${assignmentId}/faqs/modify/${faqId}`);
  };

  // Handler to navigate back to the parent assignment detail page.
  const handleGoBack = () => {
    navigate(`/tutor/assignment/${assignmentId}`);
  };

  // Initial loading state before the assignment name is fetched.
  if (loading && !assignmentName) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.topHeader}>
          <Typography variant="h4" sx={styles.headerTitle}>FAQs</Typography>
        </Box>
        <Box sx={{...styles.contentArea, justifyContent: 'center', alignItems: 'center'}}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Main component render.
  return (
    <Box sx={styles.container}>
      {/* Header section with dynamic title and back button. */}
      <Box sx={styles.topHeader}>
        <Typography variant="h4" sx={styles.headerTitle}>
          FAQs for {assignmentName || `Assignment ${assignmentId}`}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={styles.backButton}
        >
          Back
        </Button>
      </Box>

      {/* Main content area. */}
      <Box sx={styles.contentArea}>
        {/* Display error message if any. */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Section with control buttons like 'Upload'. */}
        <Box sx={styles.controlSection}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={goUpload}
            sx={styles.uploadButton}
          >
            Upload FAQ
          </Button>
        </Box>

        {/* Conditional rendering for loading, empty, or data states. */}
        {loading ? (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Loading FAQs...</Typography>
          </Box>
        ) : faqList.length === 0 ? (
          // Display an empty state message if no FAQs are found.
          <Box sx={styles.emptyState}>
            <DescriptionIcon sx={styles.emptyIcon} />
            <Typography variant="h6" sx={{ mb: 1 }}>No FAQs Found</Typography>
            <Typography variant="body2">No FAQs have been uploaded for this assignment yet.</Typography>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={goUpload}
              sx={{ mt: 2 }}
            >
              Upload First FAQ
            </Button>
          </Box>
        ) : (
          // Map through FAQ data and render each as an accordion.
          <Box>
            {faqList.map((faq) => (
              <Accordion key={faq.id} disableGutters sx={styles.accordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={styles.accordionSummary}
                >
                  <Typography sx={styles.questionText}>{faq.question}</Typography>
                  {/* Edit button that navigates to the modify page. */}
                  <Box
                    component="div"
                    onClick={(event) => handleEdit(faq.id, event)}
                    sx={styles.editButton}
                  >
                    <EditIcon fontSize="small" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={styles.accordionDetails}>
                  <Typography sx={styles.answerText}>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default FaqList;