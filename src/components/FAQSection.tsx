'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What makes PAFT plastic pallets different from wooden pallets?",
    answer: "PAFT plastic pallets are lighter, more durable, weather-resistant, and 100% recyclable. They don't splinter, require no fumigation for international shipping, and maintain consistent dimensions over time."
  },
  {
    question: "What is the load capacity of your pallets?",
    answer: "Our pallets range from 1,000 kg to 3,000 kg load capacity depending on the model. Each product page shows detailed specifications including static, dynamic, and racking load capacities."
  },
  {
    question: "Do you offer custom pallet solutions?",
    answer: "Yes! We specialize in custom plastic pallets tailored to your specific requirements including dimensions, load capacity, color, and special features like RFID integration or anti-slip surfaces."
  },
  {
    question: "What industries do you serve?",
    answer: "We serve warehousing, manufacturing, food & beverage, pharmaceutical, automotive, retail, chemical, and export/import industries across Egypt and internationally."
  },
  {
    question: "How do I get a quote for bulk orders?",
    answer: "Simply contact us through our quote form or call us directly. We provide competitive pricing for bulk orders and can arrange site visits for large projects."
  },
  {
    question: "What certifications do your pallets have?",
    answer: "Our pallets are certified with ISO 9001:2015, ISO 14001:2015, HACCP, CE Marking, and FDA approval for food-grade applications."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="text-paft-primary">Questions</span>
          </h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about our plastic pallets and services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg"
            >
              <button
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-paft-primary transform transition-transform duration-500 ${openIndex === index ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-paft-primary text-white font-semibold rounded-lg hover:bg-paft-primary-dark transition-colors"
          >
            Contact Our Team
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}