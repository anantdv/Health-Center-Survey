export const mockSurveys = [
  {
    id: "survey-101",
    facilityName: "Metro General Hospital",
    location: "Block A, New Delhi",
    timestamp: "2026-06-10T14:30:00.000Z",
    sections: {
      section1: {
        totalBeds: "350",
        occupancyRate: "82",
        emergencyAdmissions: "45",
        opdToIpdAdmissions: "120",
        genWardStay: "5",
        icuStay: "9"
      },
      section2: {
        generalMedicine: "30",
        surgery: "20",
        obgyn: "15",
        pediatrics: "10",
        icuCritical: "10",
        emergencyTrauma: "10",
        infectiousDiseases: "5"
      },
      section3: {
        continuousMon: "40",
        intermittentMon: "45",
        minimalMon: "15",
        parameters: ["BP", "SpO2", "ECG", "Temperature", "Respiratory rate"],
        parametersOther: "",
        highAcuityFreq: "1",
        mediumAcuityFreq: "4",
        lowAcuityFreq: "8"
      },
      section4: {
        doctorVisits: "2",
        nurseVisits: "6",
        bedsideActivities: ["Vital monitoring", "Drug administration", "IV fluid management", "Documentation"],
        avgVisitTime: "12"
      },
      section5: {
        emergenciesPerDay: "4",
        emergencyTypes: ["Cardiac arrest", "Respiratory distress", "Sepsis"],
        emergencyTypesOther: "",
        avgResponseTime: "3",
        emergencyEquipment: ["Defibrillator", "Oxygen", "Suction", "Emergency drugs"]
      },
      section6: {
        dispensingModel: ["Patient-specific dispensing", "Mixed"],
        supplyFrequency: ["Twice daily"],
        dispensingDoneBy: ["Nurse"],
        storageMethod: ["Patient bins", "Locked cabinets"],
        issuesFaced: ["Delay", "Wrong drug selection"]
      },
      section7: {
        drugCategories: ["Antibiotics", "Analgesics", "IV fluids"],
        highAcuityAdminFreq: "6",
        genWardAdminFreq: "3"
      },
      section8: {
        trackingMethod: ["Paper MAR", "Digital system"],
        verificationRightPatient: "Yes",
        verificationRightDrug: "Yes",
        verificationRightDose: "No",
        verificationRightTime: "Yes",
        commonErrors: ["Delay", "Missed dose"],
        alertsAvailable: ["Manual"],
        requiredImprovements: ["Barcode/RFID", "Automated alerts", "Dose calculation"]
      },
      section9: {
        inventoryFlow: ["Digital -> Pharmacy -> Ward"],
        inventoryFlowOther: "",
        emergencyTime: "15",
        routineTime: "60",
        inventorySystem: ["ERP"],
        stockVisibility: ["Partial"],
        stockOutFrequency: ["Weekly"],
        expiryManagement: ["Regular"],
        reverseFlow: ["Return"],
        keyPainPoints: ["Delay", "Billing mismatch"]
      },
      section10: {
        diagnostics: ["Glucometer", "ECG", "Hemoglobin testing"],
        turnaroundIssues: "Yes"
      },
      section11: {
        currentSystem: ["Hybrid"],
        requiredBedside: ["EMR access", "Drug reference"],
        issues: ["Rework", "Delays"]
      },
      section12: {
        wardNurseRatio: "1:6",
        icuNurseRatio: "1:2",
        nonClinicalTime: "35",
        challenges: ["Walking time", "Documentation load", "Medication delays"]
      },
      section13: {
        power: ["Reliable"],
        network: ["Moderate"],
        spaceNearBed: ["Limited"]
      },
      section14: {
        unavailableDevices: "Portable Pulse Oximeters, Syringe Infusion Pumps",
        sharingRatio: "4",
        maintenanceIssues: ["Occasional"]
      },
      section15: {
        requiredCartFeatures: ["Monitor", "Medicine storage", "Computer/EMR", "Battery backup"],
        prioritySpeed: "4",
        priorityAccuracy: "5",
        priorityMobility: "4",
        priorityCost: "3",
        priorityEaseOfUse: "5"
      },
            section16: {
        slowsBedsideCare: "Manual double-charting on paper after performing checks, and running to central pharmacy for missing doses.",
        medicineHandlingChallenge: "Lack of barcode matching at bedside leads to near-miss events and delay in initial administration.",
        maxImpactImprovement: "A mobile bedside workstation with an integrated laptop, scanner, and secure medicine lockers.",
        idealCartInclude: "Secure drawers synced with EMR, barcode scanner, long-life hot-swappable battery, and diagnostic mount options."
      },
      section17: {
        outletDistance: "1–3 meters",
        socketsAvailable: "2",
        socketsOccupied: "Yes",
        upsPower: "No",
        powerInterruptions: "3",
        desiredBackup: "8 hrs",
        wifiAvailable: "Partial coverage",
        signalBedside: "Moderate",
        deadZones: ["Basement", "Radiology"],
        wallsAffectConnectivity: "Occasionally",
        networkInterruptionsCare: "Weekly",
        mobileCoverage: "Good"
      }
    },
    images: {
      "1": [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80"
      ],
      "13": [
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80"
      ]
    }
  },
  {
    id: "survey-102",
    facilityName: "City Pediatric & Maternity Wing",
    location: "Civil Lines, Mumbai",
    timestamp: "2026-06-09T09:15:00.000Z",
    sections: {
      section1: {
        totalBeds: "120",
        occupancyRate: "90",
        emergencyAdmissions: "15",
        opdToIpdAdmissions: "40",
        genWardStay: "3",
        icuStay: "6"
      },
      section2: {
        generalMedicine: "10",
        surgery: "10",
        obgyn: "40",
        pediatrics: "30",
        icuCritical: "5",
        emergencyTrauma: "5",
        infectiousDiseases: "0"
      },
      section3: {
        continuousMon: "30",
        intermittentMon: "60",
        minimalMon: "10",
        parameters: ["BP", "SpO2", "Temperature", "Respiratory rate", "Blood glucose"],
        parametersOther: "",
        highAcuityFreq: "2",
        mediumAcuityFreq: "4",
        lowAcuityFreq: "12"
      },
      section4: {
        doctorVisits: "2",
        nurseVisits: "8",
        bedsideActivities: ["Vital monitoring", "Drug administration", "Sample collection", "Documentation"],
        avgVisitTime: "15"
      },
      section5: {
        emergenciesPerDay: "1",
        emergencyTypes: ["Respiratory distress"],
        emergencyTypesOther: "Neonatal stabilization",
        avgResponseTime: "2",
        emergencyEquipment: ["Oxygen", "Suction", "Emergency drugs"]
      },
      section6: {
        dispensingModel: ["Central pharmacy -> ward stock"],
        supplyFrequency: ["Once daily"],
        dispensingDoneBy: ["Nurse"],
        storageMethod: ["Open trays"],
        issuesFaced: ["Delay", "Missing drugs", "Expiry issues"]
      },
      section7: {
        drugCategories: ["Antibiotics", "Analgesics", "IV fluids", "Sedatives"],
        highAcuityAdminFreq: "8",
        genWardAdminFreq: "4"
      },
      section8: {
        trackingMethod: ["Paper MAR"],
        verificationRightPatient: "Yes",
        verificationRightDrug: "No",
        verificationRightDose: "No",
        verificationRightTime: "No",
        commonErrors: ["Delay", "Wrong dose"],
        alertsAvailable: ["None"],
        requiredImprovements: ["Automated alerts", "Dose calculation"]
      },
      section9: {
        inventoryFlow: ["Doctor -> Nurse -> Administer"],
        inventoryFlowOther: "",
        emergencyTime: "10",
        routineTime: "90",
        inventorySystem: ["Manual"],
        stockVisibility: ["None"],
        stockOutFrequency: ["Daily"],
        expiryManagement: ["Occasional"],
        reverseFlow: ["Discard"],
        keyPainPoints: ["No tracking", "Wastage"]
      },
      section10: {
        diagnostics: ["Glucometer", "Hemoglobin testing"],
        turnaroundIssues: "No"
      },
      section11: {
        currentSystem: ["Paper"],
        requiredBedside: ["EMR access"],
        issues: ["Missing data", "Delays"]
      },
      section12: {
        wardNurseRatio: "1:8",
        icuNurseRatio: "1:1",
        nonClinicalTime: "40",
        challenges: ["Searching equipment", "Medication delays", "Documentation load"]
      },
      section13: {
        power: ["Reliable"],
        network: ["Strong"],
        spaceNearBed: ["Limited"]
      },
      section14: {
        unavailableDevices: "Phototherapy units, Pediatric BP cuffs",
        sharingRatio: "6",
        maintenanceIssues: ["Frequent"]
      },
      section15: {
        requiredCartFeatures: ["Medicine storage", "Computer/EMR", "Mobility"],
        prioritySpeed: "3",
        priorityAccuracy: "4",
        priorityMobility: "5",
        priorityCost: "4",
        priorityEaseOfUse: "4"
      },
            section16: {
        slowsBedsideCare: "Searching for pediatric-specific supplies and waiting for IV pump availability.",
        medicineHandlingChallenge: "Manual calculations of pediatric doses on scrap paper before preparation.",
        maxImpactImprovement: "A specialized pediatric smart-cart with built-in dose calculator tools.",
        idealCartInclude: "Secure drawers, child-friendly theme, and integrated scale/calculator platform."
      },
      section17: {
        outletDistance: "Within 1 meter",
        socketsAvailable: "4",
        socketsOccupied: "No",
        upsPower: "Yes",
        powerInterruptions: "0",
        desiredBackup: "Full shift",
        wifiAvailable: "Entire hospital",
        signalBedside: "Strong",
        deadZones: ["None"],
        wallsAffectConnectivity: "Rarely",
        networkInterruptionsCare: "Never",
        mobileCoverage: "Excellent"
      }
    },
    images: {
      "12": [
        "https://images.unsplash.com/photo-1502740479091-635887520276?w=400&q=80"
      ]
    }
  }
];
