import Vue, { VNode } from 'vue';
import * as tsx from "vue-tsx-support";
import { Component, Prop, Watch } from 'vue-property-decorator';


import "medium-editor/dist/css/medium-editor.css";
import "./editor.css";
import InsertImage from './InsertImage';

export interface EditorOptions {
    options?: any;
}

@Component
export class ImagePosition extends tsx.Component<any>{

    @Prop()
    handler;

    imageSizing(sizing) {
        this.handler.currentSize = sizing
        this.handler.currentLine.className = 'editor-image ' + sizing
        this.$emit('onPositionChange')
    }

    render() {
        if (this.handler.isShow) {
            return (
                <div class="image-handler" style={this.handler.position}>
                    <div class="image-hander-menu">
                        <button class="btn-toggle" onClick={this.imageSizing.bind(null,'is-normal')}>
                            {this.handler.currentSize == 'is-normal' ?
                                <img src="../../assets/icons/image-align-normal-active.png" /> :
                                <img src="../../assets/icons/image-align-normal.png" />
                            }

                        </button>
                        <button class="btn-toggle" onClick={this.imageSizing.bind(null,'is-expand')}>
                            {this.handler.currentSize == 'is-expand' ?
                                <img src="../../assets/icons/image-align-expand-active.png" /> :
                                <img src="../../assets/icons/image-align-expand.png" />
                            }

                        </button>
                        <button class="btn-toggle" onClick={this.imageSizing.bind(null,'is-full')}>
                            {this.handler.currentSize == 'is-full' ?
                                <img src="../../assets/icons/image-align-full-active.png" /> :
                                <img src="../../assets/icons/image-align-full.png" />
                            }

                        </button>
                    </div>

                </div>

            )

        }




    }
}

    
@Component
export class InsertEmbed extends tsx.Component<any>{

    insert = {
        position: {
            top: '0',
            left: '0'
        },
        isShow: false,
        isToggle: false,
        embedElm: null,
        files: [],
        focusLine: null as HTMLElement|null
    }

    handler = {
        currentLine: null,
        currentImg: null,
        currentSize: 'is-normal',
        position: {
            top: '0'
        },
        isShow: false
    }

    insertImage = {
        currentLine: null as HTMLElement | null,
        currentImg: null as HTMLElement | null,
        currentSize: 'is-normal',
        position: {
            top: '0'
        },
        isShow: false
    }

    @Prop()
    editor;
    @Prop()
    editorRef;

    @Prop()
    uploadUrl;

    @Prop()
    onChange

    subscribe() {
        this.editor.subscribe('editableKeyup', this.detectShowToggle)
        this.editor.subscribe('editableClick', this.detectShowToggle)
        this.editor.subscribe('editableKeyup', this.detectImageDescription)
        this.editor.subscribe('editableClick', this.detectImageDescription)
    }
    unsubscribe() {
        this.editor.unsubscribe('editableKeyup', this.detectShowToggle)
        this.editor.unsubscribe('editableClick', this.detectShowToggle)
        this.editor.unsubscribe('editableKeyup', this.detectImageDescription)
        this.editor.unsubscribe('editableClick', this.detectImageDescription)
    }

    detectImageDescription() {
        const focused = this.editor.getFocusedElement()
        if (!focused) return;

        const editorImages = focused.getElementsByClassName('editor-image-description')
        for (let elm of editorImages) {
            const description = elm.innerHTML.trim()
            if (!description || description == "<br>") {
                elm.className = 'editor-image-description is-empty'
            } else {
                elm.className = 'editor-image-description'
            }
        }
    }
    detectShowToggle(e) {
        if (this.insert.isShow && this.insert.isToggle) {
            this.toggle();
        }
        if (e.keyCode == 13) {
            const focused = this.editor.getSelectedParentElement()
            const nextElm = focused.nextElementSibling
            const prevElm = focused.previousElementSibling
            if (nextElm && prevElm && nextElm.className.indexOf('editor-image-description') > -1 && prevElm.className.indexOf('editor-image') > -1) {
                nextElm.parentNode.insertBefore(nextElm, focused);
            }
        }
        this.handler.isShow = false
        if (e.target.className.indexOf('editor-image-description') <= -1) {
            const editorImages = this.editor.getFocusedElement().getElementsByClassName('editor-image')
            for (let imgElm of editorImages) {
                imgElm.className = imgElm.className.replace('is-focus', '')
            }
        }
        const currentLine = this.editor.getSelectedParentElement() as HTMLElement;
        const outerHtml = currentLine.outerHTML
        const isList = outerHtml.indexOf('<li>') > -1
        const content = currentLine.innerHTML.replace(/^(<br\s*\/?>)+/, '').trim()
        if (content || isList) {
            // Not show toggle if focus line has content & list
            this.insert.isShow = false
            this.insert.isToggle = false
            this.insert.focusLine = null
        } else {
            console.log(currentLine);
            const currentPos = currentLine.getBoundingClientRect();
            if (currentPos) {
                console.log(currentPos);
                let half = currentPos.height > 28 ? (currentPos.height - 28)/2  : 0;


                this.insert.position.top = (currentPos.top + half) + 'px'
                this.insert.position.left = currentPos.left + 'px'
                this.insert.isShow = true
                this.insert.focusLine = currentLine
            }
        }
    }
    toggle() {
        this.insert.isToggle = !this.insert.isToggle;
    }
    imageClickHandler(value) {
        this.handler = value
    }
    uploadCallback(url) {
        this.$emit('uploaded', url)
    }



