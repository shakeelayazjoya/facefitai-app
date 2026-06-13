export interface StaticContent { title: string; description: string; sections: Array<{ heading: string; body: string[] }> }
export const staticContent: Record<string, StaticContent> = {
  about: { title: 'About', description: 'AI insights for your features.', sections: [{ heading: 'What we do', body: ['Analyze face shape and features.', 'Suggest styles that fit.'] }, { heading: 'Note', body: ['Results are estimates, not medical advice.'] }] },
  contact: { title: 'Support', description: 'We are here to help.', sections: [{ heading: 'Contact', body: ['Share your device and app version.', 'Include the screen and issue.'] }] },
  privacy: { title: 'Privacy', description: 'Your data, clearly handled.', sections: [{ heading: 'Photos', body: ['Photos upload only when you scan.', 'Reuse checks run only when requested.'] }, { heading: 'Account', body: ['Tokens stay in secure storage.', 'Logout clears local access.'] }] },
  disclaimer: { title: 'Disclaimer', description: 'Know the limits.', sections: [{ heading: 'Estimates', body: ['Lighting and pose affect results.', 'Not for medical or legal decisions.'] }] },
  faqs: { title: 'FAQs', description: 'Quick answers.', sections: [{ heading: 'Accuracy', body: ['Use a clear, front-facing selfie.'] }, { heading: 'Saving', body: ['Sign in to save and compare scans.'] }, { heading: 'Tools', body: ['Face, eyes, nose, lips, age, symmetry.'] }] },
  pricing: { title: 'Plans', description: 'Choose what fits.', sections: [{ heading: 'Free', body: ['Core scans and guidance.'] }, { heading: 'Pro', body: ['History, favorites, and style tools.'] }, { heading: 'Business', body: ['Team and admin workflows.'] }] },
};
