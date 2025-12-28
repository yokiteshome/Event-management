'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function PricingPage() {
  const [isMonthly, setIsMonthly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, absolutely. You can cancel your subscription at any time from your dashboard. Your plan will remain active until the end of the current billing cycle, and you won\'t be charged again.',
    },
    {
      question: 'Do you take a commission on ticket sales?',
      answer: 'No. We do not take any commission on ticket sales. All ticket revenue belongs entirely to the event organizer.',
    },
    {
      question: 'How are payouts handled?',
      answer: 'Ticket payments are handled directly between the organizer and attendees. The platform focuses on event registration and attendee management.',
    },
    {
      question: 'Can I upgrade my plan later?',
      answer: 'Yes. You can upgrade your plan at any time. Once upgraded, the new features will be available immediately, and any remaining balance will be adjusted automatically.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for small community meetups.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Basic event page',
        'Up to 50 attendees',
        'Standard email support',
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-100 text-[#1E293B] hover:bg-gray-200',
      popular: false,
    },
    {
      name: 'Standard',
      description: 'For growing events and professional organizers.',
      monthlyPrice: 500,
      yearlyPrice: 4000, // 500 * 12 * 0.8 (20% discount)
      features: [
        'Custom branding & logos',
        'Up to 500 attendees',
        'Priority Email support',
        'Ticket scanning mobile app',
      ],
      buttonText: 'Choose Standard',
      buttonStyle: 'bg-primary-green text-white hover:bg-primary-green-dark',
      popular: true,
    },
    {
      name: 'Premium',
      description: 'For large conferences and enterprises.',
      monthlyPrice: 1500,
      yearlyPrice: 12000, // 1500 * 12 * 0.8 (20% discount)
      features: [
        'Unlimited attendees',
        '24/7 Priority support',
        'Advanced Analytics dashboard',
        'White-label solution',
        'Dedicated account manager',
      ],
      buttonText: 'Choose Premium',
      buttonStyle: 'bg-gray-100 text-[#1E293B] hover:bg-gray-200',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Main Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
            Simple Pricing for Every Event
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent pricing in ETB. No hidden fees. Choose the plan that fits your needs, from small gatherings to large-scale conferences.
          </p>
        </div>

        {/* Monthly/Yearly Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-base font-medium ${isMonthly ? 'text-primary-green' : 'text-gray-600'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsMonthly(!isMonthly)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
              isMonthly ? 'bg-primary-green' : 'bg-gray-300'
            }`}
            aria-label="Toggle billing period"
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                isMonthly ? 'translate-x-0' : 'translate-x-7'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-base font-medium ${!isMonthly ? 'text-primary-green' : 'text-gray-600'}`}>
              Yearly
            </span>
            <span className="text-sm text-green-600 font-semibold">Save 20%</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl shadow-md border-2 p-8 ${
                plan.popular
                  ? 'border-primary-green scale-105'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-green text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-[#1E293B] mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#1E293B]">
                  {isMonthly ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="text-gray-600 ml-2">Birr/{isMonthly ? 'mo' : 'yr'}</span>
              </div>
              <Button
                className={`w-full ${plan.buttonStyle} px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 mb-6`}
              >
                {plan.buttonText}
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature Comparison Link */}
        <div className="text-center">
          <Link
            href="#"
            className="text-primary-green hover:text-primary-green-dark font-semibold text-lg transition-colors inline-flex items-center gap-2"
          >
            See full feature comparison →
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  aria-expanded={openFaq === index}
                >
                  <span className="font-semibold text-[#1E293B] pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

