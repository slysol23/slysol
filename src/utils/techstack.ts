export interface TechStackOption {
  label: string;
  value: string;
}

export const TECH_STACK_OPTIONS: TechStackOption[] = [
  { label: 'React JS', value: 'react-js' },
  { label: 'Next JS', value: 'next-js' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Node JS', value: 'node-js' },
  { label: 'Express JS', value: 'express-js' },
  { label: 'Nest JS', value: 'nest-js' },
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'Tailwind CSS', value: 'tailwind-css' },
  { label: 'Bootstrap', value: 'bootstrap' },
  { label: 'Redux', value: 'redux' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'Firebase', value: 'firebase' },
  { label: 'AWS', value: 'aws' },
  { label: 'Docker', value: 'docker' },
  { label: 'Laravel', value: 'laravel' },
  { label: 'PHP', value: 'php' },
  { label: 'Python', value: 'python' },
];

const normalizeTechStackKey = (value: string) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
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
