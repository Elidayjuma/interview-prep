import DashLayout from "@/components/Layouts/DashLayout";

const jobResources = [
    {
        country: "Global / Remote",
        flag: "🌎",
        description: "Best for remote-first roles across the world.",
        links: [
            { name: "Remote OK", url: "https://remoteok.com/" },
            { name: "We Work Remotely", url: "https://weworkremotely.com/" },
            { name: "Wellfound (AngelList)", url: "https://wellfound.com/" },
            { name: "Otta", url: "https://otta.com/" }
        ]
    },
    {
        country: "USA",
        flag: "🇺🇸",
        description: "The biggest market for tech and corporate roles.",
        links: [
            { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" },
            { name: "Indeed USA", url: "https://www.indeed.com/" },
            { name: "Glassdoor", url: "https://www.glassdoor.com/Job/" },
            { name: "ZipRecruiter", url: "https://www.ziprecruiter.com/" }
        ]
    },
    {
        country: "UK",
        flag: "🇬🇧",
        description: "Top UK boards for local and sponsorship roles.",
        links: [
            { name: "Reed.co.uk", url: "https://www.reed.co.uk/" },
            { name: "Totaljobs", url: "https://www.totaljobs.com/" },
            { name: "CV-Library", url: "https://www.cv-library.co.uk/" },
            { name: "LinkedIn UK", url: "https://www.linkedin.com/jobs/jobs-in-united-kingdom/" }
        ]
    },
    {
        country: "Canada",
        flag: "🇨🇦",
        description: "Great for relocation and local opportunities.",
        links: [
            { name: "Workopolis", url: "https://www.workopolis.com/" },
            { name: "Indeed Canada", url: "https://ca.indeed.com/" },
            { name: "Job Bank", url: "https://www.jobbank.gc.ca/" },
            { name: "LinkedIn Canada", url: "https://www.linkedin.com/jobs/jobs-in-canada/" }
        ]
    },
    {
        country: "India",
        flag: "🇮🇳",
        description: "The hub for tech and engineering talent.",
        links: [
            { name: "Naukri", url: "https://www.naukri.com/" },
            { name: "Indeed India", url: "https://in.indeed.com/" },
            { name: "Foundit (Monster India)", url: "https://www.foundit.in/" },
            { name: "LinkedIn India", url: "https://www.linkedin.com/jobs/jobs-in-india/" }
        ]
    },
    {
        country: "Kenya",
        flag: "🇰🇪",
        description: "East Africa's leading job platforms.",
        links: [
            { name: "BrighterMonday", url: "https://www.brightermonday.co.ke/" },
            { name: "Fuzu", url: "https://www.fuzu.com/kenya" },
            { name: "MyJobMag Kenya", url: "https://www.myjobmag.co.ke/" },
            { name: "LinkedIn Kenya", url: "https://www.linkedin.com/jobs/jobs-in-kenya/" }
        ]
    },
    {
        country: "Philippines",
        flag: "🇵🇭",
        description: "Best for BPO, tech, and remote outsourcing.",
        links: [
            { name: "JobStreet", url: "https://www.jobstreet.com.ph/" },
            { name: "Indeed Philippines", url: "https://ph.indeed.com/" },
            { name: "Kalibrr", url: "https://www.kalibrr.com/" },
            { name: "LinkedIn Philippines", url: "https://www.linkedin.com/jobs/jobs-in-philippines/" }
        ]
    },
    {
        country: "Germany",
        flag: "🇩🇪",
        description: "Focus on Europe's largest industrial economy.",
        links: [
            { name: "StepStone", url: "https://www.stepstone.de/" },
            { name: "Indeed Germany", url: "https://de.indeed.com/" },
            { name: "Xing Jobs", url: "https://www.xing.com/jobs" },
            { name: "LinkedIn Germany", url: "https://www.linkedin.com/jobs/jobs-in-germany/" }
        ]
    },
    {
        country: "Italy",
        flag: "🇮🇹",
        description: "Leading boards for the Italian job market.",
        links: [
            { name: "Indeed Italy", url: "https://it.indeed.com/" },
            { name: "InfoJobs", url: "https://www.infojobs.it/" },
            { name: "LinkedIn Italy", url: "https://www.linkedin.com/jobs/jobs-in-italy/" }
        ]
    },
    {
        country: "Australia",
        flag: "🇦🇺",
        description: "Top resources for the ANZ region.",
        links: [
            { name: "SEEK", url: "https://www.seek.com.au/" },
            { name: "Indeed Australia", url: "https://au.indeed.com/" },
            { name: "Jora", url: "https://au.jora.com/" },
            { name: "LinkedIn Australia", url: "https://www.linkedin.com/jobs/jobs-in-australia/" }
        ]
    }
];

export default function JobsPage() {
    return (
        <DashLayout>
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
                <header className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Global Job Search Hub
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        We've curated the best job boards and resources from around the world to help you find your next role faster. Select a region to start your search.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobResources.map((resource, idx) => (
                        <div 
                            key={idx} 
                            className="group bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 animate-in fade-in zoom-in"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl">{resource.flag}</span>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                        {resource.country}
                                    </h2>
                                </div>
                            </div>
                            
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                {resource.description}
                            </p>

                            <div className="space-y-3">
                                {resource.links.map((link, lIdx) => (
                                    <a
                                        key={lIdx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-slate-700 font-semibold hover:bg-primary hover:text-black transition-all active:scale-95 group/link"
                                    >
                                        <span>{link.name}</span>
                                        <svg 
                                            className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-center text-white overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Want more tailored results?</h3>
                        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                            Use our AI Resume Tailor to optimize your profile for specific roles found on these platforms.
                        </p>
                        <a 
                            href="/dashboard" 
                            className="inline-flex items-center gap-2 bg-primary text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-transform"
                        >
                            Back to Dashboard
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7m0 0l-7 7" />
                            </svg>
                        </a>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                </footer>
            </div>
        </DashLayout>
    );
}
