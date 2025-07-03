// 注意： courses { id: 2, name: 'Web Front-End Programming' }

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { assignmentUploadStyles } from './AssignmentUpload_style';
import api from '../../api';

const AssignmentUpload = () => {
  const navigate = useNavigate();
  // 表单状态管理
  // const [formData, setFormData] = useState({
  //   courseName: 'Web Front-End Programming',
  //   title: 'Assignment 1',
  //   description: '',
  //   dueDate: '01/07/2025',
  //   rubrics: null,
  //   attachment: null,
  // });
  const [formData, setFormData] = useState({
    courseName: '',
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    rubrics: null,
    attachment: null,
  });

    // 课程列表状态
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState('');
  // 错误状态管理
  const [errors, setErrors] = useState({});
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 模拟课程数据（后续从API获取）
  // const courses = [
  //   { id: 1, name: 'Web Front-End Programming' },
  //   { id: 2, name: 'Data Structures and Algorithms' },
  //   { id: 3, name: 'Database Management Systems' },
  // ];


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

  // 处理课程选择变化
  const handleCourseChange = (event) => {
    const selectedCourseName = event.target.value;
    const selectedCourse = courses.find(course => course.name === selectedCourseName);
    
    setFormData(prev => ({
      ...prev,
      courseName: selectedCourseName,
      courseId: selectedCourse ? selectedCourse.id : ''
    }));
    
    // 清除课程相关错误
    if (errors.courseName) {
      setErrors(prev => ({
        ...prev,
        courseName: null
      }));
    }
  };

  // 处理输入框变化
  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // 处理文件上传
  const handleFileUpload = (field) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      
      // 清除文件相关错误
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: null
        }));
      }
    }
  };

  // 移除文件
  const handleRemoveFile = (field) => () => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
  };

  // 日期格式转换函数
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    
    // 前端日期格式：YYYY-MM-DD
    // 后端期望格式：YYYY-MM-DD HH:MM:SS
    return `${dateString} 23:59:59`;
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Please select course';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Please input assignment title';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Please select deadline';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  // 提交表单
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
      // 准备提交数据
      // const submitData = new FormData();
      // submitData.append('courseName', formData.courseName);
      // submitData.append('title', formData.title);
      // submitData.append('description', formData.description);
      // submitData.append('dueDate', formData.dueDate);
      const submitData = {
        name: formData.title,
        description: formData.description,
        due_date: formatDateForBackend(formData.dueDate),
        course_id: formData.courseId,
        user_id: userId
      };
      
      // TODO: 替换为实际的API调用
      console.log('Submitting assignment data:', submitData);

      // 调用后端API
      const response = await api.post('/assignments/', submitData);

      console.log('Assignment created successfully:', response.data);
      // 成功后的处理（如跳转页面、显示成功消息等）
      alert('Assignment uploaded successfully!');
      navigate('/assignment'); // 返回到AssignmentList页面
      
    } catch (error) {
      console.error('Upload failed:', error);

      // 显示详细错误信息
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Upload failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    // TODO: 根据实际需求处理取消逻辑（如返回上一页）
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/assignment');
      // 重置表单或导航回上一页
      console.log('Cancel action');
    }
  };

  // 如果课程正在加载
  if (coursesLoading) {
    return (
      <Box sx={assignmentUploadStyles.container}>
        <Box sx={assignmentUploadStyles.topHeader}>
          <UploadIcon sx={assignmentUploadStyles.uploadIcon} />
          <Typography variant="h4" sx={assignmentUploadStyles.headerTitle}>
            Upload Assignment
          </Typography>
        </Box>
        <Box sx={assignmentUploadStyles.formContainer}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading courses...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
          <Box sx={assignmentUploadStyles.container}>
      {/* 顶部蓝色区域 */}
      <Box sx={assignmentUploadStyles.topHeader}>
        <UploadIcon sx={assignmentUploadStyles.uploadIcon} />
        <Typography variant="h4" sx={assignmentUploadStyles.headerTitle}>
          Upload Assignment
        </Typography>
      </Box>

      {/* 表单内容区域 */}
      <Box sx={assignmentUploadStyles.formContainer}>
        {/* 显示课程加载错误 */}
        {coursesError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {coursesError}
          </Alert>
        )}

        {/* 课程名称 */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Course name : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <FormControl fullWidth error={!!errors.courseName}>
            <Select
              value={formData.courseName}
              onChange={handleCourseChange}
              sx={assignmentUploadStyles.selectField}
              IconComponent={ArrowDownIcon}
              disabled={courses.length === 0}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.name}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.courseName && (
            <Typography variant="caption" color="error">
              {errors.courseName}
            </Typography>
          )}
        </Box>

        {/* 标题 */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Title : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.title}
            onChange={handleInputChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            sx={assignmentUploadStyles.textField}
            placeholder="Enter assignment title"
          />
        </Box>

        {/* 描述 */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Description :
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange('description')}
            sx={assignmentUploadStyles.textField}
            placeholder="Enter assignment description"
          />
        </Box>

        {/* 截止日期 */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Due Date : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange('dueDate')}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
            sx={assignmentUploadStyles.dateField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarIcon sx={{ color: '#62BBF5' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* 评分标准文件 */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Rubrics :
          </Typography>
          <Box sx={assignmentUploadStyles.fileUploadContainer}>
            <TextField
              fullWidth
              value={formData.rubrics ? formData.rubrics.name : ''}
              placeholder="Choose rubric"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    {formData.rubrics ? (
                      <IconButton onClick={handleRemoveFile('rubrics')}>
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <IconButton component="label">
                        <UploadIcon sx={{ color: '#62BBF5' }} />
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload('rubrics')}
                        />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={assignmentUploadStyles.textField}
            />
          </Box>
        </Box>

        {/* 附件 */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Attachment :
          </Typography>
          <Box sx={assignmentUploadStyles.fileUploadContainer}>
            <TextField
              fullWidth
              value={formData.attachment ? formData.attachment.name : ''}
              placeholder="Choose Attachment"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    {formData.attachment ? (
                      <IconButton onClick={handleRemoveFile('attachment')}>
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <IconButton component="label">
                        <UploadIcon sx={{ color: '#62BBF5' }} />
                        <input
                          type="file"
                          hidden
                          onChange={handleFileUpload('attachment')}
                        />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={assignmentUploadStyles.textField}
            />
          </Box>
        </Box>

        {/* 操作按钮 */}
        <Box sx={assignmentUploadStyles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || courses.length === 0}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={assignmentUploadStyles.confirmButton}
          >
            {isLoading ? 'Uploading...' : 'Confirm'}
          </Button>
          
          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={isLoading}
            startIcon={<CloseIcon />}
            sx={assignmentUploadStyles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentUpload;