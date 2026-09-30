import { createAdminShell } from '../components/admin-shell.js'
import { createBadge, createCard } from '../components/ui.js'
import { adminContentPresentation as presentation } from '../data/admin-content-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'
import { getCurrentUser } from '../services/auth-service.js'
import {
  createAdminContentItem,
  deleteAdminContentItem,
  getAdminContentItems,
  updateAdminContentItem,
} from '../services/content-service.js'

const statusTones = Object.freeze({
  Published: 'brand',
  Draft: 'sand',
  'In review': 'gold',
})

function createStatusBadge(status) {
  return createBadge(status, statusTones[status] ?? 'sand', 'admin-content-status')
}

function formatContentDate(timestamp) {
  if (typeof timestamp?.toDate === 'function') {
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(timestamp.toDate())
  }

  if (typeof timestamp === 'string' && timestamp.trim()) {
    return timestamp
  }

  return 'Unknown date'
}

function createContentIdentity(item) {
  return createElement('span', {
    className: 'admin-content-identity',
    children: [
      createElement('strong', { className: 'admin-content-identity__title', text: item.title }),
      createElement('span', { className: 'admin-content-identity__summary', text: item.summary }),
    ],
  })
}

function createViewButton(item, selected, view) {
  return createElement('button', {
    className: 'admin-content-view',
    attributes: {
      type: 'button',
      'data-content-id': item.id,
      'data-content-view': view,
      'aria-pressed': String(selected),
      'aria-controls': 'admin-content-detail',
      'aria-label': `Inspect and edit ${item.title}`,
    },
    text: selected ? 'Editing' : 'View / edit',
  })
}

function createContentRow(item, selected) {
  return createElement('tr', {
    className: ['admin-content-table__row', selected ? 'is-selected' : '']
      .filter(Boolean)
      .join(' '),
    children: [
      createElement('th', {
        attributes: { scope: 'row' },
        children: [createContentIdentity(item)],
      }),
      createElement('td', { children: [createBadge(item.contentType, 'terracotta')] }),
      createElement('td', { text: item.targetAudience }),
      createElement('td', {
  text: formatContentDate(item.updatedAt),}),
      createElement('td', { children: [createStatusBadge(item.status)] }),
      createElement('td', {
        className: 'admin-content-table__action',
        children: [createViewButton(item, selected, 'table')],
      }),
    ],
  })
}

function createMetaItem(label, value) {
  return createElement('div', {
    children: [
      createElement('dt', { text: label }),
      createElement('dd', { text: value }),
    ],
  })
}

function createContentCard(item, selected) {
  return createElement('li', {
    children: [
      createCard({
        tagName: 'article',
        className: ['admin-content-card', selected ? 'is-selected' : '']
          .filter(Boolean)
          .join(' '),
        children: [
          createElement('div', {
            className: 'admin-content-card__heading',
            children: [createBadge(item.contentType, 'terracotta'), createStatusBadge(item.status)],
          }),
          createElement('h3', { text: item.title }),
          createElement('p', { text: item.summary }),
          createElement('dl', {
            className: 'admin-content-card__meta',
            children: [
              createMetaItem('Audience', item.targetAudience),
              createMetaItem(
  'Updated',
  formatContentDate(item.updatedAt),
),
            ],
          }),
          createViewButton(item, selected, 'card'),
        ],
      }),
    ],
  })
}

function createSelectField({ id, name, label, value, options }) {
  return createElement('div', {
    className: 'admin-content-form__field',
    children: [
      createElement('label', { attributes: { for: id }, text: label }),
      createElement('select', {
        attributes: { id, name, required: true },
        children: options.map((option) =>
          createElement('option', {
            attributes: { value: option, selected: option === value },
            text: option,
          }),
        ),
      }),
    ],
  })
}

function createInputField({ id, name, label, value, required = true, full = false }) {
  return createElement('div', {
    className: ['admin-content-form__field', full ? 'admin-content-form__field--full' : '']
      .filter(Boolean)
      .join(' '),
    children: [
      createElement('label', { attributes: { for: id }, text: label }),
      createElement('input', {
        attributes: {
          id,
          name,
          type: 'text',
          value,
          ...(required ? { required: true } : {}),
        },
      }),
    ],
  })
}

