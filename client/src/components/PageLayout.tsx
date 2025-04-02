import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
  subtitle?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, subtitle }) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <header className="mb-10">
        <Header subtitle={subtitle} />
      </header>
      {children}
      <Footer />
    </div>
  );
};

export default PageLayout;
