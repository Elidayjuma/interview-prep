import DashLayout from "@/components/Layouts/DashLayout";
import Hero from "./component/Hero";
import InputForm from './component/InputForm';

export default function DashboardPage() {
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