function createEditor(item) {
  const contentTypes = presentation.typeFilters
    .filter((filter) => filter.value !== 'All')
    .map((filter) => filter.value)
  const statuses = presentation.statusFilters.filter((status) => status !== 'All statuses')

  return [
    createElement('div', {
      className: 'admin-content-detail__heading',
      children: [
        createElement('div', {
          children: [
            createElement('p', { text: 'Content details' }),
            createElement('h2', {
              attributes: { id: 'admin-content-detail-title' },
              text: item.title,
            }),
          ],
        }),
        createStatusBadge(item.status),
      ],
    }),
    createElement('form', {
      className: 'admin-content-form',
      attributes: {
        'data-content-form': true,
        'data-content-id': item.id,
        'aria-describedby': 'admin-content-persistence-note',
      },
      children: [
        createInputField({
          id: 'admin-content-title-field',
          name: 'title',
          label: 'Title',
          value: item.title,
          full: true,
        }),
        createSelectField({
          id: 'admin-content-type-field',
          name: 'contentType',
          label: 'Content type',
          value: item.contentType,
          options: contentTypes,
        }),
        createInputField({
          id: 'admin-content-category-field',
          name: 'category',
          label: 'Category',
          value: item.category,
        }),
        createSelectField({
          id: 'admin-content-audience-field',
          name: 'targetAudience',
          label: 'Target audience',
          value: item.targetAudience,
          options: presentation.audienceOptions,
        }),
        createInputField({
          id: 'admin-content-location-field',
          name: 'location',
          label: 'Location (optional)',
          value: item.location,
          required: false,
        }),
        createInputField({
  id: 'admin-content-image-field',
  name: 'imageUrl',
  label: 'Image URL (optional)',
  value: item.imageUrl ?? '',
  required: false,
  full: true,
}),
        createElement('div', {
          className: 'admin-content-form__field admin-content-form__field--full',
          children: [
            createElement('label', {
              attributes: { for: 'admin-content-summary-field' },
              text: 'Summary',
            }),
            createElement('textarea', {
              text: item.summary,
              attributes: {
                id: 'admin-content-summary-field',
                name: 'summary',
                rows: '4',
                required: true,
              },
            }),
          ],
        }),
        createSelectField({
          id: 'admin-content-status-field',
          name: 'status',
          label: 'Status',
          value: item.status,
          options: statuses,
        }),
        createElement('div', {
          className: 'admin-content-form__actions admin-content-form__field--full',
          children: [
            createElement('button', {
  className: 'admin-content-form__apply',
  attributes: {
    type: 'submit',
    'data-content-apply': true,
  },
  text: item.id === '__new__'
    ? 'Create content'
    : 'Save changes',
}),
            createElement('button', {
              className: 'admin-content-form__reset',
              attributes: {
                type: 'button',
                'data-content-reset': item.id,
              },
              text: 'Reset preview',
            }),
          ],
        }),
        createElement('button', {
        className: 'admin-content-form__delete',
        attributes: {
          type: 'button',
          'data-content-delete': item.id,
        },
        text: 'Delete content',
      }),
        createElement('p', {
  className: 'admin-content-form__note admin-content-form__field--full',
  attributes: {
    id: 'admin-content-persistence-note',
  },
  text:
    item.id === '__new__'
      ? 'Create this item to save it to the RIHLATI content hub.'
      : 'Changes will be saved to the RIHLATI content hub.',
}),
      ],
    }),
  ]
}

function createEmptyEditor() {
  return [
    createElement('div', {
      className: 'admin-content-detail__empty',
      children: [
        createElement('h2', {
          attributes: { id: 'admin-content-detail-title' },
          text: 'No content selected',
        }),
        createElement('p', {
          text: 'Adjust the filters to inspect a presentation content item.',
        }),
      ],
    }),
  ]
}

