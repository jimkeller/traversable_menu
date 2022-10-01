import Panel from "./Panel"
import InstanceState from '../state/InstanceState'
import MenuItem from './MenuItem'
import MenuItemLink from './MenuItemLink'
import { Trigger, Trigger_Child, Trigger_Parent } from './Trigger'
import { MenuItemData, PanelContainerData } from '../types/ItemData'
import ComponentIdentifier from "../utils/ComponentIdentifier"

/** 
 * Class representing a container with multiple menu panels within it.
 * This is the topmost object in the tree for any given instance of the menu hierarchy. 
 */
export default class PanelsContainer {

  public _id : string

  element: HTMLElement
  state: InstanceState
  panels: Array<Panel>
  triggers: { [key:string] : Trigger }
  item_data: PanelContainerData

  constructor(state : InstanceState ) {
    this.state = state
    this.panels = []
    this._id = ComponentIdentifier.newID()
  }

  public get id(): string {
    return this._id
  }

  validateItemData(item_data: PanelContainerData) {
    return (item_data && typeof(item_data.items) != 'undefined') ? true : false
  }

  /**
   * Create the panels structure (objects and state) 
   * from a javascript/JSON object that takes the form:
   * {'items': 
   *    [
          {
            'text': 'About',
            'link': 'http://www.example.com/about',
            'items': [
                {
                'text': 'Our team',
                'link': 'http://www.example.com/our-team',
                },
                {
                'text': 'Our mission',
                'link': 'http://www.example.com/our-mission',
                'items': [
                  {
                  'text': 'Tertiary 1',
                  'link': 'http://www.example.com/tertiary-1',
                  }
            ]
          },
        ]
      },
   * @param {PanelContainerData} item_data 
   */
  initializeFromData(item_data: PanelContainerData): void {

    if (!this.validateItemData(item_data)) {
      throw "Invalid item data. Could not find items key"
    }
    else {
      this.item_data = item_data
      this.panels = []
      const panel : Panel = new Panel(this, this.state)

      if ( this.item_data && typeof(this.item_data.items) != 'undefined' ) {
        this.panelInitializeFromData(panel, this.item_data.items)
      }
    }

  }

  panelInitializeFromData(panel: Panel, item_data : Array<MenuItemData>, depth = 0) {

    panel.depth = depth
    this.addPanel(panel)

    item_data.forEach(
      item => {
        const menu_item = this.menuItemInitializeFromData(panel, item)
    
        if ( depth > 0 ) {
          //
          // Add a trigger for the parent panel if we're in a sub panel
          //
          const trigger_parent = new Trigger_Parent(this.state)
          trigger_parent.panel = panel
          trigger_parent.activates_panel = panel.parent
          trigger_parent.menu_item = panel.menu_item_parent
          panel.trigger_parent = trigger_parent
        }
        
        if ( typeof(item.items) != 'undefined') {
          const sub_panel = new Panel(this, this.state)
          const trigger_child = new Trigger_Child(this.state)

          trigger_child.activates_panel = sub_panel
          trigger_child.panel = panel

          sub_panel.parent = panel
          sub_panel.menu_item_parent = menu_item
          menu_item.sub_panel = sub_panel
          menu_item.trigger_child = trigger_child

          depth++
          this.panelInitializeFromData(sub_panel, item.items, depth)
          depth--
        }
      }

    )

  }

  menuItemInitializeFromData(panel: Panel, item: MenuItemData) {
    
    const menu_item = new MenuItem(this.state)
    menu_item.panel = panel
    panel.addMenuItem(menu_item)

    if ( typeof(item.link) != 'undefined' ) {
      const menu_item_link = new MenuItemLink(this.state)
      menu_item.link = menu_item_link
      menu_item_link.menu_item = menu_item
      menu_item_link.text = item.text
      menu_item_link.link = item.link
    }

    return menu_item
  }

  addPanel(panel : Panel) {
    this.panels.push(panel)
  }

  panelsReset() : void {
    this.panels = []
  }

}