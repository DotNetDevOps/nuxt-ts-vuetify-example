import Vue, { VNode } from 'vue';
import * as tsx from "vue-tsx-support";
import { Component, Prop, Watch } from 'vue-property-decorator';


export interface EditorPageOptions {

}


@Component
export default class EditorPage extends tsx.Component<EditorPageOptions>{

    render() {


        return (
           <div>Hello world2</div>
        )

    }
}