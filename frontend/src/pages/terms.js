import Head from 'next/head';
import Link from 'next/link';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | StuHouses</title>
        <meta name="description" content="Terms and conditions for using the StuHouses platform for finding student accommodation with bills included." />
      </Head>

      {/* Hero Section */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Please read these terms carefully before using our platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="prose prose-lg max-w-none text-neutral-dark">
            <div className="flex items-center mb-6">
              <DocumentTextIcon className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold m-0">StuHouses - Terms of Service</h2>
            </div>
            
            <p className="text-sm italic mb-6">Last updated: April 2025</p>
            
            <h3>1. Introduction</h3>
            <p>
              Welcome to StuHouses. These Terms and Conditions govern your use of the StuHouses website and services (collectively, the "Services") provided by StuHouses Ltd ("we," "us," or "our").
            </p>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Services.
            </p>

            <h3>2. Using Our Services</h3>
            <h4>2.1 Account Registration</h4>
            <p>
              To use certain features of our Services, you may need to register for an account. You must provide accurate information and promptly update any changes to keep it accurate.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities occurring under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
            
            <h4>2.2 Eligibility</h4>
            <p>
              You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you meet this requirement.
            </p>
            
            <h4>2.3 User Conduct</h4>
            <p>
              When using our Services, you agree not to:
            </p>
            <ul>
              <li>Violate any applicable law or regulation</li>
              <li>Infringe the rights of others</li>
              <li>Submit false, misleading, or inaccurate information</li>
              <li>Disrupt or interfere with the Services or servers</li>
              <li>Attempt to gain unauthorized access to our Services</li>
              <li>Use our Services for any illegal or unauthorized purpose</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Create multiple accounts for abusive purposes</li>
            </ul>

            <h3>3. Property Listings and Bookings</h3>
            <h4>3.1 Property Information</h4>
            <p>
              We strive to provide accurate information about the properties listed on our platform. However, we do not own, manage, or control these properties and cannot guarantee the accuracy of all information provided by property owners or agents.
            </p>
            <p>
              All property descriptions, amenities, and photographs are provided by the property owners or agents and have not been independently verified by us.
            </p>
            
            <h4>3.2 Bookings and Agreements</h4>
            <p>
              Any booking requests or enquiries made through our platform are subject to acceptance by the property owner or agent. We act as an intermediary between you and the property owner/agent.
            </p>
            <p>
              The contractual relationship for accommodation is between you and the property owner/agent, not with StuHouses. We are not party to any agreement you enter into with a property owner/agent.
            </p>

            <h3>4. Fees and Payments</h3>
            <p>
              Our platform is free to use for students searching for accommodation. Property owners and agents may be subject to listing fees and commission charges as specified in separate agreements.
            </p>
            <p>
              Any payments made through our platform for deposits, rent, or other charges are processed by our payment processors and are subject to their terms and conditions.
            </p>

            <h3>5. Intellectual Property</h3>
            <p>
              The Services and all content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by us, our licensors, or other providers and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website without our prior written consent.
            </p>

            <h3>6. Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, StuHouses shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from your access to or use of or inability to access or use the Services.
            </p>
            <p>
              We do not guarantee the accuracy, completeness, or usefulness of any property listings or other content on our platform. We are not responsible for any decisions you make based on such information.
            </p>

            <h3>7. Indemnification</h3>
            <p>
              You agree to indemnify, defend, and hold harmless StuHouses, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Services.
            </p>

            <h3>8. Third-Party Links and Services</h3>
            <p>
              Our Services may contain links to third-party websites or services that are not owned or controlled by StuHouses. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p>
              You acknowledge and agree that StuHouses shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
            </p>

            <h3>9. Termination</h3>
            <p>
              We may terminate or suspend your access to all or part of our Services immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.
            </p>
            <p>
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>

            <h3>10. Changes to These Terms</h3>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p>
              What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms.
            </p>

            <h3>11. Applicable Law</h3>
            <p>
              These Terms and your use of the Services shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.
            </p>
            <p>
              Any dispute arising from or relating to the subject matter of these Terms shall be governed by the exclusive jurisdiction of the courts of the United Kingdom.
            </p>

            <h3>12. Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <address className="not-italic">
              <p className="mb-1">StuHouses Ltd</p>
              <p className="mb-1">123 University Street</p>
              <p className="mb-1">Leeds, LS1 1AA</p>
              <p className="mb-1">United Kingdom</p>
              <p className="mb-1">Email: legal@stuhouses.com</p>
              <p className="mb-1">Phone: +44 123 456 7890</p>
            </address>
          </div>
          
          <div className="mt-8 pt-6 border-t border-grey-200">
            <Link href="/privacy-policy" className="text-primary hover:text-primary-700 font-medium">
              Read our Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 