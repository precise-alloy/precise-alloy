interface Theme {
  value: string,
  name: string
};

interface StateOption {
  name: string,
  value: string
}

interface State {
  name: string,
  options?: StateOption[],
  multiple?: boolean
}

interface StateButton {
  parentSelector?: string,
  styleModifier: string,
  zIndex?: number
}

interface ComponentState {
  name: string,
  selector: string,
  button?: StateButton,
  states: State[]
}

(() => {
  let index = 100000;

  const themes: Theme[] = [
    {
      "value": "theme-blue-p",
      "name": "Blue"
    },
    {
      "value": "theme-white-p",
      "name": "White"
    },
    {
      "value": "theme-sand-s",
      "name": "Sand"
    },
    {
      "value": "theme-flow-25",
      "name": "Flow 25"
    },
    {
      "value": "theme-wave-ac",
      "name": "Wave"
    },
    {
      "value": "theme-wave-50",
      "name": "Wave 50"
    },
    {
      "value": "theme-pearl-s",
      "name": "Pearl"
    },
    {
      "value": "theme-pebble-s",
      "name": "Pebble"
    }
  ];

  const newId = () => {
    return "pl-state-id-" + index++;
  };

  const createSelect = (state: State, classList: DOMTokenList) => {
    if (!state.options) {
      return "";
    }

    const options = state.options;
    const name = newId();
    const header = state.multiple
      ? 'Select many...'
      : options.find(o => classList.contains(o.value))?.name ?? "---";
    const type = state.multiple ? 'checkbox' : 'radio';

    let optionsHtml = '';
    options.forEach((option: StateOption) => {
      const selectedHtml = classList.contains(option.value) ? "checked" : "";
      const id = newId();
      optionsHtml += `<input name="${name}" class="pl-state-bar__input" type="${type}" id="${id}" data-name="${option.name}" value="${option.value}" ${selectedHtml}/>`
        + `<label class="pl-state-bar__label" for="${id}"><span>${option.name}</span></label>`
    });

    let html = `<div class="pl-state-bar__group">`
      + `<div>${state.name}:</div>`
      + `<div class="pl-state-bar__group-header">${header}</div>`
      + `<div class="pl-state-bar__checkbox-group">${optionsHtml}</div>`
      + `</div>`;

    return html;
  };

  const deactiveStateButtons = () => {
    var stateButtons = [...document.querySelectorAll(".pl-state__button")];
    stateButtons.forEach(stateButton => stateButton.classList.remove("active"));
  };

  const closeButtonClickHandler = (stateBar: HTMLElement) => {
    stateBar.classList.remove("expand");
    document.body.classList.remove("pl-state-expand");
    deactiveStateButtons();
    window.dispatchEvent(new Event('resize'));
  };

  const stateButtonClickHandler = (item: HTMLElement, stateButton: HTMLElement, plState: ComponentState) => {
    deactiveStateButtons();

    const stateBar: HTMLElement | null = document.querySelector(".pl-state-bar");
    if (!stateBar) {
      return;
    }

    if (stateButton.classList.contains("active")) {
      closeButtonClickHandler(stateBar);
      return;
    }

    const stateBarContent = stateBar.querySelector(".pl-state-bar__content");
    if (stateBarContent) {
      let stateBarContentHtml = '';
      let index = 0;
      plState.states.forEach(state => {
        const combinedState = state.name === "Theme" && !state.options ? { ...state, options: themes } : state;
        stateBarContentHtml += createSelect(combinedState, item.classList);

        index++;

        if (index == 1) {
          stateBarContentHtml += stateBarCloseButtonHtml();
        }
      });
      stateBarContent.innerHTML = stateBarContentHtml;

      const closeButton = stateBarContent.querySelector(".pl-state-bar__close-button");
      if (closeButton) {
        closeButton.addEventListener("click", () => closeButtonClickHandler(stateBar));
      }

      const stateBarGroups = [...stateBarContent.querySelectorAll(".pl-state-bar__group")];
      stateBarGroups.forEach(stateBarGroup => {
        const stateBarGroupHeader = stateBarGroup.querySelector(".pl-state-bar__group-header");
        const checkboxGroup = stateBarGroup.querySelector(".pl-state-bar__checkbox-group");
        if (!stateBarGroupHeader || !checkboxGroup) {
          return;
        }

        if (stateBarGroupHeader) {
          stateBarGroupHeader.addEventListener("click", () => {
            checkboxGroup.classList.toggle("expand");
          });
          document.addEventListener("click", (e: MouseEvent) => {
            if (!e.target) {
              return;
            }

            const node = e.target as Node;

            if (!checkboxGroup.contains(node) && !stateBarGroupHeader.contains(node)) {
              checkboxGroup.classList.remove("expand");
            }
          })
        }

        const checkboxes = stateBarGroup.querySelectorAll("input[type='checkbox']");
        [].forEach.call(checkboxes, (checkbox: HTMLInputElement) => {
          checkbox.addEventListener("change", () => {
            if (!checkbox.value) {
              return;
            }

            if (checkbox.checked) {
              item.classList.add(checkbox.value);
            } else {
              item.classList.remove(checkbox.value);
            }
            window.dispatchEvent(new Event('resize'));
          });
        });

        const radios = stateBarGroup.querySelectorAll("input[type='radio']");
        [].forEach.call(radios, (radio: HTMLInputElement) => {
          radio.addEventListener("change", () => {
            [].forEach.call(radios, (r: HTMLInputElement) => {
              if (r.value) {
                item.classList.remove(r.value);
              }
            });
            if (radio.value) {
              item.classList.add(radio.value);
            }
            stateBarGroupHeader.textContent = radio.getAttribute("data-name");
            checkboxGroup.classList.remove("expand");
          });
        });

        const radioLabels = [...stateBarGroup.querySelectorAll("input[type='radio'] + label")];
        radioLabels.forEach(radioLabel => {
          radioLabel.addEventListener("click", () => {
            checkboxGroup.classList.remove("expand");
          });
        });
      });

      stateBar.classList.add("expand");
      stateButton.classList.add("active");
      document.body.classList.add("pl-state-expand");
      window.dispatchEvent(new Event('resize'));
    }
  };
  const stateBarCloseButtonHtml = () => {
    return `<div class="pl-state-bar__buttons"><a class="pl-state-bar__close-button"></a></div>`;
  };

  const appendButtons = (states: ComponentState[]) => {
    const stateBarHtml = `<div class="pl-state-bar"><div class="pl-state-bar__content"></div>${stateBarCloseButtonHtml()}</div>`;

    document.body.insertAdjacentHTML('beforeend', stateBarHtml);
    const stateBar: HTMLElement | null = document.querySelector(".pl-state-bar");
    if (!stateBar) {
      return;
    }

    const closeButton = stateBar.querySelector(".pl-state-bar__close-button");
    if (closeButton) {
      closeButton.addEventListener("click", () => closeButtonClickHandler(stateBar));
    }

    [].forEach.call(states, (plState: ComponentState) => {
      if (!plState || !plState.selector) {
        return;
      }

      const buttonModifier = plState.button?.styleModifier ?? '';
      const buttonTitle = plState.name ? `title="Show state modifier for: ${plState.name}"` : '';
      const buttonZIndex = plState.button?.zIndex ? `style="z-index: ${plState.button.zIndex};"` : '';

      const items = document.querySelectorAll(plState.selector);
      [].forEach.call(items, (item: HTMLElement) => {
        let html = `<div class="pl-state ${buttonModifier}" ${buttonZIndex}>`
          + `<div class="pl-state__controls">`
          + `<button class="pl-state__button" ${buttonTitle}>`
          + `<img src="/pl-states.svg" loading="async">`
          + `</button></div></div>`;

        const stateButtonParent = plState.button?.parentSelector ? item.querySelector(plState.button.parentSelector) : item;
        if (!stateButtonParent) {
          return;
        }
        stateButtonParent.insertAdjacentHTML('beforeend', html);

        const stateContainer: HTMLElement | null = stateButtonParent.querySelector(":scope > .pl-state");
        if (!stateContainer) {
          return;
        }

        const stateButton: HTMLElement | null = stateContainer.querySelector(".pl-state__button");
        if (stateButton) {
          stateButton.addEventListener("click", () => {
            stateButtonClickHandler(item, stateButton, plState);
          })
        }
      });
    });

    addEventListener("resize", function () {
      const stateBar = document.querySelector(".pl-state-bar");
      if (!stateBar) {
        return;
      }

      const stateBarRect = stateBar.getBoundingClientRect();
      document.documentElement.style.setProperty("--pl-state-bar-height", Math.ceil(stateBarRect.height) + "px");
    })
  };

  const init = () => {
    const localStorageKey = "pl-show-state-selector";
    const showStateSelector = localStorage.getItem(localStorageKey);

    if (!showStateSelector) {
      return;
    }

    fetch("/pl-states.json")
      .then((response) => response.json())
      .then((data) => appendButtons(data));
  };

  init();
})();
