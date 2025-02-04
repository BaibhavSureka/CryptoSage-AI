import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 text-center md:text-left">
            <h3 className="text-lg font-semibold">CryptoSage AI</h3>
            <p className="mt-2 text-sm">Empowering your crypto portfolio with AI</p>
          </div>

          <div className="w-full md:w-1/3 mt-4 md:mt-0 text-center">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-2">
              <li>
                <Link href="/about" className="text-sm hover:text-primary transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-primary transition duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/3 mt-4 md:mt-0 text-center md:text-right">
            <h4 className="text-lg font-semibold">Connect With Us</h4>
            <div className="mt-2 flex justify-center md:justify-end space-x-4">{/* Social links */}</div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CryptoSage AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

