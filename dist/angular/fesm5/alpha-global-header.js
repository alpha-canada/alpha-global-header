import { Component, Input, ViewEncapsulation, ElementRef, HostListener, NgModule } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
 */
// reference to document element classes
/** @type {?} */
var htmlClasses = document.documentElement.classList;
/** @type {?} */
var ITEM_SIZE = 84;
/** @type {?} */
var ITEM_MAX_PADDING = 50;
/** @type {?} */
var ITEM_MIN_PADDING = 15;
/** @type {?} */
var ITEM_FONT_SIZE = 18;
/** @type {?} */
var MENU_RESERVED_WIDTH = 84;
// the logo is only required space
/**
 * This class is used in polymer and angular to construct and manage the menu
 */
var 
// the logo is only required space
/**
 * This class is used in polymer and angular to construct and manage the menu
 */
AlphaHeader = /** @class */ (function () {
    function AlphaHeader(element, options) {
        var _this = this;
        this.element = element;
        this.defaults = {
            minItemSize: 10,
            fontSize: "10px",
            reservedWidth: 50,
            itemPadding: 10,
            // * x 2,
            toolBarItemSelector: '[toolbar-item]',
            closeSubMenusOnClick: false,
            languages: []
        };
        this.isCollapsed = false;
        this.isMinified = false;
        this.state = '';
        this.menuContainer = this.element.querySelector('[menu-container]');
        this.options = merge(options || {}, this.defaults);
        this.attachToolbarElements();
        if (this.options.languages.length) {
            this.menuContainer.appendChild(this.createLanguageMenu('no-cursor'));
        }
        // create sub menu toggles
        this.attachSubMenuToggles();
        // create toolbar menu after sub-menu toggle
        if (this.options.languages.length) {
            this.toolBar.insertBefore(this.createLanguageMenu('sub-menu-toggle'), this.toolBar.firstChild);
        }
        if (this.options.search) {
            this.createSearchArea();
        }
        requestAnimationFrame(function () {
            _this.check();
            _this.element.classList.add('ready');
        });
        this._boundResizeFunction = this.check.bind(this);
        this._boundClickFunction = this.onClick.bind(this);
        this._boundWindowClickFunction = this.onWindowClick.bind(this);
        window.addEventListener('resize', this._boundResizeFunction);
        this.element.addEventListener('click', this._boundClickFunction);
        window.addEventListener('click', this._boundWindowClickFunction);
    }
    /**
     * Listen to clicks on the window to close open nav menus
     */
    /**
     * Listen to clicks on the window to close open nav menus
     * @param {?} event
     * @return {?}
     */
    AlphaHeader.prototype.onWindowClick = /**
     * Listen to clicks on the window to close open nav menus
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // if the click came from the menu, dont do anything
        if (event.isMenuClick) {
            return;
        }
        this.closeSubMenus();
    };
    /**
     * Handle clicks on different elements
     */
    /**
     * Handle clicks on different elements
     * @param {?} event
     * @return {?}
     */
    AlphaHeader.prototype.onClick = /**
     * Handle clicks on different elements
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.isMenuClick = true;
        if (this.options.closeSubMenusOnClick && !document.documentElement.classList.contains('nav-open')) {
            // close sub-menus if the click came from there
            /** @type {?} */
            var menuContainer = event.composedPath().filter(function (el) { return el.classList && el.classList.contains('sub-menu'); });
            if (menuContainer.length) {
                /** @type {?} */
                var parentEl = menuContainer[0].parentElement;
                if (parentEl.classList.contains('open')) {
                    parentEl.classList.remove('open');
                }
                else {
                    this.spoofCloseSubMenu(parentEl);
                }
                return;
            }
        }
        /**
         * Sub menu toggle clicks
         */
        if (event.target.classList.contains('sub-menu-toggle')) {
            /** @type {?} */
            var menutarget = void 0;
            if (event.target.classList.contains('menu-item-has-children')) {
                menutarget = event.target;
            }
            else {
                menutarget = event.target.parentNode;
            }
            /** @type {?} */
            var isOpen = menutarget.classList.contains('open');
            this.closeSubMenus();
            if (isOpen) {
                menutarget.classList.remove('open');
            }
            else {
                menutarget.classList.add('open');
            }
        }
        else if (event.target.classList.contains('search-form-close')) {
            this.closeSearch();
        }
        else if (event.target.classList.contains('search-icon')) {
            this.openSearch();
        }
        else if (event.target.classList.contains('menu-toggle')) {
            this.open();
        }
        else if (event.target.id === 'closeButton') {
            this.close();
        }
    };
    /**
     * In angular situations, the page doesn't navigate, so a hovered sub-menu will remain open after a click
     * This will
     */
    /**
     * In angular situations, the page doesn't navigate, so a hovered sub-menu will remain open after a click
     * This will
     * @param {?} element
     * @return {?}
     */
    AlphaHeader.prototype.spoofCloseSubMenu = /**
     * In angular situations, the page doesn't navigate, so a hovered sub-menu will remain open after a click
     * This will
     * @param {?} element
     * @return {?}
     */
    function (element) {
        element.style.height = ITEM_SIZE + 'px';
        element.style.pointerEvents = 'none';
        setTimeout(function () {
            element.style.height = '';
            element.style.pointerEvents = '';
        }, 100);
    };
    /**
     * Go through each direct children of the ul menu container, measure the required text for each element plus some padding
     */
    /**
     * Go through each direct children of the ul menu container, measure the required text for each element plus some padding
     * @param {?} options
     * @return {?}
     */
    AlphaHeader.prototype.getCollapsedMenuWidth = /**
     * Go through each direct children of the ul menu container, measure the required text for each element plus some padding
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var minWidth = 0;
        /** @type {?} */
        var options = options || {};
        /** @type {?} */
        var font = options.font || "10px Arial";
        /** @type {?} */
        var letterSpacing = options.letterSpacing || 0;
        /** @type {?} */
        var itemPadding = options.itemPadding || 0;
        /** @type {?} */
        var minItemWidth = options.minItemWidth || 0;
        /** @type {?} */
        var wordSpacing = options.wordSpacing || 0;
        /** @type {?} */
        var excludeIcons = options.excludeIcons || false;
        /** @type {?} */
        var i = 0;
        for (i; i < this.menuContainer.children.length; i++) {
            /** @type {?} */
            var liEl = this.menuContainer.children[i];
            /** @type {?} */
            var link = liEl.firstElementChild || liEl;
            /** @type {?} */
            var text = link.textContent;
            /** @type {?} */
            var needed;
            if (text) {
                needed = this.measureWidth(text, font, { letterSpacing: letterSpacing, wordSpacing: wordSpacing }) + itemPadding;
            }
            else if (!excludeIcons) {
                needed = minItemWidth;
            }
            else {
                continue;
            }
            //console.info(link.textContent, needed);
            // ensure min item width
            minWidth += needed < minItemWidth ? minItemWidth : needed;
        }
        return minWidth;
    };
    /**
     * Move toolbar elements into the toolbar from the menu
     *
     */
    /**
     * Move toolbar elements into the toolbar from the menu
     *
     * @return {?}
     */
    AlphaHeader.prototype.attachToolbarElements = /**
     * Move toolbar elements into the toolbar from the menu
     *
     * @return {?}
     */
    function () {
        // create the toolbar container
        this.toolBar = document.createElement('div');
        this.toolBar.classList.add('menu-toolbar');
        // add a search icon
        if (this.options.search) {
            /** @type {?} */
            var searchIcon = this.createSearchIcon();
            this.toolBar.appendChild(searchIcon);
        }
        // add the menu icon
        /** @type {?} */
        var menuToggle = document.createElement('a');
        menuToggle.classList.add('menu-toggle');
        menuToggle.innerHTML = '<i></i>';
        this.toolBar.appendChild(menuToggle);
        // add the close button
        /** @type {?} */
        var closeButton = document.createElement('span');
        closeButton.id = 'closeButton';
        closeButton.classList.add('agh-icon-close-thin');
        this.element.appendChild(closeButton);
        // append the toolbar
        this.element.appendChild(this.toolBar);
        // find dynamic toolbar items from the user markup
        /** @type {?} */
        var items = this.menuContainer.querySelectorAll(this.options.toolBarItemSelector);
        /** @type {?} */
        var i = 0;
        /** @type {?} */
        var len = items.length;
        for (i; i < len; i++) {
            /** @type {?} */
            var item = items[i];
            this.toolBar.insertBefore(item, this.toolBar.firstChild);
        }
    };
    /**
     * Create the language menu
     */
    /**
     * Create the language menu
     * @param {?=} extraClass
     * @return {?}
     */
    AlphaHeader.prototype.createLanguageMenu = /**
     * Create the language menu
     * @param {?=} extraClass
     * @return {?}
     */
    function (extraClass) {
        if (extraClass === void 0) { extraClass = ''; }
        if (this.options.languages.length === 0) {
            return null;
        }
        /** @type {?} */
        var languageElement = document.createElement('div');
        languageElement.classList.add('menu-item-has-children');
        languageElement.setAttribute('menu-icon', 'w');
        languageElement.setAttribute('menu-title', 'Languages');
        if (extraClass) {
            languageElement.classList.add(extraClass);
        }
        /** @type {?} */
        var subMenu = '<ul class="sub-menu">';
        /** @type {?} */
        var i = 0;
        /** @type {?} */
        var len = this.options.languages.length;
        for (i; i < len; i++) {
            /** @type {?} */
            var language = this.options.languages[i];
            /** @type {?} */
            var href = 'javascript:void(0)';
            /** @type {?} */
            var attr = '';
            if (language.code) {
                attr = 'data-lang="' + language.code + '"';
            }
            else if (language.href) {
                href = language.href;
            }
            subMenu += '<li><a ' + attr + ' href="' + href + '">' + language.label + '</a></li>';
        }
        subMenu += '</ul>';
        languageElement.innerHTML = subMenu;
        languageElement.addEventListener('click', function (event) {
            /** @type {?} */
            var code = null;
            if (null !== (code = ((/** @type {?} */ (event.target))).getAttribute('data-lang'))) {
                /** @type {?} */
                var url = new URL(document.location.href);
                url.searchParams.delete('lang');
                url.searchParams.append('lang', code);
                document.location.href = url.href;
            }
        });
        return languageElement;
    };
    /**
     * Create an icon to open the search
     */
    /**
     * Create an icon to open the search
     * @return {?}
     */
    AlphaHeader.prototype.createSearchIcon = /**
     * Create an icon to open the search
     * @return {?}
     */
    function () {
        /** @type {?} */
        var searchIcon = document.createElement('div');
        searchIcon.classList.add('search-icon');
        searchIcon.setAttribute('menu-icon', 'g');
        return searchIcon;
    };
    /**
     * Create the search area
     */
    /**
     * Create the search area
     * @return {?}
     */
    AlphaHeader.prototype.createSearchArea = /**
     * Create the search area
     * @return {?}
     */
    function () {
        // create the search form
        this.searchArea = document.createElement('div');
        this.searchArea.classList.add('menu-search-area');
        // form action
        /** @type {?} */
        var searchAction = this.options.search.action || "";
        // create a URL from the search action
        /** @type {?} */
        var searchUrl = new URL(searchAction, document.location.origin);
        // get the form target
        /** @type {?} */
        var formTarget = searchUrl.hostname !== document.location.hostname ? '_blank' : '_self';
        // the form markup
        this.searchArea.innerHTML =
            "<form target=\"" + formTarget + "\" class=\"menu-search\" action=\"" + searchAction + "\">\n\t\t\t\t<div class=\"menu-search-input-wrapper\">\n\t\t\t\t\t<input class=\"menu-search-input\" type=\"text\" name=\"s\" value=\"\" placeholder=\"Search\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"search-form-close agh-icon-close-thin\"></div>\n\t\t\t</form>";
        // create the toggle
        /** @type {?} */
        var searchIcon = this.createSearchIcon();
        // attach them
        this.menuContainer.appendChild(searchIcon);
        this.menuContainer.parentElement.appendChild(this.searchArea);
    };
    /**
     * Attach sub menu toggles
     */
    /**
     * Attach sub menu toggles
     * @return {?}
     */
    AlphaHeader.prototype.attachSubMenuToggles = /**
     * Attach sub menu toggles
     * @return {?}
     */
    function () {
        /** @type {?} */
        var subMenus = this.element.querySelectorAll('.sub-menu');
        /** @type {?} */
        var i = 0;
        /** @type {?} */
        var len = subMenus.length;
        for (i; i < len; i++) {
            /** @type {?} */
            var subMenu = subMenus[i];
            /** @type {?} */
            var toggle = document.createElement('span');
            toggle.classList.add('sub-menu-toggle');
            subMenu.parentNode.insertBefore(toggle, subMenu);
        }
    };
    /**
     * Measure the width of text given a font def and custom properties
     */
    /**
     * Measure the width of text given a font def and custom properties
     * @param {?} text
     * @param {?} font
     * @param {?=} overwrites
     * @return {?}
     */
    AlphaHeader.prototype.measureWidth = /**
     * Measure the width of text given a font def and custom properties
     * @param {?} text
     * @param {?} font
     * @param {?=} overwrites
     * @return {?}
     */
    function (text, font, overwrites) {
        if (overwrites === void 0) { overwrites = {}; }
        /** @type {?} */
        var letterSpacing = overwrites.letterSpacing || 0;
        /** @type {?} */
        var wordSpacing = overwrites.wordSpacing || 0;
        /** @type {?} */
        var addSpacing = addWordAndLetterSpacing(wordSpacing, letterSpacing);
        /** @type {?} */
        var ctx = this.getContext2d(font);
        return ctx.measureText(text).width + addSpacing(text);
    };
    /**
     * Get canvas element to measure text with
     */
    /**
     * Get canvas element to measure text with
     * @param {?} font
     * @return {?}
     */
    AlphaHeader.prototype.getContext2d = /**
     * Get canvas element to measure text with
     * @param {?} font
     * @return {?}
     */
    function (font) {
        if (this.canvasContext) {
            return this.canvasContext;
        }
        try {
            /** @type {?} */
            var ctx = document.createElement('canvas').getContext('2d');
            /** @type {?} */
            var dpr = window.devicePixelRatio || 1;
            /** @type {?} */
            var bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
            ctx.font = font;
            ctx.setTransform(dpr / bsr, 0, 0, dpr / bsr, 0, 0);
            this.canvasContext = ctx;
            return ctx;
        }
        catch (err) {
            throw new Error('Canvas support required');
        }
    };
    /**
     * @return {?}
     */
    AlphaHeader.prototype.open = /**
     * @return {?}
     */
    function () {
        this.closeSubMenus();
        this.element.classList.add('open');
        htmlClasses.add('nav-open');
    };
    /**
     * @return {?}
     */
    AlphaHeader.prototype.close = /**
     * @return {?}
     */
    function () {
        this.element.classList.remove('open');
        htmlClasses.remove('nav-open');
    };
    /**
     * @return {?}
     */
    AlphaHeader.prototype.closeSubMenus = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var openElements = this.element.querySelectorAll('.open');
        /** @type {?} */
        var i = 0;
        /** @type {?} */
        var len = openElements.length;
        for (i; i < len; i++) {
            /** @type {?} */
            var item = openElements[i];
            item.classList.remove('open');
        }
    };
    /**
     * @return {?}
     */
    AlphaHeader.prototype.openSearch = /**
     * @return {?}
     */
    function () {
        this.closeSubMenus();
        this.searchArea.classList.add('open');
    };
    /**
     * @return {?}
     */
    AlphaHeader.prototype.closeSearch = /**
     * @return {?}
     */
    function () {
        this.searchArea.classList.remove('open');
    };
    /**
     * Remove listeners
     */
    /**
     * Remove listeners
     * @return {?}
     */
    AlphaHeader.prototype.destroy = /**
     * Remove listeners
     * @return {?}
     */
    function () {
        window.removeEventListener('resize', this._boundResizeFunction);
        this.element.removeEventListener('click', this._boundClickFunction);
    };
    /**
     * Resize function
     */
    /**
     * Resize function
     * @return {?}
     */
    AlphaHeader.prototype.check = /**
     * Resize function
     * @return {?}
     */
    function () {
        // extract the supported values
        /** @type {?} */
        var reservedWidth = MENU_RESERVED_WIDTH;
        /** @type {?} */
        var minItemSize = ITEM_SIZE;
        /** @type {?} */
        var toolBarIconWidth = ITEM_SIZE;
        /** @type {?} */
        var fontSize = ITEM_FONT_SIZE + "px"
        // available width the menu has to expand to
        ;
        // available width the menu has to expand to
        /** @type {?} */
        var availWidth = document.body.clientWidth - reservedWidth;
        // width needed by the menu
        /** @type {?} */
        var collapsedWidthNeeded = this.getCollapsedMenuWidth({
            font: "600 " + fontSize + " Century Gothic",
            letterSpacing: "0.05em",
            itemPadding: ITEM_MIN_PADDING * 2,
            minItemWidth: minItemSize
        });
        // width needed for toolbar icon view
        /** @type {?} */
        var minWidthNeeded = this.toolBar.children.length * toolBarIconWidth;
        // new state to change into
        /** @type {?} */
        var newState;
        /*console.info(
            "available width: " + availWidth + "\n"
            + "need for collapsed: " + collapsedWidthNeeded + "\n"
            + "need for toolbar: " + minWidthNeeded
        );*/
        /**
         * Check conditions for collapsing
         */
        if (availWidth < minWidthNeeded) {
            newState = 'minified';
        }
        else if (availWidth < collapsedWidthNeeded) {
            newState = 'collapsed';
        }
        else {
            newState = '';
            // set any extra item padding available
            this.setExtraItemPadding();
        }
        if (this.state !== newState) {
            if (newState === 'minified' || newState === 'collapsed') {
                htmlClasses.add('nav-collapsed');
                this.element.classList.add('collapsed');
            }
            if (newState === '') {
                htmlClasses.remove('nav-minified');
                htmlClasses.remove('nav-collapsed');
                this.element.classList.remove('minified');
                this.element.classList.remove('collapsed');
            }
            else if (newState === 'minified') {
                htmlClasses.add('nav-minified');
                this.element.classList.add('minified');
            }
            else if (newState === 'collapsed' && this.state === 'minified') {
                this.element.classList.remove('minified');
                htmlClasses.remove('nav-minified');
            }
            else if (this.state === 'collapsed') {
                this.element.classList.remove('collapsed');
                htmlClasses.remove('nav-collapsed');
            }
            this.state = newState;
        }
    };
    /**
     * Set extra item padding
     */
    /**
     * Set extra item padding
     * @return {?}
     */
    AlphaHeader.prototype.setExtraItemPadding = /**
     * Set extra item padding
     * @return {?}
     */
    function () {
        // available width the menu has to expand to
        /** @type {?} */
        var availWidth = document.body.clientWidth - MENU_RESERVED_WIDTH;
        /** @type {?} */
        var childrenToPad = [];
        /** @type {?} */
        var i = 0;
        for (i; i < this.menuContainer.childElementCount; i++) {
            /** @type {?} */
            var el = (/** @type {?} */ (this.menuContainer.children[i]));
            if (!el.hasAttribute('menu-icon') && !el.classList.contains('menu-icon-width')) {
                childrenToPad.push(el);
            }
            else {
                availWidth -= ITEM_SIZE;
            }
        }
        // min width with no padding, excluding icons
        /** @type {?} */
        var minWidthNeeded = this.getCollapsedMenuWidth({
            font: "600 " + ITEM_FONT_SIZE + "px" + " Century Gothic",
            letterSpacing: "0.05em",
            itemPadding: 0,
            minItemWidth: 0,
            excludeIcons: true
        });
        // space available to distribute to padding
        /** @type {?} */
        var paddingToDistribute = availWidth - minWidthNeeded;
        // item padding
        /** @type {?} */
        var extraItemPadding = paddingToDistribute / (childrenToPad.length * 2);
        // ensure max/min
        if (extraItemPadding > ITEM_MAX_PADDING) {
            extraItemPadding = ITEM_MAX_PADDING;
        }
        else if (extraItemPadding < ITEM_MIN_PADDING) {
            extraItemPadding = ITEM_MIN_PADDING;
        }
        /*console.info(
            "minWidthNeeded: " + minWidthNeeded + "\n"
            + "availWidth: " + availWidth + "\n"
            + "will distribute: " + paddingToDistribute + "\n"
            + "to " + childrenToPad.length + " each: " + extraItemPadding + "\n"
        );*/
        /**
         * Set padding on the menu elements
         */
        for (i = 0; i < childrenToPad.length; i++) {
            /** @type {?} */
            var el = (/** @type {?} */ (childrenToPad[i]));
            if (!el.firstElementChild) {
                continue;
            }
            /** @type {?} */
            var link = (/** @type {?} */ (el.firstElementChild));
            link.style.paddingLeft = extraItemPadding + "px";
            link.style.paddingRight = extraItemPadding + "px";
        }
    };
    return AlphaHeader;
}());
/**
 *
 * 	Helper functions
 *
 */
