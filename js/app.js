// Command Manager - Main Application Logic

class CommandManager {
  constructor() {
    this.data = COMMAND_DATA;
    this.currentCategory = null;
    this.currentSubcategory = null;
    this.selectedCommand = null;
    this.filteredCommands = this.data.commands;
    this.searchTerm = "";
    this.currentListTab = "ips";
    this.showFavoritesOnly = false;
    this.currentPlatformFilter = "all";
    this.currentRequiresFilter = "all";
    this.currentProtocolFilter = "all";

    // Variation tracking
    this.activeVariation = 0;

    // List management
    this.lists = {
      ips: [],
      users: [],
      passwords: [],
      domains: [],
      hashes: [],
    };

    // Custom asset types management
    this.customAssetTypes = [];
    this.defaultAssetTypes = ["ips", "users", "passwords", "domains", "hashes"];

    // Favorites management
    this.favorites = new Set();


    // Command linking system
    this.commandLinks = {};

    // Profile system
    this.activeProfileId = null;
    this.profileMeta = null;

    // Target context
    this.targetContext = {};
    this.contextBarCollapsed = false;

    this.init();
  }

  // Initialize application
  init() {
    this.loadProfileMeta();
    this.loadLists();
    this.loadCustomAssetTypes();
    this.loadCommandLinks();
    this.loadFavorites();
    this.loadTargetContext();
    this.renderProfileSwitcher();
    this.renderCategories();
    this.renderCommands();
    this.setupEventListeners();
    this.renderContextBar();
    this.updateFavoritesButton();
    this.setupSidebarToggle();
    this.setupTheme();
    this.handleInitialHash();

    window.addEventListener("hashchange", () => {
      if (this._suppressHashChange) return;
      this.handleInitialHash();
    });
  }

  // Toggle shortcuts help overlay
  toggleShortcutsModal() {
    const m = document.getElementById("shortcuts-modal");
    if (!m) return;
    const opening = m.style.display === "none" || !m.style.display;
    m.style.display = opening ? "flex" : "none";
    if (opening) this.trapFocus(m);
    else this.releaseFocusTrap();
  }

  // Confine Tab navigation inside the given modal element until released.
  trapFocus(modal) {
    this.releaseFocusTrap();
    const focusables = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    this._lastFocused = document.activeElement;
    first.focus();
    this._focusTrapHandler = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", this._focusTrapHandler);
  }
  releaseFocusTrap() {
    if (this._focusTrapHandler) {
      document.removeEventListener("keydown", this._focusTrapHandler);
      this._focusTrapHandler = null;
    }
    if (this._lastFocused && typeof this._lastFocused.focus === "function") {
      try { this._lastFocused.focus(); } catch (e) {}
      this._lastFocused = null;
    }
  }

