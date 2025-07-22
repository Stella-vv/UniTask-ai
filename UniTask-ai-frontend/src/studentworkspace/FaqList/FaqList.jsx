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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { faqListStyles as styles } from '../../tutorworkspace/FaqList/FaqList_style'; // 复用导师端样式

const BASE_URL = 'http://localhost:8008';

const StudentFaqList = () => {
  const [faqData, setFaqData] = useState([]);          // [{ id, question, answer }, ...]
  const [expandedFaqId, setExpandedFaqId] = useState(null); // 展开的是哪条 FAQ
  const [courses, setCourses] = useState([{ id: 1, name: 'COMP9900 - Capstone Project' }]); // 先写死
  const [selectedCourseId, setSelectedCourseId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取当前课程 FAQ
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${BASE_URL}/api/faqs/course/${selectedCourseId}`);
        // res.data 是数组
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
    setExpandedFaqId(null); // 切课程时收起所有
  };

  const handleAccordionChange = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // 课程加载（如果之后去请求课程列表）
  // 不再单独 coursesLoading ，直接用 courses 长度判断

  return (
    <Box sx={styles.container}>
      {/* 顶部蓝条 */}
      <Box sx={styles.topHeader}>
        <HelpOutlineIcon sx={styles.headerIcon} />
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

        {/* 课程选择 +（没有上传按钮） */}
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

        {/* FAQ 列表 */}
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
