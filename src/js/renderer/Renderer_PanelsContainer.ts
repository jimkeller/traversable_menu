import InstanceState from "../state/InstanceState"
import PanelsContainer from "../components/PanelsContainer"
import Renderer_Panel from "./Renderer_Panel"
import { Renderer } from "./Renderer"
import { DATA_ATTR_ELEMENT_ID, DATA_ATTR_PANEL_HEIGHT } from '../constants/constants'

export default class Renderer_PanelsContainer {

  public static applyAttributes(container_element: HTMLElement, panel_container : PanelsContainer, state: InstanceState) {
    container_element.setAttribute(DATA_ATTR_ELEMENT_ID, panel_container.id)
    container_element.classList.add(state.options.classes.panels_container)
  }

  public static render(panel_container: PanelsContainer, state : InstanceState) : HTMLElement {
  
    const container_element = document.createElement('div')

    Renderer_PanelsContainer.applyAttributes(container_element, panel_container, state)

    if (panel_container.panels.length > 0) {
      const panel_element = Renderer_Panel.render(panel_container.panels[0], state)
      container_element.appendChild(panel_element)
    }

    container_element.classList.add(state.options.classes.panels_initialized)

    return container_element
  }

  public static getContainerElement( state : InstanceState ) : HTMLElement | null {

    if (state.panels_container && state.panels_container.id) {
      return Renderer.findElementByID( state.panels_container.id )
    }

    return null
    
  }

  public static getPanels(state: InstanceState): NodeList | null {

    const element = Renderer_PanelsContainer.getContainerElement(state)

    if (element) {
      return element.querySelectorAll(state.options.selectors.panel)
    }      

    return null
  }

  /**
   * Store the calculated height of all panels. This is useful so we don't have to constantly recalculate
   * We only recalculate if the window is resized. 
   * @param {InstanceState} state The state for the current instance of the library 
   */
  public static panelsHeightStore = function(state: InstanceState): void {

    const container_element : Element = Renderer_PanelsContainer.getContainerElement(state)
    const panels = container_element.querySelectorAll(state.options.selectors.panel)
    let height = 0
  
    if (panels !== null) {
  
      for (let i = 0; i < panels.length; i++) {
        height = Renderer_Panel.calculateHeight(panels[i] as HTMLElement, state)
        panels[i].setAttribute(DATA_ATTR_PANEL_HEIGHT, height.toString())
      }
  
    }
  }

  /**
   * Recalculte and apply new height to the panels container
   * @param {InstanceState} state The state for the current instance of the library 
   */
  public static resize(state: InstanceState): number {

    const container_element : HTMLElement = Renderer.findElementByID(state.panels_container.id)
    const active_panel_element = Renderer_Panel.panelGetActive(state)
    let height = -1
  
    if (container_element && active_panel_element) {
      height = Renderer_Panel.calculateHeight(active_panel_element as HTMLElement, state)
  
      if ( height !== -1 ) {
        container_element.style.height = height.toString() + 'px'
      }
  
      container_element.classList.add(state.options.classes.panels_container_height_auto_applied)
    }
  
    return height
  }
  
}