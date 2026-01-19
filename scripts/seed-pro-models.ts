import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const proModels = [
    {
        name: "Freddie Freeman",
        team: "Los Angeles Dodgers",
        position: "1B",
        handedness: "L",
        anchorScore: 9.0,   // Elite ground force, stable
        coreScore: 9.5,     // Excellent rotation sequence
        whipScore: 9.2,     // Fast bat, consistent contact
        overallScore: 9.23,
        featured: true,
        isProModel: true
    },
    {
        name: "Vladimir Guerrero Jr.",
        team: "Toronto Blue Jays",
        position: "1B",
        handedness: "R",
        anchorScore: 9.4,
        coreScore: 9.6,
        whipScore: 9.5,
        overallScore: 9.50,
        featured: true,
        isProModel: true
    },
    {
        name: "Mookie Betts",
        team: "Los Angeles Dodgers",
        position: "RF",
        handedness: "R",
        anchorScore: 9.6,
        coreScore: 9.7,
        whipScore: 9.8,
        overallScore: 9.70,
        featured: true,
        isProModel: true
    },
    {
        name: "Juan Soto",
        team: "San Diego Padres",
        position: "LF",
        handedness: "L",
        anchorScore: 9.2,
        coreScore: 9.4,
        whipScore: 9.5,
        overallScore: 9.37,
        featured: false,
        isProModel: true
    },
    {
        name: "Aaron Judge",
        team: "New York Yankees",
        position: "RF",
        handedness: "R",
        anchorScore: 9.3,
        coreScore: 9.5,
        whipScore: 9.4,
        overallScore: 9.40,
        featured: false,
        isProModel: true
    }
]

async function main() {
    console.log('Seeding pro models...')

    for (const model of proModels) {
        const existing = await prisma.proModel.findFirst({
            where: { name: model.name }
        })

        if (existing) {
            // Update
            await prisma.proModel.update({
                where: { id: existing.id },
                data: {
                    ...model,
                    // Ensure we don't overwrite ID or other fields if we had them
                }
            })
            console.log(`✅ Updated: ${model.name}`)
        } else {
            // Create
            await prisma.proModel.create({
                data: model
            })
            console.log(`✅ Created: ${model.name}`)
        }
    }

    console.log('Done!')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
