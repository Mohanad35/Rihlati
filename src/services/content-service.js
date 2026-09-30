import {
  createContentItem,
  deleteContentItem,
  getAllContentItems,
  getPublishedContentItems,
  updateContentItem,
} from '../repositories/content-repository.js'

const CONTENT_TYPES = new Set([
  'Travel Guide',
  'Tourism News',
  'Investment Insight',
  'Story & Experience',
])

const CONTENT_AUDIENCES = new Set([
  'Travellers',
  'Investors',
  'All audiences',
])

const CONTENT_STATUSES = new Set([
  'Published',
  'Draft',
  'In review',
])

function createContentError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

function requireAuthenticatedUser(user) {
  if (!user?.uid) {
    throw createContentError(
      'auth-required',
      'You must be signed in to manage content.',
    )
  }
}

function normalizeText(value) {
  return typeof value === 'string'
    ? value.trim()
    : ''
}

function validateImageUrl(imageUrl) {
  if (!imageUrl) {
    return
  }

  let parsedUrl

  try {
    parsedUrl = new URL(imageUrl)
  } catch {
    throw createContentError(
      'invalid-image-url',
      'Image URL must be a valid web address.',
    )
  }

  if (
    parsedUrl.protocol !== 'https:'
    && parsedUrl.protocol !== 'http:'
  ) {
    throw createContentError(
      'invalid-image-url',
      'Image URL must use HTTP or HTTPS.',
    )
  }
}

function normalizeAndValidateContent(content) {
  if (!content) {
    throw createContentError(
      'missing-content',
      'Content data is required.',
    )
  }

  const normalized = {
    title: normalizeText(content.title),
    contentType: normalizeText(content.contentType),
    category: normalizeText(content.category),
    targetAudience: normalizeText(content.targetAudience),
    location: normalizeText(content.location),
    summary: normalizeText(content.summary),
    imageUrl: normalizeText(content.imageUrl),
    status: normalizeText(content.status),
  }

  if (!normalized.title) {
    throw createContentError(
      'missing-title',
      'Content title is required.',
    )
  }

  if (!CONTENT_TYPES.has(normalized.contentType)) {
    throw createContentError(
      'invalid-content-type',
      'Invalid content type.',
    )
  }

  if (!normalized.category) {
    throw createContentError(
      'missing-category',
      'Content category is required.',
    )
  }

  if (!CONTENT_AUDIENCES.has(normalized.targetAudience)) {
    throw createContentError(
      'invalid-audience',
      'Invalid target audience.',
    )
  }

  if (!normalized.summary) {
    throw createContentError(
      'missing-summary',
      'Content summary is required.',
    )
  }

  if (!CONTENT_STATUSES.has(normalized.status)) {
    throw createContentError(
      'invalid-status',
      'Invalid content status.',
    )
  }

  validateImageUrl(normalized.imageUrl)

  return normalized
}

function getTimestampMillis(timestamp) {
  return typeof timestamp?.toMillis === 'function'
    ? timestamp.toMillis()
    : 0
}

function sortContentByUpdatedDate(items) {
  return [...items].sort(
    (a, b) =>
      getTimestampMillis(b.updatedAt)
      - getTimestampMillis(a.updatedAt),
  )
}

export async function getAdminContentItems(user) {
  requireAuthenticatedUser(user)

  const items = await getAllContentItems()

  return sortContentByUpdatedDate(items)
}

export async function getPublicContentItems() {
  const items = await getPublishedContentItems()

  return sortContentByUpdatedDate(items)
}

export async function createAdminContentItem(user, content) {
  requireAuthenticatedUser(user)

  const validatedContent =
    normalizeAndValidateContent(content)

  const contentId = await createContentItem(
    validatedContent,
  )

  return {
    contentId,
    ...validatedContent,
  }
}

export async function updateAdminContentItem(
  user,
  contentId,
  content,
) {
  requireAuthenticatedUser(user)

  if (!contentId) {
    throw createContentError(
      'missing-content-id',
      'Content ID is required.',
    )
  }

  const validatedContent =
    normalizeAndValidateContent(content)

  await updateContentItem(
    contentId,
    validatedContent,
  )

  return {
    contentId,
    ...validatedContent,
  }
}

export async function deleteAdminContentItem(
  user,
  contentId,
) {
  requireAuthenticatedUser(user)

  if (!contentId) {
    throw createContentError(
      'missing-content-id',
      'Content ID is required.',
    )
  }

  await deleteContentItem(contentId)

  return {
    contentId,
  }
}