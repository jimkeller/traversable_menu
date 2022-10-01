import MenuItem from "../components/MenuItem"
import InstanceState from "../state/InstanceState"
import { Renderer } from "./Renderer"
import Renderer_Trigger from "./Renderer_Trigger"
import Renderer_Panel from "./Renderer_Panel"
import ActiveTrail from "../state/ActiveTrail"
import Renderer_PanelsContainer from "./Renderer_PanelsContainer"
import Renderer_MenuItemLink from "./Renderer_MenuItemLink"
import { DATA_ATTR_ELEMENT_ID, DATA_ATTR_PANEL_ID } from "../constants/constants"

export default class Renderer_MenuItem {

  public static applyAttributes(menu_item_element: HTMLElement, menu_item: MenuItem, state: InstanceState) {
    menu_item_element.classList.add(state.options.classes.menu_item)
    menu_item_element.setAttribute(DATA_ATTR_ELEMENT_ID, menu_item.id)
    menu_item_element.setAttribute(DATA_ATTR_PANEL_ID, menu_item.panel.id)
  }
  
  public static render(menu_item : MenuItem, state : InstanceState) {

    const menu_item_element = document.createElement('li')

    Renderer_MenuItem.applyAttributes(menu_item_element, menu_item, state)

    if (menu_item.link) {
      menu_item_element.appendChild(Renderer_MenuItemLink.render(menu_item.link, state))
    }

    if (menu_item.trigger_child) {
      menu_item_element.appendChild(Renderer_Trigger.render(menu_item.trigger_child, state))
    }

    if (menu_item.sub_panel) {
      menu_item_element.appendChild(Renderer_Panel.render(menu_item.sub_panel, state))
    }

    return menu_item_element
  }

  /**
   * Tries to identify the currently active menu item, 
   * as determined by looking for elements matching the return value from activeItemSelectors
   * @param {InstanceState} state The state object for this instance of the library   
   * @returns The menu item element that matches the active selector, or null if none found
   */  
  public static activeMenuItemIdentify(state: InstanceState): HTMLElement | null {

    const active_selectors = ActiveTrail.activeItemSelectors(state)

    let matching_items: NodeList
    let matching_node: Node 
    let matching_element: HTMLElement
    let final_match: HTMLElement = null
    let i: number

    for(i = 0; i < active_selectors.length; i++) {

      const panels_container_element = Renderer_PanelsContainer.getContainerElement(state)
      
      if ( panels_container_element ) {
        matching_items = panels_container_element.querySelectorAll(active_selectors[i])

        if ( matching_items.length > 0 ) {
          matching_node = matching_items[matching_items.length - 1] //Take the deepest match if we found multiple
          matching_element = matching_node as HTMLElement

          if ( matching_element ) {

            if ( !matching_element.matches(state.options.selectors.menu_item) ) {
              //
              // We want to find the menu item, not the link or something else
              //
              let parent_count = state.options.active.parents_search_max
              let this_node = matching_element.parentElement

              while ( parent_count > 0 ) {
                if ( this_node.matches(state.options.selectors.menu_item) ) {
                  final_match = this_node
                  break
                }
                this_node = this_node.parentElement
                parent_count--
              }
            }
            else {
              final_match = matching_element
            }

            if ( final_match ) {
              break
            }
          }
        }
      }
    }

    return final_match
    
  }  

  /**
   * Tries to identify the panel that corresponds to the currently active menu item, 
   * as determined by activeMenuIdentify
   * @param {InstanceState} state The state object for this instance of the library   
   * @returns The panel element that holds the active menu item, or null if none found
   */
  public static panelElementByActiveMenuItem(state: InstanceState): HTMLElement | null {

    const active_menu_item = Renderer_MenuItem.activeMenuItemIdentify(state)

    if ( active_menu_item ) {
      const panel_id = active_menu_item.getAttribute(DATA_ATTR_PANEL_ID) 
      const panel_element = Renderer.findElementByID(panel_id)

      if ( panel_element ) {
        return panel_element
      }
    }

    return null
  }
}