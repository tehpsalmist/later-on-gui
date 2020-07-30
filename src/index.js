import React from 'react'
import { render } from 'react-dom'
import { Auth0Provider } from './auth'
import { BrowserRouter } from 'react-router-dom'
import { App, SWRWrapper } from './components'
import { ToastContainer } from 'react-toastify'

render(
  <BrowserRouter>
    <Auth0Provider
      domain='later-on.auth0.com'
      client_id='VtW6vc8SVc6StPpVBlQIZ9XAjqCwhXnp'
      redirect_uri={window.location.origin}
      scope='openid profile email'
      audience='https://later-on.com/api'
    >
      <SWRWrapper>
        <App />
        <ToastContainer
          position='top-right'
          autoClose={3500}
          pauseOnFocusLoss
          newestOnTop
          closeOnClick
          pauseOnHover />
      </SWRWrapper>
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById('app')
)
