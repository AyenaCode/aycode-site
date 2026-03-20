# AyCode Landing Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Landing page one-pager Astro 6 + SSG pour AyCode, couvrant les services Dev & DevOps, avec animations 3D GSAP/Three.js et formulaire qualifiant Formspree.

**Architecture:** SSG Astro 6 avec composants `.astro`, chaque section est un composant isolé. GSAP + Three.js + Lenis sont chargés via des `<script>` tags côté client. Formspree gère la soumission du formulaire sans backend.

**Tech Stack:** Astro 6, Tailwind CSS v4 + @tailwindcss/vite, GSAP + ScrollTrigger, Three.js, Lenis, CountUp.js, Formspree

---

## Cartographie des fichiers

| Fichier | Rôle |
|---------|------|
| `src/layouts/Layout.astro` | Shell HTML, meta SEO, schema.org, Google Fonts |
| `src/styles/global.css` | Tokens CSS, gradients, utilitaires d'animation |
| `src/pages/index.astro` | Assemblage de tous les composants + init Lenis/GSAP |
| `src/components/Hero.astro` | Scène Three.js + texte GSAP reveal + CTA |
| `src/components/PainPoints.astro` | 3 cartes pain points avec ScrollTrigger |
| `src/components/DevSection.astro` | Services React Native & Next.js |
| `src/components/DevOpsSection.astro` | Services CI/CD & Kubernetes |
| `src/components/SocialProof.astro` | Compteurs CountUp + placeholders témoignages |
| `src/components/ContactForm.astro` | Formulaire multi-étapes Formspree |
| `public/sitemap.xml` | Sitemap statique |
| `public/robots.txt` | Robots allow all |
| `public/og-image.png` | Image OG 1200×630 (placeholder remplaçable) |
| `tailwind.config.mjs` | Tokens couleurs, polices, keyframes custom |
| `.env` | Variables d'environnement (PUBLIC_FORMSPREE_ID, PUBLIC_SITE_URL) |
| `astro.config.mjs` | Intégrations Astro (tailwind, sitemap) |

---

## Task 1: Initialisation du projet Astro

**Files:**
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `.env`
- Create: `package.json` (via scaffold)

- [ ] **Step 1: Créer le projet Astro**

```bash
cd /home/ayena/site
npm create astro@latest . -- --template minimal --no-install --no-git
```

Expected: scaffold des fichiers de base dans `/home/ayena/site`

- [ ] **Step 2: Installer les dépendances**

```bash
npm install gsap three lenis countup.js tailwindcss @tailwindcss/vite
```

Expected: `node_modules/` mis à jour, pas d'erreur.

> Note: `@astrojs/tailwind` ne supporte pas Astro 6. On utilise Tailwind CSS v4 avec `@tailwindcss/vite` (plugin Vite natif).
> `@astrojs/sitemap` — si conflit peer deps, utiliser `sitemap.xml` statique dans `public/`.

- [ ] **Step 3: Configurer astro.config.mjs**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://aycode.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Tailwind CSS v4 — pas de tailwind.config.mjs**

Avec Tailwind v4, la config se fait directement dans le CSS via `@theme` :

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --color-dark: #050508;
  --color-dark-2: #0a0a14;
  --animate-gradient-shift: gradient-shift 4s linear infinite;
  --animate-float: float 3s ease-in-out infinite;
  --keyframes-gradient-shift: {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  };
  --keyframes-float: {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  };
}
```

> Note: violet-600 (#7c3aed), cyan-500 (#06b6d4), rose-500 (#ec4899) sont déjà dans Tailwind v4 — utiliser directement.

- [ ] **Step 5: Créer le fichier .env**

```bash
# .env
PUBLIC_FORMSPREE_ID=your_form_id_here
PUBLIC_SITE_URL=https://aycode.dev
```

- [ ] **Step 6: Vérifier le build initial**

```bash
npm run build
```

Expected: build réussi sans erreur dans `dist/`

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: init Astro project with Tailwind, GSAP, Three.js, Lenis"
```

---

## Task 2: Layout.astro — SEO complet

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Créer Layout.astro**

