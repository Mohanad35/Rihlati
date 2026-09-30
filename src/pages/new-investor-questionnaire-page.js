import { homeAssets } from '../assets/home-assets.js'

import {
  createArrow,
  createBadge,
  createCard,
  createEyebrow,
  createIcon,
} from '../components/ui.js'

import { routePaths } from '../data/home-presentation-data.js'

import {
  getInvestorAnswers,
  saveInvestorAnswers,
} from '../services/guest-session-service.js'

import { matchingConfigDefaults } from '../data/matching-config-defaults.js'

import {
  getPublishedMatchingConfig,
} from '../services/matching-config-service.js'

import { createElement } from '../utils/dom.js'


const MATCHING_PATH = '/ni-matching'


function normalizeInvestorQuestions(config) {
  const questions =
    Array.isArray(config?.questions)
      ? config.questions
      : []

  return questions
    .filter(
      (question) =>
        question?.enabled !== false,
    )
    .slice()
    .sort(
      (a, b) =>
        (a.order ?? 0) -
        (b.order ?? 0),
    )
    .map((question) => ({
      ...question,

      options: (
        Array.isArray(question.options)
          ? question.options
          : []
      )
        .filter(
          (option) =>
            option?.enabled !== false,
        )
        .slice()
        .sort(
          (a, b) =>
            (a.order ?? 0) -
            (b.order ?? 0),
        )
        .map((option) => ({
          ...option,

          value:
            option.value
            ?? option.label,
        })),
    }))
    .filter(
      (question) =>
        question.options.length > 0,
    )
}


function getStepLabel(question) {
  const key =
    typeof question?.key === 'string'
      ? question.key
      : 'step'

  return key
    .replace(/[-_]+/g, ' ')
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    )
}


function restoreInvestorAnswers(questions) {
  const storedAnswers =
    getInvestorAnswers()

  if (
    !storedAnswers
    || typeof storedAnswers !== 'object'
    || Array.isArray(storedAnswers)
  ) {
    return {}
  }

  return questions.reduce(
    (restored, question) => {
      const allowedOptions =
        new Set(
          question.options.map(
            (option) =>
              option.value
              ?? option.label,
          ),
        )

      const storedAnswer =
        storedAnswers[question.key]

      if (question.multi) {
        const validAnswers =
          Array.isArray(storedAnswer)
            ? [
                ...new Set(
                  storedAnswer.filter(
                    (answer) =>
                      allowedOptions.has(
                        answer,
                      ),
                  ),
                ),
              ]
            : []

        if (
          validAnswers.length > 0
        ) {
          restored[question.key] =
            validAnswers
        }
      } else if (
        allowedOptions.has(
          storedAnswer,
        )
      ) {
        restored[question.key] =
          storedAnswer
      }

      return restored
    },
    {},
  )
}


function createQuestionnaireLogo() {
  return createElement('a', {
    className:
      'tourist-questionnaire__logo',

    attributes: {
      href: routePaths.home,
      'data-router-link': true,
      'aria-label': 'Rihlati home',
    },

    children: [
      createElement('img', {
        attributes: {
          src: homeAssets.logo,
          alt:
            'Rihlati — رحلتي — Your Journey in Jordan',
          draggable: 'false',
          fetchpriority: 'high',
          decoding: 'async',
        },
      }),
    ],
  })
}


function createStepper(
  currentStep,
  questions,
) {
  return createElement('ol', {
    className:
      'questionnaire-stepper',

    attributes: {
      'aria-label':
        'Investment questionnaire progress',
    },

    children: questions.map(
      (question, index) => {
        const label =
          getStepLabel(question)

        const done =
          index < currentStep

        const active =
          index === currentStep

        return createElement('li', {
          className: [
            'questionnaire-stepper__item',
            done ? 'is-done' : '',
            active ? 'is-active' : '',
          ]
            .filter(Boolean)
            .join(' '),

          attributes: {
            ...(active
              ? {
                  'aria-current':
                    'step',
                }
              : {}),

            'aria-label':
              `${label}${done
                ? ', completed'
                : active
                  ? ', current step'
                  : ''}`,
          },

          children: [
            createElement('span', {
              className:
                'questionnaire-stepper__identity',

              attributes: {
                'aria-hidden': 'true',
              },

              children: [
                createElement(
                  'span',
                  {
                    className:
                      'questionnaire-stepper__circle',

                    children: done
                      ? [
                          createIcon(
                            'check',
                            {
                              className:
                                'questionnaire-stepper__check',
                            },
                          ),
                        ]
                      : [
                          document.createTextNode(
                            String(
                              index
                              + 1,
                            ),
                          ),
                        ],
                  },
                ),

                createElement(
                  'span',
                  {
                    className:
                      'questionnaire-stepper__label',

                    text: label,
                  },
                ),
              ],
            }),

            ...(index
              < questions.length - 1
              ? [
                  createElement(
                    'span',
                    {
                      className:
                        'questionnaire-stepper__connector',

                      attributes: {
                        'aria-hidden':
                          'true',
                      },

                      children: [
                        createElement(
                          'span',
                        ),
                      ],
                    },
                  ),
                ]
              : []),
          ],
        })
      },
    ),
  })
}


