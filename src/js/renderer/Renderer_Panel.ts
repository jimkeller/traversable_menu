import { Renderer } from "./Renderer"
import Renderer_MenuItem from "./Renderer_MenuItem"
import Renderer_PanelsContainer from "./Renderer_PanelsContainer"
import { DATA_ATTR_PANEL_HEIGHT, DATA_ATTR_ELEMENT_ID, DATA_ATTR_ELEMENT_PARENT_ID, DATA_ATTR_TRIGGER_SOURCE, TOKEN_MENU_TITLE, DATA_ATTR_PANEL_DEPTH } from "../constants/constants"
import Panel from "../components/Panel"
import InstanceState from "../state/InstanceState"
import Renderer_Trigger from "./Renderer_Trigger"
import Renderer_ActiveTrail from "./Renderer_ActiveTrail"
import { Trigger_Top } from "../components/Trigger"
import Renderer_PanelTitle from "./Renderer_PanelTitle"
import nearestAncestor from "../utils/nearest_ancestor"

interface Options_Panel_Activate {
  show_immediate?: boolean,
  focus_first_item?: boolean
}

export default class Renderer_Panel {

  /* Action timers are used to wait long enough for the slide animation to finish before taking action */
  public static action_timers: {[panel_id:string]: ReturnType<typeof setTimeout>[] } = {}

  /**  
   * Applies default attributes to a panel element
   * @param {HTMLElement} panel_element The element to act on
   * @param {Panel} panel the panel object
   * @param {InstanceState} state The state object for this instance of the library 
  */
  public static applyAttributes(panel_element: HTMLElement, panel: Panel, state: InstanceState): void {
    const depth_class = state.options.classes.panel_depth.replace('[:n:]', panel.depth.toString())

    panel_element.setAttribute('id', panel.id)
    panel_element.setAttribute(DATA_ATTR_ELEMENT_ID, panel.id)
    panel_element.setAttribute(DATA_ATTR_PANEL_DEPTH, panel.depth.toString())
    panel_element.classList.add(state.options.classes.panel)
    panel_element.classList.add(depth_class)

    if ( panel.parent ) {
      panel_element.setAttribute(DATA_ATTR_ELEMENT_PARENT_ID, panel.parent.id)
    }

    if ( panel.menu_item_parent && panel.menu_item_parent.trigger_child) {
      panel_element.setAttribute(DATA_ATTR_TRIGGER_SOURCE, panel.menu_item_parent.trigger_child.id)
    }

    if (state.options.panel.zindex_auto) {
      panel_element.style.zIndex = (panel.depth + 1 + state.options.panel.zindex_start).toString()
    }

    if (state.options.panel.height_auto) {
      panel_element.style.height = "0px"
    }    
  }

  /** 
   * Renders a panel and any sub-panels container within it
   * @param {HTMLElement} panel_element The panel object to render
   * @param {InstanceState} state The state object for this instance of the library
  */
  public static render(panel: Panel, state: InstanceState): HTMLElement {

    const panel_element = document.createElement('div')
    const list_element = document.createElement('ul')
    Renderer_Panel.applyAttributes(panel_element, panel, state)

    if (panel.depth >= state.options.triggers.top_depth && state.options.triggers.top_trigger_enabled) {
      const top_trigger_element = Renderer_Panel.renderTopTrigger(panel, state)
      panel_element.appendChild(top_trigger_element)
    }

    if ( panel.trigger_parent ) {
      const trigger_parent_element = Renderer_Trigger.render(panel.trigger_parent, state)
      panel_element.appendChild(trigger_parent_element)
    }

    const panel_title_element = Renderer_PanelTitle.render(panel, state)
    if (panel_title_element) {
      panel_element.appendChild(panel_title_element)
    }

    panel.menu_items.forEach(
      menu_item => {
        list_element.appendChild(Renderer_MenuItem.render(menu_item, state))
      }
    )

    panel_element.appendChild(list_element)
    
    return panel_element
  } 
  
