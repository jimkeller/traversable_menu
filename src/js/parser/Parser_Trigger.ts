import { Trigger } from "../components/Trigger"
import Renderer_Trigger from "../renderer/Renderer_Trigger"
import InstanceState from "../state/InstanceState"

export default class Parser_Trigger {

  public static parse(trigger_element: HTMLElement, trigger: Trigger, state: InstanceState) {

    Renderer_Trigger.applyAttributes(trigger, trigger_element, state)

  }
}