/**
 *
 * @param {?} obj
 * @param {?} defaultProps
 * @return {?}
 */
function merge(obj, defaultProps) {
    for (var prop_1 in defaultProps) {
        if (!obj.hasOwnProperty(prop_1)) {
            obj[prop_1] = defaultProps[prop_1];
        }
    }
    return obj;
}
/**
 * Get property from src
 * @param {?} src
 * @param {?} attr
 * @param {?} defaultValue
 * @return {?}
 */
function prop(src, attr, defaultValue) {
    return (src && typeof src[attr] !== 'undefined' && src[attr]) || defaultValue;
}
/**
 * We only support rem/em/pt conversion
 * @param {?} val
 * @param {?=} options
 * @return {?}
 */
function pxValue(val, options) {
    if (options === void 0) { options = {}; }
    /** @type {?} */
    var baseFontSize = parseInt(prop(options, 'base-font-size', 16), 10);
    /** @type {?} */
    var value = parseFloat(val);
    /** @type {?} */
    var unit = val.replace(value, '');
    // eslint-disable-next-line default-case
    switch (unit) {
        case 'rem':
        case 'em':
            return value * baseFontSize;
        case 'pt':
            return value / (96 / 72);
        case 'px':
            return value;
    }
    throw new Error("The unit " + unit + " is not supported");
}
/**
 * Add custom letter and word spacing
 * @param {?} ws
 * @param {?} ls
 * @return {?}
 */
