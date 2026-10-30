/* ============================================================
   quotes.js — the random-quote hero.
   The quotes are read from the list that is already on the page,
   so adding a quote is one edit in quotes.html and nothing here.
   ============================================================ */

(function () {
  "use strict";

  var list = document.querySelector(".quote-list");
  var text = document.getElementById("quote-text");
  var author = document.getElementById("quote-author");
  var button = document.getElementById("new-quote");

  if (!list || !text || !author || !button) return;

  var quotes = Array.prototype.map.call(list.querySelectorAll("li"), function (item) {
    var quote = item.querySelector("blockquote p");
    var cite = item.querySelector("cite");
    return {
      text: quote ? quote.textContent.trim() : "",
      author: cite ? cite.textContent.trim() : ""
    };
  }).filter(function (quote) {
    return quote.text;
  });

  var lastIndex = -1;

  function showRandom() {
    if (!quotes.length) return;
    var index = Math.floor(Math.random() * quotes.length);
    if (quotes.length > 1 && index === lastIndex) {
      index = (index + 1) % quotes.length;
    }
    lastIndex = index;
    text.textContent = quotes[index].text;
    author.textContent = quotes[index].author;
  }

  // Start on a random quote, then let the visitor ask for another.
  showRandom();
  button.addEventListener("click", showRandom);
})();
