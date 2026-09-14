INSERT INTO public.careers (
  title,
  department,
  employment_type,
  description,
  responsibilities,
  requirements,
  skills,
  apply_link,
  apply_email,
  is_open,
  is_featured,
  posted_date,
  closing_date,
  status,
  experience_level,
  country_code,
  city,
  work_mode,
  salary_min,
  salary_max,
  currency_code,
  is_stipend
)
VALUES

(
  'Global Recruitment Intern',
  'growth',
  'internship',
  'An entry-level recruitment internship supporting candidate operations, recruitment processes, and improvements to hiring workflows.',
  ARRAY[
    'Support candidate screening and selection activities',
    'Maintain recruitment records and applicant tracking systems',
    'Help analyze recruitment data and identify process improvements',
    'Support a positive candidate experience throughout the hiring process'
  ],
  ARRAY[
    'Bachelor''s degree in a relevant field',
    '6 months to 1 year of recruitment or related HR experience',
    'Basic data analysis ability',
    'Strong attention to detail and organization',
    'Proficiency in English'
  ],
  ARRAY[
    'Recruitment',
    'Applicant tracking systems',
    'Data analysis',
    'Excel',
    'Communication'
  ],
  'https://unjobs.org/vacancies/1782177687428',
  'support@eaziwage.com',
  true,
  false,
  '2026-06-02',
  '2026-08-31',
  'open',
  'entry',
  'KE',
  'Nairobi',
  'onsite',
  NULL,
  NULL,
  NULL,
  true
),

(
  'Environmental and Social Development Intern',
  'growth',
  'internship',
  'An internship supporting environmental and social development work, including project screening, documentation, monitoring, research, and reporting.',
  ARRAY[
    'Support environmental and social due diligence activities',
    'Assist with project risk screening and documentation',
    'Contribute to monitoring and reporting activities',
    'Support preparation of research and training materials',
    'Assist with internal knowledge-sharing initiatives'
  ],
  ARRAY[
    'Currently enrolled in or completing a postgraduate programme',
    'Academic background relevant to the role',
    'Interest in development work',
    'Strong analytical and research abilities',
    'Strong written and verbal communication',
    'Good organizational skills',
    'English proficiency'
  ],
  ARRAY[
    'Research',
    'Data analysis',
    'Environmental and social assessment',
    'Documentation',
    'Communication'
  ],
  'https://www.worldbank.org/ext/en/careers/talent-programs/wbg-pioneers',
  'support@eaziwage.com',
  true,
  true,
  '2026-07-15',
  '2026-08-12',
  'open',
  'entry',
  'KE',
  'Nairobi',
  'hybrid',
  NULL,
  NULL,
  NULL,
  true
),

(
  'Digital Marketing Performance Strategist',
  'growth',
  'full-time',
  'A strategic marketing role focused on developing, executing, and optimizing digital and performance marketing initiatives to drive user acquisition, engagement, and revenue.',
  ARRAY[
    'Develop and optimize digital marketing campaigns',
    'Coordinate cross-functional marketing initiatives',
    'Use performance data to improve campaign outcomes',
    'Guide junior team members',
    'Align marketing activity with organizational growth objectives'
  ],
  ARRAY[
    'Bachelor''s degree or equivalent qualification',
    'At least 5 years of relevant experience',
    'Experience in digital and performance marketing',
    'Experience leading or mentoring teams',
    'Strong analytical and project management abilities',
    'Experience with CRM, SEO and marketing automation'
  ],
  ARRAY[
    'Digital marketing',
    'Performance marketing',
    'SEO',
    'CRM',
    'Analytics',
    'Project management'
  ],
  'https://kenya.mimusjobs.com/job/digital-marketing-performance-strategist/',
  'support@eaziwage.com',
  true,
  false,
  '2026-05-26',
  '2026-08-25',
  'open',
  'senior',
  'KE',
  'Nairobi',
  'onsite',
  NULL,
  NULL,
  NULL,
  false
),

