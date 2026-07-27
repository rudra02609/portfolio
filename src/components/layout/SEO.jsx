import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, url, image }) {
  const defaultTitle = "Rudra Prajapati | Premium AIML & Web Portfolio";
  const defaultDesc = "B.Tech AIML Student at CHARUSAT University. Crafting intelligent applications, regression pipelines, data visualizer dashboards, and high-performance Web Apps.";
  const defaultUrl = window.location.origin;
  const defaultImg = `${defaultUrl}/favicon.svg`;

  const finalTitle = title ? `${title} | Rudra Prajapati` : defaultTitle;
  const finalDesc = description || defaultDesc;
  const finalUrl = url || defaultUrl;
  const finalImg = image || defaultImg;

  return (
    <Helmet>
      {/* General Metadata */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDesc} />
      <meta name="author" content="Rudra Prajapati" />
      <meta name="keywords" content="Rudra Prajapati, Rudra, Prajapati, Portfolio, AIML, Machine Learning, React, Python, Web Developer, CHARUSAT University, Software Developer" />
      <meta name="theme-color" content="#020204" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={finalImg} />

      {/* Twitter Card */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDesc} />
      <meta property="twitter:image" content={finalImg} />
      
      {/* Accessibility tags */}
      <html lang="en" />
    </Helmet>
  );
}
