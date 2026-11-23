// Monthly / annual billing toggle with the original sliding pill and price swap animation.
import { prefersReducedMotion } from "@/lib/format";

const KEY = "retriever:pricing-period";
const pill = document.querySelector(".pricing-pill");
const options = document.querySelectorAll("[data-period]");
const prices = document.querySelectorAll("[data-price]");

function render(period) {
  prices.forEach((block) => {
    block.querySelector("[data-price-value]").textContent = block.dataset[period];
    const unit = block.querySelector("[data-price-unit]");
    unit.textContent = unit.dataset[period];
  });
}

function setPeriod(period, animate = true) {
  pill?.setAttribute("data-pos", period);
  options.forEach((button) => {
    const active = button.dataset.period === period;
    button.setAttribute("aria-pressed", String(active));
    button.classList.toggle("font-medium", active);
    button.classList.toggle("text-text-dark", active);
  });
  try {
    window.sessionStorage.setItem(KEY, period);
  } catch {}

  if (!animate || prefersReducedMotion()) return render(period);
  const swaps = document.querySelectorAll(".price-swap");
  swaps.forEach((el) => el.classList.add("price-out"));
  setTimeout(() => {
    render(period);
    swaps.forEach((el) => el.classList.remove("price-out"));
  }, 150);
}

options.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.getAttribute("aria-pressed") !== "true") setPeriod(button.dataset.period);
  });
});

let saved = "monthly";
try {
  saved = window.sessionStorage.getItem(KEY) === "annual" ? "annual" : "monthly";
} catch {}
setPeriod(saved, false);
