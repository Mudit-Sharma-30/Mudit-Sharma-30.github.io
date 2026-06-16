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
const parallaxTarget = document.querySelector("[data-parallax]");
const randomQuote = document.querySelector("[data-random-quote]");
const randomQuoteButton = document.querySelector("[data-random-quote-button]");
const scrollProgress = document.querySelector("[data-scroll-progress]");

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

if (randomQuote) {
  const quotes = (randomQuote.dataset.quotes || "")
    .split("|")
    .map((quote) => quote.trim())
    .filter(Boolean);

  const showRandomQuote = () => {
    if (!quotes.length) {
      return;
    }

    const current = randomQuote.textContent?.trim();
    const options = quotes.filter((quote) => quote !== current);
    const pool = options.length ? options : quotes;
    const next = pool[Math.floor(Math.random() * pool.length)];
    randomQuote.textContent = next;
  };

  showRandomQuote();
  randomQuoteButton?.addEventListener("click", showRandomQuote);
}

const syncHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 8);
};

const syncScrollProgress = () => {
  if (!scrollProgress) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  scrollProgress.style.transform = `scaleX(${progress.toFixed(4)})`;
};

const syncParallax = () => {
  if (!parallaxTarget || prefersReducedMotion) {
    return;
  }

  const offset = Math.min(window.scrollY * 0.08, 48);
  parallaxTarget.style.setProperty("--parallax-y", `${offset}px`);
};

const localNavItems = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'))
  .map((link) => {
    const section = document.getElementById(link.getAttribute("href").slice(1));
    return section ? { link, section } : null;
  })
  .filter(Boolean);

const syncActiveNav = () => {
  if (!localNavItems.length) {
    return;
  }

  const activationLine = Math.min(window.innerHeight * 0.38, 320);
  let activeItem = null;

  localNavItems.forEach((item) => {
    const rect = item.section.getBoundingClientRect();

    if (rect.top <= activationLine && rect.bottom > 96) {
      activeItem = item;
    }
  });

  localNavItems.forEach((item) => {
    const isActive = Boolean(activeItem && item === activeItem);
    item.link.classList.toggle("active", isActive);

    if (isActive) {
      item.link.setAttribute("aria-current", "true");
    } else {
      item.link.removeAttribute("aria-current");
    }
  });
};

syncHeader();
syncScrollProgress();
syncParallax();
syncActiveNav();
window.addEventListener("scroll", () => {
  syncHeader();
  syncScrollProgress();
  syncParallax();
  syncActiveNav();
}, { passive: true });

window.addEventListener("resize", () => {
  syncScrollProgress();
  syncActiveNav();
});

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

