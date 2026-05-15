'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashLayout from "@/components/Layouts/DashLayout";
import Hero from "./component/Hero";
import InputForm from './component/InputForm';
import { returnLogedIUser } from "@/actions/actions";

function isResumeComplete(user: any) {
    if (!user) return false;
    if (
        !user.userDetail ||
        !user.userDetail.careerTitle ||
        !user.userDetail.professionalSummary ||
        !user.educations || user.educations.length === 0 ||
        !user.experiences || user.experiences.length === 0 ||
        !user.skills || user.skills.length === 0 ||
        !user.tools || user.tools.length === 0 ||
        !user.Hobby || user.Hobby.length === 0
    ) {
        return false;
    }
    return true;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            let userObj: any = window.localStorage.getItem("user");
            userObj = JSON.parse(userObj);
            
            if (!userObj) {
                const logedUser: any = await returnLogedIUser();
                userObj = logedUser;
                window.localStorage.setItem("user", JSON.stringify(logedUser));
            }
            setUser(userObj);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (user && !isResumeComplete(user)) {
            setShowPrompt(true);
        } else {
            setShowPrompt(false);
        }
    }, [user]);

    return (
        <DashLayout>
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
                {showPrompt ? (
                    <div className="flex flex-col items-center justify-center py-16 px-8 bg-white rounded-3xl shadow-2xl border border-gray-50 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Complete Your Profile</h2>
                        <p className="text-gray-600 max-w-lg mb-10 text-lg leading-relaxed">
                            To start tailoring your resume for specific job applications, you need to provide your professional details first.
                        </p>
                        <button
                            onClick={() => router.push("/dashboard/resume-builder")}
                            className="bg-primary hover:bg-primary/90 text-black px-10 py-4 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                        >
                            Build My Resume
                        </button>
                    </div>
                ) : (
                    <Hero
                        form={<InputForm />}
                        title={"Lets tailor that Resume!"}
                        subheading="Create CVs tailor-made for your specific job application." />
                )}
            </div>
        </DashLayout>
    );
}