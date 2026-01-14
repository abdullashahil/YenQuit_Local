import jsPDF from 'jspdf';

// Types
export type TestType = 'smoked' | 'smokeless';

export interface TherapyGuideline {
    plan: string;
    warnings: string[];
}

export interface AssessmentResult {
    score: number;
    level: string;
    recommendation: TherapyGuideline;
}

// Logic Engine
export const getInterpretation = (score: number, testType: TestType = 'smoked'): string => {
    if (testType === 'smoked') {
        if (score <= 2) return "Very Low Dependence";
        if (score <= 4) return "Low Dependence";
        if (score === 5) return "Medium Dependence";
        if (score <= 7) return "High Dependence";
        return "Very High Dependence";
    } else {
        if (score <= 2) return "Low Dependence";
        if (score <= 5) return "Moderate Dependence";
        return "High Dependence";
    }
};

export const getTherapyGuidelines = (score: number, testType: TestType = 'smoked', health: any = null): TherapyGuideline => {
    const warnings: string[] = [];
    if (health) {
        if (health.recent_heart_attack) warnings.push("ALERT: Recent cardiac event. Consult physician before NRT.");
        if (health.is_pregnant) warnings.push("PRECAUTION: Pregnancy detected. Behavioral therapy preferred over NRT.");
    }

    let plan = "";

    if (testType === 'smoked') {
        if (score >= 7) {
            plan = "Combination Therapy: 21mg Patch + 4mg Gum/Lozenge for breakthrough cravings.";
        } else if (score >= 5) {
            plan = "21mg Nicotine Patch (24hr) or 2mg Gum frequently.";
        } else {
            plan = "Low-dose NRT (7-14mg Patch) or Behavioral Support.";
        }
    } else {
        // Smokeless
        if (score >= 6) {
            plan = "4mg Nicotine Lozenge (Oral focus) + Intensive Counseling.";
        } else {
            plan = "2mg Lozenge for breakthrough cravings + Behavioral support.";
        }
    }

    return { plan, warnings };
};

// PDF Generator
export const generatePDF = async (
    userName: string,
    score: number,
    testType: TestType = 'smoked',
    health: any = null
) => {
    const doc = new jsPDF();

    // Header / Logo
    try {
        const response = await fetch('/images/YenQuit_logo.jpg');
        if (response.ok) {
            const blob = await response.blob();
            const imgData = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
            // Logo at top-left
            doc.addImage(imgData, 'JPEG', 15, 10, 25, 25);
        }
    } catch (e) {
        console.warn("Logo load failed", e);
    }

    const interpretation = getInterpretation(score, testType);
    const therapy = getTherapyGuidelines(score, testType, health);
    const dateStr = new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.setTextColor(34, 139, 34); // Yenquit Green
    // Move title slightly to the right to accommodate logo if needed, or keep centered
    doc.text('YENQUIT CLINICAL REPORT', 105, 25, { align: 'center' }); // Adjusted Y slightly down

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Patient Name: ${userName}`, 20, 50); // Adjusted Y down
    doc.text(`Date: ${dateStr}`, 20, 60);
    doc.text(`Test Type: ${testType === 'smoked' ? 'Smoked Tobacco' : 'Smokeless Tobacco'}`, 20, 70);

    // Score Section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Fagerström Score: ${score}/10`, 20, 90);
    doc.text(`Level: ${interpretation}`, 20, 100);

    // Plan Section
    doc.setFontSize(14);
    doc.text("Recommended Quit Plan:", 20, 120);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const splitPlan = doc.splitTextToSize(therapy.plan, 170);
    doc.text(splitPlan, 20, 130);

    let currentY = 130 + (splitPlan.length * 7);

    // Warnings
    if (therapy.warnings && therapy.warnings.length > 0) {
        currentY += 10;
        doc.setTextColor(255, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("SAFETY WARNINGS:", 20, currentY);

        doc.setFont("helvetica", "normal");
        currentY += 7;
        therapy.warnings.forEach(w => {
            const splitWarn = doc.splitTextToSize(`• ${w}`, 170);
            doc.text(splitWarn, 20, currentY);
            currentY += (splitWarn.length * 7);
        });
    }

    // Footer Disclaimer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const disclaimer = "Disclaimer: This tool is for clinical support. Yenquit recommends consulting a doctor before starting pharmacotherapy.";
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 170);
    doc.text(splitDisclaimer, 20, 280); // Bottom of page

    // Save
    doc.save('Yenquit_Fagerstrom_Report.pdf');
};
