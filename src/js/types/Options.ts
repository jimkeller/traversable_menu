import InstanceState from "../state/InstanceState"

interface Options_Selectors {
    'panel': string,
    'panel_trigger_child': string,
    'panel_trigger_parent': string,
    'panel_trigger_top': string,
    'panel_title': string,
    'panels_container': string,
    'menu_item_active': string,
    'menu_item_active_trail': string,
    'menu_item': string,
    'menu_item_link': string,
    'menu_item_link_active':string,
    'tabbable_elements': string,
}

interface Options_Init {
  auto_traverse_to_active: boolean
}

interface Options_Triggers {
    'parent_text': string,
    'child_text': string,
    'top_text': string,
    'top_depth': number,
    'top_remove_auto': boolean,
    'top_text_use_top_panel_title_at_first_level': boolean
    'parent_text_use_top_at_first_level': boolean
    'events': string[],
    'top_trigger_enabled': boolean

}

interface Options_Accessibility {
  'container_role': string,
  'panel_role': string,
  'menu_item_role': string,
  'menu_item_link_focus_first': boolean    
}

interface Options_Panel {
  'auto_scroll_to_top': boolean,
  'height_auto': boolean,
  'zindex_auto': boolean,
  'zindex_start': number,
  'container_height_auto': boolean, //whether to automatically set the panel container height
  'slide_animation_duration': number, //in ms
  'title_first'?: string, //the title of the first panel
  'title_text': string, //title of subsequent panels. [:menu-title:] will be replaced by the text of the link that expands to show the menu
  'title_enabled': boolean,
  'title_link_enabled': boolean,
  'title_element': string
}

interface Options_Render {
  'panels_container': string | null,
  'depth_max': number | null,
  'depth_max_relative': number | null
}

interface Options_Error {
  'silent_if_no_container' : boolean
}

interface Options_Classes {
  'panel': string,
  'panel_trigger_child': string,
  'panel_trigger_parent': string,
  'panel_trigger_top': string,
  'menu_item': string,
  'panels_container': string,
  'panels_initialized': string,
  'panel_active': string,
  'panel_active_trail': string,
  'panel_active_parent': string,
  'panel_child_open': string,
  'panel_show_immediate': string,
  'panel_depth': string,
  'panel_height_auto_applied': string,
  'panels_container_height_auto_applied': string,
  'panel_title_link': string,
  'menu_item_link': string,
  'menu_item_link_active': string
}

interface Callback_functions {
  before: (event: Event, state: InstanceState ) => boolean | null,
  on?: (event: Event, state: InstanceState ) => boolean | null,
  after: (event: Event, state: InstanceState ) => boolean | null
}

interface Options_Callbacks {
  trigger: Callback_functions,
  panel: {
    activate: Callback_functions,
    initialize: Callback_functions,
    assimilate: Callback_functions
  },
  panels: {
    initialize:Callback_functions
  }
}

interface Options_Core {
  debug: boolean
}

interface Options_PanelsContainer {
  'height_auto': boolean
}

interface Options_Active {
  'find_by_url': boolean,
  'find_by_class': boolean,
  'urls': Array<string> | Function | null,
  'selectors': Array<string> | null,
  'selectors_additional': Array<string> | null,
  'parents_search_max': number //max attempts to find parent menu item element when finding active link.
                            //Should be high enough to go from a panel title to its parent menu item above
}

interface Options {
    init: Options_Init,
    core: Options_Core,
    selectors: Options_Selectors,
    triggers: Options_Triggers,
    accessibility: Options_Accessibility,
    panel: Options_Panel,
    panels_container: Options_PanelsContainer,
    render: Options_Render,
    errors: Options_Error,
    classes: Options_Classes,
    callbacks: Options_Callbacks,
    active: Options_Active
}

interface PartialOptions {
  init?: Partial<Options_Init>,
  core?: Partial<Options_Core>,
  selectors?: Partial<Options_Selectors>,
  triggers?: Partial<Options_Triggers>,
  accessibility?: Partial<Options_Accessibility>,
  panel?: Partial<Options_Panel>,
  panels_container?: Partial<Options_PanelsContainer>,
  render?: Partial<Options_Render>,
  errors?: Partial<Options_Error>,
  classes?: Partial<Options_Classes>,
  callbacks?: Partial<Options_Callbacks>,
  active?:Partial< Options_Active>
}

export { PartialOptions, Options };