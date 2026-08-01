import { SIMULATIONS } from './simulations.js';

function createTab(simulation) {
  const tab = document.createElement('button');
  tab.className = 'simulation-tab';
  tab.type = 'button';
  tab.id = `tab-${simulation.id}`;
  tab.role = 'tab';
  tab.setAttribute('aria-controls', `panel-${simulation.id}`);
  tab.setAttribute('aria-selected', 'false');
  tab.tabIndex = -1;
  tab.textContent = simulation.label;
  return tab;
}

function createPanel(simulation) {
  const panel = document.createElement('section');
  panel.className = 'simulation-panel';
  panel.id = `panel-${simulation.id}`;
  panel.role = 'tabpanel';
  panel.setAttribute('aria-labelledby', `tab-${simulation.id}`);
  panel.hidden = true;
  return panel;
}

function loadSimulation(panel, simulation) {
  if (panel.querySelector('.simulation-frame')) return;

  const frame = document.createElement('iframe');
  frame.className = 'simulation-frame';
  frame.title = simulation.label;
  frame.src = simulation.path;
  frame.loading = 'eager';
  frame.setAttribute('allow', 'fullscreen');
  panel.append(frame);
}

export function createWorkspace({ simulations, tabsRoot, panelsRoot }) {
  tabsRoot.replaceChildren();
  panelsRoot.replaceChildren();

  if (simulations.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No simulations available yet.';
    panelsRoot.append(emptyState);
    return { activate: () => {} };
  }

  const tabs = [];
  const panels = [];
  const activate = (index, { moveFocus = false } = {}) => {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel, panelIndex) => {
      const selected = panelIndex === index;
      panel.hidden = !selected;
      if (selected) loadSimulation(panel, simulations[panelIndex]);
    });

    if (moveFocus) tabs[index].focus();
  };

  simulations.forEach((simulation, index) => {
    const tab = createTab(simulation);
    const panel = createPanel(simulation);
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      activate(nextIndex, { moveFocus: true });
    });
    tabsRoot.append(tab);
    panelsRoot.append(panel);
    tabs.push(tab);
    panels.push(panel);
  });

  activate(0);
  return { activate };
}

document.addEventListener('DOMContentLoaded', () => {
  createWorkspace({
    simulations: SIMULATIONS,
    tabsRoot: document.querySelector('#simulation-tabs'),
    panelsRoot: document.querySelector('#simulation-panels')
  });
});
