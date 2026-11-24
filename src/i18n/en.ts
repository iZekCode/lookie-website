// The site's English text. Same shape as id.ts, which holds the Indonesian.
import type { Copy } from './id';

export const en: Copy = {
  lang: 'en',
  meta: {
    title: 'Lookie: painting in the air for children with CP',
    description:
      'Interactive drawing game for children with cerebral palsy (CP) to support motor skill exercise. Children with CP paint by moving their hands, with computer vision tracking every movement.',
  },
  nav: {
    about: 'About',
    how: 'How to play',
    parents: 'Parents',
    support: 'Support',
    try: 'Try it',
    toggleLabel: 'Choose language',
    home: 'Lookie home',
  },
  hero: {
    titleA: 'Paint',
    titleB: 'in the air.',
    sub: 'Lookie turns therapy exercises into painting. A child with cerebral palsy moves their hands and arms in front of the iPad, and paint shows up on the canvas.',
    primary: 'Try Lookie',
    secondary: 'Meet Lookie',
    note: 'Free. iPad only.',
    deviceAlt: 'The Lookie home screen on an iPad: an easel with a painted house, and Start, Gallery and Report buttons.',
  },
  about: {
    title: 'Hands move, paint appears.',
    p1: 'Lookie is a drawing game for children with cerebral palsy (CP). A child stands in front of the iPad, makes a fist, and swings an arm. The front camera reads the movement and wet oil paint shows up on the canvas.',
    p2: 'Reaching, sweeping and gripping are the same movements practised in therapy. The difference is that here the child is busy painting, not repeating an exercise.',
    stickers: ['Paint with your hands', 'Wet oil paint', 'Free on iPad'],
  },
  cp: {
    title: 'What is cerebral palsy?',
    p1: 'Cerebral palsy (CP) affects how a person controls their movements and holds their posture. Children with CP move differently from other children, and some movements are harder for them.',
    p2: 'That is why they need regular therapy. And the exercises don’t stop at the therapy room door.',
  },
  pain: {
    title: 'Therapy at home isn’t always easy',
    lead: 'Children with CP need therapy at least once a week. Between sessions, the exercises carry on at home with a parent. That is usually where things get stuck.',
    items: [
      { title: 'Same old thing', text: 'The movements repeat until they feel dull.' },
      { title: 'Gets boring', text: 'The child loses interest, and the parent runs out of ways to coax them.' },
      { title: 'Progress you can’t see', text: 'Change is slow, so it’s hard for a parent to tell whether the exercises are working.' },
    ],
  },
  how: {
    title: 'From picking a picture to checking the report',
    steps: [
      {
        title: 'Pick a picture',
        text: 'There are 39 dotted outlines to colour in. A child can also paint freely on a blank canvas.',
        alt: 'Screen recording of Lookie: choosing Template mode, then picking a dotted octagon outline.',
      },
      {
        title: 'Make a fist, swing your arm',
        text: 'Stand in front of the iPad until your hands and arms show on screen. Make a fist and swing your arm, and paint follows the movement. Each hand has its own colour.',
        alt: 'Screen recording of Lookie: hands and arms moving in front of the camera paint red and blue lines on the canvas.',
      },
      {
        title: 'See it in the gallery',
        text: 'Every finished painting goes up on the gallery wall, so a child can look back at everything they have made.',
        alt: 'Screen recording of the Lookie gallery: paintings hanging on a wall, swiped sideways.',
      },
      {
        title: 'Check the report',
        text: 'Parents can see how the child moved: which hand they used, how high they reached, and how it changes over time. The numbers are camera estimates, not a diagnosis.',
        alt: 'Screen recording of the Lookie report: the painting, how much each hand was used, range of motion and progress over time.',
      },
    ],
  },
  audience: {
    kids: {
      title: 'For children',
      items: [
        'Paint with the whole body, not just a finger.',
        'Practise the arm’s range of motion (ROM).',
        'The exercise feels like play.',
      ],
    },
    parents: {
      title: 'For parents',
      items: [
        'A progress report you can open any time.',
        'See how your child’s range of motion changes over time.',
        'Know what your child actually did during home practice.',
      ],
    },
  },
  testing: {
    title: 'Tested with children, guided by experts',
    intro: 'Lookie was built with guidance from medical experts, then tested with children with CP and their parents.',
    kids: {
      title: 'Testing with children',
      text: 'The children had fun and stuck with the painting.',
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
    title: 'The people behind Lookie',
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
    title: 'Want to try Lookie?',
    text: 'Lookie is open for testing on TestFlight, and the App Store version is on its way.',
    testflight: 'Try Lookie on TestFlight',
    appstore: 'Coming soon to the App Store',
    scan: 'On a computer? Scan this with your iPad.',
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
