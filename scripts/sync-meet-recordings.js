const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// MOCK: Google Drive API Client
// In production, replace this with 'googleapis' library
async function listDriveFiles(folderId) {
    console.log("📂 Scanning Google Drive (Mock)...");
    // Simulate finding a file that matches a recent session (if we had one)
    // We'll return a mock list
    return [
        {
            id: "file_123",
            name: "Rick Strickland - Live Lab (abc-defg-hij) - 2026-01-20.mp4",
            webViewLink: "https://drive.google.com/file/d/file_123/view"
        },
        {
            id: "file_456",
            name: "Random Video.mp4",
            webViewLink: "https://drive.google.com/..."
        }
    ];
}

async function syncRecordings() {
    console.log("🔄 STARTING RECORDING SYNC");

    // 1. Fetch all 'Scheduled' or 'Active' sessions that are missing recordings
    // (Or just check all recent sessions)
    const pendingSessions = await prisma.liveSession.findMany({
        where: {
            recordingUrl: null,
            status: { not: 'archived' }
        }
    });

    console.log(`Found ${pendingSessions.length} pending sessions.`);

    if (pendingSessions.length === 0) {
        console.log("No pending sessions to sync.");
        return;
    }

    // 2. Check Drive
    const files = await listDriveFiles("MY_MEET_RECORDINGS_FOLDER_ID");

    // 3. Match Files to Sessions
    for (const session of pendingSessions) {
        // Our Meet Code: abc-defg-hij
        // Google File Name format often contains the code or meeting title
        // Let's look for the code in the filename
        const match = files.find(f => f.name.includes(session.meetCode));

        if (match) {
            console.log(`✅ FOUND RECORDING for Session ${session.id} (Code: ${session.meetCode})`);
            console.log(`   File: ${match.name}`);

            // A. Update LiveSession
            await prisma.liveSession.update({
                where: { id: session.id },
                data: {
                    recordingUrl: match.webViewLink,
                    status: "completed",
                    endedAt: new Date()
                }
            });

            // B. Add to Video Library (The "Vault")
            const videoTitle = `Live Lab Session - ${new Date().toLocaleDateString()}`;
            await prisma.videoLibraryItem.create({
                data: {
                    title: videoTitle,
                    videoUrl: match.webViewLink,
                    driveFileId: match.id,
                    status: "approved",
                    vectorTag: "Live Session",
                    transcript: "Pending AI Summary..." // Use Gemini here in future
                }
            });

            console.log("   -> Linked to Video Library.");
        }
    }

    console.log("🏁 SYNC COMPLETE");
}

syncRecordings()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
