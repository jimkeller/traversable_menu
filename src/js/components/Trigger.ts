import InstanceState from "../state/InstanceState"
import TriggerType from "../types/TriggerType"
import Panel from "./Panel"
import MenuItem from './MenuItem'
import ComponentIdentifier from "../utils/ComponentIdentifier"
import { TOKEN_PARENT_TITLE } from "../constants/constants"
import Tokenizer from "../utils/tokenizer"

interface TriggerInterface {
  get text():string
  get classname(): string
}

export class Trigger implements TriggerInterface{

  private _id : string
  private _activates_panel: Panel

  panel: Panel
  state: InstanceState
  element: Element
  index: number
  type: TriggerType
  
  menu_item : MenuItem

  constructor(state : InstanceState) {
    this.state = state
    this._id = ComponentIdentifier.newID()
  }

  public set activates_panel( panel : Panel ) {
    this._activates_panel = panel
  }  

  public get activates_panel() : Panel {
    return this._activates_panel
  }

  public get id() {
    return this._id
  }

  public get text() {
    return ""
  }

  public get classname() {
    return ""
  }

}

export class Trigger_Child extends Trigger {

  constructor(state : InstanceState) {
    super(state)
  }
  
  public get text(): string {
    return this.state.options.triggers.child_text
  }

  public get classname(): string {
    return this.state.options.classes.panel_trigger_child
  }

}

export class Trigger_Parent extends Trigger {

  constructor(state: InstanceState) {
    super(state)
  }

  public get text(): string {
    
    let text = ""

    if (this.panel 
      && this.panel.depth < this.state.options.triggers.top_depth
      && this.state.options.triggers.top_remove_auto) {
      
      /* The parent uses the "top" trigger text if we're beneath top_depth and top_remove_auto is true */
      text = this.state.options.triggers.top_text
    }
    else {
      /* Pull the title from 2 menu items above because that gives us the title of the parent panel */
      if ( this.menu_item && this.menu_item.panel ) {
        const menu_item_parent = this.menu_item.panel.menu_item_parent
        if (menu_item_parent) {
          const menu_item_link = menu_item_parent.link
          text = Tokenizer.replace(this.state.options.triggers.parent_text, TOKEN_PARENT_TITLE, menu_item_link.text)
        }
      }
    }

    return text
  }

  public get classname(): string {
    return this.state.options.classes.panel_trigger_parent
  }

}

export class Trigger_Top extends Trigger {

  constructor(state: InstanceState) {
    super(state)
  }

  public get text(): string {
    return this.state.options.triggers.top_text
  }

  public get classname(): string {
    return this.state.options.classes.panel_trigger_top
  }

}

