const toggleButton = document.querySelector(".mobile-toggle");
const navMenu = document.querySelector(".primary-nav");

if (toggleButton && navMenu) {
  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle("is-open");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 860) {
        navMenu.classList.remove("is-open");
        toggleButton.setAttribute("aria-expanded", "false");
      }
    });
  });
}

if (document.body.classList.contains("page-about")) {
  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  });

  const rotatorText = document.getElementById("why-value-rotator-text");
  if (rotatorText) {
    const phrases = [
      "Flexible",
      "Support",
      "Responsible",
      "Reliable",
      "Experience you can count on",
    ];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rotatorText.textContent = phrases.join(" · ");
      rotatorText.classList.add("why-value-rotator__text--static");
    } else {
      let idx = 0;
      window.setInterval(() => {
        idx = (idx + 1) % phrases.length;
        rotatorText.textContent = phrases[idx];
        rotatorText.classList.remove("why-value-rotator__text--pulse");
        void rotatorText.offsetWidth;
        rotatorText.classList.add("why-value-rotator__text--pulse");
      }, 3000);
    }
  }
}

const servicesLightbox = document.getElementById("services-showcase-lightbox");
const servicesLightboxOpen = document.getElementById("services-showcase-open");

if (servicesLightbox && servicesLightboxOpen) {
  const dismissTargets = servicesLightbox.querySelectorAll("[data-lightbox-dismiss]");
  const closeButton = servicesLightbox.querySelector(".image-lightbox-close");
  let lastFocused = null;

  const setOpen = (open) => {
    servicesLightbox.classList.toggle("is-open", open);
    servicesLightbox.hidden = !open;
    servicesLightboxOpen.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      lastFocused = document.activeElement;
      if (closeButton) {
        closeButton.focus();
      }
    } else if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  servicesLightboxOpen.addEventListener("click", () => {
    setOpen(true);
  });

  dismissTargets.forEach((el) => {
    el.addEventListener("click", () => {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && servicesLightbox.classList.contains("is-open")) {
      setOpen(false);
    }
  });
}

const whatMattersForm = document.getElementById("what-matters-form-element");
if (whatMattersForm) {
  const successPanel = document.getElementById("what-matters-form-success");
  const errorPanel = document.getElementById("what-matters-form-error");
  const submitAnotherBtn = document.getElementById("what-matters-submit-another");
  const resumeInput = document.getElementById("wm-resume");
  const resumeStatus = document.getElementById("wm-resume-status");
  const submitBtn = whatMattersForm.querySelector('button[type="submit"]');

  const resumeEmptyLabel = "No file selected yet. Choose a PDF or Word document above.";

  const syncResumeStatus = () => {
    if (!resumeStatus || !resumeInput) return;
    const file = resumeInput.files && resumeInput.files[0];
    if (file) {
      resumeStatus.textContent = `Selected: ${file.name}`;
      resumeStatus.classList.add("what-matters-form-file-status--active");
    } else {
      resumeStatus.textContent = resumeEmptyLabel;
      resumeStatus.classList.remove("what-matters-form-file-status--active");
    }
  };

  resumeInput?.addEventListener("change", syncResumeStatus);
  syncResumeStatus();

  whatMattersForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (errorPanel) {
      errorPanel.hidden = true;
      errorPanel.textContent = "";
    }

    const action = whatMattersForm.getAttribute("action") || "/";
    const formData = new FormData(whatMattersForm);
    if (!formData.get("form-name")) {
      formData.append("form-name", "what-matters");
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      whatMattersForm.reset();
      syncResumeStatus();
      whatMattersForm.hidden = true;
      if (successPanel) {
        successPanel.hidden = false;
        successPanel.focus();
      }
    } catch {
      if (errorPanel) {
        errorPanel.textContent =
          "Something went wrong. Please try again in a moment, or reach out through the Contact page.";
        errorPanel.hidden = false;
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  submitAnotherBtn?.addEventListener("click", () => {
    if (successPanel) successPanel.hidden = true;
    whatMattersForm.hidden = false;
    if (errorPanel) {
      errorPanel.hidden = true;
      errorPanel.textContent = "";
    }
    document.getElementById("wm-full-name")?.focus();
  });
}
