const chatToggle = document.querySelector(".chat-toggle");
const pageLoader = document.querySelector(".page-loader");
const chatTeaser = document.querySelector(".chat-teaser");
const chatPanel = document.querySelector(".chat-panel");
const chatClose = document.querySelector(".chat-close");
const repairForm = document.querySelector(".repair-form");
const cursorRing = document.querySelector(".custom-cursor");
const cursorDot = document.querySelector(".custom-cursor-dot");
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const contactTriggers = document.querySelectorAll(".contact-trigger");
const choiceGroups = document.querySelectorAll("[data-choice-group]");
const steps = Array.from(document.querySelectorAll(".assistant-step"));
const stepCounter = document.querySelector(".step-counter");
const stepHelper = document.querySelector(".step-helper");
const stepBack = document.querySelector(".step-back");
const stepNext = document.querySelector(".step-next");
const enquirySubmit = document.querySelector(".enquiry-submit");
const reviewList = document.querySelector(".review-list");
const submitStatus = document.querySelector(".submit-status");
const modelInput = repairForm.elements.model;
const modelList = document.querySelector("#phone-models");
const phoneInput = repairForm.elements.customerPhone;
const phoneError = document.querySelector(".phone-error");

const shopPhone = "919347114229";
const googleSheetWebAppUrl = "https://script.google.com/macros/s/AKfycby6aSIhilGIvV9ZclDX14V-Ke5acu3SDw9jQrB8DtU-Tl-1BQvCmhM4Keg-tVtQSd_njQ/exec";
const phoneModels = {
  iPhone: [
    "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17", "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
    "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 11", "iPhone XR", "iPhone SE"
  ],
  Samsung: [
    "Samsung Galaxy S26 Ultra", "Samsung Galaxy S26+", "Samsung Galaxy S26", "Samsung Galaxy S25 Ultra", "Samsung Galaxy S25+", "Samsung Galaxy S25",
    "Samsung Galaxy S24 Ultra", "Samsung Galaxy S24+", "Samsung Galaxy S24", "Samsung Galaxy S23 Ultra", "Samsung Galaxy S23", "Samsung Galaxy Z Fold 7",
    "Samsung Galaxy Z Flip 7", "Samsung Galaxy A57 5G", "Samsung Galaxy A37 5G", "Samsung Galaxy A56 5G", "Samsung Galaxy A36 5G",
    "Samsung Galaxy A55 5G", "Samsung Galaxy A35 5G", "Samsung Galaxy A15 5G", "Samsung Galaxy M35 5G", "Samsung Galaxy M15 5G"
  ],
  OnePlus: [
    "OnePlus 15", "OnePlus 15R", "OnePlus 13s", "OnePlus 13", "OnePlus 13R", "OnePlus 12", "OnePlus 12R", "OnePlus 11",
    "OnePlus Nord 5", "OnePlus Nord 4", "OnePlus Nord CE 5", "OnePlus Nord CE 4", "OnePlus Nord CE 4 Lite", "OnePlus Open"
  ],
  "Vivo / Oppo": [
    "Vivo X300 Pro", "Vivo X200T", "Vivo X200 FE", "Vivo X200 Pro", "Vivo X100 Pro", "Vivo V70 Elite", "Vivo V50", "Vivo V50e",
    "Vivo V40", "Vivo V30", "Vivo T4 Pro 5G", "Vivo Y200", "Oppo Find X9 Pro", "Oppo Find N6", "Oppo Reno15 Pro", "Oppo Reno15",
    "Oppo Reno 12", "Oppo Reno 11", "Oppo F27 Pro+", "Oppo A78", "Oppo A59"
  ],
  "Redmi / Xiaomi": [
    "Redmi Note 15 Pro+", "Redmi Note 15 Pro", "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 13 Pro+", "Redmi Note 13 Pro",
    "Redmi Note 13", "Redmi Note 12", "Xiaomi 15 Ultra", "Xiaomi 15", "Xiaomi 14", "Xiaomi 14 Civi", "POCO F7", "POCO X7 Pro", "POCO X6 Pro"
  ],
  "Other brand": [
    "Realme P4 Power", "Realme GT 7 Pro", "Realme 14 Pro", "Realme 13 Pro", "Realme 12 Pro", "Realme Narzo",
    "Motorola Razr Ultra 2025", "Motorola Edge 60", "Motorola Edge 50 Pro", "Motorola G85", "Nothing Phone 4a Pro",
    "Nothing Phone 3a", "Nothing Phone 2a", "iQOO 15", "iQOO 13", "iQOO Neo", "Infinix Note", "Tecno Spark"
  ]
};
const stepCopy = [
  "First, choose the repair type.",
  "Great. Which phone brand is it?",
  "Now add the model if you know it.",
  "Tell us what happened to the phone.",
  "Almost done. Add your name and pick-up area.",
  "Review your enquiry and send it."
];
const enquiry = {
  service: "",
  brand: "",
  issueType: ""
};
let currentStep = 0;
let loaderProgress = 0;
let heroSlideIndex = 0;

