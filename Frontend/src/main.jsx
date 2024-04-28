import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, color, extendTheme  } from '@chakra-ui/react'
import {mode} from "@chakra-ui/theme-tools"
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from './context/SocketContext.jsx'


const styles={
  global:(props)=>({
    body:{
      color:mode('gray.800'  ,'whiteAlpha.900')(props),
      bg:mode('gray.100' ,'#101010')(props)
    }
    
  })
};
const config={
  initialColorMode: 'dark',
  useSystemColorMode:true
}
const colors={
  gray:{
    dark: "#616161",
    light:"#1e1e1e"
  }
}
const theme=extendTheme({config  ,styles , colors});
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* using chakraprovider for ui wrapping our app inside it */}
    <RecoilRoot>
    <BrowserRouter>
    <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    {/* wrapping app inside socket provider  to use socket */}
    <SocketContextProvider>
    <App />
    </SocketContextProvider>
    </ChakraProvider>
    </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
  
);
