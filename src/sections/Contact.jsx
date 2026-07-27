import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedinIn, FaGithub, FaPaperPlane 
} from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { portfolioData } from "../constants/portfolioData";
import Toast from "../components/ui/Toast";

export default function Contact() {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message content is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSending(true);

    // Fallback Mock send if the user hasn't configured their actual keys yet
    if (portfolioData.emailJs.publicKey === "user_placeholder") {
      setTimeout(() => {
        setToast({
          show: true,
          message: "Demo Mode: Message simulated successfully! To activate actual email delivery, replace placeholder keys in src/constants/portfolioData.js.",
          type: "success"
        });
        setSending(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 1500);
      return;
    }

    emailjs
      .sendForm(
        portfolioData.emailJs.serviceId,
        portfolioData.emailJs.templateId,
        formRef.current,
        portfolioData.emailJs.publicKey
      )
      .then(
        () => {
          setToast({
            show: true,
            message: "Your message has been sent successfully! I'll get back to you shortly.",
            type: "success"
          });
          setSending(false);
          setFormData({ name: "", email: "", subject: "", message: "" });
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setToast({
            show: true,
            message: "Oops! Something went wrong while sending the message. Please try again later.",
            type: "error"
          });
          setSending(false);
        }
      );
  };

  return (
    <section id="contact" className="py-24 px-6 relative bg-bg-black overflow-hidden border-t border-white/5">
      {/* Background gradients */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-brand-purple/5 blur-[120px] top-[20%] right-[-100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            Get In <span className="text-gradient text-gradient-purple-pink">Touch</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[3px] bg-gradient-to-r from-brand-purple to-brand-magenta mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold text-slate-205 mb-4">Contact Information</h3>
            <p className="text-slate-450 mb-8 leading-relaxed">
              Have an exciting project idea, looking to hire a full-stack engineer, or want to discuss machine learning models? Feel free to drop a message or reach out through these channels!
            </p>

            {/* Email Card */}
            <a href={`mailto:${portfolioData.contact.email}`} className="flex items-center gap-5 p-5 rounded-2xl glass border border-white/5 hover:border-brand-cyan/20 transition-all duration-300 group">
              <span className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-slate-350 text-xl group-hover:text-brand-cyan group-hover:border-brand-cyan/20 transition-colors">
                <FaEnvelope />
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Me</h4>
                <p className="text-sm font-semibold text-slate-200 truncate">{portfolioData.contact.email}</p>
              </div>
            </a>

            {/* Phone Card */}
            <a href={`tel:${portfolioData.contact.phone}`} className="flex items-center gap-5 p-5 rounded-2xl glass border border-white/5 hover:border-brand-blue/20 transition-all duration-300 group">
              <span className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-slate-350 text-xl group-hover:text-brand-blue group-hover:border-brand-blue/20 transition-colors">
                <FaPhone />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Call Me</h4>
                <p className="text-sm font-semibold text-slate-200">{portfolioData.contact.phone}</p>
              </div>
            </a>

            {/* Location Card */}
            <div className="flex items-center gap-5 p-5 rounded-2xl glass border border-white/5">
              <span className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-slate-350 text-xl">
                <FaMapMarkerAlt />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Location</h4>
                <p className="text-sm font-semibold text-slate-200">{portfolioData.contact.location}</p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-6 sm:p-8 border border-white/5 space-y-6"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`px-4 py-3 rounded-xl glass border text-sm text-slate-200 focus:outline-none focus:ring-1 transition-all ${
                      errors.name ? "border-rose-500/50 focus:ring-rose-500/20" : "border-white/5 focus:border-brand-purple/50 focus:ring-brand-purple/20"
                    }`}
                  />
                  {errors.name && <span className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`px-4 py-3 rounded-xl glass border text-sm text-slate-200 focus:outline-none focus:ring-1 transition-all ${
                      errors.email ? "border-rose-500/50 focus:ring-rose-500/20" : "border-white/5 focus:border-brand-purple/50 focus:ring-brand-purple/20"
                    }`}
                  />
                  {errors.email && <span className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">{errors.email}</span>}
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col">
                <label htmlFor="subject" className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`px-4 py-3 rounded-xl glass border text-sm text-slate-200 focus:outline-none focus:ring-1 transition-all ${
                    errors.subject ? "border-rose-500/50 focus:ring-rose-500/20" : "border-white/5 focus:border-brand-purple/50 focus:ring-brand-purple/20"
                  }`}
                />
                {errors.subject && <span className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">{errors.subject}</span>}
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label htmlFor="message" className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`px-4 py-3 rounded-xl glass border text-sm text-slate-200 focus:outline-none focus:ring-1 transition-all resize-none ${
                    errors.message ? "border-rose-500/50 focus:ring-rose-500/20" : "border-white/5 focus:border-brand-purple/50 focus:ring-brand-purple/20"
                  }`}
                />
                {errors.message && <span className="text-[10px] text-rose-500 font-bold mt-1.5 ml-1">{errors.message}</span>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 rounded-xl font-bold text-sm tracking-widest bg-gradient-to-r from-brand-purple to-brand-magenta text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-magenta/15 active:scale-[0.98] transition-transform duration-100 disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    SENDING MESSAGE...
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={13} />
                    SEND MESSAGE
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Toast Notification popup */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </section>
  );
}
