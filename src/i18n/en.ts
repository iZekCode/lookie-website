// The site's English text. Same shape as id.ts, which holds the Indonesian.
import type { Copy } from './id';

export const en: Copy = {
  lang: 'en',
  meta: {
    title: 'Lookie: turn little moves into art',
    description:
      'Interactive drawing game for children with cerebral palsy (CP) to support motor skill exercise. Children with CP paint by moving their hands, with computer vision tracking every movement.',
  },
  nav: {
    how: 'How to play',
    support: 'Support',
    try: 'Try it',
    toggleLabel: 'Choose language',
    home: 'Lookie home',
  },
  hero: {
    titleA: 'Turn little moves',
    titleB: 'into art.',
    sub: 'Interactive drawing game for children with Cerebral Palsy to support motor skill exercise. Children paint by moving their hands, with computer vision tracking every movement.',
    primary: 'Try Lookie',
    videoAlt:
      'A short tour of Lookie on an iPad: the home screen, choosing a picture, painting with a fist and an arm sweep, the finished work in the gallery, and the progress report.',
  },
  cp: {
    title: 'Every child moves in their own way',
    p0: 'Every child has different movement abilities and needs. This is also true for children with cerebral palsy (CP).',
    p1: 'Cerebral palsy is a condition that affects how a person controls their movements and maintains posture. Some movements that may seem simple can take extra effort for a child with CP.',
    p2: 'That’s why many children with CP attend regular therapy sessions. Certain exercises may also need to be continued at home, following their therapist’s guidance.',
  },
  pain: {
    title: 'Home practice comes with challenges',
    lead: 'Outside therapy sessions, children can continue practising at home with their parents. But keeping up with these routines isn’t always easy.',
    items: [
      { title: 'Repetitive exercises', text: 'The same movements need to be practised over and over. Eventually, they can start to feel repetitive.' },
      { title: 'Losing interest', text: 'When practice starts to feel like a chore, children may lose interest. Parents are then left finding new ways to keep them engaged.' },
      { title: 'Progress is hard to track', text: 'Progress can happen little by little. Without consistent records, small changes over time can easily go unnoticed.' },
    ],
  },
  how: {
    title: 'Here’s how Lookie works',
    steps: [
      {
        title: 'Pick a picture',
        text: 'Choose from 39 dotted outline templates ready to colour in. Have an idea of your own? Create a custom template by uploading an image or simply describing what you’d like to draw. Or start with a blank canvas and let your creativity run free!',
        alt: 'Screen recording of Lookie: choosing Template mode, then picking a dotted octagon outline.',
      },
      {
        title: 'Make a fist, then move your arm',
        text: 'Stand in front of the iPad until your hands and arms are visible on screen. Make a fist to start painting, then move your arm to create brushstrokes. Each hand has its own colour!',
        alt: 'Screen recording of Lookie: hands and arms moving in front of the camera paint red and blue lines on the canvas.',
      },
      {
        title: 'Explore your art gallery',
        text: 'Every finished painting finds its place on the gallery wall. Children can come back anytime to see and enjoy everything they’ve created.',
        alt: 'Screen recording of the Lookie gallery: paintings hanging on a wall, swiped sideways.',
      },
      {
        title: 'Follow progress through reports',
        text: 'Parents can see their child’s hand activity, including which hand they use, arm reach, painting time, and stroke accuracy. These reports offer a glimpse of how their movements change over time. All measurements are camera-based estimates, not medical assessments or diagnoses.',
        alt: 'Screen recording of the Lookie report: the painting, how much each hand was used, range of motion and progress over time.',
      },
    ],
  },
  testing: {
    title: 'Tested with children, guided by medical professionals',
    intro: 'Lookie was developed with input from medical professionals and tested firsthand with children with CP and their parents.',
    kids: {
      title: 'Tried and tested with children',
      text: 'Children got to experience Lookie for themselves. They enjoyed painting and were happy to keep exploring different movements.',
      alts: [
        'A girl in a grey hijab raises her hand toward an iPad showing a colourful painting.',
        'A boy in a red sweater raises his arm to paint on an iPad while a therapist smiles beside him.',
      ],
    },
    experts: {
      title: 'Guidance from experts',
      quote: 'The concept is great and fun. It has real potential as a therapy tool at home. Please keep developing it.',
      name: 'dr. Rizky Kusuma Wardhani, Sp.K.F.R., Ped. (K)',
      role: 'Head of the Physical Medicine and Rehabilitation Department, RSCM',
      alts: [
        'Two team members with a rehabilitation doctor, holding an iPad that shows the Lookie home screen.',
        'Three women stand together in front of the Physical Medicine and Rehabilitation sign at RSCM, one of them holding an iPad with Lookie on it.',
      ],
    },
  },
  team: {
    title: 'Meet the team behind Lookie',
    linkedin: 'LinkedIn profile',
    members: [
      { name: 'Rizki Hidayatul Laeli', role: 'Project Manager' },
      { name: 'Filbert Naldo Wijaya', role: 'iOS Developer' },
      { name: 'Graceilla Natasya', role: 'UI/UX Designer' },
      { name: 'Kezia Karen Amelia', role: 'UI/UX Designer' },
      { name: 'Adri Maulana Putra', role: 'Product Researcher' },
    ],
  },
  cta: {
    title: 'Come paint with Lookie!',
    text: 'Lookie is open for testing on TestFlight, and the App Store version is on its way.',
    testflight: 'Try Lookie on TestFlight',
    scan: 'Scan with your iPad to try Lookie',
    qrAlt: 'QR code for the Lookie TestFlight invite',
  },
  footer: {
    tagline: 'Turn little moves into art',
    contact: 'Contact',
    help: 'Help',
    instagram: 'Instagram',
    privacy: 'Privacy policy',
    terms: 'Terms of use',
    support: 'Support',
    copyright: '© 2026 Lookie',
    medical: 'Lookie is not a medical device and does not replace therapy.',
  },
  legal: {
    back: 'Back to home',
    privacyTitle: 'Lookie Privacy Policy',
    termsTitle: 'Lookie Terms of Use',
    supportTitle: 'Lookie Support',
    privacyDesc: 'What data Lookie keeps, what it is for, and how to delete it.',
    termsDesc: 'The terms for using Lookie, a painting-in-the-air app for iPad.',
    supportDesc: 'Common questions about Lookie, and how to reach us.',
    otherPages: 'Other pages',
  },
};
