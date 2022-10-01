
import InstanceState from "../state/InstanceState"
import MenuItem from "../components/MenuItem"
import EventHandlers_Trigger from "./EventHandlers_Trigger"
import EventHandlers_Panel from "./EventHandlers_Panel"
import { Renderer } from "../renderer/Renderer"

export default class EventHandlers_MenuItem {

  public static apply(menu_item: MenuItem, state: InstanceState) {

    if (menu_item.trigger_child) {
      const trigger_element = Renderer.findElementByID(menu_item.trigger_child.id)
      if (trigger_element) {
        EventHandlers_Trigger.apply(trigger_element, state)
      }
    }

    if (menu_item.sub_panel) {
      EventHandlers_Panel.apply(menu_item.sub_panel, state)
    }
  }
}