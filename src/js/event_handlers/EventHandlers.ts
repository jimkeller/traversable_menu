import InstanceState from "../state/InstanceState"
import EventHandlers_Global from "./EventHandlers_Global"
import EventHandlers_PanelsContainer from "./EventHandlers.PanelsContainer"

export default class EventHandlers {

  public static apply(state: InstanceState) {
    EventHandlers_Global.apply(state)
    EventHandlers_PanelsContainer.apply(state)
  }
}