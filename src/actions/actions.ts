"use server";

import prisma from "@/lib/db";
import { session_data } from "../middleware";

export async function returnLogedIUser() {
    const logeduser = await session_data();
    if (!logeduser) {
        return undefined
    }

    const userId = parseInt(logeduser?.userId as string, 10);
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userDetail: true,
            educations: true,
            experiences: true,
            skills: true,
            tools: true,
            Hobby: true,
        },
    });

    if (!user) return undefined;

    const { password, ...safeUser } = user;
    return safeUser;
}

export async function upsertUserDetail(data: {
    userId: number;
    careerTitle?: string;
    professionalSummary?: string;
    phoneNumber?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    twitterUrl?: string;
}) {
    return prisma.userDetail.upsert({
        where: { userId: data.userId },
        update: { ...data },
        create: { ...data },
    });
}

export async function upsertEducation(data: {
    id?: number; // Optional, for update
    userId: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date | string;
    endDate?: Date | string;
    grade?: string;
    description?: string;
}) {
    return prisma.education.upsert({
        where: { id: data.id ?? 0 }, // If id is not provided, upsert will create
        update: {
            institution: data.institution,
            degree: data.degree,
            fieldOfStudy: data.fieldOfStudy,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            grade: data.grade,
            description: data.description,
            userId: data.userId,
        },
        create: {
            institution: data.institution,
            degree: data.degree,
            fieldOfStudy: data.fieldOfStudy,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            grade: data.grade,
            description: data.description,
            userId: data.userId,
        },
    });
}

export async function deleteEducation(id: number) {
    return prisma.education.delete({
        where: { id },
    });
}

export async function upsertExperience(data: {
    id?: number; // Optional, for update
    userId: number;
    company: string;
    position: string;
    startDate: Date | string;
    endDate?: Date | string;
    responsibilities: any; // Should be an array or object (JSON)
    location?: string;
}) {
    return prisma.experience.upsert({
        where: { id: data.id ?? 0 }, // If id is not provided, upsert will create
        update: {
            company: data.company,
            position: data.position,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            responsibilities: data.responsibilities,
            location: data.location,
            userId: data.userId,
        },
        create: {
            company: data.company,
            position: data.position,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            responsibilities: data.responsibilities,
            location: data.location,
            userId: data.userId,
        },
    });
}

export async function deleteExperience(id: number) {
    return prisma.experience.delete({
        where: { id },
    });
}

// Upsert Skill
export async function upsertSkill(data: { id?: number; name: string }) {
    return prisma.skill.upsert({
        where: { id: data.id ?? 0 }, // If id is not provided, upsert will create
        update: { name: data.name },
        create: { name: data.name },
    });
}

// Delete Skill
export async function deleteSkill(id: number) {
    return prisma.skill.delete({
        where: { id },
    });
}

// Find skills by name (for autocomplete)
export async function findSkillsByName(query: string) {
    return prisma.skill.findMany({
        where: { name: { contains: query } },
        take: 10,
    });
}

// Disconnect a skill from a user (removes the relation, not the skill itself)
export async function disconnectSkillFromUser(userId: number, skillId: number) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            skills: {
                disconnect: { id: skillId }
            }
        }
    });
}

// Add skill to user (connect or create)
export async function addSkillToUser(userId: number, skillName: string) {
    // Try to find the skill
    let skill = await prisma.skill.findUnique({ where: { name: skillName } });
    if (!skill) {
        skill = await prisma.skill.create({ data: { name: skillName } });
    }
    // Connect the skill to the user
    await prisma.user.update({
        where: { id: userId },
        data: {
            skills: {
                connect: { id: skill.id }
            }
        }
    });
    return skill;
}

// Upsert Tool
export async function upsertTool(data: { id?: number; name: string }) {
    return prisma.tool.upsert({
        where: { id: data.id ?? 0 }, // If id is not provided, upsert will create
        update: { name: data.name },
        create: { name: data.name },
    });
}

// Delete Tool
export async function deleteTool(id: number) {
    return prisma.tool.delete({
        where: { id },
    });
}

// Find tools by name (for autocomplete)
export async function findToolsByName(query: string) {
    return prisma.tool.findMany({
        where: { name: { contains: query } },
        take: 10,
    });
}

// Disconnect a tool from a user (removes the relation, not the tool itself)
export async function disconnectToolFromUser(userId: number, toolId: number) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            tools: {
                disconnect: { id: toolId }
            }
        }
    });
}

// Add tool to user (connect or create)
export async function addToolToUser(userId: number, toolName: string) {
    // Try to find the tool
    let tool = await prisma.tool.findUnique({ where: { name: toolName } });
    if (!tool) {
        tool = await prisma.tool.create({ data: { name: toolName } });
    }
    // Connect the tool to the user
    await prisma.user.update({
        where: { id: userId },
        data: {
            tools: {
                connect: { id: tool.id }
            }
        }
    });
    return tool;
}

// Upsert Hobby
export async function upsertHobby(data: { id?: number; name: string }) {
    return prisma.hobby.upsert({
        where: { id: data.id ?? 0 }, // If id is not provided, upsert will create
        update: { name: data.name },
        create: { name: data.name },
    });
}

// Delete Hobby
export async function deleteHobby(id: number) {
    return prisma.hobby.delete({
        where: { id },
    });
}

// Find hobbies by name (for autocomplete)
export async function findHobbiesByName(query: string) {
    return prisma.hobby.findMany({
        where: { name: { contains: query } },
        take: 10,
    });
}

// Disconnect a hobby from a user (removes the relation, not the hobby itself)
export async function disconnectHobbyFromUser(userId: number, hobbyId: number) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            Hobby: {
                disconnect: { id: hobbyId }
            }
        }
    });
}

// Add hobby to user (connect or create)
export async function addHobbyToUser(userId: number, hobbyName: string) {
    // Try to find the hobby
    let hobby = await prisma.hobby.findUnique({ where: { name: hobbyName } });
    if (!hobby) {
        hobby = await prisma.hobby.create({ data: { name: hobbyName } });
    }
    // Connect the hobby to the user
    await prisma.user.update({
        where: { id: userId },
        data: {
            Hobby: {
                connect: { id: hobby.id }
            }
        }
    });
    return hobby;
}