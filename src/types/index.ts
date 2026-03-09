 export interface SiteConfig {
    name: string;
    description: string;
    url: string;
    language: string;
    author: string;
  }


  export interface NavItem {
    label: string;
    href: string;
  }


  export interface BlogPost {
    title: string;
    description: string;
    date: string;
    slug: string;
    category: string;
    tags: string[];
    image: string;
    imageAlt: string;
    author: string;
  }