function createContentView(initialItems = []) {
  const originalItems = new Map(
    initialItems.map((item) => [
      item.id,
      { ...item },
    ]),
  )

  const state = {
    typeFilter: 'All',
    statusFilter: 'All statuses',
    selectedId: initialItems[0]?.id ?? '',
    items: initialItems.map((item) => ({
      ...item,
    })),
    message: '',
  }

  const typeButtons = new Map()

  const tableBody = createElement('tbody')

  const mobileList = createElement('ul', {
    className: 'admin-content-mobile-list',
    attributes: {
      'aria-label': 'Content items',
    },
  })

  const resultCount = createElement('p', {
    className: 'admin-content__result-count',
    attributes: {
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  })

  const editAnnouncement = createElement('p', {
    className: 'visually-hidden',
    attributes: {
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  })

  const detailPanel = createCard({
    tagName: 'aside',
    className: 'admin-content-detail reveal',
    attributes: {
      id: 'admin-content-detail',
      'aria-labelledby': 'admin-content-detail-title',
    },
  })

  const typeFilters = createElement('div', {
    className: 'admin-content-type-filters',
    attributes: {
      role: 'group',
      'aria-label': 'Filter content by type',
    },

    children: presentation.typeFilters.map((filter) => {
      const button = createElement('button', {
        className: 'admin-content-type-filters__button',

        attributes: {
          type: 'button',
          'data-content-type-filter': filter.value,
          'aria-pressed': String(
            filter.value === state.typeFilter,
          ),
        },

        text: filter.label,
      })

      typeButtons.set(
        filter.value,
        button,
      )

      return button
    }),
  })

  const statusSelect = createElement('select', {
    attributes: {
      id: 'admin-content-status-filter',
      'data-content-status-filter': true,
    },

    children: presentation.statusFilters.map(
      (status) =>
        createElement('option', {
          attributes: {
            value: status,
          },
          text: status,
        }),
    ),
  })

  const table = createElement('table', {
    className: 'admin-content-table',

    children: [
      createElement('caption', {
        className: 'visually-hidden',
        text: 'Explore and Insights content items',
      }),

      createElement('thead', {
        children: [
          createElement('tr', {
            children: [
              createElement('th', {
                attributes: {
                  scope: 'col',
                },
                text: 'Content',
              }),

              createElement('th', {
                attributes: {
                  scope: 'col',
                },
                text: 'Type',
              }),

              createElement('th', {
                attributes: {
                  scope: 'col',
                },
                text: 'Audience',
              }),

              createElement('th', {
                attributes: {
                  scope: 'col',
                },
                text: 'Updated',
              }),

              createElement('th', {
                attributes: {
                  scope: 'col',
                },
                text: 'Status',
              }),

              createElement('th', {
                attributes: {
                  scope: 'col',
                },
                text: 'Action',
              }),
            ],
          }),
        ],
      }),

      tableBody,
    ],
  })

  const main = createElement('main', {
    className: 'admin-content-main animate-fade',

    attributes: {
      id: 'main-content',
      tabindex: '-1',
      'aria-labelledby': 'admin-content-title',
    },

    children: [
      createElement('div', {
        className: 'admin-content__intro reveal',

        children: [
          createElement('div', {
            children: [
              createElement('p', {
                className: 'admin-content__eyebrow',
                text: 'Explore & Insights',
              }),

              createElement('h2', {
                text: 'Content management',
              }),

              createElement('p', {
                text:
                  'Review travel guides, tourism news, investment insights, and stories across the RIHLATI content hub.',
              }),
            ],
          }),

         createElement('button', {
  className: 'admin-content__new',

  attributes: {
    type: 'button',
    'data-content-new': true,
  },

  text: 'New content',
}),
        ],
      }),

      createElement('div', {
        className: 'admin-content__toolbar',

        children: [
          typeFilters,

          createElement('div', {
            className: 'admin-content-status-filter',

            children: [
              createElement('label', {
                attributes: {
                  for: 'admin-content-status-filter',
                },

                text: 'Status',
              }),

              statusSelect,
            ],
          }),

          resultCount,
        ],
      }),

      createElement('div', {
        className: 'admin-content__layout',

        children: [
          createElement('section', {
            className: 'admin-content__items',

            attributes: {
              'aria-label': 'Content list',
            },

            children: [
              createCard({
                className:
                  'admin-content-table-card reveal',
                children: [table],
              }),

              mobileList,
            ],
          }),

          detailPanel,
        ],
      }),

      editAnnouncement,
    ],
  })

  function getVisibleItems() {
    return state.items.filter((item) => {
      const typeMatches =
        state.typeFilter === 'All'
        || item.contentType === state.typeFilter

      const statusMatches =
        state.statusFilter === 'All statuses'
        || item.status === state.statusFilter

      return typeMatches && statusMatches
    })
  }

  function reconcileSelection(items) {
    if (
      !items.some(
        (item) =>
          item.id === state.selectedId,
      )
    ) {
      state.selectedId =
        items[0]?.id ?? ''
    }
  }

  function render() {
    const visibleItems =
      getVisibleItems()

    reconcileSelection(
      visibleItems,
    )

    for (
      const [value, button]
      of typeButtons
    ) {
      const active =
        value === state.typeFilter

      button.classList.toggle(
        'is-active',
        active,
      )

      button.setAttribute(
        'aria-pressed',
        String(active),
      )
    }

    statusSelect.value =
      state.statusFilter

    resultCount.textContent =
      `${visibleItems.length} ${
        visibleItems.length === 1
          ? 'item'
          : 'items'
      }`

    if (visibleItems.length) {
      tableBody.replaceChildren(
        ...visibleItems.map(
          (item) =>
            createContentRow(
              item,
              item.id === state.selectedId,
            ),
        ),
      )

      mobileList.replaceChildren(
        ...visibleItems.map(
          (item) =>
            createContentCard(
              item,
              item.id === state.selectedId,
            ),
        ),
      )
    } else {
      tableBody.replaceChildren(
        createElement('tr', {
          children: [
            createElement('td', {
              className:
                'admin-content__empty-row',

              attributes: {
                colspan: '6',
              },

              text:
                'No content matches these filters.',
            }),
          ],
        }),
      )

      mobileList.replaceChildren(
        createElement('li', {
          className:
            'admin-content__empty-card',

          text:
            'No content matches these filters.',
        }),
      )
    }

    const selectedItem =
      state.items.find(
        (item) =>
          item.id === state.selectedId,
      )

    detailPanel.replaceChildren(
      ...(
        selectedItem
          ? createEditor(selectedItem)
          : createEmptyEditor()
      ),
    )

    editAnnouncement.textContent =
      state.message
  }

  async function handleClick(event) {
    const newContentButton =
  event.target.closest('[data-content-new]')

if (newContentButton) {
  const draftItem = {
    id: '__new__',
    schemaVersion: 1,
    title: '',
    contentType: 'Travel Guide',
    category: '',
    targetAudience: 'Travellers',
    location: '',
    imageUrl: '',
    summary: '',
    status: 'Draft',
    createdAt: null,
    updatedAt: null,
  }

  const existingIndex =
    state.items.findIndex(
      (item) => item.id === '__new__',
    )

  if (existingIndex >= 0) {
    state.items[existingIndex] =
      draftItem
  } else {
    state.items.unshift(
      draftItem,
    )
  }

  state.selectedId = '__new__'
  state.message = ''

  render()

  main.querySelector(
    '#admin-content-title-field',
  )?.focus()

  return
}

const deleteButton =
  event.target.closest('[data-content-delete]')

if (deleteButton) {
  const contentId =
    deleteButton.dataset.contentDelete

  const item =
    state.items.find(
      (contentItem) =>
        contentItem.id === contentId,
    )

  if (!item) {
    return
  }

  const confirmed = window.confirm(
    `Delete "${item.title}"?\n\nThis action cannot be undone.`,
  )

  if (!confirmed) {
    return
  }

  const user = getCurrentUser()

  if (!user) {
    state.message =
      'You must be signed in as an Admin to delete content.'

    editAnnouncement.textContent =
      state.message

    return
  }

  deleteButton.disabled = true
  deleteButton.setAttribute(
    'aria-busy',
    'true',
  )

  state.message =
    `Deleting ${item.title}...`

  editAnnouncement.textContent =
    state.message

  try {
    await deleteAdminContentItem(
      user,
      contentId,
    )

    const items =
      await getAdminContentItems(user)

    state.selectedId = ''

    setItems(items)

    state.message =
      `${item.title} was deleted successfully.`

    editAnnouncement.textContent =
      state.message

    render()
  } catch (error) {
    console.error(
      'Failed to delete content:',
      error,
    )

    state.message =
      error?.message
      || 'We could not delete this content. Please try again.'

    editAnnouncement.textContent =
      state.message

    deleteButton.disabled = false
    deleteButton.removeAttribute(
      'aria-busy',
    )
  }

  return
}

    const filterButton =
      event.target.closest(
        '[data-content-type-filter]',
      )

    if (filterButton) {
      state.typeFilter =
        filterButton.dataset.contentTypeFilter

      state.message = ''

      render()

      return
    }

    const viewButton =
      event.target.closest(
        '[data-content-id][data-content-view]',
      )

    if (viewButton) {
      state.selectedId =
        viewButton.dataset.contentId

      state.message = ''

      const view =
        viewButton.dataset.contentView

      render()

      main.querySelector(
        `[data-content-id="${state.selectedId}"][data-content-view="${view}"]`,
      )?.focus({
        preventScroll: true,
      })

      return
    }

    const resetButton =
      event.target.closest(
        '[data-content-reset]',
      )

    if (!resetButton) {
      return
    }

    const itemId =
      resetButton.dataset.contentReset

    const original =
      originalItems.get(itemId)

    const index =
      state.items.findIndex(
        (item) =>
          item.id === itemId,
      )

    if (
      !original
      || index < 0
    ) {
      return
    }

    state.items[index] = {
      ...original,
    }

    state.message =
      `Changes reset for ${original.title}; no stored content was changed.`

    render()

    main.querySelector(
      `[data-content-reset="${itemId}"]`,
    )?.focus({
      preventScroll: true,
    })
  }

  function handleChange(event) {
    const select =
      event.target.closest(
        '[data-content-status-filter]',
      )

    if (!select) {
      return
    }

    state.statusFilter =
      select.value

    state.message = ''

    render()

    statusSelect.focus({
      preventScroll: true,
    })
  }

 async function handleSubmit(event) {
  const form =
    event.target.closest(
      '[data-content-form]',
    )

  if (!form) {
    return
  }

  event.preventDefault()

  const itemId =
    form.dataset.contentId

  const index =
    state.items.findIndex(
      (item) =>
        item.id === itemId,
    )

  if (index < 0) {
    return
  }

  const user = getCurrentUser()

  if (!user) {
    state.message =
      'You must be signed in as an Admin to manage content.'

    editAnnouncement.textContent =
      state.message

    return
  }

  const fields =
    new FormData(form)

  const content = {
    title:
      String(
        fields.get('title') ?? '',
      ).trim(),

    contentType:
      String(
        fields.get('contentType') ?? '',
      ),

    category:
      String(
        fields.get('category') ?? '',
      ).trim(),

    targetAudience:
      String(
        fields.get('targetAudience') ?? '',
      ),

    location:
      String(
        fields.get('location') ?? '',
      ).trim(),

    imageUrl:
      String(
        fields.get('imageUrl') ?? '',
      ).trim(),

    summary:
      String(
        fields.get('summary') ?? '',
      ).trim(),

    status:
      String(
        fields.get('status') ?? '',
      ),
  }

  const submitButton =
    form.querySelector(
      '[data-content-apply]',
    )

  if (submitButton) {
    submitButton.disabled = true
    submitButton.setAttribute(
      'aria-busy',
      'true',
    )
  }

  state.message =
    itemId === '__new__'
      ? 'Creating content...'
      : 'Saving changes...'

  editAnnouncement.textContent =
    state.message

  try {
    if (itemId === '__new__') {
      const result =
        await createAdminContentItem(
          user,
          content,
        )

      state.selectedId =
        result.contentId
    } else {
      await updateAdminContentItem(
        user,
        itemId,
        content,
      )

      state.selectedId =
        itemId
    }

    const items =
      await getAdminContentItems(user)

    setItems(items)

    state.message =
      itemId === '__new__'
        ? 'Content created successfully.'
        : 'Content updated successfully.'

    editAnnouncement.textContent =
      state.message

    render()
  } catch (error) {
    console.error(
      'Failed to save content:',
      error,
    )

    state.message =
      error?.message
      || 'We could not save this content. Please try again.'

    editAnnouncement.textContent =
      state.message

    if (submitButton) {
      submitButton.disabled = false
      submitButton.removeAttribute(
        'aria-busy',
      )
    }
  }
}

  function setItems(items) {
    const nextItems =
      Array.isArray(items)
        ? items
        : []

    state.items =
      nextItems.map(
        (item) => ({
          ...item,
        }),
      )

    originalItems.clear()

    for (const item of nextItems) {
      originalItems.set(
        item.id,
        { ...item },
      )
    }

    if (
      !state.items.some(
        (item) =>
          item.id ===
          state.selectedId,
      )
    ) {
      state.selectedId =
        state.items[0]?.id ?? ''
    }

    state.message = ''

    render()
  }

  render()

  return {
    element: main,
    handleClick,
    handleChange,
    handleSubmit,
    setItems,
  }
}

export function createAdminContentPage() {
  let mounted = false
  let destroyed = false
  let revealCleanup = () => {}

  const pageController = new AbortController()
  const contentView = createContentView()

  const page = createAdminShell({
    activeSection: 'content',
    title: 'Content',
    titleId: 'admin-content-title',
    main: contentView.element,
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true

      const user = getCurrentUser()

      if (user) {
        void getAdminContentItems(user)
          .then((items) => {
            if (destroyed) {
              return
            }

            contentView.setItems(items)
          })
          .catch((error) => {
            if (destroyed) {
              return
            }

            console.error(
              'Failed to load content items:',
              error,
            )
          })
      }

      contentView.element.addEventListener(
        'click',
        contentView.handleClick,
        {
          signal: pageController.signal,
        },
      )

      contentView.element.addEventListener(
        'change',
        contentView.handleChange,
        {
          signal: pageController.signal,
        },
      )

      contentView.element.addEventListener(
        'submit',
        contentView.handleSubmit,
        {
          signal: pageController.signal,
        },
      )

      revealCleanup =
        mountRevealObserver(page)
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      revealCleanup()
    },
  }
}