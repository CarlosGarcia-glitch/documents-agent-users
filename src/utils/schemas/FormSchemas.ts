import * as Yup from 'yup';

export const getLoginFormSchema = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t.login.email.invalid)
      .required(t.login.email.required),
    password: Yup.string().required(t.login.password.required),
  });

export const createNewUserSchema = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t.create_new_user.email.invalid)
      .required(t.create_new_user.email.required),
    name: Yup.string().required(t.create_new_user.name.required),
    role: Yup.string().required(t.create_new_user.role.required),
  });
