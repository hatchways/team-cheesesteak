import React, { Component, useContext } from 'react';
import {Route, Redirect} from 'react-router-dom';
import UserContext from '../context/User';
import TopBar from './TopBar';
const ProtectedRoute = ({ component: Component, ...rest}) => {
    const {loggedIn} = useContext(UserContext)
    return (
        <Route {...rest} render={
            props => {
                if(loggedIn){
                    return(
                        <div>
                        <TopBar/>
                        <Component {...rest} {...props}/>
                        </div>
                        )
                } else {
                    return <Redirect to={
                        {
                            pathname: "/signin",
                            state: {
                                from: props.location
                            }
                        }
                    }/>
                }
            }
        }/>
    )
}

export default ProtectedRoute;