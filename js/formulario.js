document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openFormBtn");
  const modal = document.getElementById("formModal");
  const closeBtn = document.getElementById("closeFormBtn");

  if (!openBtn || !modal || !closeBtn) {
    console.warn("⚠️ Modal: algún elemento no existe.");
    return;
  }

  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