  /**
   * Renders a "Back to top" trigger on this panel
   * @param {Panel} panel the panel the trigger will be applied to 
   * @param {InstanceState} state the state of the current instance
   * @returns {HTMLElement} the rendered element
   */
  public static renderTopTrigger(panel: Panel, state: InstanceState): HTMLElement {

    const trigger = new Trigger_Top(state)
    trigger.element = document.createElement('a')
    trigger.activates_panel = state.panels_container.panels[0]
    panel.trigger_top = trigger

    return Renderer_Trigger.render(trigger, state)

  }

  public static activatePanelByID(panel_id : string, state : InstanceState) {

    Renderer_Panel.activate(Renderer.findElementByID(panel_id), state)
    
  }

  /** 
   * Applies attributes necessary to make a panel "active" (i.e. the visible panel)
   * @param {HTMLElement} panel_element The element to act on
   * @param {InstanceState} state The state object for this instance of the library
  */
  public static activeAttributesApply(panel_element: HTMLElement, state: InstanceState): void {

    panel_element.classList.add(state.options.classes.panel_active)
    
    //Renderer_Panel.removeVisibilityTimer(panel_element, state)

    panel_element.style.visibility = 'visible'
    panel_element.style.display = 'initial'
    panel_element.setAttribute('aria-hidden', 'false')
    panel_element.setAttribute('data-panel-active', "true")
    panel_element.scrollTop = 0

    Renderer_ActiveTrail.panelInclude(panel_element, state)
    
  }

  /** 
   * Removes attributes necessary to make a panel "active" (i.e. the visible panel)
   * @param {HTMLElement} panel_element The element to act on
   * @param {InstanceState} state The state object for this instance of the library
  */
  public static activeAttributesRemove(panel_element : HTMLElement, state : InstanceState): void {

    panel_element.classList.remove( state.options.classes.panel_active )

    Renderer_Panel.applyActionTimer(
      panel_element, 
      function(panel_element, state) {
        panel_element.style.visibility = "hidden"
      },
      state
    )

    panel_element.setAttribute('aria-hidden', 'true')
    panel_element.setAttribute('data-panel-active', "false")
    panel_element.scrollTop = 0
    
  }

  /** 
   * Removes a stored visibility timer on a timer element, which is used to wait until the panel has shifted out of 
   * view before hiding it
   * @param {HTMLElement} panel_element The element to act on
   * @param {InstanceState} state The state object for this instance of the library    
   */
  public static removeActionTimer(panel_element: HTMLElement, state: InstanceState): void {

    const element_id = panel_element.getAttribute(DATA_ATTR_ELEMENT_ID)

    if (typeof(Renderer_Panel.action_timers[element_id]) != 'undefined' && Array.isArray(Renderer_Panel.action_timers[element_id])) {
      Renderer_Panel.action_timers[element_id].forEach(
        (timer) => {
          clearTimeout(timer)
        }
      )
      
      Renderer_Panel.action_timers[element_id] = []
    }    
  }

  /**
   * Adds a stored action timer, which is used to wait until the panel has shifted out of 
   * view before hiding it
   * @param {HTMLElement} panel_element The element to act on
   * @param {Function} the callback to run when this timer activates
   * @param {InstanceState} state The state object for this instance of the library   
   */  
  public static applyActionTimer(panel_element: HTMLElement, callback: (panel_element: HTMLElement, state: InstanceState) => any, state: InstanceState): void {

    const element_id = panel_element.getAttribute(DATA_ATTR_ELEMENT_ID)

    if (typeof(Renderer_Panel.action_timers[element_id]) == 'undefined' || !Array.isArray(Renderer_Panel.action_timers[element_id])) {
      Renderer_Panel.action_timers[element_id] = []
    }

    Renderer_Panel.action_timers[element_id].push(
      setTimeout(
        function () {
          callback.call(this, panel_element, state)
        }, 
        state.options.panel.slide_animation_duration
      )
    )
    
  }

