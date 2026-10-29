// All texts of the site's pages (English), the translation of de.js: same structure, same order. Templates contain
// no copy of their own. German is the source; keep both files in step.
// Language: plain English, short sentences, active voice, no jargon, "you". Links point to the English tree of a
// site (/apps/en/, /tooling/en/, /docs/en/platform-design/): the frame stays English there, also where the text
// exists in English only.
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
      badges: ["No account", "No ads", "No subscription", "What you type stays on the device", "Works on phones too"],
      primary: "Find an app",
      primaryHref: "/apps/en/",
      secondary: "Build one",
      secondaryHref: "#get-involved",
      // A small joke on the side: the video loads only after the click. Without JavaScript the button stays hidden.
      cat: {
        open: "Cat videos instead",
        label: "Video: Minka the cat and the maths book",
        description: "Video description: In a child's bedroom a cat sits among toys. It opens a maths book with its paw, looks at the equations, then looks into the camera with a blank face. It shrugs, closes the book and walks back to its place. The video has ambient sound only, nobody speaks.",
        fallback: "Watch the video (MP4)",
        endTitle: "Do you feel like Minka?",
        endText: "Learning does not have to be like this. Here you find apps that really teach something.",
        primary: "Find an app",
        primaryHref: "/apps/en/",
        close: "Close",
      },
    },

    showcase: {
      heading: "A few apps from the catalog",
      intro: "From a thorough practice app to a game. Each one was made for a real class or a real child.",
      early: "We are just getting started. The catalog grows with every app someone lists.",
      lasting: "The apps live with their makers, not with us. If lernapps.net were gone, they would keep running.",
      honest: "Every app comes from a person. We help them build it, but that is no guarantee of quality. If you see a mistake in the content, report it on the app's page.",
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
      intro: "Two ways for your child. Learning takes time: that is what the catalogue is for. Before a test, what counts is the material from the exercise book: for that, your AI assistant makes an app to practise, made to measure.",
      privacy: {
        title: "For us, privacy is a feature",
        text: "No account, no cookies, no tracking. What someone types stays on their device. What lernapps.net stores and what it doesn't is set out in the privacy notice. You can pass it on to your head teacher or data protection officer.",
        link: "To the privacy notice",
        href: "/privacy/",
      },
      next: "That is all you need to know. The rest of this page is for everyone who wants to build an app themselves.",
      nextLink: "To the apps",
      nextHref: "/apps/en/",
      items: [
        {
          icon: "📚", role: "If you teach", headline: "Covering a lesson in 7b?",
          text: "You take over a class at short notice, maybe not even in your subject. Search by subject and grade, share a link or show the QR code. The class works on the topic in a meaningful way, and the app gives every child feedback.\n\nNobody needs an account, and no data at all about your students is collected.",
          cta: "Apps for class", ctaHref: "/apps/en/",
        },
        {
          icon: "🧭", role: "If your child wants to learn a topic", headline: "Learn, at their own pace.",
          text: "Your child is stuck on a topic, and you lack the time or the subject knowledge? In the catalogue it finds apps that explain a topic step by step, with exercises and feedback. Built by parents and teachers, there to stay.\n\nYour child can come back as often as needed: no subscription, no ads, no account.",
          cta: "Apps to learn", ctaHref: "/apps/en/",
        },
        {
          icon: "📝", role: "If a test is coming up", headline: "Practise, exactly for the next test.",
          text: "The test is next week, and the catalogue has nothing on exactly this material? Give your AI assistant photos of the worksheets. In a few minutes they become an app that explains and checks exactly this material.\n\nYou need no subject knowledge: you say what for, and look at the result. The app is online for two weeks, and your child needs no account.",
          cta: "To practise", ctaHref: "/practice/en/",
        },
      ],
    },

    different: {
      heading: "A solid foundation for makers.",
      intro: "lernapps are not products of a publisher. Parents and teachers build them because their child or their class was missing something. lernapps.net gives them a foundation on which these become good apps.",
      makers: { title: "The makers bring", items: ["their idea", "their knowledge of the subject", "their experience from the classroom and the kitchen table"] },
      platform: { title: "The platform brings", items: ["foundations for a quiz, an explainer and an interactive app", "a method: based on the curriculum, exercises with feedback", "tools to build, check and list an app"] },
      result: "That makes it quick and easy to turn your own ideas into apps.",
      link: "What the apps can do",
      linkHref: "/features/#users",
    },

    platform: {
      objection: "Another platform? There are plenty already.",
      heading: "True. But this one belongs to no company.",
      intro: "lernapps.net is not the product of a vendor or an agency. It is a shared place: parents and teachers build apps here, share them and use them. The same principles apply to everyone.",
      points: [
        { title: "Nobody earns money from it.", text: "No subscription, no ads, no selling of data. Not later either. The apps need no server of their own, so running them costs almost nothing.", link: { label: "More about this", href: "/features/#costs" } },
        { title: "A place to share.", text: "Some build apps, others use them. Feedback and thanks reach the people who built them." },
        { title: "Open, with clear principles.", text: "No account, the apps collect nothing. The rules, the plan and the source code of the platform are public." },
      ],
      links: [
        { label: "All principles", href: "/features/#principles" },
        { label: "How the platform works", href: "/features/#platform" },
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

  // ── FEATURES: for users, for developers, and what makes the platform unique ─
  features: {
    meta: {
      title: "Features — lernapps.net",
      description: "What the apps can do, what you get when you build one, and what makes lernapps.net unique: no server, no company, no data collection, with GitHub as a free backbone.",
    },
    hero: {
      headline: "What lernapps is made of",
      subtitle: "For everyone who uses apps. For everyone who builds apps. And what makes the platform behind them unique.",
      jump: [
        { label: "For users", href: "#users" },
        { label: "For developers", href: "#developers" },
        { label: "The platform", href: "#platform" },
      ],
    },
    users: {
      id: "users",
      kicker: "For teachers, parents and learners",
      heading: "What the apps can do",
      intro: "Every app is built on one of three foundations. That is why they work in a similar way everywhere, and every one is made with the same care.",
      archetypes: [
        { icon: "❓", title: "Quiz", text: "Questions with answers to choose from. After every answer it says why it is right or wrong, and where to read on." },
        { icon: "📖", title: "Explainer", text: "Chapters of pages that explain. Every page has exercises. The pages can be read without JavaScript too.", extra: "If you like, add an AI tutor: the app gives your own AI assistant the task, the solution and the typical mistakes. This is optional. The app works entirely without AI and sends nothing itself." },
        { icon: "🎮", title: "Interactive app", text: "Learning by doing: a game, a training, an experiment. What the learners do is the content." },
      ],
      items: [
        { title: "Based on the curriculum", text: "The content comes from the state curriculum and the teacher's material. Every app says what you can do afterwards." },
        { title: "Exercises with feedback", text: "A wrong answer explains why it is wrong. Then you can try again." },
        { title: "One link takes you right there", text: "To the topic, to the section or to exactly the task the whole class should work on. As a QR code too." },
        { title: "Made by people", text: "Every app comes from a teacher, a parent or someone who likes to build. We help them build it, but that is no guarantee of quality. You report a mistake in the content with one click on the app's page." },
        { title: "Accessible", text: "The apps meet WCAG 2.1 AA and work from 360 pixels wide. Where an app can't, it says so in the catalog." },
        { title: "Runs on every device", text: "In the browser, without installing anything: on the projector, on the class tablets or on a phone at home." },
      ],
      cta: "Find apps",
      ctaHref: "/apps/en/",
    },
    developers: {
      id: "developers",
      kicker: "For developers",
      heading: "What you get when you build",
      intro: "You bring the idea and the content. lernapps.net gives you foundations, tools and guidance for your AI assistant. And it says openly what you agree to when you contribute an app.",
      blocks: [
        {
          id: "stack",
          title: "Foundations, or your own stack",
          text: "With our tooling you create an app from a foundation: quiz, explainer or interactive app. Checks then run on every commit and in CI.\n\nBut you can also build freely, with any stack. Then only the platform rules apply: collect nothing, no account, no ads, accessible, usable from 360 pixels, no other servers before a click. Dependencies need an open licence.",
        },
        {
          id: "assistant",
          title: "Made for your AI assistant",
          text: "Skills, a plan and rules with fixed IDs guide your assistant through the work: ask, plan, build, check, publish, list. You decide along with it at fixed points.\n\nWe test how closely different assistants follow this guidance and publish the results.",
        },
        {
          id: "review",
          title: "How an app gets into the catalog",
          steps: [
            "You publish the app in your own repository, at your own address.",
            "You submit it: as a pull request to lernapps/apps, or by form or email without GitHub. Anyone can submit an app.",
            "An automatic check opens the app the way learners do and compares it with the entry: do all topics open, are the details right?",
            "It is checked against the rules for every app. They are exclusion criteria: an app that collects data, needs an account or shows ads does not get into the catalog. An AI agent can also review the app against a checklist.",
            "If the app keeps the rules, it is listed, and lernapps.net serves a copy of it. For a finished app, all of this takes a few hours.",
          ],
        },
        {
          id: "feedback",
          title: "Feedback reaches you",
          text: "Whoever uses your app can say thanks or tell you how it went, up to “mistake in the content”. Today this is an email to lernapps.net, and we pass it on to you.\n\nIf your source code is on GitHub, people can also open an issue in your repository straight from the app's page.",
        },
        {
          id: "ownership",
          title: "Ownership and licence",
          text: "Your app lives in your repository, at your address and under your licence. The catalog only links to it. We recommend open licences: MIT or Apache 2.0 for the code, CC BY 4.0 for the content. That way others can build on your app, and your name stays with it.\n\nYou use content by others, such as texts or pictures, only with a suitable licence and name the source and licence. The platform itself and the tooling are under the MIT licence.",
        },
      ],
      links: [
        { label: "The rules for every app", href: "/tooling/en/rules/" },
        { label: "The tooling", href: "/tooling/en/" },
        { label: "How we test the guidance", href: "/tooling/en/prompt-engineering/" },
      ],
      note: "The technical documents are in English.",
      cta: "Build an app",
      ctaHref: "/apps/en/build/",
    },
    platform: {
      id: "platform",
      kicker: "What makes lernapps.net unique",
      heading: "No server. No company. No data collection.",
      intro: "Most learning platforms need servers, accounts and a business model. lernapps.net is built differently. That is why it can stay free.",
      unique: [
        { id: "costs", icon: "🐙", title: "GitHub as a free backbone", text: "This is why it works without money: the apps and the catalog are static pages on GitHub Pages. An entry is a pull request, the check runs in GitHub Actions. There is no server of our own that costs money." },
        { id: "data", icon: "🔒", title: "Privacy as a feature", text: "Every app runs entirely in the browser. There is no server with data, no database and no account. What is not collected cannot be lost or sold.", link: { label: "The privacy notice", href: "/privacy/" } },
        { id: "ai", icon: "🤖", title: "Readable for AI assistants", text: "Every part of lernapps.net has an llms.txt. So an assistant can find the right app, explain the platform or build an app itself. Without anyone having to run an API." },
        { id: "open", icon: "🧭", title: "Planned in the open", text: "We designed lernapps.net with the Platform Design Toolkit: who takes part, what everyone gets out of it, what we try first. Everything is public, including what we don't know yet." },
      ],
      principles: {
        id: "principles",
        heading: "The principles",
        intro: "They apply to everyone alike: to those who build apps and to those who use them.",
        items: [
          { icon: "🤝", title: "No company behind it", text: "Nobody earns money from lernapps.net. No subscription, no ads, no selling of data. Not later either." },
          { icon: "📂", title: "Open, not closed", text: "The rules, the plan and the source code are public. Anyone can read how decisions are made here." },
          { icon: "🏡", title: "Your app stays yours", text: "Every app stays with the person who built it. lernapps.net shows it but does not own it." },
          { icon: "🔒", title: "The apps collect nothing", text: "No account, no cookies, no tracking. What someone types stays on their device." },
          { icon: "💬", title: "Honest about limits", text: "Every app says what it can do and what it can't. We say openly what we don't know yet." },
          { icon: "💙", title: "Thanks instead of money", text: "Whoever uses an app can say thanks. Today one click opens a ready-made email to lernapps.net, and we pass the thanks on to the person who built the app. Later one click will be enough, without any email." },
        ],
      },
      links: [
        { label: "How it is meant", href: "/docs/en/" },
        { label: "The platform design", href: "/docs/en/platform-design/" },
        { label: "The source code", href: "https://github.com/lernapps" },
      ],
    },
  },


  // ── JOIN: one block per persona, each with a prompt for their AI assistant ─
  join: {
    meta: {
      title: "Get involved — lernapps.net",
      description: "How you can take part in lernapps.net: as a teacher, as a parent, as a learner, with an app of your own or on the platform itself. With a prompt for your AI assistant.",
    },
    hero: {
      headline: "Get involved",
      subtitle: "lernapps.net lives on people who build apps, and on people who use them and say thanks. Pick where you stand.",
    },
    askBox: {
      title: "Ask your AI assistant",
      intro: "Copy this text into your AI assistant. It reads lernapps.net and explains what the platform does for you.",
      copy: "Copy text",
      copied: "Copied",
    },
    personas: [
      {
        id: "teachers", icon: "📚", role: "If you teach",
        headline: "Use apps and tell us how it went.",
        text: "Use an app in class or when you cover a lesson. Afterwards you can say thanks with one click or give short feedback on whether it fitted. Tell your colleagues about it. And if an app is missing: tell us, or build it yourself.",
        cta: "Find apps", ctaHref: "/apps/en/",
        ask: "I teach and I am looking for digital learning material. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is, what the platform offers me as a teacher and how it keeps things safe. Also have a look at the catalogue: https://lernapps.net/apps/en/. Be honest about the limits.",
      },
      {
        id: "parents", icon: "🏠", role: "If you help a child learn",
        headline: "Practise together and say thanks.",
        text: "Look for an app on the topic your child needs help with. Did it help? A thank-you shows the person who built it that their work is worth it. And share the link with other parents, for example in the class group.",
        cta: "Find apps", ctaHref: "/apps/en/",
        ask: "I am a parent and I am looking for safe learning apps for my child. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is, what the platform offers me as a parent and how it keeps things safe. Also have a look at the catalogue: https://lernapps.net/apps/en/. Be honest about the limits.",
      },
      {
        id: "learners", icon: "🎒", role: "If you are learning yourself",
        headline: "Try things out instead of just watching.",
        text: "Find an app on your topic. You don't need an account, and nobody knows who you are. Is there none yet? Maybe you build one yourself, with your AI assistant.",
        cta: "Find apps", ctaHref: "/apps/en/",
        ask: "I am learning something right now and I am looking for something to try out. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me briefly what lernapps.net is, what it does for my learning and how it keeps things safe. Also have a look at the catalogue (https://lernapps.net/apps/en/): is there already something on my topic? If not: think with me about whether we can build a small app for it together.",
      },
      {
        id: "makers", icon: "🔧", role: "If you want to build an app",
        headline: "Build the app that is still missing.",
        text: "You bring the idea and the content, your AI assistant builds it with you. lernapps.net gives you foundations, tools and checks. Your app stays yours. Whoever uses it can say thanks, and you hear about it.",
        cta: "Build an app", ctaHref: "/apps/en/build/",
        secondary: "Already have an app? List it in a few hours", secondaryHref: "/apps/en/build/#eintragen",
        ask: "I like building small learning apps with AI help. Read https://lernapps.net/llms.txt and the pages it links to. Explain to me in plain words what lernapps.net is, what the platform offers people like me and what I get back when someone uses my app. Tell me honestly whether it is worth it for me.",
      },
      {
        id: "platform", icon: "🧩", role: "If you want to work on the platform",
        headline: "Make lernapps.net better.",
        text: "The platform is open: docs, tooling, catalog and this site are on GitHub. You can report bugs, improve texts, help build the tooling or think along about where it goes next.",
        cta: "How to contribute", ctaHref: "https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md",
        secondary: "How it is meant", secondaryHref: "/docs/en/",
        ask: "I would like to work on lernapps.net. Read https://lernapps.net/llms.txt, https://lernapps.net/docs/llms.txt and https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md. Explain to me in plain words how the platform is built, which repositories there are and how I can make a first small contribution. Be honest about what is still missing.",
      },
    ],
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
        { label: "What we try first", href: "/docs/en/platform-design/#2-design/d8-mvp.pdt42.md" },
        { label: "The whole platform design", href: "/docs/en/platform-design/" },
        { label: "The vision", href: "/docs/en/vision/" },
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
