import PanelsContainer from './PanelsContainer'
import InstanceState from "../state/InstanceState"
import { Trigger } from './Trigger'
import ComponentIdentifier from '../utils/ComponentIdentifier'
import MenuItem from './MenuItem'

/** 
 * Class representing a single "panel" of the menu 
 */
export default class Panel {
    
  private _id!: string
  private _depth = 0
  private _parent: Panel

  element!: Element
  container!: PanelsContainer
  state! : InstanceState
  
  trigger_parent: Trigger
  trigger_top: Trigger
  menu_item_parent: MenuItem
  menu_items: Array<MenuItem>
  title: string

  /**
   * Instantiate a Panel object
   * @param {PanelsContainer} The panels container that holds this panel 
   * @param {InstanceState} state The state object for this instance of the library 
   */
  constructor(container : PanelsContainer, state : InstanceState) {
    this.container = container
    this.state = state
    this.menu_items = []
    this._id = ComponentIdentifier.newID()
  }

  public get id(): string {
    return this._id
  }
  
  addMenuItem(item: MenuItem ) {
    this.menu_items.push(item)
  }

  public set depth(depth: number) {
    this._depth = depth
  }

  public get depth(): number {
    return this._depth
  }

  public set parent(parent: Panel) {
    this._parent = parent
  }

  public get parent(): Panel {
    return this._parent
  }

}

