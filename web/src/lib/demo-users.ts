export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "organization" | "volunteer";
  organization?: string;
  createdAt: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: "demo_powdersany",
    name: "Syahnahl (Demo Owner)",
    email: "demo@veriaid.ai",
    password: "veriaid2026",
    role: "organization",
    organization: "Yayasan Tangguh Bencana",
    createdAt: "2026-06-19T00:00:00.000Z",
  },
  {
    id: "demo_volunteer",
    name: "Rina志愿者 (Demo Volunteer)",
    email: "volunteer@veriaid.ai",
    password: "veriaid2026",
    role: "volunteer",
    createdAt: "2026-06-19T00:00:00.000Z",
  },
];