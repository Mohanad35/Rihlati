import { homeAssets } from '../assets/home-assets.js'
import {
  createSiteFooter,
  createSiteHeader,
  mountSiteHeader,
} from '../components/site-shell.js'
import { createBadge, createEyebrow } from '../components/ui.js'
import { createElement } from '../utils/dom.js'
import { getPublicContentItems } from '../services/content-service.js'

function createInvestmentInsightCard({
  number,
  label,
  title,
  description,
  audience,
}) {
  return createElement('article', {
    className: 'insights-investment-card',

    children: [
      createElement('div', {
        className: 'insights-investment-card__top',

        children: [
          createElement('span', {
            className: 'insights-investment-card__number',
            text: number,
          }),

          createElement('span', {
            className: 'insights-investment-card__label',
            text: label,
          }),
        ],
      }),

      createElement('h3', {
        text: title,
      }),

      createElement('p', {
        className: 'insights-investment-card__description',
        text: description,
      }),

      createElement('div', {
        className: 'insights-investment-card__signal',

        children: [
          createElement('span', {
            text: 'Audience',
          }),

          createElement('strong', {
            text: audience,
          }),
        ],
      }),
    ],
  })
}

function createInvestmentInsightsSection(items = []) {
  const insights = items
    .filter(
      (item) =>
        item.contentType === 'Investment Insight',
    )
    .map((item, index) => ({
      number:
        String(index + 1).padStart(2, '0'),

      label:
        item.category
        || 'Tourism insight',

      title:
        item.title,

      description:
        item.summary,

      audience:
        item.targetAudience
        || 'Investors',
    }))

  return createElement('section', {
    className: 'insights-investment',

    attributes: {
      id: 'investment-insights',
      'aria-labelledby':
        'investment-insights-title',
    },

    children: [
      createElement('div', {
        className: 'container',

        children: [
          createElement('header', {
            className:
              'insights-section-heading',

            children: [
              createElement('div', {
                children: [
                  createEyebrow(
                    'Investment Insights',
                  ),

                  createElement('h2', {
                    attributes: {
                      id:
                        'investment-insights-title',
                    },

                    text:
                      'Understand the opportunity behind the journey.',
                  }),

                  createElement('p', {
                    text:
                      'Context for tourism investors and businesses exploring where traveller needs and destination opportunities may align.',
                  }),
                ],
              }),
            ],
          }),

          createElement('div', {
            className:
              'insights-investment__grid',

            children:
              insights.map(
                createInvestmentInsightCard,
              ),
          }),
        ],
      }),
    ],
  })
}

function createGuideCard({
  image,
  location,
  title,
  description,
}) {
  return createElement('article', {
    className: 'insights-guide-card',

    children: [
      createElement('div', {
        className: 'insights-guide-card__visual',

        children: [
          createElement('img', {
            className: 'insights-guide-card__image',

            attributes: {
              src: image,
              alt: '',
              'aria-hidden': 'true',
              decoding: 'async',
            },
          }),
        ],
      }),

      createElement('div', {
        className: 'insights-guide-card__body',

        children: [
          createElement('p', {
            className: 'insights-guide-card__meta',
            text: location,
          }),

          createElement('h3', {
            text: title,
          }),

          createElement('p', {
            className: 'insights-guide-card__description',
            text: description,
          }),
        ],
      }),
    ],
  })
}

