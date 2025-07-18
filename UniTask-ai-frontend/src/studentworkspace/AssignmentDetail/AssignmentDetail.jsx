// src/studentworkspace/AssignmentDetail/AssignmentDetail.jsx (Static Version for Student)

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
import { Forum as ForumIcon, Description as DescriptionIcon, AttachFile as AttachFileIcon, ArrowBack as ArrowBackIcon} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { assignmentDetailStyles } from './AssignmentDetail_style.js'; 

// Renamed for clarity to avoid confusion with the tutor's component
const StudentAssignmentDetail = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
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

    // 如果没有数据
  if (!assignmentData) {
    return (
      <Box sx={assignmentDetailStyles.container}>
        <Box sx={assignmentDetailStyles.topHeader}>
          <Typography variant="h4" sx={assignmentDetailStyles.headerTitle}>
            Assignment Detail
          </Typography>
        </Box>
        <Box sx={assignmentDetailStyles.contentArea}>
          <Typography variant="h6" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            No assignment data available
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleGoToForum = () => {
    const targetAssignmentId = assignmentId || assignmentData?.id;
    console.log('Navigate to forum, assignment ID:', targetAssignmentId);
    navigate(`/assignments/${targetAssignmentId}/forum`);
  };

  return (
    <Box sx={assignmentDetailStyles.container}>
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
          {/* <Box sx={assignmentDetailStyles.actionButtons}>
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
          </Box> */}
        </Box>

        <Box sx={assignmentDetailStyles.infoSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.infoLabel}>
            Due Date : <span style={{ fontWeight: 400 }}>{assignmentData.dueDate}</span>
          </Typography>
        </Box>

        <Box sx={assignmentDetailStyles.descriptionSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Assignment Description:
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

        <Box sx={assignmentDetailStyles.attachmentSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Attachment:
          </Typography>
          <List sx={assignmentDetailStyles.attachmentList}>
            {assignmentData.attachments.filter(file => file && file.fileName).map((file, index) => (
              <React.Fragment key={file.id}>
                <ListItem button>
                  <Box sx={assignmentDetailStyles.fileIcon}>{getFileIcon(file.type)}</Box>
                  <ListItemText primary={file.fileName} />
                </ListItem>
                {index < assignmentData.attachments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

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

export default StudentAssignmentDetail;