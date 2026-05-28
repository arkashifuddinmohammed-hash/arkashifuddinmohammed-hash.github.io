const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const dataBlock = script.slice(
  script.indexOf("const categoryProjects ="),
  script.indexOf("const deployAssetPools")
);
const categoryProjects = vm.runInNewContext(`${dataBlock}\ncategoryProjects;`, {});

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

const slug = (value) =>
  String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const layoutSets = {
  built: ["monolith", "split-tall", "editorial", "bento", "quiet", "scroll"],
  interiors: ["bento", "quiet", "split-tall", "scroll", "editorial", "monolith"],
  urban: ["map", "dossier", "scroll", "map", "bento", "editorial"],
  research: ["dossier", "quiet", "map", "editorial", "scroll", "bento"],
  visual: ["cinema", "editorial", "quiet", "cinema", "scroll", "bento"],
  concept: ["speculative", "quiet", "split-tall", "speculative", "editorial", "monolith"],
  live: ["site-log", "map", "dossier", "site-log", "bento", "scroll"],
  studio: ["manifesto", "bento", "quiet", "manifesto", "scroll", "editorial"]
};

const palettes = {
  built: ["#b08b5b", "#9d8f72", "#c0714d", "#a28460", "#8ca08b", "#c8a66c"],
  interiors: ["#c48f63", "#d7b89b", "#9b745b", "#b7a17a", "#c7a78d", "#8f765e"],
  urban: ["#7fa0a5", "#8caeb6", "#b7a35c", "#6f8f7e", "#a48866", "#78949f"],
  research: ["#c2a85d", "#8fa07b", "#8aa0b6", "#ba8f66", "#a3a58f", "#7e9a9a"],
  visual: ["#a979b5", "#8fa8d5", "#d08aa3", "#ad796a", "#9f8ed0", "#c1a05f"],
  concept: ["#d0a46b", "#b6a06d", "#88a3a0", "#c48c70", "#9d96c3", "#b48f6a"],
  live: ["#c09a58", "#8fa581", "#9bb0b0", "#bd8d68", "#b5a15f", "#9098b6"],
  studio: ["#d0a46b", "#a98f73", "#8aa0a0", "#bd8f9e", "#a6a47e", "#9e8bc0"]
};

const voices = {
  built: ["Built Space", "A measured architectural reading of mass, light, threshold, and occupation.", "The project is framed as a sequence of arrival, enclosure, daylight, and pause."],
  interiors: ["Interior Atmosphere", "A tactile interior page where surface, scale, warmth, and light hold the story.", "The room is treated through material memory, quiet lighting, and daily rituals."],
  urban: ["Urban System", "A mapped urban study where movement, edge, density, and civic patterns lead the composition.", "The city is read through networks, friction, public life, and layered infrastructure."],
  research: ["Research Dossier", "A study-led page that turns questions, field evidence, and analysis into spatial intelligence.", "The research moves from observation to framework to design consequence."],
  visual: ["Visual Narrative", "A cinematic page composed through frames, pacing, atmosphere, and visual sequence.", "The work is presented as a time-based spatial emotion, not a static image set."],
  concept: ["Speculative Concept", "A speculative study where geometry, fiction, and atmosphere test possible architecture.", "The concept suggests futures, systems, and formal experiments."],
  live: ["Live Project", "An active project page organized around stages, decisions, revisions, and site memory.", "The page keeps process visible as part of the final work."],
  studio: ["Answer & Co", "A studio page shaped around identity, method, visual language, and spatial storytelling.", "The studio work connects architecture, interiors, image-making, and narrative systems."]
};

const methods = {
  built: ["Context", "Mass", "Light"],
  interiors: ["Texture", "Tone", "Comfort"],
  urban: ["Flow", "Edge", "Network"],
  research: ["Question", "Evidence", "Synthesis"],
  visual: ["Frame", "Pace", "Atmosphere"],
  concept: ["Form", "Fiction", "Prototype"],
  live: ["Measure", "Revise", "Build"],
  studio: ["Intent", "Language", "Output"]
};

const imageName = {
  built: "built",
  interiors: "interior",
  urban: "urban",
  research: "research",
  visual: "visual",
  concept: "concept",
  live: "live",
  studio: "studio"
};

const cursorMarkup = `
  <div class="project-cursor" aria-hidden="true">
    <div class="project-cursor-shape"></div>
    <span class="project-cursor-icon"></span>
    <span class="project-cursor-label"></span>
  </div>
  <script src="project-cursor.js?v=project-cursor-1"></script>`;

