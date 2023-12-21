import React, { useState } from "react";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socials from "../content/socials";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
    loading: false,
  });

  const contactConfig = {
    YOUR_EMAIL: "akashramesh2607@gmail.com",
    YOUR_SERVICE_ID: "service_s5e8h51",
    YOUR_TEMPLATE_ID: "template_krn89kb",
    YOUR_USER_ID: "zBPSC-x8Y0gDdYDc6",
    Address: "39, north car street,Thiruporur, chennai, india-603110",
    phone: "+91 7200627262",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, loading: true });

    try {
      const templateParams = {
        from_name: formData.email,
        user_name: formData.name,
        to_name: contactConfig.YOUR_EMAIL,
        message: formData.message,
      };

      const result = await emailjs.send(
        contactConfig.YOUR_SERVICE_ID,
        contactConfig.YOUR_TEMPLATE_ID,
        templateParams,
        contactConfig.YOUR_USER_ID
      );

      console.log(result.text);

      setFormData({ ...formData, loading: false });
      toast.success("SUCCESS! Looking forward to reading your email.");
    } catch (error) {
      console.error(error.text);
      setFormData({ ...formData, loading: false });
      toast.error(`Failed to send! ${error.text}`);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="contact-section">
      <div className="contact-info">
        <h1>Let&apos;s talk about everything!</h1>
        <p>
          Don&apos;t like forms? Send me an{" "}
          <a href="mailto:akashramesh2607@gmail.com">email</a> 👋
          <br />
          <br />
          <h3>Or find me on:</h3>
          <div className="hero-socials">
            {socials.map((social, index) => (
              <a key={index} href={social.url}>
                <img src={`/socials/${social.icon}`} alt="" />
              </a>
            ))}
          </div>
        </p>
        <div>
          <p className="contact-links">
            <MdEmail />
            {contactConfig.YOUR_EMAIL}
          </p>
          <br />
          <p className="contact-links">
            <FaPhoneAlt />
            {contactConfig.phone}
          </p>
          <br />
          <p className="contact-links">
            <IoLocation />
            {contactConfig.Address}
          </p>
          <br />
          
        </div>
      </div>
      <div className="contact-form">
        <form name="contact" onSubmit={handleSubmit}>
          <input
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name || ""}
            type="text"
            required
            onChange={handleChange}
          />
          <input
            id="email"
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email || ""}
            required
            onChange={handleChange}
          />
          <textarea
            id="message"
            name="message"
            placeholder="Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button className="send-btn" type="submit">
            {formData.loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ContactForm;
