import React from 'react'
import { Provider } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import store from 'redux/store'
import Routes from 'routes'

export default () => (
  <Provider store={store}>
    <Routes />
    <ToastContainer
      autoClose={2000}
      position={toast.POSITION.TOP_RIGHT}
      hideProgressBar
    />
  </Provider>
)
