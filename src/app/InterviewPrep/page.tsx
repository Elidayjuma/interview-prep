import Hero from "@/components/Hero";
import InputForm from './InputForm';
import WebLayout from "@/components/Layouts/WebLayout";

const CoverLetter: React.FC = () => {
    return (
        <WebLayout>
            <Hero
                form={<InputForm />}
                title={"Create Tailor-Made Interview Quizes"}
                subheading="Prepare for your next job interview like a pro." />
        </WebLayout>
    );
};

export default CoverLetter;
