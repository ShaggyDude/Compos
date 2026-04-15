// Shared layout components for Cognatix V1.2 prototype
// Hardcoded projects
const PROJECTS = [
  { name: 'petra', label: 'Petra', slug: 'petra', desc: 'Open-source non-profit ERP for donations, accounting, and contact management.', files: '1.4K', loc: '581.9K', functions: 20, cycle: 4, status: 'Ready', lastBuild: 'Mon Mar 30 2026', icon: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>' },
  { name: 'clearwave', label: 'Clearwave', slug: 'clearwave', desc: 'Insurance eligibility, patient registration, EDI transactions, HIPAA audit trails.', files: '2.1K', loc: '340.2K', functions: 34, cycle: 7, status: 'Ready', lastBuild: 'Fri Apr 04 2026', icon: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>' }
];

function projectIcon(p) {
  return `<span class="inline-flex items-center justify-center size-7 rounded-md inks-sage-500 shrink-0">
    <svg class="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${p.icon}</svg>
  </span>`;
}

// Detect current sub-page within a project
function getCurrentPage(path) {
  // Build detail (builds/4.html etc) → drop to builds list
  if (/\/builds\/\d+\.html/.test(path)) return 'builds';
  if (path.includes('/settings')) return 'settings';
  if (path.includes('/analysis')) return 'analysis';
  if (path.includes('/builds')) return 'builds';
  return 'overview';
}

// Detect current context from URL
function getContext() {
  const path = window.location.pathname;
  // Find which project we're in, if any
  for (const p of PROJECTS) {
    if (path.includes(`/projects/${p.slug}`)) {
      return { scope: 'project', project: p, page: getCurrentPage(path), path };
    }
  }
  return { scope: 'global', project: null, page: null, path };
}

function getRoot() {
  const parts = window.location.pathname.split('/');
  // Anchor on 'projects' as a directory (not 'projects.html')
  const idx = parts.findIndex((p, i) => p === 'projects' && i < parts.length - 1);
  if (idx === -1) return './'; // root-level page
  const depth = parts.slice(idx).length - 1; // exclude filename
  return '../'.repeat(depth);
}

// Render sidebar
function renderSidebar(ctx) {
  const root = getRoot();
  const isGlobal = ctx.scope === 'global';
  const path = window.location.pathname;

  const isActive = (href) => {
    const hrefFile = href.split('/').pop();
    const pathFile = path.split('/').pop();
    return hrefFile === pathFile;
  };

  let navItems = '';
  if (isGlobal) {
    navItems = `
      <a href="${root}projects.html" class="sidebar-link ${isActive(root + 'projects.html') ? 'active' : ''}">
        <svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
        Projects
      </a>
      <a href="${root}builds.html" class="sidebar-link ${isActive(root + 'builds.html') ? 'active' : ''}">
        <svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        Builds
      </a>
    `;
  } else {
    const p = ctx.project;
    navItems = `
      <a href="${root}projects/${p.slug}/overview.html" class="sidebar-link ${ctx.page === 'overview' ? 'active raised' : ''}">
        <svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        Overview
      </a>
      <a href="${root}projects/${p.slug}/builds.html" class="sidebar-link ${ctx.page === 'builds' ? 'active raised' : ''}">
        <svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        Builds
      </a>
      <hr class="my-6 border-t" />
      <a href="${root}projects/${p.slug}/analysis.html" class="sidebar-link ${ctx.page === 'analysis' ? 'active raised' : ''}">
        <svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/><path d="M7 8h10"/><path d="M7 16h10"/></svg>
        Analysis
      </a>
      <a href="${root}projects/${p.slug}/settings.html" class="sidebar-link ${ctx.page === 'settings' ? 'active raised' : ''}">
        <svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        Project Settings
      </a>
    `;
  }

  return `
    <aside class="sidebar raised flex flex-col h-screen w-56 shrink-0 border-r fixed left-0 top-0 z-30">
      <!-- Logo -->
      <div class="px-6 py-8">
        <a href="${root}projects.html" class="group flex items-center gap-1.5 no-underline">
          <span class="text-ink-sage-1000 opacity-80 transition group-hover:opacity-100m text-xl mb-1">Cognatix</span>
          <img src="${root}images/favicon.svg" alt="Cognatix" class="size-5 saturate-0 opacity-80 transition group-hover:saturate-100 group-hover:opacity-100">
        </a>
      </div>

      <!-- Nav -->
      <nav class="flex-1 flex flex-col gap-0.5 px-2 pt-2">
        ${navItems}
      </nav>

      <!-- Bottom section -->
      <div class="border-t px-2 py-2">
        <a href="${root}settings.html" class="sidebar-link ${
    isActive("settings.html") && ctx.scope === "global" ? "active" : ""
  }">
          <svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Account Settings
        </a>
      </div>

      <!-- Avatar -->
      <div class="border-t px-2 py-3">
        <button onclick="toggleAvatarMenu()" class="avatar-btn flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm hover:bg-ink-sage-100/20 transition">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded inks-sage-500 text-xs font-medium">S</span>
          <span class="flex flex-col items-start leading-tight">
            <span class="text-sm font-medium">Scott</span>
            <span class="text-xs opacity-50">Cognatix</span>
          </span>
        </button>
        <div id="avatar-menu" class="hidden absolute bottom-16 left-2 w-48 raised rounded py-1 z-50">
          <div class="px-3 py-2 border-b">
            <div class="text-sm font-medium">Scott</div>
            <div class="text-xs opacity-50">scott@sage-tech.ai</div>
          </div>
          <a href="#" class="block px-3 py-1.5 text-sm hover:bg-ink-sage-100/20 transition">Profile</a>
          <div class="border-t mt-1 pt-1">
            <a href="#" class="block px-3 py-1.5 text-sm hover:bg-ink-sage-100/20 transition">Sign Out</a>
          </div>
        </div>
      </div>
    </aside>
  `;
}

// Render header
function renderHeader(ctx, opts = {}) {
  const root = getRoot();
  const { title, breadcrumb, breadcrumbLink, actions } = opts;

  let projectSwitcher = '';
  if (ctx.scope === 'project') {
    projectSwitcher = `
      <div class="relative">
        <button onclick="toggleProjectSwitcher()" class="flex items-center gap-2 text-lg hover:opacity-80 transition">
          ${projectIcon(ctx.project)}
          ${ctx.project.label}
          <svg class="lucide opacity-40" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
          <a href="${root}projects.html" onclick="event.stopPropagation()" class="p-1 rounded hover:bg-ink-sage-100/30 transition no-underline opacity-50 hover:opacity-100" title="Back to all projects">
            <svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </a>
        </button>
        <div id="project-switcher" class="hidden absolute top-full left-0 mt-2 w-72 raised rounded py-1 z-50">
          <div class="flex items-center gap-2 px-3 py-2">
            <input type="text" placeholder="Find Project..." class="flex-1 px-2 py-1.5 text-sm rounded bg-ink-gray-100/50 border border-ink-gray-200/30 outline-none">
            <button onclick="toggleProjectSwitcher()" class="p-1 rounded hover:bg-ink-sage-100/30 transition text-xs opacity-50 border border-ink-gray-300/30 px-1.5 py-0.5">Esc</button>
          </div>
          ${PROJECTS.map(p => `
            <a href="${root}projects/${p.slug}/${ctx.page || 'overview'}.html" class="flex items-center justify-between px-3 py-2 text-sm hover:bg-ink-sage-100/20 transition no-underline">
              <span class="flex items-center gap-2">${projectIcon(p)}<span class="font-medium">${p.label}</span></span>
              ${p.slug === ctx.project?.slug ? '<svg class="lucide text-ink-sage-500" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' : ''}
            </a>
          `).join('')}
          <div class="border-t mt-1 pt-1">
            <a href="#" class="flex items-center gap-2 px-3 py-2 text-sm text-ink-sage-500 hover:bg-ink-sage-100/20 transition no-underline">
              <svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Create Project
            </a>
          </div>
        </div>
      </div>
    `;
  } else {
    projectSwitcher = `<h1 class="text-lg">${title || 'Projects'}</h1>`;
  }

  let breadcrumbHtml = '';
  if (breadcrumb) {
    const parts = breadcrumb.split(' / ');
    let crumbs = '';
    if (parts.length > 1 && breadcrumbLink) {
      crumbs = `<a href="${breadcrumbLink}" class="opacity-60 hover:opacity-100 no-underline transition">${parts[0]}</a><span class="opacity-30 mx-2">/</span><span class="opacity-60">${parts.slice(1).join(' / ')}</span>`;
    } else if (breadcrumbLink) {
      crumbs = `<a href="${breadcrumbLink}" class="opacity-60 hover:opacity-100 no-underline transition">${breadcrumb}</a>`;
    } else {
      crumbs = `<span class="opacity-60">${breadcrumb}</span>`;
    }
    breadcrumbHtml = crumbs;
  }

  return `
    <header class="relative flex items-center justify-between px-12 py-8">
      <div class="raised absolute inset-0 pointer-events-none"></div>
      <div class="flex items-center gap-2">
        ${projectSwitcher}
      </div>
      ${breadcrumbHtml ? `<div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 text-sm opacity-60">${breadcrumbHtml}</div>` : ''}
      <div class="flex items-center gap-2 z-10">
        ${actions || ''}
      </div>
    </header>
  `;
}

// Toggle functions
function toggleProjectSwitcher() {
  const el = document.getElementById('project-switcher');
  el?.classList.toggle('hidden');
  // Close avatar menu if open
  document.getElementById('avatar-menu')?.classList.add('hidden');
}

function toggleAvatarMenu() {
  const el = document.getElementById('avatar-menu');
  el?.classList.toggle('hidden');
  // Close project switcher if open
  document.getElementById('project-switcher')?.classList.add('hidden');
}

function toggleOverflow(id) {
  const el = document.getElementById(id);
  el?.classList.toggle('hidden');
  // Close any other overflow menus
  document.querySelectorAll('.overflow-menu').forEach(m => {
    if (m.id !== id) m.classList.add('hidden');
  });
}

function toggleCollapse(id) {
  const el = document.getElementById(id);
  const icon = document.getElementById(id + '-icon');
  el?.classList.toggle('hidden');
  if (icon) {
    icon.style.transform = el?.classList.contains('hidden') ? '' : 'rotate(90deg)';
  }
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.avatar-btn') && !e.target.closest('#avatar-menu')) {
    document.getElementById('avatar-menu')?.classList.add('hidden');
  }
  if (!e.target.closest('[onclick*="toggleProjectSwitcher"]') && !e.target.closest('#project-switcher')) {
    document.getElementById('project-switcher')?.classList.add('hidden');
  }
  if (!e.target.closest('[onclick*="toggleOverflow"]') && !e.target.closest('.overflow-menu')) {
    document.querySelectorAll('.overflow-menu').forEach(m => m.classList.add('hidden'));
  }
});

// Close dropdowns on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('project-switcher')?.classList.add('hidden');
    document.getElementById('avatar-menu')?.classList.add('hidden');
    document.querySelectorAll('.overflow-menu').forEach(m => m.classList.add('hidden'));
  }
});

// Initialize layout
function initLayout(opts = {}) {
  const ctx = getContext();
  const sidebar = document.getElementById('sidebar');
  const header = document.getElementById('header');

  if (sidebar) sidebar.innerHTML = renderSidebar(ctx);
  if (header) header.innerHTML = renderHeader(ctx, opts);

  const s = document.createElement('script');
  s.src = getRoot() + 'scripts/topology.js';
  document.body.appendChild(s);
}
