import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
const data = {
  facebookLink: "https://www.facebook.com/profile.php?id=61573957573301",
  whatsappLink: "https://wa.me/918250857277",
  // instaLink: "https://instagram.com/mvpblocks",
  // twitterLink: "https://twitter.com/mvpblocks",
  // githubLink: "https://github.com/mvpblocks",
  // dribbbleLink: "https://dribbble.com/mvpblocks",
  services: {
    appointment: "/appointment",
    doctors: "/doctors",
    consultation: "/doctors",
    contact: "/contact",
  },
  about: {
    history: "/company-history",
    team: "/meet-the-team",
    handbook: "/employee-handbook",
    careers: "/careers",
  },
  help: {
    faqs: "/faqs",
    support: "/support",
    livechat: "https://api.whatsapp.com/send/?phone=918250857277&text=Hello%21+I+would+like+to+book+an+appointment.&type=phone_number&app_absent=0"
  },
  contact: {
    email: "aplusclinicasansol@gmail.com",
    phone: "+91 8250857277",
    address: "Sahana apartment,lower chelidanga,mother Teresa road,near volvo bus stand"},

  company: {
    name: "A Plus Polyclinic",
    description:
      "A Plus Polyclinic offers high-quality, multi-specialty healthcare with experienced doctors and modern facilities. We provide personalized, patient-centered treatment along with convenient online appointment booking, making healthcare accessible, efficient, and reliable for everyone.",
    logo: assets.logo,
  },
};
const socialLinks = [
  { icon: Facebook, label: "Facebook", href: data.facebookLink },
  { icon: MessageCircle, label: "WhatsApp", href: data.whatsappLink },
  // { icon: Instagram, label: "Instagram", href: data.instaLink },
  // { icon: Twitter, label: "Twitter", href: data.twitterLink },
  // { icon: Github, label: "GitHub", href: data.githubLink },
  // { icon: Dribbble, label: "Dribbble", href: data.dribbbleLink },
];
const aboutLinks = [
  { text: "Company History", href: data.about.history },
  { text: "Meet the Team", href: data.about.team },
  { text: "Employee Handbook", href: data.about.handbook },
  { text: "Careers", href: data.about.careers },
];
const serviceLinks = [
  { text: "Book Appointment", href: data.services.appointment },
  { text: "Find Doctors", href: data.services.doctors },
  
  { text: "Contact Us", href: data.services.contact },
];
const helpfulLinks = [
  { text: "FAQs", href: data.help.faqs },
  { text: "Support", href: data.help.support },
  { text: "Live Chat", href: data.help.livechat, hasIndicator: true },
];
const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];
export default function Footer4Col() {
  return (
    <footer className="bg-secondary/50 dark:bg-secondary/20 backdrop-blur-sm mt-8 mb-4 w-full place-self-end rounded-xl border border-secondary/20">
      <div className="mx-auto max-w-screen-xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:pr-8">
            <div className="text-primary flex justify-center gap-2 sm:justify-start">
              <img
                src={data.company.logo}
                alt="logo"
                className="h-11 w-auto"
              />
            </div>

            <p className="text-foreground/60 mt-4 max-w-md text-center text-sm leading-relaxed sm:max-w-xs sm:text-left font-light">
              High-quality healthcare with expert doctors and modern facilities.
            </p>

            <ul className="mt-5 flex justify-center gap-3 sm:justify-start">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/80 hover:text-primary transition-all duration-300 hover:scale-110 hover:bg-primary/10 p-2 rounded-lg">
                    <span className="sr-only">{label}</span>
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold tracking-wider uppercase text-foreground/90 mb-4">Services</p>
              <ul className="space-y-2.5 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className="text-secondary-foreground/60 hover:text-primary transition-colors duration-200 font-light hover:translate-x-0.5 inline-block">
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold tracking-wider uppercase text-foreground/90 mb-4">Help</p>
              <ul className="space-y-2.5 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className={`${
                        hasIndicator
                          ? "group flex justify-center gap-1.5 sm:justify-start"
                          : "text-secondary-foreground/70 hover:text-secondary-foreground transition"
                      }`}>
                      <span className="text-secondary-foreground/60 hover:text-primary transition-colors duration-200 font-light">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-primary relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold tracking-wider uppercase text-foreground/90 mb-4">Contact</p>
              <ul className="space-y-3 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <a
                      className="flex items-center justify-center gap-2 sm:justify-start group"
                      href="#">
                      <Icon className="text-primary/70 size-[18px] shrink-0 group-hover:text-primary transition-colors duration-200" />
                      {isAddress ? (
                        <address className="text-secondary-foreground/60 flex-1 not-italic font-light group-hover:text-foreground/80 transition-colors duration-200">
                          {text}
                        </address>
                      ) : (
                        <span className="text-secondary-foreground/60 flex-1 font-light group-hover:text-foreground/80 transition-colors duration-200">
                          {text}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-secondary/30 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left sm:items-center">
            <p className="text-xs text-secondary-foreground/50 font-light">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-secondary-foreground/50 mt-2 text-xs font-light transition sm:order-first sm:mt-0">
              &copy; 2025 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}