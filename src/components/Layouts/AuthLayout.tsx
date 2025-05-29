import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Header always at the top */}
        <div className="px-4 py-2 mb-20">
            <header className="w-full">
                <Header />
            </header>
        </div>

        {/* Main content area centered and growing */}
        <main className="flex-grow flex justify-center px-4 py-8">
            <div className="w-full max-w-4xl rounded-sm p-5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                {children}
            </div>
        </main>

        {/* Footer always at the bottom */}
        <footer>
            <Footer />
        </footer>
    </div>
);

export default AuthLayout;
