'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import EditHomeContainer from './_components/edit-home-container';

const EditHomePage = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!window.daum?.Postcode) {
      const script = document.createElement('script');
      script.src =
        '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  return (
    <>
      <Script
        src='https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
        strategy='afterInteractive'
        onLoad={() => setScriptLoaded(true)}
      />
      {scriptLoaded && <EditHomeContainer />}
    </>
  );
};

export default EditHomePage;
