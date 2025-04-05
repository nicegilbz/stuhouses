import Head from 'next/head';
import Link from 'next/link';
import { ShieldCheckIcon, LockClosedIcon, FireIcon, BoltIcon, ExclamationTriangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function SafetyPolicy() {
  return (
    <>
      <Head>
        <title>Student Safety Policy | StuHouses</title>
        <meta name="description" content="StuHouses is committed to maintaining high safety standards for all our student accommodation. Learn about our safety practices and policies." />
      </Head>

      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Student Safety Policy</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your safety is our top priority. Learn about our commitment to providing secure accommodation for all students.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-dark">Our Commitment to Student Safety</h2>
            <p className="text-neutral-dark mb-4">
              At StuHouses, we understand that safety and security are paramount concerns for students and their families. We are committed to providing accommodation that meets the highest safety standards, ensuring our residents can focus on their studies and enjoy their university experience with peace of mind.
            </p>
            <p className="text-neutral-dark">
              This safety policy outlines the measures we take to maintain safe and secure living environments across all our properties, as well as the responsibilities of our residents in contributing to a safe community.
            </p>
          </div>

          {/* Safety Features */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-neutral-dark">Standard Safety Features</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-primary-50 p-3 rounded-full">
                    <FireIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-neutral-dark">Fire Safety</h3>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-dark">
                    <li>All properties equipped with smoke and carbon monoxide detectors</li>
                    <li>Regular testing of all fire alarm systems</li>
                    <li>Fire extinguishers and fire blankets provided</li>
                    <li>Clear evacuation routes with illuminated signage</li>
                    <li>Fire doors installed where required by regulations</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-primary-50 p-3 rounded-full">
                    <LockClosedIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-neutral-dark">Security Measures</h3>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-dark">
                    <li>Secure entry systems with individual key fobs or access cards</li>
                    <li>CCTV monitoring in communal areas and building entrances</li>
                    <li>Secure door and window locks on all properties</li>
                    <li>Security staff at larger accommodation sites</li>
                    <li>Well-lit external areas and pathways</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-primary-50 p-3 rounded-full">
                    <BoltIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-neutral-dark">Electrical Safety</h3>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-dark">
                    <li>PAT testing of all electrical appliances provided</li>
                    <li>Regular electrical installation condition reports</li>
                    <li>RCD protection in all properties</li>
                    <li>Guidance provided on safe use of electrical items</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="bg-primary-50 p-3 rounded-full">
                    <ShieldCheckIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-neutral-dark">General Safety</h3>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-dark">
                    <li>Regular property inspections and maintenance</li>
                    <li>Gas safety certificates for all properties with gas appliances</li>
                    <li>Energy Performance Certificates (EPCs)</li>
                    <li>Compliance with HMO licensing requirements where applicable</li>
                    <li>Adherence to all relevant building regulations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Procedures */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 mr-4">
                <div className="bg-secondary-50 p-3 rounded-full">
                  <ExclamationTriangleIcon className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-dark">Emergency Procedures</h2>
              </div>
            </div>
            
            <p className="text-neutral-dark mb-4">
              We have comprehensive emergency procedures in place to handle various situations that may arise. These include:
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-neutral-dark">Fire Emergencies</h3>
                <p className="text-neutral-dark">
                  Detailed fire evacuation plans are provided in each property. Fire drills are conducted regularly in larger accommodation buildings.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-neutral-dark">Maintenance Emergencies</h3>
                <p className="text-neutral-dark">
                  24/7 emergency maintenance support for issues like gas leaks, major water leaks, or complete power failures.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-neutral-dark">Security Incidents</h3>
                <p className="text-neutral-dark">
                  Clear reporting procedures for security breaches or suspicious activities, with support available around the clock.
                </p>
              </div>
            </div>
            
            <div className="bg-neutral-light p-6 rounded-lg">
              <h4 className="font-semibold text-neutral-dark mb-2">Emergency Contact Information</h4>
              <p className="text-neutral-dark mb-2">
                Each property has clearly displayed emergency contact information, including:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-neutral-dark">
                <li>Emergency maintenance phone number</li>
                <li>Local emergency services contacts</li>
                <li>Property manager contact details</li>
                <li>Nearest hospital and urgent care locations</li>
              </ul>
            </div>
          </div>

          {/* Resident Responsibilities */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 mr-4">
                <div className="bg-primary-50 p-3 rounded-full">
                  <UserGroupIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-dark">Resident Responsibilities</h2>
              </div>
            </div>
            
            <p className="text-neutral-dark mb-4">
              While we take extensive measures to ensure your safety, residents also play a vital role in maintaining a safe living environment. We ask that all residents:
            </p>
            
            <ul className="list-disc pl-5 space-y-2 text-neutral-dark mb-6">
              <li>Familiarize themselves with emergency evacuation procedures</li>
              <li>Report any safety concerns or maintenance issues promptly</li>
              <li>Never tamper with fire safety equipment or security features</li>
              <li>Keep communal areas free from obstacles and fire hazards</li>
              <li>Follow guidelines for the safe use of electrical appliances</li>
              <li>Ensure doors and windows are locked when leaving the property</li>
              <li>Do not share access codes or keys with non-residents</li>
              <li>Be mindful of noise levels and consider neighbors, especially at night</li>
            </ul>
            
            <p className="text-neutral-dark">
              By working together, we can ensure that all our properties remain safe, secure, and comfortable places to live and study.
            </p>
          </div>

          {/* Safety Inspections */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-dark">Regular Safety Inspections</h2>
            <p className="text-neutral-dark mb-4">
              We conduct regular safety inspections of all our properties to ensure ongoing compliance with safety regulations and to identify any potential issues. These inspections include:
            </p>
            
            <ul className="list-disc pl-5 space-y-2 text-neutral-dark mb-4">
              <li>Scheduled property inspections (with advance notice to residents)</li>
              <li>Annual gas safety checks by certified engineers</li>
              <li>Electrical installation condition reporting every five years</li>
              <li>Regular testing of fire alarm systems and emergency lighting</li>
              <li>Assessment of security measures and access systems</li>
            </ul>
            
            <p className="text-neutral-dark">
              Our commitment to these regular safety checks helps us maintain the highest standards of safety across all our properties and address any issues promptly.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-neutral-light rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-neutral-dark">Questions About Our Safety Policy?</h3>
            <p className="text-neutral-dark mb-6">
              If you have any questions or concerns about safety in our accommodation, please don't hesitate to contact us. Your safety is our priority, and we're always working to improve our safety measures.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="button-primary">
                Contact Us
              </Link>
              <Link href="/properties" className="button-outline">
                Browse Safe Student Homes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 