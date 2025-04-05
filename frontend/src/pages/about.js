import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | StuHouses</title>
        <meta name="description" content="Learn about StuHouses, our mission and how we help students find all-inclusive accommodations." />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-neutral-light py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-dark mb-4">About StuHouses</h1>
            <p className="text-lg text-neutral">
              Making student housing simpler, more transparent, and hassle-free.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-4">Our Story</h2>
              <p className="text-neutral mb-4">
                StuHouses was founded in 2020 by a group of former students who experienced firsthand the challenges of finding good student accommodation with transparent, all-inclusive pricing.
              </p>
              <p className="text-neutral mb-4">
                After struggling with unexpected utility bills, unclear contracts, and the stress of organizing multiple services, our founders set out to create a platform that would make student housing simpler and more transparent.
              </p>
              <p className="text-neutral">
                Today, StuHouses partners with trusted landlords and letting agents across the UK to offer quality accommodations where all utilities are included in the rent – no surprises, no hidden costs, just simple, all-in-one pricing.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative h-72 md:h-96 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                  alt="Students collaborating"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="bg-neutral-light py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-6">Our Mission</h2>
            <p className="text-lg text-neutral mb-8">
              To simplify student housing by providing transparent, all-inclusive accommodations that let students focus on what matters most: their education and university experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-neutral-dark mb-2">Simplicity</h3>
                <p className="text-neutral">
                  One payment covers everything – rent, utilities, and broadband.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-neutral-dark mb-2">Transparency</h3>
                <p className="text-neutral">
                  Clear pricing with no hidden costs or surprise bills.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-neutral-dark mb-2">Community</h3>
                <p className="text-neutral">
                  Supporting students to create a positive housing experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-4">Meet Our Team</h2>
            <p className="text-neutral max-w-2xl mx-auto">
              Our dedicated team is passionate about improving the student housing experience through technology and service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Team Member 1 */}
            <div className="bg-neutral-light p-6 rounded-xl text-center">
              <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
                  alt="Sarah Johnson"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="font-bold text-neutral-dark">Sarah Johnson</h3>
              <p className="text-primary text-sm mb-2">CEO & Co-founder</p>
              <p className="text-neutral text-sm">
                Former student housing officer with a passion for improving accommodation standards.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-neutral-light p-6 rounded-xl text-center">
              <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop"
                  alt="Michael Chen"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="font-bold text-neutral-dark">Michael Chen</h3>
              <p className="text-primary text-sm mb-2">CTO & Co-founder</p>
              <p className="text-neutral text-sm">
                Tech enthusiast creating digital solutions to real-world housing problems.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-neutral-light p-6 rounded-xl text-center">
              <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1887&auto=format&fit=crop"
                  alt="Emily Wilson"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="font-bold text-neutral-dark">Emily Wilson</h3>
              <p className="text-primary text-sm mb-2">COO</p>
              <p className="text-neutral text-sm">
                Operations expert ensuring smooth experiences for students and property managers.
              </p>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-neutral-light p-6 rounded-xl text-center">
              <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
                  alt="David Patel"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="font-bold text-neutral-dark">David Patel</h3>
              <p className="text-primary text-sm mb-2">Head of Partnerships</p>
              <p className="text-neutral text-sm">
                Building relationships with quality letting agents and service providers across the UK.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to find your perfect student home?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Browse our listings of all-inclusive student accommodations across the UK's top university cities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/properties" className="button-white">
              Browse Properties
            </Link>
            <Link href="/contact" className="button-outline-white">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 