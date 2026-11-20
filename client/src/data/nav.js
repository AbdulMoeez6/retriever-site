// Dashboard navigation, mirroring the Retriever app's sidebar.
export const NAV = [
  { section: null, items: [
    { id: "mission-command", label: "Mission Command", icon: "command" },
    { id: "opportunities", label: "Opportunities", sub: "Funding matches · Pipeline", icon: "dollar" },
    { id: "readiness", label: "Readiness", sub: "TRL · MRL · IRL · Evidence", icon: "gauge" },
    { id: "action-plan", label: "Action Plan", sub: "Readiness actions", icon: "flag" },
    { id: "knowledge-base", label: "Knowledge Base", sub: "Documents · Opportunity records", icon: "doc" },
    { id: "commercialization", label: "Commercialization", sub: "Commercialization Trail", icon: "map" },
  ]},
  { section: "Workspace", items: [
    { id: "technology-profile", label: "Technology Profile", icon: "clipboard" },
    { id: "team", label: "Team", icon: "people" },
  ]},
  { section: "More tools", items: [
    { id: "readiness-questionnaire", label: "Readiness Questionnaire", icon: "target" },
    { id: "evidence-reasoning", label: "Evidence Reasoning", icon: "lens" },
    { id: "proposal-assistant", label: "Proposal Assistant", sub: "Template preview", icon: "pen" },
  ]},
];

// Top bar title and subtitle per route. A function subtitle receives the app store.
export const PAGE_META = {
  "mission-command": { title: "Mission Command", sub: "Opportunity and readiness intelligence" },
  opportunities: { title: "Opportunities", sub: "Funding matches, tracked from match to award · Pipeline" },
  readiness: { title: "Readiness", sub: "TRL · MRL · IRL · Evidence" },
  "action-plan": { title: "Action Plan", sub: "Readiness actions" },
  "knowledge-base": { title: "Knowledge Base", sub: "Documents, opportunity records, readiness gaps and action plans" },
  commercialization: { title: "Commercialization Trail", sub: "A phased plan from evidence to deployment" },
  "technology-profile": { title: "Technology Profile", sub: "Tell us about your organization and technology" },
  team: { title: "Team", sub: (app) => `${app.team.members.length} of 3 seats used` },
  "readiness-questionnaire": { title: "Readiness Questionnaire", sub: "12 sections · about 15 minutes · your answers are saved as you go" },
  "evidence-reasoning": { title: "Evidence Reasoning", sub: "Qualitative findings, run only when you ask" },
  "proposal-assistant": { title: "Proposal Assistant", badge: "Template preview", sub: "Fill-in-the-blanks template built from your questionnaire answers" },
  "readiness-gaps": { title: "Readiness Gaps", sub: "Gaps on matched opportunities and the evidence still needed" },
  settings: { title: "Settings", sub: "Plan usage and appearance" },
};

export const DEMO_SLOTS = ["Tue 10:00", "Tue 14:00", "Wed 11:00", "Thu 15:00", "Suggest a time"];
