import { Doctor, Volunteer, Medication } from './types';

// Hotlinked images from the specifications mapping safely
export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    dosage: '10mg',
    timing: 'Morning',
    instructions: '10mg Tablet • Take with water',
    taken: false,
    days: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: 'med-2',
    name: 'Atorvastatin',
    dosage: '10mg',
    timing: 'Morning',
    instructions: '10mg • After Food',
    taken: false,
    days: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: 'med-3',
    name: 'Multivitamin',
    dosage: '1 Tablet',
    timing: 'Morning',
    instructions: '1 Tablet • Morning',
    taken: false,
    days: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: 'med-4',
    name: 'Metformin',
    dosage: '500mg',
    timing: 'Afternoon',
    instructions: '500mg • Midday',
    taken: false,
    days: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: 'med-5',
    name: 'Melatonin',
    dosage: '5mg',
    timing: 'Night',
    instructions: '5mg • Before Bed',
    taken: false,
    days: [1, 2, 3, 4, 5, 6, 7]
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Chen',
    specialty: 'General Physician',
    experience: 15,
    rating: 4.9,
    reviewsCount: 120,
    availableToday: true,
    nextAvailable: 'Today',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2fTQnbF2uCyOitrar87LS6WL1vVIR4HpeMtrDUCOHRdZJ5VO4VVLpFv8i5zhBVVmH5VRRpT_wQW36IC47lGY1WQmToWVaebYcYDZl5E-PCWlx_8qIPtwFFtr73xEi9Og3L3j3K_oMzO4cFQcwIZ2acgDb-JkfXbNaBIGBolEzS8uMmZN7nS6C0xUKIniy9xs37wsLG6OOHcOaM-PLQ-n48OaaO_8GTG0moyICDvHktwEndI0UArgwTc52wvV_urefLAJowcDp2Q'
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Johnson',
    specialty: 'Heart Specialist',
    experience: 22,
    rating: 5.0,
    reviewsCount: 85,
    availableToday: true,
    nextAvailable: 'Today',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfw-LGTnBLfqHw75lvt5kKIhpTIwcpcUWOamAQFf2VBRNo9xmDOxQ-XGLxdsW1789kxrlkPgJN2udUkAh1NP1htBIESJWMYbFTpuEKuqfkpLn51-jU--XM5JEF89RyyU7bo2w9n60USsjX7Df7qIWN5NzWXPn085lDjQ8O8q_4qzuDkp1G8CdNHsdJlOoqBvb1lCZAIgCwy81-W_Bnjs_PJlaxF2_urS_NiucdJ2mJPctQnlSHbQ6OynRhNlZJOxtxTUK2bHVs2w'
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rodriguez',
    specialty: 'Eye Doctor',
    experience: 10,
    rating: 4.8,
    reviewsCount: 64,
    availableToday: false,
    nextAvailable: 'Tomorrow, 9:00 AM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZar_ZLuE3FXDK53D2GLRn0gvnR9s2bjZ40XLs119MbEHwcIt3GXOvAxfM_SfIScIlGlUIUVTJfS1FVUgtPIDTwTIRu-UhZrd-jAGQeQdtq1njGP9dZynI-EFwXvjCTXuYp20jA1bsjn0Rpz9rGGeEp3kRWyoK-DP7qPTApXL45V5C16MubR51PHVOSALHCFUXhHu--YH6NeOpKbr9HbWLRZqUBESxQJ21-bVTZzpGI6nton_9VxhWEV0lGQCE6BGBssR6pBmSFw'
  }
];

export const VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-1',
    name: 'Sarah Jenkins',
    rating: 4.9,
    quote: 'I love helping seniors with daily tasks and a bit of conversation.',
    description: 'Nurse-in-training. Happy to help with grocery runs and companionship.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK3SDeK1ng_vrBeHYR98Jl7ed2_HMTgBbvtAH4LuyRagBmF8u7CaY0dqFVkKDd_8Vmyo949pBr47G-UTf0ItU6KPt_4nj6aCEnOiO-1k0GYqP_ahHilOXOTSuS-tzfXC6X5Mc9bNFHkrUA1faCa9rpwllSpRWmbnfnzPuVCEHQQYnTYdZZ6ecfABeDc2vJsRILP9EfeE0HJ7AYhxpxu1QEflOcKRE3jiyOWeT5ibWEVTJMCcz1Nqp8yXM4tWxKk-b_6K94EP_iAg'
  },
  {
    id: 'vol-2',
    name: 'Mark David',
    rating: 5.0,
    quote: 'Available for heavy lifting or tech support any evening.',
    description: 'IT Specialist with a passion for volunteering. Super handy.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvQmRaJB2deT4CtsITtLvKa00rBiX1zTgPxRD39NWr5JyEk8DpgDZVkJUWB3xKnbWHitOgqRyqe7PGa-YdOaj72onrsYQYNDqxLAsvbVsK8K1tftWTf-IKsGI7mtpe8-fnVCkL73eu857EcKARg-PNAQzLMZS1kO-UpIQpUgj7FGuB2z_B1RDoR0ZzWSckxy5zMihWXdFvgpnVedZaj2AhEvZce96bfhb03cRmfJkrXqSEq_ZW4HI7oO3wJzaytnaGBMZMhl0GeA'
  },
  {
    id: 'vol-3',
    name: 'Elena Rose',
    rating: 4.8,
    quote: 'Nurse-in-training. Happy to help with grocery runs and companionship.',
    description: 'Compassionate care assistant student. Always ready for a friendly talk.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEEE5mhgN3w-xXsnoFWlOQdfC8osFj1a6RIPzdR7UTLzkRtS3_BXLqq67PDFp7WUvTHxch9Ld5IcMRpEJQm0HAJZPW3hy3WdYurvwi3GVUWtv89z-N0ZpkGYW2jXODN3T7etJ7or1gJJpWHcANxQI7Wl5EhUpbTeYoCng2RFeMIUcFRMTv4ph9me4Xvji6QMN0XiCP16OBZcj6C7d1RfXTCl-XI85BZoYQxmaP2cws3XBBMTpJBJSCk3zWx--6n5A2R1jlFtGUuQ'
  }
];
