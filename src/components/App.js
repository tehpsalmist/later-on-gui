import React from 'react'
import { BrowserRouter as Router, NavLink, Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { useAuth0 } from '../auth'
import { PrivateRoute, Docs, Profile, Home, Dashboard, Footer } from '.'

const navlinkClasses = {
  className: 'flex-center px-3 hover:bg-green-400 focus:bg-green-500 focus:text-white cursor-pointer',
  activeClassName: 'bg-green-400'
}

export const App = props => {
  const { isAuthenticated, authToken, loading, loginWithPopup, logout, getRefreshToken } = useAuth0()

  return <div className='grid app-grid h-screen w-full'>
    <Router>
      <nav className='sticky top-0 navbar bg-green-300 text-gray-700 flex items-stretch flex-no-wrap overflow-x-scroll'>
        <NavLink to='/' exact {...navlinkClasses}>Home</NavLink>
        <NavLink to='/docs' {...navlinkClasses}>Docs</NavLink>
        <NavLink to='/dashboard' {...navlinkClasses}>Dashboard</NavLink>
        {isAuthenticated && <NavLink to='/profile' {...navlinkClasses}>Profile</NavLink>}
        {!isAuthenticated && !loading && <a
          className={navlinkClasses.className}
          onClick={e => loginWithPopup()}
        >
          Login
        </a>}
        {loading && <span className='text-gray-700 px-3 flex-center'>
          Logging In...
        </span>}
        {isAuthenticated && <a
          className={navlinkClasses.className}
          onClick={e => logout({ returnTo: window.location.origin })}
        >
          Logout
        </a>}
      </nav>
      <Switch>
        <Route path='/docs' component={withRouter(Docs)} />
        <Redirect from='/documentation' to='/docs' />
        <PrivateRoute path='/profile' component={withRouter(Profile)} />
        <Redirect from='/account' to='/profile' />
        <PrivateRoute path='/dashboard' component={withRouter(Dashboard)} />
        <Route exact path='/' component={withRouter(Home)} />
        <Redirect to='/' />
      </Switch>
    </Router>
    <Footer />
  </div>
}