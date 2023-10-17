'use client';

import { useState } from 'react';
import React from 'react';
import Spinner from '../Spinner';
import Alert from '../Alert';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isLoading, setLoading] = useState<boolean>();
  const [alertMessage, setAlertMessage] = useState<string>('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const sendMail = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          formData,
        }),
      });
      if (response.ok) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setAlertMessage('success');
      }
    } catch (error) {
      console.log(error);
      setAlertMessage('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alertMessage && (
        <Alert
          category={alertMessage}
          text={
            alertMessage === 'success'
              ? 'Message Sent Successfully!'
              : 'There is a error sending the message please try sending it again.'
          }
          onClick={() => setAlertMessage('')}
        />
      )}
      <form onSubmit={sendMail} className="flex flex-col gap-5">
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border-0 border-b py-3 px-2 focus:outline-none"
        />

        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border-0 border-b py-3 px-2 focus:outline-none"
        />

        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="border-0 border-b py-3 px-2 focus:outline-none"
        />

        <textarea
          id="message"
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="border py-3 px-2 focus:outline-none mt-3"
        />

        <button
          type="submit"
          className="bg-primary2 text-white py-3 md:w-[180px] w-[150px] font-neue
        rounded-full md:mt-3 flex justify-center md:text-base text-sm"
        >
          {isLoading ? <Spinner /> : 'SEND MESSAGE'}
        </button>
      </form>
    </>
  );
};

export default ContactForm;