function altImage(category, index, offset = 0) {
  return `../assets/images/${imageName[category]}${((index + offset) % 6) + 1}.jpg`;
}

function detailFor(project, index) {
  const words = project.desc.replace(/[.]/g, "").split(/\s+/).filter(Boolean);
  return {
    scale: ["Intimate", "Expanded", "Layered", "Vertical", "Civic", "Speculative"][index % 6],
    status: project.category === "live" ? "In progress" : index % 2 ? "Archive study" : "Portfolio study",
    focus: words.slice(Math.max(0, words.length - 4)).join(" ") || project.meta2
  };
}

function chips(project, detail) {
  return `<div class="art-meta-row"><span class="art-chip">${esc(project.meta1)}</span><span class="art-chip">${esc(project.meta2)}</span><span class="art-chip">${esc(detail.scale)}</span><span class="art-chip">${esc(detail.status)}</span></div>`;
}

function galleryImages(project, index) {
  const countPattern = {
    built: [5, 4, 6, 3, 7, 4],
    interiors: [6, 5, 4, 7, 3, 5],
    urban: [4, 6, 5, 7, 4, 3],
    research: [3, 5, 6, 4, 7, 5],
    visual: [8, 5, 7, 6, 4, 8],
    concept: [5, 3, 6, 4, 7, 5],
    live: [4, 7, 5, 6, 3, 5],
    studio: [6, 4, 5, 7, 3, 6]
  };
  const count = countPattern[project.category][index % 6];
  const images = [`../${project.image}`];

  for (let offset = 1; images.length < count; offset += 1) {
    images.push(altImage(project.category, index, offset));
  }

  return images;
}

function gallerySection(project, index) {
  const images = galleryImages(project, index);
  const layouts = ["mosaic", "stacked", "rail", "offset", "dense", "calm"];
  const galleryLayout = layouts[index % layouts.length];
  const plateTypes = ["major", "tall", "wide", "square", "detail", "wide", "tall", "square"];

  return `<section class="art-section project-gallery gallery-${galleryLayout}">
    <div class="gallery-intro">
      <span class="art-kicker">Image Set / ${images.length} Plates</span>
      <h2 class="art-title">A variable visual record.</h2>
      <p class="art-copy">This project carries ${images.length} image plates for now. The first plate holds the major image, and the following plates act as replaceable placeholders for final drawings, renders, site photos, process frames, or material studies.</p>
    </div>
    <div class="gallery-grid" aria-label="${esc(project.title)} image set">
      ${images.map((src, imageIndex) => `<figure class="gallery-plate plate-${plateTypes[imageIndex % plateTypes.length]}">
        <img src="${esc(src)}" alt="${esc(project.title)} image plate ${imageIndex + 1}">
        <figcaption>${String(imageIndex + 1).padStart(2, "0")} / ${imageIndex === 0 ? "Major image" : "Supporting image"}</figcaption>
      </figure>`).join("")}
    </div>
  </section>`;
}

