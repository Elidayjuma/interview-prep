import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading: "Ace your next interview beyond imagination.",
    quickLinks: [
        {
            text: "Blogs",
            url: "https://elidayjuma.com/blog"
        },
        {
            text: "Startups",
            url: "https://elidayjuma.com/category/startups/"
        },
        {
            text: "Resources",
            url: "https://elidayjuma.com/startup-resources/"
        },
    ],
    email: 'elidayjuma@gmail.com',
    telephone: 'not today',
    socials: {
        // github: 'https://github.com',
        // x: 'https://twitter.com/x',
        twitter: 'https://x.com/elidayjuma',
        facebook: 'https://facebook.com',
        // youtube: 'https://youtube.com',
        linkedin: 'https://www.linkedin.com',
        // threads: 'https://www.threads.net',
        instagram: 'https://www.instagram.com',
    }
}