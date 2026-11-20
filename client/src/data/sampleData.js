// Sample data for the Retriever template. Ported verbatim from the HTML template.
// Nothing here is real customer data.

export const MONTHS = ["Jun","Jul","Aug","Sep","Oct","Nov"];
export const FRAMEWORKS = ["TRL","MRL","IRL"];
export const QUICK_QUESTIONS = [
    { id: "q1", text: "Is there a written description of the technology?" },
    { id: "q2", text: "Has testing been recorded in a document?" },
    { id: "q3", text: "Is there a record of how it could be produced?" },
    { id: "q4", text: "Has it been tried in a setting like its intended use?" },
    { id: "q5", text: "Is ownership of the work documented?" }
  ];

export const seedTechs = () => [
    { id: "t1", name: "Compact sensor suite", org: "Acme Labs – Sensors", owner: "Elena Voss", trl: 6, mrl: 4, irl: 5, summary: "A compact sensing package recorded for laboratory and field use." },
    { id: "t2", name: "Composite repair method", org: "Acme Labs – Materials", owner: "James Okonkwo", trl: 5, mrl: 3, irl: 4, summary: "A repair method with workshop notes still moving through review." },
    { id: "t3", name: "Modular power conditioner", org: "Acme Labs – Power", owner: "Tom Alvarez", trl: 4, mrl: 3, irl: 3, summary: "A modular conditioner with one measurement table still open." },
    { id: "t4", name: "Protective lens coating", org: "Acme Labs – Optics", owner: "Hannah Cole", trl: 7, mrl: 5, irl: 4, summary: "A protective coating with abrasion trials already on file." }
  ];

export const seedHistory = () => ({
    t1: { TRL: [4,5,5,6,6,6], MRL: [2,3,3,4,4,4], IRL: [3,3,4,4,5,5] },
    t2: { TRL: [3,4,4,5,5,5], MRL: [null,2,2,3,3,3], IRL: [2,3,3,4,4,4] },
    t3: { TRL: [null,3,3,4,4,4], MRL: [null,null,2,3,3,3], IRL: [null,2,2,3,3,3] },
    t4: { TRL: [5,6,6,6,7,7], MRL: [3,4,4,5,5,5], IRL: [null,3,3,4,4,4] }
  });

export const seedDocs = () => [
    { id: "d1", name: "Bench test log.pdf", type: "pdf", technologyId: "t1", reviewed: true, reviewer: "Elena Voss", uploaded: "18 Nov 2026", excerpt: "Laboratory bench results for the compact sensor suite, marked as human-reviewed." },
    { id: "d2", name: "Interface drawing.pdf", type: "pdf", technologyId: "t1", reviewed: true, reviewer: "Marcus Reid", uploaded: "16 Nov 2026", excerpt: "Interface drawing for the sensor package, reviewed and on file." },
    { id: "d3", name: "Draft lab notes.docx", type: "doc", technologyId: "t1", reviewed: false, reviewer: "", uploaded: "19 Nov 2026", excerpt: "Draft notes only. This document has not been human-reviewed and does not count toward readiness." },
    { id: "d4", name: "Repair method brief.pdf", type: "pdf", technologyId: "t2", reviewed: true, reviewer: "James Okonkwo", uploaded: "15 Nov 2026", excerpt: "A written brief of the composite repair method, reviewed by the owner." },
    { id: "d5", name: "Workshop photographs.png", type: "image", technologyId: "t2", reviewed: false, reviewer: "", uploaded: "17 Nov 2026", excerpt: "Workshop photographs awaiting human review." },
    { id: "d6", name: "Efficiency measurements.xlsx", type: "sheet", technologyId: "t3", reviewed: true, reviewer: "Tom Alvarez", uploaded: "13 Nov 2026", excerpt: "Efficiency measurements for the power conditioner. Human-reviewed." },
    { id: "d7", name: "Unreviewed power budget.xlsx", type: "sheet", technologyId: "t3", reviewed: false, reviewer: "", uploaded: "18 Nov 2026", excerpt: "A power budget still waiting for review. It does not count toward readiness yet." },
    { id: "d8", name: "Abrasion trial record.pdf", type: "pdf", technologyId: "t4", reviewed: true, reviewer: "Hannah Cole", uploaded: "11 Nov 2026", excerpt: "Abrasion trial record for the protective lens coating, reviewed and on file." },
    { id: "d9", name: "Coating process note.pdf", type: "pdf", technologyId: "t4", reviewed: true, reviewer: "Priya Shah", uploaded: "10 Nov 2026", excerpt: "Process note describing how the coating was applied, marked as human-reviewed." }
  ];

export const seedOpps = () => [
    { id: "o1", title: "Sensor field trial call", technologyId: "t1", program: "Government Innovation Program A", agencyType: "Government program", note: "Two gaps remain on the environmental test record.", fundingId: "f1" },
    { id: "o2", title: "Repair methods briefing", technologyId: "t2", program: "Regional Innovation Office", agencyType: "Innovation office", note: "The workshop record is still awaiting review.", fundingId: "f2" },
    { id: "o3", title: "Power systems note", technologyId: "t3", program: "National Laboratory – Site A", agencyType: "Laboratory", note: "One measurement table is still a gap.", fundingId: "f3" },
    { id: "o4", title: "Protective coatings round", technologyId: "t4", program: "Government Innovation Program B", agencyType: "Government program", note: "Most source documents are on file.", fundingId: "f4" },
    { id: "o5", title: "Laboratory collaboration", technologyId: "t1", program: "Regional Innovation Office", agencyType: "Innovation office", note: "A second site record is needed.", fundingId: "f5" }
  ];