function hero(project, index, layout, detail) {
  const voice = voices[project.category];
  const head = `<span class="art-kicker">${esc(voice[0])} / ${esc(project.meta2)}</span><h1 class="art-title">${esc(project.title)}</h1><p class="art-copy">${esc(project.desc)} ${esc(voice[1])}</p>${chips(project, detail)}`;
  const image = `../${project.image}`;
  const image2 = altImage(project.category, index, 1);
  const image3 = altImage(project.category, index, 2);
  const video = `<div class="art-media"><video autoplay muted loop playsinline poster="${esc(image)}"><source src="../${esc(project.video)}" type="video/mp4"></video></div>`;

  if (layout === "monolith") {
    return `<section class="project-artboard"><div class="art-heading">${head}</div>${video}<p class="art-copy">A full-width image field gives this project scale first, then lets the text behave like a captioned architectural spread.</p></section>`;
  }
  if (layout === "split-tall") {
    return `<section class="project-artboard"><div class="art-media"><img src="${esc(image)}" alt="${esc(project.title)} visual"></div><div class="art-heading">${head}</div><div class="art-note"><span class="art-index">0${index + 1}</span><p class="art-copy">The tall image format makes the page feel closer to a printed portfolio plate than a standard web template.</p></div></section>`;
  }
  if (layout === "editorial") {
    return `<section class="project-artboard"><span class="art-kicker">${esc(voice[0])}</span><div class="art-heading"><h1 class="art-title">${esc(project.title)}</h1><p class="art-copy">${esc(project.desc)} ${esc(voice[1])}</p>${chips(project, detail)}</div><div class="art-media"><img src="${esc(image)}" alt="${esc(project.title)} editorial frame"></div></section>`;
  }
  if (layout === "bento") {
    return `<section class="project-artboard"><div class="art-heading">${head}</div><div class="art-media primary"><img src="${esc(image)}" alt="${esc(project.title)} main image"></div><div class="art-note"><span class="art-index">${esc(project.meta2)}</span><p class="art-copy">A bento composition keeps fragments, details, and narrative notes visible at once.</p></div><div class="art-media"><img src="${esc(image2)}" alt="${esc(project.title)} secondary image"></div></section>`;
  }
  if (layout === "map") {
    return `<section class="project-artboard"><div class="art-heading">${head}</div><div class="map-field"><img src="${esc(image)}" alt="${esc(project.title)} mapped field"><span class="map-line"></span></div></section>`;
  }
  if (layout === "dossier") {
    return `<section class="project-artboard"><div class="art-heading">${head}</div><div class="dossier-stack"><div class="art-fact"><span>01 / Intent</span><p class="art-copy">${esc(project.desc)}</p></div><div class="art-fact"><span>02 / Method</span><p class="art-copy">${methods[project.category].join(", ")} become the page structure.</p></div><div class="art-media"><img src="${esc(image)}" alt="${esc(project.title)} dossier image"></div></div></section>`;
  }
  if (layout === "cinema") {
    return `<section class="project-artboard"><div class="art-heading">${head}</div><div class="film-row">${[image, image2, image3, image, image2].map((src, frame) => `<div class="art-media"><img src="${esc(src)}" alt="${esc(project.title)} frame ${frame + 1}"></div>`).join("")}</div></section>`;
  }
  if (layout === "speculative") {
    return `<section class="project-artboard"><div class="art-heading">${head}</div><div class="spec-orbit"><img src="${esc(image)}" alt="${esc(project.title)} speculative image"></div></section>`;
  }
  if (layout === "site-log") {
    return `<section class="project-artboard"><div class="art-heading">${head}</div><div class="log-rail"><div class="art-note"><span>01</span><p class="art-copy">Document conditions and constraints.</p></div><div class="art-note"><span>02</span><p class="art-copy">Translate needs into spatial decisions.</p></div><div class="art-note"><span>03</span><p class="art-copy">Refine drawings, material, and mood.</p></div><div class="art-media"><img src="${esc(image)}" alt="${esc(project.title)} live project"></div></div></section>`;
  }
  if (layout === "manifesto") {
    return `<section class="project-artboard"><div class="art-heading">${head}</div><div class="art-media"><img src="${esc(image)}" alt="${esc(project.title)} studio image"></div></section>`;
  }
  if (layout === "scroll") {
    return `<section class="project-artboard"><div class="art-heading">${head}</div><div class="scroll-column"><div class="art-media"><img src="${esc(image)}" alt="${esc(project.title)} image one"></div><div class="art-media"><img src="${esc(image2)}" alt="${esc(project.title)} image two"></div></div></section>`;
  }
  return `<section class="project-artboard"><div class="art-heading">${head}</div><div class="art-media"><img src="${esc(image)}" alt="${esc(project.title)} quiet composition"></div></section>`;
}

function methodSection(project) {
  return `<section class="art-section"><span class="art-kicker">Method</span><h2 class="art-title">Three moves shape the reading.</h2><div class="process-grid">${methods[project.category].map((move, index) => `<article class="process-item"><span>0${index + 1}</span><h3>${esc(move)}</h3><p>${esc(project.title)} uses this move to connect ${esc(project.meta2.toLowerCase())}, atmosphere, and spatial storytelling.</p></article>`).join("")}</div></section>`;
}

function coda(project, detail) {
  return `<section class="art-section light"><div class="project-coda"><div><span class="art-kicker">Reading</span><h2 class="art-title">What this page is trying to hold.</h2><p class="art-copy">${esc(voices[project.category][2])} ${esc(project.title)} keeps its focus on ${esc(detail.focus.toLowerCase())}, while the composition leaves room for drawings, site notes, and expanded documentation.</p></div><div class="project-coda-list"><div class="art-fact"><span>Category</span><strong>${esc(project.meta1)}</strong></div><div class="art-fact"><span>Focus</span><strong>${esc(project.meta2)}</strong></div><div class="art-fact"><span>Status</span><strong>${esc(detail.status)}</strong></div></div></div></section>`;
}