  /**
   * Applies a pre-saved height for this panel, if it's stored on the element. Otherwise calculate the height
   * and apply it. 
   * @param {HTMLElement} panel_element The element to act on
   * @param {InstanceState} state The state object for this instance of the library   
   */
  public static applyCalculatedHeight(panel_element : HTMLElement, state :InstanceState, options? : any): string | number {

    let height : string | number
  
    options = options || {}
  
    if ((typeof(options.ignore_stored) == 'undefined' || options.ignore_stored == false) && panel_element.hasAttribute(DATA_ATTR_PANEL_HEIGHT)) {
        height = panel_element.getAttribute(DATA_ATTR_PANEL_HEIGHT)
    }
    else {
      height = Renderer_Panel.calculateHeight(panel_element, state)
    }
  
    if ( height !== null ) {
      panel_element.style.height = height.toString() + 'px'
    }
  
    return height
  }

  public static calculateHeight(panel_element: HTMLElement, state: InstanceState): number {
    return panel_element.scrollHeight
  }
  
  public static activateDefault(state : InstanceState) {
    let panel_auto_activated = false

    /*
     * If the options tell us to automatically traverse to the active menu item 
     * (as determined by a class name or by examing the URL), do that here.
     */
    if ( state.options.init.auto_traverse_to_active ) {
      const active_menu_panel = Renderer_MenuItem.panelElementByActiveMenuItem(state)
      if (active_menu_panel) {
        Renderer_Panel.activate(active_menu_panel, state, {'show_immediate': true})
        panel_auto_activated = true
      } 
    }

    if ( !panel_auto_activated ) {
      //
      // activate first panel
      //
      const panels_container = Renderer_PanelsContainer.getContainerElement(state)

      if (panels_container) {
        const topmost_panel = panels_container.querySelector(state.options.selectors.panel)
        if ( topmost_panel ) {
          Renderer_Panel.activate(topmost_panel as HTMLElement, state, {'show_immediate': true})
        }
      }

    }    
  }

  /**
   * Activate (show) the given panel element
   * @param {HTMLElement} panel_element the panel element to show as active
   * @param {InstanceState} state The state for this instance of the library 
   * @param {Options_Panel_Activate} [options] { show_immediate, focus_first_item } 
   */
  public static activate(panel_element: HTMLElement, state: InstanceState, options?: Options_Panel_Activate) {

    options = options || {}
  
    const show_immediate =  ( typeof(options.show_immediate) !== 'undefined' && options.show_immediate ) ? true : false
    const focus_timeout = ( show_immediate ) ? 0 : state.options.panel.slide_animation_duration
    const focus_enabled = ( typeof(options.focus_first_item) !== 'undefined' && options.focus_first_item ) ? true : false
    const panel_container = Renderer_PanelsContainer.getContainerElement(state)
  
    Renderer_Panel.removeActionTimer(panel_element, state)

    if ( !Renderer_Panel.panelIsActive(panel_element, state) ) {

      const active_panel = Renderer_Panel.panelGetActive(state)
      let moving_up = false

      if (active_panel) {
        const active_panel_depth = active_panel.getAttribute(DATA_ATTR_PANEL_DEPTH)
        const new_panel_depth = panel_element.getAttribute(DATA_ATTR_PANEL_DEPTH)
        moving_up = (active_panel_depth > new_panel_depth) ? true : false
      }

      if ( show_immediate ) {
        const all_panels = panel_container.querySelectorAll(state.options.selectors.panel)
        for( let j = 0; j < all_panels.length; j++ ) {
          all_panels[j].classList.add(state.options.classes.panel_show_immediate)
        }
      }


      Renderer_Panel.panelsResetActive(state)
      Renderer_Panel.activeAttributesApply(panel_element, state)
      Renderer_ActiveTrail.recalculate(state)
  
      /**
       * To make the transition more elegant, we set the height at a different timee
       * depending on if the user is moving up in the menu or down. This way, when moving up,
       * we don'risk cutting off the bottom of the lower menu before it slides out of view.
       */
       if (state.options.panel.height_auto) {
        Renderer_Panel.activeHeightApply(state)
        

        if (show_immediate) {
         Renderer_Panel.resetInactiveChildHeights(state)
         Renderer_Panel.resetInactiveParentHeights(state)
        }
        else {

          if (moving_up) {
            Renderer_Panel.resetInactiveParentHeights(state)
            Renderer_Panel.applyActionTimer(
              panel_element, 
              function(panel_element: HTMLElement, state: InstanceState) {
                if (state.options.panel.height_auto) {
                  Renderer_Panel.resetInactiveChildHeights(state)
                }
              }, 
              state
            )
          }
          else {
            Renderer_Panel.applyActionTimer(
              panel_element, 
              function(panel_element: HTMLElement, state: InstanceState) {
                if (state.options.panel.height_auto) {
                  Renderer_Panel.resetInactiveParentHeights(state)
                  Renderer_Panel.resetInactiveChildHeights(state)
                }
              }, 
              state
            )            
          }

          
        }
      }


      if (state.options.panel.auto_scroll_to_top) {
        if ( panel_container ) {
          panel_container.scrollTop = 0
        }
  
        panel_element.scrollTop = 0
      }
  
      if (focus_enabled) {
        window.setTimeout(
          function() {
            if( state.options.accessibility.menu_item_link_focus_first) {
              const first_menu_link = panel_element.querySelector(state.options.selectors.menu_item_link) as HTMLElement
              if ( first_menu_link ) {
                first_menu_link.focus()
              }
            }
          },
          focus_timeout
        )
      }
  
      if ( show_immediate ) {
        const immediate_panels = panel_container.querySelectorAll(`.${state.options.classes.panel_show_immediate}`)
  
        for( let i = 0; i < immediate_panels.length; i++ ) {
          immediate_panels[i].classList.remove(state.options.classes.panel_show_immediate)
        }
      }
  
    }
  
  }

