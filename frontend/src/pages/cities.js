import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for cities (in a real app, this would come from an API)
const allCities = [
  { 
    name: 'London', 
    slug: 'london', 
    property_count: 156,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop',
    description: 'London offers an unparalleled student experience with its world-leading universities, diverse culture, and vibrant neighborhoods perfect for student living.'
  },
  { 
    name: 'Manchester', 
    slug: 'manchester', 
    property_count: 98,
    image: 'https://images.unsplash.com/photo-1563995103864-d87d3c1fdd39?q=80&w=2070&auto=format&fit=crop',
    description: 'Manchester is one of the UK\'s most popular student cities, with excellent universities, affordable accommodation, and a renowned music and cultural scene.'
  },
  { 
    name: 'Birmingham', 
    slug: 'birmingham', 
    property_count: 87,
    image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?q=80&w=2070&auto=format&fit=crop',
    description: 'As the UK\'s second largest city, Birmingham offers students a diverse community, excellent entertainment options, and a lower cost of living than London.'
  },
  { 
    name: 'Leeds', 
    slug: 'leeds', 
    property_count: 76,
    image: 'https://images.unsplash.com/photo-1681808231339-f512b8467e4a?q=80&w=2070&auto=format&fit=crop',
    description: 'Leeds provides students with a perfect mix of cosmopolitan city living and beautiful surroundings, with excellent transport links to the rest of the UK.'
  },
  { 
    name: 'Sheffield', 
    slug: 'sheffield', 
    property_count: 65,
    image: 'https://images.unsplash.com/photo-1634583702909-31d3e1c67e40?q=80&w=2070&auto=format&fit=crop',
    description: 'Sheffield is known for its safe, friendly atmosphere and rich industrial heritage. The city offers excellent value for money for student accommodation.'
  },
  { 
    name: 'Nottingham', 
    slug: 'nottingham', 
    property_count: 54,
    image: 'https://images.unsplash.com/photo-1577071189882-ee50d6a6ea7a?q=80&w=2070&auto=format&fit=crop',
    description: 'Nottingham is a vibrant, diverse city with a big student population. It offers excellent facilities and a range of affordable student accommodation options.'
  },
  { 
    name: 'Liverpool', 
    slug: 'liverpool', 
    property_count: 48,
    image: 'https://images.unsplash.com/photo-1600844730288-e602f39b6d04?q=80&w=2276&auto=format&fit=crop',
    description: 'Liverpool is a dynamic city with a rich cultural heritage, famous music scene, and exceptional nightlife, making it an ideal location for student living.'
  },
  { 
    name: 'Bristol', 
    slug: 'bristol', 
    property_count: 43,
    image: 'https://images.unsplash.com/photo-1580317092099-ac9fd89fac2e?q=80&w=2071&auto=format&fit=crop',
    description: 'Bristol is a creative hub with a unique identity. The city offers a wide range of student housing in its diverse neighborhoods and vibrant city center.'
  },
  { 
    name: 'Leicester', 
    slug: 'leicester', 
    property_count: 38,
    image: 'https://images.unsplash.com/photo-1595928607828-6fdaee9c9bf3?q=80&w=2070&auto=format&fit=crop',
    description: 'Leicester is a multicultural city with a rich history. It offers affordable student accommodation and is known for its excellent universities.'
  },
  { 
    name: 'Newcastle', 
    slug: 'newcastle', 
    property_count: 35,
    image: 'https://images.unsplash.com/photo-1550338358-0ca9a292e50b?q=80&w=1974&auto=format&fit=crop',
    description: 'Newcastle is a friendly city with a reputation for excellent nightlife. It provides affordable student living and a high quality of life for students.'
  },
  { 
    name: 'Edinburgh', 
    slug: 'edinburgh', 
    property_count: 32,
    image: 'https://images.unsplash.com/photo-1572991135150-48b0194d4366?q=80&w=2070&auto=format&fit=crop',
    description: 'Edinburgh offers a magical setting for student life with its historic architecture, vibrant cultural scene, and prestigious universities.'
  },
  { 
    name: 'Glasgow', 
    slug: 'glasgow', 
    property_count: 29,
    image: 'https://images.unsplash.com/photo-1609094405218-4ee5424b9434?q=80&w=2070&auto=format&fit=crop',
    description: 'Glasgow is a dynamic city with a thriving music scene, excellent shopping, and affordable student accommodation options.'
  },
];

export default function Cities() {
  return (
    <>
      <Head>
        <title>Student Accommodation Cities | StuHouses</title>
        <meta name="description" content="Browse student accommodation in cities across the UK with all bills included." />
      </Head>
      
      {/* Banner */}
      <div className="bg-primary py-12 md:py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Student Accommodation Cities</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Find your perfect student home in these UK cities, all with bills included
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-12 px-4">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allCities.map((city) => (
            <div 
              key={city.slug} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative h-48">
                <Image
                  src={city.image}
                  alt={`Student accommodation in ${city.name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-2xl font-bold">{city.name}</h2>
                  <p className="text-sm">{city.property_count} properties</p>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-neutral mb-4">
                  {city.description}
                </p>
                <Link 
                  href={`/properties?city=${city.slug}`} 
                  className="button-primary w-full text-center"
                >
                  View Properties
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-neutral-light py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-6">Need Help Finding the Right City?</h2>
          <p className="text-neutral mb-8 max-w-2xl mx-auto">
            If you're not sure which city is right for you, our team can help you find the perfect location based on your university, budget, and preferences.
          </p>
          <Link 
            href="/contact" 
            className="button-primary"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </>
  );
} 