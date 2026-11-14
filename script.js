(function () {
  document.documentElement.classList.add("js");

  // Mobile menu
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mainNav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  // Highlight the nav link for the section in view
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          links.forEach(function (a) { a.classList.remove("active"); });
          map[entry.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });

    // Reveal cards as they scroll into view
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.transitionDelay = Math.min(i * 60, 360) + "ms";
        reveal.observe(child);
      });
    });
  } else {
    document.querySelectorAll("[data-reveal-group] > *").forEach(function (el) { el.classList.add("in"); });
  }

  // Contact form: opens the visitor's email app with the message filled in.
  // To send from the site itself, replace this with a fetch() to a form service or your own server.
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;
    var ok = true;
    [name, email, message].forEach(function (f) { f.removeAttribute("aria-invalid"); });
    if (!name.value.trim()) { name.setAttribute("aria-invalid", "true"); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.setAttribute("aria-invalid", "true"); ok = false; }
    if (!message.value.trim()) { message.setAttribute("aria-invalid", "true"); ok = false; }
    if (!ok) {
      status.className = "form-status error";
      status.textContent = "Please enter your name, a valid email address and a message.";
      return;
    }
    var subject = "Enquiry: " + form.elements.service.value;
    var body = message.value.trim() + "\n\nFrom: " + name.value.trim() + " (" + email.value.trim() + ")";
    status.className = "form-status";
    status.textContent = "Opening your email app. If nothing opens, write to info@rskassociates.lk.";
    window.location.href = "mailto:info@rskassociates.lk?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
