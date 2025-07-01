import { IPricing } from "@/types";

export const tiers: IPricing[] = [
    {
        name: 'Free',
        price: 0,
        features: [
            'Access to basic AI models',
            'Up to 10 prompts per month',
            'CV & cover letter generation',
            'Interview Q&A generation',
        ],
        link: 'https://interviewprep.elidayjuma.com/dashboard'
    },
    {
        name: 'Starter',
        price: 10,
        features: [
            'Access to best GPT model',
            'Up to 50 prompts per month',
            'CV & cover letter generation',
            'Interview Q&A generation',
        ],
        link: 'https://paystack.shop/pay/interviewprep_starter'
    },
    {
        name: 'Pro',
        price: 100,
        features: [
            'Unlimited prompts per month',
            'Access to best GPT model',
            'Annual access',
            'CV & cover letter generation',
            'Interview Q&A generation',
        ],
        link: 'https://paystack.shop/pay/interviewprep_pro'
    },
];