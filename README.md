# Premium Personal Website

This is a static personal website with two profile modes:

- `index.html`: current early-stage PhD profile for a first-year/early PhD student without formal publications yet.
- `future-profile.html`: fuller long-term profile to use later when you have formal publications, more collaborators, awards, and mature projects.

Open `index.html` directly in a browser for the current version.

## Main Files

- `index.html`: homepage sections, content, SEO metadata, and future-section templates.
- `future-profile.html`: preserved full-profile version for later career stages.
- `gallery.html`: dedicated gallery page for conferences, research activities, travel, personal interests, and lab events.
- `cv.html`: printable academic and professional CV.
- `styles.css`: light/dark themes, responsive layout, animations, and print styles.
- `script.js`: theme switching, typing effect, counters, filters, reveal animations, and contact form.
- `assets/research-workspace.png`: generated hero/gallery image.
- `assets/profile-photo.svg`: replace with your professional headshot when ready.
- `assets/collaborator-placeholder.svg`: replace with collaborator photos where appropriate.

## Personalize First

- Replace `Your Name`, `YN`, department, university, advisor, location, and email.
- Replace `assets/profile-photo.svg` with a real professional headshot.
- Update social links: Google Scholar, ORCID, GitHub, LinkedIn, and personal domain.
- Keep `index.html` honest for your current stage: first-year completed, no formal publications yet, archived drafts/notes, coursework, and current research ideas.
- Update the visual Research Interests section in `index.html` if your bandits,
  online learning, preference learning, or learning theory focus changes.
- Update research themes, current projects, publications, coursework, teaching, collaborators, skills, gallery, and contact form recipient.
- Keep the homepage focused on academic/professional identity. Put visual life updates and photo-heavy content in `gallery.html`.
- Update `cv.html` with your actual CV entries.

## Switching Later

When you have enough formal content, you can switch to the full version:

1. Keep a backup of the current `index.html`.
2. Rename `future-profile.html` to `index.html`.
3. Update the publications, collaborators, awards, projects, and metrics with real information.

Until then, the current `index.html` is intentionally modest. It uses sections like
`Current Work`, `Archive and Drafts`, and `Coursework and Preparation` instead of
overstating publications or impact.

## Enable Future Sections

Future sections are already designed and stored in the template at the bottom of
`index.html`. They are disabled by default to keep the live site focused.

To enable one, open `script.js` and uncomment a single line in
`enabledFutureSections`.

Example:

```js
const enabledFutureSections = [
  "awards",
  // "grants",
];
```

Available future section keys:

- `awards`
- `grants`
- `invited-talks`
- `conference-presentations`
- `open-source`
- `research-software`
- `datasets`
- `students-mentored`
- `experience`
- `patents`
- `media`
- `press`
- `research-blog`
- `technical-blog`
- `testimonials`
- `faq`

Enable these sections when you receive awards, grants, fellowships, invited
talks, open-source contributions, media coverage, students to mentor, patents,
professional roles, blog posts, or testimonials.

## Maintenance Pattern

Each major section in `index.html` has documentation comments explaining:

- what the section is for
- what content to update
- how to add new entries
- when future sections should be enabled

Most repeated content uses simple cards. To add a new item, copy an existing
card, update the text and links, and keep the same class names so styling and
animations continue to work.

The Research Interests visualizations are inline SVGs in `index.html`, styled
in `styles.css`, with the exploration/exploitation slider handled in `script.js`.
They do not require external libraries.

The Skills section is a futuristic toolkit dashboard. Update skill names in
`index.html`, change each `.skill-meter` `data-level` value to adjust the
animated capability bars, and keep the `data-skill-module` attribute on module
cards for the hover-light interaction.

## Notes

- The contact form is static. It opens the visitor's email app using `mailto:`.
- The site respects reduced-motion preferences.
- Dark mode is saved in the browser with `localStorage`.
- No build tools are required.