function addWordAndLetterSpacing(ws, ls) {
    /** @type {?} */
    var wordAddon = 0;
    if (ws) {
        wordAddon = pxValue(ws);
    }
    /** @type {?} */
    var letterAddon = 0;
    if (ls) {
        letterAddon = pxValue(ls);
    }
    return function (text) {
        /** @type {?} */
        var words = text.trim().replace(/\s+/gi, ' ').split(' ').length - 1;
        /** @type {?} */
        var chars = text.length;
        return (words * wordAddon) + (chars * letterAddon);
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
 */
var AlphaGlobalHeader = /** @class */ (function () {
    function AlphaGlobalHeader(elRef, router) {
        var _this = this;
        this.elRef = elRef;
        this.router = router;
        this.homeTarget = '_self';
        this.languages = [];
        /**
         * Listen to navigation events
         * Toolbar items that get moved around lose their ability to have their classes added / removed by angular
         */
        this.router.events.subscribe(function (event) {
            if (!_this.header) {
                return;
            }
            if (event instanceof NavigationStart) {
                // close any open nav
                _this.header.close();
            }
        });
    }
    /**
     * Close menu when clicking on self link
     *
     * @param event
     */
    /**
     * Close menu when clicking on self link
     *
     * @param {?} event
     * @return {?}
     */
    AlphaGlobalHeader.prototype.onClick = /**
     * Close menu when clicking on self link
     *
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var targ = event.target;
        /** @type {?} */
        var isRouterLink = targ.hasAttribute('href');
        if (isRouterLink) {
            // close the nav (should close by itself but when clicking on own items no navigation occurs)
            this.header.close();
        }
    };
    /**
     * After view and content has been rendered, check the menu widths
     */
    /**
     * After view and content has been rendered, check the menu widths
     * @return {?}
     */
    AlphaGlobalHeader.prototype.ngAfterViewInit = /**
     * After view and content has been rendered, check the menu widths
     * @return {?}
     */
    function () {
        // use our common menu sizing lib
        this.header = new AlphaHeader(this.elRef.nativeElement, {
            search: this.search ? { action: this.searchAction } : false,
            languages: this.languages,
            closeSubMenusOnClick: true
        });
    };
    /**
     * on click of the home link either use the router, or allow to open in new tab
     * @param event
     */
    /**
     * on click of the home link either use the router, or allow to open in new tab
     * @param {?} event
     * @return {?}
     */
    AlphaGlobalHeader.prototype.onHomeClick = /**
     * on click of the home link either use the router, or allow to open in new tab
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.home instanceof Array) {
            event.preventDefault();
            this.router.navigate(this.home);
        }
        else {
            /** @type {?} */
            var link = (/** @type {?} */ (event.target));
            link.setAttribute('href', this.home);
        }
    };
    /**
     * Cleanup on destroy
     */
    /**
     * Cleanup on destroy
     * @return {?}
     */
    AlphaGlobalHeader.prototype.ngOnDestroy = /**
     * Cleanup on destroy
     * @return {?}
     */
    function () {
        this.header.destroy();
    };
    AlphaGlobalHeader.decorators = [
        { type: Component, args: [{
                    selector: 'alpha-global-header',
                    template: "\n\t<a *ngIf=\"home\" class=\"question-mark agh-icon-logo\" id=\"mobileLogo\" (click)=\"onHomeClick($event)\" [target]=\"homeTarget\"></a>\n\n\t<div class=\"menu-container\">\n\n\t\t<div *ngIf=\"home\" class=\"before-menu\">\n\t\t\t<a class=\"question-mark agh-icon-logo\" (click)=\"onHomeClick($event)\" [target]=\"homeTarget\"></a>\n\t\t</div>\n\n\t\t<div class=\"menu-area\">\n\n\t\t\t<ul menu-container class=\"main-menu\">\n\n\t\t\t\t<ng-content></ng-content>\n\n\t\t\t</ul>\n\n\t\t</div>\n\n\t</div>\n\n  \t",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["@font-face{font-family:AlphaIcons;font-weight:400;font-style:normal;src:url(data:application/font-woff;charset=utf-8;base64,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)}[class*=\" agh-icon-\"]::before,[class^=agh-icon-]::before,[data-agh-icon]::before{font-family:AlphaIcons!important;display:inline-block;font-style:normal;font-weight:400;font-variant:normal;text-transform:none!important;speak:none;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}[data-agh-icon]::before{content:attr(data-agh-icon)}.agh-icon-logo::before{content:\"\\64\"}.agh-icon-menu-toggle::before{content:\"\\65\"}.agh-icon-search::before{content:\"\\67\"}.agh-icon-check::before{content:\"\\76\"}.agh-icon-globe::before{content:\"\\77\"}.agh-icon-profile::before{content:\"\\78\"}.agh-icon-close-thin::before{content:\"\\79\"}html.nav-open{overflow:hidden}html.nav-open .menu-toolbar{display:none!important}html.nav-collapsed body{padding-top:84px}html.nav-collapsed alpha-global-header{box-sizing:initial;height:84px}html.nav-collapsed alpha-global-header .question-mark{width:84px;height:84px;max-width:84px;min-width:84px}html.nav-collapsed alpha-global-header [menu-icon]{max-width:84px}html.nav-collapsed alpha-global-header .menu-search-area,html.nav-collapsed alpha-global-header .menu-search-input{height:84px}html.nav-collapsed alpha-global-header:not(.collapsed) .main-menu>.menu-item-has-children:hover>.sub-menu{top:85px}html.nav-collapsed alpha-global-header .menu-toolbar>.menu-item-has-children.open>.sub-menu{top:84px}html.nav-collapsed alpha-global-header .menu-toolbar>::after,html.nav-collapsed alpha-global-header:not(.collapsed) .main-menu>::after{height:84px}html.nav-collapsed alpha-global-header .menu-toolbar>.menu-icon-width,html.nav-collapsed alpha-global-header:not(.collapsed) .main-menu>.menu-icon-width{max-width:84px}html.nav-collapsed alpha-global-header .menu-search-area form .search-form-close{flex-basis:84px}html.nav-collapsed alpha-global-header:not(.collapsed) .main-menu>:not(template){min-width:84px}html.nav-collapsed alpha-global-header:not(.collapsed) .main-menu>:not(template)>a{height:84px}html:not([dir=rtl]) html.nav-collapsed alpha-global-header:not(.collapsed) .main-menu>:not(template):last-child .sub-menu{right:-1px;left:unset}html.nav-collapsed alpha-global-header.collapsed .menu-toolbar>:not(template){min-width:84px;height:84px}html.nav-minified body{padding-top:58px}html.nav-minified alpha-global-header{box-sizing:initial;height:58px}html.nav-minified alpha-global-header .question-mark{width:58px;height:58px;max-width:58px;min-width:58px}html.nav-minified alpha-global-header [menu-icon]{max-width:58px}html.nav-minified alpha-global-header .menu-search-area,html.nav-minified alpha-global-header .menu-search-input{height:58px}html.nav-minified alpha-global-header:not(.collapsed) .main-menu>.menu-item-has-children:hover>.sub-menu{top:59px}html.nav-minified alpha-global-header .menu-toolbar>.menu-item-has-children.open>.sub-menu{top:58px}html.nav-minified alpha-global-header .menu-toolbar>::after,html.nav-minified alpha-global-header:not(.collapsed) .main-menu>::after{height:58px}html.nav-minified alpha-global-header .menu-toolbar>.menu-icon-width,html.nav-minified alpha-global-header:not(.collapsed) .main-menu>.menu-icon-width{max-width:58px}html.nav-minified alpha-global-header .menu-search-area form .search-form-close{flex-basis:58px}html.nav-minified alpha-global-header:not(.collapsed) .main-menu>:not(template){min-width:58px}html.nav-minified alpha-global-header:not(.collapsed) .main-menu>:not(template)>a{height:58px}html:not([dir=rtl]) html.nav-minified alpha-global-header:not(.collapsed) .main-menu>:not(template):last-child .sub-menu{right:-1px;left:unset}html.nav-minified alpha-global-header.collapsed .menu-toolbar>:not(template){min-width:58px;height:58px}body{padding-top:84px}alpha-global-header{box-sizing:initial;height:84px;display:block;position:fixed;z-index:250000;top:0;left:0;width:100%;line-height:1;font-family:\"Avante Garde\",\"Century Gothic\",sans-serif;color:#000}alpha-global-header .menu-search-area,alpha-global-header .menu-search-input{height:84px}alpha-global-header:not(.collapsed) .main-menu>.menu-item-has-children:hover>.sub-menu{top:85px}alpha-global-header .menu-toolbar>.menu-item-has-children.open>.sub-menu{top:84px}alpha-global-header .menu-toolbar>.menu-icon-width,alpha-global-header:not(.collapsed) .main-menu>.menu-icon-width{max-width:84px}alpha-global-header .menu-search-area form .search-form-close{flex-basis:84px}html:not([dir=rtl]) alpha-global-header:not(.collapsed) .main-menu>:not(template):last-child .sub-menu{right:-1px;left:unset}alpha-global-header a{text-decoration:none;display:block;color:inherit;cursor:pointer}alpha-global-header li,alpha-global-header ul{padding:0;margin:0;list-style:none;position:relative}alpha-global-header #closeButton{display:none}alpha-global-header .question-mark{width:84px;height:84px;max-width:84px;min-width:84px;cursor:pointer;color:#e42312;font-size:45px;display:flex;align-items:center;justify-content:center;box-sizing:border-box}alpha-global-header li a{color:#000;transition:color .3s ease-out,background-color .3s ease-out}alpha-global-header [menu-icon]{max-width:84px;cursor:pointer;font-size:22px;transition:color .2s ease-out}alpha-global-header [menu-icon]:hover::before{color:#e42312}alpha-global-header [menu-icon]::before{font-family:AlphaIcons;content:attr(menu-icon);font-weight:400;position:relative;z-index:50;transition:color .2s ease-out}alpha-global-header .no-cursor{cursor:default}alpha-global-header .search-icon{font-size:26px}alpha-global-header .menu-toolbar .menu-item-has-children.open:not(.current-menu-item),alpha-global-header:not(.collapsed) .main-menu .menu-item-has-children:hover:not(.current-menu-item){border-bottom:1px solid #fff}alpha-global-header .menu-toolbar .menu-item-has-children.open>.sub-menu,alpha-global-header:not(.collapsed) .main-menu .menu-item-has-children:hover>.sub-menu{-webkit-transform:translateY(0);transform:translateY(0);height:auto;border:1px solid #dfdfdf;border-top:none}alpha-global-header .menu-toolbar>::before,alpha-global-header:not(.collapsed) .main-menu>::before{position:relative;z-index:50}alpha-global-header .menu-toolbar>::after,alpha-global-header:not(.collapsed) .main-menu>::after{height:84px;content:\"\";background:#fff;position:absolute;top:0;left:0;z-index:32;display:block;width:100%;border-left:1px solid #dfdfdf;border-right:1px solid #dfdfdf}alpha-global-header .menu-toolbar>* .sub-menu li:hover>a,alpha-global-header .menu-toolbar>:not(.menu-btn):hover>a,alpha-global-header:not(.collapsed) .main-menu>* .sub-menu li:hover>a,alpha-global-header:not(.collapsed) .main-menu>:not(.menu-btn):hover>a{color:#e42312}alpha-global-header .menu-toolbar>.current-menu-ancestor::after,alpha-global-header .menu-toolbar>.current-menu-item::after,alpha-global-header:not(.collapsed) .main-menu>.current-menu-ancestor::after,alpha-global-header:not(.collapsed) .main-menu>.current-menu-item::after{border-bottom:2px solid #e42312;top:-2px}alpha-global-header .menu-toolbar>.current-menu-ancestor .current-menu-item a,alpha-global-header .menu-toolbar>.current-menu-item .current-menu-item a,alpha-global-header:not(.collapsed) .main-menu>.current-menu-ancestor .current-menu-item a,alpha-global-header:not(.collapsed) .main-menu>.current-menu-item .current-menu-item a{color:#e42312}alpha-global-header .menu-toolbar>.menu-item-has-children .sub-menu,alpha-global-header:not(.collapsed) .main-menu>.menu-item-has-children .sub-menu{overflow:hidden;position:absolute;z-index:30;left:0;min-width:-webkit-max-content;min-width:-moz-max-content;min-width:max-content;width:100%;height:0;padding:0;background:#fff;-webkit-transform:translateY(-100%);transform:translateY(-100%);transition:transform .2s ease-out;transition:transform .2s ease-out,-webkit-transform .2s ease-out}alpha-global-header .menu-toolbar>.menu-item-has-children .sub-menu a,alpha-global-header:not(.collapsed) .main-menu>.menu-item-has-children .sub-menu a{padding:18px 50px 16px;letter-spacing:0}alpha-global-header .menu-toolbar>.menu-item-has-children .sub-menu a:hover,alpha-global-header:not(.collapsed) .main-menu>.menu-item-has-children .sub-menu a:hover{background:#f9f9f9}alpha-global-header .main-menu{display:flex;flex-flow:row nowrap;margin:0;font-size:18px}alpha-global-header .main-menu>:not(template){font-weight:600;letter-spacing:.36px;position:relative}alpha-global-header .main-menu>:not(template)>a{position:relative;z-index:35;box-sizing:border-box;display:flex;align-items:center;flex-flow:row wrap}alpha-global-header .sub-menu{font-size:16px;font-weight:200}alpha-global-header .menu-toggle{background-color:#f9f9f9;border-left:1px solid #dfdfdf;z-index:50}html:not(.nav-minified) alpha-global-header .menu-toggle:hover i,html:not(.nav-minified) alpha-global-header .menu-toggle:hover::after,html:not(.nav-minified) alpha-global-header .menu-toggle:hover::before{background-color:#e42312}alpha-global-header .menu-toggle i,alpha-global-header .menu-toggle::after,alpha-global-header .menu-toggle::before{height:2px!important;margin:4px 0;display:block;background-color:#000;position:static;width:33%;transition:background-color .2s ease-out}alpha-global-header .menu-toggle::after,alpha-global-header .menu-toggle::before{content:\"\"}alpha-global-header .menu-search-area{position:absolute;z-index:300;left:100%;top:0;width:100%;background:#fff;-webkit-transform:translateX(0);transform:translateX(0);transition:transform .3s ease-out,-webkit-transform .3s ease-out}alpha-global-header .menu-search-area form{display:flex;flex-grow:1}alpha-global-header .menu-search-area.open{-webkit-transform:translateX(-100%);transform:translateX(-100%)}alpha-global-header .menu-search-area .search-form-close{cursor:pointer;background-color:#e42312;color:#fff;font-size:30px;display:flex;justify-content:center;align-items:center}alpha-global-header .menu-search-area .menu-search-input-wrapper{flex-grow:1}alpha-global-header .menu-search-area .menu-search-input{font-size:20px;color:#5d6368;border:none;border-left:1px solid #dfdfdf;background-color:#f9f9f9;width:100%;margin:0;padding:20px 50px;box-sizing:border-box}alpha-global-header .menu-search-area .menu-search-input:focus{outline:0}alpha-global-header:not(.collapsed) #mobileLogo,alpha-global-header:not(.collapsed) .menu-toolbar{display:none}alpha-global-header:not(.collapsed) .before-menu{border-bottom:1px solid #dfdfdf;flex-grow:1;min-width:84px;background:#fff}alpha-global-header:not(.collapsed) .menu-container{display:flex;justify-content:space-between}alpha-global-header:not(.collapsed) .menu-btn::after{background-color:#e42312;transition:background-color 150ms ease-in-out}alpha-global-header:not(.collapsed) .menu-btn:hover::after{background-color:#b51c0e}alpha-global-header:not(.collapsed) .menu-btn a{color:#fff;line-height:1.8}alpha-global-header:not(.collapsed) .menu-area{position:relative}alpha-global-header:not(.collapsed) .main-menu{justify-content:flex-end}alpha-global-header:not(.collapsed) .main-menu>:not(template){min-width:84px;border-bottom:1px solid #dfdfdf;display:flex;align-items:center;justify-content:center;flex:1 0 auto}alpha-global-header:not(.collapsed) .main-menu>:not(template).bg-darker::after{background-color:#f9f9f9}alpha-global-header:not(.collapsed) .main-menu>:not(template)>a{height:84px;width:100%;justify-content:center}alpha-global-header.collapsed{display:flex;justify-content:space-between;background:#fff;border-bottom:1px solid #dfdfdf}alpha-global-header.collapsed.open .main-menu{display:flex}alpha-global-header.collapsed.open #closeButton{display:block;position:absolute;right:0;z-index:100;font-size:26px;padding:15px;line-height:80%;cursor:pointer;color:#fff}alpha-global-header.collapsed .menu-toolbar{display:flex;flex-flow:row nowrap;flex-grow:1;justify-content:flex-end;position:relative}alpha-global-header.collapsed .menu-toolbar>:not(template){min-width:84px;height:84px;display:flex;flex-flow:column nowrap;justify-content:center;align-items:center;position:relative}alpha-global-header.collapsed .menu-search-area .menu-search-input{border:none}alpha-global-header.collapsed .before-menu{display:none}alpha-global-header.collapsed .main-menu .sub-menu-toggle{cursor:pointer;display:inline-flex;justify-content:center;align-items:center;margin:0 0 0 -12px;vertical-align:middle;height:auto;padding:10px}alpha-global-header.collapsed .main-menu .sub-menu-toggle::before{content:\"\";position:absolute;border-bottom:none;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #fff}alpha-global-header.collapsed li{border:none;display:block}alpha-global-header.collapsed li a{background:0 0;height:auto;color:inherit}alpha-global-header.collapsed .menu-container li a{border:none}alpha-global-header.collapsed .main-menu{position:fixed;top:0;left:0;z-index:50;width:100%;height:100%;overflow-y:auto;display:none;flex-flow:column nowrap;justify-content:center;background:#000;color:#fff;text-align:center}alpha-global-header.collapsed .main-menu a{padding-top:8px;padding-bottom:8px;color:inherit}alpha-global-header.collapsed .main-menu [menu-icon]{max-width:none}alpha-global-header.collapsed .main-menu [menu-icon]:hover::before{color:inherit}alpha-global-header.collapsed .main-menu [menu-icon]::before{font-family:inherit;font-weight:inherit;content:attr(menu-title);display:inline-block}alpha-global-header.collapsed .main-menu [menu-icon]:not(a)::before{padding:8px 15px}alpha-global-header.collapsed .main-menu [menu-icon] .sub-menu-toggle{margin-left:-8px}alpha-global-header.collapsed .main-menu>:not(template){margin-bottom:10px;width:100%;flex:initial;font-size:24px}alpha-global-header.collapsed .main-menu>:not(template)>a{display:inline-block;font-size:inherit;flex-grow:0;height:auto}alpha-global-header.collapsed .main-menu>:not(template).open>.sub-menu{display:block}alpha-global-header.collapsed .main-menu>:not(template).open .sub-menu-toggle::before{border-top:none;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid #fff}alpha-global-header.collapsed .main-menu .sub-menu{margin:20px 0;position:static;visibility:visible;display:none;background:0 0;border:none;width:100%;-webkit-transform:none;transform:none;font-size:18px}alpha-global-header.minified{border:none}alpha-global-header.minified .menu-toggle{background:0 0;border:none!important}alpha-global-header.minified .menu-toggle::after,alpha-global-header.minified .menu-toggle::before,alpha-global-header.minified .menu-toggle>i{margin:2px 0}alpha-global-header.minified .question-mark{font-size:30px}alpha-global-header.minified .menu-toolbar>:not(.menu-toggle){display:none}"]
                }] }
    ];
    /** @nocollapse */
    AlphaGlobalHeader.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Router }
    ]; };
    AlphaGlobalHeader.propDecorators = {
        home: [{ type: Input, args: ['home',] }],
        homeTarget: [{ type: Input, args: ['homeTarget',] }],
        search: [{ type: Input, args: ['search',] }],
        searchAction: [{ type: Input, args: ['search-action',] }],
        languages: [{ type: Input, args: ['languages',] }],
        onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
    };
    return AlphaGlobalHeader;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
 */
