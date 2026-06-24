export const revalidate = 0;

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-xl mx-auto mb-14">
        <p className="section-subtitle">Get In Touch</p>
        <h1 className="section-title mb-3">Contact Us</h1>
        <p className="text-gray-500">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="rounded-3xl overflow-hidden shadow-md aspect-video bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&q=80"
              alt="Contact"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "📍", title: "Our Store", lines: ["Kha 224 Pragati Sarani,", "Merul Badda, Dhaka 1212"] },
              { icon: "📞", title: "Phone", lines: ["+8801726-339233"] },
              { icon: "✉️", title: "Email", lines: ["bmrauf.me@gmail.com"] },
              { icon: "⏰", title: "Hours", lines: ["Sat–Thu: 8am – 9pm", "Fri: 2pm – 9pm"] },
            ].map(item => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-semibold text-sm text-gray-900 mb-1">{item.title}</p>
                {item.lines.map(line => (
                  <p key={line} className="text-xs text-gray-500">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="font-bold text-gray-900 text-xl mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name</label>
                <input className="input-field" placeholder="John" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name</label>
                <input className="input-field" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject</label>
              <input className="input-field" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
              <textarea
                rows={5}
                className="input-field resize-none"
                placeholder="Write your message here..."
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}