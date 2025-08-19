import { Box, CircularProgress } from "@mui/material"

import Styles from './_LoadingPage.module.scss'

const LoadingPage = () => {
   return (
      <Box className={Styles.loading_page}>
         <CircularProgress color="primary" sx={{ fontSize: '5rem' }} />
      </Box>
   )
}

export default LoadingPage