import Head from 'next/head';
import Link from 'next/link';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | StuHouses</title>
        <meta name="description" content="Learn how StuHouses collects, uses, and protects your personal information when you use our student accommodation platform." />
      </Head>

      {/* Hero Section */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl max-w-3xl mx-auto">
            How we collect, use, and protect your information
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="prose prose-lg max-w-none text-neutral-dark">
            <div className="flex items-center mb-6">
              <ShieldCheckIcon className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold m-0">StuHouses - Privacy Policy</h2>
            </div>
            
            <p className="text-sm italic mb-6">Last updated: April 2025</p>
            
            <p className="font-medium">
              At StuHouses, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h3>1. Information We Collect</h3>
            <p>
              We collect information that you provide directly to us, information we collect automatically when you use our services, and information from third parties.
            </p>
            
            <h4>1.1 Information You Provide</h4>
            <p>
              We may collect the following types of information when you register an account, submit enquiries, or otherwise interact with our services:
            </p>
            <ul>
              <li>Personal identification information (name, email address, phone number)</li>
              <li>University or college information</li>
              <li>Accommodation preferences</li>
              <li>Login credentials</li>
              <li>Communications with us or through our platform</li>
              <li>Any other information you choose to provide</li>
            </ul>
            
            <h4>1.2 Information Collected Automatically</h4>
            <p>
              When you access or use our services, we may automatically collect:
            </p>
            <ul>
              <li>Browser and device information</li>
              <li>IP address</li>
              <li>Usage data</li>
              <li>Cookies and similar technologies</li>
              <li>Location information</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>Providing, maintaining, and improving our services</li>
              <li>Processing your accommodation requests and enquiries</li>
              <li>Communicating with you about our services</li>
              <li>Personalizing your experience</li>
              <li>Analyzing usage of our platform</li>
              <li>Complying with legal obligations</li>
              <li>Preventing fraud and protecting our rights</li>
              <li>For any other purpose with your consent</li>
            </ul>

            <h3>3. Sharing Your Information</h3>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li><strong>Property Providers:</strong> When you submit an enquiry, we share your information with the relevant property owner or letting agent.</li>
              <li><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf (e.g., payment processing, data analysis, email delivery).</li>
              <li><strong>Business Partners:</strong> We may share information with our business partners to offer you certain products, services, or promotions.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
              <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
              <li><strong>With Your Consent:</strong> We may share your information for any other purpose disclosed to you with your consent.</li>
            </ul>

            <h3>4. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, accidental loss, destruction, or damage. While we take these steps to secure your personal information, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h3>5. Your Rights and Choices</h3>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing of your personal information</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the details provided at the end of this policy.
            </p>

            <h3>6. Cookies and Tracking Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to track activity on our services and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our services.
            </p>

            <h3>7. International Transfers</h3>
            <p>
              Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.
            </p>
            <p>
              If you are located outside the United Kingdom and choose to provide information to us, please note that we transfer the data to the United Kingdom and process it there. By submitting your personal information, you consent to this transfer.
            </p>

            <h3>8. Children's Privacy</h3>
            <p>
              Our services are not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to remove that information from our servers.
            </p>

            <h3>9. Third-Party Links</h3>
            <p>
              Our services may contain links to third-party websites or services that are not owned or controlled by StuHouses. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>

            <h3>10. Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h3>11. Data Retention</h3>
            <p>
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>

            <h3>12. Contact Us</h3>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <address className="not-italic">
              <p className="mb-1">StuHouses Ltd</p>
              <p className="mb-1">123 University Street</p>
              <p className="mb-1">Leeds, LS1 1AA</p>
              <p className="mb-1">United Kingdom</p>
              <p className="mb-1">Email: privacy@stuhouses.com</p>
              <p className="mb-1">Phone: +44 123 456 7890</p>
            </address>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/terms" className="text-primary hover:text-primary-700 font-medium">
              Read our Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}