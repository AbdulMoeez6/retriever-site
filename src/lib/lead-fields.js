// Form fields shared by Book a demo and the squeeze pages (messages from the original site).
import { DEMO_SLOTS } from "@/lib/sample-data";

export const NAME_FIELD = {
  name: "name",
  label: "Full name",
  autocomplete: "name",
  placeholder: "Jane Doe",
  required: true,
  requiredError: "Please enter your name.",
};

export const EMAIL_FIELD = {
  name: "email",
  label: "Work email",
  type: "email",
  autocomplete: "email",
  placeholder: "jane@university.edu",
  required: true,
  requiredError: "Please enter your work email.",
  invalidError: "That email doesn't look quite right.",
};

export const ORG_FIELD = {
  name: "org",
  label: "Organization",
  autocomplete: "organization",
  placeholder: "Technology transfer office",
  required: true,
  requiredError: "Please enter your organization.",
};

export const ROLE_FIELD = {
  name: "role",
  label: "Role",
  autocomplete: "organization-title",
  placeholder: "Licensing manager",
};

export const SLOT_CHIPS = {
  name: "slot",
  label: "Preferred time",
  options: DEMO_SLOTS,
  required: true,
  requiredError: "Pick a time that suits you.",
  skipInSuccess: "Suggest a time",
};

export const POINTS = ["Evidence-gated TRL, MRL and IRL", "Only human-reviewed evidence counts", "Your team makes the call"];
