import React, { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { useAuth0 } from '../auth'
import { PleaseLogin } from '.'

export const PrivateRoute = ({ component: Component, redirectComponent: Redirect, path, ...rest }) => {
  const [authenticating, setAuthenticating] = useState(false)
  const { isAuthenticated, loginWithPopup, loading } = useAuth0()

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated && !loading && !authenticating) {
        setAuthenticating(true)
        await loginWithPopup({})
        setAuthenticating(false)
      }
    }
    fn()
  }, [isAuthenticated, loginWithPopup, path])

  const render = isAuthenticated
    ? props => <Component {...props} />
    : props => Redirect
      ? <Redirect {...props} />
      : <PleaseLogin authenticating={authenticating} {...props} />

  return <Route path={path} render={render} {...rest} />
}
