import { NavLink } from "react-router-dom";
const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/*-----------left section-------*/}
        <div>
            <p className="mb-5 text-2xl font-bold tracking-tight text-primary">DoctorConnect</p>
            <p className="w-full md:w-2/3 text-gray-600 leading-6"> 
            Book your appointment with the best doctors in your city. We provide a seamless experience to connect patients with healthcare professionals.
            DoctorConnect is your trusted platform for finding and booking appointments with top-rated doctors across various specialties.

            </p>
        </div>
        {/*-----------middle section-------*/}
        <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/about">About us</NavLink></li>
                <li><NavLink to="/contact">Contact us</NavLink></li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        {/*-----------right section-------*/}
        <div>
            <p className="text-xl font-medium mb-5">Get In Touch</p>
            <ul className="flex flex-col gap-2 text-gray-600">
                <li> +91 987654321</li>
                <li>Doctorconnect@gmail.com</li>
            </ul>
        </div>
      </div>
      {/*-------------copyright--------*/}
      <div>
        <p className="py-5 text-sm text-center">Copyright 2026 @ DoctorConnect - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
