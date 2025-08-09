import { PrismaClient } from "@prisma/client";

const prismaAny = new PrismaClient() as any;

async function main() {
  // Upsert subscription plans aligned with current pricing
  await prismaAny.subscriptionPlan.upsert({
    where: { name: "Free" },
    update: {
      priceCents: 0,
      currency: "USD",
      interval: "MONTHLY",
      promptLimitMonthly: 10,
      isActive: true,
      description: "Access to basic AI models; up to 10 prompts per month.",
    },
    create: {
      name: "Free",
      priceCents: 0,
      currency: "USD",
      interval: "MONTHLY",
      promptLimitMonthly: 10,
      isActive: true,
      description: "Access to basic AI models; up to 10 prompts per month.",
    },
  });

  await prismaAny.subscriptionPlan.upsert({
    where: { name: "Starter" },
    update: {
      priceCents: 1000,
      currency: "USD",
      interval: "MONTHLY",
      promptLimitMonthly: 50,
      isActive: true,
      description: "Access to best GPT model; up to 50 prompts per month.",
    },
    create: {
      name: "Starter",
      priceCents: 1000,
      currency: "USD",
      interval: "MONTHLY",
      promptLimitMonthly: 50,
      isActive: true,
      description: "Access to best GPT model; up to 50 prompts per month.",
    },
  });

  await prismaAny.subscriptionPlan.upsert({
    where: { name: "Pro" },
    update: {
      priceCents: 10000,
      currency: "USD",
      interval: "YEARLY",
      promptLimitMonthly: null,
      isActive: true,
      description: "Unlimited prompts per month; annual access.",
    },
    create: {
      name: "Pro",
      priceCents: 10000,
      currency: "USD",
      interval: "YEARLY",
      promptLimitMonthly: null,
      isActive: true,
      description: "Unlimited prompts per month; annual access.",
    },
  });
}

main()
  .then(async () => {
  await (prismaAny as any).$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
  await (prismaAny as any).$disconnect();
    process.exit(1);
  });
