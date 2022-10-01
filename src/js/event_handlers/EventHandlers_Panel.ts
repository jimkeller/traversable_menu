import InstanceState from "../state/InstanceState"
import Panel from "../components/Panel"
import EventHandlers_Trigger from "./EventHandlers_Trigger"
import EventHandlers_MenuItem from "./EventHandlers_MenuItem"
import { Renderer } from "../renderer/Renderer"

export default class EventHandlers_Panel {

  public static apply(panel: Panel, state: InstanceState) {

    if (panel.trigger_parent) {
      const parent_trigger_element = Renderer.findElementByID(panel.trigger_parent.id)
      if ( parent_trigger_element ) {
        EventHandlers_Trigger.apply(parent_trigger_element, state)
      }
    }

    if (panel.trigger_top) {
      const top_trigger_element = Renderer.findElementByID(panel.trigger_top.id)
      if ( top_trigger_element ) {
        EventHandlers_Trigger.apply(top_trigger_element, state)
      }
    }

    panel.menu_items.forEach(
      menu_item => {
        EventHandlers_MenuItem.apply(menu_item, state)
      }
    )
  }
}