```astro
---
// src/layouts/Layout.astro
interface Props {
  title?: string;
  description?: string;
}

const {
  title = "AyCode — Développeur React Native, Next.js & DevOps Freelance",
  description = "AyCode — Développeur freelance React Native, Next.js & DevOps (Kubernetes, CI/CD). Je transforme vos idées en produits mobiles et web qui scalent. Devis gratuit.",
} = Astro.props;

const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://aycode.dev';
const ogImage = `${siteUrl}/og-image.png`;

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "AyCode",
      jobTitle: "Développeur Freelance",
      url: siteUrl,
      knowsAbout: ["React Native", "Next.js", "Kubernetes", "CI/CD", "DevOps"],
    },
    {
      "@type": "Service",
      serviceType: "Développement Mobile & Web",
      provider: { "@type": "Person", name: "AyCode" },
      areaServed: "FR",
      description: "Développement d'applications mobiles React Native et web Next.js performantes.",
    },
    {
      "@type": "Service",
      serviceType: "DevOps & Infrastructure Kubernetes",
      provider: { "@type": "Person", name: "AyCode" },
      areaServed: "FR",
      description: "Pipelines CI/CD et infrastructure Kubernetes haute disponibilité.",
    },
  ],
};
---

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={siteUrl} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content={siteUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="fr_FR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
    rel="stylesheet"
  />

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
</head>
<body class="bg-dark text-white font-body overflow-x-hidden">
  <slot />
</body>
</html>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: build propre.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add Layout with full SEO meta and schema.org JSON-LD"
```

---

## Task 3: global.css — Design tokens & utilitaires

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Créer global.css**

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --gradient-primary: linear-gradient(135deg, #7c3aed, #06b6d4, #ec4899);
    --gradient-text: linear-gradient(90deg, #7c3aed 0%, #06b6d4 50%, #ec4899 100%);
    --gradient-card: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06));
    --gradient-border: linear-gradient(135deg, rgba(124,58,237,0.6), rgba(6,182,212,0.3));
    --section-padding: clamp(4rem, 8vw, 8rem);
  }

  html {
    scroll-behavior: auto; /* Lenis gère le smooth scroll */
  }

  body {
    background-color: #050508;
    color: #f1f5f9;
    font-family: 'Inter', sans-serif;
  }

  /* Scrollbar custom */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #050508; }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(#7c3aed, #06b6d4);
    border-radius: 3px;
  }
}

@layer utilities {
  .gradient-text {
    background: var(--gradient-text);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 4s linear infinite;
  }

  .gradient-border {
    position: relative;
  }
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: var(--gradient-border);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .card-glass {
    background: var(--gradient-card);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(124, 58, 237, 0.2);
  }

  .section-padding {
    padding-top: var(--section-padding);
    padding-bottom: var(--section-padding);
  }

  /* Glow effects */
  .glow-violet { box-shadow: 0 0 40px rgba(124, 58, 237, 0.3); }
  .glow-cyan { box-shadow: 0 0 40px rgba(6, 182, 212, 0.3); }
  .text-glow { text-shadow: 0 0 30px rgba(124, 58, 237, 0.5); }
}

/* Animations GSAP init — éléments cachés avant animation */
.gsap-reveal {
  opacity: 0;
  transform: translateY(40px);
}
```

- [ ] **Step 2: Importer global.css dans Layout.astro**

Ajouter dans `<head>` de `src/layouts/Layout.astro` :

```astro
---
import '../styles/global.css';
---
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro
git commit -m "feat: add global CSS design tokens, gradient utilities, glass cards"
```

---

## Task 4: Hero.astro — Scène 3D + GSAP reveal

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Créer Hero.astro (structure HTML)**

```astro
---
// src/components/Hero.astro
---

<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">

  <!-- Canvas Three.js (fond) -->
  <canvas id="hero-canvas" class="absolute inset-0 w-full h-full pointer-events-none"></canvas>

  <!-- Fallback gradient si WebGL indisponible -->
  <div id="hero-fallback" class="absolute inset-0 hidden"
    style="background: radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.3) 0%, transparent 60%),
           radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.2) 0%, transparent 60%),
           radial-gradient(ellipse at 50% 80%, rgba(236,72,153,0.15) 0%, transparent 60%),
           #050508;">
  </div>

  <!-- Glow orbs décoratifs -->
  <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-violet/20 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan/15 rounded-full blur-3xl pointer-events-none"></div>

  <!-- Contenu Hero -->
  <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">

    <!-- Badge -->
    <div class="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass mb-8 gsap-reveal">
      <span class="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
      <span class="text-sm text-slate-300 font-medium">Disponible pour de nouvelles missions</span>
    </div>

    <!-- Titre principal -->
    <h1 class="hero-title font-display font-bold leading-tight mb-6 gsap-reveal"
      style="font-size: clamp(2.5rem, 6vw, 5rem);">
      Votre idée mérite une<br />
      <span class="gradient-text">exécution sans compromis.</span>
    </h1>

    <!-- Sous-titre -->
    <p class="hero-subtitle text-xl text-slate-400 max-w-2xl mx-auto mb-10 gsap-reveal leading-relaxed">
      Développeur <strong class="text-white">React Native & Next.js</strong>
      · DevOps <strong class="text-white">Kubernetes</strong>
      <br class="hidden md:block" />
      Je transforme vos projets en produits qui scalent.
    </p>

    <!-- CTA -->
    <div class="hero-cta gsap-reveal">
      <a
        href="#contact"
        class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-display font-semibold text-lg
               bg-gradient-to-r from-violet via-cyan to-rose
               hover:scale-105 hover:shadow-2xl hover:shadow-violet/30
               transition-all duration-300 ease-out text-white"
      >
        Démarrons ensemble
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>

    <!-- Logos tech -->
    <div class="hero-tech flex flex-wrap justify-center gap-6 mt-16 gsap-reveal">
      {['React Native', 'Next.js', 'Kubernetes', 'CI/CD', 'TypeScript'].map(tech => (
        <span class="px-4 py-2 rounded-lg card-glass text-slate-400 text-sm font-medium">{tech}</span>
      ))}
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12l7 7 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</section>