function page(project, index) {
  const detail = detailFor(project, index);
  const layout = layoutSets[project.category][index % layoutSets[project.category].length];
  const color = palettes[project.category][index % palettes[project.category].length];
  const titleSizes = [
    "clamp(4.6rem, 12vw, 11rem)",
    "clamp(5.2rem, 13vw, 12rem)",
    "clamp(3.8rem, 9vw, 8.8rem)",
    "clamp(4rem, 10vw, 9.4rem)",
    "clamp(5.8rem, 14vw, 13rem)",
    "clamp(3.4rem, 8vw, 7.6rem)"
  ];
  const style = `.project-page{--tone:${color};--tone-soft:${color}2e;--title-size:${titleSizes[index % 6]};--title-leading:${["0.82","0.78","0.9","0.86","0.76","0.94"][index % 6]};--glow-x:${[72,24,58,82,36,64][index % 6]}%;--glow-y:${[18,72,36,58,28,66][index % 6]}%;--grid-size:${[38,52,46,64,42,58][index % 6]}px;--tilt:${[-5,4,-2,7,-4,2][index % 6]}deg;--media-width:${[960,1180,840,1040,720,1120][index % 6]}px;}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(project.title)} | Kashif Mohammed</title>
  <meta name="description" content="${esc(project.desc)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cormorant+Garamond:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="project.css?v=project-layouts-3">
  <style>${style}</style>
</head>
<body class="project-page cat-${esc(project.category)} layout-${esc(layout)} project-${esc(slug(project.title))}">
  <nav class="project-nav" aria-label="Project navigation">
    <a class="brand" data-cursor="Home" href="../index.html#hero" aria-label="Kashif Mohammed home">KM</a>
    <div class="nav-actions">
      <a class="pill-link" href="../index.html#work" data-cursor="Archive">Archive</a>
      <a class="pill-link" href="../index.html#contact" data-cursor="Contact">Contact</a>
    </div>
  </nav>
  <main>
    ${hero(project, index, layout, detail)}
    ${methodSection(project)}
    ${gallerySection(project, index)}
    ${coda(project, detail)}
  </main>
  ${cursorMarkup}
</body>
</html>
`;
}

let count = 0;
for (const [category, projects] of Object.entries(categoryProjects)) {
  projects.forEach((project, index) => {
    const fullProject = { category, ...project };
    fs.writeFileSync(path.join(root, fullProject.link), page(fullProject, index));
    count += 1;
  });
}

fs.writeFileSync(
  path.join(root, "projects", "other-project-pages.html"),
  `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Project Archive | Kashif Mohammed</title>
  <link rel="stylesheet" href="project.css?v=project-layouts-3">
</head>
<body class="project-page cat-built layout-quiet">
  <nav class="project-nav" aria-label="Project navigation">
    <a class="brand" data-cursor="Home" href="../index.html#hero">KM</a>
    <div class="nav-actions">
      <a class="pill-link" data-cursor="Archive" href="../index.html#work">Archive</a>
      <a class="pill-link" data-cursor="Contact" href="../index.html#contact">Contact</a>
    </div>
  </nav>
  <main>
    <section class="project-artboard">
      <div class="art-heading">
        <span class="art-kicker">Built &amp; Unbuilt</span>
        <h1 class="art-title">More Works</h1>
        <p class="art-copy">A holding route for additional architecture, interiors, research, visual systems, and studio work.</p>
      </div>
      <div class="art-media"><img src="../assets/images/built1.jpg" alt="Project archive atmosphere"></div>
    </section>
    <section class="art-section project-gallery gallery-calm">
      <div class="gallery-intro">
        <span class="art-kicker">Image Set / 5 Plates</span>
        <h2 class="art-title">Archive placeholders.</h2>
        <p class="art-copy">This route keeps a small variable image set ready for future archive material.</p>
      </div>
      <div class="gallery-grid">
        <figure class="gallery-plate plate-major"><img src="../assets/images/built1.jpg" alt="Archive plate 1"><figcaption>01 / Major image</figcaption></figure>
        <figure class="gallery-plate plate-tall"><img src="../assets/images/built2.jpg" alt="Archive plate 2"><figcaption>02 / Supporting image</figcaption></figure>
        <figure class="gallery-plate plate-wide"><img src="../assets/images/built3.jpg" alt="Archive plate 3"><figcaption>03 / Supporting image</figcaption></figure>
        <figure class="gallery-plate plate-square"><img src="../assets/images/built4.jpg" alt="Archive plate 4"><figcaption>04 / Supporting image</figcaption></figure>
        <figure class="gallery-plate plate-detail"><img src="../assets/images/built5.jpg" alt="Archive plate 5"><figcaption>05 / Supporting image</figcaption></figure>
      </div>
    </section>
  </main>
  ${cursorMarkup}
</body>
</html>
`
);

console.log(`Generated ${count} project pages.`);
