import React from 'react';
import Head from 'next/head';

const SEO = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  jsonLd,
  noIndex = false,
}) => {
  // Base title and site name
  const siteName = 'StuHouses';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  
  // Base URL for canonical and OG URLs
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stuhouses.com';
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : null;
  
  // Default OG image
  const defaultOgImage = `${baseUrl}/images/og-image.jpg`;
  const ogImageUrl = ogImage ? ogImage : defaultOgImage;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={siteName} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Robots Control */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      )}
    </Head>
  );
};

export default SEO; 