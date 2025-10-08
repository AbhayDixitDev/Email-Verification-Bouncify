import { toast } from 'sonner';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Link, TextField, Autocomplete } from '@mui/material';

// eslint-disable-next-line import/no-unresolved
import { uploadList } from 'src/redux/slice/listSlice';

// eslint-disable-next-line import/no-unresolved
import FileUpload from 'src/components/upload/upload';

export default function Upload({ setAlertState, onUpload }) {
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
          onFileUpload={async (file) => {
            const toastId = toast.loading('Uploading file...');
            try {
              await dispatch(uploadList(file)).unwrap();
              toast.success('File uploaded successfully!', { id: toastId });
              onUpload();
            } catch (err) {
              await dispatch(uploadList(file)).unwrap();
              toast.error(err?.message || 'Failed to upload file', { id: toastId });
            }
          }}
          onSampleFileClick={() => {
            // Handle sample file download here
            // e.g., window.open('/path/to/sample.csv', '_blank');
          }}
        />
      </Box>
    </Box>
  )
}
