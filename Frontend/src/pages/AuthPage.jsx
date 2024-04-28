import React from 'react'
import SignupCard from '../components/SignupCard'
import LoginCard from '../components/Login'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../atoms/authAtom'

const AuthPage = () => {
    // using recoil to get  state and to render component on the basis of it
    const authScreenState= useRecoilValue(authScreenAtom);
    console.log(authScreenState);
  return (
    <div>
     {authScreenState=="login"? <LoginCard/> :<SignupCard/>}
    </div>
  )
}

export default AuthPage