    handleScroll() {
        this.handler.isShow = false
        if (this.insert.isShow) {
            const currentLine = this.editor.getSelectedParentElement()
            const currentPos = currentLine.getBoundingClientRect()
            this.insert = {
                ...this.insert,
                isShow: true,
                focusLine: currentLine,
                position: {
                    top: currentPos.top + 'px',
                    left: currentPos.left + 'px'
                }
            }
        }
    }

    mounted() {
        this.subscribe();
        this.initializeExisting();
        this.$on("imageClick", this.imageClickHandler);
    }
    destroyed() {
        this.unsubscribe();
        this.$off("imageClick", this.imageClickHandler);
    }
    beforeMount() {

        window.addEventListener('scroll', this.handleScroll);
    }
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    inputFilter(newFile, oldFile, prevent) {
        
        if (newFile && !oldFile) {
            if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
                return prevent()
            }
            if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
                return prevent()
            }
        }
    }
    inputFile(newFile, oldFile) {
        console.log(arguments);
        console.log(JSON.stringify(newFile))
        console.log(JSON.stringify(oldFile))
        if (newFile && !oldFile) {
            //@ts-ignore
            this.$refs.upload.active = true
        }

        // Image Upload Successful
        if (newFile && newFile.success) {
            console.log(newFile);
            var reader = new FileReader();
            reader.addEventListener("load",  ()=> {
              //  preview.src = ;
                this.addImage(reader.result)
            }, false);
            reader.readAsDataURL(newFile.file);
           
        }
    }
    initializeExisting() {
        const handlerVm = this;
        setTimeout(() => {
            const focused = this.editor.getFocusedElement()
            if (!focused) return false;

            const editorImages = focused.getElementsByClassName('editor-image')
            for (let elm of editorImages) {
                // Set Onclick to Show Image Size Handler
                elm.onclick = function () {
                    setTimeout(() => {
                        handlerVm.sizingHandler(this)
                    })
                }
            }
        })
    }
    sizingHandler(elm) {
        const className = elm.className
        elm.className = className.replace('is-focus', '') + ' is-focus'
        if (className.indexOf('expand') > -1) {
            this.insertImage.currentSize = 'is-expand'
        } else if (className.indexOf('full') > -1) {
            this.insertImage.currentSize = 'is-full'
        } else {
            this.insertImage.currentSize = 'is-normal'
        }
        const img = elm.querySelector('img')
        this.insertImage.currentLine = elm;
        this.insertImage.isShow = true;
        const currentPos = img.getBoundingClientRect();
        this.insertImage.position.top = currentPos.top + 'px'
        this.$emit('imageClick', {
            position: this.insertImage.position,
            currentLine: this.insertImage.currentLine,
            isShow: this.insertImage.isShow,
            currentSize: this.insertImage.currentSize
        })
    }
    addImage(url) {
        console.log(url);
        this.$emit('uploaded', url);
        if (this.insert.isToggle) {
            const handlerVm = this
            this.editorRef.focus()
            this.editor.selectElement(this.insert.focusLine)
            this.editor.pasteHTML(`<div class="editor-image">
                        <img src="${url}" />
                    </div>
                    <div class="editor-image-description"><br></div>
                    <br />`, { cleanAttrs: [], cleanTags: [], unwrapTags: [] })
            this.insertImage.currentLine = this.editor.getSelectedParentElement().previousElementSibling.previousElementSibling;
            if (this.insertImage.currentLine) {
                this.insertImage.currentImg = this.insertImage.currentLine.querySelector('img')
                if (this.insertImage.currentImg) {
                    const currentPos = this.insertImage.currentImg.getBoundingClientRect();
                    window.scrollTo(0, currentPos.top - currentPos.left);
                    this.insertImage.currentLine.onclick = function () {
                        console.log("clicking")
                        setTimeout(() => {
                            handlerVm.sizingHandler(this)
                        })
                    }
                    this.insert.isShow = false;
                }
            }
        }
    }
    test(e: Event) {

        e.preventDefault();
        //@ts-ignore
        this.$refs.upload.$children[0].$el.click();
    }
    fab = false;
    fabOnHover = false;
    render() {
        console.log("EDITOR RENDER")
        return (
            <div class="image-handler-container">
                <file-upload

                    ref="upload"
                    class="btn-toggle"
                    extensions="gif,jpg,jpeg,png,webp"
                    accept="image/png,image/gif,image/jpeg,image/webp"
                    custom-action={this.uploadUrl}
                    multiple={true}
                    size={1024 * 1024 * 10} v-model={this.insert.files}

                    oninput-filter={this.inputFilter}
                    oninput-file={this.inputFile}
                >
                </file-upload>

                    


                 
                <div class="insert-image-container" v-show={this.insert.isShow} style={this.insert.position}>
                    <v-speed-dial v-model={this.fab} open-on-hover={this.fabOnHover} direction="bottom">
                        <template slot="activator">
                            <v-btn color="blue darken-2" dark small fab onClick={this.toggle} >
                                {this.fab ? <v-icon>close</v-icon> : <v-icon>add</v-icon>}
                            </v-btn>
                        </template>
                       
                        <v-btn
                            fab
                            dark
                            small
                            color="indigo" nativeOnClick={this.test}
                        >
                            <v-icon>mdi-image-multiple</v-icon>
                        </v-btn>
              
                        <v-btn
                            fab
                            dark
                            small
                            color="indigo"  
                        >
                            <v-icon>mdi-video-image</v-icon>
                        </v-btn>
                        <v-btn
                            fab
                            dark
                            small
                            color="indigo"
                        >
                            <v-icon>mdi-code-tags</v-icon>
                        </v-btn>
                    </v-speed-dial>
                </div>

                <ImagePosition handler={this.handler} positionChange={this.onChange} />
            </div>
        )
    }
}


