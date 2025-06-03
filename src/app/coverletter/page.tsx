import Hero from "@/components/Hero";
import InputForm from './InputForm';

const CoverLetter: React.FC = () => {
    return (
        <div>
            <Hero
                form={<InputForm />}
                title={"Create Worldclass Cover Letters"}
                subheading="Generate a cover letter that stands out and wins jobs." />
        </div>
    );
};

export default CoverLetter;
