import {jest, describe, expect, test, beforeEach} from '@jest/globals'
import {test_instance} from '../../test/setup'
import Renderer_MenuItem from '../Renderer_MenuItem'
import { menu_html } from "../../test/fixtures/html_rendered_menu"
import Renderer_PanelsContainer from '../Renderer_PanelsContainer'
import MenuItem from '../../components/MenuItem'
import Panel from '../../components/Panel'
import PanelsContainer from '../../components/PanelsContainer'
import { DATA_ATTR_ELEMENT_ID, DATA_ATTR_PANEL_ID } from '../../constants/constants'

describe('MenuItem Renderer', () => {

  let location: Location
  let mockedLocation: Location

  let panels_container_element: HTMLElement
  let panels_container: PanelsContainer

  beforeEach(() => {

    document.body.innerHTML = menu_html

    /* 
     * We want the panels container renderer to identify the container from our test HTML, 
     * so we mock the return value of getContainerElement
     */
    panels_container_element = document.querySelector(test_instance.state.options.selectors.panels_container)
    panels_container = new PanelsContainer(test_instance.state)

    jest.spyOn(Renderer_PanelsContainer, "getContainerElement").mockReturnValue(panels_container_element as HTMLElement)

    /*
     * We also need the window.location to return an href relevant to the test
     */
    jest.spyOn(window, "location", "get").mockRestore()
    location = window.location
    
    mockedLocation = {
      ...location,
      href: "http://www.example.com/products",
      pathname: "/products"
    }    

    jest.spyOn(window, 'location', 'get').mockReturnValue(mockedLocation)

  })

  test('active menu item correctly identified', () => {

    const active_menu_item = Renderer_MenuItem.activeMenuItemIdentify(test_instance.state)

    expect(active_menu_item).not.toBeFalsy()

    const active_link = active_menu_item.querySelector('a')

    expect(active_link).not.toBeFalsy()
    expect(active_link.getAttribute('href')).toEqual(global.location.href)
  })

  test('attributes apply correctly', () => {

    const menu_item_element = document.createElement('li')
    const menu_item = new MenuItem(test_instance.state)
    const panel = new Panel(panels_container, test_instance.state)

    panels_container.addPanel(panel)
    menu_item.panel = panel

    Renderer_MenuItem.applyAttributes(menu_item_element, menu_item, test_instance.state)

    expect(menu_item_element.classList.contains(test_instance.state.options.classes.menu_item)).toBeTruthy()
    expect(menu_item_element.getAttribute(DATA_ATTR_ELEMENT_ID)).toEqual(menu_item.id)
    expect(menu_item_element.getAttribute(DATA_ATTR_PANEL_ID)).toEqual(panel.id)

  })

})