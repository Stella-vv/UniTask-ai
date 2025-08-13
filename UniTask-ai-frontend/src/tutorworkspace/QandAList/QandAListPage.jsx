import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Chip,
  IconButton,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import api from '../../api';
import { qandaListPageStyles as styles } from './QandAListPage_style';


const QandAListPage = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  const [qaList, setQAList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignmentName, setAssignmentName] = useState('');

  const fetchQAList = useCallback(async () => {
    if (!assignmentId) {
      setError("Assignment ID is not provided.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const assignmentRes = await api.get(`/assignments/detail/${assignmentId}`);
      setAssignmentName(assignmentRes.data.name);
      const response = await api.get(`/qa/assignment/${assignmentId}/uploads`);
      setQAList(response.data);
    } catch (err) {
      console.error('Failed to fetch QA list:', err);
      setError('Failed to load Q&A list for this assignment.');
      setQAList([]);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchQAList();
  }, [fetchQAList]);

  const handleGoBack = () => {
    navigate(`/tutor/assignment/${assignmentId}`);
  };

  const handleUploadClick = () => {
    navigate(`/tutor/assignment/${assignmentId}/qnas/upload`);
  };

  const handleDownloadFile = (qa) => {
    const downloadUrl = `${api.defaults.baseURL}/uploads/qas/${qa.filename}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', qa.filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleDeleteFile = async (qaIdToDelete) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
        try {
            await api.delete(`/qa/delete/${qaIdToDelete}`);
            
            setQAList(prevList => prevList.filter(qa => qa.id !== qaIdToDelete));

            alert('File deleted successfully!');

        } catch (err) {
            console.error('Failed to delete file:', err);
            setError('Failed to delete the file. Please try again.');
        }
    }
  };

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('pdf')) return <DescriptionIcon sx={{ color: '#f40f02' }} />;
    return <AttachFileIcon sx={{ color: '#666' }} />;
  };

  const formatUploadTime = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleString();
  };

  if (loading && !assignmentName) {
    return (
        <Box sx={styles.container}>
            <Box sx={styles.topHeader}>
                <Typography variant="h4" sx={styles.headerTitle}>
                    Q&As
                </Typography>
            </Box>
            <Box sx={{...styles.contentArea, justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress />
            </Box>
        </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.topHeader}>
        <Typography variant="h4" sx={styles.headerTitle}>
          Q&As for {assignmentName || `Assignment ${assignmentId}`}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={styles.backButton}
        >
          Back
        </Button>
      </Box>        
      <Box sx={styles.contentArea}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={styles.controlSection}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleUploadClick}
            sx={styles.uploadButton}
          >
            Upload Q&A
          </Button>
        </Box>

        {loading ? (
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Loading Q&As...</Typography>
            </Box>
        ) : qaList.length === 0 ? (
            <Box sx={styles.emptyState}>
              <DescriptionIcon sx={styles.emptyIcon} />
              <Typography variant="h6" sx={{ mb: 1 }}>No Q&As Found</Typography>
              <Typography variant="body2">No Q&As have been uploaded for this assignment yet.</Typography>
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
            <Box sx={styles.qaList}>
              <List sx={{ p: 0 }}>
                {qaList.map((qa, index) => (
                  <React.Fragment key={qa.id}>
                    <ListItem sx={styles.qaItem}>
                      <Box sx={styles.fileIcon}>{getFileIcon(qa.filetype)}</Box>
                      <Box sx={styles.qaInfo}>
                        <Typography sx={styles.fileName}>{qa.filename}</Typography>
                        <Typography sx={styles.fileDetails}>Uploaded: {formatUploadTime(qa.created_at)}</Typography>
                      </Box>
                      <IconButton onClick={() => handleDownloadFile(qa)} sx={{ ml: 1 }}><DownloadIcon /></IconButton>
                      <IconButton 
                        onClick={() => handleDeleteFile(qa.id)} 
                        sx={{ 
                            ml: 1, 
                            '&:hover': {
                                color: 'error.main', 
                            },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                    {index < qaList.length - 1 && <Divider sx={{ mx: 3 }} />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
        )}
        
      </Box>
    </Box>
  );
};

export default QandAListPage;