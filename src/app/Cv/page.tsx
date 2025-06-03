import Hero from "@/components/Hero";
import InputForm from './InputForm';

const CoverLetter: React.FC = () => {
    return (
        <div>
            <Hero
                form={<InputForm />}
                title={"Create Tailor-Made CVs"}
                subheading="Create CVs tailor-made for your specific job application." />
        </div>
    );
};

export default CoverLetter;
