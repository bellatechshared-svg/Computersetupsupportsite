import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Monitor, 
  RefreshCcw, 
  Trash2, 
  Wrench, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldCheck,
  Server,
  ArrowRight,
  Send,
  X,
  Mail,
  Building,
  Zap,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utilities ---

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const SUPPORT_EMAIL = 'support@indianapcservices.com';

// Delivers submissions to the support inbox via FormSubmit.
// Note: the very first submission triggers a one-time activation email to SUPPORT_EMAIL.
async function sendToSupportEmail(subject: string, fields: Record<string, string>) {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${SUPPORT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ _subject: subject, _template: 'table', _captcha: 'false', ...fields })
    });
    const result = await response.json();
    return response.ok && String(result.success) === 'true';
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
}

// --- Components ---

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{id: number, text: string, sender: 'user' | 'agent'}[]>([
    { id: 1, text: "Hi! Need urgent help or a quote? We're online.", sender: 'agent' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const text = inputValue;
    const newUserMsg = { id: Date.now(), text: text, sender: 'user' as const };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    // Send to backend
    sendToSupportEmail('New Website Chat Message', { message: text });

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Thanks. A technician has been notified. For immediate assistance, please call (317) 379-3141.", 
        sender: 'agent' 
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          >
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold text-sm">Live Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-80 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "max-w-[85%] p-3 text-sm rounded-lg",
                    msg.sender === 'user' 
                      ? "bg-orange-600 text-white self-end rounded-br-none" 
                      : "bg-white border border-slate-200 text-slate-800 self-start rounded-bl-none shadow-sm"
                  )}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
              <button 
                type="submit"
                className="bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="font-bold pr-1">{isOpen ? 'Close' : 'Chat Now'}</span>
      </button>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative bg-slate-900 text-white py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1635501108508-8ca1523a099e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRlY2huaWNpYW4lMjByZXBhaXJpbmclMjBwY3xlbnwxfHx8fDE3NjkwMzIzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
          alt="Computer Technician" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-500/50 rounded-full px-4 py-1 mb-6 text-orange-200 font-semibold text-sm">
             <Zap className="w-4 h-4 text-orange-500" />
             <span>Available for Ad-hoc & Urgent Service</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Reliable Computer Setup & Support — <span className="text-orange-500">Done Right</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            We help homes and small businesses set up, replace, move, and break down computers quickly and safely.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="tel:+13173793141" 
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-orange-500/20"
            >
              <Phone className="w-6 h-6" />
              Call Now
            </a>
            <a 
              href="sms:+13173793141" 
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              <MessageSquare className="w-6 h-6" />
              Text Us
            </a>
          </div>
          
          <div className="mt-8 flex items-center justify-center text-slate-400 gap-2">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Serving all of Indiana</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon: Icon, title, items, colorClass }: { icon: any, title: string, items: string[], colorClass: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden h-full flex flex-col"
  >
    <div className={cn("p-6 flex items-center gap-4", colorClass)}>
      <div className="p-3 bg-white/20 rounded-lg">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <div className="p-6 flex-grow">
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-slate-700">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const Services = () => {
  const services = [
    {
      icon: Monitor,
      title: "Computer Setup & Installation",
      colorClass: "bg-blue-600",
      items: [
        "New desktop or PC setup",
        "Monitor, keyboard, mouse connection",
        "Printer & peripheral setup",
        "Software installation & basic config"
      ]
    },
    {
      icon: RefreshCcw,
      title: "Replacement & Upgrades",
      colorClass: "bg-indigo-600",
      items: [
        "Old PC removal & data transfer",
        "New PC installation",
        "Hardware swaps (RAM, drives)",
        "System migration assistance"
      ]
    },
    {
      icon: Printer,
      title: "Office Equipment Installs",
      colorClass: "bg-teal-600",
      items: [
        "Complete office IT set-up",
        "Printer, Scanner & Copier setup",
        "Bulk equipment unboxing & placement",
        "Server rack & network gear install"
      ]
    },
    {
      icon: Trash2,
      title: "Breakdown & Teardown",
      colorClass: "bg-slate-700",
      items: [
        "Safe disassembly & cable removal",
        "Office shutdowns or relocations",
        "Equipment prep for recycling",
        "Hard drive destruction preparation"
      ]
    },
    {
      icon: Wrench,
      title: "On-Site Desktop Support",
      colorClass: "bg-orange-600",
      items: [
        "Troubleshooting basic issues",
        "Cable management & organization",
        "Network & Wi-Fi setup",
        "General non-enterprise tech help"
      ]
    }
  ];

  return (
    <section className="py-20 bg-slate-50" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Core Services</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Simple rule of thumb: If it involves touching a computer or office equipment physically, this is our job.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-md">
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhoWeServe = () => {
  const clients = [
    "Home users", "Home offices", "Small businesses", "Government offices",
    "Offices moving or upgrading", "Property managers", "Hospitals & Clinics", "Schools & Non-profits"
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1761446812468-d88eef0d01da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBjb21wdXRlciUyMHNldHVwfGVufDF8fHx8MTc2OTAzMjMzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="Modern Office Setup" 
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Who We Serve</h2>
            <p className="text-lg text-slate-600 mb-8">
              We provide hands-on IT support for anyone who needs reliable physical computer assistance. No job is too small.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {clients.map((client, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-800 font-medium">
                  <ArrowRight className="w-4 h-4 text-orange-500" />
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Transparent Pricing</h2>
        <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto">
          We don't hide our rates. Rough estimates to filter out the noise.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-slate-200 mb-2">PC Setup</h3>
            <div className="text-4xl font-extrabold text-orange-500 mb-4">Starting at $99</div>
            <p className="text-slate-400">Perfect for single new computer installations at home or office.</p>
          </div>
          
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-600 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">Replacement / Swap</h3>
            <div className="text-4xl font-extrabold text-orange-500 mb-4">Starting at $149</div>
            <p className="text-slate-400">Includes removal of old unit and setup of new one.</p>
          </div>
          
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-slate-200 mb-2">Hourly Support</h3>
            <div className="text-4xl font-extrabold text-orange-500 mb-4">$85 / hr</div>
            <p className="text-slate-400">For troubleshooting, cable management, and general on-site help.</p>
          </div>
        </div>
        
        <p className="mt-8 text-slate-400 text-sm">
          * Final quote provided before work begins. No hidden fees. Ad-hoc and urgent service rates may vary.
        </p>
      </div>
    </section>
  );
};

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const emailSent = await sendToSupportEmail(`New Service Request from ${data.name}`, {
      name: data.name,
      location: data.location,
      preferred_time: data.time || 'Not specified',
      details: data.details
    });
    setIsSubmitting(false);
    if (emailSent) {
      alert("Request Sent! We will contact you shortly.");
      reset();
    } else {
      alert("Sorry, your request could not be sent. Please call or text (317) 379-3141.");
    }
  };

  return (
    <section className="py-20 bg-slate-50" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-slate-900 p-8 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
              <p className="text-slate-300 mb-8">
                Ready to get started? Call, text, or fill out the form.
              </p>
              
              <div className="space-y-6">
                <a href="tel:+13173793141" className="flex items-center gap-4 hover:text-orange-400 transition-colors">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Call or Text</p>
                    <p className="font-bold text-lg">(317) 379-3141</p>
                  </div>
                </a>

                <a href="mailto:support@indianapcservices.com" className="flex items-center gap-4 hover:text-orange-400 transition-colors">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Email Us</p>
                    <p className="font-bold text-base md:text-lg break-words leading-tight">support@indianapcservices.com</p>
                  </div>
                </a>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Hours</p>
                    <p className="font-bold">Mon-Fri: 8am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Area</p>
                    <p className="font-bold">Greater Indiana Area</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 md:mt-0">
              <p className="text-sm text-slate-500">Local • Reliable • On-Site</p>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8 md:p-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Request Service</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input 
                  {...register("name", { required: true })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your Name"
                />
                {errors.name && <span className="text-red-500 text-xs">Name is required</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input 
                    {...register("location", { required: true })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="City / Zip"
                  />
                  {errors.location && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                  <input 
                    {...register("time")}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Morning, ASAP"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">What do you need help with?</label>
                <textarea 
                  {...register("details", { required: true })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all h-32"
                  placeholder="Describe the job (e.g. Need to set up 3 new Dell desktops in my office)"
                ></textarea>
                {errors.details && <span className="text-red-500 text-xs">Please describe your request</span>}
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
    <div className="container mx-auto px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Server className="w-6 h-6 text-orange-500" />
        <span className="text-xl font-bold text-white">Indiana PC Services</span>
      </div>
      <p className="mb-6">Set-up, decommissioning of end-use IT equipment</p>
      <div className="flex justify-center gap-8 text-sm mb-8">
        <span>© {newXZDate().getFullYear()} Indiana PC Services</span>
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
      <p className="text-xs text-slate-600">
        Local • Reliable • On-Site Support
      </p>
    </div>
  </footer>
);

// Helper for date to avoid hydration mismatch if SSR (though this is SPA)
const newXZDate = () => new Date();

const App = () => {
  return (
    <div className="font-sans text-slate-900 bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Server className="w-8 h-8 text-orange-600" />
            <div>
              <div className="font-bold text-xl leading-none text-slate-900">Indiana PC Services</div>
              <div className="text-xs text-slate-500 font-medium hidden sm:block">Set-up, decommissioning of end-use IT equipment</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="tel:+13173793141" 
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call or Text</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Hero />
        <Services />
        <WhoWeServe />
        <section className="bg-orange-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Experienced & Hands-On</h3>
                <p className="text-orange-100 max-w-xs">Real technicians, not call centers. We show up and get it done.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fast & Reliable</h3>
                <p className="text-orange-100 max-w-xs">We value your time. Scheduled appointments that actually happen on time.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Fluff</h3>
                <p className="text-orange-100 max-w-xs">No jargon, no upselling. Just the tech support you need.</p>
              </div>
            </div>
          </div>
        </section>
        <Pricing />
        <ContactForm />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default App;
