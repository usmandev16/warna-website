export type Lang = 'ar' | 'en'

export type SectionId = 'about' | 'services' | 'work' | 'vision' | 'contact'

export type ServiceId = 'documentary' | 'commercial' | 'photography' | 'post' | 'identity'

export type WorkId = 'ramadan' | 'education' | 'cricket'

export interface NavItem {
  id: SectionId
  label: string
}

export interface TitledText {
  title: string
  body: string
}

export interface ServiceCopy {
  id: ServiceId
  title: string
  description: string
}

export interface WorkCopy {
  id: WorkId
  title: string
  category: string
  description: string
  alt: string
}

export interface FormCopy {
  name: string
  mobile: string
  mobileHint: string
  email: string
  position: string
  company: string
  projectType: string
  projectTypePlaceholder: string
  message: string
  optional: string
  submit: string
  whatsapp: string
  sent: string
  errors: {
    required: string
    email: string
    mobile: string
    summary: string
  }
  mailSubject: string
}

export interface Content {
  lang: Lang
  dir: 'rtl' | 'ltr'
  meta: { title: string; description: string }
  ui: {
    nav: string
    skip: string
    home: string
    menuOpen: string
    menuClose: string
    switchLang: string
    switchLangLabel: string
    cta: string
    watch: string
    playShowreel: string
    scroll: string
    close: string
    openInDrive: string
    backToTop: string
    profile: string
  }
  nav: NavItem[]
  hero: {
    lead: string
    line: string
    accent: string
    positioning: string
  }
  about: { label: string; title: string; body: string }
  vision: { label: string; vision: TitledText; mission: TitledText }
  services: { label: string; title: string; items: ServiceCopy[] }
  work: { label: string; title: string; items: WorkCopy[] }
  goals: { label: string; title: string; items: TitledText[] }
  ambition: { label: string; title: string; body: string }
  contact: {
    label: string
    title: string
    intro: string
    form: FormCopy
    direct: string
    socials: string
  }
  footer: { rights: string; tagline: string }
}
