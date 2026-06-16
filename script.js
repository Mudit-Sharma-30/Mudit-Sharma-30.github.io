/*
  Site interactions for the personal website.
  Update notes:
  - Future sections are enabled in the enabledFutureSections list below.
  - Publication and gallery filters depend on data-* attributes in index.html.
  - Counters use data-count values in the impact dashboard.
*/

const html = document.documentElement;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const navMoreMenus = document.querySelectorAll(".nav-more");
const themeToggle = document.querySelector("[data-theme-toggle]");
const yearSlot = document.querySelector("[data-year]");
const emailLink = document.querySelector("[data-email]");
const copyEmailButton = document.querySelector("[data-copy-email]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const parallaxTarget = document.querySelector("[data-parallax]");

/*
  FUTURE SECTION ENABLE LIST
  Uncomment one line to enable a future section. The full section markup lives
  in the template at the bottom of index.html.

  Enable these sections when you receive awards, grants, fellowships, invited
  talks, open-source contributions, research software, datasets, students
  mentored, professional roles, patents, media coverage, blog posts, public
  testimonials, or recurring questions.
*/
const enabledFutureSections = [
  // "awards",
  // "grants",
  // "invited-talks",
  // "conference-presentations",
  // "open-source",
  // "research-software",
  // "datasets",
  // "students-mentored",
  // "experience",
  // "patents",
  // "media",
  // "press",
  // "research-blog",
  // "technical-blog",
  // "testimonials",
  // "faq",
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)");

const setTheme = (theme) => {
  const resolvedTheme = theme === "auto"
    ? (preferredDark.matches ? "dark" : "light")
    : theme;

  html.dataset.theme = resolvedTheme;
  html.dataset.themeChoice = theme;
  localStorage.setItem("theme", theme);
};

const storedTheme = localStorage.getItem("theme") || "auto";
setTheme(storedTheme);

preferredDark.addEventListener("change", () => {
  if ((localStorage.getItem("theme") || "auto") === "auto") {
    setTheme("auto");
  }
});

themeToggle?.addEventListener("click", () => {
  const current = localStorage.getItem("theme") || "auto";
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
});

if (yearSlot) {
  yearSlot.textContent = new Date().getFullYear();
}

const syncHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 8);
};

const syncParallax = () => {
  if (!parallaxTarget || prefersReducedMotion) {
    return;
  }

  const offset = Math.min(window.scrollY * 0.08, 48);
  parallaxTarget.style.setProperty("--parallax-y", `${offset}px`);
};

syncHeader();
syncParallax();
window.addEventListener("scroll", () => {
  syncHeader();
  syncParallax();
}, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("open");
  document.body.classList.toggle("nav-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navLinks.classList.remove("open");
    document.body.classList.remove("nav-open");
    navMoreMenus.forEach((menu) => menu.removeAttribute("open"));
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Node)) {
    return;
  }

  navMoreMenus.forEach((menu) => {
    if (!menu.contains(target)) {
      menu.removeAttribute("open");
    }
  });
});

const renderFutureSections = () => {
  const root = document.querySelector("#future-sections-root");
  const template = document.querySelector("#future-sections-template");

  if (!root || !(template instanceof HTMLTemplateElement)) {
    return;
  }

  enabledFutureSections.forEach((id) => {
    const section = template.content.querySelector(`[data-future-section="${id}"]`);

    if (section) {
      root.append(section.cloneNode(true));
    }
  });
};

renderFutureSections();

const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const counters = document.querySelectorAll("[data-counter]");
const animateCounter = (counter) => {
  const end = Number(counter.dataset.count || 0);
  const duration = 1100;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(end * eased).toString();

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

if (prefersReducedMotion) {
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.count || "0";
  });
} else {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

const typingElement = document.querySelector("[data-typing]");

if (typingElement && !prefersReducedMotion) {
  const phrases = (typingElement.dataset.phrases || "").split("|").filter(Boolean);
  let phraseIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const type = () => {
    const phrase = phrases[phraseIndex] || "";
    typingElement.textContent = phrase.slice(0, characterIndex);

    if (!deleting && characterIndex < phrase.length) {
      characterIndex += 1;
      setTimeout(type, 70);
      return;
    }

    if (!deleting && characterIndex === phrase.length) {
      deleting = true;
      setTimeout(type, 1200);
      return;
    }

    if (deleting && characterIndex > 0) {
      characterIndex -= 1;
      setTimeout(type, 36);
      return;
    }

    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(type, 260);
  };

  type();
} else if (typingElement) {
  typingElement.textContent = (typingElement.dataset.phrases || "").split("|")[0] || "";
}

const publicationButtons = document.querySelectorAll("[data-publication-filter]");
const publicationYearButtons = document.querySelectorAll("[data-year-filter]");
const publications = document.querySelectorAll(".publication[data-status]");
let activePublicationStatus = "all";
let activePublicationYear = "all";

const applyPublicationFilters = () => {
  publications.forEach((publication) => {
    const matchesStatus = activePublicationStatus === "all" || publication.dataset.status === activePublicationStatus;
    const matchesYear = activePublicationYear === "all" || publication.dataset.year === activePublicationYear;
    publication.classList.toggle("is-hidden", !(matchesStatus && matchesYear));
  });
};

publicationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activePublicationStatus = button.dataset.publicationFilter || "all";
    publicationButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyPublicationFilters();
  });
});

publicationYearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activePublicationYear = button.dataset.yearFilter || "all";
    publicationYearButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyPublicationFilters();
  });
});

const galleryButtons = document.querySelectorAll("[data-gallery-filter]");
const galleryItems = document.querySelectorAll("[data-gallery]");

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.galleryFilter || "all";

    galleryButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.gallery === filter;
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll("[data-explore-card]").forEach((card) => {
  const slider = card.querySelector("[data-explore-slider]");
  const marker = card.querySelector("[data-explore-marker]");
  const output = card.querySelector("[data-explore-output]");
  const caption = card.querySelector("[data-explore-caption]");

  if (!(slider instanceof HTMLInputElement) || !(marker instanceof SVGCircleElement)) {
    return;
  }

  const updateExploreGraphic = () => {
    const exploitation = Number(slider.value);
    const t = exploitation / 100;
    const x = 76 + t * 208;
    const y = 82 - Math.sin(t * Math.PI) * 34;
    const exploration = 100 - exploitation;

    marker.setAttribute("cx", x.toFixed(1));
    marker.setAttribute("cy", y.toFixed(1));

    if (output) {
      output.textContent = `${exploration}% explore / ${exploitation}% exploit`;
    }

    if (caption) {
      if (exploitation < 35) {
        caption.textContent = "Exploration samples uncertain arms to learn what might be better.";
      } else if (exploitation > 65) {
        caption.textContent = "Exploitation favors the option that currently looks best.";
      } else {
        caption.textContent = "Balanced policies learn while still earning useful reward.";
      }
    }
  };

  slider.addEventListener("input", updateExploreGraphic);
  updateExploreGraphic();
});

document.querySelectorAll("[data-skill-module]").forEach((module) => {
  module.addEventListener("pointermove", (event) => {
    const rect = module.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    module.style.setProperty("--mx", `${x.toFixed(1)}%`);
    module.style.setProperty("--my", `${y.toFixed(1)}%`);
  });
});

const skillMeters = document.querySelectorAll(".skill-meter");

skillMeters.forEach((meter) => {
  meter.style.setProperty("--level", meter.dataset.level || "0");
});

if (prefersReducedMotion) {
  skillMeters.forEach((meter) => meter.classList.add("is-visible"));
} else {
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        meterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  skillMeters.forEach((meter) => meterObserver.observe(meter));
}

document.querySelectorAll(".skill-badge").forEach((badge) => {
  badge.addEventListener("click", () => {
    badge.classList.toggle("is-active");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navAnchors = [...document.querySelectorAll(".nav-links a")];

const activeNavObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const id = entry.target.getAttribute("id");
    navAnchors.forEach((anchor) => {
      anchor.classList.toggle("active", anchor.getAttribute("href") === `#${id}`);
    });
  });
}, { threshold: 0.32 });

sections.forEach((section) => activeNavObserver.observe(section));

copyEmailButton?.addEventListener("click", async () => {
  const email = emailLink?.textContent?.trim();

  if (!email) {
    return;
  }

  try {
    await navigator.clipboard.writeText(email);
    copyEmailButton.textContent = "Copied";
    setTimeout(() => {
      copyEmailButton.textContent = "Copy Email";
    }, 1600);
  } catch {
    window.location.href = `mailto:${email}`;
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const topic = formData.get("topic") || "Website inquiry";
  const message = formData.get("message") || "";
  const recipient = emailLink?.textContent?.trim() || "your.email@university.edu";
  const subject = encodeURIComponent(`[Website] ${topic}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

  if (formNote) {
    formNote.textContent = "Opening your email app with the message prepared.";
  }
});
