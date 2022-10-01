import { Options } from "../types/Options"

const default_options:Options = {

  core: {
    debug: false
  },

  init: {
    auto_traverse_to_active: true
  },

  active: {
    'find_by_url': true,
    'find_by_class': true,
    'urls': null,
    'selectors': null,
    'selectors_additional': [],
    'parents_search_max': 10 //max attempts to find parent menu item element when finding active link.
                             //Should be high enough to go from a panel title to its parent menu item above
  },

  selectors: {
    'panel': '.menu__panel', //an individual menu panel - usually one level of the menu, shown expanded
    'panel_trigger_child': '.menu__panel__trigger--child', //trigger element that goes one level deeper,
    'panel_trigger_parent': '.menu__panel__trigger--parent',
    'panel_trigger_top': '.menu__panel__trigger--top',
    'panel_title': '.menu__panel__title', //title for a panel
    'panels_container': '.traversable-menu', //container that holds multiple panels
    'menu_item_active': '.menu__item--active', //currently active link (deepest)
    'menu_item_active_trail': '.menu__item--active-trail', //part of the active menu trail
    'menu_item': '.menu__item',
    'menu_item_link': '.menu__item__link',
    'menu_item_link_active': '.menu__item__link--active',
    'tabbable_elements': 'a', //Tabbing to these is disabled when menu panel is closed
  },

  triggers: {
    'parent_text': 'Up to [:previous-title:]',
    'child_text': 'Explore &gt;',
    'top_text': 'Up to Main Menu',
    'top_depth': 2, //the depth at which to start showing 'up to main menu' link
    'top_remove_auto': true, //whether to automatically remove 'up to main menu' link if the depth < triggers.top_depth
    'top_text_use_top_panel_title_at_first_level': false, //if panel_title_first is set, use that as our "top_text" at the first level below the topmost panel,
    'top_trigger_enabled': true,
    'parent_text_use_top_at_first_level': true, //whether to default to "top text" instead of "parent text" at depth == 0
    'events': [ 'keyup', 'mouseup' ]
  },

  accessibility: {
    'container_role': 'menubar',
    'panel_role': 'menu',
    'menu_item_role': 'menuitem',
    'menu_item_link_focus_first': true //set focus to first menu item link when panel is shown using keyboard
  },

  panel: {
    'auto_scroll_to_top': true,
    'height_auto': true,
    'zindex_auto': true,
    'zindex_start': 10,
    'container_height_auto': true, //whether to automatically set the panel container height
    'slide_animation_duration': 350, //in ms
    'title_first': '', //the title of the first panel
    'title_text': '[:menu-title:]', //title of subsequent panels. [:menu-title:] will be replaced by the text of the link that expands to show the menu
    'title_link_enabled': true,
    'title_enabled': true,
    'title_element': 'h2'
  },

  panels_container: {
    height_auto: true
  },

  classes: {
    'panel': null,
    'panels_container': null,
    'panel_trigger_child': null,
    'panel_trigger_parent': null,
    'panel_trigger_top': null,
    'menu_item': null,
    'panels_initialized': 'traversable-menu--initialized',
    'panel_active': 'menu__panel--active',
    'panel_active_trail': 'menu__panel--active-trail',
    'panel_active_parent': 'menu__panel--active-parent',
    'panel_child_open': 'menu__panel--child-open',
    'panel_show_immediate': '-show-immediate',
    'panel_depth': 'menu__panel--depth-[:n:]',
    'panel_height_auto_applied': '-panel-height-auto',
    'panels_container_height_auto_applied': '-panels-container-height-auto',
    'panel_title_link': 'menu__panel__title__link',
    'menu_item_link': 'menu__item__link',
    'menu_item_link_active': 'menu__item__link--active',
  },

  'render': {
    'panels_container': null,
    'depth_max': null,
    'depth_max_relative': null
  },

  'errors': {
    'silent_if_no_container': true
  },
  callbacks: {
    trigger: {
      before: null,
      on: null,
      after: null
    },
    panel: {
      activate: {
        before: null,
        after: null
      },
      initialize: {
        before: null,
        after: null
      },
      'assimilate': {
        'before': null,
        'after': null
      }
    },
    panels: {
      initialize: {
        before: null,
        after: null
      }
    }
  }
}

const classNameFromSelector = function( selector : string ) {

  const split = selector.split('.')
  const final = split[split.length-1]

  return selector.toString().replace(/^\./, '')
}
  
let selector : string

for ( selector in default_options['selectors'] ) {
  if ( typeof(default_options['classes'][selector]) != 'undefined' && default_options['classes'][selector] == null ) {
    default_options['classes'][selector] = classNameFromSelector(default_options['selectors'][selector])
  }
}

export { default_options }