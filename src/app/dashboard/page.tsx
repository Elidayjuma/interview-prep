'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashLayout from "@/components/Layouts/DashLayout";
import Hero from "./component/Hero";
import InputForm from './component/InputForm';
import { returnLogedIUser } from "@/actions/actions";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const fetchUser = async () => {
            // setPageLoading(true);
            let user: any = window.localStorage.getItem("user")
            user = JSON.parse(user)
            setUser(user);
            if (!user) {
                const logedUser: any = await returnLogedIUser();
                setUser(logedUser);

                window.localStorage.setItem("user", JSON.stringify(logedUser))
            }
            // setPageLoading(false);

        };
        fetchUser();
    }, []);
    if (!user?.userDetail) router.push("/dashboard/resume-builder");
    return (
        <DashLayout>
            <div className="max-w-4xl mx-auto py-8 px-2 sm:px-4">
                <Hero
                    form={<InputForm />}
                    title={"Lets tailor that Resume!"}
                    subheading="Create CVs tailor-made for your specific job application." />
            </div>
        </DashLayout>
    );
}