// Pilot workspace sample data for the in-app demo (Acme Labs is a fictional organization).
// Nothing here is real customer, program or award data.

export const ORG = { name: "Acme Labs", plan: "Starter", seats: 3 };

export const PIPELINE_STAGES = ["Matched", "Reviewing", "Drafting", "Submitted", "Awarded"];

export const seedPipeline = () => [
  { id: "op1", techId: "t1", title: "Open-water sensor demonstration", agency: "Air Force innovation office", program: "SBIR Phase I", amount: 75000, date: "Due 15 Jan 2027", fit: "Strong fit", stage: "Drafting" },
  { id: "op2", techId: "t1", title: "Maritime domain awareness challenge", agency: "Navy innovation office", program: "Prize challenge", amount: 150000, date: "Due 28 Feb 2027", fit: "Good fit", stage: "Matched" },
  { id: "op3", techId: "t1", title: "Harbor security sensing topic", agency: "Homeland security research", program: "SBIR Phase I", amount: 200000, date: "Due 9 Jan 2027", fit: "Good fit", stage: "Reviewing" },
  { id: "op4", techId: "t1", title: "Sensor resilience field trial", agency: "Army prize program", program: "Open competition", amount: 250000, date: "Submitted 4 Nov 2026", fit: "Strong fit", stage: "Submitted" },
  { id: "op5", techId: "t1", title: "Environmental monitoring pilot", agency: "National science funder", program: "SBIR Phase I", amount: 275000, date: "Awarded 2 Oct 2026", fit: "Strong fit", stage: "Awarded" },
  { id: "op6", techId: "t2", title: "Composite repair for field depots", agency: "Air Force innovation office", program: "SBIR Phase I", amount: 75000, date: "Due 3 Dec 2026", fit: "Good fit", stage: "Reviewing" },
  { id: "op7", techId: "t2", title: "Sustainment technology call", agency: "Regional innovation office", program: "Open call", amount: 120000, date: "Due 20 Jan 2027", fit: "Fair fit", stage: "Matched" },
  { id: "op8", techId: "t3", title: "Expeditionary power topic", agency: "Army research office", program: "STTR Phase I", amount: 180000, date: "Due 28 Feb 2027", fit: "Fair fit", stage: "Matched" },
  { id: "op9", techId: "t4", title: "Optics durability program", agency: "Navy innovation office", program: "SBIR Phase II", amount: 750000, date: "Due 20 Mar 2027", fit: "Strong fit", stage: "Drafting" },
  { id: "op10", techId: "t4", title: "Protective coatings round", agency: "Defense innovation unit", program: "Commercial solutions opening", amount: 400000, date: "Submitted 30 Oct 2026", fit: "Good fit", stage: "Submitted" },
];

export const WORKFLOW_STEPS = [
  { id: "profile", label: "Technology Profile", route: "technology-profile" },
  { id: "questionnaire", label: "Readiness Questionnaire", route: "readiness-questionnaire" },
  { id: "documents", label: "Upload documents", route: "knowledge-base" },
  { id: "readiness", label: "Readiness — TRL · MRL · IRL", route: "readiness" },
  { id: "intelligence", label: "Extract Opportunity Intelligence", route: "opportunities" },
  { id: "gaps", label: "Review Readiness Gaps", route: "readiness-gaps" },
  { id: "actions", label: "Build Action Plan", route: "action-plan" },
];

export const ORG_TYPES = [
  { id: "startup", label: "Startup", sub: "Early or growth stage", icon: "rocket" },
  { id: "small", label: "Small business", sub: "Established operator", icon: "briefcase" },
  { id: "defense", label: "Defense tech", sub: "Dual-use or defense-first", icon: "shield" },
  { id: "tto", label: "University TTO", sub: "Tech transfer office", icon: "building" },
  { id: "accelerator", label: "Accelerator", sub: "Supporting a cohort", icon: "spark" },
  { id: "other", label: "Other", sub: "Something else", icon: "dots" },
];

