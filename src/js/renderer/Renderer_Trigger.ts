import { Trigger, Trigger_Top } from "../components/Trigger"
import InstanceState from "../state/InstanceState"
import { DATA_ATTR_ELEMENT_ID, DATA_ATTR_TRIGGER_TARGET } from '../constants/constants'

export default class Renderer_Trigger {

  public static render(trigger: Trigger, state: InstanceState) {

    const trigger_element = document.createElement('a')
    
    Renderer_Trigger.applyAttributes(trigger, trigger_element, state)

    return trigger_element
  }

  public static applyAttributes(trigger: Trigger, trigger_element: HTMLElement, state: InstanceState): HTMLElement {

    let panel_id = ""
    
    if ( trigger.activates_panel ) {
      panel_id = trigger.activates_panel.id
    }    

    trigger_element.setAttribute(DATA_ATTR_ELEMENT_ID, trigger.id)
    trigger_element.setAttribute(DATA_ATTR_TRIGGER_TARGET, panel_id) 
    trigger_element.setAttribute('href', '#')

    trigger_element.setAttribute('aria-haspopup', "true")
    trigger_element.setAttribute('aria-expanded', "false")
    trigger_element.setAttribute('aria-controls', panel_id)   

    trigger_element.innerHTML = trigger.text
    trigger_element.classList.add(trigger.classname)

    if (trigger instanceof Trigger_Top ) {
      /* Hide the top trigger if the panel depth is below triggers.top_depth */
      if (trigger.panel && trigger.panel.depth < state.options.triggers.top_depth) {
        if (state.options.triggers.top_remove_auto) {
          trigger_element.style.display = 'none'
        }
      }
    }

    return trigger_element
  }

  public static setActivated(element: HTMLElement, state: InstanceState) : void {
    element.setAttribute('aria-expanded', "true")
  }
  
}
