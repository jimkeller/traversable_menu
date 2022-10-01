import { TraversableMenu } from '../core/traversable-core'
import { Options } from '../types/Options'
import { default_options } from '../init/default_options'
import PanelsContainer from '../components/PanelsContainer'

export default class InstanceState {

  public static Instance_count = 0

  panels_container: PanelsContainer
  panels_container_selector: string
  instance : TraversableMenu
  options : Options
  depth_max_canonical: number | null = null

  constructor(instance: TraversableMenu) {
    this.instance = instance
    this.options = default_options
  }
  
}