function scrollToHashTarget() {
  if (!window.location.hash) return;

  const target = document.querySelector(window.location.hash);
  target?.scrollIntoView({ block: "start" });
}

function showHeroSlide(index) {
  if (!heroSlides.length) return;

  heroSlideIndex = index % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === heroSlideIndex);
  });
}

if (heroSlides.length > 1) {
  setInterval(() => {
    showHeroSlide(heroSlideIndex + 1);
  }, 5000);
}

if (cursorRing && cursorDot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursorRing.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    cursorDot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    cursorRing.classList.add("visible");
    cursorDot.classList.add("visible");
  });

  window.addEventListener("mouseleave", () => {
    cursorRing.classList.remove("visible");
    cursorDot.classList.remove("visible");
  });

  document.querySelectorAll("a, button, input, textarea, label").forEach((item) => {
    item.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
    item.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
  });
}

const loaderTimer = setInterval(() => {
  loaderProgress = Math.min(loaderProgress + 8, 88);
  pageLoader.style.setProperty("--loader-progress", loaderProgress);
}, 120);

window.addEventListener("load", () => {
  clearInterval(loaderTimer);
  pageLoader.style.setProperty("--loader-progress", 100);
  setTimeout(() => {
    pageLoader.classList.add("done");
    scrollToHashTarget();
  }, 360);
});

setTimeout(() => {
  chatTeaser.classList.add("hidden");
}, 10000);

function setChatOpen(isOpen) {
  chatPanel.hidden = !isOpen;
  chatToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    chatTeaser.classList.add("hidden");
    notifyIntent("assistant_opened");
  }
}

function notifyIntent(stage, details = {}) {
  const payload = {
    stage,
    page: window.location.pathname,
    time: new Date().toISOString(),
    step: currentStep + 1,
    service: enquiry.service,
    brand: enquiry.brand,
    issueType: enquiry.issueType,
    ...details
  };

  window.localStorage.setItem("lastRepairEnquiry", JSON.stringify(payload));

  navigator.sendBeacon?.("/api/repair-event", JSON.stringify(payload));
}

function updateReview() {
  const formData = new FormData(repairForm);
  const values = [
    ["Service", enquiry.service || "Not selected"],
    ["Brand", enquiry.brand || "Not selected"],
    ["Model", String(formData.get("model") || "").trim() || "Not mentioned"],
    ["Issue type", enquiry.issueType || "Not selected"],
    ["Issue", String(formData.get("issue") || "").trim() || "Not mentioned"],
    ["Name", String(formData.get("name") || "").trim() || "Not mentioned"],
    ["Phone", String(formData.get("customerPhone") || "").trim() || "Not mentioned"],
    ["Location", String(formData.get("location") || "").trim() || "Not mentioned"],
    ["Pick-up", formData.get("pickup") === "on" ? "Yes" : "No"]
  ];

  reviewList.replaceChildren();

  values.forEach(([label, value]) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    reviewList.append(row);
  });
}

function showStep(index) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));

  steps.forEach((step, stepIndex) => {
    step.classList.toggle("active", stepIndex === currentStep);
  });

  stepCounter.textContent = `Step ${currentStep + 1} of ${steps.length}`;
  stepHelper.textContent = stepCopy[currentStep];
  stepBack.hidden = currentStep === 0;
  stepNext.hidden = currentStep === steps.length - 1;
  enquirySubmit.hidden = currentStep !== steps.length - 1;
  enquirySubmit.disabled = currentStep !== steps.length - 1;

  if (currentStep === steps.length - 1) {
    updateReview();
    enquirySubmit.disabled = false;
  }

  updateContinueState();
}

function currentStepIsComplete() {
  const formData = new FormData(repairForm);

  if (currentStep === 0) return Boolean(enquiry.service);
  if (currentStep === 1) return Boolean(enquiry.brand);
  if (currentStep === 2) return Boolean(String(formData.get("model") || "").trim());
  if (currentStep === 3) {
    const issue = String(formData.get("issue") || "").trim();
    return Boolean(enquiry.issueType) && (enquiry.issueType !== "Other issue" || Boolean(issue));
  }
  if (currentStep === 4) {
    return Boolean(String(formData.get("name") || "").trim()) &&
      validatePhoneNumber(formData.get("customerPhone")).ok &&
      Boolean(String(formData.get("location") || "").trim());
  }

  return true;
}

function updateContinueState() {
  updatePhoneValidation();
  stepNext.disabled = !currentStepIsComplete();
}

function normalizePhoneNumber(value) {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
}

function validatePhoneNumber(value) {
  const digits = normalizePhoneNumber(value);

  if (!digits) {
    return { ok: false, message: "" };
  }

  if (!/^[6-9]\d{9}$/.test(digits)) {
    return { ok: false, message: "Enter a valid 10-digit mobile number." };
  }

  if (/^(\d)\1{9}$/.test(digits)) {
    return { ok: false, message: "This number looks invalid." };
  }

  if ("0123456789".includes(digits) || "9876543210".includes(digits)) {
    return { ok: false, message: "Please enter a real mobile number." };
  }

  return { ok: true, message: "" };
}

