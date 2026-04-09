# GreenWish Coursework Website

This project is a static multi-page website created for the `COMP1589 Network Technology` coursework. The site presents **GreenWish**, an environmental community organisation focused on clean-up campaigns, tree recovery, recycling awareness, volunteering, and local environmental action.

## Project Overview

The website was designed as a responsive promotional and informational platform for the GreenWish organisation. It combines visual storytelling, page-to-page navigation, and lightweight JavaScript interactions to make the coursework site feel more engaging and interactive.

The project includes:

- A homepage introducing the GreenWish mission
- An About page explaining the story, values, and team
- An Activities page showing environmental work and impact data
- An Events page presenting upcoming activities and an interactive charity game
- A Contact page with organisation details, headquarters information, and donation sections

## Features

- Responsive multi-page layout built with HTML and CSS
- Shared navigation and footer across all pages
- Custom typography using locally hosted fonts
- Reusable shared styling in `assets/css/common.css`
- Animated statistics using JavaScript and `IntersectionObserver`
- Email subscribe popup with client-side validation
- Mobile navigation toggle for smaller screens
- Interactive impact chart on the Activities page using [Chart.js](https://www.chartjs.org/)
- Canvas-based turtle charity mini-game on the Events page

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js CDN

## Project Structure

```text
cw/
|-- index.html
|-- about.html
|-- activities.html
|-- events.html
|-- contact.html
|-- _shot/
|-- readme.md
`-- assets/
    |-- css/
    |-- favicon/
    |-- fonts/
    |-- icons/
    |-- img/
    `-- js/
```

## Main Files

- `index.html`: landing page for the GreenWish website
- `about.html`: organisation story, values, statistics, and team content
- `activities.html`: environmental activities, impact section, and chart
- `events.html`: upcoming events, charity game, and event highlights
- `contact.html`: contact information, headquarters section, and donation area
- `_shot/`: exported desktop and mobile screenshots used for preview

## JavaScript Functionality

- `assets/js/popup.js`: controls the newsletter popup and mobile navigation menu
- `assets/js/increase_stats.js`: animates visible numeric statistics on scroll
- `assets/js/activities-chart.js`: renders the Activities page line chart
- `assets/js/charity_game.js`: powers the turtle survival charity mini-game

Note: `Chart.js` is loaded from a CDN on the Activities page, so an internet connection may be needed for the chart to display unless the library is hosted locally.

## How To Run

This is a static website, so no installation is required.

1. Download or open the project folder.
2. Open `index.html` in a web browser.
3. Use the navigation bar to move between the pages.

For best results, run it with a simple local server such as VS Code Live Server, because some browsers handle local file restrictions differently.

## Learning Goals Demonstrated

This coursework demonstrates:

- Multi-page website design
- Responsive layout techniques
- Consistent branding and navigation
- DOM manipulation with JavaScript
- Use of third-party libraries
- Interactive browser-based features for user engagement

## Author

Develop By `Dang Gia Hung`

Coursework project for `COMP1589 Network Technology`.
