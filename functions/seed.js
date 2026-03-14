const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

async function seed() {
    try {
        console.log("Seeding dummy data...");
        
        const visas = [
            { countryName: 'United Arab Emirates', visaType: '30 Days Tourist', processingTime: '2-3 Working Days', rate: 8000 },
            { countryName: 'Saudi Arabia', visaType: '90 Days Multiple Entry', processingTime: '1 Week', rate: 25000 },
            { countryName: 'Singapore', visaType: '30 Days Tourist', processingTime: '3-4 Working Days', rate: 3500 },
            { countryName: 'Malaysia', visaType: 'eVisa 30 Days', processingTime: '2 Working Days', rate: 4500 }
        ];
        for (const v of visas) {
            await db.collection('visas').add({
                ...v,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        const stampings = [
            { country: 'Saudi Arabia', description: 'Employment Visa Stamping', processingTime: '3 Weeks', cost: 12000 },
            { country: 'Kuwait', description: 'Family Visit Visa Stamping', processingTime: '2 Weeks', cost: 9000 }
        ];
        for (const s of stampings) {
            await db.collection('visa_stamping').add({
                ...s,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        const attestations = [
            { country: 'United Arab Emirates', certificate: 'Degree Certificate Attestation', cost: 5500 },
            { country: 'Qatar', certificate: 'Marriage Certificate Attestation', cost: 6000 },
            { country: 'Oman', certificate: 'Birth Certificate Attestation', cost: 4500 }
        ];
        for (const a of attestations) {
            await db.collection('attestations').add({
                ...a,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        const pass = [
            { type: 'New Passport', description: 'Normal Processing', cost: 1500 },
            { type: 'Passport Renewal', description: 'Tatkal Processing', cost: 3500 }
        ];
        for (const p of pass) {
            await db.collection('passport_services').add({
                ...p,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        console.log("Successfully seeded dummy data in ₹.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding dummy data: ", error);
        process.exit(1);
    }
}

seed();
