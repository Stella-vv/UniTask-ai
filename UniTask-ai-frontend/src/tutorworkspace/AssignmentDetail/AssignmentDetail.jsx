import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Forum as ForumIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { assignmentDetailStyles } from './AssignmentDetail_style';
import api from '../../api';

const AssignmentDetail = () => {
  // 从路由获取作业ID
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  // 状态管理
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取作业详情数据
  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 从localStorage获取用户信息
        const userString = localStorage.getItem('user');
        if (!userString) {
          setError('User not logged in. Please log in again.');
          setLoading(false);
          navigate('/login');
          return;
        }

        const user = JSON.parse(userString);
        const userId = user.id;

        // 如果没有提供assignmentId，则显示错误
        if (!assignmentId) {
          setError('Assignment ID not provided');
          setLoading(false);
          return;
        }

        // 直接获取指定作业的详情
        const response = await api.get(`/assignments/detail/${assignmentId}`);
        const assignment = response.data;


        // 格式化作业数据以适配现有的UI组件
        const formattedAssignment = {
          id: assignment.id,
          name: assignment.name,
          dueDate: assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-GB') : 'No due date',
          description: assignment.description || 'No description provided',
          rubric: assignment.rubric || null,
          attachments: assignment.attachments || [],
          courseName: assignment.courseName || 'Unknown Course',
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt
        };

        setAssignmentData(formattedAssignment);
        
      } catch (err) {
        console.error('Failed to fetch assignment details:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError('Assignment not found');
        } else {
          setError('Failed to fetch assignment details. Please check your connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchAssignmentDetail();
    }
  }, [assignmentId]);



  // 修改作业
  const handleModify = () => {
    // TODO: 导航到修改页面或打开修改对话框
    console.log('Modify assignment:', assignmentData.id);
    // navigate(`/assignments/${assignmentData.id}/edit`);
  };

  // 删除作业
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      try {
        // TODO: 调用删除API
        // await fetch(`/api/assignments/${assignmentData.id}`, {
        //   method: 'DELETE'
        // });
        
        console.log('Delete assignment:', assignmentData.id);
        alert('Assignment deleted successfully!');
        
        // TODO: 导航回作业列表页面
        // navigate('/assignments');
        
      } catch (err) {
        console.error('Failed to delete assignment:', err);
        alert('Failed to delete assignment, please try again');
      }
    }
  };

  // 跳转到论坛
  const handleGoToForum = () => {
    const targetAssignmentId = assignmentId || assignmentData?.id || '12345'; // 使用路由参数、数据ID或默认值
    console.log('Navigate to forum, assignment ID:', targetAssignmentId);
    navigate(`/assignments/${targetAssignmentId}/forum`);
  };

  // 下载文件
  const handleDownloadFile = (file) => {
    // TODO: 实现文件下载功能
    console.log('下载文件:', file.fileName);
    // window.open(file.url, '_blank');
  };

  // 获取文件图标
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <DescriptionIcon sx={{ color: '#f40f02' }} />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon sx={{ color: '#2b579a' }} />;
      case 'html':
        return <DescriptionIcon sx={{ color: '#e34c26' }} />;
      default:
        return <AttachFileIcon sx={{ color: '#666' }} />;
    }
  };

  // 加载状态
  if (loading) {
    return (
      <Box sx={assignmentDetailStyles.container}>
        <Box sx={assignmentDetailStyles.topHeader}>
          <Typography variant="h4" sx={assignmentDetailStyles.headerTitle}>
            Assignment Detail
          </Typography>
        </Box>
        <Box sx={assignmentDetailStyles.contentArea}>
          <Typography variant="h6" sx={{ textAlign: 'center', py: 4 }}>
            Loading assignment details...
          </Typography>
        </Box>
      </Box>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Box sx={assignmentDetailStyles.container}>
        <Box sx={assignmentDetailStyles.topHeader}>
          <Typography variant="h4" sx={assignmentDetailStyles.headerTitle}>
            Assignment Detail
          </Typography>
        </Box>
        <Box sx={assignmentDetailStyles.contentArea}>
          <Typography variant="h6" sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  // 正常显示
  return (
    <Box sx={assignmentDetailStyles.container}>
      {/* 顶部蓝色区域 */}
      <Box sx={assignmentDetailStyles.topHeader}>
        <Typography variant="h4" sx={assignmentDetailStyles.headerTitle}>
          Assignment Detail
        </Typography>
      </Box>

      {/* 内容区域 */}
      <Box sx={assignmentDetailStyles.contentArea}>
        {/* 作业标题和操作按钮 */}
        <Box sx={assignmentDetailStyles.titleSection}>
          <Typography variant="h4" sx={assignmentDetailStyles.assignmentTitle}>
            {assignmentData.name}
          </Typography>
          <Box sx={assignmentDetailStyles.actionButtons}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleModify}
              sx={assignmentDetailStyles.modifyButton}
            >
              Modify
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={assignmentDetailStyles.deleteButton}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* 作业基本信息 */}
        <Box sx={assignmentDetailStyles.infoSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.infoLabel}>
            Assignment id : <span style={{ fontWeight: 400 }}>{assignmentData.id}</span>
          </Typography>
          <Typography variant="h6" sx={assignmentDetailStyles.infoLabel}>
            Due Date : <span style={{ fontWeight: 400 }}>{assignmentData.dueDate}</span>
          </Typography>
        </Box>

        {/* 作业描述 */}
        <Box sx={assignmentDetailStyles.descriptionSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Assignment Description :
          </Typography>
          <Typography variant="body1" sx={assignmentDetailStyles.descriptionText}>
            {assignmentData.description}
          </Typography>
        </Box>

        {/* 评分标准 */}
        {assignmentData.rubric && assignmentData.rubric.fileName && (
          <Box sx={assignmentDetailStyles.rubricSection}>
            <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
              Rubric:
            </Typography>
            <Chip
              label={assignmentData.rubric.fileName}
              onClick={() => handleDownloadFile(assignmentData.rubric)}
              sx={assignmentDetailStyles.fileChip}
              clickable
            />
          </Box>
        )}

        {/* 附件列表 */}
        <Box sx={assignmentDetailStyles.attachmentSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Attachment :
          </Typography>
          <List sx={assignmentDetailStyles.attachmentList}>
            {assignmentData.attachments.filter(file => file && file.fileName).map((file, index) => (
              <React.Fragment key={file.id}>
                <ListItem
                  sx={assignmentDetailStyles.attachmentItem}
                  onClick={() => handleDownloadFile(file)}
                >
                  <Box sx={assignmentDetailStyles.fileIcon}>
                    {getFileIcon(file.type)}
                  </Box>
                  <ListItemText
                    primary={file.fileName}
                    primaryTypographyProps={{
                      sx: assignmentDetailStyles.fileName
                    }}
                  />
                </ListItem>
                {index < assignmentData.attachments.length - 1 && (
                  <Divider sx={assignmentDetailStyles.fileDivider} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* 论坛按钮 */}
        <Box sx={assignmentDetailStyles.forumButtonContainer}>
          <Button
            variant="contained"
            startIcon={<ForumIcon />}
            onClick={handleGoToForum}
            sx={assignmentDetailStyles.forumButton}
          >
            Forum
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentDetail;