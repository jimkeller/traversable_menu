import PanelsContainer from '../components/PanelsContainer'
import InstanceState from '../state/InstanceState'
import { Renderer } from '../renderer/Renderer'
import Renderer_Panel from '../renderer/Renderer_Panel'
import Renderer_PanelsContainer from '../renderer/Renderer_PanelsContainer'
import { PanelContainerData } from '../types/ItemData'
import EventHandlers from '../event_handlers/EventHandlers'
import Parser from '../parser/Parser'
import { PartialOptions } from '../types/Options'
import merge from "ts-deepmerge"

export class TraversableMenu {

  state: InstanceState

  /**
   * Constructor
   * @param options Any of the available options; see documentation
   */
  constructor(options?: PartialOptions | undefined) {
    this.state = new InstanceState(this)

    if (options) {
      this.optionsApply(options)
    }

    InstanceState.Instance_count++

    this.state.panels_container = new PanelsContainer(this.state)

  }

  /**
   * Combines given options with a full set of options and saves
   * them in the instance state
   * @param options Any of the available options; see documentation
   */
  public optionsApply(options: PartialOptions) {
    this.state.options = merge(this.state.options, options)
  }

  /**
   * Initializes a traversable menu from existing HTML markup (see example for details)
   * @param {string} panels_container_selector the selector that holds the markup
   */
  public initializeFromHTML(panels_container_selector: string) {
    Parser.parse(panels_container_selector, this.state)

    if (this.state.options.panel.height_auto) {
      Renderer_PanelsContainer.panelsHeightStore(this.state)
    }
    Renderer_Panel.activateDefault(this.state)
    EventHandlers.apply(this.state)
    
  }

  /**
   * Initializes a traversable menu from JSON data (see example for details)
   * @param {PanelContainerData} item_data nested item data
   */
  public initializeFromData(item_data: PanelContainerData) {
    this.state.panels_container.initializeFromData(item_data)
  }

  render(): HTMLElement {
    return Renderer.render(this)
  }

  renderInto(container: Element): void {

    if (!container || typeof(container.appendChild) == 'undefined') {
      throw new Error("Could not append to given container. Check that you passed a valid, existing DOM element to renderInto")
    }

    const panels_container_element = this.render()
    
    container.appendChild(panels_container_element)

    if (this.state.options.panel.height_auto) {
      Renderer_PanelsContainer.panelsHeightStore(this.state)
    }
    
    Renderer_Panel.activateDefault(this.state)
    EventHandlers.apply(this.state)
  }

  debug(...args: any) {
    if ( this.state.options.core.debug ) {
      if ( args.length > 0 ) {
        for ( let i = 0; i < args.length; i++ ) {
          console.log( args[i] )
        }
      }
    }
  }

}

