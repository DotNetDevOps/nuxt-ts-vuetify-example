import Vue from 'vue'
import Editor from '../components/editor';

import MediumEditor from 'medium-editor';
import Turndown from "turndown";

import VueUploadComponent from 'vue-upload-component';

Vue.component('file-upload', VueUploadComponent);

var td = new Turndown();
export var MediumEditorMultiPlaceholders = MediumEditor.Extension.extend({
    name: 'multi_placeholder',
    init: function () {
        this.placeholderElements = [];
        this.initPlaceholders(this.placeholders, this.placeholderElements);
        this.watchChanges();
    },

    initPlaceholders: function ( placeholders, elements) {
        this.getEditorElements().forEach(function (this: any,editor) {
            this.placeholders.map(function (this: any,placeholder) {
                // Create the placeholder element
                var el = document.createElement(placeholder.tag);
                el.appendChild(document.createElement('br'));
                el.setAttribute('data-placeholder', placeholder.text);
                elements.push(el);
                // Append it to Medium Editor element
                editor.appendChild(el);
                this.updatePlaceholder(el);
            }, this);
        }, this);
    },

    destroy: function () {
        this.getEditorElements().forEach(function (this: any,editor) {
            editor.querySelectorAll('[data-placeholder]').map(function (el) {
                el.removeAttribute('data-placeholder');
            }, this);
        }, this);
    },

    showPlaceholder: function (el) {
        if (el) {
            el.classList.add('medium-editor-placeholder');
        }
    },

    hidePlaceholder: function (el) {
        if (el) {
            el.classList.remove('medium-editor-placeholder');
        }
    },

    updatePlaceholder: function (el) {
        if (el.textContent === '') {
            return this.showPlaceholder(el);
        }
        this.hidePlaceholder(el);
    },

    updateAllPlaceholders: function (evt, el: HTMLElement | undefined) {
        console.log(arguments);
        
        this.placeholderElements.map(function (this: any,el) {
            this.updatePlaceholder(el);
        }, this);

        if (el) {
            console.log(el.children)
            if (el.children.length === 3) {
                if (el.children[2].classList.contains("medium-editor-placeholder") && !el.children[1].classList.contains("medium-editor-placeholder")) {
                    el.children[1].remove();
                }



            }
            console.log(el.children.length);
            if (el.children.length > 2) {
                for (let j = 1; j < el.children.length; j++) {
                    if (el.children[j].classList.contains("medium-editor-placeholder")) {
                        this.hidePlaceholder(el.children[j]);
                    }
                }
            }

            console.log(td.turndown(el));
        }
    },

    watchChanges: function () {
        console.log(this);
        this.subscribe('editableInput', this.updateAllPlaceholders.bind(this));
        this.subscribe('externalInteraction', this.updateAllPlaceholders.bind(this));
    }
});

Vue.component('editor', Editor)
