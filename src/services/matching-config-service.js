import { matchingConfigDefaults } from '../data/matching-config-defaults.js'

import {
  getMatchingConfig,
  getPublicPublishedMatchingConfig,
  saveMatchingDraft,
  publishMatchingConfig,
} from '../repositories/matching-config-repository.js'

const SUPPORTED_MODES = Object.freeze([
  'tourist',
  'investor',
])

function validateMode(mode) {
  if (!SUPPORTED_MODES.includes(mode)) {
    throw new Error(
      `[RIHLATI] Unsupported matching mode: ${mode}`,
    )
  }
}

function cloneConfig(config) {
  return JSON.parse(
    JSON.stringify(config),
  )
}

function getDefaultConfig(mode) {
  validateMode(mode)

  return cloneConfig(
    matchingConfigDefaults[mode],
  )
}

export async function getPublishedMatchingConfig(mode) {
  validateMode(mode)

  const publishedConfig =
    await getPublicPublishedMatchingConfig(mode)

  if (
    publishedConfig
    && typeof publishedConfig === 'object'
  ) {
    return cloneConfig(publishedConfig)
  }

  return getDefaultConfig(mode)
}

export async function getAdminMatchingConfig(mode) {
  validateMode(mode)

  const document = await getMatchingConfig(mode)

  if (
    document?.draft
    && typeof document.draft === 'object'
  ) {
    return cloneConfig(document.draft)
  }

  if (
    document?.published
    && typeof document.published === 'object'
  ) {
    return cloneConfig(document.published)
  }

  return getDefaultConfig(mode)
}

export async function saveAdminMatchingDraft(
  mode,
  config,
) {
  validateMode(mode)

  await saveMatchingDraft(
    mode,
    cloneConfig(config),
  )
}

export async function publishAdminMatchingConfig(
  mode,
  config,
) {
  validateMode(mode)

  const cleanConfig = cloneConfig(config)

  await publishMatchingConfig(
    mode,
    cleanConfig,
  )

  await saveMatchingDraft(
    mode,
    cleanConfig,
  )
}