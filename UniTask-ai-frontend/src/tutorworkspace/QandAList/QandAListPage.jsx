// QandAListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import api from '../../api';

// 样式配置
const qandaListPageStyles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    p: 0,
  },

  topHeader: {
    bgcolor: 'primary.main',
    height: '100px',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },

  headerTitle: {
    color: 'white',
    fontWeight: 600,
    fontSize: '2rem',
  },

  contentArea: {
    bgcolor: '#EFF8FF',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    p: 4,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    overflowY: 'auto',
  },

  controlSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    mb: 2,
  },

  courseSelector: {
    minWidth: 300,
    bgcolor: 'white',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
    },
  },

  uploadButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 3,
    py: 1.5,
    borderRadius: '25px',
    fontSize: '1rem',
    textTransform: 'none',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  },

  qaList: {
    bgcolor: 'white',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    flex: 1,
  },

  qaItem: {
    display: 'flex',
    alignItems: 'center',
    px: 3,
    py: 2,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      bgcolor: '#F8FAFC',
    },
  },

  fileIcon: {
    mr: 2,
    display: 'flex',
    alignItems: 'center',
  },

  qaInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  },

  fileName: {
    color: 'text.primary',
    fontSize: '1rem',
    fontWeight: 500,
  },

  fileDetails: {
    color: 'text.secondary',
    fontSize: '0.875rem',
  },

  fileType: {
    bgcolor: '#E3F2FD',
    color: 'primary.main',
    fontSize: '0.75rem',
    fontWeight: 500,
    px: 1,
    py: 0.5,
    borderRadius: '12px',
    minWidth: '60px',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 8,
    color: 'text.secondary',
  },

  emptyIcon: {
    fontSize: '64px',
    mb: 2,
    color: 'text.disabled',
  },
};

const QandAListPage = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [qaList, setQAList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState('');

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
      if (courses.length > 0) {
        setSelectedCourse(courses[0].name);
        setSelectedCourseId(courses[0].id);
      }
      
      setCoursesLoading(false);
    };

    initializeCourses();
  }, []);

  // 当选择的课程改变时，获取QA列表
  useEffect(() => {
    if (selectedCourseId) {
      fetchQAList(selectedCourseId);
    }
  }, [selectedCourseId]);

  // 获取QA列表
  const fetchQAList = async (courseId) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('📚 Fetching QA list for course:', courseId);
      
      // 调用后端API获取QA列表
      const response = await api.get(`/qa/course/${courseId}/uploads`);
      console.log('✅ QA list fetched successfully:', response.data);
      
      setQAList(response.data);
      
    } catch (error) {
      console.error('❌ Failed to fetch QA list:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to load Q&A list';
      setError(errorMessage);
      
      // 使用模拟数据作为fallback（可选）
      setQAList([]);
      
    } finally {
      setLoading(false);
    }
  };

  // 处理课程选择
  const handleCourseChange = (event) => {
    const selectedCourseName = event.target.value;
    const selectedCourse = courses.find(course => course.name === selectedCourseName);
    
    setSelectedCourse(selectedCourseName);
    setSelectedCourseId(selectedCourse ? selectedCourse.id : '');
  };

  // 导航到上传页面
  const handleUploadClick = () => {
    navigate('/qnas/upload'); // 根据您的路由配置调整路径
  };

  // 下载文件
  const handleDownloadFile = (qa) => {
    // TODO: 实现文件下载功能
    console.log('📥 Download file:', qa.filename);
    
    // 如果后端提供了文件下载URL
    if (qa.filepath) {
      // 创建下载链接
      const downloadUrl = `http://localhost:8008/uploads/qas/${qa.filename}`;
      window.open(downloadUrl, '_blank');
    } else {
      alert('File not available for download');
    }
  };

  // 获取文件类型图标
  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <DescriptionIcon sx={{ color: '#f40f02' }} />;
      case 'csv':
        return <DescriptionIcon sx={{ color: '#4caf50' }} />;
      case 'xlsx':
      case 'xls':
        return <DescriptionIcon sx={{ color: '#2e7d32' }} />;
      case 'xml':
        return <DescriptionIcon sx={{ color: '#ff9800' }} />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon sx={{ color: '#2b579a' }} />;
      default:
        return <AttachFileIcon sx={{ color: '#666' }} />;
    }
  };

  // 格式化上传时间
  const formatUploadTime = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch (error) {
      return 'Invalid date';
    }
  };

  // 加载状态
  if (coursesLoading) {
    return (
      <Box sx={qandaListPageStyles.container}>
        <Box sx={qandaListPageStyles.topHeader}>
          <Typography variant="h4" sx={qandaListPageStyles.headerTitle}>
            Q&As
          </Typography>
        </Box>
        <Box sx={qandaListPageStyles.contentArea}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading courses...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={qandaListPageStyles.container}>
      {/* 顶部蓝色区域 */}
      <Box sx={qandaListPageStyles.topHeader}>
        <Typography variant="h4" sx={qandaListPageStyles.headerTitle}>
          Q&As
        </Typography>
      </Box>

      {/* 内容区域 */}
      <Box sx={qandaListPageStyles.contentArea}>
        {/* 错误提示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 控制区域：课程选择器和上传按钮 */}
        <Box sx={qandaListPageStyles.controlSection}>
          <FormControl>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourse}
              onChange={handleCourseChange}
              label="Select Course"
              sx={qandaListPageStyles.courseSelector}
              disabled={courses.length === 0}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.name}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleUploadClick}
            sx={qandaListPageStyles.uploadButton}
          >
            Upload Q&As
          </Button>
        </Box>

        {/* QA列表 */}
        <Box sx={qandaListPageStyles.qaList}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2 }}>Loading Q&As...</Typography>
            </Box>
          ) : qaList.length === 0 ? (
            <Box sx={qandaListPageStyles.emptyState}>
              <DescriptionIcon sx={qandaListPageStyles.emptyIcon} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No Q&As found
              </Typography>
              <Typography variant="body2">
                {selectedCourse ? 
                  `No Q&As uploaded for ${selectedCourse} yet.` : 
                  'Select a course to view Q&As.'
                }
              </Typography>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={handleUploadClick}
                sx={{ mt: 2 }}
              >
                Upload First Q&A
              </Button>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {qaList.map((qa, index) => (
                <React.Fragment key={qa.id}>
                  <ListItem sx={qandaListPageStyles.qaItem}>
                    {/* 文件图标 */}
                    <Box sx={qandaListPageStyles.fileIcon}>
                      {getFileIcon(qa.filetype)}
                    </Box>

                    {/* 文件信息 */}
                    <Box sx={qandaListPageStyles.qaInfo}>
                      <Typography sx={qandaListPageStyles.fileName}>
                        {qa.filename}
                      </Typography>
                      <Typography sx={qandaListPageStyles.fileDetails}>
                        Uploaded: {formatUploadTime(qa.created_at)}
                        {qa.description && ` • ${qa.description}`}
                      </Typography>
                    </Box>

                    {/* 文件类型标签 */}
                    <Chip
                      label={qa.filetype?.toUpperCase() || 'FILE'}
                      sx={qandaListPageStyles.fileType}
                    />

                    {/* 下载按钮 */}
                    <IconButton
                      onClick={() => handleDownloadFile(qa)}
                      sx={{ ml: 1 }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </ListItem>
                  
                  {index < qaList.length - 1 && (
                    <Divider sx={{ mx: 3 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default QandAListPage;