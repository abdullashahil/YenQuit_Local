import type { AppProps } from 'next/app'
import { useState } from 'react'
import { AppProvider } from '../src/context/AppContext'
import { Sidebar } from '../src/components/layouts/Sidebar'
import '../src/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  return (
    <AppProvider>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        <Component {...pageProps} />
      </div>
    </AppProvider>
  )
}
