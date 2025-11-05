// 'use client';
// import Script from 'next/script';
// import React from 'react';

// interface LanguageSelectorProps {
//   onChange: (value: string) => void;
//   value: string;
// }

// declare global {
//   interface Window {
//     google: any;
//     googleTranslateElementInit: () => void;
//   }
// }

// const languages = [
//   { label: 'English', value: 'en', src: 'https://flagcdn.com/h60/us.png' },
//   { label: 'Urdu', value: 'ur', src: 'https://flagcdn.com/h60/pk.png' },
//   { label: 'French', value: 'fr', src: 'https://flagcdn.com/h60/fr.png' },
//   { label: 'Spanish', value: 'es', src: 'https://flagcdn.com/h60/es.png' },
//   { label: 'Arabic', value: 'ar', src: 'https://flagcdn.com/h60/sa.png' },
//   // Add additional languages as needed
// ];

// const includedLanguages = languages.map((lang) => lang.value).join(',');

// function googleTranslateElementInit() {
//   new window.google.translate.TranslateElement(
//     {
//       pageLanguage: 'auto',
//       includedLanguages,
//     },
//     'google_translate_element',
//   );
// }

// function LanguageSelector({ onChange, value }: LanguageSelectorProps) {
//   const langCookie = value.split('/')[2];
//   return (
//     <select
//       onChange={(e) => onChange(e.target.value)}
//       value={langCookie}
//       className="bg-transparent outline-none border border-black"
//     >
//       {languages.map((it) => (
//         <option value={it.value} key={it.value}>
//           {it.label}
//         </option>
//       ))}
//     </select>
//   );
// }

// export function GoogleTranslate({
//   prefLangCookie,
// }: {
//   prefLangCookie: string;
// }) {
//   const [langCookie, setLangCookie] = React.useState(
//     decodeURIComponent(prefLangCookie),
//   );

//   React.useEffect(() => {
//     window.googleTranslateElementInit = googleTranslateElementInit;
//   }, []);

//   const onChange = (value: string) => {
//     const lang = '/en/' + value;
//     setLangCookie(lang);
//     const element = document.querySelector(
//       '.goog-te-combo',
//     ) as HTMLSelectElement;
//     element.value = value;
//     element.dispatchEvent(new Event('change'));
//   };

//   return (
//     <div>
//       <div
//         id="google_translate_element"
//         style={{ visibility: 'hidden', width: '1px', height: '1px' }}
//       ></div>
//       <LanguageSelector onChange={onChange} value={langCookie} />
//       <Script
//         src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//         strategy="afterInteractive"
//       />
//     </div>
//   );
// }
