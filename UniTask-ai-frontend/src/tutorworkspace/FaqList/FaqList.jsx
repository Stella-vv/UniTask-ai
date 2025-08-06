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

const FaqList = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignmentName, setAssignmentName] = useState('');

  const fetchFaqs = useCallback(async () => {
    if (!assignmentId) {
      setError("Assignment ID not found in URL.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const assignmentRes = await api.get(`/assignments/detail/${assignmentId}`);
      setAssignmentName(assignmentRes.data.name);
      const res = await api.get(`/faqs/assignment/${assignmentId}`);
      setFaqList(res.data || []);
    } catch (e) {
      console.error('Failed to fetch FAQs:', e);
      setError('Failed to load FAQs for this assignment.');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const goUpload = () => navigate(`/tutor/assignment/${assignmentId}/faqs/upload`);
  
  const handleEdit = (faqId, event) => {
    event.stopPropagation(); // Stop the click from expanding the accordion
    navigate(`/tutor/assignment/${assignmentId}/faqs/modify/${faqId}`);
  };

  const handleGoBack = () => {
    navigate(`/tutor/assignment/${assignmentId}`);
  };

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

  return (
    <Box sx={styles.container}>
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

      <Box sx={styles.contentArea}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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

        {loading ? (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Loading FAQs...</Typography>
          </Box>
        ) : faqList.length === 0 ? (
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
          <Box>
            {faqList.map((faq) => (
              <Accordion key={faq.id} disableGutters sx={styles.accordion}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={styles.accordionSummary}
                >
                  <Typography sx={styles.questionText}>{faq.question}</Typography>
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

export default FaqList;