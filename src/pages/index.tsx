import Vue, { VNode } from 'vue';
import * as tsx from "vue-tsx-support";
import { Component, Prop, Watch } from 'vue-property-decorator';
import Editor from '../components/editor';

export interface EditorPageOptions {

}


@Component
export default class EditorPage extends tsx.Component<EditorPageOptions>{


    options = {
        uploadUrl: async (file, component) => {
            console.log(file);
            console.log(component);
            return {"response":"hello world"};
        }
    }
 
    render() {


        return (
            <Editor options={this.options} />
        )

    }
}