// test/tutorworkspace/QandAUpload/QandAUploadPage.jsx

import React, { useState, useEffect } from 'react';
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
  IconButton,
  TextField,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadPlaceholderIcon,
} from '@mui/icons-material';
import { qandaUploadPageStyles } from './QandAUploadPage_style';
import api from '../../api';

const QandAUploadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseName: '',
    courseId: '',
    attachment: null,
    description: '',
  });

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 获取课程列表
  useEffect(() => {
    // 暂时使用硬编码的课程数据，因为后端还没有课程列表API
    const initializeCourses = () => {
      setCoursesLoading(true);
      
      // 使用你在数据库中创建的课程数据
      const courses = [
        { id: 1, name: 'COMP9900 - Capstone Project' }
      ];
      
      setCourses(courses);
      
      // 自动选择第一门课程
      setFormData(prev => ({
        ...prev,
        courseName: courses[0].name,
        courseId: courses[0].id
      }));
      
      setCoursesLoading(false);
    };

    initializeCourses();
  }, []);

  // 获取当前用户ID
  const getCurrentUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        console.log('Current user:', user);
        return user.id;
      }
    } catch (error) {
      console.error('Failed to get user ID:', error);
    }
    return null;
  };

  const handleCourseChange = (event) => {
    const selectedCourseName = event.target.value;
    const selectedCourse = courses.find(course => course.name === selectedCourseName);

    setFormData(prev => ({
      ...prev,
      courseName: selectedCourseName,
      courseId: selectedCourse ? selectedCourse.id : ''
    }));

    if (errors.courseName) {
      setErrors(prev => ({
        ...prev,
        courseName: null
      }));
    }
  };

  const handleDescriptionChange = (event) => {
    setFormData(prev => ({
      ...prev,
      description: event.target.value
    }));
  };

  const handleAttachmentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 检查文件类型（可根据需要调整）
      const allowedTypes = [
        'application/pdf',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/xml',
        'application/xml',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          attachment: 'Please upload a valid file (PDF, CSV, Excel, XML, Word)'
        }));
        return;
      }

      // 检查文件大小（例如限制为 10MB）
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          attachment: 'File size must be less than 10MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        attachment: file
      }));
      
      if (errors.attachment) {
        setErrors(prev => ({
          ...prev,
          attachment: null
        }));
      }
    }
  };

  const handleRemoveAttachment = (event) => {
    event.stopPropagation(); // 防止触发文件选择
    setFormData(prev => ({
      ...prev,
      attachment: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Please select course name';
    }
    if (!formData.attachment) {
      newErrors.attachment = 'Please upload an attachment';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // 检查用户是否登录
    const userId = getCurrentUserId();
    if (!userId) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      // 准备 multipart/form-data 数据
      const submitData = new FormData();
      submitData.append('course_id', formData.courseId.toString());
      submitData.append('user_id', userId.toString());
      submitData.append('file', formData.attachment);
      if (formData.description.trim()) {
        submitData.append('description', formData.description.trim());
      }

      console.log('📤 Submitting Q&A data (FormData)...');
      console.log('Course ID:', formData.courseId);
      console.log('User ID:', userId);
      console.log('File:', formData.attachment.name);
      console.log('Description:', formData.description);

      // 发送 multipart/form-data 请求到后端 qa.py API
      const response = await api.post('/qa/upload', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Q&A uploaded successfully:', response.data);
      alert('Q&A uploaded successfully!');
      
      // 重置表单
      setFormData(prev => ({
        ...prev,
        attachment: null,
        description: ''
      }));
      
      // 导航到 Q&A 列表页面或其他相关页面
      navigate('/qnas');
      
    } catch (error) {
      console.error('❌ Q&A upload failed:', error);

      const errorMessage = error.response?.data?.error ||
                         error.response?.data?.message ||
                         error.message ||
                         'Upload failed. Please try again.';
      
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/qnas'); // 返回到 Q&A 列表页或上一页
    }
  };

  if (coursesLoading) {
    return (
      <Box sx={qandaUploadPageStyles.container}>
        <Box sx={qandaUploadPageStyles.topHeader}>
          <UploadIcon sx={qandaUploadPageStyles.headerIcon} />
          <Typography variant="h4" sx={qandaUploadPageStyles.headerTitle}>
            Upload Q&As
          </Typography>
        </Box>
        <Box sx={qandaUploadPageStyles.formContainer}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading courses...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={qandaUploadPageStyles.container}>
      {/* 顶部蓝色区域 */}
      <Box sx={qandaUploadPageStyles.topHeader}>
        <Typography variant="h4" sx={qandaUploadPageStyles.headerTitle}>
          Upload Q&As
        </Typography>
      </Box>

      {/* 表单内容区域 */}
      <Box sx={qandaUploadPageStyles.formContainer}>
        {/* 显示课程加载错误 */}
        {errors.courseLoad && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {errors.courseLoad}
          </Alert>
        )}
        {/* 课程名称 */}
        <Box sx={qandaUploadPageStyles.fieldContainer}>
          <Typography variant="h6" sx={qandaUploadPageStyles.fieldLabel}>
            Course name : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <FormControl fullWidth error={!!errors.courseName}>
            <Select
              value={formData.courseName}
              onChange={handleCourseChange}
              sx={qandaUploadPageStyles.selectField}
              displayEmpty // 允许选中空值，但在 UI 上显示 placeholder
            >
              <MenuItem value="" disabled>
                Select a course
              </MenuItem>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.name}>
                  {course.name}
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

        {/* 描述字段 */}
        <Box sx={qandaUploadPageStyles.fieldContainer}>
          <Typography variant="h6" sx={qandaUploadPageStyles.fieldLabel}>
            Description :
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter a description for this Q&A file (optional)"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                borderRadius: '8px',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {/* 附件上传 */}
        <Box sx={qandaUploadPageStyles.fieldContainer}>
          <Typography variant="h6" sx={qandaUploadPageStyles.fieldLabel}>
            Attachment : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <Box
            sx={{
              ...qandaUploadPageStyles.fileUploadArea,
              cursor: formData.attachment ? 'default' : 'pointer'
            }}
            component="label" // 使整个 Box 可点击
          >
            <input
              type="file"
              hidden
              onChange={handleAttachmentUpload}
              accept=".pdf,.csv,.xlsx,.xls,.xml,.doc,.docx"
              disabled={isLoading}
            />
            {formData.attachment ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CheckIcon sx={{ color: 'success.main', fontSize: '48px', mb: 1 }} />
                <Typography sx={qandaUploadPageStyles.uploadedFileName}>
                  {formData.attachment.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                  {(formData.attachment.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={handleRemoveAttachment} 
                  sx={{ mt: 1 }}
                  disabled={isLoading}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <>
                <CloudUploadPlaceholderIcon sx={qandaUploadPageStyles.uploadPlaceholderIcon} />
                <Typography sx={qandaUploadPageStyles.uploadPlaceholderText}>
                  Upload Q&A File
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Supported formats: PDF, CSV, Excel, XML, Word
                </Typography>
              </>
            )}
          </Box>
          {errors.attachment && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errors.attachment}
            </Typography>
          )}
        </Box>

        {/* 操作按钮 */}
        <Box sx={qandaUploadPageStyles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || courses.length === 0}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={qandaUploadPageStyles.confirmButton}
          >
            {isLoading ? 'Uploading...' : 'Confirm'}
          </Button>

          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={isLoading}
            startIcon={<CloseIcon />}
            sx={qandaUploadPageStyles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QandAUploadPage;