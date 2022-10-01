import InstanceState from "../state/InstanceState"
import MenuItem from "../components/MenuItem"
import Renderer_MenuItem from "../renderer/Renderer_MenuItem"
import Panel from "../components/Panel"
import Parser_MenuItemLink from "./Parser_MenuItemLink"
import Parser_Panel from "./Parser_Panel"
import { Trigger_Child } from "../components/Trigger"
import Parser_Trigger from "./Parser_Trigger"
import { Trigger, Trigger_Parent } from "../components/Trigger"

export default class Parser_MenuItem {

  public static parse(menu_item_element: HTMLElement, panel: Panel, state: InstanceState) {

    const menu_item = new MenuItem(state)
    menu_item.element = menu_item_element
    menu_item.panel = panel
    
    panel.addMenuItem(menu_item)

    Renderer_MenuItem.applyAttributes(menu_item.element, menu_item, state)

    const link_element = menu_item.element.querySelector(state.options.selectors.menu_item_link)

    if (link_element) {
      Parser_MenuItemLink.parse(link_element as HTMLElement, menu_item, state)
    }

    const sub_panel_element = menu_item.element.querySelector(state.options.selectors.panel)

    if (sub_panel_element) {

      const sub_panel = new Panel(state.panels_container, state)
      sub_panel.parent = panel
      sub_panel.menu_item_parent = menu_item
      sub_panel.element = sub_panel_element
      sub_panel.depth = panel.depth + 1

      menu_item.sub_panel = sub_panel

      /*
       * Identify and parse child & parent triggers
       */
      Parser_MenuItem.parseTriggerChild(menu_item, state)
      Parser_MenuItem.parseTriggerParent(menu_item, state)

      /*
      const trigger_for_child_element = menu_item.element.querySelector(state.options.selectors.panel_trigger_child)

      if (trigger_for_child_element) {
        const trigger_for_child = new Trigger_Child(state)
        trigger_for_child.panel = panel
        trigger_for_child.activates_panel = sub_panel
        trigger_for_child.element = trigger_for_child_element
        trigger_for_child.menu_item = menu_item

        menu_item.trigger_child = trigger_for_child

        Parser_Trigger.parse(trigger_for_child_element as HTMLElement, trigger_for_child, state)
      }

      const parent_trigger_element = sub_panel.element.querySelector(state.options.selectors.panel_trigger_parent)

      if (parent_trigger_element) {
        const parent_trigger = new Trigger_Parent(state)
        parent_trigger.element = parent_trigger_element
        parent_trigger.panel = sub_panel
        parent_trigger.activates_panel = sub_panel.parent
        parent_trigger.menu_item = menu_item
        sub_panel.trigger_parent = parent_trigger
        
        Parser_Trigger.parse(parent_trigger_element as HTMLElement, parent_trigger, state)
        
      }
      */
      
      Parser_Panel.parse(sub_panel, state)

    }
  }

  public static parseTriggerChild(menu_item: MenuItem, state: InstanceState) {

    const trigger_for_child_element = menu_item.element.querySelector(state.options.selectors.panel_trigger_child)

    if (menu_item.sub_panel && trigger_for_child_element) {
      const trigger_for_child = new Trigger_Child(state)
      trigger_for_child.panel = menu_item.panel
      trigger_for_child.activates_panel = menu_item.sub_panel
      trigger_for_child.element = trigger_for_child_element
      trigger_for_child.menu_item = menu_item

      menu_item.trigger_child = trigger_for_child

      Parser_Trigger.parse(trigger_for_child_element as HTMLElement, trigger_for_child, state)
    }

  }

  public static parseTriggerParent(menu_item: MenuItem, state: InstanceState) {

    if (menu_item.sub_panel) {
      const parent_trigger_element = menu_item.sub_panel.element.querySelector(state.options.selectors.panel_trigger_parent)

      if (parent_trigger_element) {
        const parent_trigger = new Trigger_Parent(state)
        parent_trigger.element = parent_trigger_element
        parent_trigger.panel = menu_item.sub_panel
        parent_trigger.activates_panel = menu_item.sub_panel.parent
        parent_trigger.menu_item = menu_item
        menu_item.sub_panel.trigger_parent = parent_trigger
        
        Parser_Trigger.parse(parent_trigger_element as HTMLElement, parent_trigger, state)
        
      }
    }
  }  
}