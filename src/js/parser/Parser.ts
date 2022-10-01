/**
 * This class is used to parse an existing traversable-compatible menu structure into
 * the appropriate objects & structures. 
 * It's used when the HTML for the menu is pre-prepared, rather than having menu items
 * passed as a JSON object. 
 */

import InstanceState from "../state/InstanceState"
import Parser_PanelsContainer from "./Parser_PanelsContainer"

export default class Parser {

  public static parse(panels_container_selector: string, state: InstanceState): void | boolean {

    const panels_container = document.querySelector(panels_container_selector)

    if (!panels_container) {
      if (!state.options.errors.silent_if_no_container) {
        console.error(`Could not find menu container. Selector was${panels_container_selector}`)
      }
      return false
    }

    Parser_PanelsContainer.parse(panels_container as HTMLElement, state)

  }
}
