import { useEffect, useState } from "react";

function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

const ResumePreviewSection = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        let userObj: any = window.localStorage.getItem("user");
        userObj = JSON.parse(userObj);
        setUser(userObj);
    }, []);

    if (!user) return <div className="text-center py-10">Loading resume...</div>;

    const { userDetail, educations, experiences, skills, tools, Hobby } = user;

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 print:p-0 print:shadow-none print:bg-transparent">
            {/* Header */}
            <div className="flex flex-col items-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                {userDetail?.careerTitle && (
                    <h2 className="text-lg font-semibold text-secondary">{userDetail.careerTitle}</h2>
                )}
                <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm justify-center">
                    {userDetail?.phoneNumber && <span>📞 {userDetail.phoneNumber}</span>}
                    {user.email && <span>✉️ {user.email}</span>}
                    {userDetail?.linkedinUrl && (
                        <a href={userDetail.linkedinUrl} target="_blank" rel="noopener noreferrer" className="underline">
                            LinkedIn
                        </a>
                    )}
                    {userDetail?.githubUrl && (
                        <a href={userDetail.githubUrl} target="_blank" rel="noopener noreferrer" className="underline">
                            GitHub
                        </a>
                    )}
                    {userDetail?.portfolioUrl && (
                        <a href={userDetail.portfolioUrl} target="_blank" rel="noopener noreferrer" className="underline">
                            Portfolio
                        </a>
                    )}
                    {userDetail?.twitterUrl && (
                        <a href={userDetail.twitterUrl} target="_blank" rel="noopener noreferrer" className="underline">
                            Twitter
                        </a>
                    )}
                </div>
            </div>

            {/* Professional Summary */}
            {userDetail?.professionalSummary && (
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-1 text-secondary">Professional Summary</h3>
                    <p className="text-gray-800">{userDetail.professionalSummary}</p>
                </section>
            )}

            {/* Education */}
            {educations?.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-1 text-secondary">Education</h3>
                    <ul className="space-y-2">
                        {educations.map((edu: any) => (
                            <li key={edu.id} className="border-b pb-2">
                                <div className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</div>
                                <div className="text-gray-700">{edu.institution}</div>
                                <div className="text-gray-500 text-sm">
                                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : "Present"}
                                    {edu.grade && <> | Grade: {edu.grade}</>}
                                </div>
                                {edu.description && <div className="text-gray-600">{edu.description}</div>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Experience */}
            {experiences?.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-1 text-secondary">Experience</h3>
                    <ul className="space-y-2">
                        {experiences.map((exp: any) => (
                            <li key={exp.id} className="border-b pb-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold">{exp.position}</span>
                                    <span className="text-gray-700">@ {exp.company}</span>
                                    {exp.location && <span className="text-gray-500">({exp.location})</span>}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                                </div>
                                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                                    <ul className="list-disc list-inside mt-1 text-gray-700">
                                        {exp.responsibilities.map((r: string, idx: number) => (
                                            <li key={idx}>{r}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-1 text-secondary">Skills</h3>
                    <ul className="flex flex-wrap gap-2">
                        {skills.map((skill: any) => (
                            <li key={skill.id} className="bg-primary/10 text-secondary px-3 py-1 rounded-full text-sm">
                                {skill.name}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Tools */}
            {tools?.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-1 text-secondary">Tools & Tech Stack</h3>
                    <ul className="flex flex-wrap gap-2">
                        {tools.map((tool: any) => (
                            <li key={tool.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {tool.name}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Hobbies */}
            {Hobby?.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-1 text-secondary">Hobbies</h3>
                    <ul className="flex flex-wrap gap-2">
                        {Hobby.map((hobby: any) => (
                            <li key={hobby.id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                {hobby.name}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default ResumePreviewSection;