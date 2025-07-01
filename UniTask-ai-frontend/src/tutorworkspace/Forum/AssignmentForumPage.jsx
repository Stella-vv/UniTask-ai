// test/tutorworkspace/Forum/AssignmentForumPage.jsx
import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import { forumPageStyles } from './AssignmentForumPage_style';

const AssignmentForumPage = () => {
  return (
    <Box sx={forumPageStyles.container}>
      {/* Page Title */}
      <Box sx={forumPageStyles.assignmentTitleHeader}>
        <Typography variant="h4" sx={forumPageStyles.sectionTitle}>
          Assignment 1
        </Typography>
      </Box>

      {/* Betty's Question (Mock Data) */}
      <Box sx={forumPageStyles.postContainer}>
        <Box sx={forumPageStyles.userInfo}>
          <Avatar sx={forumPageStyles.avatar}>B</Avatar>
          <Typography sx={forumPageStyles.userName}>Betty</Typography>
          <Typography sx={forumPageStyles.timestamp}>3 hours ago</Typography>
        </Box>
        <Typography sx={forumPageStyles.messageText}>
          When I finished my exercise 3 and tried to compose it, the docker failed (while my exercise is working), is there the issue with WSL? the screenshot below shows that there are something wrong when launching WSL (almost the same time as the launch of Docker).
        </Typography>
        {/* Mock Code Block as seen in image */}
        <Box sx={forumPageStyles.codeBlock}>
          <pre>
            <code>
              {`[frontend] resolving provenance for readable file
{
    "app": "frontend",
    "name": "root",
    "image": "docker-mix:defaults:frontend",
    "context": "docker-mix:defaults:frontend",
    "rootfs": "docker-mix:defaults:frontend"
}
error mapping from daemon: failed to stat parent: stat /var/lib/docker/tmp/containerd/daemon/io.containerd.snapshotter.v1.overlayfs/snapshots/10/fs: no such file or directory`}
            </code>
          </pre>
        </Box>
      </Box>

      {/* Taylor's Reply (Mock Data) */}
      <Box sx={forumPageStyles.replyCount}>
        1 reply
      </Box>
      <Box sx={forumPageStyles.postContainer}>
        <Box sx={forumPageStyles.userInfo}>
          <Avatar sx={forumPageStyles.avatar}>T</Avatar>
          <Typography sx={forumPageStyles.userName}>Taylor</Typography>
          <Typography sx={forumPageStyles.timestamp}>2 hours ago</Typography>
        </Box>
        <Typography sx={forumPageStyles.messageText}>
          I'd suggest starting by checking the exact error message shown when WSL fails to launch. That should give you a good starting point to work from and help narrow down what's causing the issue.
        </Typography>
      </Box>

      {/* Submit Reply Section */}
      <Box sx={forumPageStyles.submitReplySection}>
        <Typography variant="h6" sx={forumPageStyles.submitReplyTitle}>
          Submit Reply
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={10}
          placeholder="Type your reply here..."
          variant="outlined"
          sx={forumPageStyles.replyTextField}
        />
        <Box sx={forumPageStyles.actionButtons}>
          <Button variant="contained" sx={forumPageStyles.clearButton}>
            Clear
          </Button>
          <Button variant="contained" sx={forumPageStyles.submitButton}>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentForumPage;