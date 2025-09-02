import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header1 from '../components/mvpblocks/header-1'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Header1/>
    </>
  )
}

export default App