<script>
  import * as THREE from 'three';
  import gsap from 'gsap';

  // ── Three.js Particle Scene ──────────────────────────────────────────────
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
  const fallback = document.getElementById('hero-fallback') as HTMLElement;

  // WebGL support check
  const hasWebGL = (() => {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'));
    } catch { return false; }
  })();

  if (!hasWebGL) {
    canvas.style.display = 'none';
    fallback.classList.remove('hidden');
  } else {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#7c3aed'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#ec4899'),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.75 });
    const particles = new THREE.Points(geo, mat);
    scene.add(particles);
    camera.position.z = 5;

    const clock = new THREE.Clock();
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      particles.rotation.x = t * 0.04;
      particles.rotation.y = t * 0.07;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('astro:before-swap', () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    });
  }

  // ── GSAP Text Reveal ─────────────────────────────────────────────────────
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('.hero-badge',    { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
    .to('.hero-title',    { opacity: 1, y: 0, duration: 1.0 }, '-=0.4')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
    .to('.hero-cta',      { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('.hero-tech',     { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
</script>
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | head -30
```

Expected: pas d'erreur TypeScript ou Astro.

- [ ] **Step 3: Vérification visuelle**

```bash
npm run dev
```

Ouvrir `http://localhost:4321` — vérifier : scène 3D visible, texte animé, CTA présent.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: add Hero section with Three.js particles and GSAP reveal"
```

---

## Task 5: PainPoints.astro — 3 cartes ScrollTrigger

**Files:**
- Create: `src/components/PainPoints.astro`

- [ ] **Step 1: Créer PainPoints.astro**

```astro
---
// src/components/PainPoints.astro
const pains = [
  {
    icon: '💥',
    title: 'Une app qui plante en prod',
    desc: 'Bugs critiques découverts par vos utilisateurs. Nuits blanches, réputation abîmée, clients perdus.',
    gradient: 'from-rose/20 to-transparent',
  },
  {
    icon: '🐌',
    title: 'Des déploiements qui prennent des heures',
    desc: 'Releases manuelles, risques d\'erreurs humaines, équipes paralysées à chaque mise en production.',
    gradient: 'from-violet/20 to-transparent',
  },
  {
    icon: '👻',
    title: 'Un prestataire fantôme',
    desc: 'Code livré, puis silence. Pas de documentation, pas de support. Vous repartez de zéro.',
    gradient: 'from-cyan/20 to-transparent',
  },
];
---

<section class="section-padding px-6 max-w-6xl mx-auto">

  <div class="text-center mb-16">
    <p class="text-slate-500 text-sm font-medium uppercase tracking-widest mb-4">Le problème</p>
    <h2 class="font-display font-bold text-3xl md:text-4xl text-white gsap-reveal">
      Vous méritez mieux que ça.
    </h2>
  </div>

  <div class="grid md:grid-cols-3 gap-6">
    {pains.map((pain, i) => (
      <div
        class={`pain-card card-glass rounded-2xl p-8 gsap-reveal bg-gradient-to-br ${pain.gradient}`}
        data-index={i}
      >
        <div class="text-4xl mb-4">{pain.icon}</div>
        <h3 class="font-display font-semibold text-lg text-white mb-3">{pain.title}</h3>
        <p class="text-slate-400 text-sm leading-relaxed">{pain.desc}</p>
      </div>
    ))}
  </div>

  <!-- Transition vers la solution -->
  <div class="text-center mt-16 gsap-reveal">
    <p class="text-slate-400 text-lg">
      Avec <span class="gradient-text font-semibold">AyCode</span>, ces problèmes n'arrivent pas.
    </p>
  </div>
</section>

<script>
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  // Cards staggered
  gsap.to('.pain-card', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.pain-card',
      start: 'top 85%',
    },
  });
</script>
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PainPoints.astro
git commit -m "feat: add PainPoints section with staggered ScrollTrigger cards"
```

---

## Task 6: DevSection.astro — Services React Native & Next.js

**Files:**
- Create: `src/components/DevSection.astro`

- [ ] **Step 1: Créer DevSection.astro**

```astro
---
// src/components/DevSection.astro
const features = [
  {
    icon: '⚡',
    title: 'Livraison rapide',
    desc: 'MVP en 4 semaines. Itérations courtes, feedback continu, time-to-market optimisé.',
  },
  {
    icon: '🏗️',
    title: 'Code qui dure',
    desc: 'Architecture scalable, tests, documentation. Votre codebase reste maintenable après ma mission.',
  },
  {
    icon: '✨',
    title: 'UX qui convertit',
    desc: 'Interfaces fluides, accessibles et performantes. Vos utilisateurs reviennent.',
  },
];
---

<section id="dev" class="section-padding px-6 max-w-6xl mx-auto">

  <div class="grid lg:grid-cols-2 gap-16 items-center">

    <!-- Texte -->
    <div>
      <p class="text-cyan text-sm font-medium uppercase tracking-widest mb-4 gsap-reveal">
        Services Dev
      </p>
      <h2 class="font-display font-bold text-3xl md:text-5xl text-white mb-6 gsap-reveal leading-tight">
        Apps mobiles & web<br />
        <span class="gradient-text">qui performent.</span>
      </h2>
      <p class="text-slate-400 text-lg mb-10 gsap-reveal leading-relaxed">
        React Native pour iOS & Android. Next.js pour le web. Une seule expertise,
        deux plateformes maîtrisées, un produit cohérent de bout en bout.
      </p>
      <a href="#contact"
        class="gsap-reveal inline-flex items-center gap-2 text-cyan font-semibold hover:gap-4 transition-all duration-200">
        Parlons de votre projet
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>

    <!-- Features -->
    <div class="flex flex-col gap-4">
      {features.map((f) => (
        <div class="dev-feature card-glass rounded-2xl p-6 flex gap-5 items-start gsap-reveal
                    hover:border-cyan/40 hover:glow-cyan transition-all duration-300">
          <div class="text-3xl shrink-0 animate-float">{f.icon}</div>
          <div>
            <h3 class="font-display font-semibold text-white mb-1">{f.title}</h3>
            <p class="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('#dev .gsap-reveal', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '#dev', start: 'top 75%' },
  });
</script>
```

- [ ] **Step 2: Build check + commit**

```bash
npm run build 2>&1 | tail -5
git add src/components/DevSection.astro
git commit -m "feat: add Dev services section (React Native & Next.js)"
```

---

## Task 7: DevOpsSection.astro — CI/CD & Kubernetes

**Files:**
- Create: `src/components/DevOpsSection.astro`

- [ ] **Step 1: Créer DevOpsSection.astro**

```astro
---
// src/components/DevOpsSection.astro
const features = [
  {
    icon: '🔄',
    title: 'Pipelines CI/CD robustes',
    desc: 'GitHub Actions, GitLab CI. Tests automatisés, déploiements zéro-downtime. Chaque commit livré en confiance.',
  },
  {
    icon: '☸️',
    title: 'Infra Kubernetes haute dispo',
    desc: 'Clusters K8s scalables, autoscaling, health checks. Votre infra tient la charge, même en pic.',
  },
  {
    icon: '📊',
    title: 'Monitoring & alerting',
    desc: 'Prometheus, Grafana, alertes proactives. Vous dormez tranquille, je surveille.',
  },
];
---

<section id="devops" class="section-padding px-6 max-w-6xl mx-auto">

  <!-- Background glow -->
  <div class="absolute left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
    <div class="absolute top-1/2 -translate-y-1/2 -left-40 w-96 h-96 bg-violet/15 rounded-full blur-3xl"></div>
  </div>

  <div class="grid lg:grid-cols-2 gap-16 items-center">

    <!-- Features (gauche) -->
    <div class="flex flex-col gap-4 order-2 lg:order-1">
      {features.map((f) => (
        <div class="devops-feature card-glass rounded-2xl p-6 flex gap-5 items-start gsap-reveal
                    hover:border-violet/40 hover:glow-violet transition-all duration-300">
          <div class="text-3xl shrink-0 animate-float">{f.icon}</div>
          <div>
            <h3 class="font-display font-semibold text-white mb-1">{f.title}</h3>
            <p class="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <!-- Texte (droite) -->
    <div class="order-1 lg:order-2">
      <p class="text-violet text-sm font-medium uppercase tracking-widest mb-4 gsap-reveal">
        Services DevOps
      </p>
      <h2 class="font-display font-bold text-3xl md:text-5xl text-white mb-6 gsap-reveal leading-tight">
        Vos déploiements,<br />
        <span class="gradient-text">automatisés et blindés.</span>
      </h2>
      <p class="text-slate-400 text-lg mb-10 gsap-reveal leading-relaxed">
        Stop aux déploiements manuels stressants. Je mets en place l'infrastructure
        qui vous permet de livrer vite, souvent, et sans peur.
      </p>
      <a href="#contact"
        class="gsap-reveal inline-flex items-center gap-2 text-violet font-semibold hover:gap-4 transition-all duration-200">
        Automatiser mon infra
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>
  </div>
</section>

<script>
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('#devops .gsap-reveal', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '#devops', start: 'top 75%' },
  });
</script>
```

- [ ] **Step 2: Build check + commit**

```bash
npm run build 2>&1 | tail -5
git add src/components/DevOpsSection.astro
git commit -m "feat: add DevOps services section (CI/CD & Kubernetes)"
```

---

## Task 8: SocialProof.astro — Compteurs CountUp + témoignages

**Files:**
- Create: `src/components/SocialProof.astro`

- [ ] **Step 1: Créer SocialProof.astro**

```astro
---
// src/components/SocialProof.astro
const stats = [
  { value: 5,  suffix: '+', label: 'ans d\'expérience', description: 'en production' },
  { value: 20, suffix: '+', label: 'projets livrés',    description: 'mobile, web & infra' },
  { value: 0,  suffix: '',  label: 'projet abandonné',  description: 'engagement total' },
];

const testimonials = [
  {
    name: 'Alpha Jsutin',
    role: 'CTO, Startup SaaS',
    text: '"AyCode a livré notre app mobile en un temps record. Code propre, communication parfaite."',
  },
  {
    name: 'Germain Kodjo',
    role: 'Fondateur, E-commerce',
    text: '"Notre infra K8s tourne parfaitement depuis 6 mois. aucun incident en prod."',
  },
];
---

<section id="proof" class="section-padding px-6 max-w-6xl mx-auto">

  <!-- Stats -->
  <div class="grid grid-cols-3 gap-8 mb-20">
    {stats.map((stat) => (
      <div class="text-center gsap-reveal">
        <div class="font-display font-bold mb-2" style="font-size: clamp(3rem, 6vw, 5rem); line-height: 1;">
          <span
            class="count-up gradient-text"
            data-count={stat.value}
            data-suffix={stat.suffix}
          >0</span>
        </div>
        <p class="font-semibold text-white text-lg">{stat.label}</p>
        <p class="text-slate-500 text-sm">{stat.description}</p>
      </div>
    ))}
  </div>

  <!-- Testimonials -->
  <div class="grid md:grid-cols-2 gap-6">
    {testimonials.map((t) => (
      <div class="card-glass rounded-2xl p-8 gsap-reveal gradient-border">
        <p class="text-slate-300 text-lg italic leading-relaxed mb-6">{t.text}</p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center font-bold text-white text-sm">
            {t.name.charAt(0)}
          </div>
          <div>
            <p class="font-semibold text-white text-sm">{t.name}</p>
            <p class="text-slate-500 text-xs">{t.role}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

<script>
  import { CountUp } from 'countup.js';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  // Section reveal
  gsap.to('#proof .gsap-reveal', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '#proof', start: 'top 80%' },
  });

  // CountUp avec IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const end = parseInt(el.dataset.count || '0');
        const suffix = el.dataset.suffix || '';
        const cu = new CountUp(el, end, {
          duration: 2.5,
          useEasing: true,
          suffix,
        });
        if (!cu.error) cu.start();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach((el) => observer.observe(el));
</script>
```

- [ ] **Step 2: Build check + commit**

```bash
npm run build 2>&1 | tail -5
git add src/components/SocialProof.astro
git commit -m "feat: add SocialProof with CountUp stats and testimonials"
```

---

## Task 9: ContactForm.astro — Formulaire multi-étapes Formspree

**Files:**
- Create: `src/components/ContactForm.astro`

- [ ] **Step 1: Créer ContactForm.astro**

```astro
---
// src/components/ContactForm.astro
---

<section id="contact" class="section-padding px-6 max-w-3xl mx-auto">

  <div class="text-center mb-12">
    <p class="text-rose text-sm font-medium uppercase tracking-widest mb-4">Contact</p>
    <h2 class="font-display font-bold text-3xl md:text-4xl text-white mb-4">
      Décrivez votre projet —<br />
      <span class="gradient-text">je vous réponds sous 24h.</span>
    </h2>
    <p class="text-slate-400">Remplissez le formulaire ci-dessous pour démarrer la conversation.</p>
  </div>

  <div class="card-glass rounded-3xl p-8 md:p-12 gradient-border">

    <!-- Barre de progression -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div id="progress-fill" class="h-full rounded-full transition-all duration-500 ease-out"
          style="width: 0%; background: linear-gradient(90deg, #7c3aed, #06b6d4, #ec4899);">
        </div>
      </div>
      <span id="step-counter" class="ml-4 text-slate-500 text-sm font-medium">1 / 3</span>
    </div>

    <!-- Formulaire -->
    <form id="contact-form" novalidate>

      <!-- Honeypot anti-spam -->
      <input type="text" name="_gotcha" class="hidden" tabindex="-1" autocomplete="off" />

      <!-- Step 1: Type + Budget -->
      <div class="form-step active" data-step="1">
        <h3 class="font-display font-semibold text-white text-xl mb-6">Votre projet</h3>

        <div class="mb-6">
          <label class="block text-slate-400 text-sm font-medium mb-3">Type de projet</label>
          <div class="grid grid-cols-2 gap-3">
            {['Application mobile', 'Site / Web App', 'DevOps & Infra', 'Full-stack'].map((type) => (
              <label class="project-type-option flex items-center gap-3 p-4 rounded-xl card-glass cursor-pointer
                            hover:border-cyan/40 transition-all duration-200">
                <input type="radio" name="project_type" value={type} class="sr-only" />
                <span class="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0 relative
                             after:absolute after:inset-0.5 after:rounded-full after:bg-cyan after:scale-0
                             after:transition-transform peer-checked:after:scale-100"></span>
                <span class="text-slate-300 text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div class="mb-8">
          <label class="block text-slate-400 text-sm font-medium mb-3">Budget estimé</label>
          <div class="grid grid-cols-2 gap-3">
            {['< 5 000 €', '5 000 – 15 000 €', '15 000 – 50 000 €', '+ 50 000 €'].map((budget) => (
              <label class="budget-option flex items-center gap-3 p-4 rounded-xl card-glass cursor-pointer
                            hover:border-cyan/40 transition-all duration-200">
                <input type="radio" name="budget" value={budget} class="sr-only" />
                <span class="text-slate-300 text-sm">{budget}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="button" data-next class="btn-next w-full py-4 rounded-2xl font-display font-semibold text-white
          bg-gradient-to-r from-violet via-cyan to-rose hover:scale-[1.02] transition-all duration-200">
          Étape suivante →
        </button>
      </div>

      <!-- Step 2: Délai + Description -->
      <div class="form-step hidden" data-step="2">
        <h3 class="font-display font-semibold text-white text-xl mb-6">Votre besoin</h3>

        <div class="mb-6">
          <label class="block text-slate-400 text-sm font-medium mb-3">Délai souhaité</label>
          <div class="grid grid-cols-2 gap-3">
            {['Le plus tôt possible', '1 – 3 mois', '3 – 6 mois', '6 mois +'].map((delai) => (
              <label class="delai-option flex items-center gap-3 p-4 rounded-xl card-glass cursor-pointer
                            hover:border-violet/40 transition-all duration-200">
                <input type="radio" name="deadline" value={delai} class="sr-only" />
                <span class="text-slate-300 text-sm">{delai}</span>
              </label>
            ))}
          </div>
        </div>

        <div class="mb-8">
          <label for="description" class="block text-slate-400 text-sm font-medium mb-3">
            Description du projet
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            placeholder="Décrivez votre projet, vos objectifs, votre stack existante si applicable..."
            class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600
                   focus:outline-none focus:border-violet/50 focus:bg-white/8 transition-all duration-200 resize-none"
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button type="button" data-prev class="flex-1 py-4 rounded-2xl font-semibold text-slate-400
            border border-white/10 hover:border-white/20 transition-all duration-200">
            ← Retour
          </button>
          <button type="button" data-next class="flex-[2] py-4 rounded-2xl font-display font-semibold text-white
            bg-gradient-to-r from-violet via-cyan to-rose hover:scale-[1.02] transition-all duration-200">
            Étape suivante →
          </button>
        </div>
      </div>

      <!-- Step 3: Coordonnées -->
      <div class="form-step hidden" data-step="3">
        <h3 class="font-display font-semibold text-white text-xl mb-6">Vos coordonnées</h3>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="name" class="block text-slate-400 text-sm font-medium mb-2">Nom *</label>
            <input id="name" type="text" name="name" required placeholder="Votre nom"
              class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600
                     focus:outline-none focus:border-cyan/50 transition-all duration-200" />
          </div>
          <div>
            <label for="phone" class="block text-slate-400 text-sm font-medium mb-2">Téléphone</label>
            <input id="phone" type="tel" name="phone" placeholder="+33 6 XX XX XX XX"
              class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600
                     focus:outline-none focus:border-cyan/50 transition-all duration-200" />
          </div>
        </div>

        <div class="mb-8">
          <label for="email" class="block text-slate-400 text-sm font-medium mb-2">Email *</label>
          <input id="email" type="email" name="email" required placeholder="vous@exemple.com"
            class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600
                   focus:outline-none focus:border-cyan/50 transition-all duration-200" />
        </div>

        <div class="flex gap-3">
          <button type="button" data-prev class="flex-1 py-4 rounded-2xl font-semibold text-slate-400
            border border-white/10 hover:border-white/20 transition-all duration-200">
            ← Retour
          </button>
          <button id="submit-btn" type="submit" class="flex-[2] py-4 rounded-2xl font-display font-semibold text-white
            bg-gradient-to-r from-violet via-cyan to-rose hover:scale-[1.02] transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
            Envoyer mon projet →
          </button>
        </div>

        <p class="text-slate-600 text-xs text-center mt-4 leading-relaxed">
          En soumettant ce formulaire, vous acceptez d'être contacté par AyCode concernant votre projet.
          Vos données (nom, email, téléphone) sont utilisées uniquement à cette fin.
        </p>
      </div>
    </form>

    <!-- État succès -->
    <div id="form-success" class="hidden text-center py-8">
      <div class="text-6xl mb-4">🎉</div>
      <h3 class="font-display font-bold text-2xl text-white mb-3">Message envoyé !</h3>
      <p class="text-slate-400">Je vous réponds sous 24h. À très vite !</p>
    </div>

    <!-- État erreur -->
    <div id="form-error" class="hidden mt-4 p-4 rounded-2xl bg-rose/10 border border-rose/20 text-rose text-sm text-center">
      Une erreur est survenue. Réessayez ou contactez-moi directement.
    </div>
  </div>
</section>

<script>
  // ── State ──────────────────────────────────────────────────────────────
  let currentStep = 1;
  const totalSteps = 3;
  const progressFill = document.getElementById('progress-fill') as HTMLElement;
  const stepCounter = document.getElementById('step-counter') as HTMLElement;

  function showStep(step: number) {
    document.querySelectorAll('.form-step').forEach((s) => s.classList.add('hidden'));
    document.querySelector(`.form-step[data-step="${step}"]`)?.classList.remove('hidden');
    const pct = ((step - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${pct}%`;
    stepCounter.textContent = `${step} / ${totalSteps}`;
    currentStep = step;
  }

  // ── Navigation ─────────────────────────────────────────────────────────
  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStep < totalSteps) showStep(currentStep + 1);
    });
  });

  document.querySelectorAll('[data-prev]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) showStep(currentStep - 1);
    });
  });

  // ── Radio button visual state ──────────────────────────────────────────
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const name = (radio as HTMLInputElement).name;
      document.querySelectorAll(`input[name="${name}"]`).forEach((r) => {
        r.closest('label')?.classList.remove('border-cyan/60', 'bg-cyan/10', 'border-violet/60', 'bg-violet/10');
      });
      radio.closest('label')?.classList.add('border-cyan/60', 'bg-cyan/10');
    });
  });

  // ── Formspree submit ───────────────────────────────────────────────────
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const formSuccess = document.getElementById('form-success') as HTMLElement;
  const formError = document.getElementById('form-error') as HTMLElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    const formData = new FormData(form);
    const endpoint = import.meta.env.PUBLIC_FORMSPREE_ID;

    try {
      const res = await fetch(`https://formspree.io/f/${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.classList.add('hidden');
        formSuccess.classList.remove('hidden');
      } else {
        throw new Error('Formspree error');
      }
    } catch {
      formError.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer mon projet →';
    }
  });
</script>

<style>
  .form-step.active { display: block; }
  .form-step.hidden { display: none; }
</style>
```

- [ ] **Step 2: Build check**

```bash
npm run build 2>&1 | tail -5
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ContactForm.astro
git commit -m "feat: add multi-step ContactForm with Formspree and GDPR notice"
```

---

## Task 10: index.astro — Assemblage final + Lenis/GSAP init

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Créer index.astro**

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import PainPoints from '../components/PainPoints.astro';
import DevSection from '../components/DevSection.astro';
import DevOpsSection from '../components/DevOpsSection.astro';
import SocialProof from '../components/SocialProof.astro';
import ContactForm from '../components/ContactForm.astro';
---

<Layout>
  <main>
    <Hero />
    <PainPoints />
    <DevSection />
    <DevOpsSection />
    <SocialProof />
    <ContactForm />
  </main>

  <!-- Footer minimal -->
  <footer class="py-8 px-6 text-center border-t border-white/5">
    <p class="text-slate-600 text-sm">
      © 2026 <span class="gradient-text font-semibold">AyCode</span> — Développeur Freelance
    </p>
  </footer>
</Layout>

<script>
  import Lenis from 'lenis';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  // Lenis instancié AVANT ScrollTrigger.scrollerProxy()
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
</script>
```

- [ ] **Step 2: Build check complet**

```bash
npm run build
```

Expected: build réussi, `dist/index.html` généré.

- [ ] **Step 3: Dev server — inspection visuelle**

```bash
npm run dev
```

Vérifier :
- [ ] Hero visible avec scène 3D (ou fallback gradient)
- [ ] Texte hero animé à l'ouverture
- [ ] Scroll smooth Lenis
- [ ] PainPoints, DevSection, DevOpsSection s'animent au scroll
- [ ] CountUp se déclenche au scroll sur SocialProof
- [ ] Formulaire multi-étapes navigue entre les 3 étapes
- [ ] Barre de progression se met à jour

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble full landing page with Lenis smooth scroll"
```

---

## Task 11: Assets statiques — sitemap, robots, og-image

**Files:**
- Create: `public/robots.txt`
- Create: `public/og-image.png` (placeholder)

> Note: `sitemap.xml` est généré automatiquement par `@astrojs/sitemap` lors du build.
> `og-image.png` est un placeholder à remplacer par votre design final (1200×630px).

- [ ] **Step 1: Créer robots.txt**

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://aycode.dev/sitemap-index.xml
```

- [ ] **Step 2: Créer og-image placeholder (SVG encodé en PNG)**

Créer `public/og-image-source.svg` avec ce contenu (puis exporter en PNG 1200×630) :

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#050508"/>
      <stop offset="100%" style="stop-color:#0a0a14"/>
    </linearGradient>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="50%" style="stop-color:#06b6d4"/>
      <stop offset="100%" style="stop-color:#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="200" cy="300" r="300" fill="rgba(124,58,237,0.15)"/>
  <circle cx="1000" cy="300" r="250" fill="rgba(6,182,212,0.1)"/>
  <text x="600" y="260" font-family="Space Grotesk, sans-serif" font-size="80" font-weight="700"
    text-anchor="middle" fill="url(#grad)">AyCode</text>
  <text x="600" y="340" font-family="Inter, sans-serif" font-size="28"
    text-anchor="middle" fill="#94a3b8">Développeur React Native · Next.js · DevOps</text>
  <text x="600" y="400" font-family="Inter, sans-serif" font-size="22"
    text-anchor="middle" fill="#64748b">Kubernetes · CI/CD · Freelance</text>
</svg>
```

Pour convertir en PNG : ouvrir dans un navigateur et faire screenshot, ou utiliser `npx sharp-cli` / Inkscape.

- [ ] **Step 3: Build check**

```bash
npm run build
ls dist/sitemap-index.xml dist/robots.txt
```

Expected: les deux fichiers présents dans `dist/`.

- [ ] **Step 4: Commit**

```bash
git add public/
git commit -m "feat: add robots.txt, og-image source SVG; sitemap auto-generated"
```

---

## Task 12: Vérification finale — build, performance, SEO

**Files:** Aucun (étape de validation)

- [ ] **Step 1: Build production propre**

```bash
npm run build
```

Expected: zéro erreur, `dist/` généré.

- [ ] **Step 2: Preview production**

```bash
npm run preview
```

Ouvrir `http://localhost:4321` — parcourir toute la page, vérifier :
- [ ] Animations fonctionnelles (Three.js, GSAP, CountUp)
- [ ] Formulaire : 3 étapes + progression + validation
- [ ] Responsive mobile (DevTools, 375px)
- [ ] Pas d'erreurs console

- [ ] **Step 3: Check SEO du HTML généré**

```bash
cat dist/index.html | grep -E "(title|description|og:|twitter:|canonical|schema)"
```

Expected: tous les tags SEO présents.

- [ ] **Step 4: Check sitemap**

```bash
cat dist/sitemap-index.xml
```

Expected: référence `https://aycode.dev/` présent.

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "chore: final build verification — landing page AyCode complete"
```

---

## Déploiement

### Vercel
```bash
npx vercel --prod
# Variables d'env à configurer dans le dashboard :
# PUBLIC_FORMSPREE_ID=xxx
# PUBLIC_SITE_URL=https://aycode.dev
```

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### VPS (Nginx)
```bash
npm run build
rsync -avz dist/ user@server:/var/www/aycode/
```
