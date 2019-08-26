
import Vue, { VNode } from 'vue';
import * as tsx from "vue-tsx-support";
import { Component, Prop, Watch } from 'vue-property-decorator';



@Component
export default class InsertImage extends tsx.Component<any>{
    @Prop()
    uploadUrl;
    @Prop()
    insert;
    @Prop()
    handler;
    @Prop()
    editor;

    inputFilter(newFile, oldFile, prevent) {
        console.log("A");
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
        console.log("A");
        if (newFile && !oldFile) {
            //@ts-ignore
            this.$refs.upload.active = true
        }

        // Image Upload Successful
        if (newFile && newFile.success) {
            this.addImage(newFile.response.url)
        }
    }
    addImage(url) {
        console.log(url);
    }
    test(e: Event) {

        e.preventDefault();
        this.$refs.upload.$children[0].$el.click();
    }
    input() {
        console.log(arguments);
    }
    render() {
        console.log("B");
        return (<div>

            <v-btn
                fab
                dark
                small
                color="indigo" nativeOnClick={this.test}
            >
                <v-icon>mdi-image-multiple</v-icon>
            </v-btn></div>
            );
    }
}