revealElements.forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${(index % 7) * 45}ms`);
});

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

const spotlightCards = document.querySelectorAll([
  "[data-skill-module]",
  ".visual-card",
  ".publication",
  ".course-column",
  ".collaborator-card",
  ".group-card",
  ".contact-card",
  ".research-detail-card",
  ".early-work-card",
  ".archive-item",
  ".gallery-preview-card",
].join(","));

spotlightCards.forEach((module) => {
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

document.querySelectorAll("[data-mab-game]").forEach((game) => {
  const roundSlot = game.querySelector("[data-mab-round]");
  const rewardSlot = game.querySelector("[data-mab-reward]");
  const regretSlot = game.querySelector("[data-mab-regret]");
  const bestGuessSlot = game.querySelector("[data-mab-best-guess]");
  const messageSlot = game.querySelector("[data-mab-message]");
  const historyList = game.querySelector("[data-mab-history]");
  const revealBox = game.querySelector("[data-mab-reveal]");
  const probabilityBox = game.querySelector("[data-mab-probabilities]");
  const helperButton = game.querySelector("[data-mab-helper]");
  const resetButton = game.querySelector("[data-mab-reset]");
  const armButtons = [...game.querySelectorAll("[data-arm]")];
  const armNames = ["Arm A", "Arm B", "Arm C", "Arm D"];
  const maxRounds = 30;
  const baseProbabilities = [0.18, 0.36, 0.58, 0.76];
  const messages = {
    reward: [
      "Reward. The arm is trying to look employable.",
      "Insight point collected. A tiny theorem somewhere stood up straighter.",
      "Reward landed. Exploitation is nodding respectfully."
    ],
    miss: [
      "No reward. Still data. The spreadsheet accepts all feelings.",
      "No point this time. Exploration sent a receipt.",
      "Missed reward. The confidence interval remains mysterious."
    ],
    over: "Budget spent. Time to reveal which arm was secretly carrying the snacks."
  };

  let probabilities = [];
  let counts = [];
  let rewards = [];
  let totalReward = 0;
  let totalRegret = 0;
  let round = 0;
  let history = [];

  const shuffle = (items) => {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
  };

  const bestArmIndex = () => probabilities.indexOf(Math.max(...probabilities));

  const bestGuessIndex = () => {
    let guess = -1;
    let bestAverage = -1;

    counts.forEach((count, index) => {
      if (!count) {
        return;
      }

      const average = rewards[index] / count;

      if (average > bestAverage) {
        bestAverage = average;
        guess = index;
      }
    });

    return guess;
  };

  const setMessage = (reward) => {
    if (!messageSlot) {
      return;
    }

    const pool = reward ? messages.reward : messages.miss;
    messageSlot.textContent = pool[Math.floor(Math.random() * pool.length)];
  };

  const renderHistory = () => {
    if (!historyList) {
      return;
    }

    historyList.innerHTML = "";

    if (!history.length) {
      const item = document.createElement("li");
      item.textContent = "No pulls yet. The arms are pretending to be mysterious.";
      historyList.append(item);
      return;
    }

    history.slice(-6).reverse().forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = `Pull ${entry.round}: ${entry.arm} gave ${entry.reward ? "1 insight point" : "0 points"}.`;
      historyList.append(item);
    });
  };

  const renderReveal = () => {
    if (!(revealBox instanceof HTMLElement) || !probabilityBox) {
      return;
    }

    probabilityBox.innerHTML = "";
    probabilities.forEach((probability, index) => {
      const item = document.createElement("span");
      item.textContent = `${armNames[index]}: ${(probability * 100).toFixed(0)}%`;
      item.className = index === bestArmIndex() ? "best-probability" : "";
      probabilityBox.append(item);
    });

    revealBox.hidden = false;
  };

  const render = () => {
    if (roundSlot) {
      roundSlot.textContent = `${round} / ${maxRounds}`;
    }

    if (rewardSlot) {
      rewardSlot.textContent = String(totalReward);
    }

    if (regretSlot) {
      regretSlot.textContent = totalRegret.toFixed(2);
    }

    const guess = bestGuessIndex();
    if (bestGuessSlot) {
      bestGuessSlot.textContent = guess >= 0 ? armNames[guess] : "None yet";
    }

    armButtons.forEach((button) => {
      const index = Number(button.dataset.arm);
      const averageSlot = game.querySelector(`[data-arm-average="${index}"]`);
      const countSlot = game.querySelector(`[data-arm-count="${index}"]`);
      const count = counts[index];
      const average = count ? rewards[index] / count : 0;

      button.classList.toggle("is-best-guess", guess === index);
      button.disabled = round >= maxRounds;

      if (averageSlot) {
        averageSlot.textContent = count ? average.toFixed(2) : "?";
      }

      if (countSlot) {
        countSlot.textContent = `${count} pull${count === 1 ? "" : "s"}`;
      }
    });

    if (helperButton instanceof HTMLButtonElement) {
      helperButton.disabled = round >= maxRounds;
    }

    renderHistory();

    if (round >= maxRounds) {
      if (messageSlot) {
        const best = bestArmIndex();
        const guessText = guess === best ? "You found the best-looking arm." : `The best hidden arm was ${armNames[best]}.`;
        messageSlot.textContent = `${messages.over} ${guessText}`;
      }

      renderReveal();
    }
  };

  const pullArm = (index, source = "you") => {
    if (round >= maxRounds || Number.isNaN(index)) {
      return;
    }

    const bestProbability = Math.max(...probabilities);
    const reward = Math.random() < probabilities[index] ? 1 : 0;
    round += 1;
    counts[index] += 1;
    rewards[index] += reward;
    totalReward += reward;
    totalRegret += bestProbability - probabilities[index];

    armButtons.forEach((button) => button.classList.toggle("is-last", Number(button.dataset.arm) === index));

    history.push({
      arm: `${armNames[index]}${source === "helper" ? " via helper" : ""}`,
      reward,
      round
    });

    setMessage(Boolean(reward));
    render();
  };

  const helperPick = () => {
    const unexplored = counts
      .map((count, index) => ({ count, index }))
      .filter((item) => item.count === 0)
      .map((item) => item.index);

    if (unexplored.length) {
      return unexplored[Math.floor(Math.random() * unexplored.length)];
    }

    if (Math.random() < 0.22) {
      return Math.floor(Math.random() * armButtons.length);
    }

    return bestGuessIndex();
  };

  const reset = () => {
    probabilities = shuffle(baseProbabilities);
    counts = Array(armButtons.length).fill(0);
    rewards = Array(armButtons.length).fill(0);
    totalReward = 0;
    totalRegret = 0;
    round = 0;
    history = [];

    armButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("is-last", "is-best-guess");
    });

    if (revealBox instanceof HTMLElement) {
      revealBox.hidden = true;
    }

    if (probabilityBox) {
      probabilityBox.innerHTML = "";
    }

    if (messageSlot) {
      messageSlot.textContent = "New game. The arms have shuffled their secrets.";
    }

    render();
  };

  armButtons.forEach((button) => {
    button.addEventListener("click", () => pullArm(Number(button.dataset.arm)));
  });

  helperButton?.addEventListener("click", () => pullArm(helperPick(), "helper"));
  resetButton?.addEventListener("click", reset);
  reset();
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
