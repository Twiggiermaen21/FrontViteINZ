import React from 'react';

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 mt-16 border-t border-[#374b4b] text-[#989c9e] bg-[#1e1f1f]">
      <div className="flex flex-col md:flex-row justify-between gap-10 pb-8">
        <div className="md:max-w-sm">
          <p className="text-sm leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>

        <div className="flex flex-wrap gap-16">
          <div>
            <h2 className="font-semibold text-[#d2e4e2] mb-4">Company</h2>
            <ul className="space-y-2 text-sm">
              <li>Home</li>
              <li>About us</li>
              <li>Contact us</li>
              <li>Privacy policy</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-[#d2e4e2] mb-4">Get in touch</h2>
            <p>+1-212-456-7890</p>
            <p>contact@example.com</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-[#6d8f91] py-4">
        © 2025 PrebuiltUI. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
