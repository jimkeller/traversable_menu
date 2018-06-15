/*
 * Copyright (c) 2017 Jim Keller, Eastern Standard
 * https://www.easternstandard.com
 */


/***
*  @function: TraversableMenu
*  @description:  Traversable sliding menu
***/
function TraversableMenu( options ) {

  var success = true;
  var callback = null;
  var callback_params = { traversable_menu: this };

  try {
    options = options || {};

    this.options = options;
    this.menu_item_index = 0;
    this.menu_item_active = null;
    this.panel_active = '';
    this.panels_active_trail = {};
    this.panels_container = null;
    this.depth_max_canonical = null;

    //
    // Fire 'before' initialize callback
    //
    if ( callback = this.option('callbacks.panels.initialize.before') ) {
      callback.call(this, callback_params);
    }

    success = this.panelsInitialize();
    this.panelsHeightStore();

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
          this.panelActivate(topmost_panel, { 'show_immediate': true });
        }
      }

    }

    //
    // Resize handler
    //
    var me = this;

    window.addEventListener( 'resize',
      function() {
        me.resizeHandler();
      }
    );

  }
  catch( e ) {

    success = false;

    if ( typeof(console) !== 'undefined' && typeof(console.error) !== 'undefined') {
      console.error( "Error initializing traversable menu");
      console.error(e.message);
      console.error(e);
    }
  }
  finally {

    //
    // Fire 'after' initialize callback
    //
    callback_params.success = success;
    if ( callback = this.option('callbacks.panels.initialize.after') ) {
      callback.call(this, callback_params);
    }

  }
}

TraversableMenu.prototype.resizeHandler = function( ) {

  this.panelsHeightStore();
  this.panelActiveHeightApply();

}

