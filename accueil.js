
document.querySelectorAll(".cls-1, .cls-2").forEach((svg) => {
  svg.addEventListener("click", () => {
    const isFavori = svg.style.fill === "goldenrod";
    svg.style.fill = isFavori ? "#1e847f" : "goldenrod";

    // Déterminer le bon conteneur parent
    
    const container = svg.closest(".article, .modal-menu");
    const title = container.querySelector(".title-article, .title-menu-modal")?.textContent.trim();
    const imgSrc = container.querySelector("img")?.src;
    const prix = container.querySelector(".prix, .prix-modal")?.textContent.trim();
    const favContainer = document.querySelector(".modal-favori");

    if (!title || !favContainer) return;

    const existingFav = favContainer.querySelector(`[data-title="${title}"]`);

    if (!isFavori) {
      // ➕ Ajouter si non déjà présent
      if (!existingFav) {
        const favBlock = document.createElement("div");
        favBlock.classList.add("favori-item");
        favBlock.setAttribute("data-title", title);
        

        favBlock.innerHTML = `
          <img src="${imgSrc}" style="width:150px;height:100px;margin-left:0;object-fit:cover; border:1px solid #1e847f;border-radius:5px"/>
          <span style="margin-left: 0px;font-size:30px;font-family:'Aguafina Script';color:black">${title}</span>
          <span style="margin-left:auto;font-size:28px;color:goldenrod">${prix}</span>
        `;
        favContainer.appendChild(favBlock);
      }
    } else {
      // ❌ Supprimer si présent
      if (existingFav) {
        existingFav.remove();
      }
    }
  });
});

let panier = [];

document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('click', () => {
        const article = button.closest('.article');
        const title = article.querySelector('.title-article').textContent;
        const priceText = article.querySelector('.prix').textContent;
        const price = parseFloat(priceText.replace('€', ''));
        const qtyInput = article.querySelector('.number');
        const qty = parseInt(qtyInput.value) || 1;

        // Vérifie si l'article est déjà dans le panier
        const item = panier.find(p => p.title === title);

        if (item) {
            item.qty = qty; // Mise à jour directe

        } else {
            panier.push({ title, price, qty });
        }

        updatePanierDisplay();
        updatePastille();
    });
});

// Écouteur pour mettre à jour la quantité en direct
document.querySelectorAll('.number').forEach(input => {
    input.addEventListener('change', () => {
        const article = input.closest('.article');
        const title = article.querySelector('.title-article').textContent;
        const item = panier.find(p => p.title === title);
        const newQty = parseInt(input.value) || 1;

        if (item) {
            item.qty = newQty;
            updatePanierDisplay();
            updatePastille();
        }
    });
});

function updatePanierDisplay() {
  const container = document.querySelector('.panier-modal');

  container.innerHTML = `
  `;

  panier.forEach((p, index) => {
    const item = document.createElement('div');
    item.className = 'panier-row';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.justifyContent = 'space-between';
    item.style.gap = '10px';
    item.style.margin = '5px 0';

    item.innerHTML = `
      <h3 class="menu-panier" style="flex:1">${p.title}</h3>
      <h3 class="quantite-panier" style="width:50px;text-align:center">${p.qty}</h3>
      <h3 class="prix-panier" style="width:60px;text-align:right">${(p.qty * p.price).toFixed(2)}€</h3>
      <button class="btn-remove" data-index="${index}" >X</button>
    `;

    container.appendChild(item);
  });

  bindRemoveButtons(); // lier événements
}
function bindRemoveButtons() {
  document.querySelectorAll('.btn-remove').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      panier.splice(index, 1);
      updatePanierDisplay();
      updatePastille();
    });
  });
}

function updatePastille() {
    const total = panier.reduce((sum, p) => sum + (p.qty * p.price), 0);
    document.querySelector('.pastille-panier').textContent = `${total.toFixed(2)}€`;
}

document.querySelectorAll(".quantity-container").forEach(container => {
  const input = container.querySelector(".number");
  const btnMinus = container.querySelector(".minus");
  const btnPlus = container.querySelector(".plus");

  btnMinus.addEventListener("click", () => {
    let value = parseInt(input.value) || 1;
    if (value > parseInt(input.min)) {
      input.value = value - 1;
    }
  });

  btnPlus.addEventListener("click", () => {
    let value = parseInt(input.value) || 1;
    if (!input.max || value < parseInt(input.max)) {
      input.value = value + 1;
    }
  });
});