  public static panelIsActive(panel_element: HTMLElement, state: InstanceState ) {
    return panel_element.classList.contains(state.options.classes.panel_active)
  }

  public static panelGetActive( state: InstanceState ) {

    const container = state.panels_container
    let panel_elements: NodeList

    const container_element = Renderer.findElementByID(container.id)
    
    return container_element.querySelector('.' + state.options.classes.panel_active)
  }

  public static panelsResetActive(state : InstanceState) {

    const container = state.panels_container
    const container_element = Renderer.findElementByID(container.id)
    let panel_elements : NodeList

    if ( container_element ) {
      const panel_elements = container_element.querySelectorAll('.' + state.options.classes.panel_active)

      panel_elements.forEach(
        panel => {
          Renderer_Panel.activeAttributesRemove(panel as HTMLElement, state)
        }
      )
    }
  }

  public static activeHeightApply(state : InstanceState) {
    const active_panel = Renderer_Panel.panelGetActive(state)

    if ( active_panel ) {
      Renderer_Panel.applyCalculatedHeight(active_panel as HTMLElement, state)
      active_panel.classList.add(state.options.classes.panel_height_auto_applied)
    }    

  }

  public static resetInactiveParentHeights(state : InstanceState) {
    const active_panel = Renderer_Panel.panelGetActive(state)
    let parent_panel: HTMLElement
    let new_height: number | string

    if ( active_panel ) {
      new_height = active_panel.getAttribute(DATA_ATTR_PANEL_HEIGHT)
      parent_panel  = Renderer_Panel.panelGetParent(active_panel, state)
  
      while (parent_panel) {
        parent_panel.style.height = new_height.toString() + 'px'
        parent_panel.classList.add(state.options.classes.panel_height_auto_applied)
        parent_panel = Renderer_Panel.panelGetParent(parent_panel, state)
      }
  
      if ( state.options.panels_container.height_auto) {        
        Renderer_PanelsContainer.resize( state )
      }
  
    }    

  }

  public static resetInactiveChildHeights(state : InstanceState) {
    const active_panel = Renderer_Panel.panelGetActive(state)

    if ( active_panel ) {
      const sub_panels = active_panel.querySelectorAll(state.options.selectors.panel)
      
      if (sub_panels.length > 0) {
        sub_panels.forEach(
          (sub_panel) => {
            const sub_panel_element = sub_panel as HTMLElement
            sub_panel_element.style.height = "0px"
          }
        )
      }
  
      if ( state.options.panels_container.height_auto) {        
        Renderer_PanelsContainer.resize( state )
      }
  
    }    

  }


  public static panelGetParent( panel_element : Element, state : InstanceState ): HTMLElement {
    return nearestAncestor(panel_element, state.options.selectors.panel)
  }

}