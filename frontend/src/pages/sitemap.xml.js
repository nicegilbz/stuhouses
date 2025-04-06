import api from '../utils/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://stuhouses.com';

// Function to generate sitemap entries
const generateSiteMap = ({ cities, universities, properties }) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static Pages -->
      <url>
        <loc>${SITE_URL}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${SITE_URL}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${SITE_URL}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${SITE_URL}/faq</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>${SITE_URL}/cities</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${SITE_URL}/universities</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${SITE_URL}/properties</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${SITE_URL}/auth</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      
      <!-- City Pages -->
      ${cities?.map((city) => {
        return `
          <url>
            <loc>${SITE_URL}/properties/${city.slug}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      }).join('')}
      
      <!-- University Pages -->
      ${universities?.map((university) => {
        return `
          <url>
            <loc>${SITE_URL}/properties/university/${university.slug}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      }).join('')}
      
      <!-- Property Pages -->
      ${properties?.map((property) => {
        return `
          <url>
            <loc>${SITE_URL}/properties/details/${property.slug}</loc>
            <changefreq>weekly</changefreq>
            <lastmod>${new Date(property.updated_at).toISOString()}</lastmod>
            <priority>0.7</priority>
          </url>
        `;
      }).join('')}
    </urlset>
  `;
};

// React component for server-side rendering
const SiteMap = () => {
  // This component will not render in the browser, so we can return null
  return null;
};

// Generate sitemap on server side
export const getServerSideProps = async ({ res }) => {
  try {
    // Fetch data for dynamic pages
    const [citiesResponse, universitiesResponse, propertiesResponse] = await Promise.all([
      api.get('/cities'),
      api.get('/universities'),
      api.get('/properties?limit=1000'),
    ]);

    const cities = citiesResponse?.data?.data || [];
    const universities = universitiesResponse?.data?.data || [];
    const properties = propertiesResponse?.data?.data || [];

    // Generate sitemap XML
    const sitemap = generateSiteMap({
      cities,
      universities,
      properties,
    });

    // Set response headers
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    
    // Send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // In case of error, return a basic sitemap with just static pages
    const basicSitemap = generateSiteMap({ cities: [], universities: [], properties: [] });
    
    res.setHeader('Content-Type', 'text/xml');
    res.write(basicSitemap);
    res.end();

    return {
      props: {},
    };
  }
};

export default SiteMap; 