export const FUNDING_STAGES = ["Prefer not to say yet", "Pre-seed / grant funded", "Seed", "Series A", "Series B or later", "Revenue funded"];

export const seedTechProfiles = () => ({
  t1: { orgName: "Acme Labs", website: "acmelabs.example", orgType: "startup", fundingStage: "Seed", summary: "A compact, low-power sensing package for open-water and harbor monitoring." },
  t2: { orgName: "Acme Labs", website: "acmelabs.example", orgType: "startup", fundingStage: "Seed", summary: "A bonded composite repair method for field depots." },
  t3: { orgName: "Acme Labs", website: "acmelabs.example", orgType: "startup", fundingStage: "Seed", summary: "A modular power conditioner for expeditionary equipment." },
  t4: { orgName: "Acme Labs", website: "acmelabs.example", orgType: "startup", fundingStage: "Seed", summary: "An abrasion-resistant protective coating for optical lenses." },
});

const opt = (...o) => o;
export const QUESTIONNAIRE = [
  { id: "company", title: "Company", intro: "Tell us who you are and how your organization is structured. This tailors which programs and funding sources we match you to.", fields: [
    { id: "legalName", label: "Legal company name", help: "As it appears on your formation documents." },
    { id: "orgType", label: "Organization type", type: "select", options: opt("C-corp", "LLC", "University spin-out", "Non-profit research institute", "Other"), help: "This determines which funding programs are eligible for you." },
    { id: "overview", label: "Company overview", type: "textarea", help: "Two or three sentences on what you do and for whom." },
    { id: "headcount", label: "Team size", type: "select", options: opt("1–5", "6–20", "21–50", "51–500", "500+") },
  ]},
  { id: "technology", title: "Technology", intro: "Describe the technology itself, in plain language.", fields: [
    { id: "techDescription", label: "Technology description", type: "textarea" },
    { id: "differentiator", label: "What makes it different", type: "textarea" },
    { id: "ip", label: "Intellectual property status", type: "select", options: opt("None yet", "Provisional patent filed", "Patent pending", "Patent granted", "Trade secret") },
  ]},
  { id: "customer", title: "Customer Discovery", intro: "Who has the problem, and what have you learned from them?", fields: [
    { id: "interviews", label: "Customer conversations held", type: "select", options: opt("None yet", "1–10", "11–30", "31–100", "100+") },
    { id: "endUser", label: "Primary end user", help: "The person who would use it day to day." },
    { id: "findings", label: "Key findings so far", type: "textarea" },
  ]},
  { id: "government", title: "Government Experience", intro: "Past work with government customers or programs, if any.", fields: [
    { id: "pastAwards", label: "Prior government awards", type: "select", options: opt("None", "One", "Two to five", "More than five") },
    { id: "registrations", label: "Registrations in place", help: "For example, a unique entity ID or a cage code." },
    { id: "govNotes", label: "Relevant program contacts or history", type: "textarea" },
  ]},
  { id: "funding", title: "Funding", intro: "How the work is funded today.", fields: [
    { id: "fundingToDate", label: "Funding to date", type: "select", options: opt("Self-funded", "Grants only", "Grants and angel", "Venture backed") },
    { id: "runway", label: "Current runway", type: "select", options: opt("Under 6 months", "6–12 months", "12–24 months", "Over 24 months") },
    { id: "fundingNotes", label: "Funding you are pursuing next", type: "textarea" },
  ]},
  { id: "commercialization", title: "Commercialization", intro: "Your path from prototype to a product someone buys.", fields: [
    { id: "market", label: "Target market", type: "textarea" },
    { id: "businessModel", label: "Business model", type: "select", options: opt("Product sales", "Subscription", "Licensing", "Services", "Not decided yet") },
    { id: "pilotCustomers", label: "Pilot customers or letters of support" },
  ]},
  { id: "manufacturing", title: "Manufacturing", intro: "How the technology would be produced.", fields: [
    { id: "productionApproach", label: "Production approach", type: "select", options: opt("In-house", "Contract manufacturer", "Hybrid", "Not decided yet") },
    { id: "supplyRisks", label: "Known supply-chain risks", type: "textarea" },
  ]},
  { id: "experimentation", title: "Experimentation", intro: "Testing done so far and where it happened.", fields: [
    { id: "testEnvironment", label: "Most relevant test environment", type: "select", options: opt("Laboratory", "Relevant environment", "Operational environment", "Not tested yet") },
    { id: "testSummary", label: "Summary of results", type: "textarea" },
  ]},
  { id: "partnerships", title: "Partnerships", intro: "Organizations you work with today.", fields: [
    { id: "partners", label: "Current partners", type: "textarea" },
    { id: "partnerTypes", label: "Partner types", type: "select", options: opt("Universities", "Prime contractors", "Government labs", "Mixed", "None yet") },
  ]},
  { id: "risk", title: "Risk", intro: "The biggest open risks, in your own words.", fields: [
    { id: "technicalRisk", label: "Main technical risk", type: "textarea" },
    { id: "programRisk", label: "Main program or market risk", type: "textarea" },
  ]},
  { id: "goals", title: "Strategic Goals", intro: "Where you want the technology to be in the next 18 months.", fields: [
    { id: "goal18", label: "18-month goal", type: "textarea" },
    { id: "targetTrl", label: "Target TRL", type: "select", options: opt("TRL 5", "TRL 6", "TRL 7", "TRL 8", "TRL 9") },
  ]},
  { id: "support", title: "Support Requested", intro: "What would help most right now.", fields: [
    { id: "supportAreas", label: "Support areas", type: "select", options: opt("Finding funding", "Proposal writing", "Testing partners", "Manufacturing", "Introductions") },
    { id: "supportNotes", label: "Anything else we should know", type: "textarea" },
  ]},
];

