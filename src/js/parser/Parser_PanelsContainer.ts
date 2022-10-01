import InstanceState from "../state/InstanceState"
import PanelsContainer from "../components/PanelsContainer"
import Parser_Panel from "./Parser_Panel"
import Renderer_PanelsContainer from "../renderer/Renderer_PanelsContainer"
import Panel from "../components/Panel"

export default class Parser_PanelsContainer {

  /**
   * Reads existing HTML for a panels container element and creates relevant object hierarchy from it.
   * This method recurses into the panels themselves and parses those as well.
   * @param {HTMLElement} panels_container_element the panels container HTML element
   * @param state State object for this instance
  */
  public static parse(panels_container_element: HTMLElement, state: InstanceState): void {

    const panels_container = new PanelsContainer(state)
    panels_container.element = panels_container_element

    state.panels_container = panels_container

    Renderer_PanelsContainer.applyAttributes(panels_container.element, state.panels_container, state)

    const panel_element = panels_container_element.querySelector(state.options.selectors.panel)

    if ( panel_element ) {

      const panel = new Panel(state.panels_container, state)

      panel.element = panel_element
      panel.depth = 0

      state.panels_container.addPanel(panel)

      Parser_Panel.parse(panel, state)
    }

  }
}