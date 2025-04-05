import Header from './Header';
import Footer from './Footer';
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>StuHouses | Student Accommodation with Bills Included</title>
        <meta
          name="description"
          content="Find student accommodation with all bills included. Search by city or university to find your perfect student home."
        />
        <meta
          name="keywords"
          content="student accommodation, university housing, student homes, bills included, student living"
        />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
} 