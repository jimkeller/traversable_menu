import { Renderer } from "./Renderer"
import InstanceState from "../state/InstanceState"
import { DATA_ATTR_ELEMENT_PARENT_ID, DATA_ATTR_TRIGGER_SOURCE } from "../constants/constants"
import Renderer_PanelsContainer from "./Renderer_PanelsContainer"

export default class Renderer_ActiveTrail {

  /**
   * Place a panel within the active trail and set all relevant attributes
   * @param {HTMLElement} panel_element 
   * @param {InstanceState} state 
   */
  public static panelInclude(panel_element: HTMLElement, state: InstanceState): void {

    panel_element.classList.add( state.options.classes.panel_active_trail )

    const trigger_source_id = panel_element.getAttribute(DATA_ATTR_TRIGGER_SOURCE)

    if ( trigger_source_id ) {
      const trigger_for_panel = Renderer.findElementByID(trigger_source_id)

      if ( trigger_for_panel ) {
        trigger_for_panel.setAttribute("aria-expanded", "true")
      }
    }

    const panel_parent_id = panel_element.getAttribute(DATA_ATTR_ELEMENT_PARENT_ID)

    if ( panel_parent_id ) {
      const panel_parent_element = Renderer.findElementByID(panel_parent_id)

      if ( panel_parent_element ) {
        panel_parent_element.classList.add( state.options.classes.panel_child_open )
        panel_parent_element.scrollTop = 0
        Renderer_ActiveTrail.panelInclude(panel_parent_element, state)
      }
    }
  }

  /**
   * Remove a panel from the active trail and set all relevant attributes
   * @param {HTMLElement} panel_element 
   * @param {InstanceState} state 
   */  
  public static panelExclude(panel_element: HTMLElement, state: InstanceState): void {

    panel_element.classList.remove(state.options.classes.panel_active_trail)
    panel_element.classList.remove(state.options.classes.panel_child_open)

    const trigger_source_id = panel_element.getAttribute(DATA_ATTR_TRIGGER_SOURCE)

    if ( trigger_source_id ) {
      const trigger_for_panel = Renderer.findElementByID(trigger_source_id)

      if ( trigger_for_panel ) {
        trigger_for_panel.setAttribute("aria-expanded", "false")
      }
    }
  }

  /**
   * Get the currently active panel element
   * @param {InstanceState} state The state object for this instance of the library   
   * @returns The active panel element if found, null if none found
   */ 
  public static panelGetActive(state: InstanceState): HTMLElement | null {
    
    const container = Renderer_PanelsContainer.getContainerElement(state)

    if ( container ) {
      return container.querySelector(`.${state.options.classes.panel_active}`)
    }

    return null
  }

  /**  
   * Recalculate the active trail based on current state
   * @param {InstanceState} state The state object for this instance of the library   
  */
  public static recalculate(state: InstanceState): void {

    const active_panel = Renderer_ActiveTrail.panelGetActive(state)
    const panels = Renderer_PanelsContainer.getPanels(state)

    panels.forEach( 
      node => {
        const element = node as HTMLElement 
        Renderer_ActiveTrail.panelExclude(element, state)
      }
    )

    if (active_panel) {
      Renderer_ActiveTrail.panelInclude(active_panel, state)
    }    
  }

}