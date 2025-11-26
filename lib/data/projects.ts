export interface Project {
  id: number;
  name: string;
  category: string;
  description: string;
  fullDescription?: string;
  gradient: string;
  tags: string[];
  year: string;
  images?: string[];
  client?: string;
  services?: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'Zapier',
    category: 'Brand Identity',
    description: 'DRIVE FOUNDER FROM DAY ZERO',
    fullDescription: 'Complete brand identity transformation for Zapier, focusing on founder-driven messaging and visual storytelling.',
    gradient: 'from-orange-500 to-red-500',
    tags: ['Brand Identity', 'Logo Design', 'Visual System'],
    year: '2024',
    images: [
      '/images/projects/zapier/1.jpg',
      '/images/projects/zapier/2.jpg',
      '/images/projects/zapier/3.jpg',
    ],
    client: 'Zapier',
    services: ['Brand Strategy', 'Logo Design', 'Visual Identity', 'Brand Guidelines'],
  },
  {
    id: 2,
    name: 'Roland',
    category: 'Product Design',
    description: 'Digital Piano',
    fullDescription: 'Product design and digital experience for Roland digital piano platform.',
    gradient: 'from-gray-800 to-gray-900',
    tags: ['Product Design', 'UI/UX', 'Digital Experience'],
    year: '2024',
    images: [
      '/images/projects/roland/1.jpg',
      '/images/projects/roland/2.jpg',
      '/images/projects/roland/3.jpg',
    ],
    client: 'Roland',
    services: ['Product Design', 'UI/UX', 'Digital Experience'],
  },
  {
    id: 3,
    name: 'Vimeo',
    category: 'Platform Design',
    description: 'Filmmakers Platform',
    fullDescription: 'Platform design and user experience for Vimeo\'s filmmaker community.',
    gradient: 'from-blue-500 to-cyan-500',
    tags: ['Platform Design', 'Web App', 'User Experience'],
    year: '2024',
    images: [
      '/images/projects/vimeo/1.jpg',
      '/images/projects/vimeo/2.jpg',
      '/images/projects/vimeo/3.jpg',
    ],
    client: 'Vimeo',
    services: ['Platform Design', 'Web App', 'User Experience'],
  },
  {
    id: 4,
    name: 'Amazon',
    category: 'Healthcare',
    description: 'Pharmacy',
    fullDescription: 'Healthcare brand design for Amazon Pharmacy, focusing on trust and accessibility.',
    gradient: 'from-yellow-400 to-orange-500',
    tags: ['Healthcare', 'E-commerce', 'Brand Design'],
    year: '2024',
    images: [
      '/images/projects/amazon/1.jpg',
      '/images/projects/amazon/2.jpg',
      '/images/projects/amazon/3.jpg',
    ],
    client: 'Amazon',
    services: ['Healthcare Branding', 'E-commerce Design', 'Brand Identity'],
  },
  {
    id: 5,
    name: 'OPA!',
    category: 'Food & Beverage',
    description: 'Sushi Brand',
    fullDescription: 'Complete brand identity and packaging design for OPA! sushi restaurant chain.',
    gradient: 'from-orange-400 to-red-500',
    tags: ['Food & Beverage', 'Brand Identity', 'Packaging'],
    year: '2024',
    images: [
      '/images/projects/opa/1.jpg',
      '/images/projects/opa/2.jpg',
      '/images/projects/opa/3.jpg',
    ],
    client: 'OPA!',
    services: ['Brand Identity', 'Packaging Design', 'Visual System'],
  },
  {
    id: 6,
    name: 'Kins',
    category: 'Health & Fitness',
    description: 'Virtual PT',
    fullDescription: 'App design and brand identity for Kins virtual physical therapy platform.',
    gradient: 'from-green-500 to-emerald-500',
    tags: ['Health & Fitness', 'App Design', 'Brand Identity'],
    year: '2024',
    images: [
      '/images/projects/kins/1.jpg',
      '/images/projects/kins/2.jpg',
      '/images/projects/kins/3.jpg',
    ],
    client: 'Kins',
    services: ['App Design', 'Brand Identity', 'UI/UX'],
  },
  {
    id: 7,
    name: 'Brand A',
    category: 'Brand Identity',
    description: 'Complete brand transformation',
    fullDescription: 'Complete brand transformation including strategy, identity, and visual system.',
    gradient: 'from-purple-500 to-pink-500',
    tags: ['Brand Identity', 'Strategy', 'Visual Design'],
    year: '2023',
    images: [
      '/images/projects/brand-a/1.jpg',
      '/images/projects/brand-a/2.jpg',
      '/images/projects/brand-a/3.jpg',
    ],
    client: 'Brand A',
    services: ['Brand Strategy', 'Brand Identity', 'Visual Design'],
  },
  {
    id: 8,
    name: 'Brand B',
    category: 'Logo Design',
    description: 'Modern logo system',
    fullDescription: 'Modern logo system and brand guidelines for Brand B.',
    gradient: 'from-indigo-500 to-purple-500',
    tags: ['Logo Design', 'Brand Guidelines', 'Identity'],
    year: '2023',
    images: [
      '/images/projects/brand-b/1.jpg',
      '/images/projects/brand-b/2.jpg',
      '/images/projects/brand-b/3.jpg',
    ],
    client: 'Brand B',
    services: ['Logo Design', 'Brand Guidelines', 'Brand Identity'],
  },
  {
    id: 9,
    name: 'Brand C',
    category: 'Web Design',
    description: 'E-commerce platform',
    fullDescription: 'E-commerce platform design and development for Brand C.',
    gradient: 'from-teal-500 to-blue-500',
    tags: ['Web Design', 'E-commerce', 'UI/UX'],
    year: '2023',
    images: [
      '/images/projects/brand-c/1.jpg',
      '/images/projects/brand-c/2.jpg',
      '/images/projects/brand-c/3.jpg',
    ],
    client: 'Brand C',
    services: ['Web Design', 'E-commerce', 'UI/UX'],
  },
];

export function getProjectById(id: number): Project | undefined {
  return projects.find(project => project.id === id);
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === 'All') return projects;
  return projects.filter(project => project.category === category);
}

export function getRelatedProjects(currentProjectId: number, limit: number = 3): Project[] {
  const currentProject = getProjectById(currentProjectId);
  if (!currentProject) return [];

  // Get projects from the same category, excluding current project
  const related = projects.filter(
    project => project.category === currentProject.category && project.id !== currentProjectId
  );

  // If not enough related projects, fill with other projects
  if (related.length < limit) {
    const others = projects.filter(
      project => project.id !== currentProjectId && !related.some(r => r.id === project.id)
    );
    return [...related, ...others].slice(0, limit);
  }

  return related.slice(0, limit);
}

