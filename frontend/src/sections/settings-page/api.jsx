import { toast } from 'sonner';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { Helmet } from 'react-helmet-async';

import {
  Box,
  Card,
  Button,
  Divider,
  Tooltip,
  TextField,
  CardHeader,
  Typography,
  IconButton,
  CardContent,
  InputAdornment,
} from '@mui/material';

import { CONFIG } from 'src/config-global';
import { listItems } from 'src/_mock/app-big-card/api';

import { Iconify } from 'src/components/iconify';
import BigCard from 'src/components/app-big-card/big-card';
import { ConfirmDialog } from 'src/components/confirm-dialog';

// ----------------------------------------------------------------------

const metadata = { title: `API | ${CONFIG.site.name}` };

export default function API() {
  const theme = useTheme();


  // Dialog and Snackbar states
  const [dialogOpen, setDialogOpen] = useState(false);
 

  // Form values state
  const [apivalues, setapiValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const [secretvalues, setsecretValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const { items, style } = listItems;

  // Handlers for form inputs


  // Copy handlers
  const handleCopy = (type) => {
    if (type === 'api') {
      navigator.clipboard.writeText(apivalues.password);

      toast.success(`API key copied to clipboard!`, {
        style: {
          marginTop: '15px',
        },
      });
    } else {
      navigator.clipboard.writeText(secretvalues.password);
      //
      toast.success(`Secret key copied to clipboard!`, {
        style: {
          marginTop: '15px',
        },
      });
    }
  };

  // Dialog handlers
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Snackbar handlers

  // Generate token handler
  const handleGenerateToken = () => {
    handleDialogClose();
    // Add your token generation logic here

    toast.success(`API key Generated Successfully!`, {
      style: {
        marginTop: '15px',
      },
    });
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <Box width="100%">
        <BigCard
          tooltip="View file upload guidelines for email verification."
          getHelp={false}
          isVideo
          bigcardtitle="Points To Remember"
          // bigcardsubtitle="Please adhere to the following guidelines when uploading your CSV file:"
          style={style}
          items={items}
          videoLink="https://www.youtube.com/embed/MIcaDmC_ngM?si=EJ1SGtn0tdF96b1y"
          thumbnailName="email-verication-video-thumbnail.jpg"
          keyword="Note:"
          learnMoreLink="https://forum.pabbly.com/threads/api.26313/"
          bigcardNote="All data and reports older than 15 days will be permanently removed automatically. For reference, you can Download Sample File to guide you in formatting your data correctly."
        />
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardHeader
          sx={{
            pt: 3,
            px: 3,
            pb: 2,
          }}
          title={
            <Box display="inline-block">
              <Tooltip title="Easily verify a single email address here." arrow placement="top">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  API
                </Typography>
              </Tooltip>
            </Box>
          }
          // subheader="Check Pabbly Email Verification Api"
        />
        <Divider />
        <CardContent>
          <Box>
            {/* <Typography fontSize={14} fontWeight={600} mb="8px" ml="13px">
              API Key
            </Typography> */}
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              label="API Key"
              value="●●●●●●●●●●●●●●●●●●"
              helperText={
                <>
                  Use the &apos;Copy&apos; button to securely copy it. Keep it private and
                  don&apos;t share with others.{' '}
                  <a
                    href="https://forum.pabbly.com/threads/api.26313/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#078DEE', textDecoration: 'underline' }}
                  >
                    Learn more
                  </a>
                </>
              }
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Copy API Key" placement="top" arrow>
                      <IconButton onClick={() => handleCopy('api')} edge="end">
                        <Iconify icon="solar:copy-bold" width={18} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            {/* <Typography fontSize={14} fontWeight={600} mb="8px" ml="13px">
              Secret Key
            </Typography> */}
            <TextField
              fullWidth
              variant="outlined"
              label="Secret Key"
              type="text"
              value="●●●●●●●●●●●●●●●●●●"
              helperText={
                <>
                  Use the &apos;Copy&apos; button to securely copy it. Keep it private and
                  don&apos;t share with others.{' '}
                  <a
                    href="https://forum.pabbly.com/threads/api.26313/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#078DEE', textDecoration: 'underline' }}
                  >
                    Learn more
                  </a>
                </>
              }
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Copy Secret Key" placement="top" arrow>
                      <IconButton onClick={() => handleCopy('secret')} edge="end">
                        <Iconify icon="solar:copy-bold" width={18} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: '24px' }}
            onClick={handleDialogOpen}
          >
            Generate API Keys
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Generate API Keys"
        content="Generating new API keys will invalidate your current API keys. Do you want to continue?"
        action={
          <Button variant="contained" color="primary" onClick={handleGenerateToken}>
            Generate API Keys
          </Button>
        }
      />

      {/* Alerts and Snackbars */}
    </>
  );
}