function createOptionCard(
  option,
  selected,
) {
  const optionValue =
    option.value
    ?? option.label

  return createElement('button', {
    className: [
      'questionnaire-option',
      selected
        ? 'is-selected'
        : '',
    ]
      .filter(Boolean)
      .join(' '),

    attributes: {
      type: 'button',

      'data-investor-questionnaire-action':
        'select',

      'data-option':
        optionValue,

      'aria-pressed':
        selected
          ? 'true'
          : 'false',
    },

    children: [
      createElement('span', {
        className:
          'questionnaire-option__icon',

        attributes: {
          'aria-hidden': 'true',
        },

        children: [
          createIcon(
            option.icon
            ?? 'circle',
          ),
        ],
      }),

      createElement('span', {
        className:
          'questionnaire-option__body',

        children: [
          createElement('span', {
            className:
              'questionnaire-option__heading',

            children: [
              createElement(
                'span',
                {
                  className:
                    'questionnaire-option__label',

                  text:
                    option.label
                    ?? optionValue,
                },
              ),

              createElement(
                'span',
                {
                  className:
                    'questionnaire-option__indicator',

                  attributes: {
                    'aria-hidden':
                      'true',
                  },

                  children: selected
                    ? [
                        createIcon(
                          'check',
                          {
                            className:
                              'questionnaire-option__check',
                          },
                        ),
                      ]
                    : [],
                },
              ),
            ],
          }),

          ...(option.description
            ? [
                createElement(
                  'span',
                  {
                    className:
                      'questionnaire-option__description',

                    text:
                      option.description,
                  },
                ),
              ]
            : []),
        ],
      }),
    ],
  })
}


function createChip(
  option,
  selected,
) {
  const optionValue =
    option.value
    ?? option.label

  return createElement('button', {
    className: [
      'questionnaire-chip',
      selected
        ? 'is-selected'
        : '',
    ]
      .filter(Boolean)
      .join(' '),

    text:
      option.label
      ?? optionValue,

    attributes: {
      type: 'button',

      'data-investor-questionnaire-action':
        'select',

      'data-option':
        optionValue,

      'aria-pressed':
        selected
          ? 'true'
          : 'false',
    },
  })
}


function createControlButton({
  label,
  action,
  variant = 'primary',
  arrow = false,
}) {
  return createElement('button', {
    className:
      `button button--${variant}`,

    attributes: {
      type: 'button',

      'data-investor-questionnaire-action':
        action,
    },

    children: [
      createElement('span', {
        className:
          'button__label',

        text: label,
      }),

      ...(arrow
        ? [createArrow()]
        : []),
    ],
  })
}


