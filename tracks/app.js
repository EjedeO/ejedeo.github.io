// No framework, no build step. Data lives in data/<slug>.json so adding a city
// is one file plus one line in CITIES.
const CITIES = [
  { slug: "spring-tx", name: "Spring, TX", region: "Greater Houston" },
  { slug: "santa-monica-ca", name: "Santa Monica, CA", region: "Los Angeles County" },
  { slug: "eugene-or", name: "Eugene, OR", region: "Willamette Valley" }
];

const ACCESS_LABEL = {
  public: "Open to the public",
  restricted: "Restricted hours",
  unconfirmed: "Access unconfirmed",
  closed: "Not open for running"
};

function mapsUrl(name, address) {
  return "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(address && address.length > 12 ? address : name);
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function renderCities(mount) {
  const list = el("ul", "cities");
  CITIES.forEach(function (c) {
    const a = el("a", "city");
    a.href = "city.html?city=" + encodeURIComponent(c.slug);
    a.appendChild(el("h2", null, c.name));
    a.appendChild(el("p", null, c.region));
    const li = document.createElement("li");
    li.appendChild(a);
    list.appendChild(li);
  });
  mount.appendChild(list);
}

function renderTrack(track) {
  const access = track.access || "unconfirmed";
  const card = el("div", "track " + access);

  const badge = el("span", "badge " + access, ACCESS_LABEL[access] || access);
  card.appendChild(badge);
  card.appendChild(el("h3", null, track.name));

  const bits = [];
  if (track.address) bits.push(track.address);
  if (track.length_m) bits.push(track.length_m + "m");
  if (track.surface && track.surface !== "unknown") bits.push(track.surface);
  if (bits.length) card.appendChild(el("p", "meta", bits.join(" · ")));

  if (track.hours) card.appendChild(el("p", "hours", "Hours: " + track.hours));
  if (track.note) card.appendChild(el("p", "note", track.note));

  const link = el("a", "maps", "Open in Maps");
  link.href = mapsUrl(track.name, track.address || "");
  link.target = "_blank";
  link.rel = "noopener";
  card.appendChild(link);
  return card;
}

function renderCity(mount, slug) {
  fetch("data/" + slug + ".json")
    .then(function (r) {
      if (!r.ok) throw new Error("not found");
      return r.json();
    })
    .then(function (data) {
      document.title = data.city + " running tracks";
      document.getElementById("city-name").textContent = data.city;
      document.getElementById("city-region").textContent = data.region || "";
      if (data.summary) {
        const s = el("p", "summary", data.summary);
        mount.appendChild(s);
      }
      // Public first, then restricted, unconfirmed, closed.
      const order = { public: 0, restricted: 1, unconfirmed: 2, closed: 3 };
      data.tracks
        .slice()
        .sort(function (a, b) { return (order[a.access] ?? 9) - (order[b.access] ?? 9); })
        .forEach(function (t) { mount.appendChild(renderTrack(t)); });
    })
    .catch(function () {
      mount.appendChild(el("p", "summary",
        "Could not load that city. It may not exist yet — go back and pick another."));
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const mount = document.getElementById("content");
  if (!mount) return;
  if (mount.dataset.page === "city") {
    const slug = new URLSearchParams(location.search).get("city");
    if (!slug) { location.replace("index.html"); return; }
    renderCity(mount, slug);
  } else {
    renderCities(mount);
  }
});
