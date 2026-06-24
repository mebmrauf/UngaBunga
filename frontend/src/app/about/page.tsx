export const revalidate = 0;

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="section-subtitle">Our Story</p>
        <h1 className="section-title mb-4">About Khabari</h1>
        <p className="text-gray-500 leading-relaxed">
          We're passionate about bringing fresh, quality groceries directly to your door. 
          Founded in Dhaka, we believe everyone deserves access to the finest produce at fair prices.
        </p>
      </div>

      {/* Image + Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80"
            alt="Fresh produce"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Delivering fresh, high-quality groceries with exceptional service — making everyday shopping 
            convenient, affordable, and enjoyable for our community.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We work directly with local farmers and suppliers to ensure that everything you receive 
            is as fresh as possible. From field to your table, quality is our top priority.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            {[
              { value: "2019", label: "Founded" },
              { value: "10K+", label: "Happy Customers" },
              { value: "500+", label: "Products" },
              { value: "2hrs", label: "Avg Delivery" },
            ].map(stat => (
              <div key={stat.label} className="bg-orange-50 rounded-2xl p-4">
                <p className="text-2xl font-extrabold text-orange-600">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gradient-to-br from-orange-50 to-emerald-50 rounded-3xl p-10">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "🌿", title: "Freshness First", desc: "We source only the freshest products and quality-check every item before delivery." },
            { icon: "🤝", title: "Community", desc: "We support local farmers and suppliers, keeping money in the community." },
            { icon: "♻️", title: "Sustainability", desc: "Eco-friendly packaging and zero food waste policies guide everything we do." },
          ].map(v => (
            <div key={v.title} className="text-center">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}