// t1 has the first seven sections answered.
export const seedQuestionnaire = () => ({
  t1: {
    completed: ["company", "technology", "customer", "government", "funding", "commercialization", "manufacturing"],
    answers: {
      legalName: "Acme Labs, Inc.", orgType: "C-corp", headcount: "6–20",
      overview: "Acme Labs builds compact sensing packages for open-water and harbor monitoring, for coastal agencies and defense integrators.",
      techDescription: "A compact, low-power sensor suite that records water quality and acoustic signatures for months without servicing.",
      differentiator: "Lower power draw and a sealed housing that has passed bench immersion testing.",
      ip: "Provisional patent filed",
      interviews: "11–30", endUser: "Harbor operations teams",
      findings: "Operators want fewer service visits and a record they can share with partner agencies.",
      pastAwards: "One", registrations: "Unique entity ID and cage code in place",
      govNotes: "One Phase I award with a national science funder (environmental monitoring pilot).",
      fundingToDate: "Grants and angel", runway: "12–24 months",
      fundingNotes: "A Phase I in the maritime space, then a Direct-to-Phase II.",
      market: "Coastal monitoring agencies, port authorities and defense integrators.",
      businessModel: "Product sales", pilotCustomers: "One port authority letter of support (draft)",
      productionApproach: "Contract manufacturer",
    },
  },
  t2: { completed: ["company", "technology"], answers: { legalName: "Acme Labs, Inc.", orgType: "C-corp", techDescription: "A bonded composite repair method for field depots." } },
  t3: { completed: ["company"], answers: { legalName: "Acme Labs, Inc.", orgType: "C-corp" } },
  t4: { completed: ["company", "technology", "customer", "government", "funding", "commercialization", "manufacturing", "experimentation", "partnerships", "risk"], answers: { legalName: "Acme Labs, Inc.", orgType: "C-corp" } },
});

