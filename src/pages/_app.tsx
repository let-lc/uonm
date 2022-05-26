import { AppProps } from 'next/app';
import Script from 'next/script';
import '@/styles/global.css';
import 'tailwindcss/tailwind.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {process.env.NODE_ENV !== 'development' && (
        <Script id="disabled-context-menu">
          {`
          document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
          });
        `}
        </Script>
      )}
      <Component {...pageProps} />
    </>
  );
}

export default App;
