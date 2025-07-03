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
} from '@mui/material';
import {
  Upload as UploadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadPlaceholderIcon,
} from '@mui/icons-material';
import { qandaUploadPageStyles } from './QandAUploadPage_style';

const QandAUploadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseName: '',
    courseId: '',
    attachment: null,
  });

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 模拟课程数据
  useEffect(() => {
    const initializeCourses = () => {
      setCoursesLoading(true);
      // 使用你在数据库中创建的课程数据
      const mockCourses = [
        { id: 1, name: 'COMP9900 - Capstone Project' },
        { id: 2, name: 'Web Front-End Programming' }, // 添加图片中的课程名称
      ];
      setCourses(mockCourses);

      // 自动选择第一门课程，如果存在的话
      if (mockCourses.length > 0) {
        setFormData(prev => ({
          ...prev,
          courseName: mockCourses[0].name,
          courseId: mockCourses[0].id
        }));
      }

      setCoursesLoading(false);
    };
    initializeCourses();
  }, []);

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

  const handleAttachmentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
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

  const handleRemoveAttachment = () => {
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

    setIsLoading(true);
    // 模拟提交过程
    console.log('Submitting Q&A:', formData);
    try {
      // 实际情况下这里会调用后端 API，例如：
      // const apiData = new FormData();
      // apiData.append('course_id', formData.courseId);
      // apiData.append('attachment', formData.attachment);
      // const response = await api.post('/qnas/upload', apiData);
      // console.log('Q&A uploaded successfully:', response.data);

      await new Promise(resolve => setTimeout(resolve, 1500)); // 模拟网络延迟
      alert('Q&A uploaded successfully!');
      navigate('/qnas'); // 假设 /qnas 是 Q&A 列表页
    } catch (error) {
      console.error('Q&A upload failed:', error);
      alert('Upload failed. Please try again.');
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

        {/* 附件上传 */}
        <Box sx={qandaUploadPageStyles.fieldContainer}>
          <Typography variant="h6" sx={qandaUploadPageStyles.fieldLabel}>
            Attachment : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <Box
            sx={qandaUploadPageStyles.fileUploadArea}
            component="label" // 使整个 Box 可点击
          >
            <input
              type="file"
              hidden
              onChange={handleAttachmentUpload}
            />
            {formData.attachment ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CheckIcon sx={{ color: 'success.main', fontSize: '48px', mb: 1 }} />
                <Typography sx={qandaUploadPageStyles.uploadedFileName}>
                  {formData.attachment.name}
                </Typography>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRemoveAttachment(); }} sx={{ mt: 1 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <>
                <CloudUploadPlaceholderIcon sx={qandaUploadPageStyles.uploadPlaceholderIcon} />
                <Typography sx={qandaUploadPageStyles.uploadPlaceholderText}>
                  Upload
                </Typography>
              </>
            )}
          </Box>
          {errors.attachment && (
            <Typography variant="caption" color="error">
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