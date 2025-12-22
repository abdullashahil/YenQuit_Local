import type { AppProps } from 'next/app'
import { AppProvider } from '../src/context/AppContext'
import '../src/styles/globals.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { NotificationProvider } from '../src/contexts/NotificationContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </AppProvider>
  )
}
