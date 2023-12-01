import React, { createContext, useEffect, useReducer, dispatch } from 'react'
import jwtDecode from 'jwt-decode'
import axios from 'axios.js'
import { MatxLoading } from 'app/components'

// acá se configura el estado inicial del contexto

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user_details: null,
    token: null,
}
  
const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated , user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'SET_TOKEN': {
            const { payload: token } = action;
          
            return {
              ...state,
              token,
            };
        }
        case 'SET_USER_DETAILS': {
            const { payload: userDetails } = action;
            
            return {
                ...state,
                user_details: userDetails,
            };
        }          
        default: {
            return { ...state }
        }
    }
}

// acá se configuran los atributos del contexto

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    setToken: (token) => {
        dispatch({
            type: 'SET_TOKEN',
            payload: token,
          });
    },
    setUserDetails: (userDetails) => {
        dispatch({
          type: 'SET_USER_DETAILS',
          payload: userDetails,
        });
    },

    // login: () => Promise.resolve(),
    // logout: () => { },
    // register: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

   const setToken = (token) => {
        dispatch({
            type: 'SET_TOKEN',
            payload: token,
          });
    }

    const setUserDetails = (userDetails) => {
        dispatch({
          type: 'SET_USER_DETAILS',
          payload: userDetails,
        });
    }

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', {
            email,
            password,
        })
        const { accessToken, user } = response.data

        setSession(accessToken)

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })
    }

    const register = async (email, username, password) => {
        const response = await axios.post('/api/auth/register', {
            email,
            username,
            password,
        })

        const { accessToken, user } = response.data

        setSession(accessToken)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const logout = () => {
        setSession(null)
        dispatch({ type: 'LOGOUT' })
    }

    useEffect(() => {
        ; (async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken')

                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken)
                    const response = await axios.get('/api/auth/profile')
                    const { user } = response.data

                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                setToken,
                setUserDetails,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
