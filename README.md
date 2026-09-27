# Mudit Sharma Personal Website

This is a static academic/professional website for Mudit Sharma.

## Main Files

- `index.html`: main homepage using the fuller long-term profile layout.
- `research-interests.html`: detailed Research Interest page for Multi-Armed Bandits, Dueling Bandits, Online Learning, Preference Learning, Nonconvex Optimization, continuous action spaces, Learning Theory, and active directions.
- `mab-game.html`: interactive Multi-Armed Bandit game that explains exploration, exploitation, reward, and regret.
- `gallery.html`: separate gallery page for conferences, research activities, travel, personal interests, and lab events.
- `cv.html`: printable CV page.
- `future-profile.html`: mirror/reference copy of the current full-profile homepage.
- `styles.css`: responsive layout, dark/light themes, animations, quote strip, and page styling.
- `script.js`: theme switching, random quote generator, typing effect, filters, counters, reveal animations, copy-email behavior, and the MAB game.

## Update Later

- Core identity, education, research interests, publication, teaching, contact links, and resume-backed details are already filled from `Resume_Mudit_Sharma.pdf`.
- Keep active portraits in `assets/profile/`; the homepage currently uses separate light- and dark-theme images.
- Add future papers, talks, awards, datasets, and new collaborators as they become public.
- Edit the random quotes in `index.html` inside the `data-quotes` attribute.
- Add more detailed research notes and active directions in `research-interests.html`.
- Tune the hidden reward probabilities and game copy in `script.js` and `mab-game.html`.
- Add more real photos and captions in `gallery.html`.

## Current Structure

The homepage order follows the main navigation:

1. About
2. Area of Research
3. Publications
4. Coursework
5. Teaching
6. Contact

Extra pages and secondary sections live in the `More` menu.

## Notes

- No build tools are required.
- Open `index.html` directly in a browser.
- The contact section is static and lists email, lab address, LinkedIn, GitHub, Google Scholar, ORCID, and collaboration topics.
- Dark mode is saved in the browser with `localStorage`.
