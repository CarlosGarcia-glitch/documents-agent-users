import { useEffect, useState } from 'react';

import {
  Add,
  Language,
  Logout,
  MailOutline,
  PersonOutline,
} from '@mui/icons-material';
import { Button } from '@mui/material';

import CreateNewUser from '@/components/CreateNewUser/CreateNewUser';
import {
  useAlert,
  useAppContext,
  useTranslations,
} from '@/contexts/AppContext';
import AuthService from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import Styles from './_Dashboard.module.scss';

function Dashboard() {
  const t = useTranslations();
  const { setAlert } = useAlert();
  const navigate = useNavigate();

  const { language, setLanguage, setUser, user } = useAppContext();
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const userName = user?.username
    ?.replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await AuthService.getUsers();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setAlert(true, 'error', t.dashboard.error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      navigate('/');
    }
  };

  return (
    <>
      <div className={Styles.container}>
        <header className={Styles.header}>
          <div className={Styles.header_title}>
            <h1>{userName ?? t.dashboard.header.title}</h1>
            <p>{t.dashboard.header.subtitle}</p>
          </div>
          <Button
            onClick={toggleLanguage}
            variant="outlined"
            size="small"
            startIcon={<Language />}
          >
            {t.dashboard.header.language}
          </Button>
          <Button onClick={handleLogout} variant="outlined" size="small">
            <Logout />
          </Button>
          <Button
            className={Styles.header_button}
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            {t.dashboard.header.new_user}
          </Button>
        </header>
        <section className={Styles.content}>
          <span className={Styles.content_title}>
            {t.dashboard.content.title}
          </span>

          {users?.map(({ name, email, id, role }) => {
            return (
              <article key={id} className={Styles.content_card}>
                <p className={Styles.content_card__name}>
                  <PersonOutline fontSize="small" />
                  {name}
                </p>
                <p className={Styles.content_card_email}>
                  <MailOutline fontSize="small" /> {email}
                </p>
                <span className={Styles.content_card__pill}>{role}</span>
              </article>
            );
          })}
          {users?.length === 0 && (
            <article className={Styles.content_card}>
              <p className={Styles.content_card__name}>
                {t.dashboard.content.no_users}
              </p>
            </article>
          )}
        </section>
      </div>
      <CreateNewUser
        onCloseDialog={() => setIsDialogOpen(false)}
        isDialogOpen={isDialogOpen}
        loading={loading}
        setLoading={(value) => setLoading(value)}
      />
    </>
  );
}

export default Dashboard;
