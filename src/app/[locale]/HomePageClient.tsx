'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Cpu,
  Crosshair,
  ExternalLink,
  Film,
  Gamepad2,
  Gift,
  Home,
  MessageCircle,
  Monitor,
  Navigation,
  Package,
  Play,
  Search,
  Settings,
  Skull,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, moduleLinkMap, locale }: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pragmata.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "PRAGMATA Wiki",
        description: "PRAGMATA Wiki covers release date, demo, platforms, characters, hacking combat, Shelter upgrades, system requirements, and story guides for new players.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "PRAGMATA - Sci-Fi Action Adventure with a Hacking Twist",
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: "PRAGMATA Wiki",
        alternateName: "PRAGMATA",
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "PRAGMATA Wiki - Sci-Fi Action Adventure",
        },
        description: "PRAGMATA Wiki resource hub for story guides, demo help, characters, hacking combat, Shelter upgrades, and system requirements",
        sameAs: [
          'https://store.steampowered.com/app/3357650/PRAGMATA/',
          'https://discord.gg/Ve9sMJfv6q',
          'https://www.reddit.com/r/Pragmata/',
          'https://www.youtube.com/@PRAGMATAgame',
          'https://x.com/PRAGMATAgame',
        ],
      },
      {
        '@type': 'VideoGame',
        name: "PRAGMATA",
        gamePlatform: ['PC', 'Steam', 'PS5', 'Xbox Series X|S', 'Nintendo Switch 2'],
        applicationCategory: 'Game',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/PreOrder',
          url: 'https://store.steampowered.com/app/3357650/PRAGMATA/',
        },
      },
    ],
  }

  // FAQ accordion states
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)
  const [demoExpanded, setDemoExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 移动端横幅 Sticky */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="https://www.capcom-games.com/pragmata/en-us/demo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <Play className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://store.steampowered.com/app/3357650/PRAGMATA/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="TzBtbtOghV0"
              title="PRAGMATA | MAIN TRAILER"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionIds = [
                'pragmata-release-date', 'pragmata-gameplay', 'pragmata-demo-guide', 'pragmata-story-explained',
                'pragmata-characters', 'pragmata-combat-hacking', 'pragmata-platforms-editions', 'pragmata-preorder-bonus',
                'pragmata-deluxe-edition', 'pragmata-system-requirements', 'pragmata-weapons-loadouts', 'pragmata-enemies-bosses',
                'pragmata-shelter-upgrades', 'pragmata-exploration-traversal', 'pragmata-demo-secrets', 'pragmata-trailers-news'
              ]
              const sectionId = sectionIds[index]

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Pragmata Release Date */}
      <section id="pragmata-release-date" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataReleaseDate']} locale={locale}>
                  {t.modules.pragmataReleaseDate.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.pragmataReleaseDate.intro}
            </p>
          </div>

          {/* Timeline */}
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.pragmataReleaseDate.items.map((item: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">{item.date}</span>
                  </div>
                  <h3 className="font-bold mb-1 text-lg">
                    <LinkedTitle linkData={moduleLinkMap[`pragmataReleaseDate::items::${index}`]} locale={locale}>
                      {item.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Pragmata Gameplay */}
      <section id="pragmata-gameplay" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gamepad2 className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataGameplay']} locale={locale}>
                  {t.modules.pragmataGameplay.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataGameplay.intro}</p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4">
            {t.modules.pragmataGameplay.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`pragmataGameplay::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  {step.highlights && (
                    <ul className="space-y-1">
                      {step.highlights.map((h: string, hi: number) => (
                        <li key={hi} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Pragmata Demo Guide */}
      <section id="pragmata-demo-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Play className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataDemoGuide']} locale={locale}>
                  {t.modules.pragmataDemoGuide.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataDemoGuide.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pragmataDemoGuide.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-3 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`pragmataDemoGuide::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm mb-3">{card.description}</p>
                {card.bullets && (
                  <ul className="space-y-1">
                    {card.bullets.map((b: string, bi: number) => (
                      <li key={bi} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Pragmata Story Explained */}
      <section id="pragmata-story-explained" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataStoryExplained']} locale={locale}>
                  {t.modules.pragmataStoryExplained.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataStoryExplained.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.pragmataStoryExplained.items.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqExpanded(faqExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{item.question}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${faqExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {faqExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Pragmata Characters */}
      <section id="pragmata-characters" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataCharacters']} locale={locale}>
                  {t.modules.pragmataCharacters.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataCharacters.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pragmataCharacters.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                    <LinkedTitle linkData={moduleLinkMap[`pragmataCharacters::cards::${index}`]} locale={locale}>
                      {card.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{card.role}</span>
                </div>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Pragmata Combat and Hacking */}
      <section id="pragmata-combat-hacking" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataCombatAndHacking']} locale={locale}>
                  {t.modules.pragmataCombatAndHacking.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataCombatAndHacking.intro}</p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.pragmataCombatAndHacking.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`pragmataCombatAndHacking::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  {step.highlights && (
                    <ul className="space-y-1">
                      {step.highlights.map((h: string, hi: number) => (
                        <li key={hi} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 7: Pragmata Platforms and Editions */}
      <section id="pragmata-platforms-editions" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Monitor className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataPlatformsAndEditions']} locale={locale}>
                  {t.modules.pragmataPlatformsAndEditions.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataPlatformsAndEditions.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pragmataPlatformsAndEditions.platforms.map((platform: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Monitor className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`pragmataPlatformsAndEditions::platforms::${index}`]} locale={locale}>
                      {platform.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{platform.type}</span>
                </div>
                <p className="text-muted-foreground text-sm">{platform.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Pragmata Pre-Order Bonus */}
      <section id="pragmata-preorder-bonus" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gift className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataPreOrderBonus']} locale={locale}>
                  {t.modules.pragmataPreOrderBonus.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataPreOrderBonus.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pragmataPreOrderBonus.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`pragmataPreOrderBonus::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 9: Pragmata Deluxe Edition */}
      <section id="pragmata-deluxe-edition" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataDeluxeEdition']} locale={locale}>
                  {t.modules.pragmataDeluxeEdition.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataDeluxeEdition.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pragmataDeluxeEdition.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`pragmataDeluxeEdition::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Pragmata System Requirements */}
      <section id="pragmata-system-requirements" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Cpu className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataSystemRequirements']} locale={locale}>
                  {t.modules.pragmataSystemRequirements.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataSystemRequirements.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pragmataSystemRequirements.specs.map((spec: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`pragmataSystemRequirements::specs::${index}`]} locale={locale}>
                      {spec.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{spec.type}</span>
                </div>
                <p className="text-muted-foreground text-sm">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Pragmata Weapons and Loadouts */}
      <section id="pragmata-weapons-loadouts" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crosshair className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataWeaponsAndLoadouts']} locale={locale}>
                  {t.modules.pragmataWeaponsAndLoadouts.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataWeaponsAndLoadouts.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pragmataWeaponsAndLoadouts.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Crosshair className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.type}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`pragmataWeaponsAndLoadouts::items::${index}`]} locale={locale}>
                    {item.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Pragmata Enemies and Bosses */}
      <section id="pragmata-enemies-bosses" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Skull className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataEnemiesAndBosses']} locale={locale}>
                  {t.modules.pragmataEnemiesAndBosses.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataEnemiesAndBosses.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pragmataEnemiesAndBosses.enemies.map((enemy: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${["Major Threat"].includes(enemy.role) ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]"}`}>{enemy.role}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`pragmataEnemiesAndBosses::enemies::${index}`]} locale={locale}>
                    {enemy.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{enemy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: Pragmata Shelter and Upgrades */}
      <section id="pragmata-shelter-upgrades" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Home className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataShelterAndUpgrades']} locale={locale}>
                  {t.modules.pragmataShelterAndUpgrades.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataShelterAndUpgrades.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.pragmataShelterAndUpgrades.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`pragmataShelterAndUpgrades::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: Pragmata Exploration and Traversal */}
      <section id="pragmata-exploration-traversal" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Navigation className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataExplorationAndTraversal']} locale={locale}>
                  {t.modules.pragmataExplorationAndTraversal.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataExplorationAndTraversal.intro}</p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.pragmataExplorationAndTraversal.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`pragmataExplorationAndTraversal::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  {step.highlights && (
                    <ul className="space-y-1">
                      {step.highlights.map((h: string, hi: number) => (
                        <li key={hi} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: Pragmata Demo Secrets and Endings */}
      <section id="pragmata-demo-secrets" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Search className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataDemoSecretsAndEndings']} locale={locale}>
                  {t.modules.pragmataDemoSecretsAndEndings.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataDemoSecretsAndEndings.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.pragmataDemoSecretsAndEndings.faqs.map((faq: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setDemoExpanded(demoExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${demoExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {demoExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 16: Pragmata Trailers and News */}
      <section id="pragmata-trailers-news" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['pragmataTrailersAndNews']} locale={locale}>
                  {t.modules.pragmataTrailersAndNews.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.pragmataTrailersAndNews.intro}</p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.pragmataTrailersAndNews.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{entry.type}</span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold mb-1">
                    <LinkedTitle linkData={moduleLinkMap[`pragmataTrailersAndNews::entries::${index}`]} locale={locale}>
                      {entry.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground text-sm">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/Ve9sMJfv6q"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/PRAGMATAgame"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/3357650"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/3357650/PRAGMATA/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