// TraversableMenu.prototype.panelsContainerHeightApply = function (  ) {
//   var panels_container = this.panelsGetContainer();
//
//   if ( panels_container ) {
//
//   }
//
// }

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

      var keys = key.split('.');
      var key_string = '';
      var val_typeof = null;
      var i;

      for ( i = 0; i < keys.length; i++ ) {

        key_string = key_string + '[\'' + keys[i] + '\']';

        eval( 'val_typeof = typeof(this.options' + key_string + ')');

        if ( val_typeof == 'undefined' ) {
          eval( 'this.options' + key_string + '={};');          
        }        
        
      }

      if ( key_string ) {
        eval( 'this.options' + key_string + '=val;');           
      }
      else {
        throw 'Invalid parameters passed to option set';
      }
      
    }
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelsGetContainer = function() {
  try {
    
    if ( !this.panels_container ) {
      if ( this.option('render.panels_container') ) {
        this.panels_container = this.option('render.panels_container');
      }
      else {
        this.panels_container = window.document.querySelector( this.option('selectors.panels_container') );   
      }      
    }

    return this.panels_container;
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

    var success = true;
    var panels_container = this.panelsGetContainer();

    if ( panels_container ) {
      panels_container.setAttribute( 'role', this.option('accessibility.container_role') );

      //
      // If we're looking to set a max depth relative to the active item, do it now
      //
      if ( this.depth_max_canonical === null ) {
        if ( this.option('render.depth_max_relative') !== null ) {
          this.menu_item_active = this.activeMenuItemFind();
          var depth_max_relative_index = ( this.option('render.depth_max_relative') == 0 ) ? this.option('render.depth_max_relative') : this.option('render.depth_max_relative') - 1;

          if ( this.menu_item_active ) {
            var search_parent = this.menu_item_active.parentNode;
            var active_depth = 0;
            //  
            // Find out how deep the active item is by scanning the DOM, since nothing has
            // been initialized yet
            //
            while ( search_parent && search_parent !== document ) {

              if ( search_parent.matches(this.option('selectors.panel')) ) {
                active_depth++;
              }

              search_parent = search_parent.parentNode;
            }

            this.depth_max_canonical = active_depth + depth_max_relative_index;

            if ( this.childPanelGet(this.menu_item_active) ) {
              this.depth_max_canonical += this.option('auto_traverse_skip_levels');
            }

          }
        }
        else {
          this.depth_max_canonical = this.option('render.depth_max');
        }
      }
      else {
          this.depth_max_canonical = this.option('render.depth_max');
      }

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
      success = false;
    }

    if ( !this.option('errors.silent_if_no_container') ) {
      throw "Could not get panels container. Check your container selector, which is set to: " + this.option('selectors.panels_container').toString();
    }    

    return success;

  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelInitialize = function( panel, depth, options ) {
  try {

    options = options || {}

    var continue_recurse = true;
    var child_panel;
    var panel_trigger;
    var menu_item;
    var parent_menu_item_link;
    var parent_panel = ( typeof(options.panel_parent) !== 'undefined' ) ? options.panel_parent : null;
    var parent_menu_item = ( typeof(options.parent_menu_item) !== 'undefined' ) ? options.parent_menu_item : null;

    this.debug('menu item index', this.menu_item_index, panel);

    //
    // Base panel initialization
    //
    panel.setAttribute( 'data-panel-depth', depth.toString() );
    panel.classList.add( TraversableMenu.tokenReplace(this.option('classes.panel_depth'), 'n', depth.toString()) );
    panel.setAttribute( 'data-panel-index', this.menu_item_index.toString() );
    panel.setAttribute( 'role', this.option('accessibility.panel_role') );
    this.panelIDSetByDepthIndex( panel, depth, this.menu_item_index );
    this.panelActiveAttributesRemove( panel ); //Assume inactive to start; will be activated later

    // if ( this.option('panel_height_auto') ) {
    //   this.panelApplyCalculatedHeight( panel );
    // }

    if ( depth == 0 ) {
      this.panelTitleTextSet( panel, this.option('panel_title_first') );
    }

    this.topTriggerInit( panel );

    if ( parent_panel ) {
      panel.setAttribute( 'data-panel-parent-id', parent_panel.getAttribute('id') );
    }

    if ( parent_menu_item ) {

      if ( parent_menu_item_link = parent_menu_item.querySelector(this.option('selectors.menu_item_link')) ) {

        //
        // Remember the link text that triggers this panel,
        // So we can say 'up to X menu' later
        //
        panel.setAttribute('data-parent-link-text', parent_menu_item_link.innerHTML );
        this.parentTriggerInit(parent_menu_item, panel);
      }
    }

    //
    // Initialize child triggers and sub-panel (child) if present
    //
    var menu_items = this.childMenuItemsGet(panel);

    for ( var i = 0; i < menu_items.length; i++ ) {

      //
      // Keep a rolling count of all the menu items all the way down the panels, so we can create unique IDs
      //
      this.menu_item_index ++;
      this.menuItemInit(menu_items[i]);

      child_panel = this.childPanelGet(menu_items[i]);

      if ( child_panel ) {

        depth++;        

        if ( this.depth_max_canonical === null || depth <= this.depth_max_canonical ) {
            //
            // Recursively call panelInitialize on the child panel
            //            
            var ret = this.panelInitialize( child_panel, depth, { panel_parent: panel, parent_menu_item: menu_items[i] } );
            depth--;  
          
            //
            // Initialize child triggers
            //
            this.childTriggerInit(menu_items[i], panel);
        }
        else {
          //
          // We've hit max depth
          //
          var child_trigger = menu_items[i].querySelector( this.option('selectors.panel_trigger_child') );

          menu_items[i].removeChild(child_panel);

          if ( child_trigger ) {
            child_trigger.parentNode.removeChild(child_trigger);
          }

        }
      }


    }


  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.prototype.menuItemIsActive = function( menu_item ) {
  try {
    
    var menu_link = menu_item.querySelector(this.option('selectors.menu_item_link'));
    var active_selectors = this.activeItemSelectors();

    for( var i = 0; i < active_selectors.length; i++ ) {

      if ( menu_item.matches(active_selectors[i]) ) {
        return true;
      }

      if ( menu_link != null && menu_link.matches(active_selectors[i]) ) {
        return true;
      }
    }

    return false;

  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.prototype.activeURLsGet = function() {
  try {

    var active_urls = [];

    //
    // Check for explicitly set active urls
    //
    if ( this.option('active.urls') !== null ) {

      var active_urls_explicit = this.option('active.urls');

      if ( typeof(active_urls_explicit) == 'function' && typeof(active_urls_explicit.call) == 'function' ) {
        active_urls = active_urls.concat(  active_urls_explicit.call() );
      }
      else {
        active_urls = active_urls.concat(  active_urls_explicit ); 
      }
    }
    else {
      active_urls = TraversableMenu.activeURLsDefault();
    }

    return active_urls;
       
  }
  catch( e ) {
    throw e;
  }
}

TraversableMenu.prototype.activeURLSelectors = function() {
  try {

      var selectors = [];
      var valid_urls = this.activeURLsGet();

      for ( var i = 0; i < valid_urls.length; i++ ) {
        selectors.push( '[href="' + valid_urls[i] + '"]' );
      }

      return selectors;


  }
  catch( e ) {
    throw e;
  }
}

TraversableMenu.prototype.activeItemSelectors = function() {
  try {

      var selectors = [];

      if ( this.option('active.selectors') == null ) {

        if ( this.option('active.find_by_class') ) {
          selectors.push( this.option('selectors.menu_item_active') );
          selectors.push( this.option('selectors.menu_item_link_active') );
        }

        if ( this.option('active.find_by_url') ) {
          selectors = selectors.concat( selectors, this.activeURLSelectors() );
        }

        if ( this.option('active.selectors_additional') ) {

          var link_selectors = this.option('active.selectors_additional');

          for ( var i = 0; i < link_selectors.length; i++ ) {
            selectors.push( link_selectors[i] );
          }
        }
      }
      else {
        selectors = this.option('active.selectors');
      }

      return selectors;


  }
  catch( e ) {
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

        this.triggerAttributesInit(trigger, parent_panel, 'parent');
        parent_panel.setAttribute('data-panel-triggered-as-parent-by', trigger.getAttribute('id') );

        this.parentTriggerTextApply(trigger);
        this.panelTriggerEventHandler( trigger, parent_panel );
      }
    }
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelTriggerEventHandler = function( trigger, panel_to_activate ) {
  try {

    var me = this;

    //
    // for ADA compliance, we want to check to see if someone pressed enter as opposed to clicking on the link with a mouse
    // If they're using a keyboard to navigate, focus the first menu item of the newly activated panel. Otherwise, don't
    //
    trigger.addEventListener('keyup',
      function( event ) {
        event.preventDefault();

        if ( typeof(event.which) !== 'undefined' && event.which == 13 ) {
          me.debug('Keyup triggered for panel:', panel_to_activate, 'From trigger: ', trigger);
          panel_to_activate.setAttribute('data-last-activation-event', 'keyup');
          me.panelActivate( panel_to_activate, { 'focus_first_item': true } );
        }
        return false;
      }
    );

    trigger.addEventListener('mouseup',
      function( event ) {
        event.preventDefault();
        me.debug('Mouseup triggered for panel:', panel_to_activate, 'From trigger: ', trigger);

        if ( panel_to_activate.getAttribute('data-last-activation-event') != 'touchend' ) { //panel was already activated by touch
          me.panelActivate( panel_to_activate );
        }
        panel_to_activate.setAttribute('data-last-activation-event', 'mouseup');
        return false;
      }
    );

    /* This doesn't seem necessary for now...
    trigger.addEventListener('touchend',
      function( event ) {
        event.preventDefault();
        panel_to_activate.setAttribute('data-last-activation-event', 'touchend');
        me.panelActivate( panel_to_activate );
        return false;
      }
    );
    */

    trigger.addEventListener('click',
      function( event ) {
        event.preventDefault();
        return false;
      }
    );

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
    var child_panel = menu_item.querySelector( this.option('selectors.panel') );

    //var menu_item_link_text = menu_item_link.innerHTML;

    if ( typeof(trigger) !== 'undefined' && trigger ) {

      var panel_depth = child_panel.getAttribute('data-panel-depth');
      var panel_index = child_panel.getAttribute('data-panel-index');
     

      this.triggerAttributesInit(trigger, child_panel, 'child');

      child_panel.setAttribute('data-panel-triggered-as-child-by', trigger.getAttribute('id') );

      this.panelTitleInit( child_panel, menu_item )
      this.panelTriggerEventHandler( trigger, child_panel );

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
            this.triggerAttributesInit(top_trigger, topmost_panel, 'top');
            this.panelTriggerEventHandler( top_trigger, topmost_panel );
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

TraversableMenu.prototype.triggerAttributesInit = function( trigger, panel, trigger_type ) {

  try {

    var panel_depth = panel.getAttribute('data-panel-depth');
    var panel_index = panel.getAttribute('data-panel-index');

    trigger.setAttribute('id', this.elementIDPrefix() + '_trigger_' + trigger_type + '_' + panel_depth.toString() + '_' + panel_index.toString() );
    trigger.setAttribute('aria-haspopup', true);
    trigger.setAttribute('aria-expanded', false);
    trigger.setAttribute('aria-controls', this.panelID(panel));
    trigger.setAttribute('data-panel-trigger-for', this.panelID(panel) );
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.panelTitleTextSet = function( panel, title ) {

  try {

    var title_element       = panel.querySelector( this.option('selectors.panel_title') );
    var title_link          = null;

    if ( title_element ) {

      if ( title_link = title_element.querySelector(this.option('classes.panel_title_link')) ) {
        title_element = title_link;
      }

      title_element.innerHTML = TraversableMenu.tokenReplace( this.option('panel_title_text'), 'menu-title', title );
    }


  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.prototype.panelTitleInit = function( panel, menu_item_element ) {

  try {

    var menu_item_link      = menu_item_element.querySelector( this.option('selectors.menu_item_link') );
    var menu_item_link_text = menu_item_link.innerHTML;
    var title_element       = panel.querySelector( this.option('selectors.panel_title') );
    var title_href          = menu_item_link.getAttribute('href');
    var title_html          = '';

    //
    // @TODO - this should have additional options and should probably use document.createElement
    //
    if ( this.option('panel_title_link_enabled') ) {
      title_html = '<a class="' + this.option('classes.panel_title_link') + '" href="' + title_href + '">';
    }

    if ( title_element ) {
      title_html += TraversableMenu.tokenReplace( this.option('panel_title_text'), 'menu-title', menu_item_link_text );
    }

    if ( this.option('panel_title_link_enabled') ) {
      title_html += '</a>';
    }

    if ( title_element ) {
      title_element.innerHTML = title_html;
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

TraversableMenu.prototype.childPanelsGet = function( container ) {
  try {

    return ( container ) ? container.querySelectorAll( this.option('selectors.panel') ) : null;

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

    if ( container ) {
      return container.querySelector( selector );
    }

    return null;
    
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
TraversableMenu.prototype.activeMenuItemFind = function() {

  try {

    var matching_items = [];
    var matching_element;
    var final_match;
    var active_selectors = this.activeItemSelectors();

    for( var i = 0; i < active_selectors.length; i++ ) {
      matching_items =this.elementFindAll(active_selectors[i]);

      if ( matching_items.length > 0 ) {
        matching_element = matching_items[matching_items.length - 1]; //Take the deepest match if we found multiple

        if ( matching_element ) {

          if ( !matching_element.matches(this.option('selectors.menu_item')) ) {
            //
            // We want to find the menu item, not the link or something else
            //
            var parent_count = this.option('active.parents_search_max');
            var this_node = matching_element.parentNode;

            while ( parent_count > 0 ) {
              if ( this_node.matches(this.option('selectors.menu_item')) ) {
                final_match = this_node;
                break;
              }
              this_node = this_node.parentNode;
              parent_count--;
            }
          }  
          else {
            final_match = matching_element;
          }

          if ( final_match ) {
            break;      
          }
        }
      }
    }

    return final_match;

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

    var active_panel;
    var child_panel;
    var element;
    var menu_link;

    this.menu_item_active = this.activeMenuItemFind();
    
    if ( this.menu_item_active ) {

      this.menu_item_active.classList.add( TraversableMenu.classNameFromSelector(this.option('selectors.menu_item_active')) );
      this.menu_item_active.classList.add( TraversableMenu.classNameFromSelector(this.option('selectors.menu_item_active_trail')) );

      if ( menu_link = this.menu_item_active.querySelector(this.option('selectors.menu_item_link')) ) {
        menu_link.classList.add( this.option('classes.menu_item_link_active') );
      }

      active_panel = this.panelByChildElement(this.menu_item_active);

      if ( active_panel ) {
        if ( this.option('auto_traverse_skip_levels') > 0 && !isNaN(this.option('auto_traverse_skip_levels')) ) {
          var levels_remaining = this.option('auto_traverse_skip_levels');

          while( levels_remaining > 0 ) {
            if ( child_panel = this.childPanelGet(this.menu_item_active) ) {
              active_panel = child_panel;
            }
            levels_remaining--;
          }
        }

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
    this.debug('panelsResetActive called');

    options = options || {};

    var active_panels = this.elementFindAll( TraversableMenu.selectorFromClassName(this.option('classes.panel_active')) ); //this.panelsGetAll();

    for ( var i = 0; i < active_panels.length; i++ ) {
      this.panelActiveAttributesRemove( active_panels[i] );
    }

    this.panel_active = null;
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


/**
 * Get the trigger from the *parent* panel that shows a given panel
 * In other words, this will be the trigger that a user clicks in a panel to traverse down to the given panel
 * @param {DomElement} panel
 * @return {DomElement} trigger or null if none found
 */
TraversableMenu.prototype.panelGetTriggerParent = function( panel ) {
  try {

    var trigger_id;

    if ( trigger_id = panel.getAttribute('data-panel-triggered-as-parent-by') ) {
      return this.elementFind( '#' + trigger_id);
    }

    return null;
  }
  catch (e) {
    throw e;
  }
}


/**
 * Get the trigger from the *child* panel that shows a given panel
 * In other words, this will be the trigger that a user clicks in a panel to return up to the given panel
 * @param {DomElement} panel
 * @return {DomElement} trigger or null if none found
 */
TraversableMenu.prototype.panelGetTriggerChild = function( panel ) {
  try {
    var trigger_id;

    if ( trigger_id = panel.getAttribute('data-panel-triggered-as-child-by') ) {
      return this.elementFind( '#' + trigger_id);
    }

    return null;
  }
  catch (e) {
    throw e;
  }
}

TraversableMenu.prototype.panelSetActive = function( panel ) {

  this.panel_active = panel;
  
}

TraversableMenu.prototype.panelGetActive = function() {

  return this.panel_active;
  //return this.elementFind( this.option('selectors.panel') + '.' + this.option('classes.panel_active') );

}

TraversableMenu.prototype.panelIsActive = function( panel ) {
  return ( panel == this.panel_active ) ? true : false;
}

TraversableMenu.prototype.panelActivate = function( panel, options ) {

  options = options || {};

  var me = this;
  var show_immediate =  ( typeof(options.show_immediate) !== 'undefined' && options.show_immediate ) ? true : false;
  var focus_timeout = ( show_immediate ) ? 0 : this.option('panel_slide_animation_duration');
  var focus_enabled = ( typeof(options.focus_first_item) !== 'undefined' && options.focus_first_item ) ? true : false;
  var panel_container;

  this.debug('Panel activate called', panel);

  if ( !this.panelIsActive(panel) ) {

    //
    // Show this panel
    //
    if ( show_immediate ) {
        this.debug('showing immediately');
        var panels = this.panelsGetAll();
        for( var j = 0; j < panels.length; j++ ) {
          panels[j].classList.add( this.option('classes.panel_show_immediate') );
        }
    }

    this.panelsResetActive();
    this.panelSetActive(panel);
    this.panelActiveAttributesApply( panel );
    this.activeTrailRecalculate();

    if ( this.option('panel_height_auto') ) {
      this.panelActiveHeightApply();
    }

    if ( this.option('panel_auto_scroll_to_top') ) {
      if ( panel_container = this.panelsGetContainer() ) {
        panel_container.scrollTop = 0;
      }

      panel.scrollTop = 0;
    }

    if ( focus_enabled ) {
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
    }

    if ( show_immediate ) {
      var immediate_panels = me.elementFindAll ( TraversableMenu.selectorFromClassName(me.option('classes.panel_show_immediate')) );
      var i;

      for( i = 0; i < immediate_panels.length; i++ ) {
        immediate_panels[i].classList.remove( me.option('classes.panel_show_immediate') );
      }
    }

  }

}

TraversableMenu.prototype.panelsHeightStore = function() {

  var panels = this.panelsGetAll();
  var height = 0;

  if (panels !== null) {

    for ( var i = 0; i < panels.length; i++ ) {
      height = TraversableMenu.heightCalculateBasedOnImmediateChildren(panels[i]);
      panels[i].setAttribute('data-panel-height', height);
    }

  }

}

TraversableMenu.prototype.panelApplyCalculatedHeight = function( panel, options ) {

  var height;

  options = options || {};

  if ( (typeof(options.ignore_stored) == 'undefined' || options.ignore_stored == false) && panel.hasAttribute('data-panel-height') ) {
     height = panel.getAttribute('data-panel-height');
  }
  else {
    height = TraversableMenu.heightCalculateBasedOnImmediateChildren(panel);
  }

  //panel.setAttribute('data-panel-height', height);

  if ( height !== null ) {
    panel.style.height = height + 'px';
  }

  return height;

}

TraversableMenu.prototype.panelsContainerResize = function() {

  var container = this.panelsGetContainer();
  var active_panel = this.panelGetActive();
  var height = null;

  if ( container && active_panel ) {

    height = TraversableMenu.heightCalculateBasedOnImmediateChildren(active_panel);

    if ( height !== null ) {
      container.style.height = height.toString() + 'px';
    }

    container.classList.add( this.option('classes.panels_container_height_auto_applied') );
  }

  return height;

}

TraversableMenu.prototype.panelActiveHeightApply = function ( ) {

  var active_panel = this.panelGetActive();
  var parent_panel;

  if ( active_panel ) {
    var new_height = this.panelApplyCalculatedHeight(active_panel);
    var parent_panel = this.panelGetParent(active_panel);

    while ( parent_panel ) {
       parent_panel.style.height = new_height.toString() + 'px';
       parent_panel.classList.add( this.option('classes.panel_height_auto_applied') );
       parent_panel = this.panelGetParent(parent_panel);
    }

    if ( this.option('panels_container_height_auto') ) {
      this.panelsContainerResize();      
    }

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
    panel.setAttribute('data-panel-active', true);
    panel.scrollTop = 0;

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
    panel.setAttribute('data-panel-active', false);

    this.tabbablesToggle( panel, false );


  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.activeTrailPanelRemember = function( panel ) {
  try {

    this.panels_active_trail[ panel.getAttribute('id') ] = panel;    
    
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.activeTrailPanelForget = function( panel ) {
  try {

    if ( typeof(this.panels_active_trail[panel.getAttribute('id')]) != 'undefined' ) {
      delete this.panels_active_trail[panel.getAttribute('id')];
    }
    
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.activeTrailPanelsGet = function() {
  try {

    return this.panels_active_trail;
    
  }
  catch(e) {
    throw e;
  }

}

TraversableMenu.prototype.activeTrailRecalculate = function() {
  try {

    var active_panel = this.panelGetActive();
    var active_trail_panels = this.activeTrailPanelsGet();

    if ( active_trail_panels ) {
      for ( var panel_id in active_trail_panels ) {
        this.panelActiveTrailUnset(active_trail_panels[panel_id]);        
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
      var trigger;

      panel.classList.remove( this.option('classes.panel_active_trail') );
      panel.classList.remove( this.option('classes.panel_child_open') );

      if ( trigger = this.panelGetTriggerParent(panel) ) {
        trigger.setAttribute('aria-expanded', false);
      }

      if ( trigger = this.panelGetTriggerChild(panel) ) {
        trigger.setAttribute('aria-expanded', false);
      }

      this.activeTrailPanelForget(panel);

      // if ( child_panel = this.childPanelGet(panel) ) {
      //   this.panelActiveTrailUnset(child_panel);
      // }


  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.prototype.panelActiveTrailApply = function( panel ) {
  try {

    var panel_parent;
    var trigger;

    this.debug('Applying active trail', panel);
    panel.classList.add( this.option('classes.panel_active_trail') );

    if ( trigger = this.panelGetTriggerChild(panel) ) {
      trigger.setAttribute('aria-expanded', true);
    }

    this.activeTrailPanelRemember(panel);

    if ( panel_parent = this.panelGetParent(panel) ) {
      if ( !this.panelActiveTrailApplied(panel_parent) ) {
        panel_parent.classList.add( this.option('classes.panel_child_open') );
        panel_parent.scrollTop = 0;
        this.panelActiveTrailApply(panel_parent);
      }
    }

  }
  catch( e ) {
    throw e;
  }
}

TraversableMenu.prototype.panelActiveTrailApplied = function( panel ) {
  try {

    return panel.matches('.' + this.option('classes.panel_active_trail') );    

  }
  catch( e ) {
    throw e;
  }
}


TraversableMenu.selectorFromClassName = function( class_name ) {
  return '.' + class_name.toString();
}

/**
 * Provides the ability to operate *ONLY* on a specific panel, without traversing into subpanels
 * useful for when you want to operate on a single panel but not its subpanels
 */
TraversableMenu.prototype.onlyThisPanel = function( panel, callback, depth ) {

  var children = panel.children;
  var child;

  depth = depth || 0;

  for ( var i = 0; i < children.length; i++ ) {

    child = children[i];

    if ( !child.matches( this.option('selectors.panel')) ) {

      callback.call( this, child );
      depth++;
      this.onlyThisPanel(child, callback, depth);
      depth--;
    }
  }

  if ( depth == 0 ) {
    callback.call( this, panel );
  }
}

// TraversableMenu.prototype.onlyThisElement = function( element, callback, depth ) {
//
//   var children = panel.children;
//   var child;
//
//   depth = depth || 0;
//
//   for ( var i = 0; i < children.length; i++ ) {
//
//     child = children[i];
//
//     if ( !child.matches( this.option('selectors.panel')) ) {
//
//       callback.call( this, child );
//       depth++;
//       this.onlyThisPanel(child, callback, depth);
//       depth--;
//     }
//   }
//
//   if ( depth == 0 ) {
//     callback.call( this, panel );
//   }
//
// }

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

    if ( typeof(options.exclude_self) == 'undefined' || !options.exclude_self ) {
      which_element.setAttribute('tabindex', tabindex);
    }

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

TraversableMenu.prototype.debug = function() {

  if ( this.option('debug') ) {
    if ( arguments.length > 0 ) {
      for ( var i = 0; i < arguments.length; i++ ) {
        console.log( arguments[i] );
      }
    }
  }

}

TraversableMenu.activeURLsDefault = function() {
  try {

      var active_urls = [];
      var href_split = window.location.href.split('#');
      var pathname_with_query_string = window.location.href;
      
      pathname_with_query_string = pathname_with_query_string.replace(/^[A-Za-z0-9]+:\/\//, '');
      pathname_with_query_string = pathname_with_query_string.substr( pathname_with_query_string.indexOf('/') );

      //
      // Make sure these are in order of most to least favorable/specific;
      // Matching is done on a first-match basis
      //
      active_urls = [
        pathname_with_query_string,
        window.location.pathname,
        window.location.href
      ];

      //
      // Additional possible permutations of URL
      //      
      if ( href_split.length > 1 ) {
        active_urls.push( href_split[0] ); //URL without fragment

        href_split = href_split[0].split('?');
        if ( href_split.length > 1 ) {
          active_urls.push( href_split[0] ); //URL without fragment or query string
        }
      }

      href_split = window.location.href.split('?');
      if ( href_split.length > 1 ) {
        active_urls.push( href_split[0] ); //URL without query string
      }

      return active_urls; 

  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.tokenReplace = function( given_string, token, val ) {
  return given_string.replace( '[:' + token.toString() + ':]', val);
}


TraversableMenu.classNameFromSelector = function( selector ) {
  
  var split = selector.split('.');
  var final = split[split.length-1];
  
  return final.toString().replace(/^\./, '');
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
    var child_items_only = [];

    if ( first_item ) {
      var first_item_parent = first_item.parentNode;
      var first_parent_id;
      var random_id;
      var selector;
      var descendant_selector;
      var container_context = ( container.parentNode ) ? container.parentNode : document;

      if ( !(first_parent_id = first_item_parent.getAttribute('id')) ) {
        random_id = 'elem_id_' + (Math.floor(Math.random()*90000) + 10000).toString();
        first_item_parent.setAttribute('id', random_id);
      }

      //
      // Currently can't do direct child selectors like '>.sub-item'; prepending the element ID is a workaround.
      //
      descendant_selector = '#' + first_item_parent.getAttribute('id') + '>' + selector;

      child_items_only = container_context.querySelectorAll(descendant_selector);

      if ( random_id ) {
        first_item_parent.removeAttribute('id');
      }

    }

    return child_items_only;

  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.immediateChildren = function( container ) {
  try {

    var container_context = ( container.parentNode ) ? container.parentNode : document;
    var random_id;
    var selector;
    var children = [];

    if ( !container.getAttribute('id') ) {
      random_id = 'elem_id_' + (Math.floor(Math.random()*90000) + 10000).toString();
      container.setAttribute('id', random_id);
    }

    //
    // Currently can't do direct child selectors like '>.sub-item'; prepending the element ID is a workaround.
    //
    selector = '#' + container.getAttribute('id') + '>*';

    children = container_context.querySelectorAll( selector );

    if ( random_id ) {
      container.removeAttribute('id');
    }

    return children;

  }
  catch(e) {
    throw e;
  }
}

TraversableMenu.heightCalculateBasedOnImmediateChildren = function( element, options ) {

  var height = null;

  if ( element ) {

    var children = TraversableMenu.immediateChildren(element);
    var child_style;

    for( var i = 0; i < children.length; i++ ) {

      child_style = window.getComputedStyle(children[i]);

      height += parseInt(children[i].scrollHeight); 

      if ( child_style ) {
        height += ( child_style.marginTop != '' ) ? parseInt(child_style.marginTop) : 0; //scrollHeight doesn't include margins
        height += ( child_style.marginBottom != '' ) ? parseInt(child_style.marginBottom) : 0; 
        height += ( child_style.borderTopWidth != '' ) ? parseInt(child_style.borderTopWidth) : 0; //scrollHeight doesn't include borders
        height += ( child_style.borderBottomWidth != '' ) ? parseInt(child_style.borderBottomWidth) : 0;
      }
    }

  }


  return height;

}

TraversableMenu.options_default = function() {
  var options = {
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
      'parent_text': 'Up to [:previous-title:] menu',
      'top_text': 'Up to Main Menu',
      'top_depth': 2, //the depth at which to start showing 'up to main menu' link
      'top_remove_auto': true, //whether to automatically remove 'up to main menu' link if the depth < triggers.top_depth
      'top_text_use_top_panel_title_at_first_level': false //if panel_title_first is set, use that as our "top_text" at the first level below the topmost panel
    },
    accessibility: {
      'container_role': 'menubar',
      'panel_role': 'menu',
      'menu_item_role': 'menuitem',
      'menu_item_link_focus_first': true //set focus to first menu item link when panel is shown using keyboard
    },
    callbacks: {
      panel: {
        activate: {
          before: null,
          after: null
        },
        initialize: {
          before: null,
          after: null
        }
      },
      panels: {
        initialize: {
          before: null,
          after: null
        }
      }
    },
    'render': {
      'panels_container': null,
      'depth_max': null,
      'depth_max_relative': null
    },
    'active': {
      'find_by_url': true,
      'find_by_class': true,
      'urls': null,
      'selectors': null,
      'selectors_additional': [],
      'parents_search_max': 10 //max attempts to find parent menu item element when finding active link.
                               //Should be high enough to go from a panel title to its parent menu item above
    },
    'debug': false,
    'panel_auto_scroll_to_top': true,
    'panel_height_auto': true,
    'panels_container_height_auto': true, //whether to automatically set the panel container height
    'panel_slide_animation_duration': 350, //in ms
    'panel_title_first': '', //the title of the first panel
    'panel_title_text': '[:menu-title:]', //title of subsequent panels. [:menu-title:] will be replaced by the text of the link that expands to show the menu
    'panel_title_link_enabled': true,
    'auto_traverse_to_active': true,
    'auto_traverse_skip_levels': 0,
    'auto_traverse_link_selectors_active': [],
    'siblings_at_lowest_level': false,
    'errors': {
      'silent_if_no_container': true
    }
  };

  options.classes =  {
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
    'menu_item_link': TraversableMenu.classNameFromSelector( options.selectors.menu_item_link ),
    'menu_item_link_active': TraversableMenu.classNameFromSelector( options.selectors.menu_item_link_active ),
  };

  return options;

}


//
// A quick polyfill to support Element.matches in older browsers
// See: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
//
if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

if ( typeof module !== 'undefined' && module.exports ) {
  module.exports = TraversableMenu;
}
