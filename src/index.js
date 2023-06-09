import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/AppContainer'
import * as serviceWorker from './serviceWorker'
import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import Themes from './themes'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css';

const MAX_SNACK = 3
const TOAST_DURATION = 5000

ReactDOM.render(
  <ThemeProvider theme={Themes.default}>
    <SnackbarProvider
      autoHideDuration={TOAST_DURATION}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      maxSnack={MAX_SNACK}
      hideIconVariant
    >
      <App />
    </SnackbarProvider>
  </ThemeProvider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