export const seedTrail = () => ({
  t1: {
    generated: "18 Nov 2026",
    phases: [
      { id: "now", label: "Now", window: "0–3 months", title: "Close validation gaps", items: [
        { id: "a1", text: "Complete open-water sensor trials", done: true },
        { id: "a2", text: "Finalize provisional-to-full patent conversion", done: false },
        { id: "a3", text: "Attach the environmental test record", done: false },
      ]},
      { id: "next", label: "Next", window: "4–9 months", title: "Prove it in the field", items: [
        { id: "b1", text: "Field-test in an operational environment (→ TRL 7)", done: false },
        { id: "b2", text: "Submit a Direct-to-Phase II proposal", done: false },
        { id: "b3", text: "Secure a pilot customer letter of support", done: false },
      ]},
      { id: "later", label: "Later", window: "10–18 months", title: "Scale toward deployment", items: [
        { id: "c1", text: "Qualify the system in operational conditions (→ TRL 8)", done: false },
        { id: "c2", text: "Negotiate an initial production contract", done: false },
        { id: "c3", text: "Line up a manufacturing partner (→ MRL 6)", done: false },
      ]},
    ],
  },
});

export const exampleTrail = (trl) => {
  const t = trl || 4;
  return [
    { id: "now", label: "Now", window: "0–3 months", title: "Close validation gaps", items: [
      { id: "x1", text: "Document current test results as evidence", done: false },
      { id: "x2", text: "Answer the remaining questionnaire sections", done: false },
    ]},
    { id: "next", label: "Next", window: "4–9 months", title: "Prove it in the field", items: [
      { id: "y1", text: `Test in a relevant environment (→ TRL ${Math.min(9, t + 1)})`, done: false },
      { id: "y2", text: "Submit to the strongest matched opportunity", done: false },
    ]},
    { id: "later", label: "Later", window: "10–18 months", title: "Scale toward deployment", items: [
      { id: "z1", text: `Demonstrate in operational conditions (→ TRL ${Math.min(9, t + 2)})`, done: false },
      { id: "z2", text: "Identify a production partner", done: false },
    ]},
  ];
};

export const ROLES = [
  { id: "Owner", scope: "Full access", body: "Manages billing, roles, and can delete the workspace." },
  { id: "Admin", scope: "Manage team & billing", body: "Can invite teammates and manage technology profiles." },
  { id: "Member", scope: "View & edit", body: "Can view and edit technology profiles, cannot manage billing." },
];

export const seedTeam = () => ({
  members: [
    { id: "m1", name: "Maya Chen", email: "maya.chen@acmelabs.example", role: "Owner", status: "Active" },
    { id: "m2", name: "Elena Voss", email: "elena.voss@acmelabs.example", role: "Member", status: "Active" },
  ],
  activity: [
    { id: "a1", who: "Elena Voss", what: "uploaded Bench test log.pdf", when: "2 hours ago" },
    { id: "a2", who: "Maya Chen", what: "moved Open-water sensor demonstration to Drafting", when: "Yesterday" },
    { id: "a3", who: "Maya Chen", what: "completed the Manufacturing section of the questionnaire", when: "Yesterday" },
    { id: "a4", who: "Elena Voss", what: "joined the Acme Labs workspace", when: "3 days ago" },
    { id: "a5", who: "Maya Chen", what: "created the Acme Labs workspace", when: "1 week ago" },
  ],
});

// Qualitative findings for the Evidence Reasoning view. Each points to a source document.
export const seedReasoning = () => ({
  t1: {
    lastRun: "18 Nov 2026, 16:40",
    strengths: [
      { id: "s1", text: "Bench results are recorded and human-reviewed, which supports the laboratory-level claims.", docId: "d1" },
      { id: "s2", text: "The interface drawing is complete and matches the description in the questionnaire.", docId: "d2" },
      { id: "s3", text: "A prior award in environmental monitoring shows a working relationship with a government funder.", source: "Questionnaire · Government Experience" },
    ],
    gaps: [
      { id: "g1", text: "No environmental test record is on file, so operational claims can't be supported yet.", source: "Questionnaire · Experimentation (not answered)" },
      { id: "g2", text: "Draft lab notes are not yet human-reviewed and are left out of readiness.", docId: "d3" },
      { id: "g3", text: "The pilot customer letter is still a draft.", source: "Questionnaire · Commercialization" },
    ],
  },
});
