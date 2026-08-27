"use client";

import { useEffect } from "react";

export function useSiteEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const $ = (sel, root = document) => root.querySelector(sel);
    const cleanups = [];

    function toast(message) {
      let el = $(".toast");
      if (!el) {
        el = document.createElement("div");
        el.className = "toast";
        document.body.appendChild(el);
      }
      el.textContent = message;
      el.classList.add("is-on");
      clearTimeout(toast._t);
      toast._t = setTimeout(() => el.classList.remove("is-on"), 1800);
    }

    function revealOnScroll() {
      const nodes = $$(".v2-rise");
      if (!nodes.length) return;
      if (reduced || !("IntersectionObserver" in window)) {
        nodes.forEach((n) => n.classList.add("is-visible"));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      nodes.forEach((n) => io.observe(n));
      cleanups.push(() => io.disconnect());
    }

    function hideNavOnScroll() {
      const nav = $(".v2-nav");
      if (!nav) return;
      let last = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        if (y > last && y > 80) nav.classList.add("is-hidden");
        else nav.classList.remove("is-hidden");
        last = y;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    function rotateHeroNumber() {
      const root = $(".v2-rotnum");
      if (!root || reduced) return;
      const values = ["$10K", "$30K", "$50K"];
      let i = 0;
      const id = setInterval(() => {
        const outgoing = root.querySelector(".v2-rotnum-now, .v2-rotnum-in");
        if (!outgoing) return;
        outgoing.classList.remove("v2-rotnum-now", "v2-rotnum-in");
        outgoing.classList.add("v2-rotnum-out");
        i = (i + 1) % values.length;
        const incoming = document.createElement("span");
        incoming.className = "v2-rotnum-in";
        incoming.textContent = values[i];
        root.appendChild(incoming);
        incoming.addEventListener("animationend", () => {
          outgoing.remove();
          incoming.classList.remove("v2-rotnum-in");
          incoming.classList.add("v2-rotnum-now");
        });
      }, 2200);
      cleanups.push(() => clearInterval(id));
    }

    function faqs() {
      const onClick = (item) => {
        const btn = item.querySelector("button");
        const panel = item.querySelector('[id$="-panel"]');
        if (!btn || !panel) return;
        const open = item.getAttribute("data-open") === "true";
        $$(".v2-faq-item").forEach((other) => {
          other.setAttribute("data-open", "false");
          const b = other.querySelector("button");
          const p = other.querySelector('[id$="-panel"]');
          if (b) b.setAttribute("aria-expanded", "false");
          if (p) p.hidden = true;
        });
        if (!open) {
          item.setAttribute("data-open", "true");
          btn.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
      };
      const items = $$(".v2-faq-item");
      const handlers = [];
      items.forEach((item) => {
        const btn = item.querySelector("button");
        if (!btn) return;
        const fn = () => onClick(item);
        btn.addEventListener("click", fn);
        handlers.push([btn, fn]);
      });
      cleanups.push(() => handlers.forEach(([btn, fn]) => btn.removeEventListener("click", fn)));
    }

    function mobileMenu() {
      const toggle = $('[aria-controls="v2-mobile-menu"]');
      if (!toggle) return;
      let drawer = $("#v2-mobile-menu");
      if (!drawer) {
        drawer = document.createElement("div");
        drawer.id = "v2-mobile-menu";
        drawer.className = "mobile-drawer";
        drawer.hidden = true;
        drawer.innerHTML = `
          <div class="mobile-drawer-backdrop" data-close></div>
          <div class="mobile-drawer-panel">
            <a href="#case-studies">Case Studies</a>
            <a href="#why-us">Why Us</a>
            <a href="#process">Our Process</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faqs">FAQs</a>
            <a href="#book" class="v2-btn-primary" style="margin-top:16px">Let’s Talk</a>
          </div>`;
        document.body.appendChild(drawer);
      }
      const setOpen = (open) => {
        drawer.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
      };
      const onToggle = () => setOpen(drawer.hidden);
      const onDrawer = (e) => {
        if (e.target.closest("[data-close]") || e.target.closest("a")) setOpen(false);
      };
      toggle.addEventListener("click", onToggle);
      drawer.addEventListener("click", onDrawer);
      cleanups.push(() => {
        toggle.removeEventListener("click", onToggle);
        drawer.removeEventListener("click", onDrawer);
        setOpen(false);
      });
    }

    function lightbox() {
      const overlay = document.createElement("div");
      overlay.className = "lightbox";
      overlay.hidden = true;
      overlay.innerHTML = `<button class="lightbox-close" type="button" aria-label="Close">&times;</button><img alt="">`;
      document.body.appendChild(overlay);
      const img = overlay.querySelector("img");
      const close = () => {
        overlay.hidden = true;
        document.body.style.overflow = "";
      };
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target.closest(".lightbox-close")) close();
      });
      const onKey = (e) => {
        if (e.key === "Escape") close();
      };
      document.addEventListener("keydown", onKey);
      const clicks = [];
      $$(".cursor-zoom-in").forEach((el) => {
        const fn = () => {
          const src = el.currentSrc || el.src;
          if (!src) return;
          img.src = src;
          img.alt = el.alt || "";
          overlay.hidden = false;
          document.body.style.overflow = "hidden";
        };
        el.addEventListener("click", fn);
        clicks.push([el, fn]);
      });
      cleanups.push(() => {
        document.removeEventListener("keydown", onKey);
        clicks.forEach(([el, fn]) => el.removeEventListener("click", fn));
        overlay.remove();
      });
    }

    function videoModal() {
      const modal = document.createElement("div");
      modal.className = "video-modal";
      modal.hidden = true;
      modal.innerHTML = `<div class="video-modal-frame"><iframe allow="autoplay; encrypted-media" allowFullScreen></iframe></div>`;
      document.body.appendChild(modal);
      const iframe = modal.querySelector("iframe");
      const close = () => {
        modal.hidden = true;
        iframe.src = "";
        document.body.style.overflow = "";
      };
      modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
      });
      const onKey = (e) => {
        if (e.key === "Escape") close();
      };
      document.addEventListener("keydown", onKey);
      const clicks = [];
      $$('button[aria-label^="Play"]').forEach((btn) => {
        const fn = () => {
          const thumb = btn.querySelector("img");
          const src = thumb ? thumb.src : "";
          const match = src.match(/\/vi\/([^/]+)\//);
          if (!match) return;
          iframe.src = `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
          modal.hidden = false;
          document.body.style.overflow = "hidden";
        };
        btn.addEventListener("click", fn);
        clicks.push([btn, fn]);
      });
      cleanups.push(() => {
        document.removeEventListener("keydown", onKey);
        clicks.forEach(([el, fn]) => el.removeEventListener("click", fn));
        modal.remove();
      });
    }

    function portfolioNav() {
      const prev = $('[aria-label="Previous video"]');
      const next = $('[aria-label="Next video"]');
      if (!prev || !next) return;
      const section = prev.closest("section");
      const scroller = section && section.querySelector(".overflow-hidden > .flex");
      if (!scroller) return;
      let x = 0;
      const step = () => Math.min(640, scroller.parentElement.clientWidth * 0.72);
      const max = () => Math.max(0, scroller.scrollWidth - scroller.parentElement.clientWidth);
      const apply = () => {
        x = Math.max(-max(), Math.min(0, x));
        scroller.style.transform = `translate3d(${x}px, 0, 0)`;
        scroller.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
      };
      const onPrev = () => {
        x += step();
        apply();
      };
      const onNext = () => {
        x -= step();
        apply();
      };
      prev.addEventListener("click", onPrev);
      next.addEventListener("click", onNext);
      cleanups.push(() => {
        prev.removeEventListener("click", onPrev);
        next.removeEventListener("click", onNext);
      });
    }

    function copyEmail() {
      const btn = $('[aria-label^="Copy email"]');
      if (!btn) return;
      const fn = async () => {
        try {
          await navigator.clipboard.writeText("umer@xpertppc.com");
          toast("Copied to clipboard");
        } catch {
          toast("umer@xpertppc.com");
        }
      };
      btn.addEventListener("click", fn);
      cleanups.push(() => btn.removeEventListener("click", fn));
    }

    function bookingWidget() {
      const mount = $("#my-cal-inline-discovery-session");
      if (!mount) return;
      const slots = ["10:00am", "11:30am", "1:00pm", "2:30pm", "4:00pm"];
      const now = new Date();
      let view = new Date(now.getFullYear(), now.getMonth(), 1);
      let selected = null;
      let selectedSlot = null;

      const render = () => {
        const year = view.getFullYear();
        const month = view.getMonth();
        const label = view.toLocaleString("en-US", { month: "long", year: "numeric" });
        const firstDow = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [];
        for (let i = 0; i < firstDow; i++) cells.push(`<button class="book-day" disabled></button>`);
        for (let d = 1; d <= daysInMonth; d++) {
          const date = new Date(year, month, d);
          const available = date.getDay() !== 0 && date >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const isSel = selected && selected.toDateString() === date.toDateString();
          cells.push(
            `<button type="button" class="book-day${available ? " is-available" : ""}${isSel ? " is-selected" : ""}" ${
              available ? `data-day="${d}"` : "disabled"
            }>${d}</button>`
          );
        }
        mount.innerHTML = `
          <div class="book-widget">
            <div class="book-widget-head">
              <img src="/assets/xpertppc-mark.png" alt="Umer Khan">
              <div>
                <div style="font-weight:700">Discovery Session</div>
                <div style="font-size:13px;color:#6b7280">30 min · Google Meet</div>
              </div>
            </div>
            <div class="book-layout">
              <div class="book-cal">
                <div class="book-cal-nav">
                  <button type="button" data-prev aria-label="Previous month">‹</button>
                  <strong>${label}</strong>
                  <button type="button" data-next aria-label="Next month">›</button>
                </div>
                <div class="book-grid">
                  ${["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => `<div class="dow">${d}</div>`).join("")}
                  ${cells.join("")}
                </div>
              </div>
              <div class="book-slots">
                <div style="font-weight:700;margin-bottom:10px">${
                  selected
                    ? selected.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                    : "Select a day"
                }</div>
                ${
                  selected
                    ? slots
                        .map(
                          (s) =>
                            `<button type="button" class="book-slot${selectedSlot === s ? " is-selected" : ""}" data-slot="${s}">${s}</button>`
                        )
                        .join("")
                    : `<p class="v2-lede">Pick a date to see available times.</p>`
                }
                ${
                  selected && selectedSlot
                    ? `<form class="book-form">
                        <input name="name" required placeholder="Your name">
                        <input name="email" type="email" required placeholder="Email">
                        <button class="v2-btn-primary book-confirm" type="submit">Confirm booking</button>
                      </form>`
                    : ""
                }
              </div>
            </div>
          </div>`;
        mount.querySelector("[data-prev]").addEventListener("click", () => {
          view = new Date(year, month - 1, 1);
          render();
        });
        mount.querySelector("[data-next]").addEventListener("click", () => {
          view = new Date(year, month + 1, 1);
          render();
        });
        mount.querySelectorAll("[data-day]").forEach((btn) => {
          btn.addEventListener("click", () => {
            selected = new Date(year, month, Number(btn.dataset.day));
            selectedSlot = null;
            render();
          });
        });
        mount.querySelectorAll("[data-slot]").forEach((btn) => {
          btn.addEventListener("click", () => {
            selectedSlot = btn.dataset.slot;
            render();
          });
        });
        const form = mount.querySelector("form");
        if (form) {
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            toast("Booking confirmed — we’ll email you shortly.");
          });
        }
      };
      render();
      cleanups.push(() => {
        mount.innerHTML = "";
      });
    }

    revealOnScroll();
    hideNavOnScroll();
    rotateHeroNumber();
    faqs();
    mobileMenu();
    lightbox();
    videoModal();
    portfolioNav();
    copyEmail();
    bookingWidget();

    return () => {
      cleanups.forEach((fn) => fn());
      document.body.style.overflow = "";
    };
  }, []);
}
