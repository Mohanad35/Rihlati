export const adminSettingsPresentation = Object.freeze({
  contentStatusOptions: Object.freeze(['Draft', 'In review']),
  matchingWorkspaceOptions: Object.freeze([
    Object.freeze({ value: 'tourist', label: 'Tourist Matching' }),
    Object.freeze({ value: 'investor', label: 'Investor Matching' }),
  ]),
  defaults: Object.freeze({
    newContentStatus: 'Draft',
    reviewBeforePublish: true,
    matchingWorkspace: 'tourist',
    testBeforePublish: true,
    explicitPublish: true,
  }),
  architecture: Object.freeze([
    Object.freeze({ label: 'Content lifecycle', value: 'Draft → In review → Published' }),
    Object.freeze({ label: 'Matching approach', value: 'Rule-based + weighted' }),
    Object.freeze({ label: 'Configuration streams', value: 'Tourist and Investor remain separate' }),
  ]),
})
