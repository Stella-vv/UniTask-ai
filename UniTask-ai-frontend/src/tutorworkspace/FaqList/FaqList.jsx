import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { faqListStyles } from './FaqList_style';

const FaqList = () => {
  const navigate = useNavigate();
  // 模拟数据
  const [faqData] = useState([
    {
      id: 1,
      courseName: 'Web Front-End Programming',
      faqs: [
        {
          id: 101,
          question: 'What is the late submission policy for frontend assignments?',
          answer: 'Late submissions will incur a 10% penalty per day. Submissions more than 7 days late will not be accepted unless there are exceptional circumstances with proper documentation.'
        },
        {
          id: 102,
          question: 'What should I do if I experience technical issues (e.g., internet outage, computer crash) during an assignment?',
          answer: 'Contact the course coordinator immediately with documentation of the technical issue. We may provide extensions or alternative arrangements depending on the circumstances and timing.'
        },
        {
          id: 103,
          question: 'Can I use external CSS frameworks like Bootstrap in my assignments?',
          answer: 'Unless specifically prohibited in the assignment requirements, you may use external frameworks. However, ensure you understand the underlying CSS concepts as exams will test fundamental knowledge.'
        }
      ]
    },
  ]);

  const [expandedCourse, setExpandedCourse] = useState('Web Front-End Programming');

  const handleCourseExpand = (courseName) => {
    setExpandedCourse(expandedCourse === courseName ? '' : courseName);
  };

  const handleEditFaq = (faqId) => {
    console.log('Edit FAQ:', faqId);
    // TODO: 实现编辑功能
  };

  const handleDeleteFaq = (faqId) => {
    console.log('Delete FAQ:', faqId);
    // TODO: 实现删除功能
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      // 删除逻辑
    }
  };

  const handleUpload = () => {
    console.log('Upload FAQ');
    navigate('/faq-upload');
  };

  return (
    <Box sx={faqListStyles.container}>
      {/* 顶部蓝色区域 */}
      <Box sx={faqListStyles.topHeader}>
        <HelpOutlineIcon sx={faqListStyles.headerIcon} />
        <Typography variant="h4" sx={faqListStyles.headerTitle}>
          FAQs
        </Typography>
      </Box>

      {/* 内容区域 */}
      <Box sx={faqListStyles.contentArea}>
        {/* FAQ 列表 */}
        <Box sx={faqListStyles.faqContainer}>
          {faqData.map((course) => (
            <Accordion
              key={course.id}
              expanded={expandedCourse === course.courseName}
              onChange={() => handleCourseExpand(course.courseName)}
              sx={faqListStyles.courseAccordion}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={faqListStyles.expandIcon} />}
                sx={faqListStyles.courseAccordionSummary}
              >
                <Typography variant="h6" sx={faqListStyles.courseName}>
                  • {course.courseName}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={faqListStyles.courseAccordionDetails}>
                <List sx={faqListStyles.faqList}>
                  {course.faqs.map((faq, index) => (
                    <React.Fragment key={faq.id}>
                      <ListItem sx={faqListStyles.faqItem}>
                        <Box sx={faqListStyles.faqContent}>
                          <ListItemText
                            primary={faq.question}
                            secondary={faq.answer}
                            primaryTypographyProps={{
                              sx: faqListStyles.questionText
                            }}
                            secondaryTypographyProps={{
                              sx: faqListStyles.answerText
                            }}
                          />
                          <Box sx={faqListStyles.faqActions}>
                            <IconButton
                              onClick={() => handleEditFaq(faq.id)}
                              sx={faqListStyles.actionButton}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteFaq(faq.id)}
                              sx={faqListStyles.actionButton}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </ListItem>
                      {index < course.faqs.length - 1 && (
                        <Divider sx={faqListStyles.faqDivider} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* 上传按钮 */}
        <Box sx={faqListStyles.uploadButtonContainer}>
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={faqListStyles.uploadButton}
          >
            Upload
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FaqList;