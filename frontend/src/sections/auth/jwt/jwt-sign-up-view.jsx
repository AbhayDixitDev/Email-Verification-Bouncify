import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from '@emotion/react';
import ReCAPTCHA from 'react-google-recaptcha';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Card, Button, Divider, SvgIcon, Snackbar } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { signUp } from 'src/auth/context/jwt';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
  confirmPassword: zod
    .string()
    .min(1, { message: 'Please confirm your password!' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ----------------------------------------------------------------------

const GoogleIcon = () => (
  <SvgIcon viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </SvgIcon>
);

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();
  
  const theme = useTheme();
  const router = useRouter();

  const password = useBoolean();
  const confirmpassword = useBoolean();
  
  const [captchaValue, setCaptchaValue] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success'); // 'success' | 'error' | 'resend'
  const [userEmail, setUserEmail] = useState('');
  const [resendEmail, setResendEmail] = useState(true);

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onResendEmail = () => {
    setResendEmail(false);
    setTimeout(() => { setResendEmail(true) }, 5000);
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
    setErrorMsg(''); // Clear error when captcha is completed
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!captchaValue) {
      setErrorMsg("Please complete the CAPTCHA");
      return;
    }

    try {
      // Call the actual signup API
      await signUp({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      });

      // Store user email for display in snackbar
      setUserEmail(data.email);
      
      // Show success snackbar
      setSnackbarType('success');
      setOpenSnackbar(true);
      setErrorMsg('');

      // Optional: Check user session after signup
      // await checkUserSession?.();

      // Optional: Redirect to confirmation page after delay
      // setTimeout(() => {
      //   router.push(paths.auth.jwt.confirm);
      // }, 2000);

    } catch (error) {
      console.error('Error during sign up:', error);
      
      // Handle different error types
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message.toLowerCase();
        
        if (errorMessage.includes('already') || errorMessage.includes('exist')) {
          setSnackbarType('error');
          setErrorMsg('Your email is already registered. Please log in to your Pabbly account.');
        } else if (errorMessage.includes('verify') || errorMessage.includes('verification')) {
          setSnackbarType('resend');
          setUserEmail(data.email);
        } else {
          setErrorMsg(error.response.data.message);
        }
      } else {
        setErrorMsg(error instanceof Error ? error.message : 'An error occurred during sign up');
      }
      
      setOpenSnackbar(true);
    }
  });

  const renderHead = (
    <Stack spacing={0} mb={1}>
      <Typography variant="h5">Create Pabbly Account</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Sign up in seconds. No credit card required.
      </Typography>
      
      <Stack direction="row" sx={{ mb: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{
            backgroundColor: 'white',
            border: '1px solid #747775',
            height: '40px',
            '&:hover': {
              boxShadow: '0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15)',
              backgroundColor: '#f8f9fa',
            },
          }}
        >
          Login with Google
        </Button>
      </Stack>
      <Divider>or</Divider>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="firstName" label="First Name" />
        <Field.Text name="lastName" label="Last Name" />
      </Stack>

      <Field.Text name="email" label="Email Address" />

      <Field.Text
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirm Password"
        type={confirmpassword.value ? 'text' : 'password'}
        helperText="Use 8 or more characters for password."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmpassword.onToggle} edge="end">
                <Iconify icon={confirmpassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* reCAPTCHA */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "start", transform: 'scale(0.88)', transformOrigin: '0 0' }}>
        <ReCAPTCHA
          sitekey="6LdNrKgUAAAAALsQ3getachCJBWULQBj4q17_mgv"
          data-theme="light"
          onChange={onCaptchaChange}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Creating account..."
      >
        Create Account
      </LoadingButton>

      {/* Success Snackbar */}
      {snackbarType === 'success' && (
        <Snackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 6 }}
        >
          {resendEmail ? (
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{
                width: { xs: '100%', sm: '60%', md: '42%' },
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
                color: theme.palette.text.primary,
                textAlign: "left"
              }}
            >
              <Typography variant="body2">
                We have sent a verification email to <b>{userEmail}.</b> Please check your inbox and verify your email address.{' '}
                <Link component={RouterLink} onClick={onResendEmail}>Resend Email</Link>
              </Typography>
            </Alert>
          ) : (
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{
                width: { xs: '100%', sm: '60%', md: '42%' },
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
                color: theme.palette.text.primary,
                textAlign: "left"
              }}
            >
              <Typography variant="body2">
                <b>Email Sent!</b> We've re-sent the email! Please allow a few moments, and don't forget to check your spam or junk folder if it's missing.
              </Typography>
            </Alert>
          )}
        </Snackbar>
      )}

      {/* Error Snackbar - Email Already Exists */}
      {snackbarType === 'error' && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 6 }}
        >
          <Alert
            severity='error'
            onClose={handleCloseSnackbar}
            sx={{
              width: { xs: '100%', sm: '60%', md: '66%' },
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
              color: theme.palette.text.primary,
              textAlign: "left"
            }}
          >
            <Typography variant='body2'>
              {errorMsg || 'Your email is already registered. Please log in to your Pabbly account.'}
            </Typography>
          </Alert>
        </Snackbar>
      )}

      {/* Resend Email Snackbar - Unverified Account */}
      {snackbarType === 'resend' && (
        <Snackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 6 }}
        >
          {resendEmail ? (
            <Alert
              severity='error'
              onClose={handleCloseSnackbar}
              sx={{
                width: { xs: '100%', sm: '60%', md: '42%' },
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
                color: theme.palette.text.primary,
                textAlign: "left"
              }}
            >
              <Typography variant='body2'>
                Your email is registered but not verified. We've just sent a new verification email. Please check your inbox and verify your email to proceed.{' '}
                <Link component={RouterLink} onClick={onResendEmail}>Resend Email</Link>
              </Typography>
            </Alert>
          ) : (
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{
                width: { xs: '100%', sm: '60%', md: '42%' },
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0px 8px 16px 0px rgba(145, 158, 171, 0.16)',
                color: theme.palette.text.primary,
                textAlign: "left"
              }}
            >
              <Typography variant="body2">
                <b>Email Sent!</b> We've re-sent the email! Please allow a few moments, and don't forget to check your spam or junk folder if it's missing.
              </Typography>
            </Alert>
          )}
        </Snackbar>
      )}

      <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have a Pabbly Account?
        </Typography>
        <Link
          component={RouterLink}
          href={paths.auth.jwt.signIn}
          variant="subtitle2"
          color="primary"
          sx={{ alignSelf: 'center' }}
        >
          Login
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      <Divider sx={{ mt: 1, mb: 1 }} />
      {'By signing up, I agree to '}
      <Link color="primary" href="https://www.pabbly.com/terms-conditions/" target="_blank" rel="noopener noreferrer">
        {`Pabbly's Terms of Service`}
      </Link>
      {' and '}
      <Link color="primary" href="https://www.pabbly.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  return (
    <Card sx={{ p: 4, textAlign: "center" }}>
      {renderHead}

      {!!errorMsg && !openSnackbar && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      {renderTerms}
    </Card>
  );
}