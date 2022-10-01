import InstanceState from "../state/InstanceState"
import EventHandlers_Panel from "./EventHandlers_Panel"

export default class EventHandlers_PanelsContainer {

  public static apply(state: InstanceState) {

    const panel_container = state.panels_container
    
    EventHandlers_Panel.apply(panel_container.panels[0], state)
  }
}