import React, { useState } from 'react';
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
  Alert,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { faqUploadStyles } from './FaqUpload_style';

const FaqUpload = () => {
  const navigate = useNavigate();
  
  // 表单状态管理
  const [formData, setFormData] = useState({
    courseName: 'Web Front-End Programming',
    question: 'What is the late submission policy for frontend assignments?',
    answer: `All assignments must be submitted by the due date specified on the course platform (usually via Moodle or the project dashboard).

If you submit your assignment after the deadline:
• Within 3 days late: 10% of the total mark will be deducted for each day late.
• More than 3 days late: The assignment will not be`,
  });

  // 错误状态管理
  const [errors, setErrors] = useState({});
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 模拟课程数据（后续从API获取）
  const courses = [
    { id: 1, name: 'Web Front-End Programming' },
    { id: 2, name: 'Data Structures and Algorithms' },
    { id: 3, name: 'Database Management Systems' },
    { id: 4, name: 'Software Engineering' },
  ];

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

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Please select course';
    }
    
    if (!formData.question.trim()) {
      newErrors.question = 'Please input question';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Please input answer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: 替换为实际的API调用
      console.log('Upload FAQ data:', formData);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 成功后的处理
      alert('FAQ uploaded successfully!');
      navigate('/faqs'); // 返回到FAQ列表页面
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/faqs'); // 返回到FAQ列表页面
    }
  };

  return (
    <Box sx={faqUploadStyles.container}>
      {/* 顶部蓝色区域 */}
      <Box sx={faqUploadStyles.topHeader}>
        <UploadIcon sx={faqUploadStyles.uploadIcon} />
        <Typography variant="h4" sx={faqUploadStyles.headerTitle}>
          Upload FAQ
        </Typography>
      </Box>

      {/* 表单内容区域 */}
      <Box sx={faqUploadStyles.formContainer}>
        {/* 课程名称 */}
        <Box sx={faqUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={faqUploadStyles.fieldLabel}>
            Course name : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <FormControl fullWidth error={!!errors.courseName}>
            <Select
              value={formData.courseName}
              onChange={handleInputChange('courseName')}
              sx={faqUploadStyles.selectField}
              IconComponent={ArrowDownIcon}
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

        {/* 问题 */}
        <Box sx={faqUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={faqUploadStyles.fieldLabel}>
            Question : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.question}
            onChange={handleInputChange('question')}
            error={!!errors.question}
            helperText={errors.question}
            sx={faqUploadStyles.textField}
            placeholder="Enter your question here..."
          />
        </Box>

        {/* 答案 */}
        <Box sx={faqUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={faqUploadStyles.fieldLabel}>
            Answer : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={formData.answer}
            onChange={handleInputChange('answer')}
            error={!!errors.answer}
            helperText={errors.answer}
            sx={faqUploadStyles.textField}
            placeholder="Enter your answer here..."
          />
        </Box>

        {/* 操作按钮 */}
        <Box sx={faqUploadStyles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={<CheckIcon />}
            sx={faqUploadStyles.confirmButton}
          >
            {isLoading ? 'Uploading...' : 'Confirm'}
          </Button>
          
          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={isLoading}
            startIcon={<CloseIcon />}
            sx={faqUploadStyles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FaqUpload;