@Component
export default class Editor extends tsx.Component<EditorOptions>{


    //data
    editor: any | null = null ;

    defaultOptions = {
        forcePlainText: false,
        anchorPreview: {
            /* These are the default options for anchor preview,
               if nothing is passed this is what it used */
            hideDelay: 500,
            previewValueSelector: 'a'
        },
        placeholder: false,
       
        toolbar: {
            static: false,
            buttons: ["bold", "italic", "quote", "h1", "h2", "h3", "h4", "h5", 'anchor']
        },
        autoLink: true,
        anchor: {
            /* These are the default options for anchor form,
               if nothing is passed this is what it used */
            customClassOption: null,
            customClassOptionText: 'Button',
            linkValidation: false,
            placeholderText: 'Paste or type a link',
            targetCheckbox: false,
            targetCheckboxText: 'Open in new window'
        }
    };
    hasContent = true;

    //Props
    @Prop()
    options;

    @Prop()
    onChange;
    @Prop()
    prefill;

    @Prop({ default: false })
    readOnly;

    //Computed
    get editorOptions() {
        return Object.assign(this.defaultOptions, this.options);
    }
    get editorClass() {
        return {
            'has-content': this.hasContent,
            'editor': true
        }
    }

    triggerChange() {
        const content = this.editor.getContent();
        setTimeout(() => {
            if (/<[a-z][\s\S]*>/i.test(content)) {
                this.hasContent = true;
            } else {
                this.hasContent = false;
            }
        }, 0);
        this.$emit("input", content);
        if (this.onChange) {
            this.onChange(content);
        }
    }

    //lifecycle

    created() {

    }
    async mounted() {
        if (process.client) {
            const { default: MediumEditor } = await import('medium-editor');
            const { MediumEditorMultiPlaceholders } = await import("../plugins/editor");
            console.log(MediumEditor)

            let ops = {
                
                extensions: {
                    'multi_placeholder': new MediumEditorMultiPlaceholders({
                        placeholders: [
                            {
                                tag: 'h1',
                                text: 'Title'
                            },
                            {
                                tag: 'p',
                                text: 'Tell your story...'
                            }
                        ]
                    })
                }
            }

            this.editor = new MediumEditor(this.$refs.editor, Object.assign( this.editorOptions,ops));
        }
    }

    render() {


        return (
            <v-container fluid>
                <v-row>
                    <v-col cols="12" sm="12">
                        
                                <div class="medium-editor-container">

                            {this.editor && <InsertEmbed editorRef={this.$refs.editor} uploadUrl={this.options.uploadUrl} editor={this.editor} onChange={this.triggerChange} />}

                            <div ref="editor" class={ this.editorClass }> </div>
                                </div>
                          
                    </v-col>
                </v-row>
            </v-container>

        )

    }
}