var AlphaGlobalHeaderModule = /** @class */ (function () {
    function AlphaGlobalHeaderModule() {
    }
    AlphaGlobalHeaderModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        AlphaGlobalHeader
                    ],
                    exports: [
                        AlphaGlobalHeader,
                    ],
                    imports: [
                        CommonModule,
                    ]
                },] }
    ];
    return AlphaGlobalHeaderModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
 */

export { AlphaGlobalHeaderModule, AlphaGlobalHeader as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxwaGEtZ2xvYmFsLWhlYWRlci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vYWxwaGEtZ2xvYmFsLWhlYWRlci9zcmMvdXRpbC9tZW51LWNvbXBvbmVudC50cyIsIm5nOi8vYWxwaGEtZ2xvYmFsLWhlYWRlci9zcmMvYWxwaGEtZ2xvYmFsLWhlYWRlci5jb21wb25lbnQudHMiLCJuZzovL2FscGhhLWdsb2JhbC1oZWFkZXIvc3JjL21vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLy8gcmVmZXJlbmNlIHRvIGRvY3VtZW50IGVsZW1lbnQgY2xhc3Nlc1xyXG5jb25zdCBodG1sQ2xhc3NlcyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3Q7XHJcblxyXG5cclxuY29uc3QgSVRFTV9TSVpFID0gODQ7XHJcbmNvbnN0IElURU1fTUFYX1BBRERJTkcgPSA1MDtcclxuY29uc3QgSVRFTV9NSU5fUEFERElORyA9IDE1O1xyXG5jb25zdCBJVEVNX0ZPTlRfU0laRSA9IDE4O1xyXG5jb25zdCBNRU5VX1JFU0VSVkVEX1dJRFRIID0gODQ7IC8vIHRoZSBsb2dvIGlzIG9ubHkgcmVxdWlyZWQgc3BhY2VcclxuXHJcbi8qKlxyXG4gKiBUaGlzIGNsYXNzIGlzIHVzZWQgaW4gcG9seW1lciBhbmQgYW5ndWxhciB0byBjb25zdHJ1Y3QgYW5kIG1hbmFnZSB0aGUgbWVudVxyXG4gKi9cclxuY2xhc3MgQWxwaGFIZWFkZXIge1xyXG5cclxuXHRwdWJsaWMgdG9vbEJhcjogSFRNTEVsZW1lbnQ7XHJcblx0cHVibGljIG1lbnVDb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG5cdHB1YmxpYyBzZWFyY2hBcmVhOiBIVE1MRWxlbWVudDtcclxuXHJcblx0cHVibGljIGlzQ29sbGFwc2VkOiBib29sZWFuO1xyXG5cdHB1YmxpYyBpc01pbmlmaWVkOiBib29sZWFuO1xyXG5cdHB1YmxpYyBzdGF0ZTogc3RyaW5nO1xyXG5cdHB1YmxpYyBvcHRpb25zOiBhbnk7XHJcblx0cHVibGljIGRlZmF1bHRzOiBhbnkgPSB7XHJcblx0XHRtaW5JdGVtU2l6ZTogMTAsXHJcblx0XHRmb250U2l6ZTogXCIxMHB4XCIsXHJcblx0XHRyZXNlcnZlZFdpZHRoOiA1MCxcclxuXHRcdGl0ZW1QYWRkaW5nOiAxMCwgLy8gKiB4IDIsXHJcblx0XHR0b29sQmFySXRlbVNlbGVjdG9yOiAnW3Rvb2xiYXItaXRlbV0nLFxyXG5cdFx0Y2xvc2VTdWJNZW51c09uQ2xpY2s6IGZhbHNlLFxyXG5cdFx0bGFuZ3VhZ2VzOiBbXVxyXG5cclxuXHR9O1xyXG5cclxuXHRwcml2YXRlIGNhbnZhc0NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcblx0cHJpdmF0ZSBfYm91bmRSZXNpemVGdW5jdGlvbjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcclxuXHRwcml2YXRlIF9ib3VuZENsaWNrRnVuY3Rpb246IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q7XHJcblx0cHJpdmF0ZSBfYm91bmRXaW5kb3dDbGlja0Z1bmN0aW9uOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xyXG5cclxuXHRjb25zdHJ1Y3RvcihcclxuXHRcdHB1YmxpYyBlbGVtZW50LFxyXG5cdFx0b3B0aW9uc1xyXG5cdCkge1xyXG5cclxuXHRcdHRoaXMuaXNDb2xsYXBzZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuaXNNaW5pZmllZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5zdGF0ZSA9ICcnO1xyXG5cdFx0dGhpcy5tZW51Q29udGFpbmVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoICdbbWVudS1jb250YWluZXJdJyApO1xyXG5cclxuXHRcdHRoaXMub3B0aW9ucyA9IG1lcmdlKCBvcHRpb25zIHx8IHt9LCB0aGlzLmRlZmF1bHRzICk7XHJcblxyXG5cdFx0dGhpcy5hdHRhY2hUb29sYmFyRWxlbWVudHMoKTtcclxuXHJcblx0XHRpZiAoIHRoaXMub3B0aW9ucy5sYW5ndWFnZXMubGVuZ3RoICkge1xyXG5cdFx0XHR0aGlzLm1lbnVDb250YWluZXIuYXBwZW5kQ2hpbGQoIHRoaXMuY3JlYXRlTGFuZ3VhZ2VNZW51KCAnbm8tY3Vyc29yJyApICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY3JlYXRlIHN1YiBtZW51IHRvZ2dsZXNcclxuXHRcdHRoaXMuYXR0YWNoU3ViTWVudVRvZ2dsZXMoKTtcclxuXHJcblx0XHQvLyBjcmVhdGUgdG9vbGJhciBtZW51IGFmdGVyIHN1Yi1tZW51IHRvZ2dsZVxyXG5cdFx0aWYgKCB0aGlzLm9wdGlvbnMubGFuZ3VhZ2VzLmxlbmd0aCApIHtcclxuXHRcdFx0dGhpcy50b29sQmFyLmluc2VydEJlZm9yZSggdGhpcy5jcmVhdGVMYW5ndWFnZU1lbnUoICdzdWItbWVudS10b2dnbGUnICksIHRoaXMudG9vbEJhci5maXJzdENoaWxkICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0aGlzLm9wdGlvbnMuc2VhcmNoICkge1xyXG5cdFx0XHR0aGlzLmNyZWF0ZVNlYXJjaEFyZWEoKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoICgpID0+IHtcclxuXHRcdFx0dGhpcy5jaGVjaygpO1xyXG5cdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ3JlYWR5JyApO1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdHRoaXMuX2JvdW5kUmVzaXplRnVuY3Rpb24gPSB0aGlzLmNoZWNrLmJpbmQoIHRoaXMgKTtcclxuXHRcdHRoaXMuX2JvdW5kQ2xpY2tGdW5jdGlvbiA9IHRoaXMub25DbGljay5iaW5kKCB0aGlzICk7XHJcblx0XHR0aGlzLl9ib3VuZFdpbmRvd0NsaWNrRnVuY3Rpb24gPSB0aGlzLm9uV2luZG93Q2xpY2suYmluZCggdGhpcyApO1xyXG5cclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgdGhpcy5fYm91bmRSZXNpemVGdW5jdGlvbiApO1xyXG5cclxuXHRcdHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCB0aGlzLl9ib3VuZENsaWNrRnVuY3Rpb24gKTtcclxuXHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgdGhpcy5fYm91bmRXaW5kb3dDbGlja0Z1bmN0aW9uICk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogTGlzdGVuIHRvIGNsaWNrcyBvbiB0aGUgd2luZG93IHRvIGNsb3NlIG9wZW4gbmF2IG1lbnVzXHJcblx0ICovXHJcblx0cHJpdmF0ZSBvbldpbmRvd0NsaWNrKCBldmVudCApOiB2b2lkIHtcclxuXHJcblx0XHQvLyBpZiB0aGUgY2xpY2sgY2FtZSBmcm9tIHRoZSBtZW51LCBkb250IGRvIGFueXRoaW5nXHJcblx0XHRpZiAoIGV2ZW50LmlzTWVudUNsaWNrICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jbG9zZVN1Yk1lbnVzKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBIYW5kbGUgY2xpY2tzIG9uIGRpZmZlcmVudCBlbGVtZW50c1xyXG5cdCAqL1xyXG5cdHByaXZhdGUgb25DbGljayggZXZlbnQgKTogdm9pZCB7XHJcblxyXG5cdFx0ZXZlbnQuaXNNZW51Q2xpY2sgPSB0cnVlO1xyXG5cclxuXHJcblx0XHRpZiAoIHRoaXMub3B0aW9ucy5jbG9zZVN1Yk1lbnVzT25DbGljayAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyggJ25hdi1vcGVuJyApICkge1xyXG5cdFx0XHQvLyBjbG9zZSBzdWItbWVudXMgaWYgdGhlIGNsaWNrIGNhbWUgZnJvbSB0aGVyZVxyXG5cdFx0XHRsZXQgbWVudUNvbnRhaW5lciA9IGV2ZW50LmNvbXBvc2VkUGF0aCgpLmZpbHRlciggZnVuY3Rpb24gKCBlbCApIHsgcmV0dXJuIGVsLmNsYXNzTGlzdCAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoICdzdWItbWVudScgKTsgfSApXHJcblx0XHRcdGlmICggbWVudUNvbnRhaW5lci5sZW5ndGggKSB7XHJcblx0XHRcdFx0Y29uc3QgcGFyZW50RWw6IEhUTUxFbGVtZW50ID0gbWVudUNvbnRhaW5lclsgMCBdLnBhcmVudEVsZW1lbnQ7XHJcblx0XHRcdFx0aWYgKCBwYXJlbnRFbC5jbGFzc0xpc3QuY29udGFpbnMoICdvcGVuJyApICkge1xyXG5cdFx0XHRcdFx0cGFyZW50RWwuY2xhc3NMaXN0LnJlbW92ZSggJ29wZW4nICk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuc3Bvb2ZDbG9zZVN1Yk1lbnUoIHBhcmVudEVsICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFN1YiBtZW51IHRvZ2dsZSBjbGlja3NcclxuXHRcdCAqL1xyXG5cdFx0aWYgKCBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3ViLW1lbnUtdG9nZ2xlJyApICkge1xyXG5cclxuXHRcdFx0bGV0IG1lbnV0YXJnZXQ7XHJcblx0XHRcdGlmICggZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyggJ21lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkgKSB7XHJcblxyXG5cdFx0XHRcdG1lbnV0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1lbnV0YXJnZXQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGlzT3BlbjogYm9vbGVhbiA9IG1lbnV0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnb3BlbicgKTtcclxuXHJcblx0XHRcdHRoaXMuY2xvc2VTdWJNZW51cygpO1xyXG5cclxuXHRcdFx0aWYgKCBpc09wZW4gKSB7XHJcblx0XHRcdFx0bWVudXRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCAnb3BlbicgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZW51dGFyZ2V0LmNsYXNzTGlzdC5hZGQoICdvcGVuJyApO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHJcblx0XHR9IGVsc2UgaWYgKCBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc2VhcmNoLWZvcm0tY2xvc2UnICkgKSB7XHJcblxyXG5cdFx0XHR0aGlzLmNsb3NlU2VhcmNoKCk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICggZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyggJ3NlYXJjaC1pY29uJyApICkge1xyXG5cclxuXHRcdFx0dGhpcy5vcGVuU2VhcmNoKCk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICggZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyggJ21lbnUtdG9nZ2xlJyApICkge1xyXG5cclxuXHRcdFx0dGhpcy5vcGVuKCk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICggZXZlbnQudGFyZ2V0LmlkID09PSAnY2xvc2VCdXR0b24nICkge1xyXG5cclxuXHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogSW4gYW5ndWxhciBzaXR1YXRpb25zLCB0aGUgcGFnZSBkb2Vzbid0IG5hdmlnYXRlLCBzbyBhIGhvdmVyZWQgc3ViLW1lbnUgd2lsbCByZW1haW4gb3BlbiBhZnRlciBhIGNsaWNrXHJcblx0ICogVGhpcyB3aWxsXHJcblx0ICovXHJcblx0cHJpdmF0ZSBzcG9vZkNsb3NlU3ViTWVudSggZWxlbWVudCApIHtcclxuXHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gSVRFTV9TSVpFICsgJ3B4JztcclxuXHRcdGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcclxuXHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblx0XHRcdGVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICcnO1xyXG5cclxuXHJcblx0XHR9LCAxMDAgKVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogR28gdGhyb3VnaCBlYWNoIGRpcmVjdCBjaGlsZHJlbiBvZiB0aGUgdWwgbWVudSBjb250YWluZXIsIG1lYXN1cmUgdGhlIHJlcXVpcmVkIHRleHQgZm9yIGVhY2ggZWxlbWVudCBwbHVzIHNvbWUgcGFkZGluZ1xyXG5cdCAqL1xyXG5cdHByaXZhdGUgZ2V0Q29sbGFwc2VkTWVudVdpZHRoKCBvcHRpb25zICk6IG51bWJlciB7XHJcblxyXG5cdFx0dmFyIG1pbldpZHRoID0gMCxcclxuXHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge30sXHJcblx0XHRcdGZvbnQgPSBvcHRpb25zLmZvbnQgfHwgXCIxMHB4IEFyaWFsXCIsXHJcblx0XHRcdGxldHRlclNwYWNpbmcgPSBvcHRpb25zLmxldHRlclNwYWNpbmcgfHwgMCxcclxuXHRcdFx0aXRlbVBhZGRpbmcgPSBvcHRpb25zLml0ZW1QYWRkaW5nIHx8IDAsXHJcblx0XHRcdG1pbkl0ZW1XaWR0aCA9IG9wdGlvbnMubWluSXRlbVdpZHRoIHx8IDAsXHJcblx0XHRcdHdvcmRTcGFjaW5nID0gb3B0aW9ucy53b3JkU3BhY2luZyB8fCAwLFxyXG5cdFx0XHRleGNsdWRlSWNvbnMgPSBvcHRpb25zLmV4Y2x1ZGVJY29ucyB8fCBmYWxzZSxcclxuXHRcdFx0aSA9IDA7XHJcblxyXG5cdFx0Zm9yICggaTsgaSA8IHRoaXMubWVudUNvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGg7IGkrKyApIHtcclxuXHJcblx0XHRcdHZhciBsaUVsID0gdGhpcy5tZW51Q29udGFpbmVyLmNoaWxkcmVuWyBpIF07XHJcblxyXG5cdFx0XHR2YXIgbGluayA9IGxpRWwuZmlyc3RFbGVtZW50Q2hpbGQgfHwgbGlFbCxcclxuXHRcdFx0XHR0ZXh0ID0gbGluay50ZXh0Q29udGVudCxcclxuXHRcdFx0XHRuZWVkZWQ7XHJcblxyXG5cdFx0XHRpZiAoIHRleHQgKSB7XHJcblx0XHRcdFx0bmVlZGVkID0gdGhpcy5tZWFzdXJlV2lkdGgoIHRleHQsIGZvbnQsIHsgbGV0dGVyU3BhY2luZzogbGV0dGVyU3BhY2luZywgd29yZFNwYWNpbmc6IHdvcmRTcGFjaW5nIH0gKSArIGl0ZW1QYWRkaW5nO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCAhZXhjbHVkZUljb25zICkge1xyXG5cdFx0XHRcdG5lZWRlZCA9IG1pbkl0ZW1XaWR0aDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9jb25zb2xlLmluZm8obGluay50ZXh0Q29udGVudCwgbmVlZGVkKTtcclxuXHJcblx0XHRcdC8vIGVuc3VyZSBtaW4gaXRlbSB3aWR0aFxyXG5cdFx0XHRtaW5XaWR0aCArPSBuZWVkZWQgPCBtaW5JdGVtV2lkdGggPyBtaW5JdGVtV2lkdGggOiBuZWVkZWQ7XHJcblxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gbWluV2lkdGg7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBNb3ZlIHRvb2xiYXIgZWxlbWVudHMgaW50byB0aGUgdG9vbGJhciBmcm9tIHRoZSBtZW51XHJcblx0ICpcclxuXHQgKi9cclxuXHRwcml2YXRlIGF0dGFjaFRvb2xiYXJFbGVtZW50cygpOiB2b2lkIHtcclxuXHJcblx0XHQvLyBjcmVhdGUgdGhlIHRvb2xiYXIgY29udGFpbmVyXHJcblx0XHR0aGlzLnRvb2xCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG5cdFx0dGhpcy50b29sQmFyLmNsYXNzTGlzdC5hZGQoICdtZW51LXRvb2xiYXInICk7XHJcblxyXG5cdFx0Ly8gYWRkIGEgc2VhcmNoIGljb25cclxuXHRcdGlmICggdGhpcy5vcHRpb25zLnNlYXJjaCApIHtcclxuXHRcdFx0Y29uc3Qgc2VhcmNoSWNvbjogSFRNTEVsZW1lbnQgPSB0aGlzLmNyZWF0ZVNlYXJjaEljb24oKTtcclxuXHRcdFx0dGhpcy50b29sQmFyLmFwcGVuZENoaWxkKCBzZWFyY2hJY29uICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYWRkIHRoZSBtZW51IGljb25cclxuXHRcdGNvbnN0IG1lbnVUb2dnbGU6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2EnICk7XHJcblx0XHRtZW51VG9nZ2xlLmNsYXNzTGlzdC5hZGQoICdtZW51LXRvZ2dsZScgKTtcclxuXHRcdG1lbnVUb2dnbGUuaW5uZXJIVE1MID0gJzxpPjwvaT4nO1xyXG5cdFx0dGhpcy50b29sQmFyLmFwcGVuZENoaWxkKCBtZW51VG9nZ2xlICk7XHJcblxyXG5cdFx0Ly8gYWRkIHRoZSBjbG9zZSBidXR0b25cclxuXHRcdGNvbnN0IGNsb3NlQnV0dG9uOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xyXG5cdFx0Y2xvc2VCdXR0b24uaWQgPSAnY2xvc2VCdXR0b24nO1xyXG5cdFx0Y2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCggJ2FnaC1pY29uLWNsb3NlLXRoaW4nICk7XHJcblx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoIGNsb3NlQnV0dG9uICk7XHJcblxyXG5cdFx0Ly8gYXBwZW5kIHRoZSB0b29sYmFyXHJcblx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoIHRoaXMudG9vbEJhciApO1xyXG5cclxuXHRcdC8vIGZpbmQgZHluYW1pYyB0b29sYmFyIGl0ZW1zIGZyb20gdGhlIHVzZXIgbWFya3VwXHJcblx0XHRjb25zdCBpdGVtczogTm9kZUxpc3QgPSB0aGlzLm1lbnVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggdGhpcy5vcHRpb25zLnRvb2xCYXJJdGVtU2VsZWN0b3IgKTtcclxuXHJcblx0XHRsZXQgaTogbnVtYmVyID0gMCxcclxuXHRcdFx0bGVuOiBudW1iZXIgPSBpdGVtcy5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yICggaTsgaSA8IGxlbjsgaSsrICkge1xyXG5cdFx0XHRjb25zdCBpdGVtOiBOb2RlID0gaXRlbXNbIGkgXTtcclxuXHRcdFx0dGhpcy50b29sQmFyLmluc2VydEJlZm9yZSggaXRlbSwgdGhpcy50b29sQmFyLmZpcnN0Q2hpbGQgKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlIHRoZSBsYW5ndWFnZSBtZW51XHJcblx0ICovXHJcblx0cHJpdmF0ZSBjcmVhdGVMYW5ndWFnZU1lbnUoIGV4dHJhQ2xhc3M6IHN0cmluZyA9ICcnICk6IEhUTUxFbGVtZW50IHtcclxuXHJcblx0XHRpZiAoIHRoaXMub3B0aW9ucy5sYW5ndWFnZXMubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBsYW5ndWFnZUVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcclxuXHRcdGxhbmd1YWdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnbWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKTtcclxuXHRcdGxhbmd1YWdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoICdtZW51LWljb24nLCAndycgKTtcclxuXHRcdGxhbmd1YWdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoICdtZW51LXRpdGxlJywgJ0xhbmd1YWdlcycgKTtcclxuXHJcblx0XHRpZiAoIGV4dHJhQ2xhc3MgKSB7XHJcblx0XHRcdGxhbmd1YWdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCBleHRyYUNsYXNzICk7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHN1Yk1lbnU6IHN0cmluZyA9ICc8dWwgY2xhc3M9XCJzdWItbWVudVwiPicsXHJcblx0XHRcdGk6IG51bWJlciA9IDAsXHJcblx0XHRcdGxlbjogbnVtYmVyID0gdGhpcy5vcHRpb25zLmxhbmd1YWdlcy5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yICggaTsgaSA8IGxlbjsgaSsrICkge1xyXG5cdFx0XHRjb25zdCBsYW5ndWFnZSA9IHRoaXMub3B0aW9ucy5sYW5ndWFnZXNbIGkgXTtcclxuXHRcdFx0bGV0IGhyZWY6IHN0cmluZyA9ICdqYXZhc2NyaXB0OnZvaWQoMCknO1xyXG5cdFx0XHRsZXQgYXR0cjogc3RyaW5nID0gJyc7XHJcblx0XHRcdGlmICggbGFuZ3VhZ2UuY29kZSApIHtcclxuXHRcdFx0XHRhdHRyID0gJ2RhdGEtbGFuZz1cIicgKyBsYW5ndWFnZS5jb2RlICsgJ1wiJztcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIGxhbmd1YWdlLmhyZWYgKSB7XHJcblx0XHRcdFx0aHJlZiA9IGxhbmd1YWdlLmhyZWY7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN1Yk1lbnUgKz0gJzxsaT48YSAnICsgYXR0ciArICcgaHJlZj1cIicgKyBocmVmICsgJ1wiPicgKyBsYW5ndWFnZS5sYWJlbCArICc8L2E+PC9saT4nO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN1Yk1lbnUgKz0gJzwvdWw+JztcclxuXHJcblx0XHRsYW5ndWFnZUVsZW1lbnQuaW5uZXJIVE1MID0gc3ViTWVudTtcclxuXHJcblx0XHRsYW5ndWFnZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBldmVudDogTW91c2VFdmVudCApID0+IHtcclxuXHJcblx0XHRcdGxldCBjb2RlID0gbnVsbDtcclxuXHRcdFx0aWYgKCBudWxsICE9PSAoIGNvZGUgPSAoIGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCApLmdldEF0dHJpYnV0ZSggJ2RhdGEtbGFuZycgKSApICkge1xyXG5cdFx0XHRcdGxldCB1cmw6IFVSTCA9IG5ldyBVUkwoIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgKTtcclxuXHRcdFx0XHR1cmwuc2VhcmNoUGFyYW1zLmRlbGV0ZSggJ2xhbmcnICk7XHJcblx0XHRcdFx0dXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoICdsYW5nJywgY29kZSApO1xyXG5cdFx0XHRcdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB1cmwuaHJlZjtcclxuXHRcdFx0fVxyXG5cdFx0fSApO1xyXG5cclxuXHRcdHJldHVybiBsYW5ndWFnZUVsZW1lbnQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGUgYW4gaWNvbiB0byBvcGVuIHRoZSBzZWFyY2hcclxuXHQgKi9cclxuXHRwcml2YXRlIGNyZWF0ZVNlYXJjaEljb24oKTogSFRNTEVsZW1lbnQge1xyXG5cdFx0Y29uc3Qgc2VhcmNoSWNvbjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xyXG5cdFx0c2VhcmNoSWNvbi5jbGFzc0xpc3QuYWRkKCAnc2VhcmNoLWljb24nICk7XHJcblx0XHRzZWFyY2hJY29uLnNldEF0dHJpYnV0ZSggJ21lbnUtaWNvbicsICdnJyApO1xyXG5cdFx0cmV0dXJuIHNlYXJjaEljb247XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGUgdGhlIHNlYXJjaCBhcmVhXHJcblx0ICovXHJcblx0cHJpdmF0ZSBjcmVhdGVTZWFyY2hBcmVhKCk6IHZvaWQge1xyXG5cclxuXHRcdC8vIGNyZWF0ZSB0aGUgc2VhcmNoIGZvcm1cclxuXHRcdHRoaXMuc2VhcmNoQXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XHJcblx0XHR0aGlzLnNlYXJjaEFyZWEuY2xhc3NMaXN0LmFkZCggJ21lbnUtc2VhcmNoLWFyZWEnICk7XHJcblxyXG5cdFx0Ly8gZm9ybSBhY3Rpb25cclxuXHRcdGNvbnN0IHNlYXJjaEFjdGlvbjogc3RyaW5nID0gdGhpcy5vcHRpb25zLnNlYXJjaC5hY3Rpb24gfHwgXCJcIjtcclxuXHJcblx0XHQvLyBjcmVhdGUgYSBVUkwgZnJvbSB0aGUgc2VhcmNoIGFjdGlvblxyXG5cdFx0Y29uc3Qgc2VhcmNoVXJsOiBVUkwgPSBuZXcgVVJMKCBzZWFyY2hBY3Rpb24sIGRvY3VtZW50LmxvY2F0aW9uLm9yaWdpbiApO1xyXG5cclxuXHRcdC8vIGdldCB0aGUgZm9ybSB0YXJnZXRcclxuXHRcdGNvbnN0IGZvcm1UYXJnZXQ6IHN0cmluZyA9IHNlYXJjaFVybC5ob3N0bmFtZSAhPT0gZG9jdW1lbnQubG9jYXRpb24uaG9zdG5hbWUgPyAnX2JsYW5rJyA6ICdfc2VsZic7XHJcblxyXG5cdFx0Ly8gdGhlIGZvcm0gbWFya3VwXHJcblx0XHR0aGlzLnNlYXJjaEFyZWEuaW5uZXJIVE1MID1cclxuXHRcdFx0YDxmb3JtIHRhcmdldD1cIiR7IGZvcm1UYXJnZXQgfVwiIGNsYXNzPVwibWVudS1zZWFyY2hcIiBhY3Rpb249XCIkeyBzZWFyY2hBY3Rpb24gfVwiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJtZW51LXNlYXJjaC1pbnB1dC13cmFwcGVyXCI+XHJcblx0XHRcdFx0XHQ8aW5wdXQgY2xhc3M9XCJtZW51LXNlYXJjaC1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNcIiB2YWx1ZT1cIlwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCI+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNlYXJjaC1mb3JtLWNsb3NlIGFnaC1pY29uLWNsb3NlLXRoaW5cIj48L2Rpdj5cclxuXHRcdFx0PC9mb3JtPmA7XHJcblxyXG5cdFx0Ly8gY3JlYXRlIHRoZSB0b2dnbGVcclxuXHRcdGNvbnN0IHNlYXJjaEljb246IEhUTUxFbGVtZW50ID0gdGhpcy5jcmVhdGVTZWFyY2hJY29uKCk7XHJcblxyXG5cdFx0Ly8gYXR0YWNoIHRoZW1cclxuXHRcdHRoaXMubWVudUNvbnRhaW5lci5hcHBlbmRDaGlsZCggc2VhcmNoSWNvbiApO1xyXG5cdFx0dGhpcy5tZW51Q29udGFpbmVyLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoIHRoaXMuc2VhcmNoQXJlYSApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQXR0YWNoIHN1YiBtZW51IHRvZ2dsZXNcclxuXHQgKi9cclxuXHRwcml2YXRlIGF0dGFjaFN1Yk1lbnVUb2dnbGVzKCk6IHZvaWQge1xyXG5cclxuXHRcdGNvbnN0IHN1Yk1lbnVzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuc3ViLW1lbnUnICk7XHJcblxyXG5cdFx0bGV0IGk6IG51bWJlciA9IDAsXHJcblx0XHRcdGxlbjogbnVtYmVyID0gc3ViTWVudXMubGVuZ3RoO1xyXG5cclxuXHRcdGZvciAoIGk7IGkgPCBsZW47IGkrKyApIHtcclxuXHJcblx0XHRcdGxldCBzdWJNZW51ID0gc3ViTWVudXNbIGkgXTtcclxuXHJcblx0XHRcdGNvbnN0IHRvZ2dsZTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcclxuXHRcdFx0dG9nZ2xlLmNsYXNzTGlzdC5hZGQoICdzdWItbWVudS10b2dnbGUnICk7XHJcblxyXG5cdFx0XHRzdWJNZW51LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCB0b2dnbGUsIHN1Yk1lbnUgKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogTWVhc3VyZSB0aGUgd2lkdGggb2YgdGV4dCBnaXZlbiBhIGZvbnQgZGVmIGFuZCBjdXN0b20gcHJvcGVydGllc1xyXG5cdCAqL1xyXG5cdHByaXZhdGUgbWVhc3VyZVdpZHRoKCB0ZXh0LCBmb250LCBvdmVyd3JpdGVzOiBhbnkgPSB7fSApOiBudW1iZXIge1xyXG5cclxuXHRcdHZhciBsZXR0ZXJTcGFjaW5nID0gb3ZlcndyaXRlcy5sZXR0ZXJTcGFjaW5nIHx8IDA7XHJcblx0XHR2YXIgd29yZFNwYWNpbmcgPSBvdmVyd3JpdGVzLndvcmRTcGFjaW5nIHx8IDA7XHJcblx0XHR2YXIgYWRkU3BhY2luZyA9IGFkZFdvcmRBbmRMZXR0ZXJTcGFjaW5nKCB3b3JkU3BhY2luZywgbGV0dGVyU3BhY2luZyApO1xyXG5cclxuXHRcdHZhciBjdHggPSB0aGlzLmdldENvbnRleHQyZCggZm9udCApO1xyXG5cclxuXHRcdHJldHVybiBjdHgubWVhc3VyZVRleHQoIHRleHQgKS53aWR0aCArIGFkZFNwYWNpbmcoIHRleHQgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldCBjYW52YXMgZWxlbWVudCB0byBtZWFzdXJlIHRleHQgd2l0aFxyXG5cdCAqL1xyXG5cdHByaXZhdGUgZ2V0Q29udGV4dDJkKCBmb250ICk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB7XHJcblxyXG5cdFx0aWYgKCB0aGlzLmNhbnZhc0NvbnRleHQgKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmNhbnZhc0NvbnRleHQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGN0eDogYW55ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2NhbnZhcycgKS5nZXRDb250ZXh0KCAnMmQnICk7XHJcblx0XHRcdHZhciBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xyXG5cdFx0XHR2YXIgYnNyID0gY3R4LndlYmtpdEJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcclxuXHRcdFx0XHRjdHgubW96QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxyXG5cdFx0XHRcdGN0eC5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcclxuXHRcdFx0XHRjdHgub0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcclxuXHRcdFx0XHRjdHguYmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fCAxO1xyXG5cdFx0XHRjdHguZm9udCA9IGZvbnQ7XHJcblx0XHRcdGN0eC5zZXRUcmFuc2Zvcm0oIGRwciAvIGJzciwgMCwgMCwgZHByIC8gYnNyLCAwLCAwICk7XHJcblxyXG5cdFx0XHR0aGlzLmNhbnZhc0NvbnRleHQgPSBjdHg7XHJcblxyXG5cdFx0XHRyZXR1cm4gY3R4O1xyXG5cdFx0fSBjYXRjaCAoIGVyciApIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCAnQ2FudmFzIHN1cHBvcnQgcmVxdWlyZWQnICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0cHVibGljIG9wZW4oKTogdm9pZCB7XHJcblx0XHR0aGlzLmNsb3NlU3ViTWVudXMoKTtcclxuXHRcdHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnb3BlbicgKTtcclxuXHRcdGh0bWxDbGFzc2VzLmFkZCggJ25hdi1vcGVuJyApO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGNsb3NlKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdvcGVuJyApO1xyXG5cdFx0aHRtbENsYXNzZXMucmVtb3ZlKCAnbmF2LW9wZW4nICk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgY2xvc2VTdWJNZW51cygpOiB2b2lkIHtcclxuXHRcdGxldCBvcGVuRWxlbWVudHMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5vcGVuJyApO1xyXG5cdFx0dmFyIGkgPSAwLCBsZW4gPSBvcGVuRWxlbWVudHMubGVuZ3RoO1xyXG5cdFx0Zm9yICggaTsgaSA8IGxlbjsgaSsrICkge1xyXG5cdFx0XHR2YXIgaXRlbSA9IG9wZW5FbGVtZW50c1sgaSBdO1xyXG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoICdvcGVuJyApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIG9wZW5TZWFyY2goKTogdm9pZCB7XHJcblx0XHR0aGlzLmNsb3NlU3ViTWVudXMoKTtcclxuXHRcdHRoaXMuc2VhcmNoQXJlYS5jbGFzc0xpc3QuYWRkKCAnb3BlbicgKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBjbG9zZVNlYXJjaCgpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLnNlYXJjaEFyZWEuY2xhc3NMaXN0LnJlbW92ZSggJ29wZW4nICk7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmVtb3ZlIGxpc3RlbmVyc1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xyXG5cclxuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAncmVzaXplJywgdGhpcy5fYm91bmRSZXNpemVGdW5jdGlvbiApO1xyXG5cclxuXHRcdHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnY2xpY2snLCB0aGlzLl9ib3VuZENsaWNrRnVuY3Rpb24gKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlc2l6ZSBmdW5jdGlvblxyXG5cdCAqL1xyXG5cdHB1YmxpYyBjaGVjaygpOiB2b2lkIHtcclxuXHJcblx0XHQvLyBleHRyYWN0IHRoZSBzdXBwb3J0ZWQgdmFsdWVzXHJcblx0XHR2YXIgcmVzZXJ2ZWRXaWR0aCA9IE1FTlVfUkVTRVJWRURfV0lEVEgsXHJcblx0XHRcdG1pbkl0ZW1TaXplID0gSVRFTV9TSVpFLFxyXG5cdFx0XHR0b29sQmFySWNvbldpZHRoID0gSVRFTV9TSVpFLFxyXG5cdFx0XHRmb250U2l6ZSA9IElURU1fRk9OVF9TSVpFICsgXCJweFwiXHJcblxyXG5cdFx0Ly8gYXZhaWxhYmxlIHdpZHRoIHRoZSBtZW51IGhhcyB0byBleHBhbmQgdG9cclxuXHRcdHZhciBhdmFpbFdpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHJlc2VydmVkV2lkdGg7XHJcblxyXG5cclxuXHRcdC8vIHdpZHRoIG5lZWRlZCBieSB0aGUgbWVudVxyXG5cdFx0dmFyIGNvbGxhcHNlZFdpZHRoTmVlZGVkID0gdGhpcy5nZXRDb2xsYXBzZWRNZW51V2lkdGgoIHtcclxuXHRcdFx0Zm9udDogXCI2MDAgXCIgKyBmb250U2l6ZSArIFwiIENlbnR1cnkgR290aGljXCIsXHJcblx0XHRcdGxldHRlclNwYWNpbmc6IFwiMC4wNWVtXCIsXHJcblx0XHRcdGl0ZW1QYWRkaW5nOiBJVEVNX01JTl9QQURESU5HICogMixcclxuXHRcdFx0bWluSXRlbVdpZHRoOiBtaW5JdGVtU2l6ZVxyXG5cdFx0fSApO1xyXG5cclxuXHRcdC8vIHdpZHRoIG5lZWRlZCBmb3IgdG9vbGJhciBpY29uIHZpZXdcclxuXHRcdHZhciBtaW5XaWR0aE5lZWRlZCA9IHRoaXMudG9vbEJhci5jaGlsZHJlbi5sZW5ndGggKiB0b29sQmFySWNvbldpZHRoO1xyXG5cclxuXHRcdC8vIG5ldyBzdGF0ZSB0byBjaGFuZ2UgaW50b1xyXG5cdFx0dmFyIG5ld1N0YXRlO1xyXG5cclxuXHRcdC8qY29uc29sZS5pbmZvKFxyXG5cdFx0XHRcImF2YWlsYWJsZSB3aWR0aDogXCIgKyBhdmFpbFdpZHRoICsgXCJcXG5cIlxyXG5cdFx0XHQrIFwibmVlZCBmb3IgY29sbGFwc2VkOiBcIiArIGNvbGxhcHNlZFdpZHRoTmVlZGVkICsgXCJcXG5cIlxyXG5cdFx0XHQrIFwibmVlZCBmb3IgdG9vbGJhcjogXCIgKyBtaW5XaWR0aE5lZWRlZFxyXG5cdFx0KTsqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ2hlY2sgY29uZGl0aW9ucyBmb3IgY29sbGFwc2luZ1xyXG5cdFx0ICovXHJcblxyXG5cdFx0aWYgKCBhdmFpbFdpZHRoIDwgbWluV2lkdGhOZWVkZWQgKSB7XHJcblxyXG5cdFx0XHRuZXdTdGF0ZSA9ICdtaW5pZmllZCc7XHJcblxyXG5cdFx0fSBlbHNlIGlmICggYXZhaWxXaWR0aCA8IGNvbGxhcHNlZFdpZHRoTmVlZGVkICkge1xyXG5cclxuXHRcdFx0bmV3U3RhdGUgPSAnY29sbGFwc2VkJztcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0bmV3U3RhdGUgPSAnJztcclxuXHRcdFx0Ly8gc2V0IGFueSBleHRyYSBpdGVtIHBhZGRpbmcgYXZhaWxhYmxlXHJcblx0XHRcdHRoaXMuc2V0RXh0cmFJdGVtUGFkZGluZygpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHRoaXMuc3RhdGUgIT09IG5ld1N0YXRlICkge1xyXG5cclxuXHRcdFx0aWYgKCBuZXdTdGF0ZSA9PT0gJ21pbmlmaWVkJyB8fCBuZXdTdGF0ZSA9PT0gJ2NvbGxhcHNlZCcgKSB7XHJcblxyXG5cdFx0XHRcdGh0bWxDbGFzc2VzLmFkZCggJ25hdi1jb2xsYXBzZWQnICk7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoICdjb2xsYXBzZWQnICk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG5ld1N0YXRlID09PSAnJyApIHtcclxuXHJcblx0XHRcdFx0aHRtbENsYXNzZXMucmVtb3ZlKCAnbmF2LW1pbmlmaWVkJyApO1xyXG5cdFx0XHRcdGh0bWxDbGFzc2VzLnJlbW92ZSggJ25hdi1jb2xsYXBzZWQnICk7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdtaW5pZmllZCcgKTtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2NvbGxhcHNlZCcgKTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG5ld1N0YXRlID09PSAnbWluaWZpZWQnICkge1xyXG5cclxuXHRcdFx0XHRodG1sQ2xhc3Nlcy5hZGQoICduYXYtbWluaWZpZWQnICk7XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoICdtaW5pZmllZCcgKTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG5ld1N0YXRlID09PSAnY29sbGFwc2VkJyAmJiB0aGlzLnN0YXRlID09PSAnbWluaWZpZWQnICkge1xyXG5cclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ21pbmlmaWVkJyApO1xyXG5cdFx0XHRcdGh0bWxDbGFzc2VzLnJlbW92ZSggJ25hdi1taW5pZmllZCcgKTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIHRoaXMuc3RhdGUgPT09ICdjb2xsYXBzZWQnICkge1xyXG5cclxuXHRcdFx0XHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2NvbGxhcHNlZCcgKTtcclxuXHRcdFx0XHRodG1sQ2xhc3Nlcy5yZW1vdmUoICduYXYtY29sbGFwc2VkJyApO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdHRoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBTZXQgZXh0cmEgaXRlbSBwYWRkaW5nXHJcblx0ICovXHJcblx0cHJpdmF0ZSBzZXRFeHRyYUl0ZW1QYWRkaW5nKCk6IHZvaWQge1xyXG5cclxuXHRcdC8vIGF2YWlsYWJsZSB3aWR0aCB0aGUgbWVudSBoYXMgdG8gZXhwYW5kIHRvXHJcblx0XHR2YXIgYXZhaWxXaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSBNRU5VX1JFU0VSVkVEX1dJRFRIO1xyXG5cclxuXHRcdGxldCBjaGlsZHJlblRvUGFkOiBBcnJheTxIVE1MRWxlbWVudD4gPSBbXTtcclxuXHRcdGxldCBpOiBudW1iZXIgPSAwO1xyXG5cdFx0Zm9yICggaTsgaSA8IHRoaXMubWVudUNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDsgaSsrICkge1xyXG5cdFx0XHRsZXQgZWw6IEhUTUxFbGVtZW50ID0gdGhpcy5tZW51Q29udGFpbmVyLmNoaWxkcmVuWyBpIF0gYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHRcdGlmICggIWVsLmhhc0F0dHJpYnV0ZSggJ21lbnUtaWNvbicgKSAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCAnbWVudS1pY29uLXdpZHRoJyApICkge1xyXG5cdFx0XHRcdGNoaWxkcmVuVG9QYWQucHVzaCggZWwgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhdmFpbFdpZHRoIC09IElURU1fU0laRTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG1pbiB3aWR0aCB3aXRoIG5vIHBhZGRpbmcsIGV4Y2x1ZGluZyBpY29uc1xyXG5cdFx0bGV0IG1pbldpZHRoTmVlZGVkOiBudW1iZXIgPSB0aGlzLmdldENvbGxhcHNlZE1lbnVXaWR0aCgge1xyXG5cdFx0XHRmb250OiBcIjYwMCBcIiArIElURU1fRk9OVF9TSVpFICsgXCJweFwiICsgXCIgQ2VudHVyeSBHb3RoaWNcIixcclxuXHRcdFx0bGV0dGVyU3BhY2luZzogXCIwLjA1ZW1cIixcclxuXHRcdFx0aXRlbVBhZGRpbmc6IDAsXHJcblx0XHRcdG1pbkl0ZW1XaWR0aDogMCxcclxuXHRcdFx0ZXhjbHVkZUljb25zOiB0cnVlXHJcblx0XHR9ICk7XHJcblxyXG5cclxuXHRcdC8vIHNwYWNlIGF2YWlsYWJsZSB0byBkaXN0cmlidXRlIHRvIHBhZGRpbmdcclxuXHRcdGxldCBwYWRkaW5nVG9EaXN0cmlidXRlOiBudW1iZXIgPSBhdmFpbFdpZHRoIC0gbWluV2lkdGhOZWVkZWQ7XHJcblxyXG5cdFx0Ly8gaXRlbSBwYWRkaW5nXHJcblx0XHRsZXQgZXh0cmFJdGVtUGFkZGluZzogbnVtYmVyID0gcGFkZGluZ1RvRGlzdHJpYnV0ZSAvICggY2hpbGRyZW5Ub1BhZC5sZW5ndGggKiAyICk7XHJcblxyXG5cdFx0Ly8gZW5zdXJlIG1heC9taW5cclxuXHRcdGlmICggZXh0cmFJdGVtUGFkZGluZyA+IElURU1fTUFYX1BBRERJTkcgKSB7XHJcblx0XHRcdGV4dHJhSXRlbVBhZGRpbmcgPSBJVEVNX01BWF9QQURESU5HO1xyXG5cdFx0fSBlbHNlIGlmICggZXh0cmFJdGVtUGFkZGluZyA8IElURU1fTUlOX1BBRERJTkcgKSB7XHJcblx0XHRcdGV4dHJhSXRlbVBhZGRpbmcgPSBJVEVNX01JTl9QQURESU5HO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qY29uc29sZS5pbmZvKFxyXG5cdFx0XHRcIm1pbldpZHRoTmVlZGVkOiBcIiArIG1pbldpZHRoTmVlZGVkICsgXCJcXG5cIlxyXG5cdFx0XHQrIFwiYXZhaWxXaWR0aDogXCIgKyBhdmFpbFdpZHRoICsgXCJcXG5cIlxyXG5cdFx0XHQrIFwid2lsbCBkaXN0cmlidXRlOiBcIiArIHBhZGRpbmdUb0Rpc3RyaWJ1dGUgKyBcIlxcblwiXHJcblx0XHRcdCsgXCJ0byBcIiArIGNoaWxkcmVuVG9QYWQubGVuZ3RoICsgXCIgZWFjaDogXCIgKyBleHRyYUl0ZW1QYWRkaW5nICsgXCJcXG5cIlxyXG5cdFx0KTsqL1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU2V0IHBhZGRpbmcgb24gdGhlIG1lbnUgZWxlbWVudHNcclxuXHRcdCAqL1xyXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBjaGlsZHJlblRvUGFkLmxlbmd0aDsgaSsrICkge1xyXG5cdFx0XHRsZXQgZWw6IEhUTUxFbGVtZW50ID0gY2hpbGRyZW5Ub1BhZFsgaSBdIGFzIEhUTUxFbGVtZW50O1xyXG5cdFx0XHRpZiAoICFlbC5maXJzdEVsZW1lbnRDaGlsZCApIHtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgbGluazogSFRNTEVsZW1lbnQgPSBlbC5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxuXHRcdFx0bGluay5zdHlsZS5wYWRkaW5nTGVmdCA9IGV4dHJhSXRlbVBhZGRpbmcgKyBcInB4XCI7XHJcblx0XHRcdGxpbmsuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZXh0cmFJdGVtUGFkZGluZyArIFwicHhcIjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59XHJcblxyXG4vKipcclxuICpcclxuICogXHRIZWxwZXIgZnVuY3Rpb25zXHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcbi8qKlxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gbWVyZ2UoIG9iaiwgZGVmYXVsdFByb3BzICkge1xyXG5cdGZvciAoIGxldCBwcm9wIGluIGRlZmF1bHRQcm9wcyApIHtcclxuXHRcdGlmICggIW9iai5oYXNPd25Qcm9wZXJ0eSggcHJvcCApICkge1xyXG5cdFx0XHRvYmpbIHByb3AgXSA9IGRlZmF1bHRQcm9wc1sgcHJvcCBdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gb2JqO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEdldCBwcm9wZXJ0eSBmcm9tIHNyY1xyXG4qL1xyXG5mdW5jdGlvbiBwcm9wKCBzcmMsIGF0dHIsIGRlZmF1bHRWYWx1ZSApIHtcclxuXHRyZXR1cm4gKCBzcmMgJiYgdHlwZW9mIHNyY1sgYXR0ciBdICE9PSAndW5kZWZpbmVkJyAmJiBzcmNbIGF0dHIgXSApIHx8IGRlZmF1bHRWYWx1ZTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBXZSBvbmx5IHN1cHBvcnQgcmVtL2VtL3B0IGNvbnZlcnNpb25cclxuICovXHJcbmZ1bmN0aW9uIHB4VmFsdWUoIHZhbCwgb3B0aW9ucyA9IHt9ICkge1xyXG5cdHZhciBiYXNlRm9udFNpemUgPSBwYXJzZUludCggcHJvcCggb3B0aW9ucywgJ2Jhc2UtZm9udC1zaXplJywgMTYgKSwgMTAgKTtcclxuXHJcblx0dmFyIHZhbHVlID0gcGFyc2VGbG9hdCggdmFsICk7XHJcblx0dmFyIHVuaXQgPSB2YWwucmVwbGFjZSggdmFsdWUsICcnICk7XHJcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlZmF1bHQtY2FzZVxyXG5cdHN3aXRjaCAoIHVuaXQgKSB7XHJcblx0XHRjYXNlICdyZW0nOlxyXG5cdFx0Y2FzZSAnZW0nOlxyXG5cdFx0XHRyZXR1cm4gdmFsdWUgKiBiYXNlRm9udFNpemU7XHJcblx0XHRjYXNlICdwdCc6XHJcblx0XHRcdHJldHVybiB2YWx1ZSAvICggOTYgLyA3MiApO1xyXG5cdFx0Y2FzZSAncHgnOlxyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fVxyXG5cclxuXHR0aHJvdyBuZXcgRXJyb3IoIGBUaGUgdW5pdCAkeyB1bml0IH0gaXMgbm90IHN1cHBvcnRlZGAgKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBBZGQgY3VzdG9tIGxldHRlciBhbmQgd29yZCBzcGFjaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGRXb3JkQW5kTGV0dGVyU3BhY2luZyggd3MsIGxzICkge1xyXG5cclxuXHRsZXQgd29yZEFkZG9uID0gMDtcclxuXHRpZiAoIHdzICkge1xyXG5cdFx0d29yZEFkZG9uID0gcHhWYWx1ZSggd3MgKTtcclxuXHR9XHJcblxyXG5cdGxldCBsZXR0ZXJBZGRvbiA9IDA7XHJcblx0aWYgKCBscyApIHtcclxuXHRcdGxldHRlckFkZG9uID0gcHhWYWx1ZSggbHMgKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBmdW5jdGlvbiAoIHRleHQgKSB7XHJcblx0XHR2YXIgd29yZHMgPSB0ZXh0LnRyaW0oKS5yZXBsYWNlKCAvXFxzKy9naSwgJyAnICkuc3BsaXQoICcgJyApLmxlbmd0aCAtIDE7XHJcblx0XHR2YXIgY2hhcnMgPSB0ZXh0Lmxlbmd0aDtcclxuXHJcblx0XHRyZXR1cm4gKCB3b3JkcyAqIHdvcmRBZGRvbiApICsgKCBjaGFycyAqIGxldHRlckFkZG9uICk7XHJcblx0fTtcclxufVxyXG5cclxuZXhwb3J0IHtcclxuXHRBbHBoYUhlYWRlclxyXG59XHJcbiIsImltcG9ydCB7XHJcblx0Q29tcG9uZW50LFxyXG5cdElucHV0LFxyXG5cdFZpZXdFbmNhcHN1bGF0aW9uLFxyXG5cdEFmdGVyVmlld0luaXQsXHJcblx0T25EZXN0cm95LFxyXG5cdEVsZW1lbnRSZWYsXHJcblx0SG9zdExpc3RlbmVyXHJcblxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtcclxuXHRSb3V0ZXIsXHJcblx0TmF2aWdhdGlvblN0YXJ0XHJcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuXHJcbmltcG9ydCB7IEFscGhhSGVhZGVyIH0gZnJvbSAnLi91dGlsL21lbnUtY29tcG9uZW50JztcclxuXHJcblxyXG5AQ29tcG9uZW50KCB7XHJcblx0c2VsZWN0b3I6ICdhbHBoYS1nbG9iYWwtaGVhZGVyJyxcclxuXHR0ZW1wbGF0ZTogYFxyXG5cdDxhICpuZ0lmPVwiaG9tZVwiIGNsYXNzPVwicXVlc3Rpb24tbWFyayBhZ2gtaWNvbi1sb2dvXCIgaWQ9XCJtb2JpbGVMb2dvXCIgKGNsaWNrKT1cIm9uSG9tZUNsaWNrKCRldmVudClcIiBbdGFyZ2V0XT1cImhvbWVUYXJnZXRcIj48L2E+XHJcblxyXG5cdDxkaXYgY2xhc3M9XCJtZW51LWNvbnRhaW5lclwiPlxyXG5cclxuXHRcdDxkaXYgKm5nSWY9XCJob21lXCIgY2xhc3M9XCJiZWZvcmUtbWVudVwiPlxyXG5cdFx0XHQ8YSBjbGFzcz1cInF1ZXN0aW9uLW1hcmsgYWdoLWljb24tbG9nb1wiIChjbGljayk9XCJvbkhvbWVDbGljaygkZXZlbnQpXCIgW3RhcmdldF09XCJob21lVGFyZ2V0XCI+PC9hPlxyXG5cdFx0PC9kaXY+XHJcblxyXG5cdFx0PGRpdiBjbGFzcz1cIm1lbnUtYXJlYVwiPlxyXG5cclxuXHRcdFx0PHVsIG1lbnUtY29udGFpbmVyIGNsYXNzPVwibWFpbi1tZW51XCI+XHJcblxyXG5cdFx0XHRcdDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuXHJcblx0XHRcdDwvdWw+XHJcblxyXG5cdFx0PC9kaXY+XHJcblxyXG5cdDwvZGl2PlxyXG5cclxuICBcdGAsXHJcblx0c3R5bGVVcmxzOiBbICcuLi8uLi8uLi9hc3NldHMvbGVzcy9zdHlsZXMvaGVhZGVyLmxlc3MnIF0sXHJcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59IClcclxuZXhwb3J0IGNsYXNzIEFscGhhR2xvYmFsSGVhZGVyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuXHJcblx0cHVibGljIGhlYWRlcjogQWxwaGFIZWFkZXI7XHJcblxyXG5cdEBJbnB1dCggJ2hvbWUnICkgaG9tZTogQXJyYXk8c3RyaW5nPjtcclxuXHRASW5wdXQoICdob21lVGFyZ2V0JyApIGhvbWVUYXJnZXQ6IHN0cmluZyA9ICdfc2VsZic7XHJcblx0QElucHV0KCAnc2VhcmNoJyApIHNlYXJjaDogYm9vbGVhbjtcclxuXHRASW5wdXQoICdzZWFyY2gtYWN0aW9uJyApIHNlYXJjaEFjdGlvbjogc3RyaW5nO1xyXG5cdEBJbnB1dCggJ2xhbmd1YWdlcycgKSBsYW5ndWFnZXM6IEFycmF5PGFueT4gPSBbXTtcclxuXHJcblx0LyoqXHJcblx0ICogQ2xvc2UgbWVudSB3aGVuIGNsaWNraW5nIG9uIHNlbGYgbGlua1xyXG5cdCAqXHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICovXHJcblx0QEhvc3RMaXN0ZW5lciggJ2NsaWNrJywgWyAnJGV2ZW50JyBdICkgb25DbGljayggZXZlbnQgKSB7XHJcblxyXG5cdFx0Y29uc3QgdGFyZzogSFRNTEVsZW1lbnQgPSBldmVudC50YXJnZXQsXHJcblx0XHRcdGlzUm91dGVyTGluazogYm9vbGVhbiA9IHRhcmcuaGFzQXR0cmlidXRlKCAnaHJlZicgKTtcclxuXHJcblx0XHRpZiAoIGlzUm91dGVyTGluayApIHtcclxuXHRcdFx0Ly8gY2xvc2UgdGhlIG5hdiAoc2hvdWxkIGNsb3NlIGJ5IGl0c2VsZiBidXQgd2hlbiBjbGlja2luZyBvbiBvd24gaXRlbXMgbm8gbmF2aWdhdGlvbiBvY2N1cnMpXHJcblx0XHRcdHRoaXMuaGVhZGVyLmNsb3NlKCk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKFxyXG5cdFx0cHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZixcclxuXHRcdHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcclxuXHQpIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIExpc3RlbiB0byBuYXZpZ2F0aW9uIGV2ZW50c1xyXG5cdFx0ICogVG9vbGJhciBpdGVtcyB0aGF0IGdldCBtb3ZlZCBhcm91bmQgbG9zZSB0aGVpciBhYmlsaXR5IHRvIGhhdmUgdGhlaXIgY2xhc3NlcyBhZGRlZCAvIHJlbW92ZWQgYnkgYW5ndWxhclxyXG5cdFx0ICovXHJcblx0XHR0aGlzLnJvdXRlci5ldmVudHMuc3Vic2NyaWJlKCBldmVudCA9PiB7XHJcblxyXG5cdFx0XHRpZiAoICF0aGlzLmhlYWRlciApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQgKSB7XHJcblxyXG5cdFx0XHRcdC8vIGNsb3NlIGFueSBvcGVuIG5hdlxyXG5cdFx0XHRcdHRoaXMuaGVhZGVyLmNsb3NlKCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSApXHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQWZ0ZXIgdmlldyBhbmQgY29udGVudCBoYXMgYmVlbiByZW5kZXJlZCwgY2hlY2sgdGhlIG1lbnUgd2lkdGhzXHJcblx0ICovXHJcblx0cHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuXHJcblx0XHQvLyB1c2Ugb3VyIGNvbW1vbiBtZW51IHNpemluZyBsaWJcclxuXHRcdHRoaXMuaGVhZGVyID0gbmV3IEFscGhhSGVhZGVyKCB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsIHtcclxuXHJcblx0XHRcdHNlYXJjaDogdGhpcy5zZWFyY2ggPyB7IGFjdGlvbjogdGhpcy5zZWFyY2hBY3Rpb24gfSA6IGZhbHNlLFxyXG5cdFx0XHRsYW5ndWFnZXM6IHRoaXMubGFuZ3VhZ2VzLFxyXG5cdFx0XHRjbG9zZVN1Yk1lbnVzT25DbGljazogdHJ1ZVxyXG5cclxuXHRcdH0gKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBvbiBjbGljayBvZiB0aGUgaG9tZSBsaW5rIGVpdGhlciB1c2UgdGhlIHJvdXRlciwgb3IgYWxsb3cgdG8gb3BlbiBpbiBuZXcgdGFiXHJcblx0ICogQHBhcmFtIGV2ZW50XHJcblx0ICovXHJcblx0cHVibGljIG9uSG9tZUNsaWNrKCBldmVudDogTW91c2VFdmVudCApIHtcclxuXHJcblx0XHRpZiAoIHRoaXMuaG9tZSBpbnN0YW5jZW9mIEFycmF5ICkge1xyXG5cclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdHRoaXMucm91dGVyLm5hdmlnYXRlKCB0aGlzLmhvbWUgKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zdCBsaW5rOiBIVE1MRWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcclxuXHRcdFx0bGluay5zZXRBdHRyaWJ1dGUoICdocmVmJywgdGhpcy5ob21lICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDbGVhbnVwIG9uIGRlc3Ryb3lcclxuXHQgKi9cclxuXHRwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5oZWFkZXIuZGVzdHJveSgpO1xyXG5cdH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgQWxwaGFHbG9iYWxIZWFkZXIgfSBmcm9tICcuL2FscGhhLWdsb2JhbC1oZWFkZXIuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSgge1xyXG5cdGRlY2xhcmF0aW9uczogW1xyXG5cdFx0QWxwaGFHbG9iYWxIZWFkZXJcclxuXHRdLFxyXG5cdGV4cG9ydHM6IFtcclxuXHRcdEFscGhhR2xvYmFsSGVhZGVyLFxyXG5cdF0sXHJcblx0aW1wb3J0czogW1xyXG5cdFx0Q29tbW9uTW9kdWxlLFxyXG5cdF1cclxuXHJcbn0gKVxyXG5leHBvcnQgY2xhc3MgQWxwaGFHbG9iYWxIZWFkZXJNb2R1bGUgeyB9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBRU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsU0FBUzs7SUFHaEQsU0FBUyxHQUFHLEVBQUU7O0lBQ2QsZ0JBQWdCLEdBQUcsRUFBRTs7SUFDckIsZ0JBQWdCLEdBQUcsRUFBRTs7SUFDckIsY0FBYyxHQUFHLEVBQUU7O0lBQ25CLG1CQUFtQixHQUFHLEVBQUU7Ozs7O0FBSzlCOzs7Ozs7SUEyQkMscUJBQ1EsT0FBTyxFQUNkLE9BQU87UUFGUixpQkE2Q0M7UUE1Q08sWUFBTyxHQUFQLE9BQU8sQ0FBQTtRQWxCUixhQUFRLEdBQVE7WUFDdEIsV0FBVyxFQUFFLEVBQUU7WUFDZixRQUFRLEVBQUUsTUFBTTtZQUNoQixhQUFhLEVBQUUsRUFBRTtZQUNqQixXQUFXLEVBQUUsRUFBRTs7WUFDZixtQkFBbUIsRUFBRSxnQkFBZ0I7WUFDckMsb0JBQW9CLEVBQUUsS0FBSztZ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