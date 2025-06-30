import Hero from "@/components/Hero";
import InputForm from './InputForm';
import WebLayout from "@/components/Layouts/WebLayout";

const CoverLetter: React.FC = () => {
    return (
        <WebLayout>
            <Hero
                form={<InputForm />}
                title={"Create Tailor-Made CVs"}
                subheading="Create CVs tailor-made for your specific job application." />
        </WebLayout>
    );
};

export default CoverLetter;
