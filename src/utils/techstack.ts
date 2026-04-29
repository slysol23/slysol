export interface TechStackOption {
  label: string;
  value: string;
}

export const TECH_STACK_OPTIONS: TechStackOption[] = [
  { label: 'HTML5', value: 'html5' },
  { label: 'CSS3', value: 'css3' },
  { label: 'Sass', value: 'sass' },
  { label: 'React JS', value: 'react-js' },
  { label: 'Next JS', value: 'next-js' },
  { label: 'Vue JS', value: 'vue-js' },
  { label: 'Nuxt JS', value: 'nuxt-js' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Astro', value: 'astro' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'React Native', value: 'react-native' },
  { label: 'Flutter', value: 'flutter' },
  { label: 'Dart', value: 'dart' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Node JS', value: 'node-js' },
  { label: 'Express JS', value: 'express-js' },
  { label: 'Nest JS', value: 'nest-js' },
  { label: 'Fastify', value: 'fastify' },
  { label: 'Django', value: 'django' },
  { label: 'Flask', value: 'flask' },
  { label: 'FastAPI', value: 'fastapi' },
  { label: 'Ruby on Rails', value: 'ruby-on-rails' },
  { label: 'Spring Boot', value: 'spring-boot' },
  { label: '.NET', value: 'dotnet' },
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'SQL Server', value: 'sql-server' },
  { label: 'SQLite', value: 'sqlite' },
  { label: 'Redis', value: 'redis' },
  { label: 'Elasticsearch', value: 'elasticsearch' },
  { label: 'Supabase', value: 'supabase' },
  { label: 'Prisma', value: 'prisma' },
  { label: 'Drizzle ORM', value: 'drizzle-orm' },
  { label: 'Tailwind CSS', value: 'tailwind-css' },
  { label: 'Bootstrap', value: 'bootstrap' },
  { label: 'Material UI', value: 'material-ui' },
  { label: 'Shadcn UI', value: 'shadcn-ui' },
  { label: 'Redux', value: 'redux' },
  { label: 'Zustand', value: 'zustand' },
  { label: 'TanStack Query', value: 'tanstack-query' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'REST API', value: 'rest-api' },
  { label: 'tRPC', value: 'trpc' },
  { label: 'WebSockets', value: 'websockets' },
  { label: 'Firebase', value: 'firebase' },
  { label: 'Vercel', value: 'vercel' },
  { label: 'AWS', value: 'aws' },
  { label: 'Azure', value: 'azure' },
  { label: 'Google Cloud', value: 'google-cloud' },
  { label: 'Docker', value: 'docker' },
  { label: 'Kubernetes', value: 'kubernetes' },
  { label: 'Terraform', value: 'terraform' },
  { label: 'GitHub Actions', value: 'github-actions' },
  { label: 'Jenkins', value: 'jenkins' },
  { label: 'Nginx', value: 'nginx' },
  { label: 'Cloudflare', value: 'cloudflare' },
  { label: 'Laravel', value: 'laravel' },
  { label: 'PHP', value: 'php' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'Stripe', value: 'stripe' },
  { label: 'WordPress', value: 'wordpress' },
  { label: 'Shopify', value: 'shopify' },
  { label: 'WooCommerce', value: 'woocommerce' },
  { label: 'Webflow', value: 'webflow' },
  { label: 'Figma', value: 'figma' },
];

export const normalizeTechStackKey = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/\+/g, '-plus-')
    .replace(/#/g, '-sharp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

export const findTechStackOption = (value: string) => {
  const normalized = normalizeTechStackKey(value);

  return TECH_STACK_OPTIONS.find(
    (option) =>
      normalizeTechStackKey(option.value) === normalized ||
      normalizeTechStackKey(option.label) === normalized,
  );
};

export const normalizeTechStackValue = (value: string) => {
  const option = findTechStackOption(value);
  return option?.value ?? value.trim();
};

export const normalizeTechStackList = (values: string[]) => {
  const seen = new Set<string>();
  const normalized: string[] = [];

  values.forEach((value) => {
    const nextValue = normalizeTechStackValue(value);
    const key = normalizeTechStackKey(nextValue);

    if (!nextValue || seen.has(key)) return;

    seen.add(key);
    normalized.push(nextValue);
  });

  return normalized;
};

export const getTechStackLabel = (value: string) =>
  findTechStackOption(value)?.label ?? value.trim();
