
/***
*  @function: TraversableMenu
*  @description:  Traversable sliding menu
***/
function TraversableMenu( options ) {

  try {
    options = options || {};

    this.options = options;
    this.panelsInitialize();

    var panel_auto_activated = false;

    if ( this.option('auto_traverse_to_active') ) {
      panel_auto_activated = this.panelActivateByActiveMenuItem();
    }

    if ( !panel_auto_activated ) {
      //
      // activate first panel
      //
      var panels_container = this.panelsGetContainer();

      if ( panels_container ) {
        var topmost_panel      = this.childPanelGet(panels_container); //get the first panel

        if ( topmost_panel ) {
          this.panelActivate(topmost_panel);
        }
      }

    }
  }
  catch( e ) {
    if ( typeof(console) !== 'undefined' && typeof(console.log) !== 'undefined') {
      console.log( "Error initializing traversable menu");
      console.log(e.message);
    }
  }

}

/**
 * Gets an option by name, or sets an option if val parameter is present. Checks local options and falls back to global options
 * @param {string} key
 * @param {mixed} val (optional)
 * @return none
 */
TraversableMenu.prototype.option = function ( key, val ) {
  try {

    var ret;

    if ( typeof(val) === 'undefined' ) {
      ret = TraversableMenu.Get_if_set( this.options, key);

      if ( typeof(ret) == 'undefined' ) {
        ret = TraversableMenu.Get_if_set( TraversableMenu.options_default(), key );
      }

      return ret;
    }
    else {
      this.options[key] = val;
    }
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelsGetContainer = function() {
  try {
    return window.document.querySelector( this.option('selectors.panels_container') );
  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.prototype.panelByChildElement = function( element ) {
  try {

    var parent;

    while ( parent = element.parentElement ) {
      if ( parent.classList.contains(TraversableMenu.classNameFromSelector(this.option('selectors.panel'))) ) {
        return parent;
      }

      element = parent;
    }

    return null;
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelsInitialize = function() {

  try {

    var panels_container = this.panelsGetContainer();

    if ( panels_container ) {
      panels_container.setAttribute( 'role', this.option('accessibility.container_role') );

      //
      // Initialize menu panels
      //
      var child_panel      = this.childPanelGet(panels_container);

      if ( child_panel ) {
        this.panelInitialize(child_panel, 0 );
      }

      panels_container.classList.add( this.option('classes.panels_initialized') );
    }
    else {
      if ( !this.option('errors.silent_if_no_container') ) {
        throw "Could not get panels container. Check your container selector, which is set to: " + this.option('selectors.panels_container').toString();
      }
    }
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelInitialize = function( panel, depth, options ) {
  try {

    options = options || {}

    var child_panel;
    var panel_trigger;
    var menu_item;
    var parent_menu_item_link;
    var parent_panel = ( typeof(options.panel_parent) !== 'undefined' ) ? options.panel_parent : null;
    var panel_index = ( typeof(options.menu_item_index) !== 'undefined' ) ? options.menu_item_index : 0;
    var parent_menu_item = ( typeof(options.parent_menu_item) !== 'undefined' ) ? options.parent_menu_item : null;


    //
    // Base panel initialization
    //
    panel.setAttribute( 'data-panel-depth', depth.toString() );
    panel.classList.add( TraversableMenu.tokenReplace(this.option('classes.panel_depth'), 'n', depth.toString()) );
    panel.setAttribute( 'data-panel-index', panel_index.toString() );
    panel.setAttribute( 'role', this.option('accessibility.panel_role') );
    this.panelIDSetByDepthIndex( panel, depth, panel_index );

    if ( depth == 0 ) {
      this.panelTitle( panel, this.option('panel_title_first') );
    }

    this.topTriggerInit( panel );

    if ( parent_panel ) {
      panel.setAttribute( 'data-panel-parent-id', parent_panel.getAttribute('id') );
    }

    if ( parent_menu_item ) {

      parent_menu_item_link = parent_menu_item.querySelector( this.option('selectors.menu_item_link') );

      //
      // Remember the link text that triggers this panel,
      // So we can say 'up to X menu' later
      //
      panel.setAttribute('data-parent-link-text', parent_menu_item_link.innerHTML );
      this.parentTriggerInit(parent_menu_item, panel);
    }

    //
    // Initialize child triggers and sub-panel (child) if present
    //
    var menu_items = this.childMenuItemsGet(panel);

    for ( var i = 0; i < menu_items.length; i++ ) {

      this.menuItemInit(menu_items[i]);

      child_panel = this.childPanelGet(menu_items[i]);

      if ( child_panel ) {

        //
        // Recursively call panelInitialize on the child panel
        //
        depth++;
        this.panelInitialize( child_panel, depth, { panel_parent: panel, parent_menu_item: menu_items[i], menu_item_index: i } );
        depth--;

        //
        // Initialize child triggers
        //
        this.childTriggerInit(menu_items[i], panel);


      }
    }

  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.prototype.menuItemInit = function( menu_item ) {
  try {
    menu_item.setAttribute( 'role', this.option('accessibility.menu_item_role') );
  }
  catch(e) {
    throw e;
  }
}

/**
 * Initialize the "parent" triggers that show a panel one level up
 * Must be called after panel itself has been initialized
 * @param {DomElement} menu_item
 * @param {DomElement} panel
 * @return none
 */
TraversableMenu.prototype.parentTriggerInit = function( menu_item, panel ) {

  try {
    var me = this;
    var parent_panel = this.panelGetParent(panel);
    var parent_triggers;

    if ( parent_panel ) {
      parent_triggers = TraversableMenu.siblingChildrenBySelector( menu_item, this.option('selectors.panel_trigger_parent') );

      for ( var i = 0; i < parent_triggers.length; i++ ) {
        var trigger = parent_triggers[i];

        trigger.setAttribute('data-panel-trigger-for', this.panelID(parent_panel) );
        this.parentTriggerTextApply(trigger);

        //
        // Apply click event
        //
        trigger.addEventListener('click',
          function( event ) {
            event.preventDefault();

            //$(this).parents( active_selector ).eq(0).removeClass(me.option('classes').panel_currently_active);
            me.panelActivate( parent_panel );
            return false;
          }
        );
      }
    }
  }
  catch(e) {
    throw e;
  }

}

/**
 * Automagically apply the "Up to [X] menu" text for parent panel triggers
 * @param {DomElement} trigger
 * @return none
 */
TraversableMenu.prototype.parentTriggerTextApply = function( trigger ) {

  try {
    var parent_panel_id = trigger.getAttribute('data-panel-trigger-for');
    var parent_panel    = this.panelGetByID( parent_panel_id );

    if ( parent_panel ) {
      var trigger_text = this.option('triggers.parent_text');
      var parent_depth = parent_panel.getAttribute('data-panel-depth');
      var parent_link_text;

      if ( parent_depth > 0 ) {
        trigger_text = this.option('triggers.parent_text');
        parent_link_text = parent_panel.getAttribute('data-parent-link-text');
      }
      else {
        if ( this.option('triggers.top_text') ) {

          if ( this.option('panel_title_first') && this.option('triggers.top_text_use_top_panel_title_at_first_level') ) {
            parent_link_text = this.option('panel_title_first');
          }
          else {
            trigger_text = this.option('triggers.top_text');
          }
        }
      }

      if ( trigger_text ) {
        if ( parent_link_text ) {
          trigger.innerHTML = TraversableMenu.tokenReplace( trigger_text, 'previous-title', parent_link_text );
        }
        else {
          trigger.innerHTML = trigger_text;
        }
      }

    }
  }
  catch( e ) {
    throw e;
  }

}

/**
 * Initialize the "child" triggers that show a deeper panel
 * Must run after the panel itself has been initialized
 * @param {DomElement} menu_item
 * @return none
 */
TraversableMenu.prototype.childTriggerInit = function( menu_item, panel ) {

  try {
    var me = this;
    var trigger = menu_item.querySelector( this.option('selectors.panel_trigger_child') );
    var menu_item_link = menu_item.querySelector( this.option('selectors.menu_item_link') );
    var child_panel = menu_item.querySelector( this.option('selectors.panel') );

    if ( typeof(trigger) !== 'undefined' && trigger ) {

      var panel_depth = child_panel.getAttribute('data-panel-depth');
      var panel_index = child_panel.getAttribute('data-panel-index');
      var menu_item_link_text = menu_item_link.innerHTML;

      trigger.setAttribute('id', this.elementIDPrefix() + '_trigger_' + panel_depth.toString() + '_' + panel_index.toString() );
      // @TODO Fix aria expanded settings trigger.setAttribute('aria-expanded', false);
      trigger.setAttribute('aria-controls', this.panelID(child_panel) );
      trigger.setAttribute('data-panel-trigger-for', this.panelID(child_panel) );

      child_panel.setAttribute('data-panel-triggered-by', trigger.getAttribute('id') );

      this.panelTitle( child_panel, menu_item_link_text );

      //
      // Apply click event
      //
      trigger.addEventListener('click',
        function( event ) {
          event.preventDefault();
          me.panelActivate(child_panel);
          return false;
        }

      );
    }
  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.prototype.topTriggerInit = function( panel ) {

  try {

    var depth = panel.getAttribute('data-panel-depth');
    var top_trigger = panel.querySelector( this.option('selectors.panel_trigger_top') );
    var me = this;

    if ( top_trigger ) {
      if ( depth >= this.option('triggers.top_depth') ) {

        var panels_container = this.panelsGetContainer();

        if ( panels_container ) {
          var topmost_panel      = this.childPanelGet(panels_container); //get the first panel

          if ( topmost_panel ) {
            top_trigger.innerHTML = this.option('triggers.top_text');
            top_trigger.addEventListener('click',
              function( event ) {
                event.preventDefault();
                me.panelActivate(topmost_panel);
                return false;
              }
            );
          }
        }
      }
      else {
        if ( this.option('triggers.top_remove_auto') ) {
          top_trigger.style.display = 'none';
          //top_trigger.parentNode.removeChild(top_trigger);
        }
      }
    }

  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelTitle = function( panel, title ) {

  try {

    var title_element = panel.querySelector( this.option('selectors.panel_title') );

    if ( title_element ) {
      title_element.innerHTML = TraversableMenu.tokenReplace( this.option('panel_title_text'), 'menu-title', title );
    }

  }
  catch(e) {
    throw e;
  }
}

/**
 * Returns the immediate child panels of the container element
 * @param {DomElement} container the DomElement of the panels container
 * @return {NodeList} returns nodeList of found elements
 */
TraversableMenu.prototype.childPanelGet = function( container ) {
  try {

    return ( container ) ? container.querySelector( this.option('selectors.panel') ) : null;

  }
  catch(e) {
    throw e;
  }
}

/**
 * Returns the immediate child menu items of the container element
 * @param {DomElement} container the DomElement of the panels container
 * @return {NodeList} returns nodeList of found elements
 */
TraversableMenu.prototype.childMenuItemsGet = function( container ) {

  try {
    return TraversableMenu.siblingChildrenBySelector( container, this.option('selectors.menu_item') );
  }
  catch(e) {
      throw e;
  }

}

/**
 * Find an element inside the sliding menu
 * @param {string} selector The selector to find
 * @return {DomElement} returns DomElement element if found; null otherwise
 */
TraversableMenu.prototype.elementFind = function( selector ) {

  try {
    var container = this.panelsGetContainer();
    return container.querySelector( selector );
  }
  catch(e) {
    throw e;
  }

}

/**
 * Find all matching elements inside the sliding menu
 * @param {string} selector The selector to find
 * @return {DomElement} returns DomElement element if found; null otherwise
 */
TraversableMenu.prototype.elementFindAll = function( selector ) {

  try {
    var container = this.panelsGetContainer();

    if ( container ) {
      return container.querySelectorAll( selector );
    }

    return null;

  }
  catch(e) {
    throw e;
  }

}

/**
* Automatically show the 'active' menu panel by finding the deepest instance of menu_item_currently_active_selector
* @param none
* @return true if an active menu panel was found, false otherwise
*/
TraversableMenu.prototype.panelActivateByActiveMenuItem = function() {

  try {
    var active_items;
    var active_panel;
    var child_panel;
    var last_active_item;

    //
    // See if we can find the deepest instance of the menu_item_currently_active selector
    //
    active_items = this.elementFindAll( this.option('selectors.menu_item_active') );

    if ( active_items && active_items.length > 0 ) {
      last_active_item = active_items[ active_items.length - 1 ];

      active_panel = this.panelByChildElement(last_active_item);

      if ( this.option('auto_traverse_skip_levels') > 0 && !isNaN(this.option('auto_traverse_skip_levels')) ) {
        var levels_remaining = this.option('auto_traverse_skip_levels');

        while( levels_remaining > 0 ) {
          if ( child_panel = this.childPanelGet(last_active_item) ) {
            active_panel = child_panel;
          }
          levels_remaining--;
        }
      }

      if ( active_panel ) {
        this.panelActivate(active_panel, { 'show_immediate': true });
        return true;
      }
    }

    return false;
  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.prototype.panelsGetAll = function() {
  try {
    return this.elementFindAll( this.option('selectors.panel') );
  }
  catch (e) {
    throw e;
  }

}

/**
 * Reset all panels to inactive
 * @param none
 * @return none
 */
TraversableMenu.prototype.panelsResetActive = function( options ) {

  try {
    options = options || {};

    var all_panels = this.panelsGetAll();

    for ( var i = 0; i < all_panels.length; i++ ) {
      this.panelActiveAttributesRemove( all_panels[i] );
    }
  }
  catch (e) {
    throw e;
  }

}

TraversableMenu.prototype.elementIDPrefix = function() {
  return this.option('selectors.panels_container').replace(/[^A-Za-z0-9_]/g, '_' ).replace(/^_/, '');
}

TraversableMenu.prototype.panelID = function( panel ) {
  return panel.getAttribute('id');
}

TraversableMenu.prototype.panelIDSetByDepthIndex = function( panel, depth, index ) {

  try {

    var id_suffix = 'panel_' + depth.toString() + '_' + index.toString();

    //panel.setAttribute( 'data-panel-id', id_suffix );
    panel.setAttribute( 'id', this.elementIDPrefix() + '_' + id_suffix );

  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelGetByID = function( id ) {

  try {
    //return this.elementFind( this.option('selectors.panel') + '[data-panel-id=' + id + ']' );
    return this.elementFind( '#' + id );
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelGetParentID = function( panel ) {
  try {
    return panel.getAttribute('data-panel-parent-id');
  }
  catch (e) {
    throw e;
  }
}

TraversableMenu.prototype.panelGetParent = function( panel ) {
  try {
    return this.panelGetByID( this.panelGetParentID(panel) );
  }
  catch (e) {
    throw e;
  }
}


TraversableMenu.prototype.panelGetActive = function() {

  return this.elementFind( this.option('selectors.panel') + '.' + this.option('classes.panel_active') );

}

TraversableMenu.prototype.panelIsActive = function( panel ) {
  return ( panel.classList.contains(this.option('classes.panel_active')) ) ? true : false;
}

TraversableMenu.prototype.panelActivate = function( panel, options ) {

  options = options || {};

  var me = this;
  var show_immediate =  ( typeof(options.show_immediate) !== 'undefined' && options.show_immediate ) ? true : false;
  var focus_timeout = ( show_immediate ) ? 0 : this.option('panel_slide_animation_duration');

  if ( !this.panelIsActive(panel) ) {

    this.panelsResetActive();

    //
    // Show this panel
    //
    if ( show_immediate ) {
        panel.classList.add( this.option('classes.panel_show_immediate') );
    }


    //@TODO replace li with selector
    //$(panel).parent('li').addClass( this.option('classes').panel_child_open );
    //let $parent_title = $(panel).parent('li').find( this.option('selectors').menu_item_link ).eq(0);

    this.panelActiveAttributesApply( panel );
    this.activeTrailRecalculate();


    window.setTimeout(
      function() {
        if( me.option('accessibility.menu_item_link_focus_first') ) {
          var first_menu_link = panel.querySelector( me.option('selectors.menu_item_link') );
          if ( first_menu_link ) {
            first_menu_link.focus();
          }
        }
      },
      focus_timeout
    );

    window.requestAnimationFrame(
      function() {
        panel.classList.remove( me.option('classes.panel_show_immediate') );
      }
    );
  }

}

/**
 * Apply all the attributes (classes, etc) that make a panel "active" or shown.
 * @param {DomElement} panel
 * @return none
 */
TraversableMenu.prototype.panelActiveAttributesApply = function( panel ) {
  try {

    panel.classList.add( this.option('classes.panel_active') );
    panel.setAttribute('aria-hidden', 'false');
    panel.setAttribute('tabindex', '0');

    this.panelActiveTrailApply(panel);
    this.tabbablesToggle( panel, true );
  }
  catch(e){
    throw e;
  }
}

TraversableMenu.prototype.panelActiveAttributesRemove = function( panel ) {

  try {
    panel.classList.remove( this.option('classes.panel_active') );
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('tabindex', '-1');

    this.tabbablesToggle( panel, false );


  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.activeTrailRecalculate = function() {
  try {

    var active_panel = this.panelGetActive();
    var all_panels = this.panelsGetAll();

    if ( all_panels ) {
      for ( var i = 0; i < all_panels.length; i++ ) {
        this.panelActiveTrailUnset(all_panels[i]);
      }

      if ( active_panel ) {
        this.panelActiveTrailApply( active_panel );
      }

    }
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelActiveTrailUnset = function( panel ) {
  try {

      var child_panel;

      panel.classList.remove( this.option('classes.panel_active_trail') );
      panel.classList.remove( this.option('classes.panel_child_open') );

      if ( child_panel = this.childPanelGet(panel) ) {
        this.panelActiveTrailUnset(child_panel);
      }
  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.prototype.panelActiveTrailApply = function( panel ) {
  try {

    var panel_parent;

    panel.classList.add( this.option('classes.panel_active_trail') );

    if ( panel_parent = this.panelGetParent(panel) ) {
      panel_parent.classList.add( this.option('classes.panel_child_open') );
      this.panelActiveTrailApply(panel_parent);
    }

  }
  catch( e ) {
    throw e;
  }
}

TraversableMenu.prototype.selectorFromClassName = function( class_name ) {
  return '.' + class_name.toString();
}

/**
 * Provides the ability to operate *ONLY* on a specific panel, without traversing into subpanels
 * useful for when you want to operate on a single panel but not its subpanels
 */
TraversableMenu.prototype.onlyThisPanel = function( panel, callback ) {

  var children = panel.children;
  var child;

  for ( var i = 0; i < children.length; i++ ) {

    child = children[i];

    if ( !child.matches( this.option('selectors.panel')) ) {

      callback.call( this, child );
      this.onlyThisPanel(child, callback);
    }
  }

  callback.call( this, panel );

}

/**
 * Enables or disables tabbing to elements. For accessibility compliance, certain elements have their tabindex
 * removed when the accordion is closed (e.g. a, input)
 * @param {DomElement} raw DOM element the containing element whose "tabbable" elements will be disabled
 * @param {boolean} action true to enable, false to disable
 * @param {Object} options miscellaneous options. Currently unused
 * @return none
 */
TraversableMenu.prototype.tabbablesToggle = function( which_element, action, options ) {

  try {

    options = options || {};
    var tabindex = ( action == true ) ? '0' : '-1';

    this.onlyThisPanel( which_element,
      function( child ) {
        if ( child.matches(this.option('selectors.tabbable_elements')) ) {
          child.setAttribute('tabindex', tabindex);
        }
      }
    );

  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.tokenReplace = function( given_string, token, val ) {
  return given_string.replace( '[:' + token.toString() + ':]', val);
}


TraversableMenu.classNameFromSelector = function( selector ) {
  return selector.toString().replace(/^\./, '');
}

/**
 * Utility function to check whether nested object keys are set, without getting a TypeError
 * @param {Object} obj the object whose keys you wish to check
 * @param {String} keys the keys you wish to look for, e,g. ['level1', 'level2']
 * @return {Boolean} true if the key exists, false otherwise
 */
TraversableMenu.Get_if_set = function( obj, keys ) {
  try {
    var ret = undefined;
    eval ('ret = obj' + '.' + keys);
    return ret;
  }
  catch(e) {
    return undefined;
  }
}

/**
 * Utility function to get only the sibling children of an object, filtered by a selector
 * @param {DomElement} container the element you wish to find children of
 * @param {String} selector the selector to filter the children by
 * @return {NodeList} matching NodeList if found, empty array otherwise
 */
TraversableMenu.siblingChildrenBySelector = function( container, selector ) {
  try {
    var first_item = container.querySelector( selector );

    if ( first_item ) {
      var first_item_parent = first_item.parentNode;
      var all_items = container.querySelectorAll( selector );

      if ( all_items.length > 0 ) {
        var child_items_only = [].filter.call(all_items,
          function( item ) {
            return item.parentNode == first_item_parent;
          }
        );

        return child_items_only;
      }
    }

    return [];

  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.options_default = function() {
  return {
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
      'tabbable_elements': 'a' //Tabbing to these is disabled when menu panel is closed
    },
    classes: {
      'panels_initialized': 'traversable-menu--initialized',
      'panel_active': 'menu__panel--active',
      'panel_active_trail': 'menu__panel--active-trail',
      'panel_active_parent': 'menu__panel--active-parent',
      'panel_child_open': 'menu__panel--child-open',
      'panel_show_immediate': '-show-immediate',
      'panel_depth': 'menu__panel--depth-[:n:]'

    },
    triggers: {
      'parent_text': 'Up to [:previous-title:] menu',
      'top_text': 'Up to Main Menu',
      'top_depth': 2, //the depth at which to start showing 'up to main menu' link
      'top_remove_auto': true, //whether to automatically remove 'up to main menu' link if the depth < triggers.top_depth
      'top_text_use_top_panel_title_at_first_level': false //if panel_title_first is set, use that as our "top_text" at the first level below the topmost panel
    },
    accessibility: {
      'container_role': '',
      'panel_role': '',
      'menu_item_role': '',
      'menu_item_link_focus_first': true //set focus to first menu item link when panel is shown
    },
    'panel_slide_animation_duration': 350, //in ms
    'panel_title_first': '', //the title of the first panel
    'panel_title_text': '[:menu-title:]', //title of subsequent panels. [:menu-title:] will be replaced by the text of the link that expands to show the menu
    'auto_traverse_to_active': true,
    'auto_traverse_skip_levels': 0,
    'siblings_at_lowest_level': false,
    'errors': {
      'silent_if_no_container': true
    }
  };
}

//
// A quick polyfill to support Element.matches in older browsers
// See: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
//
if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = TraversableMenu;
}