function createTravelGuidesSection(items = []) {
  const guides = items
    .filter(
  (item) =>
    item.contentType === 'Travel Guide'
    || item.contentType === 'Story & Experience',
)
    .map((item) => ({
      image:
        item.imageUrl
        || homeAssets.petra,

      location:
        item.location
        || item.category
        || 'Jordan',

      title:
        item.title,

      description:
        item.summary,
    }))

  const guideCount =
    String(guides.length).padStart(2, '0')

  return createElement('section', {
    className: 'insights-guides',

    attributes: {
      id: 'travel-guides',
      'aria-labelledby': 'travel-guides-title',
    },

    children: [
      createElement('div', {
        className: 'container',

        children: [
          createElement('header', {
            className: 'insights-section-heading',

            children: [
              createElement('div', {
                children: [
                  createEyebrow('Travel Guides'),

                  createElement('h2', {
                    attributes: {
                      id: 'travel-guides-title',
                    },

                    text:
                      'Travel with more context.',
                  }),

                  createElement('p', {
                    text:
                      'Thoughtful guides for discovering Jordan beyond the obvious stops.',
                  }),
                ],
              }),

              createElement('span', {
                className:
                  'insights-section-heading__count',

                text:
                  `${guideCount} ${
                    guides.length === 1
                      ? 'guide'
                      : 'guides'
                  }`,
              }),
            ],
          }),

          createElement('div', {
            className: 'insights-guides__grid',

            children:
              guides.map(
                createGuideCard,
              ),
          }),
        ],
      }),
    ],
  })
}

function createNewsItem({
  image,
  category,
  title,
  summary,
  date,
}) {
  return createElement('article', {
    className: 'insights-news-card',

    children: [
      createElement('img', {
        className: 'insights-news-card__image',

        attributes: {
          src: image,
          alt: '',
          'aria-hidden': 'true',
          decoding: 'async',
        },
      }),

      createElement('div', {
        className: 'insights-news-card__body',

        children: [
          createElement('div', {
            className: 'insights-news-card__meta',

            children: [
              createElement('span', {
                text: category,
              }),

              createElement('time', {
                text: date,
              }),
            ],
          }),

          createElement('h3', {
            text: title,
          }),

          createElement('p', {
            text: summary,
          }),
        ],
      }),
    ],
  })
}

function createTourismNewsSection(items = []) {
  const newsItems = items
    .filter(
      (item) =>
        item.contentType === 'Tourism News',
    )
    .map((item) => ({
      image:
        item.imageUrl
        || homeAssets.deadSeaPhoto,

      category:
        item.category
        || 'Tourism update',

      date:
        item.location
        || 'Jordan',

      title:
        item.title,

      summary:
        item.summary,
    }))

  return createElement('section', {
    className: 'insights-news',

    attributes: {
      id: 'tourism-news',
      'aria-labelledby': 'tourism-news-title',
    },

    children: [
      createElement('div', {
        className: 'container',

        children: [
          createElement('header', {
            className: 'insights-section-heading',

            children: [
              createElement('div', {
                children: [
                  createEyebrow('Tourism News'),

                  createElement('h2', {
                    attributes: {
                      id: 'tourism-news-title',
                    },

                    text:
                      'What’s shaping tourism in Jordan.',
                  }),

                  createElement('p', {
                    text:
                      'Updates and perspectives on destinations, traveller behaviour, and the tourism landscape.',
                  }),
                ],
              }),
            ],
          }),

          createElement('div', {
            className: 'insights-news__grid',

            children:
              newsItems.map(
                createNewsItem,
              ),
          }),
        ],
      }),
    ],
  })
}

