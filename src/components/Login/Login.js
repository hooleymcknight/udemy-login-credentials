import React, { useState, useEffect, useReducer } from 'react'

import Card from '../UI/Card/Card'
import classes from './Login.module.css'
import Button from '../UI/Button/Button'

const elementValidator = (value, target) => {
  if (target === 'email') {
    return value.includes('@')
  }
  else if (target === 'password') {
    return value.trim().length > 6
  }
}

const formElementReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: elementValidator(action.val, action.target) }
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: elementValidator(state.value, action.target) }
  }
  return { value: '', isValid: false }
}

const formElementStates = {
  value: '',
  isValid: null
}

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false)
  const [emailState, dispatchEmail] = useReducer(formElementReducer, formElementStates)
  const [passwordState, dispatchPassword] = useReducer(formElementReducer, formElementStates)

  const { isValid: emailIsValid } = emailState
  const { isValid: passwordIsValid } = passwordState

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('checking form validity')
      setFormIsValid(
        emailIsValid && passwordIsValid
      )
    }, 500)

    return () => {
      console.log('cleanup')
      clearTimeout(identifier)
    }
  }, [emailIsValid, passwordIsValid])

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value, target: event.target.id })
  }

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value, target: event.target.id })
  }

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR', target: 'email' })
  }

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR', target: 'password' })
  }

  const submitHandler = (event) => {
    event.preventDefault()
    props.onLogin(emailState.value, passwordState.value)
  }

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default Login
