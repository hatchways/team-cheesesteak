import React, { useState } from 'react'

const AuthContext = React.createContext({
	user: null,
	setUser: () => { }
})

export const AuthProvider = AuthContext.Provider
export const AuthConsumer = AuthContext.Consumer

export default AuthContext