import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#36B37E',
            },
          },
          error: {
            style: {
              background: '#FF5630',
            },
          },
        }}
      />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp; 