function createInsightsHero() {
  return createElement('section', {
    className: 'insights-hero',
    attributes: {
      'aria-labelledby': 'insights-title',
    },

    children: [
      createElement('span', {
        className:
          'insights-hero__glow insights-hero__glow--gold',
        attributes: {
          'aria-hidden': 'true',
        },
      }),

      createElement('span', {
        className:
          'insights-hero__glow insights-hero__glow--terracotta',
        attributes: {
          'aria-hidden': 'true',
        },
      }),

      createElement('div', {
        className: 'container insights-hero__grid',

        children: [
          createElement('div', {
            className: 'insights-hero__copy animate-rise',

            children: [
              createEyebrow('Explore & Insights'),

              createElement('h1', {
                attributes: {
                  id: 'insights-title',
                },

                children: [
                  document.createTextNode(
                    'Explore Jordan '
                  ),

                  createElement('span', {
                    className:
                      'insights-hero__emphasis',
                    text: 'deeper.',
                  }),
                ],
              }),

              createElement('p', {
                className: 'insights-hero__lead',
                text:
                  'Stories, guides, and tourism insights that help travellers discover more and investors understand Jordan better.',
              }),

              createElement('nav', {
                className: 'insights-categories',

                attributes: {
                  'aria-label':
                    'Explore insight categories',
                },

                children: [
                  createElement('a', {
                    className: 'insights-category',
                    attributes: {
                      href: '#travel-guides',
                    },
                    text: 'Travel Guides',
                  }),

                  createElement('a', {
                    className: 'insights-category',
                    attributes: {
                      href: '#tourism-news',
                    },
                    text: 'Tourism News',
                  }),

                  createElement('a', {
                    className: 'insights-category',
                    attributes: {
                      href: '#investment-insights',
                    },
                    text: 'Investment Insights',
                  }),
                ],
              }),
            ],
          }),

          createElement('article', {
            className:
              'insights-featured animate-rise',

            children: [
              createElement('div', {
                className:
                  'insights-featured__visual',

                children: [
                  createElement('img', {
                    className:
                      'insights-featured__image',

                    attributes: {
                      src: homeAssets.petra,
                      alt: 'Petra in Jordan',
                      decoding: 'async',
                    },
                  }),

                  createBadge(
                    'Featured guide',
                    'gold',
                    'insights-featured__badge'
                  ),
                ],
              }),

              createElement('div', {
                className:
                  'insights-featured__body',

                children: [
                  createElement('p', {
                    className:
                      'insights-featured__meta',
                    text:
                      'Travel Guide · Jordan',
                  }),

                  createElement('h2', {
                    text:
                      'Beyond the postcard: experiencing Petra with more context',
                  }),

                  createElement('p', {
                    text:
                      'A thoughtful introduction to one of Jordan’s most iconic destinations — what to notice, how to approach the experience, and where the journey can lead next.',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export function createInsightsPage({
  path = '/insights',
} = {}) {
  
  let mounted = false
  let destroyed = false
  let headerCleanup = () => {}

  const pageController = new AbortController()

  const header = createSiteHeader({
    currentPath: path,
  })

  let travelGuidesSection =
  createTravelGuidesSection()

let tourismNewsSection =
  createTourismNewsSection()

let investmentInsightsSection =
  createInvestmentInsightsSection()

  const main = createElement('main', {
  className: 'insights-main',

  attributes: {
    id: 'main-content',
    tabindex: '-1',
  },

  children: [
    createInsightsHero(),
    travelGuidesSection,
    tourismNewsSection,
    investmentInsightsSection,
  ],
})

  const page = createElement('div', {
    className: 'insights-page paper',

    children: [
      header,
      main,
      createSiteFooter({
        currentPath: path,
      }),
    ],
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true

      void getPublicContentItems()
  .then((items) => {
    if (destroyed) {
      return
    }

    const nextTravelGuidesSection =
      createTravelGuidesSection(items)

    const nextTourismNewsSection =
      createTourismNewsSection(items)

    const nextInvestmentInsightsSection =
      createInvestmentInsightsSection(items)

    travelGuidesSection.replaceWith(
      nextTravelGuidesSection,
    )

    tourismNewsSection.replaceWith(
      nextTourismNewsSection,
    )

    investmentInsightsSection.replaceWith(
      nextInvestmentInsightsSection,
    )

    travelGuidesSection =
      nextTravelGuidesSection

    tourismNewsSection =
      nextTourismNewsSection

    investmentInsightsSection =
      nextInvestmentInsightsSection
  })
  .catch((error) => {
    if (destroyed) {
      return
    }

    console.error(
      'Failed to load public insights content:',
      error,
    )
  })

      headerCleanup = mountSiteHeader(
        header,
        {
          signal: pageController.signal,
        }
      )
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      headerCleanup()
    },
  }
}