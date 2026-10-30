/* ============================================================
   nav.js — the navigation is written once, in nav.html, and this
   script puts it into every page. That is the DRY part of the site:
   adding a page means editing nav.html only.

   A small built-in copy is painted immediately so the header is
   never empty while the fragment is being fetched; the fragment
   replaces it as soon as it arrives, and marks the current page.
   ============================================================ */

(function () {
  "use strict";

  var slot = document.querySelector("[data-nav]");
  if (!slot) return;

  var LINKS = [
    ["index.html", "Home"],
    ["quotes.html", "Quotes"],
    ["project.html", "Ideas"],
    ["machine.html", "Machine"],
    ["about.html", "About"]
  ];

  function currentPage() {
    var file = window.location.pathname.split("/").pop();
    return file === "" ? "index.html" : file;
  }

  function markCurrent() {
    var here = currentPage();
    slot.querySelectorAll("a[href]").forEach(function (link) {
      if (link.getAttribute("href") === here) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function paintFallback() {
    slot.innerHTML =
      '<nav class="site-nav" aria-label="Main"><ul>' +
      LINKS.map(function (pair) {
        return '<li><a href="' + pair[0] + '">' + pair[1] + "</a></li>";
      }).join("") +
      "</ul></nav>";
    markCurrent();
    slot.removeAttribute("aria-busy");
  }

  // Show real links at once; the shared fragment is still the source of truth.
  paintFallback();

  fetch("nav.html")
    .then(function (response) {
      if (!response.ok) throw new Error("nav.html: HTTP " + response.status);
      return response.text();
    })
    .then(function (html) {
      slot.innerHTML = html;
      markCurrent();
      slot.removeAttribute("aria-busy");
    })
    .catch(function () {
      // nav.html could not be fetched (for example when the files are opened
      // directly from disk instead of through a server). The fallback is
      // already on screen, so there is nothing more to do.
    });
})();
