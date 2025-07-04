export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 animate-fade-in-up">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="animate-slide-in-left flex-row">
            <span className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">
              {"<ddShop"}
              <span className="text-purple-500">{"/>"}</span>
            </span>
            <div className="mt-5">
            <h2 className="text-lg font-semibold mb-4">About Us</h2>
            <p className="text-gray-400 text-sm transition-all duration-300 hover:text-white">
              We provide high-quality products with excellent customer service.
            </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-in-left delay-100">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="text-gray-400 text-sm space-y-2">
              {["Home", "Shop", "Contact", "About"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300 pl-1 hover:pl-2"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="animate-slide-in-left delay-200">
            <h2 className="text-lg font-semibold mb-4">Customer Support</h2>
            <ul className="text-gray-400 text-sm space-y-2">
              {["FAQs", "Returns", "Shipping", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300 pl-1 hover:pl-2"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-slide-in-left delay-300">
            <h2 className="text-lg font-semibold mb-4">Contact Info</h2>
            <ul className="text-gray-400 text-sm space-y-3">
              <li className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                SVNIT, Surat
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                ddeepakverma0913@gmail.com
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +91 6352196905
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p className="mb-4 md:mb-0 animate-fade-in">
            &copy; {new Date().getFullYear()} {"<ddDev"}
            <span className="text-purple-500">{"/"}</span>{">"} All rights reserved.
          </p>
          <div className="flex space-x-4">
            {["Facebook", "Twitter", "Instagram", "LinkedIn"].map(
              (social, index) => (
                <a
                  key={social}
                  href="#"
                  className="hover:text-white transition-all duration-300 hover:-translate-y-1"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {social}
                </a>
              )
            )}
          </div>
        </div>
      </div>

      
    </footer>
  );
}