(
  'Backend Engineer — Payments',
  'growth',
  'full-time',
  'Design, build and maintain payment processing services, integrations with PSPs, and core financial APIs powering EaziWage products.',
  ARRAY[
    'Design and implement scalable payment APIs',
    'Integrate with payment service providers (PSPs) and banks',
    'Ensure reliability and observability of transaction flows',
    'Collaborate with product and security teams on compliance'
  ],
  ARRAY[
    '3+ years backend engineering experience',
    'Experience with payments or fintech systems a plus',
    'Strong knowledge of REST/GraphQL APIs and databases',
    'Familiarity with security and PCI considerations'
  ],
  ARRAY[
    'Node.js/Go/Java',
    'SQL/Postgres',
    'APIs',
    'Payments integrations',
    'Testing and observability'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  true,
  '2026-08-01',
  '2026-10-01',
  'open',
  'senior',
  NULL,
  'Remote',
  'remote',
  4000,
  8000,
  'USD',
  false
),

(
  'Frontend Engineer — Web',
  'growth',
  'full-time',
  'Build responsive, performant web interfaces for employer and employee portals and improve developer experience for UI components.',
  ARRAY[
    'Develop reusable UI components and pages',
    'Collaborate with product and backend teams to ship features',
    'Improve accessibility and performance',
    'Mentor junior frontend engineers'
  ],
  ARRAY[
    '3+ years frontend experience',
    'Strong React/TypeScript skills',
    'Experience with design systems and testing',
    'Good sense for UX and performance'
  ],
  ARRAY[
    'React',
    'TypeScript',
    'CSS/HTML',
    'Testing (Jest/Playwright)',
    'Design systems'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-08-01',
  '2026-09-30',
  'open',
  'senior',
  'KE',
  'Nairobi',
  'hybrid',
  2500,
  4500,
  'USD',
  false
),

(
  'Mobile Engineer — Android/iOS',
  'growth',
  'full-time',
  'Develop and maintain mobile apps enabling employees and employers to access payroll, payouts and benefits features.',
  ARRAY[
    'Ship features for Android and/or iOS',
    'Collaborate on API design and offline-first behavior',
    'Instrument and improve app performance and reliability',
    'Participate in code reviews and mobile testing'
  ],
  ARRAY[
    '2+ years mobile development experience',
    'Experience with native or React Native',
    'Familiar with app store release processes',
    'Passion for performance and UX'
  ],
  ARRAY[
    'React Native/Swift/Kotlin',
    'Mobile CI/CD',
    'Testing',
    'Crash/Performance monitoring'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-08-05',
  '2026-10-05',
  'open',
  'senior',
  NULL,
  NULL,
  'remote',
  2000,
  4000,
  'USD',
  false
),

(
  'Product Manager — Payroll & Payouts',
  'growth',
  'full-time',
  'Lead product strategy and execution for payroll and payout products, working closely with engineering, partnerships and compliance.',
  ARRAY[
    'Define product roadmap and prioritize features',
    'Coordinate cross-functional delivery',
    'Analyze product metrics and iterate on features',
    'Work with partners and banks to enable integrations'
  ],
  ARRAY[
    '3+ years product management experience',
    'Experience in fintech or payments is highly desirable',
    'Strong analytical and stakeholder management skills',
    'Data-driven decision making'
  ],
  ARRAY[
    'Roadmapping',
    'Analytics',
    'Stakeholder management',
    'Product discovery'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  true,
  '2026-08-03',
  '2026-09-30',
  'open',
  'senior',
  'KE',
  'Nairobi',
  'onsite',
  NULL,
  NULL,
  'KES',
  false
),

(
  'Compliance Officer — Regulatory & AML',
  'growth',
  'full-time',
  'Ensure the business meets regulatory requirements, KYC/AML controls, and supports onboarding of enterprise clients.',
  ARRAY[
    'Maintain and improve compliance program and policies',
    'Run AML/KYC reviews and transaction monitoring',
    'Support audits and regulatory reporting',
    'Train teams on compliance requirements'
  ],
  ARRAY[
    '3+ years compliance experience in financial services',
    'Knowledge of AML/KYC regulations',
    'Strong attention to detail and ethics',
    'Good communication skills'
  ],
  ARRAY[
    'KYC/AML',
    'Policy development',
    'Risk assessment',
    'Compliance tooling'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-07-20',
  '2026-09-20',
  'open',
  'senior',
  'KE',
  'Nairobi',
  'onsite',
  NULL,
  NULL,
  'KES',
  false
),

(
  'Risk Analyst — Credit & Operational Risk',
  'growth',
  'full-time',
  'Monitor and model risk across credit, operational and partner integrations and recommend mitigation strategies.',
  ARRAY[
    'Build and maintain risk models and dashboards',
    'Analyze partner performance and operational incidents',
    'Recommend risk mitigations and policy changes',
    'Work with product to design risk-aware flows'
  ],
  ARRAY[
    '2+ years analytics or risk experience',
    'Strong SQL and Excel skills',
    'Comfort with statistical analysis',
    'Attention to detail'
  ],
  ARRAY[
    'SQL',
    'Data analysis',
    'Risk modelling',
    'Dashboards (Looker/Metabase)'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-07-30',
  '2026-09-30',
  'open',
  'entry',
  NULL,
  NULL,
  'hybrid',
  NULL,
  NULL,
  NULL,
  false
),

(
  'Data Scientist — Payments & Fraud Detection',
  'growth',
  'full-time',
  'Develop ML models and analytics to improve fraud detection, pricing and product personalization.',
  ARRAY[
    'Build and evaluate models for fraud, scoring and segmentation',
    'Deploy models and monitor performance in production',
    'Collaborate with engineering to productionize data products',
    'Communicate findings to stakeholders'
  ],
  ARRAY[
    '3+ years data science or ML experience',
    'Experience with fraud detection or payments desirable',
    'Strong Python and ML tooling skills',
    'Familiarity with model monitoring'
  ],
  ARRAY[
    'Python',
    'Pandas/NumPy/Scikit-learn',
    'ML deployment',
    'SQL',
    'Experimentation'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-08-06',
  '2026-10-06',
  'open',
  'senior',
  NULL,
  NULL,
  'remote',
  3000,
  6000,
  'USD',
  false
),

(
  'DevOps / SRE Engineer',
  'growth',
  'full-time',
  'Maintain CI/CD pipelines, infrastructure as code, monitoring, and ensure high availability for payment systems.',
  ARRAY[
    'Operate and improve deployment pipelines',
    'Manage cloud infrastructure and IaC',
    'Improve system reliability and incident response',
    'Implement cost and performance optimizations'
  ],
  ARRAY[
    '3+ years DevOps/SRE experience',
    'Experience with Kubernetes and cloud providers',
    'Knowledge of CI/CD and IaC',
    'Strong scripting and automation skills'
  ],
  ARRAY[
    'Kubernetes',
    'Terraform',
    'CI/CD',
    'Monitoring (Prometheus/Grafana)',
    'Cloud (AWS/GCP/Azure)'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-07-25',
  '2026-09-25',
  'open',
  'senior',
  NULL,
  NULL,
  'hybrid',
  NULL,
  NULL,
  NULL,
  false
),

(
  'Customer Success Manager — Enterprise',
  'growth',
  'full-time',
  'Manage relationships with employer clients, ensure smooth onboarding, and drive product adoption and retention.',
  ARRAY[
    'Onboard and support enterprise clients',
    'Coordinate implementation and integrations',
    'Drive adoption and value realization',
    'Collect feedback and advocate for customers'
  ],
  ARRAY[
    '3+ years customer success or account management',
    'Experience with B2B SaaS or fintech preferred',
    'Strong communication and project management',
    'Ability to travel occasionally'
  ],
  ARRAY[
    'Client onboarding',
    'Account management',
    'Project coordination',
    'CRM'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-08-02',
  '2026-10-02',
  'open',
  'senior',
  'KE',
  'Nairobi',
  'onsite',
  NULL,
  NULL,
  'KES',
  false
),

(
  'Payroll Specialist — Product Expert',
  'growth',
  'full-time',
  'Domain expert responsible for payroll product configuration, employer support and payroll compliance across jurisdictions.',
  ARRAY[
    'Configure payroll flows and tax rules',
    'Support employer payroll runs and reconciliations',
    'Document payroll processes and best practices',
    'Work with compliance and engineering on product gaps'
  ],
  ARRAY[
    'Payroll or accounting experience',
    'Familiarity with payroll tax rules',
    'Strong attention to detail',
    'Good communication skills'
  ],
  ARRAY[
    'Payroll systems',
    'Accounting basics',
    'Reconciliation',
    'Documentation'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-08-04',
  '2026-10-04',
  'open',
  'entry',
  'KE',
  'Nairobi',
  'onsite',
  NULL,
  NULL,
  'KES',
  false
),

(
  'Fraud Analyst — Transaction Monitoring',
  'growth',
  'full-time',
  'Investigate suspicious transactions, tune detection rules and support automated fraud prevention systems.',
  ARRAY[
    'Review alerts and investigate cases',
    'Tune detection models and rules',
    'Collaborate with ops and legal on escalations',
    'Maintain case documentation and reporting'
  ],
  ARRAY[
    'Experience in fraud operations or investigations',
    'Analytical mindset and attention to detail',
    'Comfort with systems and tooling',
    'Strong written communication'
  ],
  ARRAY[
    'Investigation',
    'Rule tuning',
    'Case management',
    'Reporting'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-07-28',
  '2026-09-28',
  'open',
  'entry',
  NULL,
  NULL,
  'hybrid',
  NULL,
  NULL,
  NULL,
  false
),

(
  'UX/UI Designer — Product',
  'growth',
  'full-time',
  'Design intuitive user experiences for employer dashboards, employee mobile flows and self-service tools.',
  ARRAY[
    'Design product interfaces and prototypes',
    'Own component and interaction patterns',
    'Work closely with product and engineering to ship designs',
    'Conduct user research and usability testing'
  ],
  ARRAY[
    '3+ years product design experience',
    'Strong portfolio demonstrating product UX',
    'Experience designing for mobile and web',
    'Proficiency with Figma or similar tools'
  ],
  ARRAY[
    'Figma',
    'Prototyping',
    'User research',
    'Design systems'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-08-07',
  '2026-10-07',
  'open',
  'senior',
  'KE',
  'Nairobi',
  'hybrid',
  NULL,
  NULL,
  'KES',
  false
),

(
  'Security Engineer — Application & Infrastructure',
  'growth',
  'full-time',
  'Protect EaziWage systems by building secure services, performing threat modeling and running vulnerability management.',
  ARRAY[
    'Perform security reviews and threat modeling',
    'Implement secure development practices',
    'Manage vulnerability scanning and remediation',
    'Support incident response and forensics'
  ],
  ARRAY[
    'Experience in application or cloud security',
    'Knowledge of common vulnerabilities and remediation',
    'Familiarity with secure CI/CD practices',
    'Good communication skills'
  ],
  ARRAY[
    'Threat modeling',
    'Vulnerability management',
    'Security tooling',
    'Cloud security'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-07-18',
  '2026-09-18',
  'open',
  'senior',
  NULL,
  NULL,
  'hybrid',
  NULL,
  NULL,
  NULL,
  false
),

(
  'Legal Counsel — Fintech & Commercial',
  'growth',
  'full-time',
  'Provide legal support on commercial contracts, regulatory matters, partnerships and corporate governance.',
  ARRAY[
    'Draft and negotiate commercial agreements',
    'Advise on regulatory compliance for financial products',
    'Support corporate and governance matters',
    'Manage external counsel where required'
  ],
  ARRAY[
    'Qualified lawyer with corporate/fintech experience',
    'Experience drafting commercial and partnership agreements',
    'Excellent drafting and negotiation skills',
    'Ability to work in a fast-paced startup environment'
  ],
  ARRAY[
    'Contracts',
    'Regulatory advice',
    'Negotiation',
    'Corporate governance'
  ],
  NULL,
  'support@eaziwage.com',
  true,
  false,
  '2026-07-10',
  '2026-09-10',
  'open',
  'senior',
  'KE',
  'Nairobi',
  'onsite',
  NULL,
  NULL,
  'KES',
  false
);