function updatePhoneValidation() {
  const result = validatePhoneNumber(phoneInput.value);
  phoneError.textContent = result.message;
  phoneInput.classList.toggle("invalid", Boolean(result.message));
}

function selectChoice(group, button) {
  const groupName = group.dataset.choiceGroup;
  enquiry[groupName] = button.dataset.value || "";

  group.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("selected", item === button);
  });

  if (groupName === "brand") {
    populateModelList(enquiry.brand);
    modelInput.value = "";
  }

  notifyIntent("choice_selected", {
    group: groupName,
    value: button.dataset.value
  });
  updateContinueState();
}

function populateModelList(brand) {
  const models = phoneModels[brand] || [];
  modelList.replaceChildren();

  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    modelList.append(option);
  });
}

function preselectFromIntent(intent) {
  if (!intent) return;

  if (intent.includes("pickup")) {
    repairForm.elements.pickup.checked = true;
  }

  if (intent.includes("enquiry") || intent.includes("contact") || intent.includes("call")) {
    notifyIntent("contact_button_clicked", { intent });
  }
}

function buildWhatsAppMessage(formData) {
  const model = String(formData.get("model") || "").trim();
  const issue = String(formData.get("issue") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const customerPhone = normalizePhoneNumber(formData.get("customerPhone"));
  const location = String(formData.get("location") || "").trim();
  const wantsPickup = formData.get("pickup") === "on";

  return [
    "Hi BBC Mobile Service Center, I need help with a phone repair.",
    "",
    `Service needed: ${enquiry.service}`,
    `Phone brand: ${enquiry.brand}`,
    `Model: ${model}`,
    `Issue type: ${enquiry.issueType}`,
    `Issue: ${issue}`,
    `Name: ${name}`,
    `Customer phone: ${customerPhone}`,
    `Location: ${location}`,
    `Home pick-up needed: ${wantsPickup ? "Yes" : "No"}`
  ].join("\n");
}

function buildSheetPayload(formData) {
  return {
    status: "WhatsApp opened",
    service: enquiry.service,
    brand: enquiry.brand,
    model: String(formData.get("model") || "").trim(),
    issueType: enquiry.issueType,
    issue: String(formData.get("issue") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    customerPhone: normalizePhoneNumber(formData.get("customerPhone")),
    location: String(formData.get("location") || "").trim(),
    pickup: formData.get("pickup") === "on",
    source: "repair-assistant",
    page: window.location.pathname,
    userAgent: navigator.userAgent
  };
}

async function saveToGoogleSheet(payload) {
  if (!googleSheetWebAppUrl) return false;

  await fetch(googleSheetWebAppUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: new URLSearchParams({
      payload: JSON.stringify(payload)
    })
  });

  return true;
}

chatToggle.addEventListener("click", () => {
  setChatOpen(chatPanel.hidden);
});

chatTeaser.addEventListener("click", () => {
  setChatOpen(true);
});

chatClose.addEventListener("click", () => {
  notifyIntent("assistant_closed_before_send");
  setChatOpen(false);
});

stepBack.addEventListener("click", () => {
  showStep(currentStep - 1);
});

stepNext.addEventListener("click", () => {
  if (currentStepIsComplete()) {
    showStep(currentStep + 1);
  }
});

choiceGroups.forEach((group) => {
  group.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectChoice(group, button);
    });
  });
});

contactTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    setChatOpen(true);
    preselectFromIntent(trigger.dataset.intent);
  });
});

repairForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(repairForm);
  const message = buildWhatsAppMessage(formData);
  const sheetPayload = buildSheetPayload(formData);
  const whatsappUrl = `https://wa.me/${shopPhone}?text=${encodeURIComponent(message)}`;
  const whatsappWindow = window.open(whatsappUrl, "_blank");

  enquirySubmit.disabled = true;
  submitStatus.textContent = "Opening WhatsApp with your data...";

  notifyIntent("opened_whatsapp", {
    hasModel: Boolean(String(formData.get("model") || "").trim()),
    hasIssue: Boolean(String(formData.get("issue") || "").trim()),
    hasPhone: validatePhoneNumber(formData.get("customerPhone")).ok,
    hasLocation: Boolean(String(formData.get("location") || "").trim()),
    wantsPickup: formData.get("pickup") === "on"
  });

  try {
    await saveToGoogleSheet(sheetPayload);
  } catch (error) {
    window.localStorage.setItem("pendingRepairEnquiry", JSON.stringify(sheetPayload));
  }

  submitStatus.textContent = "Opening WhatsApp with your data...";
  if (!whatsappWindow) {
    window.location.href = whatsappUrl;
  }
  enquirySubmit.disabled = false;
});

repairForm.addEventListener("input", updateContinueState);
repairForm.addEventListener("change", updateContinueState);

showStep(0);
