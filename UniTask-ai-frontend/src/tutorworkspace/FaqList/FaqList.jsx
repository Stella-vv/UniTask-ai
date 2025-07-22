// src/tutorworkspace/FaqList/FaqList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadIcon from '@mui/icons-material/Upload';
import api from '../../api'; // 根据你的路径调整
import { faqListStyles as styles } from './FaqList_style';

const FaqList = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState('');

  // 初始化课程（写死 1 门）
  useEffect(() => {
    setCoursesLoading(true);
    const list = [{ id: 1, name: 'COMP9900 - Capstone Project' }];
    setCourses(list);
    if (list.length) {
      setSelectedCourseId(list[0].id);
      setSelectedCourseName(list[0].name);
    }
    setCoursesLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    fetchFaqs(selectedCourseId);
  }, [selectedCourseId]);

  const fetchFaqs = async (courseId) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/faqs/course/${courseId}`);
      setFaqList(res.data || []);
    } catch (e) {
      console.error('Failed to fetch FAQs:', e);
      const msg =
        e.response?.data?.error ||
        e.response?.data?.message ||
        'Failed to load FAQs';
      setError(msg);
      setFaqList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const id = e.target.value;
    const name = courses.find((c) => c.id === id)?.name || '';
    setSelectedCourseId(id);
    setSelectedCourseName(name);
  };

  const goUpload = () => navigate('/tutor/faqs/upload'); // or '/faq-upload'

  // 课程加载中
  if (coursesLoading) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.topHeader}>
          <Typography variant="h4" sx={styles.headerTitle}>
            FAQs
          </Typography>
        </Box>
        <Box sx={styles.contentArea}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading courses...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.topHeader}>
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

        {/* 控制区 */}
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

          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: '25px',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
            onClick={goUpload}
          >
            Upload FAQ
          </Button>
        </Box>

        {/* 列表 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Loading FAQs...</Typography>
          </Box>
        ) : faqList.length === 0 ? (
          <Box sx={styles.emptyState}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No FAQs found
            </Typography>
            <Typography variant="body2">
              {selectedCourseName
                ? `No FAQ has been added for ${selectedCourseName} yet.`
                : 'Select a course to view FAQs.'}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ mt: 2 }}
              onClick={goUpload}
            >
              Upload First FAQ
            </Button>
          </Box>
        ) : (
          faqList.map((faq) => (
            <Accordion
              key={faq.id}
              disableGutters
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

export default FaqList;
