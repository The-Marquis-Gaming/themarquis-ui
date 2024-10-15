"use client";
import React from "react";
import "./styles/styles.css";
import { Footer } from "~~/components/Footer";
import LandingPage from "~~/components/Landingpage";

export default function Home() {
  return (
    <div className="lasserit-font">
      <LandingPage />
      <Footer />
    </div>
  );
}
