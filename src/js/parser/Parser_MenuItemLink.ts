import InstanceState from "../state/InstanceState"
import MenuItem from "../components/MenuItem"
import MenuItemLink from "../components/MenuItemLink"
import Renderer_MenuItemLink from "../renderer/Renderer_MenuItemLink"
export default class Parser_MenuItem {

  public static parse(link_element: HTMLElement, menu_item: MenuItem, state: InstanceState) {

    const menu_item_link = new MenuItemLink(state)
    menu_item_link.menu_item = menu_item
    menu_item_link.text = link_element.innerHTML
    menu_item_link.link = link_element.getAttribute('href')

    menu_item.link = menu_item_link

    Renderer_MenuItemLink.applyAttributes(link_element, menu_item_link, state)

  }
}