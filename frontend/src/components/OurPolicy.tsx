"use client";

const policies = [
  {
    icon: "🌿",
    title: "100% Deshi Sourcing",
    desc: "Every product is sourced directly from local farmers and authentic deshi producers.",
    color: "bg-orange-50 border-orange-100",
    iconBg: "bg-orange-100",
  },
  {
    icon: "🚚",
    title: "Fast Local Delivery",
    desc: "Get your daily bazaar delivered in as little as 2 hours anywhere in Dhaka.",
    color: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    desc: "Your payment and personal data are always protected with industry-grade encryption.",
    color: "bg-purple-50 border-purple-100",
    iconBg: "bg-purple-100",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    desc: "Not satisfied? Our 24-hour return policy ensures you always get what you pay for.",
    color: "bg-amber-50 border-amber-100",
    iconBg: "bg-amber-100",
  },
];

export default function OurPolicy() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-subtitle">Why Choose Us</p>
          <h2 className="section-title">Our Promise to You</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {policies.map((policy, i) => (
            <div
              key={i}
              className={`flex flex-col gap-4 p-6 rounded-2xl border ${policy.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
            >
              <div className={`w-12 h-12 rounded-2xl ${policy.iconBg} flex items-center justify-center text-2xl`}>
                {policy.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base">{policy.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{policy.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}