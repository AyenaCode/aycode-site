# AyCode — Landing Page Design Spec

**Date:** 2026-03-17
**Author:** AyCode (freelance React Native / Next.js / DevOps)
**Goal:** Landing page percutante pour convertir des prospects en clients

---

## Contexte

Développeur freelance spécialisé React Native, Next.js et DevOps (CI/CD, Kubernetes). La landing page doit couvrir les deux pôles de services, générer des leads qualifiés via un formulaire multi-étapes, et déployer rapidement.

---

## Stack technique

- **Framework:** Astro 6 (SSG)
- **Styles:** Tailwind CSS v4 + `@tailwindcss/vite` (plugin Vite, pas `@astrojs/tailwind`) + CSS custom (tokens, gradients)
- **Animations:** GSAP + ScrollTrigger (scroll-driven, timelines) + Three.js (scène 3D hero, vanilla `<script>` côté client) + Lenis (smooth scroll) + CountUp.js
- **Intégration Lenis/GSAP:** Lenis doit être instancié **avant** l'appel à `ScrollTrigger.scrollerProxy()` pour éviter le désync des animations scroll-driven
- **Three.js:** chargé uniquement via `<script>` Astro (s'exécute client-side uniquement, pas de SSR issue)
- **Formulaire:** Formspree (endpoint configuré dans `.env`, honeypot anti-spam activé, états success/error gérés dans le composant)
- **SEO:** meta Open Graph, sitemap.xml, robots.txt, schema.org (Person + Service), images WebP/AVIF, Lighthouse > 90

---

## Identité visuelle

- **Palette:** dark background + gradient futuriste violet → cyan → rose
- **Typographie:** Space Grotesk (titres) + Inter (corps) — Google Fonts
- **Ambiance:** ultra-animée, effets 3D immersifs, tendance 2026
- **Pseudo/marque:** AyCode
- **Fallback Three.js:** si WebGL indisponible, fond statique avec gradient CSS (aucun crash)

---

## Architecture fichiers



```
src/
├── pages/index.astro
├── components/
│   ├── Hero.astro
│   ├── PainPoints.astro
│   ├── DevSection.astro
│   ├── DevOpsSection.astro
│   ├── SocialProof.astro
│   └── ContactForm.astro
├── layouts/Layout.astro      (SEO head, meta, schema.org)
└── styles/global.css         (tokens, gradients, animations CSS)
public/
├── sitemap.xml
├── robots.txt
└── og-image.png          (1200×630, fond gradient + logo AyCode)
```

---

## Structure de la page

### 1. Hero
- Scène 3D animée en fond (Three.js `client:only` — particules / mesh abstrait gradient)
- **Fallback WebGL:** si WebGL indisponible, fond statique avec gradient CSS `violet → cyan → rose`
- **Titre:** *"Votre idée mérite une exécution sans compromis."*
- **Sous-titre:** *"Développeur React Native & Next.js · DevOps Kubernetes — Je transforme vos projets en produits qui scalent."*
- **CTA:** `Démarrons ensemble →` (ancre vers le formulaire)
- Animation d'entrée GSAP (texte reveal + fade)

### 2. Pain Points
- 3 cartes animées au scroll (GSAP ScrollTrigger)
- Messages : app mobile qui plante, déploiement lent, prestataire fantôme
- Transition visuelle vers la solution

### 3. Services Dev (React Native & Next.js)
- **Titre:** *"Apps mobiles & web qui performent."*
- 3 arguments : rapidité de livraison, qualité du code, UX soignée
- Icônes animées, highlight gradient

### 4. Services DevOps (CI/CD & Kubernetes)
- **Titre:** *"Vos déploiements, automatisés et blindés."*
- 3 arguments : pipelines CI/CD robustes, infra K8s haute dispo, monitoring & alerting
- Même traitement visuel que section Dev

### 5. Social Proof
- Chiffres animés (CountUp) : 5 ans d'expérience, 20+ projets livrés, 0 projet abandonné
- Emplacement pour témoignages clients (placeholder)

### 6. Formulaire de contact qualifiant (multi-étapes)
- **Step 1:** Type de projet (mobile / web / DevOps / full-stack) + Budget estimé
- **Step 2:** Délai souhaité + Description du besoin
- **Step 3:** Nom / Email / Téléphone
- Barre de progression animée
- **CTA final:** *"Décrivez votre projet — je vous réponds sous 24h."*
- Soumission via Formspree (endpoint via variable d'env `PUBLIC_FORMSPREE_ID`)
- Honeypot anti-spam (`_gotcha` field caché)
- États gérés : loading, success (message de confirmation), error (message d'erreur)
- Mention RGPD sous le bouton submit : "En soumettant ce formulaire, vous acceptez d'être contacté par AyCode concernant votre projet."

---

## SEO

- `<title>`: AyCode — Développeur React Native, Next.js & DevOps Freelance
- **Meta description:** "AyCode — Développeur freelance React Native, Next.js & DevOps (Kubernetes, CI/CD). Je transforme vos idées en produits mobiles et web qui scalent. Devis gratuit."
- **Open Graph:** title + description + image (`/og-image.png`, 1200×630px, WebP, fond dégradé avec logo AyCode)
- `<html lang="fr">` dans Layout.astro
- `<link rel="canonical" href={PUBLIC_SITE_URL} />` (variable d'env `PUBLIC_SITE_URL`, ex: https://aycode.dev)
- **Schema.org Person:** name: AyCode, jobTitle: Développeur Freelance, knowsAbout: React Native, Next.js, Kubernetes, CI/CD
- **Schema.org Service (x2):**
  - Service 1: serviceType: Développement Mobile & Web, provider: AyCode, areaServed: FR
  - Service 2: serviceType: DevOps & Infrastructure Kubernetes, provider: AyCode, areaServed: FR
- `sitemap.xml` + `robots.txt` (allow all)
- Images optimisées WebP/AVIF avec alt descriptifs
- Lighthouse performance > 90 (SSG, pas de JS inutile)

---

## Animations

| Zone | Technologie | Effet |
|------|-------------|-------|
| Hero background | Three.js | Particules / mesh 3D gradient |
| Textes hero | GSAP | Reveal + stagger fade-in |
| Pain points | GSAP ScrollTrigger | Cards slide-in au scroll |
| Services | GSAP ScrollTrigger | Fade + translateY |
| Chiffres | CountUp.js | Compteur animé |
| Formulaire | CSS transitions | Step transitions fluides |
| Scroll global | Lenis | Smooth scroll |

---

## Contraintes

- Zéro backend requis (Formspree pour le formulaire)
- Déployable sur Vercel / Netlify / vps en un `git push`
- Mobile-first, responsive
- Pas de section tarifs