  // Light/dark theme toggle, persisted to localStorage; respects prefers-color-scheme on first load.
  setupTheme() {
    const stored = localStorage.getItem("command-manager-theme");
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    const theme = stored || (prefersLight ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", theme);

    const btn = document.getElementById("theme-toggle");
    if (btn) {
      const sync = () => {
        const t = document.documentElement.getAttribute("data-theme") || "dark";
        btn.textContent = t === "light" ? "🌙" : "☀";
        btn.setAttribute("aria-label", t === "light" ? "Switch to dark theme" : "Switch to light theme");
      };
      sync();
      btn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("command-manager-theme", next);
        sync();
      });
    }
  }

  // Mobile sidebar drawer
  setupSidebarToggle() {
    const toggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (!toggle || !sidebar || !backdrop) return;

    const close = () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      sidebar.classList.add("open");
      backdrop.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", () => {
      if (sidebar.classList.contains("open")) close();
      else open();
    });
    backdrop.addEventListener("click", close);

    // Auto-close on small screens after selecting a command from the list.
    document.addEventListener("click", (e) => {
      if (window.innerWidth > 900) return;
      if (e.target.closest(".command-item, .subcategory")) close();
    });
  }

  // If the URL has #<command-id>, open that command on load / on hashchange.
  handleInitialHash() {
    const id = (location.hash || "").replace(/^#/, "");
    if (!id) return;
    const command = this.data.commands.find((c) => c.id === id);
    if (command) {
      this.selectCommand(command.id);
    }
  }

  // Reload profile data without re-binding event listeners
  reloadProfileData() {
    this.lists = { ips: [], users: [], passwords: [], domains: [], hashes: [] };
    this.customAssetTypes = [];
    this.favorites = new Set();
    this.commandLinks = {};
    this.targetContext = {};

    this.loadLists();
    this.loadCustomAssetTypes();
    this.loadCommandLinks();
    this.loadFavorites();
    this.loadTargetContext();
    this.renderContextBar();
    this.selectedCommand = null;
    this.renderCommands();
    this.renderCommandBuilder();
    this.updateFavoritesButton();
  }

  // ==================== STORAGE KEY HELPER ====================

  _storageKey(suffix) {
    return `command-manager-${this.activeProfileId}-${suffix}`;
  }

  // ==================== PROFILE SYSTEM ====================

  loadProfileMeta() {
    const saved = localStorage.getItem("command-manager-profiles");
    if (saved) {
      try {
        this.profileMeta = JSON.parse(saved);
        this.activeProfileId = this.profileMeta.activeProfileId;
      } catch (e) {
        this._initDefaultProfile();
      }
    } else {
      this._initDefaultProfile();
      this._migrateOldData();
    }
  }

  _initDefaultProfile() {
    this.profileMeta = {
      activeProfileId: "default",
      profiles: [{ id: "default", name: "Default", createdAt: new Date().toISOString() }]
    };
    this.activeProfileId = "default";
    this.saveProfileMeta();
  }

  _migrateOldData() {
    const migrations = [
      ["command-manager-lists", "lists"],
      ["command-manager-favorites", "favorites"],
      ["command-manager-custom-asset-types", "custom-asset-types"],
      ["command-manager-command-links", "command-links"]
    ];
    migrations.forEach(([oldKey, suffix]) => {
      const data = localStorage.getItem(oldKey);
      if (data) {
        localStorage.setItem(this._storageKey(suffix), data);
        localStorage.removeItem(oldKey);
      }
    });
  }

  saveProfileMeta() {
    try {
      this.profileMeta.activeProfileId = this.activeProfileId;
      localStorage.setItem("command-manager-profiles", JSON.stringify(this.profileMeta));
    } catch (e) {
      console.error("Error saving profile metadata:", e);
    }
  }

  createProfile() {
    const name = prompt("Enter profile name:");
    if (!name || name.trim() === "") return;

    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();

    this.profileMeta.profiles.push({
      id,
      name: name.trim(),
      createdAt: new Date().toISOString()
    });
    this.saveProfileMeta();
    this.switchProfile(id);
    this.showToast(`Profile "${name.trim()}" created`);
  }

  renameProfile() {
    const current = this.profileMeta.profiles.find(p => p.id === this.activeProfileId);
    if (!current) return;

    const name = prompt("Enter new name:", current.name);
    if (!name || name.trim() === "" || name.trim() === current.name) return;

    current.name = name.trim();
    this.saveProfileMeta();
    this.renderProfileSwitcher();
    this.showToast(`Profile renamed to "${name.trim()}"`);
  }

  deleteProfile() {
    if (this.profileMeta.profiles.length <= 1) {
      this.showToast("Cannot delete the last profile", "error");
      return;
    }

    const current = this.profileMeta.profiles.find(p => p.id === this.activeProfileId);
    if (!current) return;

    if (!confirm(`Delete profile "${current.name}"? All data in this profile will be lost.`)) return;

    // Remove profile data from localStorage
    ["lists", "favorites", "custom-asset-types", "command-links", "target-context"].forEach(suffix => {
      localStorage.removeItem(this._storageKey(suffix));
    });

    this.profileMeta.profiles = this.profileMeta.profiles.filter(p => p.id !== this.activeProfileId);
    this.switchProfile(this.profileMeta.profiles[0].id);
    this.showToast(`Profile "${current.name}" deleted`);
  }

  duplicateProfile() {
    const current = this.profileMeta.profiles.find(p => p.id === this.activeProfileId);
    if (!current) return;

    const name = prompt("Enter name for the duplicate:", current.name + " (Copy)");
    if (!name || name.trim() === "") return;

    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();

    // Copy all data keys
    ["lists", "favorites", "custom-asset-types", "command-links", "target-context"].forEach(suffix => {
      const data = localStorage.getItem(this._storageKey(suffix));
      if (data) {
        localStorage.setItem(`command-manager-${id}-${suffix}`, data);
      }
    });

    this.profileMeta.profiles.push({
      id,
      name: name.trim(),
      createdAt: new Date().toISOString()
    });
    this.saveProfileMeta();
    this.switchProfile(id);
    this.showToast(`Profile duplicated as "${name.trim()}"`);
  }

  switchProfile(profileId) {
    this.activeProfileId = profileId;
    this.saveProfileMeta();
    this.reloadProfileData();
    this.renderProfileSwitcher();
  }

  renderProfileSwitcher() {
    const container = document.getElementById("profile-switcher");
    if (!container || !this.profileMeta) return;

    container.innerHTML = `
      <select class="profile-select" id="profile-select">
        ${this.profileMeta.profiles.map(p =>
          `<option value="${p.id}" ${p.id === this.activeProfileId ? 'selected' : ''}>${this.escapeHtml(p.name)}</option>`
        ).join('')}
      </select>
      <button class="profile-manage-btn" id="profile-manage-btn" title="Manage profiles">&#9881;</button>
      <div class="profile-manage-menu" id="profile-manage-menu" style="display: none;">
        <button class="profile-menu-item" data-profile-action="new">New Profile</button>
        <button class="profile-menu-item" data-profile-action="rename">Rename</button>
        <button class="profile-menu-item" data-profile-action="duplicate">Duplicate</button>
        <button class="profile-menu-item profile-menu-item-danger" data-profile-action="delete">Delete</button>
      </div>
    `;

    const select = document.getElementById("profile-select");
    if (select) {
      select.addEventListener("change", (e) => this.switchProfile(e.target.value));
    }

    const manageBtn = document.getElementById("profile-manage-btn");
    if (manageBtn) {
      manageBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = document.getElementById("profile-manage-menu");
        if (menu) menu.style.display = menu.style.display === "none" ? "block" : "none";
      });
    }

    container.querySelectorAll("[data-profile-action]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const menu = document.getElementById("profile-manage-menu");
        if (menu) menu.style.display = "none";
        switch (e.target.dataset.profileAction) {
          case "new": this.createProfile(); break;
          case "rename": this.renameProfile(); break;
          case "duplicate": this.duplicateProfile(); break;
          case "delete": this.deleteProfile(); break;
        }
      });
    });
  }

  // ==================== TARGET CONTEXT BAR ====================

  loadTargetContext() {
    const saved = localStorage.getItem(this._storageKey("target-context"));
    if (saved) {
      try {
        this.targetContext = JSON.parse(saved);
      } catch (e) {
        this.targetContext = {};
      }
    } else {
      this.targetContext = {};
    }
  }

  saveTargetContext() {
    try {
      localStorage.setItem(this._storageKey("target-context"), JSON.stringify(this.targetContext));
    } catch (e) {
      console.error("Error saving target context:", e);
    }
  }

  renderContextBar() {
    const container = document.getElementById("context-bar-fields");
    if (!container) return;

    const allTypes = [
      { id: 'ips', name: 'IP' },
      { id: 'users', name: 'User' },
      { id: 'passwords', name: 'Password' },
      { id: 'domains', name: 'Domain' },
      { id: 'hashes', name: 'Hash' },
      ...this.customAssetTypes.map(t => ({ id: t.id, name: t.name }))
    ];

    container.innerHTML = allTypes.map(type => `
      <div class="context-field">
        <label class="context-field-label">${type.name}</label>
        <div class="dropdown-container">
          <input type="text" class="context-input"
            data-context-type="${type.id}"
            value="${this.escapeHtml(this.targetContext[type.id] || '')}"
            placeholder="${type.name}...">
          <div class="dropdown-list context-dropdown" id="context-dropdown-${type.id}"></div>
        </div>
      </div>
    `).join('');

    this.setupContextBarEvents();
    this.updateContextBarSummary();
  }

  setupContextBarEvents() {
    document.querySelectorAll(".context-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const type = e.target.dataset.contextType;
        this.updateTargetContext(type, e.target.value);
        // Show filtered dropdown
        if (this.lists[type]) {
          const val = e.target.value.toLowerCase();
          const matches = this.lists[type].filter(item =>
            item.value.toLowerCase().includes(val) || item.tag.toLowerCase().includes(val)
          );
          this.showContextDropdown(type, matches);
        }
      });

      input.addEventListener("focus", (e) => {
        const type = e.target.dataset.contextType;
        if (this.lists[type] && this.lists[type].length > 0) {
          this.showContextDropdown(type, this.lists[type]);
        }
      });

      input.addEventListener("blur", (e) => {
        const type = e.target.dataset.contextType;
        setTimeout(() => {
          const dropdown = document.getElementById(`context-dropdown-${type}`);
          if (dropdown) dropdown.classList.remove("show");
        }, 150);
      });
    });

    const header = document.getElementById("context-bar-header");
    if (header) {
      header.addEventListener("click", (e) => {
        // Don't toggle if clicking inside an input
        if (e.target.closest('.context-bar-fields')) return;
        this.toggleContextBar();
      });
    }
  }

  showContextDropdown(type, items) {
    const dropdown = document.getElementById(`context-dropdown-${type}`);
    if (!dropdown) return;

    dropdown.innerHTML = "";
    if (items.length === 0) {
      dropdown.classList.remove("show");
      return;
    }

    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "dropdown-item";
      div.textContent = item.tag ? `${item.value} (${item.tag})` : item.value;
      div.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const input = document.querySelector(`[data-context-type="${type}"]`);
        if (input) input.value = item.value;
        this.updateTargetContext(type, item.value);
        dropdown.classList.remove("show");
      });
      dropdown.appendChild(div);
    });
    dropdown.classList.add("show");
  }

  updateTargetContext(listType, value) {
    if (value.trim()) {
      this.targetContext[listType] = value.trim();
    } else {
      delete this.targetContext[listType];
    }
    this.saveTargetContext();
    this.updateContextBarSummary();
    this.applyContextToBuilder();
  }

  applyContextToBuilder() {
    if (!this.selectedCommand) return;
    let changed = false;
    document.querySelectorAll(".parameter-input").forEach(input => {
      const placeholder = input.dataset.placeholder;
      const listType = this.getListTypeForPlaceholder(placeholder);
      if (listType && this.targetContext[listType] && !input.value.trim()) {
        input.value = this.targetContext[listType];
        changed = true;
      }
    });
    if (changed) {
      this.generateCommand();
    }
  }

  toggleContextBar() {
    const bar = document.getElementById("target-context-bar");
    if (bar) {
      bar.classList.toggle("collapsed");
      this.contextBarCollapsed = bar.classList.contains("collapsed");
    }
  }

  updateContextBarSummary() {
    const summary = document.getElementById("context-bar-summary");
    if (!summary) return;
    const values = Object.entries(this.targetContext)
      .filter(([, v]) => v.trim())
      .map(([, v]) => v.trim());
    summary.textContent = values.length > 0 ? values.join(" | ") : "";
  }

  // ==================== HELPERS ====================

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ==================== DATA PERSISTENCE (PROFILE-SCOPED) ====================

  // Load lists from localStorage
  loadLists() {
    const saved = localStorage.getItem(this._storageKey("lists"));
    if (saved) {
      try {
        this.lists = JSON.parse(saved);
      } catch (e) {
        console.error("Error loading lists from localStorage:", e);
      }
    }
    // Normalize: convert string items to {value, tag} objects
    Object.keys(this.lists).forEach(key => {
      this.lists[key] = this.lists[key].map(item =>
        typeof item === 'string' ? { value: item, tag: '' } : item
      );
    });
  }

  // Save lists to localStorage
  saveLists() {
    try {
      localStorage.setItem(this._storageKey("lists"), JSON.stringify(this.lists));
    } catch (e) {
      console.error("Error saving lists to localStorage:", e);
    }
  }

  // Load custom asset types from localStorage
  loadCustomAssetTypes() {
    const saved = localStorage.getItem(this._storageKey("custom-asset-types"));
    if (saved) {
      try {
        this.customAssetTypes = JSON.parse(saved);
        // Add custom types to lists if they don't exist
        this.customAssetTypes.forEach(type => {
          if (!this.lists[type.id]) {
            this.lists[type.id] = [];
          }
        });
      } catch (e) {
        console.error("Error loading custom asset types from localStorage:", e);
      }
    }
  }

  // Save custom asset types to localStorage
  saveCustomAssetTypes() {
    try {
      localStorage.setItem(this._storageKey("custom-asset-types"), JSON.stringify(this.customAssetTypes));
    } catch (e) {
      console.error("Error saving custom asset types to localStorage:", e);
    }
  }

  // Load command links from localStorage or initialize with data from commands.js
  loadCommandLinks() {
    try {
      const saved = localStorage.getItem(this._storageKey("command-links"));
      if (saved) {
        this.commandLinks = JSON.parse(saved);
      } else {
        // Initialize with command links from COMMAND_DATA if available
        this.commandLinks = window.COMMAND_LINKS || {};
      }
    } catch (e) {
      console.error("Error loading command links from localStorage:", e);
      this.commandLinks = {};
    }
  }

  // Save command links to localStorage
  saveCommandLinks() {
    try {
      localStorage.setItem(this._storageKey("command-links"), JSON.stringify(this.commandLinks));
    } catch (e) {
      console.error("Error saving command links to localStorage:", e);
    }
  }

  // Load favorites from localStorage
  loadFavorites() {
    const saved = localStorage.getItem(this._storageKey("favorites"));
    if (saved) {
      try {
        const favArray = JSON.parse(saved);
        this.favorites = new Set(favArray);
      } catch (e) {
        console.error("Error loading favorites from localStorage:", e);
        this.favorites = new Set();
      }
    }
  }

  // Save favorites to localStorage
  saveFavorites() {
    try {
      const favArray = Array.from(this.favorites);
      localStorage.setItem(this._storageKey("favorites"), JSON.stringify(favArray));
    } catch (e) {
      console.error("Error saving favorites to localStorage:", e);
    }
  }

  // Toggle favorite status of a command
  toggleFavorite(commandId) {
    if (this.favorites.has(commandId)) {
      this.favorites.delete(commandId);
    } else {
      this.favorites.add(commandId);
    }
    this.saveFavorites();
    this.renderCommands(); // Re-render to update star icons
  }

  // Toggle favorites-only view
  toggleFavoritesView() {
    this.showFavoritesOnly = !this.showFavoritesOnly;

    // Clear category selection when showing favorites
    if (this.showFavoritesOnly) {
      this.currentCategory = null;
      this.currentSubcategory = null;
      this.searchTerm = "";
      const searchBox = document.getElementById("global-search");
      if (searchBox) searchBox.value = "";
    }

    this.filterCommands();
    this.updateBreadcrumb();
    this.updateShowAllButton();
    this.updateFavoritesButton();
  }

  // Update favorites button state
  updateFavoritesButton() {
    const favBtn = document.getElementById("favorites-btn");
    if (favBtn) {
      if (this.showFavoritesOnly) {
        favBtn.classList.add("active");
        favBtn.innerHTML = '⭐ Hide Favorites';
      } else {
        favBtn.classList.remove("active");
        favBtn.innerHTML = `⭐ Show Favorites${this.favorites.size > 0 ? ` (${this.favorites.size})` : ''}`;
      }
    }
  }

  // Render categories in sidebar
  renderCategories() {
    const container = document.getElementById("categories");
    if (!container) return;

    container.innerHTML = "";

    Object.entries(this.data.categories).forEach(([categoryId, category]) => {
      const categoryEl = document.createElement("div");
      categoryEl.className = "category";

      categoryEl.innerHTML = `
                <button class="category-header" data-category="${categoryId}">
                    <span class="category-icon">${
                      category.name.split(" ")[0]
                    }</span>
                    <span>${category.name.substring(2)}</span>
                    <span class="category-arrow">▶</span>
                </button>
                <div class="subcategories">
                    ${Object.entries(category.subcategories)
                      .map(
                        ([subId, subName]) =>
                          `<div class="subcategory" data-category="${categoryId}" data-subcategory="${subId}">${subName}</div>`
                      )
                      .join("")}
                </div>
            `;

      container.appendChild(categoryEl);
    });
  }

  // Handle modal close
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";

      // Clear form data for custom command modal
      if (modalId === "custom-command-modal") {
        const textarea = document.getElementById("custom-command-template");
        const select = document.getElementById("placeholder-pattern");
        const customInput = document.getElementById("custom-pattern-text");
        if (textarea) textarea.value = "";
        if (select) select.value = "<VAR>";
        if (customInput) customInput.value = "";
      }
    }
  }

  // Handle action buttons
  handleAction(action, event) {
    switch (action) {
      case "import-all-lists":
        this.importAllLists();
        break;
      case "export-all-lists":
        this.exportAllLists();
        break;
      case "clear-all-lists":
        this.clearAllLists();
        break;
      case "import-backup":
        this.importBackup();
        break;
      case "export-backup":
        this.exportBackup();
        break;
      case "import-list":
        const importListType = event ? event.target.dataset.listType : null;
        if (importListType) this.importList(importListType);
        break;
      case "export-list":
        const exportListType = event ? event.target.dataset.listType : null;
        if (exportListType) this.exportList(exportListType);
        break;
      case "clear-list":
        const clearListType = event ? event.target.dataset.listType : null;
        if (clearListType) this.clearList(clearListType);
        break;
      case "custom-command":
        this.toggleCustomCommand();
        break;
      case "manage-lists":
        this.toggleListManagement();
        break;
      case "add-list-item":
        this.addListItem();
        break;
      case "bulk-import":
        this.toggleBulkImport();
        break;
      case "apply-bulk-import":
        this.applyBulkImport();
        break;
      case "cancel-bulk-import":
        this.toggleBulkImport();
        break;
    }
  }

  // Toggle category expansion
  toggleCategory(categoryId) {
    const categoryEl = document
      .querySelector(`[data-category="${categoryId}"]`)
      .closest(".category");
    if (categoryEl) {
      categoryEl.classList.toggle("expanded");
    }

    // Clear active states
    document
      .querySelectorAll(".category-header, .subcategory")
      .forEach((el) => el.classList.remove("active"));

    // Highlight this category header
    const categoryHeader = document.querySelector(
      `.category-header[data-category="${categoryId}"]`
    );
    if (categoryHeader) categoryHeader.classList.add("active");

    this.currentCategory = categoryId;
    this.currentSubcategory = null;
    this.showFavoritesOnly = false;
    this.updateFavoritesButton();
    this.filterCommands();
    this.updateBreadcrumb();
    this.updateShowAllButton();
  }

  // Select subcategory
  selectSubcategory(categoryId, subcategoryId) {
    // Update active states
    document
      .querySelectorAll(".category-header, .subcategory")
      .forEach((el) => el.classList.remove("active"));

    const subcategoryEl = document.querySelector(
      `[data-category="${categoryId}"][data-subcategory="${subcategoryId}"]`
    );
    if (subcategoryEl) {
      subcategoryEl.classList.add("active");
    }

    // Also highlight the parent category
    const categoryHeader = document.querySelector(
      `.category-header[data-category="${categoryId}"]`
    );
    if (categoryHeader) {
      categoryHeader.classList.add("active");
      // Ensure category is expanded
      const categoryEl = categoryHeader.closest(".category");
      if (categoryEl && !categoryEl.classList.contains("expanded")) {
        categoryEl.classList.add("expanded");
      }
    }

    this.currentCategory = categoryId;
    this.currentSubcategory = subcategoryId;
    this.showFavoritesOnly = false;
    this.updateFavoritesButton();
    this.filterCommands();
    this.updateBreadcrumb();
    this.updateShowAllButton();
  }

  // Clear category selection
  clearCategorySelection() {
    this.currentCategory = null;
    this.currentSubcategory = null;
    this.searchTerm = "";
    this.showFavoritesOnly = false;

    const searchBox = document.getElementById("global-search");
    if (searchBox) searchBox.value = "";

    document
      .querySelectorAll(".category-header, .subcategory")
      .forEach((el) => el.classList.remove("active"));

    this.updateFavoritesButton();
    this.filterCommands();
    this.updateBreadcrumb();
    this.updateShowAllButton();
  }

  // Update show all button visibility
  updateShowAllButton() {
    const showAllContainer = document.getElementById("show-all-container");
    if (showAllContainer) {
      if (this.currentCategory || this.searchTerm.trim() || this.showFavoritesOnly) {
        showAllContainer.style.display = "block";
      } else {
        showAllContainer.style.display = "none";
      }
    }
  }

  // Filter commands based on current selection and search
  filterCommands() {
    this.filteredCommands = this.data.commands.filter((command) => {
      const matchesCategory =
        !this.currentCategory || command.category === this.currentCategory;
      const matchesSubcategory =
        !this.currentSubcategory ||
        command.subcategory === this.currentSubcategory;
      const matchesSearch =
        !this.searchTerm ||
        command.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        command.command.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        command.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        command.tags.some((tag) =>
          tag.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      const matchesFavorites = !this.showFavoritesOnly || this.favorites.has(command.id);
      const matchesPlatform =
        this.currentPlatformFilter === "all" ||
        command.platform === this.currentPlatformFilter;
      const matchesRequires =
        this.currentRequiresFilter === "all" ||
        (command.requires && command.requires.includes(this.currentRequiresFilter)) ||
        (command.variations && command.variations.some(
          (v) => v.requires === this.currentRequiresFilter
        ));
      const matchesProtocol =
        this.currentProtocolFilter === "all" ||
        (command.protocols && command.protocols.includes(this.currentProtocolFilter));

      return matchesCategory && matchesSubcategory && matchesSearch && matchesFavorites && matchesPlatform && matchesRequires && matchesProtocol;
    });

    this.renderCommands();
  }

  // Apply all filters (convenience method)
  applyFilters() {
    this.filterCommands();
  }

  // Get platform icon
  getPlatformIcon(platform) {
    const icons = {
      'linux': `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
<g fill="#fffefe" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M46.125,38.868c-0.192,-0.815 -0.481,-1.618 -0.919,-2.346c-0.871,-1.466 -2.199,-2.585 -3.594,-3.489c-1.409,-0.901 -2.916,-1.624 -4.458,-2.219c-2.953,-1.141 -2.81,-1.103 -4.803,-1.814c-4.416,-1.574 -6.868,-3.914 -7.022,-6.452c-0.074,-1.229 1.126,-5.234 6.074,-4.282c1.175,0.226 2.287,0.543 3.382,1.037c1.009,0.456 3.954,1.884 4.986,3.917v0c0.078,0.897 0.394,1.244 1.656,1.84c0.949,0.448 1.907,0.935 1.993,2.039c0.005,0.06 0.051,0.109 0.131,0.121c0.052,0 0.1,-0.031 0.121,-0.081c0.182,-0.439 0.915,-0.989 1.461,-0.839c0.063,0.016 0.119,-0.009 0.148,-0.061c0.03,-0.052 0.02,-0.116 -0.021,-0.158l-0.863,-0.854c-0.311,-0.31 -0.651,-0.721 -0.939,-1.249c-0.078,-0.142 -0.145,-0.282 -0.204,-0.417c-0.038,-0.094 -0.076,-0.187 -0.114,-0.281c-0.724,-1.895 -2.073,-3.925 -3.465,-5.24c-0.756,-0.727 -1.588,-1.367 -2.475,-1.913c-0.891,-0.538 -1.819,-1.016 -2.833,-1.302l-0.074,0.256c0.947,0.327 1.833,0.849 2.662,1.419c0.828,0.579 1.593,1.243 2.273,1.979c0.971,1.032 1.736,2.23 2.282,3.512l-1.993,-2.477l0.055,0.858l-1.633,-1.841l0.101,0.862l-1.586,-1.279l0.136,0.584c-0.357,-0.236 -3.525,-1.496 -5.106,-2.09c-1.581,-0.594 -4.705,-3.524 -3.804,-7.232c0,0 -1.477,-0.574 -2.535,-0.965c-1.043,-0.376 -2.09,-0.717 -3.14,-1.046c-2.1,-0.658 -4.212,-1.258 -6.335,-1.818c-2.123,-0.557 -4.26,-1.062 -6.409,-1.508c-2.15,-0.441 -4.312,-0.834 -6.5,-1.053l-0.039,0.333c2.153,0.331 4.278,0.833 6.387,1.382c2.108,0.555 4.202,1.166 6.279,1.829c2.076,0.665 4.139,1.37 6.177,2.128c1.018,0.379 2.033,0.769 3.027,1.188c0.211,0.088 0.426,0.18 0.641,0.272c-1.224,-0.241 -2.448,-0.432 -3.673,-0.591c-2.211,-0.281 -4.424,-0.458 -6.639,-0.558c-2.214,-0.1 -4.43,-0.116 -6.642,-0.034c-2.211,0.086 -4.423,0.259 -6.605,0.633l0.043,0.304c2.18,-0.224 4.375,-0.246 6.563,-0.183c2.189,0.067 4.374,0.231 6.547,0.477c2.172,0.246 4.335,0.567 6.469,0.986c1.316,0.261 2.624,0.564 3.903,0.921c-1.011,-0.101 -2.017,-0.127 -3.014,-0.115c-1.977,0.03 -3.926,0.247 -5.848,0.574c-1.922,0.33 -3.818,0.773 -5.675,1.346c-1.851,0.579 -3.681,1.267 -5.361,2.249l0.116,0.208c1.72,-0.828 3.568,-1.358 5.426,-1.779c1.862,-0.414 3.751,-0.698 5.644,-0.868c1.891,-0.168 3.792,-0.224 5.663,-0.101c1.664,0.11 3.317,0.363 4.83,0.849v0c0.065,0.445 0.366,1.346 0.511,1.796v0c-4.255,1.957 -4.794,5.477 -4.446,7.365c0.409,2.214 2.011,3.902 3.904,4.995c1.567,0.891 3.168,1.459 4.726,2.047c1.555,0.583 3.095,1.143 4.467,1.918c1.352,0.747 2.476,1.901 3.391,3.21c1.837,2.638 2.572,5.964 2.792,9.245l0.365,-0.01c0.008,-3.323 -0.47,-6.802 -2.252,-9.812c-0.588,-0.986 -1.314,-1.921 -2.171,-2.733c0.992,0.384 1.961,0.818 2.887,1.333c1.373,0.779 2.667,1.749 3.548,3.051c0.444,0.647 0.755,1.375 0.983,2.133c0.202,0.767 0.295,1.565 0.329,2.371h0.312c0.011,-0.823 -0.035,-1.655 -0.201,-2.477z"></path></g></g>
</svg>`,
      'windows': `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#1976d2" d="M6,6h17v17H6V6z"></path><path fill="#1976d2" d="M25.042,22.958V6H42v16.958H25.042z"></path><path fill="#1976d2" d="M6,25h17v17H6V25z"></path><path fill="#1976d2" d="M25,42V25h17v17H25z"></path>
</svg>`,
      'cross-platform': `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-world"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>`
    };
    return icons[platform] || `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 100 100">
      <circle fill="#7d8590" cx="50" cy="50" r="35"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-size="30">?</text>
    </svg>`;
  }

  // Get platform display name
  getPlatformName(platform) {
    const names = {
      'linux': 'Linux',
      'windows': 'Windows',
      'cross-platform': 'Cross-Platform'
    };
    return names[platform] || 'Unknown';
  }

  // Render commands list
  renderCommands() {
    const container = document.getElementById("command-list");
    const countEl = document.getElementById("command-count");

    if (!container || !countEl) return;

    container.innerHTML = "";
    countEl.textContent = `${this.filteredCommands.length} commands`;

    if (this.filteredCommands.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><p>No commands found</p></div>';
      return;
    }

    this.filteredCommands.forEach((command) => {
      const commandEl = document.createElement("div");
      commandEl.className = "command-item";
      commandEl.dataset.commandId = command.id;

      const isFavorite = this.favorites.has(command.id);
      const starIcon = isFavorite ? "⭐" : "☆";

      // Collect all requires values (base + variations)
      const allRequires = new Set(command.requires || []);
      if (command.variations) {
        command.variations.forEach((v) => { if (v.requires) allRequires.add(v.requires); });
      }
      const requiresBadges = [...allRequires]
        .map((r) => `<span class="badge badge-requires">${r}</span>`)
        .join("");
      const protocolBadges = (command.protocols || [])
        .map((p) => `<span class="badge badge-protocol">${p}</span>`)
        .join("");

      commandEl.innerHTML = `
                <div class="command-header">
                    <div class="command-name">${command.name}${
                      command.variations && command.variations.length > 0
                        ? ` <span class="variation-count">${command.variations.length + 1}</span>`
                        : ""
                    }</div>
                    <button class="favorite-btn" data-command-id="${command.id}" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}" aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}" aria-pressed="${isFavorite}">
                        ${starIcon}
                    </button>
                </div>
                <div class="command-preview" title="${command.command.replace(/"/g, '&quot;')}">${command.command}</div>
                <div class="command-badges">
                    ${requiresBadges}${protocolBadges}
                </div>
                <div class="command-tags">
                    ${command.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")}
                </div>
            `;

      container.appendChild(commandEl);
    });
  }

  // Select a command
  selectCommand(commandId) {
    const command = this.data.commands.find((cmd) => cmd.id === commandId);
    if (!command) return;

    // Update selection state
    document
      .querySelectorAll(".command-item")
      .forEach((el) => el.classList.remove("selected"));
    const commandEl = document.querySelector(
      `[data-command-id="${commandId}"]`
    );
    if (commandEl) {
      commandEl.classList.add("selected");
    }

    this.selectedCommand = command;
    this.activeVariation = 0;
    this.renderCommandBuilder();

    // Update URL hash so the command is permalinkable / shareable.
    const newHash = `#${command.id}`;
    if (location.hash !== newHash) {
      this._suppressHashChange = true;
      history.replaceState(null, "", newHash);
      this._suppressHashChange = false;
    }
  }

  // Get the active command template (base or variation)
  getActiveCommand() {
    if (!this.selectedCommand) return "";
    const cmd = this.selectedCommand;
    if (cmd.variations && cmd.variations.length > 0 && this.activeVariation > 0) {
      return cmd.variations[this.activeVariation - 1].command;
    }
    return cmd.command;
  }

  // Switch to a different variation
  switchVariation(index) {
    this.activeVariation = index;
    this.renderCommandBuilder();
  }

  // Render command builder
  renderCommandBuilder() {
    const container = document.getElementById("builder-content");
    if (!container) return;

    if (!this.selectedCommand) {
      container.innerHTML = `
                <div class="empty-state">
                    <h3>🚀 Welcome to Command Manager</h3>
                    <p>Select a command from the list to start building your penetration testing toolkit</p>
                </div>
            `;
      return;
    }

    const activeCmd = this.getActiveCommand();
    const placeholders = this.extractPlaceholders(activeCmd);

    // Variation tabs
    const hasVariations = this.selectedCommand.variations && this.selectedCommand.variations.length > 0;
    const variationTabs = hasVariations
      ? `<div class="variation-tabs">
           <button class="variation-tab${this.activeVariation === 0 ? " active" : ""}" data-variation="0">Default</button>
           ${this.selectedCommand.variations.map((v, i) =>
             `<button class="variation-tab${this.activeVariation === i + 1 ? " active" : ""}" data-variation="${i + 1}">${v.label}</button>`
           ).join("")}
         </div>`
      : "";

    // Platform information
    const platformIcon = this.getPlatformIcon(this.selectedCommand.platform);
    const platformName = this.getPlatformName(this.selectedCommand.platform);
    const platformInfo = this.selectedCommand.platform
      ? `<div class="platform-info">
           <span class="platform-icon">${platformIcon}</span>
           <span class="platform-name">${platformName}</span>
         </div>`
      : '';

    // References section
    const referencesSection = this.selectedCommand.references && this.selectedCommand.references.length > 0
      ? `<div class="references-section">
           <div class="section-title">📚 References & Documentation</div>
           <div class="references-list">
             ${this.selectedCommand.references.map(ref =>
               `<a href="${ref.url}" target="_blank" class="reference-link">
                  <span class="reference-title">${ref.title}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="external-link-icon">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>`
             ).join('')}
           </div>
         </div>`
      : '';

    // Requires & protocols badges for builder (use variation-specific requires if active)
    let activeRequires = this.selectedCommand.requires || [];
    if (hasVariations && this.activeVariation > 0) {
      const activeVar = this.selectedCommand.variations[this.activeVariation - 1];
      if (activeVar.requires) activeRequires = [activeVar.requires];
    }
    const reqBadges = activeRequires
      .map((r) => `<span class="badge badge-requires">${r}</span>`)
      .join("");
    const protBadges = (this.selectedCommand.protocols || [])
      .map((p) => `<span class="badge badge-protocol">${p}</span>`)
      .join("");
    const badgesRow = (reqBadges || protBadges)
      ? `<div class="builder-badges">${reqBadges}${protBadges}</div>`
      : "";

    // Command links section
    const commandLinksSection = this.getCommandLinksForCommand(this.selectedCommand.id)

    container.innerHTML = `
            <div class="command-info">
                <div class="command-header-section">
                    <div class="command-title">${this.selectedCommand.name}</div>
                    ${platformInfo}
                </div>
                <div class="command-description">${
                  this.selectedCommand.description
                }</div>
                ${badgesRow}
            </div>

            ${variationTabs}

            ${
              placeholders.length > 0
                ? `
                <div class="parameter-section">
                    <div class="section-title">Parameters</div>
                    <div class="parameter-grid">
                        ${placeholders
                          .map(
                            (placeholder) => `
                            <div class="parameter-group">
                                <label class="parameter-label">${placeholder}</label>
                                <div class="dropdown-container">
                                    <input type="text"
                                           class="parameter-input"
                                           id="param-${placeholder}"
                                           placeholder="Enter ${placeholder}..."
                                           data-placeholder="${placeholder}">
                                    <div class="dropdown-list" id="dropdown-${placeholder}"></div>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            `
                : ""
            }

            <div class="output-section">
                <div class="output-header">
                    <span class="output-title">Generated Command</span>
                    <button class="copy-btn" id="copy-command-btn">Copy</button>
                </div>
                <div class="command-output" id="command-output">${
                  activeCmd
                }</div>
            </div>

            ${referencesSection}
            ${commandLinksSection}
        `;

    this.generateCommand();
    this.setupParameterEventListeners();
    this.setupCommandLinkEventListeners();
    this.setupVariationTabListeners();
    this.applyContextToBuilder();
  }

  // Setup variation tab click listeners
  setupVariationTabListeners() {
    document.querySelectorAll(".variation-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.variation, 10);
        this.switchVariation(index);
      });
    });
  }

  // Get command links section HTML for the selected command
  getCommandLinksForCommand(commandId) {
    if (!this.commandLinks[commandId] || this.commandLinks[commandId].length === 0) {
      return '';
    }

    const linkedCommands = this.commandLinks[commandId]
      .map(linkId => {
        // Find the command data for this link
        const linkedCommand = this.findCommandById(linkId);
        if (!linkedCommand) return null;

        return `
          <div class="linked-command" data-command-id="${linkId}">
            <div class="linked-command-name">${linkedCommand.name}</div>
            <div class="linked-command-desc">${linkedCommand.description}</div>
            <div class="linked-command-arrow">→</div>
          </div>
        `;
      })
      .filter(Boolean)
      .join('');

    if (!linkedCommands) return '';

    return `
      <div class="command-links-section">
        <div class="section-title">🔗 Recommended Next Commands</div>
        <div class="command-links-list">
          ${linkedCommands}
        </div>
      </div>
    `;
  }

  // Helper method to find command by ID
  findCommandById(commandId) {
    // COMMAND_DATA.commands is an array of all commands
    return COMMAND_DATA.commands.find(cmd => cmd.id === commandId);
  }

  // Method to select a command by ID (for clicking linked commands)
  selectCommandById(commandId) {
    const command = this.findCommandById(commandId);
    if (command) {
      // First, make sure we're in the right category and subcategory
      this.selectedCategory = command.category;
      this.selectedSubcategory = command.subcategory;

      // Update the UI to show the correct category/subcategory
      this.renderCategories();
      this.renderCommands();

      // Then select the command (pass the ID, not the object)
      this.selectCommand(command.id);

      // Scroll to top of command builder to show the newly selected command
      const builderContent = document.getElementById("builder-content");
      if (builderContent) {
        builderContent.scrollTop = 0;
      }
    }
  }

  // Setup event listeners for command link clicks
  setupCommandLinkEventListeners() {
    const linkElements = document.querySelectorAll('.linked-command');

    linkElements.forEach(linkElement => {
      linkElement.addEventListener('click', (e) => {
        const commandId = linkElement.getAttribute('data-command-id');
        if (commandId) {
          this.selectCommandById(commandId);
        }
      });
    });
  }

  // Setup event listeners for parameter inputs
  setupParameterEventListeners() {
    // Parameter input events
    document.querySelectorAll(".parameter-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        this.handleParameterInput(e.target);
        this.generateCommand();
        this.showDropdown(e.target.dataset.placeholder, e.target.value);
      });

      input.addEventListener("focus", (e) => {
        this.showDropdown(e.target.dataset.placeholder, e.target.value);
      });

      input.addEventListener("blur", (e) => {
        this.hideDropdown(e.target.dataset.placeholder);
      });

      input.addEventListener("keydown", (e) => {
        const placeholder = e.target.dataset.placeholder;
        const dropdown = document.getElementById(`dropdown-${placeholder}`);
        if (!dropdown || !dropdown.classList.contains("show")) return;
        const items = [...dropdown.querySelectorAll(".dropdown-item")];
        if (!items.length) return;
        const cur = items.findIndex((el) => el.classList.contains("active"));
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = (cur + 1) % items.length;
          items.forEach((el) => el.classList.remove("active"));
          items[next].classList.add("active");
          items[next].scrollIntoView({ block: "nearest" });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = (cur - 1 + items.length) % items.length;
          items.forEach((el) => el.classList.remove("active"));
          items[prev].classList.add("active");
          items[prev].scrollIntoView({ block: "nearest" });
        } else if (e.key === "Enter") {
          const target = cur >= 0 ? items[cur] : items[0];
          if (target) {
            e.preventDefault();
            this.selectDropdownItem(placeholder, target.dataset.value);
          }
        } else if (e.key === "Escape") {
          this.hideDropdown(placeholder);
        }
      });
    });

    // Copy button event
    const copyBtn = document.getElementById("copy-command-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyCommand());
    }
  }

  // Extract placeholders from command
  extractPlaceholders(command) {
    const matches = command.match(/<([^>]+)>/g);
    if (!matches) return [];
    return [...new Set(matches.map((match) => match.slice(1, -1)))];
  }

  // Handle parameter input (supports annotated list items)
  handleParameterInput(input) {
    const placeholder = input.dataset.placeholder;
    const value = input.value.toLowerCase();
    const listType = this.getListTypeForPlaceholder(placeholder);

    if (listType && this.lists[listType]) {
      const matches = this.lists[listType].filter((item) =>
        item.value.toLowerCase().includes(value) || item.tag.toLowerCase().includes(value)
      );
      this.showDropdownItems(placeholder, matches);
    }
  }

  // Get list type for placeholder
  getListTypeForPlaceholder(placeholder) {
    const mapping = {
      ip: "ips",
      user: "users",
      username: "users",
      password: "passwords",
      pass: "passwords",
      domain: "domains",
      hash: "hashes",
      hashes: "hashes",
      wordlist: "wordlists",
      ports: "ports",
      port: "ports",
    };

    const lowerPlaceholder = placeholder.toLowerCase();

    // Check default mappings first
    if (mapping[lowerPlaceholder]) {
      return mapping[lowerPlaceholder];
    }

    // Check custom asset types for partial matches
    for (const customType of this.customAssetTypes) {
      const typeName = customType.name.toLowerCase();
      const typeId = customType.id.toLowerCase();

      // Check if placeholder matches the type name or ID
      if (lowerPlaceholder.includes(typeId) ||
          lowerPlaceholder.includes(typeName.replace(/\s+/g, '')) ||
          typeName.includes(lowerPlaceholder)) {
        return customType.id;
      }
    }

    return mapping[lowerPlaceholder];
  }

  // Show dropdown
  showDropdown(placeholder, filter) {
    const listType = this.getListTypeForPlaceholder(placeholder);
    if (listType && this.lists[listType]) {
      this.showDropdownItems(placeholder, this.lists[listType], filter);
    }
  }

  // Show dropdown items (supports annotated list items + filter substring)
  showDropdownItems(placeholder, items, filter) {
    const dropdown = document.getElementById(`dropdown-${placeholder}`);
    if (!dropdown) return;

    const f = (filter || "").toLowerCase().trim();
    const filtered = f
      ? items.filter((item) =>
          item.value.toLowerCase().includes(f) ||
          (item.tag && item.tag.toLowerCase().includes(f))
        )
      : items;

    dropdown.innerHTML = "";

    if (filtered.length === 0) {
      dropdown.classList.remove("show");
      return;
    }

    filtered.forEach((item) => {
      const div = document.createElement("div");
      div.className = "dropdown-item";
      div.dataset.value = item.value;
      div.textContent = item.tag ? `${item.value} (${item.tag})` : item.value;
      div.addEventListener("mousedown", (e) => {
        e.preventDefault(); // Prevent blur event
        this.selectDropdownItem(placeholder, item.value);
      });
      dropdown.appendChild(div);
    });

    dropdown.classList.add("show");
  }

  // Select dropdown item
  selectDropdownItem(placeholder, value) {
    const input = document.getElementById(`param-${placeholder}`);
    if (input) {
      input.value = value;
      this.generateCommand();
    }
    this.hideDropdown(placeholder);
  }

  // Hide dropdown
  hideDropdown(placeholder) {
    setTimeout(() => {
      const dropdown = document.getElementById(`dropdown-${placeholder}`);
      if (dropdown) {
        dropdown.classList.remove("show");
      }
    }, 150);
  }

  // Generate final command
  generateCommand() {
    if (!this.selectedCommand) return;

    let command = this.getActiveCommand();
    const placeholders = this.extractPlaceholders(command);

    placeholders.forEach((placeholder) => {
      const input = document.getElementById(`param-${placeholder}`);
      if (input && input.value.trim()) {
        const value = input.value.trim();
        command = command.replace(new RegExp(`<${placeholder}>`, "g"), value);
      }
    });

    const outputEl = document.getElementById("command-output");
    if (outputEl) {
      outputEl.innerHTML = this.highlightPlaceholders(command);
    }
  }

  // Highlight unfilled placeholders. Single-pass tokenizer so spans
  // emitted earlier in the pass cannot be re-matched by later rules
  // (e.g. the string rule eating "placeholder-highlight" in a class attr).
  highlightPlaceholders(command) {
    const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Order matters: strings first (so flags inside quotes don't get colored),
    // then placeholders, then flags.
    const tokenRe = /('[^']*'|"[^"]*")|(<[^<>\s]+?>)|((?:^|\s)--[A-Za-z][\w-]*)|((?:^|\s)-[A-Za-z](?![\w-]))/g;
    let out = "";
    let last = 0;
    let m;
    while ((m = tokenRe.exec(command)) !== null) {
      out += escapeHtml(command.slice(last, m.index));
      if (m[1]) {
        out += `<span class="syn-string">${escapeHtml(m[1])}</span>`;
      } else if (m[2]) {
        out += `<span class="placeholder-highlight">${escapeHtml(m[2])}</span>`;
      } else if (m[3]) {
        const lead = m[3][0] === "-" ? "" : m[3][0];
        const flag = m[3].trimStart();
        out += `${lead}<span class="syn-flag">${escapeHtml(flag)}</span>`;
      } else if (m[4]) {
        const lead = m[4][0] === "-" ? "" : m[4][0];
        const flag = m[4].trimStart();
        out += `${lead}<span class="syn-flag">${escapeHtml(flag)}</span>`;
      }
      last = tokenRe.lastIndex;
    }
    out += escapeHtml(command.slice(last));
    return out;
  }

  // Copy command to clipboard
  async copyCommand() {
    const commandEl = document.getElementById("command-output");
    if (!commandEl) return;

    const command = commandEl.textContent;

    try {
      await navigator.clipboard.writeText(command);
      const btn = document.getElementById("copy-command-btn");
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copied");

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove("copied");
        }, 2000);
      }

      this.showToast("Command copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy command:", err);
      this.showToast("Failed to copy command", "error");
    }
  }

  // Update breadcrumb
  updateBreadcrumb() {
    const breadcrumb = document.getElementById("breadcrumb-text");
    const title = document.getElementById("command-list-title");

    if (!breadcrumb || !title) return;

    if (this.showFavoritesOnly) {
      // Show favorites in breadcrumb
      breadcrumb.innerHTML = `<span class="current">⭐ Favorite Commands</span>`;
      title.textContent = "Favorite Commands";
    } else if (this.searchTerm.trim()) {
      // Show search results in breadcrumb
      breadcrumb.innerHTML = `<span class="current">Search: "${this.searchTerm}"</span>`;
      title.textContent = `Search Results`;
    } else if (this.currentCategory && this.currentSubcategory) {
      const categoryName =
        this.data.categories[this.currentCategory].name.substring(2);
      const subcategoryName =
        this.data.categories[this.currentCategory].subcategories[
          this.currentSubcategory
        ];
      breadcrumb.innerHTML = `${categoryName} > <span class="current">${subcategoryName}</span>`;
      title.textContent = subcategoryName;
    } else if (this.currentCategory) {
      const categoryName =
        this.data.categories[this.currentCategory].name.substring(2);
      breadcrumb.innerHTML = `<span class="current">${categoryName}</span>`;
      title.textContent = categoryName;
    } else {
      breadcrumb.innerHTML = '<span class="current">All Commands</span>';
      title.textContent = "All Commands";
    }
  }

  // Enhanced Search functionality with simple but effective matching
  handleSearch(searchTerm) {
    this.searchTerm = searchTerm;

    if (searchTerm.trim()) {
      // Respect category + filters; search is just another constraint applied on top.
      const pool = this.data.commands.filter((command) => {
        const matchesCategory =
          !this.currentCategory || command.category === this.currentCategory;
        const matchesSubcategory =
          !this.currentSubcategory || command.subcategory === this.currentSubcategory;
        const matchesFavorites = !this.showFavoritesOnly || this.favorites.has(command.id);
        const matchesPlatform =
          this.currentPlatformFilter === "all" || command.platform === this.currentPlatformFilter;
        const matchesRequires =
          this.currentRequiresFilter === "all" ||
          (command.requires && command.requires.includes(this.currentRequiresFilter)) ||
          (command.variations && command.variations.some((v) => v.requires === this.currentRequiresFilter));
        const matchesProtocol =
          this.currentProtocolFilter === "all" ||
          (command.protocols && command.protocols.includes(this.currentProtocolFilter));
        return matchesCategory && matchesSubcategory && matchesFavorites && matchesPlatform && matchesRequires && matchesProtocol;
      });

      this.filteredCommands = pool
        .map((command) => ({ command, score: this.calculateSearchScore(command, searchTerm) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.command);
    } else {
      this.filterCommands();
    }

    this.renderCommands();
    this.updateBreadcrumb();
    this.updateShowAllButton();
  }

  // Simple and efficient search scoring (like HackTricks/TheHacker.recipes)
  calculateSearchScore(command, searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    const words = term.split(/\s+/).filter(word => word.length > 1);

    if (words.length === 0) return 0;

    let totalScore = 0;

    // Check each search word
    for (const word of words) {
      let wordScore = 0;

      // Name matching (highest priority)
      const name = command.name.toLowerCase();
      if (name.includes(word)) {
        wordScore += name === word ? 100 : 50; // Exact match vs partial
      } else if (this.subsequenceMatch(name, word)) {
        wordScore += 25; // Fuzzy: typed letters appear in order
      }

      // Description matching (high priority)
      const description = command.description.toLowerCase();
      if (description.includes(word)) {
        wordScore += 30;
      }

      // Tags matching (medium priority)
      const tagMatches = (command.tags || []).filter(tag =>
        tag.toLowerCase().includes(word)
      );
      if (tagMatches.length > 0) {
        wordScore += 20;
      } else if ((command.tags || []).some(tag => this.subsequenceMatch(tag.toLowerCase(), word))) {
        wordScore += 8;
      }

      // Command text matching (lower priority)
      if (command.command.toLowerCase().includes(word)) {
        wordScore += 10;
      }

      // Id matching — useful for permalink-style searches
      if (command.id && command.id.toLowerCase().includes(word)) {
        wordScore += 15;
      }

      // If this word doesn't match anything, reduce total score significantly
      if (wordScore === 0) {
        totalScore -= 50;
      } else {
        totalScore += wordScore;
      }
    }

    return Math.max(0, totalScore);
  }

  // Returns true if every char of needle appears in haystack in order (typo-tolerant fuzzy match).
  subsequenceMatch(haystack, needle) {
    if (!needle || needle.length < 2) return false;
    let i = 0;
    for (let j = 0; j < haystack.length && i < needle.length; j++) {
      if (haystack[j] === needle[i]) i++;
    }
    return i === needle.length;
  }

  // Setup event listeners
  setupEventListeners() {
    // Global search
    const searchBox = document.getElementById("global-search");
    if (searchBox) {
      searchBox.addEventListener("input", (e) => {
        const v = e.target.value;
        clearTimeout(this._searchDebounce);
        this._searchDebounce = setTimeout(() => this.handleSearch(v), 80);
      });
    }

    // Show All Commands button
    const showAllBtn = document.getElementById("show-all-btn");
    if (showAllBtn) {
      showAllBtn.addEventListener("click", () => {
        this.clearCategorySelection();
      });
    }

    // Favorites button
    const favoritesBtn = document.getElementById("favorites-btn");
    if (favoritesBtn) {
      favoritesBtn.addEventListener("click", () => {
        this.toggleFavoritesView();
      });
    }

    // Filters (platform, requires, protocol)
    const platformFilter = document.getElementById("platform-filter");
    if (platformFilter) {
      platformFilter.addEventListener("change", (e) => {
        this.currentPlatformFilter = e.target.value;
        this.applyFilters();
      });
    }

    const requiresFilter = document.getElementById("requires-filter");
    if (requiresFilter) {
      requiresFilter.addEventListener("change", (e) => {
        this.currentRequiresFilter = e.target.value;
        this.applyFilters();
      });
    }

    const protocolFilter = document.getElementById("protocol-filter");
    if (protocolFilter) {
      protocolFilter.addEventListener("change", (e) => {
        this.currentProtocolFilter = e.target.value;
        this.applyFilters();
      });
    }

    // Category navigation and top bar controls
    document.addEventListener("click", (e) => {
      // Category header clicks
      if (e.target.closest(".category-header")) {
        const categoryId =
          e.target.closest(".category-header").dataset.category;
        this.toggleCategory(categoryId);
      }

      // Subcategory clicks
      if (e.target.classList.contains("subcategory")) {
        const categoryId = e.target.dataset.category;
        const subcategoryId = e.target.dataset.subcategory;
        this.selectSubcategory(categoryId, subcategoryId);
      }

      // Favorite button clicks
      if (e.target.classList.contains("favorite-btn")) {
        e.stopPropagation(); // Prevent command selection
        const commandId = e.target.dataset.commandId;
        this.toggleFavorite(commandId);
        return;
      }

      // Command item clicks
      if (e.target.closest(".command-item")) {
        const commandId = e.target.closest(".command-item").dataset.commandId;
        this.selectCommand(commandId);
      }

      // Modal close buttons
      if (e.target.dataset.close) {
        this.closeModal(e.target.dataset.close);
      }

      // Special handling for list management modal close button
      if (e.target.id === "close-list-modal") {
        this.toggleListManagement();
      }

      // Action buttons with data attributes
      if (e.target.dataset.action) {
        this.handleAction(e.target.dataset.action, e);
      }

      // Close profile manage menu when clicking outside
      if (!e.target.closest("#profile-switcher")) {
        const menu = document.getElementById("profile-manage-menu");
        if (menu) menu.style.display = "none";
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      const inField = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || "");

      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        const searchBox = document.getElementById("global-search");
        if (searchBox) searchBox.focus();
      }

      // `/` focuses search (Slack/HTB-style)
      if (!inField && e.key === "/") {
        e.preventDefault();
        const searchBox = document.getElementById("global-search");
        if (searchBox) searchBox.focus();
      }

      // `?` opens shortcuts help
      if (!inField && e.key === "?") {
        e.preventDefault();
        this.toggleShortcutsModal();
      }

      // Arrow nav through filtered command list
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !inField) {
        if (this.filteredCommands && this.filteredCommands.length) {
          e.preventDefault();
          const cur = this.selectedCommand
            ? this.filteredCommands.findIndex((c) => c.id === this.selectedCommand.id)
            : -1;
          let next = e.key === "ArrowDown" ? cur + 1 : cur - 1;
          if (next < 0) next = 0;
          if (next >= this.filteredCommands.length) next = this.filteredCommands.length - 1;
          const target = this.filteredCommands[next];
          if (target) {
            this.selectCommand(target.id);
            const el = document.querySelector(`[data-command-id="${target.id}"]`);
            if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
          }
        }
      }

      if (e.key === "Escape") {
        const shortcutsModal = document.getElementById("shortcuts-modal");
        if (shortcutsModal && shortcutsModal.style.display !== "none") {
          shortcutsModal.style.display = "none";
          return;
        }
        // Close any open dropdowns
        document.querySelectorAll(".dropdown-list.show").forEach((dropdown) => {
          dropdown.classList.remove("show");
        });

        // Close custom command modal
        const customModal = document.getElementById("custom-command-modal");
        if (customModal && customModal.style.display !== "none") {
          this.toggleCustomCommand();
        }

        // Close list management modal
        const listModal = document.getElementById("list-management-modal");
        if (listModal && listModal.style.display !== "none") {
          this.toggleListManagement();
        }
      }
    });

    // Browser warning before unload
    window.addEventListener("beforeunload", (e) => {
      const hasData = Object.values(this.lists).some((list) => list.length > 0);
      if (hasData) {
        const message =
          "You have data in your lists. Consider exporting them before leaving.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    });
  }

  // List management functions
  toggleListManagement() {
    const modal = document.getElementById("list-management-modal");
    if (!modal) return;

    const isVisible = modal.style.display !== "none";

    if (isVisible) {
      modal.style.display = "none";
      this.releaseFocusTrap();
    } else {
      modal.style.display = "block";
      this.renderListTabs();
      this.renderListContent();
      this.setupListModalEvents();
      this.trapFocus(modal);
    }
  }

  // Render dynamic list tabs including custom asset types
  renderListTabs() {
    const tabsContainer = document.querySelector('.list-tabs');
    if (!tabsContainer) return;

    // Default asset types
    const defaultTypes = [
      { id: 'ips', name: 'IPs' },
      { id: 'users', name: 'Users' },
      { id: 'passwords', name: 'Passwords' },
      { id: 'domains', name: 'Domains' },
      { id: 'hashes', name: 'Hashes' }
    ];

    // Combine default and custom types
    const allTypes = [
      ...defaultTypes,
      ...this.customAssetTypes.map(type => ({
        id: type.id,
        name: type.name,
        icon: type.icon || '📦'
      }))
    ];

    // Generate tabs HTML
    const tabsHTML = allTypes.map(type => `
      <button class="list-tab ${type.id === this.currentListTab ? 'active' : ''}"
              data-list-type="${type.id}">
        ${type.icon ? type.icon + ' ' : ''}${type.name}
        ${!defaultTypes.find(dt => dt.id === type.id) ?
          `<span class="delete-asset-type" data-type-id="${type.id}" title="Delete custom type">×</span>` :
          ''
        }
      </button>
    `).join('');

    // Add "Add Custom Type" button
    const addCustomButton = `
      <button class="list-tab add-custom-type" title="Add custom asset type">
        ➕ Add List
      </button>
    `;

    tabsContainer.innerHTML = tabsHTML + addCustomButton;
  }

  // Add new custom asset type
  addCustomAssetType() {
    const name = prompt("Enter the name for your custom asset type (e.g., 'API Keys', 'Certificates'):");
    if (!name || name.trim() === "") return;

    const icon = prompt("Enter an emoji icon for this type (or press OK for default 📦):", "📦");

    // Generate unique ID from name
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    // Check if ID already exists
    if (this.lists[id] || this.defaultAssetTypes.includes(id)) {
      alert("An asset type with this name already exists. Please choose a different name.");
      return;
    }

    // Create new custom type
    const newType = {
      id: id,
      name: name.trim(),
      icon: icon || "📦",
      created: new Date().toISOString()
    };

    // Add to custom types and initialize empty list
    this.customAssetTypes.push(newType);
    this.lists[id] = [];

    // Save and refresh
    this.saveCustomAssetTypes();
    this.saveLists();
    this.renderListTabs();
    this.renderContextBar();
    this.showToast(`Custom asset type "${name}" created successfully!`);
  }

  // Delete custom asset type
  deleteCustomAssetType(typeId) {
    const type = this.customAssetTypes.find(t => t.id === typeId);
    if (!type) return;

    const itemCount = this.lists[typeId] ? this.lists[typeId].length : 0;
    const confirmMessage = itemCount > 0
      ? `Are you sure you want to delete "${type.name}"? This will also delete ${itemCount} items in this list.`
      : `Are you sure you want to delete "${type.name}"?`;

    if (!confirm(confirmMessage)) return;

    // Remove from custom types and lists
    this.customAssetTypes = this.customAssetTypes.filter(t => t.id !== typeId);
    delete this.lists[typeId];

    // Save and refresh
    this.saveCustomAssetTypes();
    this.saveLists();
    this.renderListTabs();
    this.renderContextBar();

    // Switch to default tab if current tab was deleted
    if (this.currentListTab === typeId) {
      this.currentListTab = "ips";
    }

    this.renderListContent();
    this.showToast(`Custom asset type "${type.name}" deleted successfully!`);
  }

  setupListModalEvents() {
    // Close button - handled by main event delegation
    // File inputs
    const importBackupInput = document.getElementById("import-backup");
    if (importBackupInput) {
      importBackupInput.onchange = () => this.handleImportBackup();
    }

    const importAllInput = document.getElementById("import-all-lists");
    if (importAllInput) {
      importAllInput.onchange = () => this.handleImportAllLists();
    }

    // Click outside to close
    const modal = document.getElementById("list-management-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.toggleListManagement();
        }
      });
    }
  }

  switchListTab(listType) {
    this.currentListTab = listType;

    // Update tab states
    document
      .querySelectorAll(".list-tab")
      .forEach((tab) => tab.classList.remove("active"));
    const activeTab = document.querySelector(`[data-list-type="${listType}"]`);
    if (activeTab) {
      activeTab.classList.add("active");
    }

    this.renderListContent();
  }

  // Render list content with table UI (supports annotations)
  renderListContent() {
    const container = document.getElementById("list-content");
    if (!container) return;

    const listData = this.lists[this.currentListTab] || [];

    container.innerHTML = `
        <div class="list-controls-row">
            <input type="file" id="import-${this.currentListTab}" accept=".txt,.lst" style="display: none;">
            <button class="btn" data-action="import-list" data-list-type="${this.currentListTab}">Import</button>
            <button class="btn" data-action="export-list" data-list-type="${this.currentListTab}">Export</button>
            <button class="btn btn-danger" data-action="clear-list" data-list-type="${this.currentListTab}">Clear</button>
            <button class="btn" data-action="bulk-import">Bulk Add</button>
            <span class="list-count-display">${listData.length} items</span>
        </div>
        <div class="list-items-table" id="list-items-table">
            ${listData.map((item, index) => `
                <div class="list-item-row" data-index="${index}">
                    <input type="text" class="list-value-input" value="${this.escapeHtml(item.value)}" placeholder="Value..." data-index="${index}" data-field="value">
                    <input type="text" class="list-tag-input" value="${this.escapeHtml(item.tag || '')}" placeholder="Tag/Note..." data-index="${index}" data-field="tag">
                    <button class="btn btn-danger list-item-delete" data-index="${index}" title="Remove">&#215;</button>
                </div>
            `).join('')}
        </div>
        <button class="btn list-add-item-btn" data-action="add-list-item">+ Add Item</button>
        <div class="bulk-import-section" id="bulk-import-section" style="display: none;">
            <textarea class="list-textarea" id="bulk-import-textarea" placeholder="Paste items here, one per line. Use tab to separate value and tag."></textarea>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="btn btn-primary" data-action="apply-bulk-import">Apply</button>
                <button class="btn" data-action="cancel-bulk-import">Cancel</button>
            </div>
        </div>
    `;

    // Setup file input event listener
    const fileInput = document.getElementById(`import-${this.currentListTab}`);
    if (fileInput) {
      fileInput.addEventListener("change", () =>
        this.handleFileImport(this.currentListTab)
      );
    }

    // Setup list item events
    this.setupListContentEvents();
  }

  // Setup event delegation for list table interactions
  setupListContentEvents() {
    const table = document.getElementById("list-items-table");
    if (!table) return;

    table.addEventListener("input", (e) => {
      if (e.target.classList.contains("list-value-input") || e.target.classList.contains("list-tag-input")) {
        const index = parseInt(e.target.dataset.index);
        const field = e.target.dataset.field;
        if (this.lists[this.currentListTab] && this.lists[this.currentListTab][index]) {
          this.lists[this.currentListTab][index][field] = e.target.value;
          this.saveLists();
          // Update count
          const countEl = document.querySelector(".list-count-display");
          if (countEl) {
            countEl.textContent = `${this.lists[this.currentListTab].length} items`;
          }
        }
      }
    });

    table.addEventListener("click", (e) => {
      if (e.target.classList.contains("list-item-delete")) {
        const index = parseInt(e.target.dataset.index);
        this.lists[this.currentListTab].splice(index, 1);
        this.saveLists();
        this.renderListContent();
      }
    });
  }

  // Add a new empty list item
  addListItem() {
    if (!this.lists[this.currentListTab]) {
      this.lists[this.currentListTab] = [];
    }
    this.lists[this.currentListTab].push({ value: '', tag: '' });
    this.saveLists();
    this.renderListContent();
    // Focus the new value input
    const inputs = document.querySelectorAll('.list-value-input');
    if (inputs.length > 0) {
      inputs[inputs.length - 1].focus();
    }
  }

  // Toggle bulk import section visibility
  toggleBulkImport() {
    const section = document.getElementById("bulk-import-section");
    if (section) {
      section.style.display = section.style.display === "none" ? "block" : "none";
      if (section.style.display === "block") {
        const textarea = document.getElementById("bulk-import-textarea");
        if (textarea) {
          textarea.value = "";
          textarea.focus();
        }
      }
    }
  }

  // Apply bulk import from textarea
  applyBulkImport() {
    const textarea = document.getElementById("bulk-import-textarea");
    if (!textarea || !textarea.value.trim()) return;

    const newItems = textarea.value.split("\n").filter(line => line.trim() !== "").map(line => {
      const parts = line.split("\t");
      return { value: parts[0].trim(), tag: (parts[1] || '').trim() };
    });

    if (!this.lists[this.currentListTab]) {
      this.lists[this.currentListTab] = [];
    }
    this.lists[this.currentListTab] = [...this.lists[this.currentListTab], ...newItems];
    this.saveLists();
    this.renderListContent();
    this.showToast(`Added ${newItems.length} items`);
  }

  // Update list (kept for backwards compatibility)
  updateList(listType) {
    const textarea = document.getElementById(`list-${listType}`);
    if (textarea) {
      const values = textarea.value
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map(line => {
          const parts = line.split("\t");
          return { value: parts[0].trim(), tag: (parts[1] || '').trim() };
        });
      this.lists[listType] = values;
      this.saveLists();

      // Update count display
      const countEl = document.querySelector(".list-count-display");
      if (countEl) {
        countEl.textContent = `${values.length} items`;
      }
    }
  }

  // Handle file import (supports tab-separated value+tag format)
  handleFileImport(listType) {
    const fileInput = document.getElementById(`import-${listType}`);
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const newItems = content.split("\n").filter(line => line.trim() !== "").map(line => {
          const parts = line.split("\t");
          return { value: parts[0].trim(), tag: (parts[1] || '').trim() };
        });

        if (!this.lists[listType]) this.lists[listType] = [];
        this.lists[listType] = [...this.lists[listType], ...newItems];

        this.saveLists();
        this.renderListContent();
        this.showToast(`Imported ${newItems.length} items to ${listType} list`);
      };
      reader.readAsText(file);
    }
  }

  importList(listType) {
    const fileInput = document.getElementById(`import-${listType}`);
    if (fileInput) {
      fileInput.click();
    }
  }

  // Export list (tab-separated format for value+tag)
  exportList(listType) {
    const values = this.lists[listType] || [];
    if (values.length === 0) {
      this.showToast(`${listType} list is empty`, "error");
      return;
    }

    const content = values.map(item =>
      item.tag ? `${item.value}\t${item.tag}` : item.value
    ).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${listType}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast(`Exported ${values.length} ${listType} items`);
  }

  clearList(listType) {
    if (confirm(`Are you sure you want to clear the ${listType} list?`)) {
      this.lists[listType] = [];
      this.saveLists();
      this.renderListContent();
      this.showToast(`${listType} list cleared`);
    }
  }

  exportData() {
    const exportData = {
      lists: this.lists,
      timestamp: new Date().toISOString(),
      version: "2.0",
    };

    const content = JSON.stringify(exportData, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `command-manager-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast("Data exported successfully");
  }

  // Import all lists functionality
  importAllLists() {
    const fileInput = document.getElementById("import-all-lists");
    if (fileInput) {
      fileInput.click();
    }
  }

  handleImportAllLists() {
    const fileInput = document.getElementById("import-all-lists");
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const importData = JSON.parse(content);

          if (importData.lists && typeof importData.lists === "object") {
            // Merge imported lists with existing ones
            let importedCount = 0;
            Object.keys(this.lists).forEach((listType) => {
              if (
                importData.lists[listType] &&
                Array.isArray(importData.lists[listType])
              ) {
                const existingValues = (this.lists[listType] || []).map(item => item.value);
                const newItems = importData.lists[listType]
                  .map(item => typeof item === 'string' ? { value: item, tag: '' } : item)
                  .filter(item => !existingValues.includes(item.value));
                this.lists[listType] = [...(this.lists[listType] || []), ...newItems];
                importedCount += newItems.length;
              }
            });

            this.saveLists();
            this.renderListContent();
            this.showToast(
              `Imported ${importedCount} new items across all lists`
            );
          } else {
            this.showToast(
              "Invalid file format. Expected JSON with lists object.",
              "error"
            );
          }
        } catch (error) {
          console.error("Error importing lists:", error);
          this.showToast(
            "Error importing file. Please check the file format.",
            "error"
          );
        }
      };
      reader.readAsText(file);
    }
  }

  // Export all lists functionality
  exportAllLists() {
    const hasData = Object.values(this.lists).some((list) => list.length > 0);
    if (!hasData) {
      this.showToast("No lists to export", "error");
      return;
    }

    const profileName = (this.profileMeta.profiles.find(p => p.id === this.activeProfileId) || {}).name || "default";

    const exportData = {
      lists: this.lists,
      timestamp: new Date().toISOString(),
      version: "2.0",
      profileName: profileName,
      totalItems: Object.values(this.lists).reduce(
        (sum, list) => sum + list.length,
        0
      ),
    };

    const content = JSON.stringify(exportData, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${profileName.toLowerCase().replace(/\s+/g, '-')}-lists-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast(`Exported all lists (${exportData.totalItems} total items)`);
  }

  // Clear all lists functionality
  clearAllLists() {
    const hasData = Object.values(this.lists).some((list) => list.length > 0);
    if (!hasData) {
      this.showToast("All lists are already empty", "error");
      return;
    }

    if (
      confirm(
        "Are you sure you want to clear ALL lists? This cannot be undone."
      )
    ) {
      const totalItems = Object.values(this.lists).reduce(
        (sum, list) => sum + list.length,
        0
      );

      Object.keys(this.lists).forEach(key => {
        this.lists[key] = [];
      });

      this.saveLists();
      this.renderListContent();
      this.showToast(`Cleared all lists (${totalItems} items removed)`);
    }
  }

  // Custom Command Functions
  toggleCustomCommand() {
    const modal = document.getElementById("custom-command-modal");
    if (!modal) return;

    const isVisible = modal.style.display !== "none";

    if (isVisible) {
      modal.style.display = "none";
      this.releaseFocusTrap();
      // Clear form
      this.clearCustomCommandForm();
    } else {
      modal.style.display = "block";
      this.setupCustomCommandEvents();
      this.trapFocus(modal);
    }
  }

  clearCustomCommandForm() {
    const textarea = document.getElementById("custom-command-template");
    const select = document.getElementById("placeholder-pattern");
    const customInput = document.getElementById("custom-pattern-text");
    if (textarea) textarea.value = "";
    if (select) select.value = "<VAR>";
    if (customInput) customInput.value = "";
    this.toggleCustomPatternInput();
  }

  setupCustomCommandEvents() {
    const patternSelect = document.getElementById("placeholder-pattern");
    if (patternSelect) {
      patternSelect.addEventListener("change", () =>
        this.toggleCustomPatternInput()
      );
    }

    // Click outside to close
    const modal = document.getElementById("custom-command-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.toggleCustomCommand();
        }
      });
    }
  }

  toggleCustomPatternInput() {
    const select = document.getElementById("placeholder-pattern");
    const customInputDiv = document.getElementById("custom-pattern-input");

    if (select && customInputDiv) {
      if (select.value === "custom") {
        customInputDiv.classList.remove("custom-pattern-section");
        customInputDiv.style.display = "block";
      } else {
        customInputDiv.classList.add("custom-pattern-section");
        customInputDiv.style.display = "none";
      }
    }
  }

  processCustomCommand() {
    const textarea = document.getElementById("custom-command-template");
    const patternSelect = document.getElementById("placeholder-pattern");
    const customPatternInput = document.getElementById("custom-pattern-text");

    if (!textarea || !patternSelect) return;

    let command = textarea.value.trim();
    if (!command) {
      this.showToast("Please enter a command template", "error");
      return;
    }

    let pattern = patternSelect.value;
    if (pattern === "custom") {
      pattern = customPatternInput ? customPatternInput.value.trim() : "";
      if (!pattern) {
        this.showToast("Please enter a custom pattern", "error");
        return;
      }
    }

    // Convert command to our standard format
    const standardCommand = this.convertToStandardFormat(command, pattern);

    // Create a temporary command object
    this.selectedCommand = {
      id: "custom-temp",
      name: "Custom Command",
      command: standardCommand,
      description: "Custom command created by user",
      category: "custom",
      subcategory: "user-defined",
      tags: ["custom"],
    };

    // Close modal and render command builder
    this.toggleCustomCommand();
    this.renderCommandBuilder();
    this.showToast("Custom command processed successfully!");
  }

  convertToStandardFormat(command, pattern) {
    let standardCommand = command;

    // Extract placeholders based on pattern
    let placeholders = [];

    switch (pattern) {
      case "<VAR>":
        placeholders = [...command.matchAll(/<([^>]+)>/g)].map(
          (match) => match[1]
        );
        break;
      case "$VAR":
        placeholders = [...command.matchAll(/\$([A-Za-z_][A-Za-z0-9_]*)/g)].map(
          (match) => match[1]
        );
        standardCommand = command.replace(
          /\$([A-Za-z_][A-Za-z0-9_]*)/g,
          "<$1>"
        );
        break;
      case "{{VAR}}":
        placeholders = [...command.matchAll(/\{\{([^}]+)\}\}/g)].map(
          (match) => match[1]
        );
        standardCommand = command.replace(/\{\{([^}]+)\}\}/g, "<$1>");
        break;
      case "{VAR}":
        placeholders = [...command.matchAll(/\{([^}]+)\}/g)].map(
          (match) => match[1]
        );
        standardCommand = command.replace(/\{([^}]+)\}/g, "<$1>");
        break;
      case "[VAR]":
        placeholders = [...command.matchAll(/\[([^\]]+)\]/g)].map(
          (match) => match[1]
        );
        standardCommand = command.replace(/\[([^\]]+)\]/g, "<$1>");
        break;
      default: // custom pattern
        // Replace VAR in pattern with regex capture group
        const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regexPattern = escapedPattern.replace(
          "VAR",
          "([A-Za-z_][A-Za-z0-9_]*)"
        );
        const regex = new RegExp(regexPattern, "g");
        placeholders = [...command.matchAll(regex)].map((match) => match[1]);
        standardCommand = command.replace(regex, "<$1>");
        break;
    }

    return standardCommand;
  }

  // Toast notifications
  showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Global app instance
let app;

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  app = new CommandManager();

  // Setup list management modal event listeners
  setupListManagementEvents();
});

// Setup list management modal events
function setupListManagementEvents() {
  // List tab clicks and custom asset type actions
  document.addEventListener("click", (e) => {
    // Handle add custom type button
    if (e.target.classList.contains("add-custom-type") || e.target.closest(".add-custom-type")) {
      e.preventDefault();
      e.stopPropagation();
      app.addCustomAssetType();
      return;
    }

    // Handle delete custom type button
    if (e.target.classList.contains("delete-asset-type")) {
      e.preventDefault();
      e.stopPropagation();
      const typeId = e.target.dataset.typeId;
      app.deleteCustomAssetType(typeId);
      return;
    }

    // Handle list tab clicks
    if (e.target.classList.contains("list-tab") && !e.target.classList.contains("add-custom-type")) {
      const listType = e.target.dataset.listType;
      if (listType) {
        app.switchListTab(listType);
      }
    }
  });
}
