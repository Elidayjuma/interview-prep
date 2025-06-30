'use client';
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

import { heroDetails } from '@/data/hero';

const Hero: React.FC = () => {
    return (
        <section
            id="hero"
            className="relative flex items-center justify-center pb-0 pt-6 md:pt-10 px-5 min-h-[80vh]"
        >
            <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
                <div className="absolute inset-0 h-full w-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
                </div>
            </div>

            <div className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)]">
            </div>

            <div className="text-center w-[80vw] mx-auto">
                <h1 className="text-4xl md:text-6xl md:leading-tight font-bold text-foreground">
                    <Typewriter
                        words={[heroDetails.heading]}
                        loop={1}
                        cursor
                        cursorStyle="|"
                        typeSpeed={100}
                        deleteSpeed={50}
                        delaySpeed={7000}
                    />
                </h1>
                <p className="mt-4 text-foreground">{heroDetails.subheading}</p>
                <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row justify-center mt-6">
                    <a
                        href="/auth/signup"
                        rel="noopener"
                        className="px-8 py-4 text-lg font-medium text-center text-white bg-primary rounded-md "
                    >
                        Get Started for Free
                    </a>
                </div>
            </div>
        </section>
    );
};


export default Hero;

