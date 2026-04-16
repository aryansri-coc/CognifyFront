const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.log("No users found to seed health data for.");
        return;
    }

    console.log(`Found ${users.length} users. Seeding health data...`);

    for (const user of users) {
        // Create 7 days of health data
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            await prisma.healthData.create({
                data: {
                    userId: user.id,
                    timestamp: date,
                    steps: Math.floor(Math.random() * 5000) + 5000,
                    heartRateAvg: Math.floor(Math.random() * 20) + 70,
                    totalSleepHours: Math.floor(Math.random() * 3) + 6,
                    deepSleepHours: Math.floor(Math.random() * 2) + 1,
                    remSleepHours: Math.floor(Math.random() * 2) + 1,
                    bloodOxygenAvg: 98,
                    hrvSdnnMs: 45,
                    gaitSpeedMs: 1.2,
                    stepCadence: 110,
                    walkingAsymmetry: 0.5,
                    latencyMinutes: 15,
                    awakenings: 1
                }
            });

            // Create a prediction for today
            if (i === 0) {
                await prisma.aiPrediction.create({
                    data: {
                        userId: user.id,
                        cognitiveIndex: 85,
                        healthStatus: "Health looks stable. Consistent sleep and activity levels observed.",
                        statusColor: "green",
                        aiInsights: [
                            "Your heart rate has been very consistent this week.",
                            "Sleep quality is improving.",
                            "Keep up the 8,000+ steps daily!"
                        ]
                    }
                });
            }
        }
    }

    console.log("✅ Seeded health data for all users.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
