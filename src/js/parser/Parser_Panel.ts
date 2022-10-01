import InstanceState from "../state/InstanceState"
import Panel from "../components/Panel"
import Renderer_Panel from "../renderer/Renderer_Panel"
import Parser_MenuItem from "./Parser_MenuItem"
import { Renderer } from "../renderer/Renderer"
import { Trigger_Top } from "../components/Trigger"
import Renderer_Trigger from "../renderer/Renderer_Trigger"
import Renderer_PanelTitle from "../renderer/Renderer_PanelTitle"

export default class Parser_Panel {

  /**
   * Reads existing HTML for a panel element and creates relevant object hierarchy from it
   * @param {Panel} panel The panel to parse. panel.element must be set.
   * @param {InstanceState} state State object for this instance
   */
  public static parse(panel: Panel, state: InstanceState): void {

    Renderer_Panel.applyAttributes(panel.element as HTMLElement, panel, state)
    Parser_Panel.parsePanelTitle(panel, state)
    Parser_Panel.initializeTopTrigger(panel, state)
    Parser_Panel.parsePanelMenuItems(panel, state)
  }

  /**
   * Iterate through each menu item in the panel and parse it individually.
   * @param {Panel} panel The panel to parse. panel.element must be set.
   * @param {InstanceState} state State object for this instance
   */
  public static parsePanelMenuItems(panel: Panel, state: InstanceState) {

    const menu_item_elements = Parser_Panel.findImmediateMenuItems(panel, state)

    if (menu_item_elements) {
      menu_item_elements.forEach(
        menu_item_element => {
          Parser_MenuItem.parse(menu_item_element as HTMLElement, panel, state)
        }
      )
    }

  }

  /**
   * Find menu item elements in the HTML for this panel only (not sub-panels)
   * 
   * @param {Panel} panel the panel object to find menu items for
   * @param {InstanceState} State object for this instance
   * @returns {NodeList}
   */
  public static findImmediateMenuItems(panel: Panel, state: InstanceState): NodeList {

    /*
     * @TODO: would like to do something better here than just assume a ul, 
     * but we can't just use querySelectorAll or we'll get all LIs within this panel and subpanels.
    */
    let menu_item_elements: NodeList
    const ul = panel.element.querySelector('ul')

    if ( ul ) {
      menu_item_elements = Renderer.immediateChildren(ul as HTMLElement, state.options.selectors.menu_item)
    }

    return menu_item_elements
  }

  /**
   * If we found a "top trigger" (usually "Up to Main Menu"),
   * initialize an object for it, then apply appropriate attributes to the HTML element
   * 
   * @param {Panel} panel The panel to find a title for
   * @param {InstanceState} state State object for this instance
   */ 
  public static initializeTopTrigger(panel: Panel, state: InstanceState): void {

    const top_trigger_element = panel.element.querySelector(state.options.selectors.panel_trigger_top)

    if (top_trigger_element) {
      
      const trigger = new Trigger_Top(state)
      trigger.panel = panel
      trigger.element = top_trigger_element
      trigger.activates_panel = state.panels_container.panels[0]
      panel.trigger_top = trigger

      Renderer_Trigger.applyAttributes(trigger, top_trigger_element as HTMLElement, state)
    }
  }

  /**
   * If we found a title element, extract the text and apply it to the panel.
   * 
   * @param {Panel} panel The panel to find a title for
   * @param {InstanceState} state State object for this instance
   */ 
  public static parsePanelTitle(panel: Panel, state: InstanceState): void {
    
    const title_element = panel.element.querySelector(state.options.selectors.panel_title) as HTMLElement

    if (title_element) {
      Renderer_PanelTitle.applyText(title_element, panel, state)
      Renderer_PanelTitle.applyLinkAttributes(title_element, panel, state)
      Renderer_PanelTitle.applyAttributes(title_element, state)
    }
  }

}