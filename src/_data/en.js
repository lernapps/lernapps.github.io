// All texts of the site's pages (English), the translation of de.js: same structure, same order. Templates contain
// no copy of their own. German is the source; keep both files in step.
// Language: plain English, short sentences, active voice, no jargon, "you". Links point to the English tree of a
// site (/apps/en/); the platform design, the vision and the tooling are English only and keep their addresses.
export default {
  meta: {
    title: "lernapps.net — learning apps with no strings attached",
    description:
      "Small learning apps, made by parents and teachers: free in the browser, no account, no ads, no subscription. And a solid foundation for everyone who wants to build an app themselves.",
  },

  landing: {
    hero: {
      headline: "Learning apps with no strings attached.",
      subtitle: "Made by parents and teachers, with passion. Free in the browser and ready to go.",
      badges: ["No account", "No ads", "No subscription", "Nothing leaves the device"],
      primary: "Find an app",
      primaryHref: "/apps/en/",
      secondary: "Build an app yourself",
      secondaryHref: "#get-involved",
    },

    showcase: {
      heading: "A few apps from the catalog",
      intro: "From a thorough practice app to a game. Each one was made for a real class or a real child.",
      early: "We are just getting started. The catalog grows with every app someone lists.",
      apps: [
        { icon: "🗺️", meta: "Maths · Grade 8", title: "Mathe-Karte", text: "Percentages, binomial formulas and probability: explained, with a picture and many exercises.", href: "/apps/en/mathe-karte/" },
        { icon: "🎲", meta: "Maths · Grades 7 and 8", title: "Kniffel-Trainer", text: "Play Yahtzee and learn to see chances as fractions and percentages.", href: "/apps/en/kniffel-trainer/" },
        { icon: "🔍", meta: "German · Grades 3 to 13", title: "Textcheck", text: "Find the mistakes in a text, right up to opinions that sound like facts.", href: "/apps/en/textcheck/" },
        { icon: "🌋", meta: "Geography · Grades 5 to 10", title: "Naturwunder-Quiz", text: "Volcanoes, waterfalls, deserts: an explanation for every answer and Wikipedia to read on.", href: "/apps/en/naturwunder-quiz/" },
      ],
      all: "See all apps",
      allHref: "/apps/en/",
    },

    forYou: {
      heading: "What you get",
      items: [
        {
          icon: "📚", role: "If you teach", headline: "Covering a lesson in 7b?",
          text: "You take over a class at short notice, maybe not even in your subject. Search by subject and grade, share a link or show the QR code. The class works on the topic in a meaningful way, and the app gives every child feedback.\n\nNobody needs an account, and no data about your students is created.",
          cta: "Apps for class", ctaHref: "/apps/en/",
        },
        {
          icon: "🏠", role: "If your child has a test tomorrow", headline: "Practise tonight.",
          text: "Look for an app on the topic of the test. Your child can start right away: no subscription, no ads, no account. Nobody finds out who they are.",
          tutor: { title: "And if they get stuck?", text: "In the explainer apps, the AI assistant you already use can help. It knows the task, the solution and the typical mistakes and explains step by step. Even at nine in the evening, when you don't know the answer yourself. The app itself sends nothing." },
          cta: "Apps to practise", ctaHref: "/apps/en/",
        },
      ],
    },

    different: {
      heading: "A solid foundation for makers.",
      intro: "lernapps are not products of a publisher. Parents and teachers build them because their child or their class was missing something. lernapps.net gives them a foundation on which these become good apps.",
      makers: { title: "The makers bring", items: ["their idea", "their knowledge of the subject", "their experience from the classroom and the kitchen table"] },
      platform: { title: "The platform brings", items: ["foundations for a quiz, an explainer and an interactive app", "a method: based on the curriculum, exercises with feedback", "tools to build, check and list an app"] },
      result: "So every app feels familiar. And every app brings its own idea.",
      link: "What the apps can do",
      linkHref: "/features/#apps",
    },

    platform: {
      objection: "Another platform? There are plenty already.",
      heading: "True. But this one belongs to no company.",
      intro: "lernapps.net is not the product of a vendor or an agency. It is a shared place: parents and teachers build apps here, share them and use them. The same principles apply to everyone.",
      points: [
        { title: "Nobody earns money from it.", text: "No subscription, no ads, no selling of data. Not later either.", link: { label: "Why it works anyway", href: "/features/#costs" } },
        { title: "A place to share.", text: "Some build apps, others use them. Feedback and thanks reach the people who built them." },
        { title: "Open, with clear principles.", text: "No account, nothing is collected. The rules, the plan and the source code of the platform are public." },
      ],
      links: [
        { label: "All principles", href: "/features/#principles" },
        { label: "Technology and costs, openly explained", href: "/features/#technology" },
      ],
    },

    join: {
      id: "get-involved",
      heading: "Don't want to wait for things to change?",
      text: "Build the app your class or your child is missing. You bring the idea and the content. We give you the foundation, the method and the tools. Your AI assistant helps you build it. And your app stays yours.\n\nWhoever uses your app can say thanks. You hear about it and see where your work arrives.",
      cta: "Build an app",
      ctaHref: "/apps/en/build/",
    },

    founder: {
      heading: "For years, everyone has talked about the digitalisation problem of schools. I believe we have a different one.",
      text: "There is no lack of tablets and Wi-Fi. What is missing is an ecosystem that brings good ideas to where they are needed. Parents and teachers have long been building learning apps for their child or their class. But the apps stay where they were made.\n\nI don't want to keep complaining. I want to do something. And I want everyone who cares about good education to be able to do something too. That is why I am founding lernapps.net.",
      signature: "Oliver Jägle",
      role: "Founder of lernapps.net",
      link: "More about us and the idea",
      linkHref: "/about/",
    },

    cta: {
      title: "Lives on passion. And on your thanks.",
      description: "Find an app for tomorrow. Or build the one that is still missing.",
      primary: "Find an app",
      primaryHref: "/apps/en/",
      secondary: "Build an app",
      secondaryHref: "/apps/en/build/",
    },
  },

  // ── FEATURES: principles, what the apps can do, technical transparency ─────
  features: {
    meta: {
      title: "What lernapps is made of — lernapps.net",
      description: "The principles of lernapps.net, what the apps can do, and openly explained: how the technology works, what it costs and how an app gets into the catalog.",
    },
    hero: {
      headline: "What lernapps is made of",
      subtitle: "For everyone who uses apps: the principles and what the apps can do. For everyone who builds: how it works technically, openly explained.",
      jump: [
        { label: "Principles", href: "#principles" },
        { label: "What the apps can do", href: "#apps" },
        { label: "Technology, openly explained", href: "#technology" },
      ],
    },
    principles: {
      id: "principles",
      heading: "The principles",
      intro: "They apply to everyone alike: to those who build apps and to those who use them.",
      items: [
        { icon: "🤝", title: "No company behind it", text: "Nobody earns money from lernapps.net. No subscription, no ads, no selling of data. Not later either." },
        { icon: "📂", title: "Open, not closed", text: "The rules, the plan and the source code are public. Anyone can read how decisions are made here." },
        { icon: "🏡", title: "Your app stays yours", text: "Every app stays with the person who built it. lernapps.net shows it but does not own it." },
        { icon: "🔒", title: "Nothing is collected", text: "No account, no cookies, no tracking. What someone types stays on their device." },
        { icon: "💬", title: "Honest about limits", text: "Every app says what it can do and what it can't. We say openly what we don't know yet." },
        { icon: "💙", title: "Thanks instead of money", text: "Whoever uses an app can say thanks. That way the person who built it learns that it helped." },
      ],
    },
    apps: {
      id: "apps",
      heading: "What the apps can do",
      intro: "Every app is built on one of three foundations. That is why they work in a similar way everywhere, and every one is made with the same care.",
      archetypes: [
        { icon: "❓", title: "Quiz", text: "Questions with answers to choose from. After every answer it says why it is right or wrong, and where to read on." },
        { icon: "📖", title: "Explainer", text: "Chapters of pages that explain. Every page has exercises. The pages can be read without JavaScript too." },
        { icon: "🎮", title: "Interactive app", text: "Learning by doing: a game, a training, an experiment. What the learners do is the content." },
      ],
      items: [
        { title: "Based on the curriculum", text: "The content comes from the state curriculum and the teacher's material. Every app says what you can do afterwards." },
        { title: "Exercises with feedback", text: "A wrong answer explains why it is wrong. Then you can try again." },
        { title: "One link takes you right there", text: "To the topic, to the section or to exactly the task the whole class should work on. As a QR code too." },
        { title: "With your AI assistant", text: "In the explainer apps, the AI assistant you already use gets the task, the solution and the typical mistakes. It explains step by step. The app itself sends nothing." },
        { title: "Accessible", text: "The apps meet WCAG 2.1 AA and work from 360 pixels wide. Where an app can't, it says so in the catalog." },
        { title: "Runs on every device", text: "In the browser, without installing anything: on the projector, on the class tablets or on a phone at home." },
      ],
    },
    tech: {
      id: "technology",
      kicker: "For developers",
      heading: "Technology, openly explained",
      intro: "For us, technical transparency is not small print but a promise. Here is how lernapps.net works, what it costs and what you agree to when you contribute an app.",
      blocks: [
        {
          id: "costs",
          title: "Why it works without money",
          text: "Every app is a static page. It runs entirely in the browser, without its own server and without a database. It is hosted for free, for example with GitHub Pages, or wherever you like. The catalog is static too.\n\nSo there are no servers that cost money, and no data that anyone could earn money with. People do the work on an app anyway: for their own class or their own child.",
        },
        {
          id: "review",
          title: "How an app gets into the catalog",
          steps: [
            "You publish the app in your own repository, at your own address.",
            "You send an entry as a pull request to lernapps/apps. Without GitHub, a form or an email works too.",
            "An automatic check opens the app the way learners do and compares it with the entry: do all topics open, are the details right, does the app keep the rules?",
            "An AI agent can also review the app against a checklist.",
            "The operator of lernapps.net decides whether it is listed.",
          ],
        },
        {
          id: "stack",
          title: "Your stack, your choice",
          text: "With our tooling you create an app from a foundation: quiz, explainer or interactive app. Checks then run on every commit and in CI, and skills and a plan guide your AI assistant through the work.\n\nBut you can also build freely, with any stack. Then only the platform rules apply: collect nothing, no account, no ads, accessible, usable from 360 pixels, no other servers before a click. Dependencies need an open licence.",
        },
        {
          id: "ownership",
          title: "Ownership and licence",
          text: "Your app lives in your repository, at your address and under your licence. The catalog only links to it. We recommend open licences: MIT or Apache 2.0 for the code, CC BY 4.0 for the content. That way others can build on your app, and your name stays with it.\n\nYou use content by others, such as texts or pictures, only with a suitable licence and name the source and licence. The platform itself and the tooling are under the MIT licence.",
        },
      ],
      links: [
        { label: "The rules for every app", href: "/tooling/rules/" },
        { label: "The tooling", href: "/tooling/" },
        { label: "How we test the guidance", href: "/tooling/prompt-engineering/" },
        { label: "The platform design", href: "/docs/platform-design/" },
        { label: "The source code", href: "https://github.com/lernapps" },
      ],
      note: "The technical documents are in English.",
      cta: "Build an app",
      ctaHref: "/apps/en/build/",
    },
  },

  // ── ABOUT: the long story behind lernapps.net ──────────────────────────────
  about: {
    meta: {
      title: "About us — lernapps.net",
      description: "Why lernapps.net exists: digital education in Germany does not have a device problem but an ecosystem problem. And an honest answer for sceptics.",
    },
    founder: {
      heading: "For years, everyone has talked about the digitalisation problem of schools. I believe we have a different one.",
      text: "Politicians announce programmes, billions for tablets and Wi-Fi. And then we hear it again: schools are lagging behind. Yet there is no lack of devices. What is missing is an ecosystem that brings good ideas to where they are needed.\n\nThese ideas have existed for a long time. Parents and teachers build learning apps for their child or their class, with passion. But the apps stay where they were made. Whoever wants to use them carries the risk alone. And whoever built them never learns whether they helped.\n\nI am a software developer. For some time now I have seen how easy it has become to build small apps. With an AI assistant it hardly takes any time or money. Yet very little of this reaches schools.\n\nI don't want to keep complaining. I want to do something. And I want everyone who cares about good education to be able to do something too. Especially now, when you feel powerless in so many places, this matters: to see that your own work reaches a child you have never met.\n\nThat is why I am founding lernapps.net. I don't want to earn money with it. First I want to see whether the need is real. If lernapps.net carries, it could become an association, for example. Then the platform belongs to those who fill it with life.",
      signature: "Oliver Jägle",
      role: "Founder of lernapps.net",
    },
    sceptics: {
      heading: "“This won't work anyway.”",
      text: "Maybe. We don't know yet. That is why we start small: with a few apps and a few people who build and use them. We wrote down beforehand how we will notice whether it works. And how we will notice that it doesn't.\n\nWe planned lernapps.net with the Platform Design Toolkit, a method for designing platforms. It states who takes part, what everyone gets out of it and what we try first. Everything is public.",
      links: [
        { label: "What we try first", href: "/docs/platform-design/#2-design/d8-mvp.pdt42.md" },
        { label: "The whole platform design", href: "/docs/platform-design/" },
        { label: "The vision", href: "/docs/vision/" },
      ],
      note: "The documents are in English.",
    },
    cta: {
      title: "Join in.",
      description: "Find an app for tomorrow. Or build the one that is still missing.",
      primary: "Find an app",
      primaryHref: "/apps/en/",
      secondary: "Build an app",
      secondaryHref: "/apps/en/build/",
    },
  },
};
