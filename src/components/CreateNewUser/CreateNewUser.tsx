import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { FormikValues, useFormik } from 'formik';

import { useAlert, useTranslations } from '@/contexts/AppContext';
import AuthService from '@/services/authService';
import { createNewUserSchema } from '@/utils/schemas/FormSchemas';

const CreateNewUser = ({
  onCloseDialog,
  isDialogOpen,
  loading,
  setLoading,
}: {
  onCloseDialog: () => void;
  isDialogOpen: boolean;
  loading: boolean;
  setLoading: (arg0: boolean) => void;
}) => {
  const t = useTranslations();
  const { setAlert } = useAlert();

  const schema = createNewUserSchema(t);

  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: { name: '', email: '', role: '' },
      enableReinitialize: true,
      validationSchema: schema,
      onSubmit: async (formValues: FormikValues) => {
        setLoading(true);
        try {
          await AuthService.register({
            username: formValues.name
              .toLowerCase()
              .replace(/ /g, '_')
              .replace(/[^a-zA-Z0-9_]/g, ''),
            email: formValues.email,
            role: formValues.role,
          });
          setAlert(true, 'success', t.create_new_user.success);
        } catch (error) {
          console.error(error);
          setAlert(true, 'error', t.create_new_user.error);
          setLoading(false);
        }
      },
    });

  return (
    <Dialog onClose={onCloseDialog} open={isDialogOpen}>
      <DialogTitle>{t.create_new_user.title}</DialogTitle>
      <DialogContent>
        <TextField
          value={values.name}
          required
          id="name"
          name="name"
          label={t.create_new_user.name.label}
          type="text"
          fullWidth
          variant="standard"
          error={touched?.name && Boolean(errors.name)}
          helperText={
            touched.name && typeof errors.name === 'string'
              ? errors.name
              : undefined
          }
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={loading}
        />
        <TextField
          value={values.email}
          required
          id="email"
          name="email"
          label={t.create_new_user.email.label}
          type="email"
          fullWidth
          variant="standard"
          error={touched?.email && Boolean(errors.email)}
          helperText={
            touched.email && typeof errors.email === 'string'
              ? errors.email
              : undefined
          }
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={loading}
        />
        <FormControl
          variant="standard"
          required
          error={Boolean(errors.role)}
          disabled={loading}
        >
          <InputLabel id="role-label">{t.create_new_user.role.label}</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            value={values.role}
            label={t.create_new_user.role.label}
            onChange={handleChange}
            onSelect={handleChange}
          >
            <MenuItem value="USER">{t.create_new_user.role.user}</MenuItem>
            <MenuItem value="ADMIN">{t.create_new_user.role.admin}</MenuItem>
          </Select>
          {Boolean(errors.role) && (
            <FormHelperText>{errors.role as React.ReactNode}</FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" size="small" onClick={onCloseDialog}>
          {t.create_new_user.cancel}
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="small"
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          {loading ? t.create_new_user.loading : t.create_new_user.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewUser;
