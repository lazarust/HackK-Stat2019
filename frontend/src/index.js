import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
var BlockSearch = (function($) {

    'use strict';

    var UP_ARROW = 38,
        DOWN_ARROW = 40,
        ENTER_KEY = 13,
        TAB_KEY = 9,
        BACKSPACE_KEY = 8,
        ESC_KEY = 27;

    String.prototype.fuzzy_search = function(needle) {
        var hay = this.toLowerCase(),
            needle_length = needle.length,
            last_index_found = 0,
            rank = 0;

        needle = needle.toLowerCase();
        for (var i = 0; i <= needle_length - 1; i++) {
            var chr = needle[i],
                last_chr = needle[i - 1],
                previous_index_found = last_index_found;

            last_index_found = hay.indexOf(chr, last_index_found);

            if (last_index_found === -1) {
                return false;
            } else {

                rank++;

                // Give more points if the char is the first letter in the word
                if (last_index_found === 0 || last_chr === ' ') {
                    rank = rank + 5;

                // Give one more point if the letters found are in succession
                } else if (last_index_found - 1 === previous_index_found) {
                    rank++;
                }

            }

            last_index_found++;

        }
        return rank;

    };

    var OrgSearch = function(options) {


        var default_options = {
            $list: '', // The jQuery object for the list you're searching
            $search_input: '', // The jQuery object for the search input
            selected_elem_class: 'active', // The name of the class to use for the select elem
            source_node: '', // The selector for the child node that has the text
            $no_results_elem: '', // The jQuery object that has the no results message
            num_chars_to_start_search: 2, // Only show the list once the user has typed this number of charters in the search field
            num_items_to_hide_initial_list: 20, // Only hide the initial list if it's greater than this number
        };

        new SetModuleOptions(this, default_options, options, ['$list', '$search_input', 'source_node', '$no_results_elem']);

        this.$remove_btn = this.$search_input.parent('.has-feedback').find('.remove-btn');

        this.init();

    };

    BlockSearch.prototype = {

        init: function() {

            var self = this;

            self.orig_list = [];
            self.ranked_list = [];
            self.$list_container = self.$list.parent();
            self.$list.each(function() {
                var $el = $(this);
                self.orig_list.push({rank: 0, $el: $el});
            });

            self.hide_initial_list = true;
            if (self.$list.length <= self.num_items_to_hide_initial_list) {
                self.hide_initial_list = false;
                self.$list.show();
            }
            if (self.hide_initial_list === true) {
                self.$search_input.attr('placeholder', 'Type at least 2 characters to start your search ...');
            }

            self.$search_input.on('focus', function() {
               self.$remove_btn.show();
            });

            self.$remove_btn.on('click', function() {
                self.clear_search();
            });

            self.$search_input.on('keyup', function(e) {

                if (e.which !== UP_ARROW && e.which !== DOWN_ARROW && e.which !== TAB_KEY && e.which !== ENTER_KEY) {

                   var search_text = self.$search_input.val().toLowerCase();
                   if (search_text.length >= self.num_chars_to_start_search || self.hide_initial_list === false) {
                       self.search(search_text);
                   } else if (search_text.length <= self.num_chars_to_start_search && self.hide_initial_list === true && (e.which === BACKSPACE_KEY || e.which === ESC_KEY)) {
                       self.clear_search();
                   }

                }

            });

            self.$search_input.on('blur', function() {

                // wrapped in a timeout so you can click on the links
                setTimeout(function() {
                    self.clear_search();
                    self.$search_input.val('');
                }, 200);

            });

            self.$search_input.on('keydown', function(e) {

                var $visible_items = self.$list.filter(':visible'),
                    $selected_item = self.$list.filter('.' + self.selected_elem_class),
                    selected_index = $visible_items.index($selected_item),
                    last_item_index = $visible_items.length - 1,
                    $new_selected_item = '';

                if ($visible_items.length > 0) {

                    if (e.which === TAB_KEY) {
                        e.preventDefault();
                    }

                    if (e.which === UP_ARROW || (e.which === TAB_KEY && e.shiftKey === true)) {

                        if (selected_index === 0 || selected_index === -1) {
                            $new_selected_item = $visible_items.eq(last_item_index);
                        } else {
                            $new_selected_item = $visible_items.eq(selected_index - 1);
                        }

                    } else if (e.which === DOWN_ARROW || (e.which === TAB_KEY && e.shiftKey === false)) {

                        if (selected_index === last_item_index || selected_index === -1) {
                            $new_selected_item = $visible_items.eq(0);
                        } else {
                            $new_selected_item = $visible_items.eq(selected_index + 1);
                        }

                    }

                    if ($new_selected_item.length === 1) {
                        $selected_item.removeClass(self.selected_elem_class);
                        $new_selected_item.addClass(self.selected_elem_class);
                    }
                }



            });

            self.$search_input.on('keypress', function(e) {

                if (e.which === ENTER_KEY) {

                    var $selected_item = self.$list.filter('.' + self.selected_elem_class);

                    if ($selected_item.length === 1) {
                        $selected_item.focus();
                        window.location = $selected_item.attr('href');
                    }
                }

            });

            self.$search_input.focus();

        },

        build_list: function() {

            var self = this;

            self.$list_container.empty();
            self.ranked_list.sort(function(a, b) {
                return  b.rank - a.rank;
            });

            $.each(self.ranked_list, function(i, item) {
                item.$el.show().css('display', 'block');
                self.$list_container.append(item.$el);
            });

        },

        clear_search: function() {

            var self = this;
            if (self.hide_initial_list === true) {
                self.$list.removeClass(self.selected_elem_class).hide();
            } else {
                self.$list.removeClass(self.selected_elem_class).show();
            }
            self.$remove_btn.hide();

        },

        select_first_item: function() {
            var self = this,
                $first_elem = self.$list.find(':visible').first().parent();

            self.$list.removeClass(self.selected_elem_class);

            if ($first_elem.length === 1) {
                self.$no_results_elem.hide();
                $first_elem.addClass(self.selected_elem_class);
            } else {
                self.$no_results_elem.show();
            }

        },

        search: function(search_text) {

            var self = this;

            self.ranked_list = [];
            $.each(self.orig_list, function(i, item) {

                var $source_node = item.$el.find(self.source_node),
                    rank;

                rank = $source_node.text().fuzzy_search(search_text);
                if (rank !== false) {
                   self.ranked_list.push({rank: rank, $el: item.$el});
                }

            });
            self.build_list();
            self.select_first_item();
        }

    };

    return BlockSearch;

})(jQuery);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
