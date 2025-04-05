import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// FAQ data structure
const faqCategories = [
  {
    title: "About Student Accommodation",
    questions: [
      {
        question: "How does student accommodation work?",
        answer: (
          <div className="space-y-4">
            <p>You have two options to choose from: university accommodation or private accommodation.</p>
            
            <h4 className="font-bold">University accommodation</h4>
            <p>University accommodation can be halls of residence ('halls'), similar to blocks of flats, or a range of smaller houses.</p>
            <p>Uni accommodation tends to include: a fully furnished bedroom, a shared kitchen and bathroom facilities. Each student flat usually contains around five to eight bedrooms, so you'll be sharing the kitchen and bathroom facilities with about four to seven other students. At most unis, you'll be able to choose whether you have a shared bathroom or an en-suite.</p>
            <p>This accommodation can be catered, which means meals will be provided for you on certain days at set times. Most accommodation is self-catered, meaning you're in charge of feeding yourself. In catered accommodation, you'll only have access to basic kitchen facilities, whereas in a self-catered flat you can expect to have a fully-equipped kitchen.</p>
            <p>Uni accommodation often requires termly payments with bills included but check this before you sign a contract. You'll find that costs vary depending on whether you choose a standard, en-suite or luxury studio room.</p>
            
            <h4 className="font-bold">Private accommodation</h4>
            <p>Private accommodation can either be privately-run halls of residence or a room in a normal flat or house run by a landlord. You'll pay rent in term or monthly instalments. Check whether bills are included or separate before you sign the contract.</p>
            <p>You could be sharing with students from other universities too. This is because the halls won't be exclusively owned by your uni.</p>
            <p>Living in private accommodation is what students tend to do in their second year at uni. Ask your uni for a list of recommended landlords if you don't want to live in halls. This will ensure that you're living in a property with a landlord who will look after you.</p>
          </div>
        )
      },
      {
        question: "When should you start looking for student accommodation?",
        answer: (
          <div>
            <p>It's never too early. Look at what student accommodation is being offered when you begin researching where to study. Check the cost and whether you'd enjoy living there. Visit the accommodation too on open days, and order the university's prospectus to learn more.</p>
          </div>
        )
      },
      {
        question: "What should you think about when looking at student accommodation?",
        answer: (
          <div className="space-y-2">
            <p>Consider the following key factors:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Flatmates - who you'll be living with</li>
              <li>Facilities - what amenities are included</li>
              <li>Rent - how much you'll be paying and what's included</li>
            </ul>
          </div>
        )
      },
    ]
  },
  {
    title: "Applications & Contracts",
    questions: [
      {
        question: "When do you apply for student accommodation?",
        answer: (
          <div>
            <p>Every uni will set a deadline for accommodation applications. Check what these are as soon as you know which courses you're applying for. You can do this by checking the university's website or contacting their admissions team.</p>
            <p>You can normally only apply for housing at your firm choice. Sometimes your insurance choices will let you reserve a room, so it's worth asking. That way if you end up at your insurance choice you won't have to worry about where you're going to live. Many universities will also reserve accommodation places for Clearing students.</p>
            <p>We suggest not leaving it until the night before to send your application. The earlier, the better.</p>
            <p>Private accommodation won't have fixed deadlines, so it depends on the city you're going to uni in as the housing market moves faster in some areas than others. You can reach out to the uni's accommodation team for advice on private accommodation in the local area.</p>
          </div>
        )
      },
      {
        question: "How do you apply for student accommodation?",
        answer: (
          <div>
            <p>Most universities will send you the details of how to apply for student accommodation when they offer you a place. You'll apply online through the university's accommodation portal. If you're able to, visit the accommodation before you do this by booking an open day.</p>
            <p>Some universities will guarantee you a room when you apply for a course. Others will only offer you a room if you put them as your first choice. You may get to pick your preferences while some will simply put you where there's space.</p>
            <p>Contact the uni directly if you're confused about how to apply for student accommodation.</p>
          </div>
        )
      },
      {
        question: "Can you change student accommodation?",
        answer: (
          <div>
            <p>Yes, you can ask to be rehoused. This will depend on your reason. The sooner you request a change, the better.</p>
            <p>If you live in private accommodation, you'll have to break your contract and find yourself somewhere else to live. You may be charged for doing this.</p>
          </div>
        )
      },
      {
        question: "How to get out of a student accommodation contract",
        answer: (
          <div>
            <p>Within your tenancy agreement, there should be a break clause. This allows you to end your agreement earlier than expected and will usually provide a notice period you have to give.</p>
            <p>Chat to your student accommodation provider, or landlord, about this first before breaking the contract. Be aware of the contract's terms and conditions before you sign.</p>
          </div>
        )
      }
    ]
  },
  {
    title: "Financial Matters",
    questions: [
      {
        question: "How much is student accommodation?",
        answer: (
          <div className="space-y-4">
            <p>Prices vary depending on location and type of accommodation. A standard self-catered room in a hall will be cheaper than a catered luxury studio room with an en-suite. Prices tend to be listed on the university's website.</p>
            <p>For example, here are some typical accommodation prices:</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Accommodation Type</th>
                    <th className="py-3 px-4 text-left">Room Type</th>
                    <th className="py-3 px-4 text-left">Weekly Cost</th>
                    <th className="py-3 px-4 text-left">Catering</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4">Standard Hall</td>
                    <td className="py-3 px-4">Single</td>
                    <td className="py-3 px-4">£110-£130</td>
                    <td className="py-3 px-4">Self-catered</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Modern Hall</td>
                    <td className="py-3 px-4">En-suite</td>
                    <td className="py-3 px-4">£140-£175</td>
                    <td className="py-3 px-4">Self-catered</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Premium Hall</td>
                    <td className="py-3 px-4">Studio</td>
                    <td className="py-3 px-4">£175-£200</td>
                    <td className="py-3 px-4">Self-catered</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Catered Hall</td>
                    <td className="py-3 px-4">En-suite</td>
                    <td className="py-3 px-4">£180-£210</td>
                    <td className="py-3 px-4">Catered</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      },
      {
        question: "How do students pay for accommodation?",
        answer: (
          <div>
            <p>Most universities will ask you to set up a direct debit. Accommodation costs will then come out in termly instalments. Remember your student loans can help you to cover these costs.</p>
            <p>You'll usually be required to pay a deposit on your student accommodation, which is refunded when the contract ends. Details of a guarantor, i.e. a parent or guardian, will need to be provided too. This is to ensure someone will be responsible for paying your rent if you're unable to.</p>
          </div>
        )
      },
      {
        question: "Should you insure your belongings at uni?",
        answer: (
          <div>
            <p>Taking out home and contents insurance is a great idea, particularly if you're sharing a house. Paying a little bit of money every month will mean if your things are stolen, lost or broken, you're covered.</p>
            <p>Check with your university or landlord to see if insurance is already included within your contract. Many university halls have their own insurance to cover your possessions, and if you're living in a privately rented house or flat, the buildings insurance should be arranged by your landlord.</p>
          </div>
        )
      }
    ]
  },
  {
    title: "Moving In & Living",
    questions: [
      {
        question: "Can you stay in your student accommodation during the holidays?",
        answer: (
          <div>
            <p>This will depend on your university and the accommodation. Check your accommodation contract carefully to see how many weeks you're allowed to stay there. Many universities now guarantee accommodation for 365 days a year so that you don't need to move out on holidays.</p>
          </div>
        )
      },
      {
        question: "What should you bring to student accommodation?",
        answer: (
          <div>
            <p>University accommodation tends to give you the basics before you move in. You won't need to bring things like a bed, a wardrobe, or fit an entire oven in the back seat of your parent's car. Smaller things like general kitchenware are good to bring.</p>
            <p>Check on your university's website to see what's provided. While some will give you a desk to work on and a large pinboard, others may give you a small bedside table as a desk and tell you not to hang posters.</p>
          </div>
        )
      },
      {
        question: "What can't you bring to student accommodation?",
        answer: (
          <div>
            <p>Your university will provide a list. If you're not sure whether you can take an item, check with your university or accommodation provider.</p>
          </div>
        )
      },
      {
        question: "How do you make friends in student accommodation?",
        answer: (
          <div>
            <p>Making friends in student accommodation is easier than you think. Every student will be in the same boat and you'll be surrounded by lots of students that either live with you or are close by.</p>
            <p>Keep your door open as you unpack. You'll be surprised at how many people you chat with as a result.</p>
          </div>
        )
      }
    ]
  },
  {
    title: "Other Questions",
    questions: [
      {
        question: "Can you get student accommodation as an apprentice?",
        answer: (
          <div>
            <p>This will depend on your university if you're studying for a degree apprenticeship. Check with them to see whether you can still apply for student accommodation. Employers don't tend to offer accommodation.</p>
          </div>
        )
      },
      {
        question: "Can you live in student accommodation without being a student?",
        answer: (
          <div>
            <p>Halls and other student accommodation are designed for students. You typically can't live in any university accommodation unless you're studying at the university.</p>
          </div>
        )
      },
      {
        question: "Do you have to live in student accommodation?",
        answer: (
          <div>
            <p>No, you can look for private accommodation or live at home if you'd prefer.</p>
          </div>
        )
      },
      {
        question: "Where do you live in the second year of uni?",
        answer: (
          <div>
            <p>Second-year students tend to live in private accommodation. There are estate agents that specialise in student housing. Your university will probably have a list of recommended agents.</p>
            <p>Some universities will offer housing for second years, but there's often fewer options to choose from. You usually won't be able to stay in the same accommodation you did in your first year.</p>
            <p>Start thinking about your second-year accommodation while you're in your first year. Student houses get snapped up quickly. The earlier you can get onto finding a place, the better.</p>
          </div>
        )
      }
    ]
  }
];

export default function FAQ() {
  // State to track which question is open
  const [openCategory, setOpenCategory] = useState(0);
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? -1 : index);
  };

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenQuestions({
      ...openQuestions,
      [key]: !openQuestions[key]
    });
  };

  return (
    <>
      <Head>
        <title>Frequently Asked Questions | StuHouses</title>
        <meta name="description" content="Find answers to common questions about student accommodation, including how it works, when to apply, costs, and what to expect." />
      </Head>

      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Accommodation FAQs</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Got a question about where you're going to live at uni? We've got the answers to help you find your perfect student home.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto py-12 px-4">
        {/* FAQ Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {faqCategories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors ${
                openCategory === index
                  ? 'bg-primary text-white'
                  : 'bg-neutral-light text-neutral-dark hover:bg-primary-50'
              }`}
              onClick={() => toggleCategory(index)}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* FAQ Questions & Answers */}
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex} 
              className={`mb-8 transition-opacity duration-300 ${
                openCategory === -1 || openCategory === categoryIndex ? 'opacity-100' : 'hidden opacity-0'
              }`}
            >
              <h2 className="text-2xl font-bold mb-6 text-neutral-dark">{category.title}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const isOpen = openQuestions[`${categoryIndex}-${questionIndex}`];
                  return (
                    <div 
                      key={questionIndex} 
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <button
                        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      >
                        <h3 className="text-lg font-semibold text-neutral-dark">{faq.question}</h3>
                        <ChevronDownIcon 
                          className={`h-5 w-5 text-primary transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
                        />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 pb-6 text-neutral-dark">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Need More Help Box */}
        <div className="mt-12 bg-neutral-light rounded-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-neutral-dark">Still have questions?</h3>
          <p className="text-neutral-dark mb-6">
            If you can't find the answer to your question, please don't hesitate to contact us. Our team is here to help you find the perfect student accommodation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="button-primary">
              Contact Us
            </Link>
            <Link href="/properties" className="button-outline">
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 