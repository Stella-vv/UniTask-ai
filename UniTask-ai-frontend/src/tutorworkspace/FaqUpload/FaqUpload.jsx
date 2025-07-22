// src/tutorworkspace/faqs/FaqUpload.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';
import { faqUploadStyles as styles } from './FaqUpload_style';

const FaqUpload = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseName: '',
    courseId: '',
    question: '',
    answer: '',
  });

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 初始化课程
  useEffect(() => {
    setCoursesLoading(true);
    const list = [{ id: 1, name: 'COMP9900 - Capstone Project' }];
    setCourses(list);
    setFormData((p) => ({
      ...p,
      courseName: list[0].name,
      courseId: list[0].id,
    }));
    setCoursesLoading(false);
  }, []);

  // 获取当前用户 ID（与 QA 一样）
  const getCurrentUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        return user.id;
      }
    } catch (e) {
      console.error('Failed to get user ID:', e);
    }
    return null;
  };

  const handleCourseChange = (e) => {
    const name = e.target.value;
    const course = courses.find((c) => c.name === name);
    setFormData((p) => ({
      ...p,
      courseName: name,
      courseId: course ? course.id : '',
    }));
    if (errors.courseName) setErrors((p) => ({ ...p, courseName: null }));
  };

  const handleQuestionChange = (e) =>
    setFormData((p) => ({ ...p, question: e.target.value }));

  const handleAnswerChange = (e) =>
    setFormData((p) => ({ ...p, answer: e.target.value }));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseName.trim()) newErrors.courseName = 'Please select course name';
    if (!formData.question.trim()) newErrors.question = 'Please enter question';
    if (!formData.answer.trim()) newErrors.answer = 'Please enter answer';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userId = getCurrentUserId();
    if (!userId) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const body = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        uploaded_by: userId,
        course_id: formData.courseId,
      };

      const res = await api.post('/faqs/', body);
      console.log('FAQ uploaded:', res.data);
      alert('FAQ uploaded successfully!');

      // 清空
      setFormData((p) => ({
        ...p,
        question: '',
        answer: '',
      }));

      navigate('/faqs');
    } catch (e) {
      console.error('FAQ upload failed:', e);
      const msg =
        e.response?.data?.error ||
        e.response?.data?.message ||
        e.message ||
        'Upload failed. Please try again.';
      alert(`Upload failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/faqs');
    }
  };

  if (coursesLoading) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.topHeader}>
          <UploadIcon sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h4" sx={styles.headerTitle}>
            Upload FAQ
          </Typography>
        </Box>
        <Box sx={styles.formContainer}>
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
          Upload FAQ
        </Typography>
      </Box>

      <Box sx={styles.formContainer}>
        {errors.courseLoad && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {errors.courseLoad}
          </Alert>
        )}

        {/* 课程 */}
        <Box sx={styles.fieldContainer}>
          <Typography variant="h6" sx={styles.fieldLabel}>
            Course name : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <FormControl fullWidth error={!!errors.courseName}>
            <Select
              value={formData.courseName}
              onChange={handleCourseChange}
              sx={styles.selectField}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select a course
              </MenuItem>
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            {errors.courseName && (
              <Typography variant="caption" color="error">
                {errors.courseName}
              </Typography>
            )}
          </FormControl>
        </Box>

        {/* Question */}
        <Box sx={styles.fieldContainer}>
          <Typography variant="h6" sx={styles.fieldLabel}>
            Question : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.question}
            onChange={handleQuestionChange}
            placeholder="Enter the question"
            sx={styles.textField}
          />
          {errors.question && (
            <Typography variant="caption" color="error">
              {errors.question}
            </Typography>
          )}
        </Box>

        {/* Answer */}
        <Box sx={styles.fieldContainer}>
          <Typography variant="h6" sx={styles.fieldLabel}>
            Answer : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.answer}
            onChange={handleAnswerChange}
            placeholder="Enter the answer"
            sx={styles.textField}
          />
          {errors.answer && (
            <Typography variant="caption" color="error">
              {errors.answer}
            </Typography>
          )}
        </Box>

        {/* 按钮 */}
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || courses.length === 0}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={styles.confirmButton}
          >
            {isLoading ? 'Uploading...' : 'Confirm'}
          </Button>

          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={isLoading}
            startIcon={<CloseIcon />}
            sx={styles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FaqUpload;
