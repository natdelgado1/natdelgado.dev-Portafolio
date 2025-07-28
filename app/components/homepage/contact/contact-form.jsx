"use client";
// @flow strict
import { isValidEmail } from '@/utils/check-email';
import emailjs from '@emailjs/browser';
import { useState, useEffect } from 'react';
import { TbMailForward } from "react-icons/tb";
import { toast } from 'react-toastify';

function ContactForm() {
  const [input, setInput] = useState({
    from_name: '',
    email_id: '',
    message: '',
  });
  const [error, setError] = useState({
    email_id: false,
    required: false,
  });

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
  }, []);

  const checkRequired = () => {
    if (input.email_id && input.message && input.from_name) {
      setError({ ...error, required: false });
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    
    if (!input.email_id || !input.message || !input.from_name) {
      setError({ ...error, required: true });
      return;
    } else if (error.email_id) {
      return;
    } else {
      setError({ ...error, required: false });
    };

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    
         // Debug en producción - V2
     console.log('=== DEBUG EN PRODUCCIÓN V2 ===');
     console.log('Service ID:', serviceID);
     console.log('Template ID:', templateID);
     console.log('Public Key:', publicKey);
     console.log('Todas las variables NEXT_PUBLIC:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
    
    if (!publicKey) {
      toast.error('Error: Public key no encontrada. Verifica tu archivo .env');
      return;
    }
    
    try {
      const res = await emailjs.send(serviceID, templateID, input, publicKey);

      if (res.status === 200) {
        toast.success('¡Mensaje enviado exitosamente!');
        setInput({
          from_name: '',
          email_id: '',
          message: '',
        });
      };
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
    };
  };

  return (
    <div className="">
      <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
        Contacta conmigo
      </p>
      <div className="max-w-3xl text-white rounded-lg border border-[#464c6a] p-3 lg:p-5">
        <p className="text-sm text-[#d3d8e8]">
          {"Si tiene alguna pregunta o inquietud, no dude en ponerse en contacto conmigo. Estoy abierta a cualquier oportunidad de trabajo que se alinee con mis habilidades e intereses."}
        </p>
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <label className="text-base">Tu Nombre: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="text"
              maxLength="100"
              required={true}
              onChange={(e) => setInput({ ...input, from_name: e.target.value })}
              onBlur={checkRequired}
              value={input.from_name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Tu Email: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="email"
              maxLength="100"
              required={true}
              value={input.email_id}
              onChange={(e) => setInput({ ...input, email_id: e.target.value })}
              onBlur={() => {
                checkRequired();
                setError({ ...error, email_id: !isValidEmail(input.email_id) });
              }}
            />
            {error.email_id &&
              <p className="text-sm text-red-400">Please provide a valid email!</p>
            }
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Tu Mensaje: </label>
            <textarea
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              maxLength="500"
              name="message"
              required={true}
              onChange={(e) => setInput({ ...input, message: e.target.value })}
              onBlur={checkRequired}
              rows="4"
              value={input.message}
            />
          </div>
          <div className="flex flex-col gap-2 items-center">
            {error.required &&
              <p className="text-sm text-red-400">
                Nombre, Email y Mensaje son requeridos!
              </p>
            }
            <button
              className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 md:px-12 py-2.5 md:py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
              role="button"
              onClick={handleSendMail}
            >
              <span>ENVIAR MENSAJE</span>
              <TbMailForward className="mt-1" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;