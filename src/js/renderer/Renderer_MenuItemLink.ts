import MenuItemLink from "../components/MenuItemLink"
import { DATA_ATTR_ELEMENT_ID } from "../constants/constants"
import InstanceState from "../state/InstanceState"

export default class Renderer_MenuItemLink {

  public static render(menu_item_link: MenuItemLink, state: InstanceState) {
    
    const menu_link_element = document.createElement('a')

    menu_link_element.setAttribute('href', menu_item_link.link)
    menu_link_element.innerHTML = menu_item_link.text    

    menu_item_link.element = menu_link_element

    Renderer_MenuItemLink.applyAttributes(menu_link_element, menu_item_link, state)

    return menu_link_element
  }

  public static applyAttributes(menu_link_element: HTMLElement, menu_item_link: MenuItemLink, state: InstanceState) {
    menu_link_element.classList.add(state.options.classes.menu_item_link)
    menu_link_element.setAttribute(DATA_ATTR_ELEMENT_ID, menu_item_link.id)
  }
}