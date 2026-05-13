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
  const errorPanel = document.getElementById("what-matters-form-error");
  const videoWrap = document.getElementById("what-matters-success-video-wrap");
  const successVideo = document.getElementById("what-matters-success-video");
  const resumeInput = document.getElementById("wm-resume");
  const resumeStatus = document.getElementById("wm-resume-status");
  const submitBtn = whatMattersForm.querySelector('button[type="submit"]');
  const prefersReducedMotion =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const phoneInput = document.getElementById("wm-phone");
  phoneInput?.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 15);
  });

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

    const releaseSubmit = () => {
      if (submitBtn) submitBtn.disabled = false;
    };

    const showFormAgain = () => {
      if (videoWrap) videoWrap.hidden = true;
      if (successVideo) {
        successVideo.pause();
        successVideo.currentTime = 0;
      }
      whatMattersForm.hidden = false;
      document.getElementById("wm-full-name")?.focus();
    };

    const playSuccessVideo = async () => {
      if (prefersReducedMotion || !videoWrap || !successVideo) {
        releaseSubmit();
        document.getElementById("wm-full-name")?.focus();
        return;
      }
      whatMattersForm.hidden = true;
      videoWrap.hidden = false;
      successVideo.currentTime = 0;
      const onEnded = () => {
        successVideo.removeEventListener("ended", onEnded);
        showFormAgain();
        releaseSubmit();
      };
      successVideo.addEventListener("ended", onEnded);
      try {
        await successVideo.play();
      } catch {
        successVideo.removeEventListener("ended", onEnded);
        showFormAgain();
        releaseSubmit();
      }
    };

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
      await playSuccessVideo();
    } catch {
      if (errorPanel) {
        errorPanel.textContent =
          "Something went wrong. Please try again in a moment, or reach out through the Contact page.";
        errorPanel.hidden = false;
      }
      releaseSubmit();
    }
  });
}
