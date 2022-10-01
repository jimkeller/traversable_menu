import InstanceState from "../state/InstanceState"
import Panel from "../components/Panel"
import { Renderer } from "../renderer/Renderer"
import { DATA_ATTR_ELEMENT_ID, DATA_ATTR_TRIGGER_TARGET } from '../constants/constants'
import { Trigger } from "../components/Trigger"
import Renderer_Panel from "../renderer/Renderer_Panel"

export default class EventHandlers_Trigger {

  /**
   * Given an event, determines whether the panel activation should fire. 
   * The events that trigger an activation are configurable as options.triggers.events
   * @param event 
   * @param state 
   * @returns 
   */
  public static eventShouldFire(event: Event, state: InstanceState): boolean {

    const relevant_event_types = state.options.triggers.events

    if (relevant_event_types.indexOf(event.type) > -1) {
      if (event.type == 'keyup') {

        const kb_event = event as KeyboardEvent

        if (typeof(kb_event.code) !== 'undefined' && kb_event.key == 'Enter') {
          return true
        }
      }
      else {
        if (event.type == 'mouseup') {
          return true
        }
      }
    }

    return false
    
  }    

  public static apply(element: Element, state: InstanceState): void {

    let callback = state.options.callbacks.trigger.on

    if (callback == null) {
      callback = EventHandlers_Trigger.eventHandler
    }

    let cur_event_name : string
    const events = ['keyup', 'mouseup', 'click']

    events.forEach(
      cur_event_name => {
        element.addEventListener(cur_event_name, 
          function (event: Event) {
            callback.call(this, event, state)
          }, 
          { capture: false }
        )
      }
    )

  }

  public static eventHandler(event: Event, state: InstanceState): boolean {

    let callback: (event: Event, state: InstanceState) => boolean
    const callback_params = { event: event, state: state }

    event.preventDefault()

    if ( EventHandlers_Trigger.eventShouldFire(event, state) ) {
      if ( callback = state.options.callbacks.trigger.before ) {
        callback.call(this, callback_params)
      }
    }

    let last_event = ""
    let trigger_target_id : string
    let trigger_element = this as any
    trigger_element = trigger_element as HTMLElement

    if ( trigger_target_id = trigger_element.getAttribute(DATA_ATTR_TRIGGER_TARGET) ) {
      const panel_element_to_activate: HTMLElement = Renderer.findElementByID(trigger_target_id)

      if ( panel_element_to_activate ) {
        //
        // for ADA compliance, we want to check to see if someone pressed enter as opposed to clicking on the link with a mouse
        // If they're using a keyboard to navigate, focus the first menu item of the newly activated panel. Otherwise, don't
        //
        if ( event.type == 'keyup' ) {

          const kb_event = event as KeyboardEvent
          event.preventDefault()

          if ( typeof(kb_event.code) !== 'undefined' && kb_event.code == 'Enter' ) {
            last_event = 'keyup'
            Renderer_Panel.activate(panel_element_to_activate, state, { focus_first_item: true })
          }
          return false
        }
        else if (event.type == 'mouseup') {

          console.log('mousing up')

          event.preventDefault()

          if (panel_element_to_activate.getAttribute('data-last-activation-event') != 'touchend') { //panel was already activated by touch
            last_event = 'mouseup'
            Renderer_Panel.activate(panel_element_to_activate, state)
          }

        }
        else if (event.type == 'click') {
          //
          // Mouseup will handle everything without screwing around with touch events, so we basically disable click
          //
          event.preventDefault()
        }
      }

      panel_element_to_activate.setAttribute('data-last-activation-event', last_event)
    }

    if ( EventHandlers_Trigger.eventShouldFire(event, state) ) {
      if ( callback = state.options.callbacks.trigger.after ) {
        callback.call(this, callback_params)
      }
    }

    return false //Always return false to further ensure preventing of default behavior

  }
  
}