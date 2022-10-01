import InstanceState from "../state/InstanceState"
import ComponentIdentifier from "../utils/ComponentIdentifier"
import MenuItem from "./MenuItem"

export default class MenuItemLink {

  id: string
  state: InstanceState
  menu_item: MenuItem
  text: string
  link: string
  element: HTMLElement

  constructor(state: InstanceState) {
    this.state = state
    this.id = ComponentIdentifier.newID()
  }

}