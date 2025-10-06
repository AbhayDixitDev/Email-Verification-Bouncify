import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Link, TextField, Autocomplete } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';
import FileUpload from 'src/components/upload/upload';
import { uploadList, pollJobStatus, startBulkVerification } from 'src/redux/slice/listSlice';

export default function Upload({ setAlertState }) {
  const dispatch = useDispatch();
  const [listName, setListName] = useState('');
  const [listNameError, setListNameError] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('Home');

  const folders = [
    'Home (0)',
    'Magnet Brains (2)',
    'Pabbly Hook (5)',
    'Pabbly Connect (10)',
    'Pabbly Subcription Billing (0)',
    'Pabbly Admin (50)',
    'Pabbly Chatflow (2)',
    'Pabbly Form Builder (0)',
    'Pabbly Email Marketing (2)',
    'Pabbly Plus (4)',
  ];

  const handleListNameChange = (event) => {
    const { value } = event.target;
    setListName(value);

    // Remove error state if user starts typing
    if (value.trim() !== '') {
      setListNameError(false);
    } else {
      setListNameError(true);
    }
  };

  const handleFolderChange = (event, newValue) => {
    setSelectedFolder(newValue);
  };

  // Add blur handler to validate when user leaves the field
  const handleListNameBlur = () => {
    if (listName.trim() === '') {
      setListNameError(true);
    }
  };

  return (
    <Box>
      <Box>
        <TextField
          label="Email List Name"
          fullWidth
          value={listName}
          onChange={handleListNameChange}
          onBlur={handleListNameBlur}
          placeholder="Enter the name of the email list here"
          error={listNameError}
          helperText={
            <span>
              {listNameError ? (
                'Email list name is required'
              ) : (
                <>
                  Enter the name of the email list here.{' '}
                  <Link
                    href="https://forum.pabbly.com/threads/verify-email.26310/"
                    underline="always"
                    target="_blank"
                  >
                    Learn more
                  </Link>
                </>
              )}
            </span>
          }
          // required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
            mb: '24px',
          }}
        />
        <Autocomplete
          sx={{ mb: 3 }}
          options={folders}
          getOptionLabel={(option) => option}
          value={selectedFolder}
          onChange={handleFolderChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Folder"
              placeholder="Choose the folder where the email list should be uploaded"
              helperText={
                <span>
                  Choose the folder where the email list should be uploaded.{' '}
                  <Link
                    href="https://forum.pabbly.com/threads/verify-email.26310/"
                    underline="always"
                    onClick={() => console.log('Learn more clicked')}
                    target="_blank"
                  >
                    Learn more
                  </Link>
                </span>
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
            />
          )}
        />
        <FileUpload
          uploadInformation="Upload File OR Drag and Drop file here (Only CSV files allowed). Download Sample File here."
          allowedFileTypes={['text/csv']}
          fileName="sample_csv.csv"
          fileErrorMessage="Upload Error: Please ensure you upload a valid CSV file. You can download a sample file here."
          setAlertState={setAlertState}
          onFileUpload={async (file) => {
            try {
              const res = await dispatch(uploadList(file)).unwrap();
              const jobId = res?.data?.jobId;
              if (jobId) {
                // Poll until Bouncify reports 'ready', then start verification
                const waitUntilReadyAndStart = async (attemptCount = 0, maxAttempts = 30) => {
                  if (attemptCount >= maxAttempts) {
                    throw new Error('Timeout: Bouncify did not report ready status');
                  }

                  try {
                    const statusRes = await axios.get(endpoints.list.getStatus, { params: { jobId } });
                    const reportStatus = statusRes?.data?.data?.report?.status;
                    if (reportStatus === 'ready') {
                      await dispatch(startBulkVerification(jobId)).unwrap();
                      return;
                    }
                    // Wait before next attempt
                    await new Promise((r) => setTimeout(r, 4000));
                    return waitUntilReadyAndStart(attemptCount + 1, maxAttempts);
                  } catch (error) {
                    if (attemptCount < maxAttempts - 1) {
                      await new Promise((r) => setTimeout(r, 4000));
                      waitUntilReadyAndStart(attemptCount + 1, maxAttempts);
                    }
                    throw error;
                  }
                };

                waitUntilReadyAndStart()
                  .then(() => {
                    dispatch(pollJobStatus({ jobId }));
                    setAlertState({ open: true, color: 'success', title: 'Upload Success', message: 'Verification started', status: '' });
                  })
                  .catch((err2) => {
                    setAlertState({ open: true, color: 'error', title: 'Start Failed', message: err2?.message || 'Unable to start verification', status: '' });
                  });
              } else {
                setAlertState({ open: true, color: 'warning', title: 'Upload Success', message: 'File uploaded. No jobId returned to start verification.', status: '' });
              }
            } catch (err) {
              setAlertState({ open: true, color: 'error', title: 'Upload Failed', message: err?.message || 'Something went wrong', status: '' });
            }
          }}
          onSampleFileClick={() => {
            // Handle sample file download here
            // e.g., window.open('/path/to/sample.csv', '_blank');
          }}
        />
      </Box>
    </Box>
  );
}