export const seedGaps = () => [
    { id: "g1", opportunityId: "o1", text: "Environmental test record is missing.", severity: "High" },
    { id: "g2", opportunityId: "o1", text: "Field-use note has not been reviewed.", severity: "Medium" },
    { id: "g3", opportunityId: "o2", text: "Workshop record is not yet human-reviewed.", severity: "Medium" },
    { id: "g4", opportunityId: "o3", text: "One measurement table is incomplete.", severity: "High" },
    { id: "g5", opportunityId: "o5", text: "Second site record has not been attached.", severity: "Low" }
  ];

export const seedFunding = () => [
    { id: "f1", opportunity: "Sensor field trial call", opportunityId: "o1", technologyId: "t1", agency: "Government Innovation Program A", agencyType: "Government program", deadline: "15 Jan 2027", score: 82, gaps: 2, status: "Open", note: "A close match on sensing work, with two evidence gaps still open." },
    { id: "f2", opportunity: "Repair methods briefing", opportunityId: "o2", technologyId: "t2", agency: "Regional Innovation Office", agencyType: "Innovation office", deadline: "3 Dec 2026", score: 74, gaps: 1, status: "Closing soon", note: "Deadline is close. The workshop record still needs review." },
    { id: "f3", opportunity: "Power systems note", opportunityId: "o3", technologyId: "t3", agency: "National Laboratory – Site A", agencyType: "Laboratory", deadline: "28 Feb 2027", score: 61, gaps: 1, status: "Open", note: "A fair match. One measurement table is incomplete." },
    { id: "f4", opportunity: "Protective coatings round", opportunityId: "o4", technologyId: "t4", agency: "Government Innovation Program B", agencyType: "Government program", deadline: "20 Mar 2027", score: 79, gaps: 0, status: "Open", note: "Documents for this coating work are already on file." },
    { id: "f5", opportunity: "Laboratory collaboration", opportunityId: "o5", technologyId: "t1", agency: "Regional Innovation Office", agencyType: "Innovation office", deadline: "9 Jan 2027", score: 68, gaps: 1, status: "Open", note: "A second site record is still needed." }
  ];

export const seedRoadmap = () => [
    { id: "r1", technologyId: "t1", title: "Complete the environmental test record", start: "2026-11-01", end: "2027-01-31", status: "In progress", milestone: true },
    { id: "r2", technologyId: "t1", title: "Prepare the field-use brief", start: "2027-01-01", end: "2027-03-15", status: "Planned", milestone: false },
    { id: "r3", technologyId: "t2", title: "Review the workshop record", start: "2026-11-01", end: "2026-12-15", status: "In progress", milestone: true },
    { id: "r4", technologyId: "t3", title: "Close the measurement gap", start: "2027-01-01", end: "2027-02-28", status: "Planned", milestone: false },
    { id: "r5", technologyId: "t4", title: "Update the process note", start: "2026-11-01", end: "2026-12-20", status: "In progress", milestone: true },
    { id: "r6", technologyId: "t4", title: "Share the coating trial record", start: "2027-01-10", end: "2027-03-31", status: "Planned", milestone: false },
    { id: "r7", technologyId: "t1", title: "Collect the bench-test package", start: "2026-11-01", end: "2026-11-30", status: "Done", milestone: false },
    { id: "r8", technologyId: "t1", title: "Confirm the interface drawing review", start: "2026-12-01", end: "2026-12-20", status: "In progress", milestone: false },
    { id: "r9", technologyId: "t1", title: "Hold the January readiness review", start: "2027-01-10", end: "2027-01-31", status: "Planned", milestone: true },
    { id: "r10", technologyId: "t1", title: "Schedule the field-use walkthrough", start: "2027-02-15", end: "2027-03-20", status: "Planned", milestone: false }
  ];

export const seedActions = () => [
    { id: "p1", technologyId: "t1", title: "Attach the environmental test record", owner: "Elena Voss", due: "10 Dec 2026", status: "Open" },
    { id: "p2", technologyId: "t1", title: "Ask the lab to review the field-use note", owner: "Elena Voss", due: "18 Dec 2026", status: "Open" },
    { id: "p3", technologyId: "t2", title: "File the workshop record for review", owner: "James Okonkwo", due: "2 Dec 2026", status: "In progress" },
    { id: "p4", technologyId: "t3", title: "Complete the measurement table", owner: "Tom Alvarez", due: "8 Dec 2026", status: "Open" },
    { id: "p5", technologyId: "t4", title: "Update the process note", owner: "Hannah Cole", due: "5 Dec 2026", status: "Done" }
  ];

export const seedActivity = () => [
    { id: "n1", title: "Readiness history updated", body: "Compact sensor suite now has a November assessment on file.", time: "2 hours ago", route: "readiness", techId: "t1" },
    { id: "n2", title: "Gap still open", body: "Sensor field trial call is missing an environmental test record.", time: "Yesterday", route: "readiness-gaps", techId: "t1" },
    { id: "n3", title: "Document awaiting review", body: "Draft lab notes on compact sensor suite are not yet human-reviewed.", time: "Yesterday", route: "knowledge-base", techId: "t1" },
    { id: "n4", title: "Funding deadline approaching", body: "Repair methods briefing closes on 3 December 2026.", time: "2 days ago", route: "opportunities", techId: "t2" },
    { id: "n5", title: "Action marked in progress", body: "James Okonkwo started the workshop record review.", time: "3 days ago", route: "action-plan", techId: "t2" }
  ];

export const ACTION_STATUSES = ["Open", "In progress", "Done"];

export const seedProfile = () => ({ name: "Maya Chen", email: "maya.chen@acmelabs.example", organization: "Acme Labs", role: "Owner" });

export const seedUsage = () => ({ assessmentsUsed: 8, assessmentsLimit: 20, documentsUsed: 9, documentsLimit: 10 });
