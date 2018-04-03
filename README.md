[traversable_menu_screenshot]: https://jimkeller.github.io/traversable_menu/traversable_menu.gif

# Sliding Navigation Menu
A sliding multi-level navigation drawer menu written using vanilla javascript

![Traversable menu example][traversable_menu_screenshot]

Version 1.0.0  
Copyright (c) 2017 Jim Keller, Eastern Standard  
https://www.easternstandard.com

## Key Features
* Fully ADA / WCAG 2.0 / Section 508 compliant - supports keyboard navigation, tabbing, and aria labels
* Extremely customizable - see the options list below
* No dependencies (not even jQuery) - runs in plain javascript
* ES6 compatible
* Useful for both simple or extremely deep menus

## How to use

(npm package possibly coming soon...help welcome!)

1. Add [traversable_menu.css](https://raw.githubusercontent.com/jimkeller/traversable_menu/master/traversable_menu.css) and [traversable_menu.js](https://raw.githubusercontent.com/jimkeller/traversable_menu/master/traversable_menu.js) to your project
2. Add the markup for your menu:
```
<div class="traversable-menu">
  <div class="menu__panel">
    <div class="menu__panel__title"><!-- automatically replaced with javascript --></div>
    <ul>
      <li class="menu__item">
        <a href="#" class="menu__item__link">About Us</a>
      </li>
      <li class="menu__item">
        <a href="#" class="menu__item__link">Academics</a>
        <a href="#" class="menu__panel__trigger--child">Explore ></a>
        <div class="menu__panel">
          <div class="menu__panel__title"></div>
          <a href="#" class="menu__panel__trigger--top"></a>
          <a href="#" class="menu__panel__trigger--parent">Up a level (this gets replaced in JS)</a>
          <ul>
            <li class="menu__item">
              <a href="#" class="menu__item__link">Sub item to Academics</a>                
            </li>
          </ul>
        </div>
      </li>
      <li class="menu__item"><a href="#" class="menu__item__link">Another item with no children</a></li>
    </ul>
  </div>
</div>
```
3. Initialize traversable menu using basic options:

```
<script>
document.addEventListener("DOMContentLoaded", function() {
  var traversable = new TraversableMenu(
    {
      'panel_title_first': 'Traversable Menu Example'
        // many additional options here; see below 
    }
  );
});
</script>
```

4. You're done

## Options

Please note that options are nested the same way they are below, like so:
```
selectors: {
  //selector options here
},
classes: {
  //classes options here
},
triggers: {
  //trigger options here
}

...etc
```

### selectors

#### panel

selector for an individual menu panel - usually one level of the menu  
default: .menu__panel

#### panel_trigger_child

selector for the trigger element that goes one level deeper  
default: .menu__panel__trigger--child

#### panel_trigger_parent

selector for the trigger element that moves one level up  
default: .menu__panel__trigger--parent

#### panel_trigger_top

selector for the trigger element that goes back to the top  
default: .menu__panel__trigger--top

#### panel_title

selector for the title for a panel  
default: .menu__panel__title

#### panels_container

selector for container that holds multiple panels. This should be your top-level selector.  
default: .traversable-menu

#### menu_item_active

selector for the currently active link, i.e. the page the user is on  
default: .menu__item--active

#### menu_item_active_trail

selector for whether the current link is part of the active menu trail  
default: .menu__item--active-trail

#### menu_item

selector for an individual menu item (almost always an li tag)  
default: .menu__item

#### menu_item_link

selector for the actual menu item link (almost always an a tag)  
default: .menu__item__link

#### tabbable_elements

Tabbing will be disabled on elements matching this selector when the menu panel is closed  
default: a

### Additional options:

```
    classes: {
      'panels_initialized': 'traversable-menu--initialized', //class to set on top-level container after menu is initialized
      'panel_active': 'menu__panel--active', //class that gets set on a panel when it is actively displayed
      'panel_active_trail': 'menu__panel--active-trail', //class that gets set on any panel that's in the active trail
      'panel_active_parent': 'menu__panel--active-parent', //currently unused
      'panel_child_open': 'menu__panel--child-open', //class that is set on any panel that is a parent of the current panel
      'panel_show_immediate': '-show-immediate', //class to set when a panel should be shown immediately, rather than animating in
      'panel_depth': 'menu__panel--depth-[:n:]' //class to set on each panel that tells you the depth. [:n:] is replaced with the depth of the panel

    },
    triggers: {
      'parent_text': 'Up to [:previous-title:] menu', //text to be set on the panel_trigger_parent. [:previous-title:] is automatically replaced with the parent menu's title
      'top_text': 'Up to Main Menu', //text to be set on panel_trigger_top
      'top_depth': 2, //the depth at which to start showing 'up to main menu' link
      'top_remove_auto': true, //whether to automatically remove 'up to main menu' link if the depth < triggers.top_depth
      'top_text_use_top_panel_title_at_first_level': false //if panel_title_first is set, use that as our "top_text" at the first level below the topmost panel
    },
    accessibility: {
      'container_role': 'menubar', //the role attribute to set on the panel container
      'panel_role': 'menu', //the role attribute to set on an individual panel
      'menu_item_role': 'menuitem', //the role attribute to set on a menu item
      'menu_item_link_focus_first': true //set focus to first menu item link when panel is shown using keyboard
    },
    callbacks: {
      panels: {
        initialize: {
          before: null, //called before the panels are initialized. Passes the TraversableMenu object to the function as a parameter
          after: null //called after the panels are initialized. Passes the TraversableMenu object to the function as a parameter
        }
      }
    },
    'debug': false, //set to true to see debug messages
    'panel_auto_scroll_to_top': true, //whether to automatically scroll to the top of the panel (so that the user doesn't land in the middle of a child panel)
    'panel_height_auto': true, //whether to automatically determine the height of each individual panel
    'panels_container_height_auto': true, //whether to automatically set the panel container height
    'panel_slide_animation_duration': 350, //in ms
    'panel_title_first': '', //the title of the first panel
    'panel_title_text': '[:menu-title:]', //title of subsequent panels. [:menu-title:] will be replaced by the text of the link that expands to show the menu
    'auto_traverse_to_active': true, //whether to automatically traverse to the menu item identified by the menu_item_active selector above
    'auto_traverse_skip_levels': 0, //by default, auto traverse shows siblings of the current page. Increase this number to have it automatically traverse deeper
    'siblings_at_lowest_level': false, //currently unused
    'errors': {
      'silent_if_no_container': true //hide errors if no panel container is found
    }
  };





