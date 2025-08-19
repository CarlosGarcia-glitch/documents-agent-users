import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from '@mui/material';
import { FormikValues, useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Footer from '@/components/Footer/Footer';
import { getLoginFormSchema } from '@/utils/schemas/FormSchemas';

import ChatbotIcon from '@/components/icons/ChatbotIcon';
import { useAlert, useAppContext, useTranslations } from '@/contexts/AppContext';
import AuthService from '@/services/authService';
import Styles from './_Login.module.scss';

type Props = {};

const Login = (props: Props) => {
  const t = useTranslations();
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const { setAlert } = useAlert();

  const [loading, setLoading] = useState<boolean>();
  const [showPassword, setShowPassword] = useState<boolean>();

  const schema = getLoginFormSchema(t);

  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: { email: '', password: '' },
      enableReinitialize: true,
      validationSchema: schema,
      onSubmit: async (vals: FormikValues) => {
        setLoading(true);
        try {
          const resp = await AuthService.login(vals.email, vals.password);
          console.log('resp', resp);
          setUser(resp?.user_info);
          localStorage.setItem('token', resp?.access_token);
          setAlert(true, 'success', t.login.alerts.success.login);
          navigate('/dashboard');
        } catch (error) {
          console.error(error);
          setAlert(true, 'error', t.login.alerts.error.login);
          setLoading(false);
        }
      },
    });

  return (
    <div className={Styles.page__layout}>
      <div className={Styles.page__content}>
        <div className={Styles.login__card}>
          <div className={Styles.login__card_img}>
            <ChatbotIcon />
          </div>
          <div className={Styles.login__card_body}>
            <div className={Styles.login__card_title}>
              <h3>{t.login.labels.title}</h3>
            </div>
            <InputLabel htmlFor="email">{t.login.labels.email}</InputLabel>
            <TextField
              id="email"
              name="email"
              placeholder="example@isol.com"
              value={values.email}
              error={touched?.email && Boolean(errors.email)}
              helperText={
                touched.email && typeof errors.email === 'string'
                  ? errors.email
                  : undefined
              }
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <InputLabel htmlFor="password">
              {t.login.labels.password}
            </InputLabel>
            <TextField
              data-testid="password-input"
              id="password"
              name="password"
              placeholder={t.login.labels.password}
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              error={touched?.password && Boolean(errors.password)}
              helperText={
                touched.password && typeof errors.password === 'string'
                  ? errors.password
                  : undefined
              }
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <div className={Styles.login__card_footer}>
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              startIcon={
                loading ? (
                  <CircularProgress
                    size="1.5rem"
                    style={{ color: '#C0C0C0' }}
                  />
                ) : undefined
              }
              onClick={() => handleSubmit()}
            >
              {loading ? t.login.labels.signingIn : t.login.labels.signIn}
            </Button>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Login;
