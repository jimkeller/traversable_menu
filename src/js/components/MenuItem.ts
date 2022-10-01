import InstanceState from "../state/InstanceState"
import ComponentIdentifier from "../utils/ComponentIdentifier"
import Panel from "./Panel"
import MenuItemLink from "./MenuItemLink"
import { Trigger } from "./Trigger"

/** 
 * Class representing a menu item within the menu
 * menu items contain a menu item link.
 */
export default class MenuItem {

  private _panel: Panel

  state: InstanceState
  element: HTMLElement
  id: string
  sub_panel: Panel
  trigger_child: Trigger
  link: MenuItemLink

  constructor(state: InstanceState) {
    this.state = state
    this.id = ComponentIdentifier.newID()
  }

  public set panel(panel: Panel) {
    this._panel = panel
  }

  public get panel(): Panel {
    return this._panel
  }
  
}