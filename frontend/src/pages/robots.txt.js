const generateRobotsTxt = (siteUrl) => {
  return `# *
User-agent: *
Allow: /

# Host
Host: ${siteUrl}

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml
`;
};

const RobotsTxt = () => {
  return null;
};

export const getServerSideProps = async ({ res }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stuhouses.com';

  // Set response headers
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=43200');
  
  // Generate robots.txt content
  const robotsTxt = generateRobotsTxt(siteUrl);
  
  // Send the content to the browser
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

export default RobotsTxt; 