export function createNewInvestorQuestionnairePage({
  router,
} = {}) {
  if (
    !router
    || typeof router.navigate
      !== 'function'
  ) {
    throw new TypeError(
      'New Investor Questionnaire requires the application router.',
    )
  }


  let currentStep = 0
  let direction = 'right'
  let questions = []
  let answers = {}

  let mounted = false
  let destroyed = false


  const pageController =
    new AbortController()


  const stepBadge =
    createBadge(
      'New investor · Loading...',
      'gold',
      'tourist-questionnaire__badge',
    )

  stepBadge.setAttribute(
    'aria-live',
    'polite',
  )


  const stepperHost =
    createElement('div', {
      className:
        'tourist-questionnaire__stepper-host',
    })


  const questionHost =
    createElement('div', {
      className:
        'tourist-questionnaire__question-host',

      children: [
        createElement('p', {
          className:
            'tourist-questionnaire__hint',

          text:
            'Loading investment questionnaire...',
        }),
      ],
    })


  const progressFill =
    createElement('span', {
      className:
        'questionnaire-progress__fill',
    })


  const progressTrack =
    createElement('div', {
      className:
        'questionnaire-progress',

      attributes: {
        role: 'progressbar',

        'aria-label':
          'Investment questionnaire completion',

        'aria-valuemin': '0',
        'aria-valuemax': '100',
        'aria-valuenow': '0',

        'aria-valuetext':
          'Loading investment questionnaire',
      },

      children: [
        progressFill,
      ],
    })


  const backButton =
    createControlButton({
      label: 'Back',
      action: 'back',
      variant: 'outline',
    })


  const continueButton =
    createControlButton({
      label: 'Continue',
      action: 'continue',
      arrow: true,
    })

  continueButton.disabled = true


  const questionCard =
    createCard({
      tagName: 'section',

      className:
        'tourist-questionnaire__card',

      attributes: {
        'aria-labelledby':
          'investor-questionnaire-question-title',
      },

      children: [
        questionHost,
      ],
    })


  const page =
    createElement('div', {
      className:
        'new-investor-questionnaire-page tourist-questionnaire-page paper',

      children: [
        createElement('main', {
          className:
            'new-investor-questionnaire tourist-questionnaire',

          attributes: {
            id: 'main-content',
            tabindex: '-1',
          },

          children: [
            createElement(
              'header',
              {
                className:
                  'tourist-questionnaire__header',

                children: [
                  createElement(
                    'div',
                    {
                      className:
                        'tourist-questionnaire__header-row',

                      children: [
                        createQuestionnaireLogo(),
                        stepBadge,
                      ],
                    },
                  ),

                  stepperHost,
                ],
              },
            ),

            questionCard,

            createElement('div', {
              className:
                'tourist-questionnaire__controls',

              children: [
                backButton,

                createElement(
                  'div',
                  {
                    className:
                      'tourist-questionnaire__progress-wrap',

                    children: [
                      progressTrack,
                    ],
                  },
                ),

                continueButton,
              ],
            }),
          ],
        }),
      ],
    })


  const getCurrentQuestion =
    () =>
      questions[currentStep]


  const getOptionValue =
    (option) =>
      option.value
      ?? option.label


  const isSelected =
    (value) => {
      const question =
        getCurrentQuestion()

      if (!question) {
        return false
      }

      const answer =
        answers[question.key]

      return question.multi
        ? (
            Array.isArray(answer)
              ? answer
              : []
          ).includes(value)
        : answer === value
    }


  const canContinue =
    () => {
      const question =
        getCurrentQuestion()

      if (!question) {
        return false
      }

      const answer =
        answers[question.key]

      return question.multi
        ? (
            Array.isArray(answer)
            && answer.length > 0
          )
        : (
            typeof answer
              === 'string'
            && answer.length > 0
          )
    }


  const syncAnswerControls =
    () => {
      questionHost
        .querySelectorAll(
          '[data-option]',
        )
        .forEach(
          (control) => {
            if (
              !(
                control
                instanceof
                HTMLButtonElement
              )
            ) {
              return
            }

            const selected =
              isSelected(
                control.dataset.option,
              )

            control.classList.toggle(
              'is-selected',
              selected,
            )

            control.setAttribute(
              'aria-pressed',
              selected
                ? 'true'
                : 'false',
            )

            const indicator =
              control.querySelector(
                '.questionnaire-option__indicator',
              )

            if (indicator) {
              indicator.replaceChildren(
                ...(selected
                  ? [
                      createIcon(
                        'check',
                        {
                          className:
                            'questionnaire-option__check',
                        },
                      ),
                    ]
                  : []),
              )
            }
          },
        )

      continueButton.disabled =
        !canContinue()
    }


  const renderStep = ({
    focusHeading = false,
  } = {}) => {
    const question =
      getCurrentQuestion()

    if (!question) {
      return
    }

    const progress =
      Math.round(
        (
          (currentStep + 1)
          / questions.length
        )
        * 100,
      )

    const options =
      question.options.map(
        (option) => {
          const value =
            getOptionValue(option)

          return question.type
            === 'option'
            ? createOptionCard(
                option,
                isSelected(value),
              )
            : createChip(
                option,
                isSelected(value),
              )
        },
      )


    const panel =
      createElement('div', {
        className:
          `tourist-questionnaire__question animate-slide-${direction}`,

        children: [
          createEyebrow(
            getStepLabel(question),
          ),

          createElement('h1', {
            className:
              'tourist-questionnaire__title',

            text:
              question.title
              ?? 'Investment preference',

            attributes: {
              id:
                'investor-questionnaire-question-title',

              tabindex: '-1',
            },
          }),

          createElement('p', {
            className:
              'tourist-questionnaire__hint',

            text:
              question.hint
              ?? '',

            attributes: {
              id:
                'investor-questionnaire-question-hint',
            },
          }),

          createElement('div', {
            className:
              question.type
                === 'option'
                ? 'tourist-questionnaire__options'
                : 'tourist-questionnaire__chips',

            attributes: {
              role: 'group',

              'aria-labelledby':
                'investor-questionnaire-question-title',

              'aria-describedby':
                'investor-questionnaire-question-hint',
            },

            children:
              options,
          }),
        ],
      })


    stepBadge.textContent =
      `New investor · Step ${currentStep + 1}/${questions.length}`


    stepperHost.replaceChildren(
      createStepper(
        currentStep,
        questions,
      ),
    )


    questionHost.replaceChildren(
      panel,
    )


    progressTrack.setAttribute(
      'aria-valuenow',
      String(progress),
    )


    progressTrack.setAttribute(
      'aria-valuetext',
      `Step ${currentStep + 1} of ${questions.length}`,
    )


    progressFill.style.width =
      `${progress}%`


    const buttonLabel =
      continueButton.querySelector(
        '.button__label',
      )

    if (buttonLabel) {
      buttonLabel.textContent =
        currentStep
          === questions.length - 1
          ? 'Find matches'
          : 'Continue'
    }


    syncAnswerControls()


    if (focusHeading) {
      panel
        .querySelector('h1')
        ?.focus({
          preventScroll: true,
        })
    }
  }


  const selectOption =
    (value) => {
      const question =
        getCurrentQuestion()

      if (
        !question
        || typeof value
          !== 'string'
      ) {
        return
      }

      if (question.multi) {
        const current =
          Array.isArray(
            answers[
              question.key
            ],
          )
            ? answers[
                question.key
              ]
            : []

        answers = {
          ...answers,

          [question.key]:
            current.includes(value)
              ? current.filter(
                  (item) =>
                    item
                    !== value,
                )
              : [
                  ...current,
                  value,
                ],
        }
      } else {
        answers = {
          ...answers,

          [question.key]:
            value,
        }
      }

      saveInvestorAnswers(
        answers,
      )

      syncAnswerControls()
    }


  const navigate =
    (path) => {
      void router
        .navigate(path)
        .catch((error) => {
          console.error(
            '[RIHLATI] New Investor Questionnaire navigation failed.',
            error,
          )
        })
    }


  const loadQuestionnaire =
    async () => {
      let config

      try {
        config =
          await getPublishedMatchingConfig(
            'investor',
          )
      } catch (error) {
        console.error(
          '[RIHLATI] Failed to load published investor matching configuration.',
          error,
        )

        config =
          matchingConfigDefaults
            .investor
      }


      if (destroyed) {
        return
      }


      questions =
        normalizeInvestorQuestions(
          config,
        )


      if (
        questions.length === 0
      ) {
        stepBadge.textContent =
          'New investor'

        stepperHost
          .replaceChildren()

        progressTrack
          .setAttribute(
            'aria-valuenow',
            '0',
          )

        progressTrack
          .setAttribute(
            'aria-valuetext',
            'Questionnaire unavailable',
          )

        progressFill.style.width =
          '0%'


        questionHost
          .replaceChildren(
            createElement(
              'div',
              {
                className:
                  'tourist-questionnaire__question',

                children: [
                  createElement(
                    'h1',
                    {
                      className:
                        'tourist-questionnaire__title',

                      text:
                        'Questionnaire unavailable',
                    },
                  ),

                  createElement(
                    'p',
                    {
                      className:
                        'tourist-questionnaire__hint',

                      text:
                        'No active investment questions are currently published.',
                    },
                  ),
                ],
              },
            ),
          )

        continueButton.disabled =
          true

        return
      }


      currentStep = 0
      direction = 'right'

      answers =
        restoreInvestorAnswers(
          questions,
        )


      renderStep()
    }


  const handleClick =
    (event) => {
      const target =
        event.target
          instanceof Element
          ? event.target.closest(
              '[data-investor-questionnaire-action]',
            )
          : null


      if (
        !(
          target
          instanceof
          HTMLButtonElement
        )
      ) {
        return
      }


      const action =
        target.dataset
          .investorQuestionnaireAction


      if (
        action === 'select'
      ) {
        selectOption(
          target.dataset.option,
        )

        return
      }


      if (
        action === 'back'
      ) {
        if (
          currentStep === 0
        ) {
          navigate(
            routePaths
              .investorEntry,
          )

          return
        }

        direction = 'left'

        currentStep -= 1

        renderStep({
          focusHeading: true,
        })

        return
      }


      if (
        action === 'continue'
        && canContinue()
      ) {
        if (
          currentStep
          === questions.length - 1
        ) {
          navigate(
            MATCHING_PATH,
          )

          return
        }

        direction = 'right'

        currentStep += 1

        renderStep({
          focusHeading: true,
        })
      }
    }


  return {
    element: page,


    mount() {
      if (
        mounted
        || destroyed
      ) {
        return
      }

      mounted = true

      page.addEventListener(
        'click',
        handleClick,
        {
          signal:
            pageController.signal,
        },
      )

      void loadQuestionnaire()
    },


    destroy() {
      if (
        !mounted
        || destroyed
      ) {
        return
      }

      destroyed = true

      pageController.abort()

      answers = {}
      questions = []
    },
  }
}