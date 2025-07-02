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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Forum as ForumIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { assignmentDetailStyles } from './AssignmentDetail_style';

const AssignmentDetail = () => {
  // 从路由获取作业ID
  const { assignmentId } = useParams();
  
  // 状态管理
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 模拟数据 - 后续从API获取
  const mockAssignmentData = {
    id: 12345,
    name: 'Assignment 1',
    dueDate: '11/06/2025',
    description: 'Build a responsive web page using HTML, CSS, and JavaScript that displays a list of student profiles. The page must include a search bar, responsive layout for desktop and mobile, and use clean, semantic HTML. Submit your code and a brief user guide explaining your design choices.',
    rubric: {
      fileName: 'Assignment1_rubric.pdf',
      url: '/files/assignment1_rubric.pdf'
    },
    attachments: [
      {
        id: 1,
        fileName: 'Assignment1.pdf',
        url: '/files/assignment1.pdf',
        type: 'pdf'
      },
      {
        id: 2,
        fileName: 'Report_template.doc',
        url: '/files/report_template.doc',
        type: 'doc'
      },
      {
        id: 3,
        fileName: 'Example.html',
        url: '/files/example.html',
        type: 'html'
      }
    ],
    courseName: 'Web Front-End Programming',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-20'
  };

  // 获取作业详情数据
  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        setLoading(true);
        
        // TODO: 替换为实际的API调用
        // const response = await fetch(`/api/assignments/${assignmentId}`);
        // const data = await response.json();
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据
        setAssignmentData(mockAssignmentData);
        
      } catch (err) {
        console.error('获取作业详情失败:', err);
        setError('获取作业详情失败');
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
    console.log('修改作业:', assignmentData.id);
    // navigate(`/assignments/${assignmentData.id}/edit`);
  };

  // 删除作业
  const handleDelete = async () => {
    if (window.confirm('确定要删除这个作业吗？此操作无法撤销。')) {
      try {
        // TODO: 调用删除API
        // await fetch(`/api/assignments/${assignmentData.id}`, {
        //   method: 'DELETE'
        // });
        
        console.log('删除作业:', assignmentData.id);
        alert('作业删除成功！');
        
        // TODO: 导航回作业列表页面
        // navigate('/assignments');
        
      } catch (err) {
        console.error('删除作业失败:', err);
        alert('删除作业失败，请重试');
      }
    }
  };

  // 跳转到论坛
  const handleGoToForum = () => {
    // TODO: 导航到论坛页面
    console.log('跳转到论坛');
    // navigate(`/assignments/${assignmentData.id}/forum`);
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
            正在加载作业详情...
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
        <Box sx={assignmentDetailStyles.rubricSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Rubric :
          </Typography>
          <Chip
            label={assignmentData.rubric.fileName}
            onClick={() => handleDownloadFile(assignmentData.rubric)}
            sx={assignmentDetailStyles.fileChip}
            clickable
          />
        </Box>

        {/* 附件列表 */}
        <Box sx={assignmentDetailStyles.attachmentSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Attachment :
          </Typography>
          <List sx={assignmentDetailStyles.attachmentList}>
            {assignmentData.attachments.map((file, index) => (
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