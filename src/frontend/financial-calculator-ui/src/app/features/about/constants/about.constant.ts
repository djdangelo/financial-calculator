import { AboutLink } from '../interfaces/about-link.interface';
import { StackGroup } from '../interfaces/stack-group.interface';

export const DEVELOPER_NAME = 'Dangelo Aguilar';
export const DEVELOPER_INITIALS = 'DA';
export const EXTERNAL_LINK_TARGET = '_blank';
export const EXTERNAL_LINK_REL = 'noopener noreferrer';

export const DEVELOPER_LINKS: readonly AboutLink[] = [
  { key: 'portfolio', icon: 'pi pi-globe', url: 'https://djdangelo.github.io/portfolio/', label: 'djdangelo.github.io/portfolio' },
  { key: 'github', icon: 'pi pi-github', url: 'https://github.com/djdangelo', label: 'github.com/djdangelo' },
  { key: 'email', icon: 'pi pi-envelope', url: 'mailto:09dj.dangelo@gmail.com', label: '09dj.dangelo@gmail.com' }
];

export const DEVELOPER_STACK: readonly StackGroup[] = [
  { key: 'backend', icon: 'pi pi-server', items: ['.NET Core', 'C#', 'Node.js', 'TypeScript', 'Python', 'PHP', 'Java'] },
  { key: 'frontend', icon: 'pi pi-desktop', items: ['Angular', 'React', 'Tailwind CSS', 'Sass'] },
  { key: 'mobile', icon: 'pi pi-mobile', items: ['Flutter', 'Dart'] },
  { key: 'data', icon: 'pi pi-database', items: ['SQL Server', 'PostgreSQL', 'Oracle', 'MySQL', 'MongoDB', 'Firebase'] },
  { key: 'cloud', icon: 'pi pi-cloud', items: ['Azure', 'AWS', 'Google Cloud', 'GitHub Actions', 'Linux'] }
];

export const APP_STACK: readonly string[] = ['Angular', 'PrimeNG', 'Tailwind CSS', 'Transloco', 'IndexedDB', 'Chart.js'];
