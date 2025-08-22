import { useEffect, useState } from 'react';

import {
  Add,
  Home,
  Language,
  Logout,
  MailOutline,
  Menu as MenuIcon,
  PersonOutline,
} from '@mui/icons-material';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
} from '@mui/material';

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
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
        const { users, total } = await AuthService.getUsers(page - 1);
        setUsers(users);
        setTotalPages(() => Math.ceil(total / 10));
      } catch (error) {
        console.error('Error fetching users:', error);
        setAlert(true, 'error', t.dashboard.error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [page]);

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

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={Styles.container}>
        <header className={Styles.header}>
          <div className={Styles.header_title}>
            <div>
              <h1>{userName ?? t.dashboard.header.title}</h1>
              <p>{t.dashboard.header.subtitle}</p>
            </div>
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <MenuIcon />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                  list: {
                    'aria-labelledby': 'basic-button',
                  },
                }}
              >
                <MenuItem onClick={toggleLanguage}>
                  <ListItemIcon>
                    <Language fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t.dashboard.header.language}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t.dashboard.header.logout}</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          </div>
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

          {users?.map(
            ({
              username,
              email,
              id,
              role,
            }: {
              username: string;
              email: string;
              id: number;
              role: string;
            }) => {
              return (
                <article key={id} className={Styles.content_card}>
                  <p className={Styles.content_card__name}>
                    <PersonOutline fontSize="small" />
                    {username
                      .replace(/_/g, ' ')
                      .split(' ')
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(' ')}
                  </p>
                  <p className={Styles.content_card_email}>
                    <MailOutline fontSize="small" /> {email}
                  </p>
                  <span className={Styles.content_card__pill}>{role}</span>
                </article>
              );
            },
          )}
          {users?.length === 0 && (
            <article className={Styles.content_card}>
              <p className={Styles.content_card__name}>
                {t.dashboard.content.no_users}
              </p>
            </article>
          )}
        </section>
        <footer className={Styles.footer}>
          <Pagination count={totalPages} page={page} onChange={handleChange} />
        </footer>
      </div>
      <CreateNewUser
        onCloseDialog={() => setIsDialogOpen(false)}
        isDialogOpen={isDialogOpen}
        loading={loading}
        setLoading={(value) => setLoading(value)}
        setPage={() => setPage(1)}
      />
    </>
  );
}

export default Dashboard;
