import type { Content } from './types'

/*
 * English copy. Sections marked "from profile" are the approved translation
 * from the brief. Lines marked DRAFT must be confirmed with the client.
 */
export const en: Content = {
  lang: 'en',
  dir: 'ltr',
  meta: {
    title: 'Mudawwana | Every edifice has a story. Every story has a Mudawwana.',
    description:
      'Mudawwana is a creative studio for cinematic visual solutions: documentary and commercial films, corporate and industrial photography, and post-production for industry, leading companies and government entities in Saudi Arabia.',
  },
  ui: {
    nav: 'Main navigation',
    skip: 'Skip to content',
    home: 'Mudawwana — back to top',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    switchLang: 'عربي',
    switchLangLabel: 'تصفح الموقع بالعربية',
    cta: 'Start a project',
    watch: 'Watch',
    playShowreel: 'Watch our work',
    scroll: 'Discover',
    close: 'Close',
    openInDrive: 'Open in Google Drive',
    backToTop: 'Back to top',
    profile: 'Company profile',
  },
  nav: [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'work', label: 'Work' },
    { id: 'vision', label: 'Vision' },
    { id: 'contact', label: 'Contact' },
  ],
  hero: {
    // from profile
    lead: 'Every edifice has a story.',
    line: 'Every story has a',
    accent: 'Mudawwana.',
    // DRAFT
    positioning: 'Cinematic visual solutions for industry, leading companies and government entities.',
  },
  about: {
    label: 'Who we are',
    title: 'Who we are',
    // from profile
    body: 'A creative studio specialised in visual solutions. We believe that behind every industrial landmark and every business lies a story worth capturing to the highest cinematic standard. At Mudawwana, we combine modern technology with the art of visual storytelling to create work that goes beyond documentation — a visual experience that leaves a mark.',
  },
  vision: {
    label: 'Vision & Mission',
    // from profile
    vision: {
      title: 'Vision',
      body: 'To be the leading visual partner for industrial sectors and pioneering companies, and to set a new standard in documentary and commercial filmmaking that unites local authenticity with world-class quality.',
    },
    mission: {
      title: 'Mission',
      body: 'To deliver complete cinematic visual solutions, defined by technical precision and narrative creativity, that empower our clients to communicate their message and embody their identity before their audience in a professional, innovative way.',
    },
  },
  services: {
    label: 'Services',
    title: 'What we make',
    // DRAFT descriptions
    items: [
      {
        id: 'documentary',
        title: 'Documentary films',
        description: 'The stories of landmarks, facilities and the people behind them, told honestly.',
      },
      {
        id: 'commercial',
        title: 'Commercial films',
        description: 'Films that carry your brand’s message with considered rhythm and visual language.',
      },
      {
        id: 'photography',
        title: 'Corporate & industrial photography',
        description: 'Facilities, projects and teams, photographed to a cinematic standard.',
      },
      {
        id: 'post',
        title: 'Post-production & editing',
        description: 'Editing, colour and sound, through to the final master.',
      },
      {
        id: 'identity',
        title: 'Visual identity content',
        description: 'Content that embodies an entity’s identity and unifies its presence.',
      },
    ],
  },
  work: {
    label: 'Work',
    title: 'Selected work',
    // Working titles; categories and descriptions are DRAFT.
    items: [
      {
        id: 'ramadan',
        title: 'Did You See Ramadan?',
        category: 'Commercial',
        description: 'An aerial film of the city during Ramadan, between the sea and its neighbourhoods.',
        alt: 'Aerial shot of a coastal city at sunset under the Arabic title “Did you see Ramadan?”',
      },
      {
        id: 'education',
        title: 'Ibn Al-Nafees Secondary School',
        category: 'Corporate film',
        description: 'A film for the education department introducing Ibn Al-Nafees Secondary School.',
        alt: 'The façade of Ibn Al-Nafees Secondary School with its blue sign',
      },
      {
        id: 'cricket',
        title: 'National Cricket Championship — Qualifiers',
        category: 'Event film',
        description: 'The awards ceremony of the National Cricket Championship qualifiers.',
        alt: 'National Cricket Championship Qualifiers board in golden light',
      },
    ],
  },
  goals: {
    label: 'Goals',
    title: 'Goals',
    // from profile
    items: [
      {
        title: 'Technical excellence',
        body: 'Adopting the latest production and editing technology to guarantee output of high cinematic quality.',
      },
      {
        title: 'Strategic partnership',
        body: 'Building lasting relationships with companies and government entities by understanding their goals and turning them into successful visual stories.',
      },
      {
        title: 'Developing talent',
        body: 'Strengthening local expertise and training young national talent in directing and creative production.',
      },
      {
        title: 'Regional expansion',
        body: 'Growing from the local market to wider regional horizons while keeping the quality of every project uncompromised.',
      },
    ],
  },
  ambition: {
    label: 'Ambition & Vision 2030',
    title: 'Ambition & Vision 2030',
    // from profile
    body: 'Our ambition is born from the heart of the Kingdom’s Vision 2030, which made culture and creativity a pillar of a thriving economy. We aim to play an active role in documenting the industrial and developmental renaissance the Kingdom is witnessing, using our craft to show Saudi Arabia to the world — not only as a destination for investment, but as a home for creativity and inspiring stories. We strive to help build world-class national content that strengthens Saudi identity and places cinematic and documentary production at the forefront of the sectors driving national growth.',
  },
  contact: {
    label: 'Contact',
    title: 'Let’s tell your story',
    intro: 'Tell us about your project and we’ll get back to you.',
    form: {
      name: 'Name',
      mobile: 'Mobile',
      mobileHint: 'e.g. 05XXXXXXXX',
      email: 'Email',
      position: 'Position',
      company: 'Entity / company',
      projectType: 'Project type',
      projectTypePlaceholder: 'Choose a project type',
      message: 'Message',
      optional: 'optional',
      submit: 'Send by email',
      whatsapp: 'or message us on WhatsApp',
      sent: 'We’ve opened a ready-made email in your mail app. If it didn’t open, write to us directly at',
      errors: {
        required: 'This field is required',
        email: 'Enter a valid email address',
        mobile: 'Enter a valid Saudi mobile number, e.g. 05XXXXXXXX',
        summary: 'Please check the highlighted fields',
      },
      mailSubject: 'New project enquiry',
    },
    direct: 'Or directly',
    socials: 'Follow',
  },
  footer: {
    rights: 'Mudawwana. All rights reserved.',
    tagline: 'Every edifice has a story. Every story has a Mudawwana.',
  },
}
